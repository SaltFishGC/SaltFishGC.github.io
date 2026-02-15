---
title: Common模块的注意事项
date: 2026-2-10
---

在微服务架构中，**`common` 模块（或叫 `shared` / `core` / `api`）** 是多个服务共享的代码库，用于避免重复定义。虽然它能提升开发效率，但**设计不当会严重破坏微服务的自治性、独立部署性和技术异构性**。

### 推荐存放在common模块的内容

| 类型                       | 示例                                | 说明                                              |
| :------------------------- | :---------------------------------- | :------------------------------------------------ |
| **DTO / API 契约（接口）** | `UserDTO`, `OrderRequest`           | 用于服务间调用的接口数据结构（配合 OpenAPI/gRPC） |
| **枚举常量**               | `OrderStatus.PENDING`               | 全局一致的状态码、类型码                          |
| **工具类（无依赖）**       | `IdUtil`, `DateUtils`               | 纯函数，不依赖 Spring 或外部配置                  |
| **自定义异常**             | `BizException`, `NotFoundException` | 统一异常体系（需谨慎）                            |
| **注解（元数据）**         | `@AuditLog`, `@Sensitive`           | 仅声明，无实现逻辑                                |
| **gRPC/Protobuf 生成代码** | `*.proto` 编译后的 Java 类          | 服务间通信的强契约                                |

> 💡 这些内容的特点：**无状态、无外部依赖、变更频率极低**。



### 需要注意的使用场景

#### pom引入依赖最小化-作用域provided

在引入依赖时尽量避免引入**可能不是必定需要**的依赖，即便引入也注意作用域，可以使用provided如：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-core</artifactId>
    <version>${mybatis-plus.version}</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-extension</artifactId>
    <version>${mybatis-plus.version}</version>
    <scope>provided</scope>
</dependency>
```

通过指定作用域为`<scope>provided</scope>`来保证：**“该依赖在编译和测试时需要，但在运行时由 JDK 或容器（如 Tomcat、Spring Boot 内嵌容器）提供，因此不会被打包进最终的可执行 JAR/WAR。”**

| 阶段                | 是否包含`provided`依赖             |
| :------------------ | :--------------------------------- |
| **编译（compile）** | ✅ 包含（代码能正常编译）           |
| **测试（test）**    | ✅ 包含（单元测试能运行）           |
| **运行（runtime）** | ❌ **不包含**（假设运行环境已提供） |
| **打包（package）** | ❌ **不包含**（不会打进 JAR/WAR）   |

> | Scope             | 编译 | 测试 | 运行 | 打包 | 典型用途                  |
> | :---------------- | :--- | :--- | :--- | :--- | :------------------------ |
> | `compile`（默认） | ✅    | ✅    | ✅    | ✅    | 普通依赖（如 Guava）      |
> | `provided`        | ✅    | ✅    | ❌    | ❌    | Servlet API, Lombok       |
> | `runtime`         | ❌    | ✅    | ✅    | ✅    | JDBC 驱动（编译只需接口） |
> | `test`            | ❌    | ✅    | ❌    | ❌    | JUnit, Mockito            |
> | `system`          | ✅    | ✅    | ❌    | ❌    | 本地 JAR（不推荐）        |

这样我们就可以在common模块写其的配置等但不会报错，有项目**引入这些依赖会报错的**只需要在**自己的项目pom中不引入该依赖**就不会发生冲突！



#### 引入公共配置Configuration

当**需要统一管理多模块的一些配置Bean**时，我们可以考虑将配置类放到common中，但注意必须是**多模块中对应配置绝对得统一**才行，**如有可能会出现个性化配置的需求那么就避免使用common管理配置Bean！**

> 若有多个相同配置类，则会合并：**Spring Boot 会自动发现并注册所有符合条件的 `WebMvcConfigurer` Bean（包括 common 模块中的），并将它们的配置「合并执行」——顺序不确定，但通常按类名排序。**其他Bean同理。

那么在这时候我们会发现在common模块下写的配置类的包路径似乎并不会被其他引入common模块的模块启动类扫描到！这时候我们就需要通知其他模块，让他们扫描到这个包，获取其中的配置类并注入Bean到上下文中。那么这里我们有几种方法来实现这个通知：

##### **通过** `spring.factories` **实现自动装配**

 **▶ Spring Boot 2.x：**

在 `common` 模块的 `src/main/resources/META-INF/spring.factories` 中添加：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.yourcompany.common.config.CommonWebConfig
```

 **▶ Spring Boot 3.x（推荐新方式）：**

在 `common` 模块的 `src/main/resources/META-INF/spring/` 目录下创建文件：

```
org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

内容为（每行一个配置类）：

```
com.yourcompany.common.config.CommonWebConfig
```

> 💡 注意：**文件名是固定的，不能改！路径必须是 `META-INF/spring/`**
>
> **Spring Boot 2.x 中使用的 `META-INF/spring.factories` 配置方式在 Spring Boot 3.x 中仍然兼容可用**，但 **官方已标记为“遗留（legacy）”方式，并推荐迁移到新的 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 格式**。

**✅ 效果：**

- 启动时，Spring Boot 自动发现并加载 `CommonWebConfig`；
- `MyCommonService` Bean 被注入到 ApplicationContext；
- **无需任何额外注解或扫描配置！**

----

##### **使用** `@ComponentScan` **显式指定包（不推荐）**

```java
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.yourcompany.service",      // 本服务包
    "com.yourcompany.common.config" // common 配置包
})
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

**❌ 缺点：**

- **侵入性强**：每个服务都要改启动类；
- **耦合度高**：服务要知道 common 的内部包结构；
- **易出错**：漏写就失效；
- **违背“自动装配”理念**。

> 🚫 仅在临时调试或无法修改 common 模块时使用。

----

##### **使用** `@Import` **手动导入（折中）**

在每个服务的配置类中显式导入：

```java
@Configuration
@Import(CommonWebConfig.class)
public class LocalConfig {
}
```

或直接在启动类上：

```java
@SpringBootApplication
@Import(CommonWebConfig.class)
public class OrderServiceApplication { ... }
```

**⚠️ 缺点：**

- 仍需每个服务手动导入；
- 如果 common 有多个配置类，要逐个 import；
- 不如自动装配“无感”。

----

##### **条件化自动装配（Conditional Auto-config）**

我们在装配一些**统一配置类**的时候由于导入对应的依赖**作用域是provided的**（由于冲突等问题希望在运行时不一起启用），这时候就需要条件化自动装配：

比如springcloud的**Gateway**，他就是以**webflux**实现的，这时候如果导入**mvc**就会导致冲突，但是我们在common又配置了MvcConfig（需要准备一个**统一拦截器**）而且其他在common的依赖又确实需要，我们懒得后续再统一修改，那么我们就需要：

1. 在common的pom中修改springmvc的**作用域**为`<scope>provided</scope>`以保证springmvc首先不会在Gateway运行时作用。
2. 修改配置文件，条件化自动配置，当运行时没有这个依赖时就不会装载这个Configuration类：

```java
@Configuration
@ConditionalOnClass(DispatcherServlet.class)
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new UserInfoInterceptor());
    }
}
```

其中`DispatcherServlet.class`为mvc的关键类，没有这个类说明没有引入mvc，则不装载该配置Configuration，对mybatisplus也是同理（分页需要额外Configuration配置）



### 与父项目的区别

| 维度                     | 父项目（Parent POM）                     | `common`模块                            |
| :----------------------- | :--------------------------------------- | :-------------------------------------- |
| **本质**                 | **Maven 构建配置的继承模板**             | **可被依赖的 Java 代码库**              |
| **是否生成 JAR**         | ❌ 不生成（`<packaging>pom</packaging>`） | ✅ 生成（`<packaging>jar</packaging>`）  |
| **是否被其他模块“依赖”** | ❌ 通过 `<parent>` 继承（不是依赖）       | ✅ 通过 `<dependency>` 引入              |
| **包含内容**             | 依赖版本、插件配置、属性定义             | Java 类、工具类、DTO、配置类等          |
| **运行时是否存在**       | ❌ 仅构建时生效                           | ✅ 打包进最终应用（除非 scope=provided） |

#### 父模块作用：统一构建规范

- 定义所有子模块共用的：
  - **依赖版本**（通过 `<dependencyManagement>`）
  - **Maven 插件版本与配置**（如编译插件、打包插件）
  - **Java 版本、编码格式等属性**
  - **仓库地址、许可证信息等元数据**

```xml
<!-- parent/pom.xml -->
<project>
  <groupId>com.example</groupId>
  <artifactId>myapp-parent</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging> <!-- 关键：类型是 pom -->

  <modules>
    <module>common</module>
    <module>user-service</module>
    <module>order-service</module>
  </modules>

  <properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.0</spring-boot.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${spring-boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

子项目即可省略版本号

```xml
<!-- user-service/pom.xml -->
<project>
  <parent>
    <groupId>com.example</groupId>
    <artifactId>myapp-parent</artifactId>
    <version>1.0.0</version>
  </parent>

  <dependencies>
    <!-- 可省略版本号，由 parent 统一管理 -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  </dependencies>
</project>
```

> 💡 **父项目不包含任何 Java 代码！它只是“构建说明书”。**



#### common模块作用：共享可重用的 Java 代码

- 包含多个微服务都需要的：
  - 工具类（`DateUtils`, `IdGenerator`）
  - DTO / VO / Enum（`UserDTO`, `OrderStatus`）
  - 自定义异常（`BizException`）
  - 自动装配配置类（需配合 `spring.factories`）

```
                      ┌──────────────┐
                      │  Parent POM  │ ←─ 定义“怎么构建”
                      │ (myapp-parent)│
                      └──────┬───────┘
                             │ 继承（<parent>）
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐ ┌─────────▼────────┐ ┌────────▼────────┐
│   common      │ │  user-service    │ │  order-service  │
│ (shared code) │ │                  │ │                 │
└───────┬───────┘ └──────────────────┘ └─────────────────┘
        │ 依赖（<dependency>）
        └───────────────┐
                        ▼
             user-service 使用 common 中的代码
```

