import{b as n,c as a,d as e,o as l}from"./app-9EpopRw3.js";const i={};function t(p,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="环境隔离" tabindex="-1"><a class="header-anchor" href="#环境隔离"><span>环境隔离</span></a></h2><p>在学习Nacos的<strong>配置中心</strong>的时候，我们会使用一套<strong>命名空间（namespace）：分组（group）<strong>的隔离空间，其实Nacos的</strong>注册中心</strong>也使用了这么一套隔离空间，这样我们就可以在开发环境，测试环境，生产环境使用一个Nacos注册中心，只需要准备好namespace以及group并指定好服务的空间即可。</p><h3 id="配置流程" tabindex="-1"><a class="header-anchor" href="#配置流程"><span>配置流程</span></a></h3><p><strong>创建命名空间</strong>：只需要到Nacos的web可视化界面里创建需要的命名空间即可</p><p><strong>获取命名空间ID</strong>：完成创建之后可以看到Nacos分配给新命名空间的ID，记录下来</p><p><strong>服务中指明注册中心的命名空间</strong>：在yml配置中的discovery项下加入namespace项，并指定<strong>命名空间的ID</strong></p><div class="language-YAML line-numbers-mode" data-highlighter="prismjs" data-ext="YAML" data-title="YAML"><pre><code><span class="line">spring:</span>
<span class="line">  application:</span>
<span class="line">    name: item-service # 服务名称</span>
<span class="line">  profiles:</span>
<span class="line">    active: dev</span>
<span class="line">  cloud:</span>
<span class="line">    nacos:</span>
<span class="line">      server-addr: 192.168.150.101 # nacos地址</span>
<span class="line">      discovery: # 服务发现配置</span>
<span class="line">        namespace: 8c468c63-b650-48da-a632-311c75e6d235 # 设置namespace，必须用id</span>
<span class="line">      # 。。。略</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>必须指定<strong>命名空间ID</strong>！而不是命名空间的name！ 一个服务实例的<strong>注册中心</strong>只能指定一个命名空间！</p><p>但是配置中心和注册中心的可以分别是两个：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token comment"># application.yml 或 bootstrap.yml</span></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">nacos</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment"># ===== 注册中心配置 =====</span></span>
<span class="line">      <span class="token key atrule">discovery</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> 127.0.0.1<span class="token punctuation">:</span><span class="token number">8848</span></span>
<span class="line">        <span class="token key atrule">namespace</span><span class="token punctuation">:</span> dev<span class="token punctuation">-</span>ns<span class="token punctuation">-</span>id          <span class="token comment"># 服务注册到 dev 命名空间</span></span>
<span class="line">        <span class="token key atrule">service</span><span class="token punctuation">:</span> user<span class="token punctuation">-</span>service</span>
<span class="line">        <span class="token key atrule">group</span><span class="token punctuation">:</span> DEFAULT_GROUP</span>
<span class="line">        </span>
<span class="line">      <span class="token comment"># ===== 配置中心配置 =====</span></span>
<span class="line">      <span class="token key atrule">config</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> 127.0.0.1<span class="token punctuation">:</span><span class="token number">8848</span></span>
<span class="line">        <span class="token key atrule">namespace</span><span class="token punctuation">:</span> common<span class="token punctuation">-</span>ns<span class="token punctuation">-</span>id       <span class="token comment"># 配置从 common 命名空间读取</span></span>
<span class="line">        <span class="token key atrule">file-extension</span><span class="token punctuation">:</span> yaml</span>
<span class="line">        <span class="token key atrule">share-configs</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token punctuation">-</span> <span class="token key atrule">data-id</span><span class="token punctuation">:</span> shared<span class="token punctuation">-</span>common.yaml</span>
<span class="line">            <span class="token key atrule">group</span><span class="token punctuation">:</span> DEFAULT_GROUP</span>
<span class="line">            <span class="token key atrule">refresh</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h2 id="服务分级模型" tabindex="-1"><a class="header-anchor" href="#服务分级模型"><span>服务分级模型</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────┐</span>
<span class="line">│                    Namespace（命名空间）                      │</span>
<span class="line">│                    环境隔离级别（最高级）                      │</span>
<span class="line">│  ┌───────────────────────────────────────────────────────┐   │</span>
<span class="line">│  │                  Group（分组）                         │   │</span>
<span class="line">│  │                  业务分组级别                          │   │</span>
<span class="line">│  │  ┌─────────────────────────────────────────────────┐  │   │</span>
<span class="line">│  │  │              Service（服务）                     │  │   │</span>
<span class="line">│  │  │              服务名称级别                        │  │   │</span>
<span class="line">│  │  │  ┌───────────────────────────────────────────┐  │  │   │</span>
<span class="line">│  │  │  │          Cluster（集群）                   │  │  │   │</span>
<span class="line">│  │  │  │          机房/区域级别                     │  │  │   │</span>
<span class="line">│  │  │  │  ┌─────────────┐  ┌─────────────┐        │  │  │   │</span>
<span class="line">│  │  │  │  │  Instance   │  │  Instance   │        │  │  │   │</span>
<span class="line">│  │  │  │  │  实例1       │  │  实例2      │        │  │  │   │</span>
<span class="line">│  │  │  │  └─────────────┘  └─────────────┘        │  │  │   │</span>
<span class="line">│  │  │  └───────────────────────────────────────────┘  │  │   │</span>
<span class="line">│  │  └─────────────────────────────────────────────────┘  │   │</span>
<span class="line">│  └───────────────────────────────────────────────────────┘   │</span>
<span class="line">└─────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Nacos 注册中心采用 <strong>四级分层架构</strong> 来组织和管理微服务实例，从大到小依次为：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">Namespace（命名空间） → Group（分组） → Service（服务） → Cluster/Instance（集群/实例）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>内部维护的Map源码：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│                      Nacos Server 注册表                         │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│  Map&lt;Namespace,                                                 │</span>
<span class="line">│    Map&lt;Group,                                                   │</span>
<span class="line">│      Map&lt;ServiceName,                                           │</span>
<span class="line">│        Service {                                                │</span>
<span class="line">│          Map&lt;ClusterName, Cluster {                             │</span>
<span class="line">│            List&lt;Instance&gt;  ← 实例列表                            │</span>
<span class="line">│          }&gt;                                                     │</span>
<span class="line">│        }&gt;                                                       │</span>
<span class="line">│    &gt;                                                            │</span>
<span class="line">│  &gt;                                                              │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th style="text-align:left;">类名</th><th style="text-align:left;">作用</th></tr></thead><tbody><tr><td style="text-align:left;"><code>Service</code></td><td style="text-align:left;">服务元数据，包含服务名、分组、保护阈值等</td></tr><tr><td style="text-align:left;"><code>Cluster</code></td><td style="text-align:left;">集群信息，包含集群名、健康检查配置等</td></tr><tr><td style="text-align:left;"><code>Instance</code></td><td style="text-align:left;">实例信息，包含IP、端口、权重、健康状态等</td></tr></tbody></table><blockquote><p>微服务实例在不同隔离环境下的相互调用：</p><table><thead><tr><th style="text-align:left;">场景</th><th style="text-align:left;">是否可以直接调用</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>同一命名空间 + 同一分组</strong></td><td style="text-align:left;">✅ 可以</td><td style="text-align:left;">默认行为，无需额外配置</td></tr><tr><td style="text-align:left;"><strong>同一命名空间 + 不同分组</strong></td><td style="text-align:left;">⚠️ 可以，但需指定分组</td><td style="text-align:left;">需要在调用时明确指定目标分组</td></tr><tr><td style="text-align:left;"><strong>不同命名空间 + 任意分组</strong></td><td style="text-align:left;">❌ 不可以</td><td style="text-align:left;">命名空间是强隔离，默认无法发现</td></tr></tbody></table></blockquote><h3 id="服务集群" tabindex="-1"><a class="header-anchor" href="#服务集群"><span>服务集群</span></a></h3><p><strong>误解：<strong>Service 下面的所有实例 = 一个集群</strong>❌</strong></p><p><strong>实际结构：</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">Service（服务）</span>
<span class="line">├─ Cluster A（集群A）</span>
<span class="line">│   ├─ 实例1</span>
<span class="line">│   ├─ 实例2</span>
<span class="line">│   └─ 实例3</span>
<span class="line">├─ Cluster B（集群B）</span>
<span class="line">│   ├─ 实例4</span>
<span class="line">│   ├─ 实例5</span>
<span class="line">│   └─ 实例6</span>
<span class="line">└─ Cluster C（集群C）</span>
<span class="line">    ├─ 实例7</span>
<span class="line">    └─ 实例8</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么需要再嵌套一次集群？</p><p><strong>核心目的：就近调用 + 故障隔离</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│                        user-service                             │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│   ┌─────────────────────┐      ┌─────────────────────┐         │</span>
<span class="line">│   │  Cluster: HANGZHOU  │      │  Cluster: SHANGHAI  │         │</span>
<span class="line">│   │  (杭州机房)          │      │  (上海机房)          │         │</span>
<span class="line">│   ├─────────────────────┤      ├─────────────────────┤         │</span>
<span class="line">│   │  192.168.1.10:8080  │      │  192.168.2.10:8080  │         │</span>
<span class="line">│   │  192.168.1.11:8080  │      │  192.168.2.11:8080  │         │</span>
<span class="line">│   │  192.168.1.12:8080  │      │  192.168.2.12:8080  │         │</span>
<span class="line">│   └─────────────────────┘      └─────────────────────┘         │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>调用规则：</strong></p><ul><li>杭州的消费者 → 优先调用杭州集群</li><li>上海的消费者 → 优先调用上海集群</li><li>某机房故障 → 自动切换到另一机房</li></ul><p>如果不分集群：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│                        user-service                             │</span>
<span class="line">│                    (没有 Cluster 分层)                           │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│   192.168.1.10:8080 (杭州)    192.168.2.10:8080 (上海)           │</span>
<span class="line">│   192.168.1.11:8080 (杭州)    192.168.2.11:8080 (上海)           │</span>
<span class="line">│   192.168.1.12:8080 (杭州)    192.168.2.12:8080 (上海)           │</span>
<span class="line">│                                                                 │</span>
<span class="line">│   ❌ 问题：杭州消费者可能调用到上海实例，增加网络延迟      	         │</span>
<span class="line">│   ❌ 问题：杭州机房故障，无法快速隔离，影响上海机房          		      │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>方便LoadBalancer负载均衡策略，<strong>对实例进行更细粒度的分组管理</strong></p></blockquote>`,28)])])}const d=n(i,[["render",t]]),r=JSON.parse('{"path":"/docs/SpingCloud/bagu/4.zhucezhongxin.html","title":"注册中心","lang":"en-US","frontmatter":{"title":"注册中心","date":"2026-2-17"},"headers":[{"level":2,"title":"环境隔离","slug":"环境隔离","link":"#环境隔离","children":[{"level":3,"title":"配置流程","slug":"配置流程","link":"#配置流程","children":[]}]},{"level":2,"title":"服务分级模型","slug":"服务分级模型","link":"#服务分级模型","children":[{"level":3,"title":"服务集群","slug":"服务集群","link":"#服务集群","children":[]}]}],"git":{"createdTime":1780464568000,"updatedTime":1780464568000,"contributors":[{"name":"SaltFishGC","email":"130335482+SaltFishGC@users.noreply.github.com","commits":1}]},"filePathRelative":"docs/SpingCloud/八股/4.注册中心.md"}');export{d as comp,r as data};
