---
title: 对RedisUtil的更新
date: 2025-12-22
---

### 反序列化以及序列化

原本的序列化管理器：

```java
@Configuration
public class RedisConfig<V> {

    @Bean("redisTemplate")
    public RedisTemplate<String, V> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, V> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // 设置 key 的序列化方式为字符串（可读）
        template.setKeySerializer(RedisSerializer.string());

        // 设置 value 的序列化方式为 JSON（支持对象存储）
        template.setValueSerializer(RedisSerializer.json());

        // 设置 hash 结构中 key 的序列化方式为字符串
        template.setHashKeySerializer(RedisSerializer.string());

        // 设置 hash 结构中 value 的序列化方式为 JSON
        template.setHashValueSerializer(RedisSerializer.json());

        // 初始化完成后调用，确保配置生效
        template.afterPropertiesSet();

        return template;
    }
```

这里的RedisTemplate会尝试截取所有通过自动注入获取到的RedisTemplate（`StringRedisTemplate`不会受影响），并设置其的序列化为RedisSerializer，在这里的操作为将所有value变成json格式的序列化，当然获取时的反序列化就是返回value的json中存储的指定类

这种方式有好有坏，好处是自动配置通过`@Autoweird`注入的redisTemplate，只管用即可，不用管传入object类型：

```java
public boolean set(String key, Object value) {
    try {
        redisTemplate.opsForValue().set(key, value);
        return true;
    } catch (Exception e) {
        log.error(key, e);
        return false;
    }
}
```

坏处是redis会存储指定的反序列化对象路径，占用一定的内存。

那么，我们是否也可以考虑自己配置序列化以及反序列化，封装到一个Utils里面呢？

答案是肯定的，我们完全可以通过**泛型**来实现一个RedisUtils，以String类型数据为例：

```java
/**
 * 设置缓存
 * @param key 缓存键
 * @param value 缓存值
 * @param time 缓存时间
 * @param unit 时间单位
 */
public void set(String key, Object value, Long time, TimeUnit unit) {
    stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value), time, unit);
}
```

```java
/**
 * 获取缓存
 * @param key 缓存键
 * @param type 缓存值类型
 * @return 缓存值
 */
public <T> T get(String key, Class<T> type) {
    String value = stringRedisTemplate.opsForValue().get(key);
    return JSONUtil.toBean(value, type);
}
```

以此封装一个解决了一些通用问题的类：

```java
/**
 * 缓存穿透
 *
 * @param keyPrefix  前缀
 * @param id         id
 * @param type       类型
 * @param dbFallback 数据库查询方法
 * @param time       缓存时间
 * @param unit       时间单位
 * @return 缓存值
 */
public <R, ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) throws BusinessException {
    // redis 缓存
    String json = stringRedisTemplate.opsForValue().get(keyPrefix + id);
    // 存在返回即可
    if (json != null) {
        // 判断是否为空，表示是没有，则返回错误
        if (json.isEmpty()) {
            // 全局异常捕获
            throw new BusinessException(404, "搜索对象不存在");
        }
        return JSONUtil.toBean(json, type);
    }

    // 我们不知道原本的调用方法是要你来查询什么的，只能通过其所提供的方法来获取查询方法
    // 通过Function查询数据库
    R r = dbFallback.apply(id);
    // 缓存穿透，设置空值
    if (r == null) {
        this.set(keyPrefix + id, "", time, unit);
        throw new BusinessException(404, "搜索对象不存在");
    }
    // 数据库查到了，存入缓存
    this.set(keyPrefix + id, r, time, unit);
    return r;
}
```

### 加入缓存穿透等常见业务处理

如上所示，我们保留原本对于redisTemplate的基础操作模版，加上新的针对String类型的template，其的序列化以及反序列化由hutool的JSONUtil实现，专门用于处理一些业务场景

```java
/**
 * 缓存工具类
 *
 * @author SaltFishGC
 * @since 2026/01/07
 */

@Slf4j
@Component
public class CacheUtils {

    // 线程池
    private static final ExecutorService executor = Executors.newFixedThreadPool(10);
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 设置缓存
     *
     * @param key   缓存键
     * @param value 缓存值
     * @param time  缓存时间
     * @param unit  时间单位
     */
    public void set(String key, Object value, Long time, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value), time, unit);
    }

    /**
     * 逻辑过期缓存
     *
     * @param key   缓存键
     * @param value 缓存值
     * @param time  缓存时间
     * @param unit  时间单位
     */
    public void setWithLogicExpire(String key, Object value, Long time, TimeUnit unit) {
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(time)));
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
    }

    /**
     * 获取缓存
     *
     * @param key  缓存键
     * @param type 缓存值类型
     * @return 缓存值
     */
    public <T> T get(String key, Class<T> type) {
        String value = stringRedisTemplate.opsForValue().get(key);
        return JSONUtil.toBean(value, type);
    }

    /**
     * 缓存穿透
     *
     * @param keyPrefix  前缀
     * @param id         id
     * @param type       类型
     * @param dbFallback 数据库查询方法
     * @param time       缓存时间
     * @param unit       时间单位
     * @return 缓存值
     */
    public <R, ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) throws BusinessException {
        // redis 缓存
        String json = stringRedisTemplate.opsForValue().get(keyPrefix + id);
        // 存在返回即可
        if (json != null) {
            // 判断是否为空，表示是没有，则返回错误
            if (json.isEmpty()) {
                // 全局异常捕获
                throw new BusinessException(404, "搜索对象不存在");
            }
            return JSONUtil.toBean(json, type);
        }

        // 我们不知道原本的调用方法是要你来查询什么的，只能通过其所提供的方法来获取查询方法
        // 通过Function查询数据库
        R r = dbFallback.apply(id);
        // 缓存穿透，设置空值
        if (r == null) {
            this.set(keyPrefix + id, "", time, unit);
            throw new BusinessException(404, "搜索对象不存在");
        }
        // 数据库查到了，存入缓存
        this.set(keyPrefix + id, r, time, unit);
        return r;
    }

    /**
     * 逻辑过期缓存
     *
     * @param keyPrefix  前缀
     * @param id         id
     * @param type       类型
     * @param dbFallback 数据库查询方法
     * @param time       缓存时间
     * @param unit       时间单位
     * @return 缓存值
     */
    public <R, ID> R queryByIdWithLogicExpire(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) throws BusinessException {
        // redis 缓存
        String json = stringRedisTemplate.opsForValue().get(keyPrefix + id);
        // 为空直接返回空
        if (json == null || json.isEmpty()) {
            throw new BusinessException(404, "店铺不存在");
        }
        // 命中，返回数据并检查过期时间
        RedisData redisData = JSONUtil.toBean(json, RedisData.class);
        R r = JSONUtil.toBean((JSONObject) redisData.getData(), type);
        LocalDateTime expireTime = redisData.getExpireTime();
        // 未过期，直接返回
        if (expireTime.isAfter(LocalDateTime.now())) {
            return r;
        }
        // 过期，需要申请一个线程以异步重建缓存
        // 获取锁
        if (lock(keyPrefix + id, 10L, TimeUnit.SECONDS)) {
            // 获取锁成功，则开始重建缓存
            executor.submit(() -> {
                try {
                    // 通过外部调用提供的方法查询数据库
                    R r1 = dbFallback.apply(id);
                    // 写回缓存
                    this.setWithLogicExpire(keyPrefix + id, r1, time, unit);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    // 释放锁
                    unlock(keyPrefix + id);
                }
            });
        }
        // 成功失败与否，都直接返回旧结果
        return r;
    }

    /**
     * 获取锁
     *
     * @param key  锁id
     * @param time 时间
     * @param unit 时间单位
     * @return 是否成功获取锁
     */
    private boolean lock(String key, Long time, TimeUnit unit) {
        // 拆箱防止出现空指针问题
        Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", time, unit);
        return BooleanUtil.isTrue(flag);
    }

    /**
     * 释放锁
     *
     * @param key 锁id
     */
    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }
}
```



### 加入lock等分布式锁相关方法
