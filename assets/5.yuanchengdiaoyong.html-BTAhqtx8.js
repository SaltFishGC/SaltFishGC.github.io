import{ar as s,as as a,ax as e,at as l}from"./app-C-lYtQv9.js";const i={};function p(c,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="负载均衡流程" tabindex="-1"><a class="header-anchor" href="#负载均衡流程"><span>负载均衡流程</span></a></h2><p>我们知道微服务间远程调用都是有OpenFeign帮我们完成的，甚至帮我们实现了服务列表之间的负载均衡。但具体负载均衡的规则是什么呢？何时做的负载均衡呢？</p><p>在SpringCloud的早期版本中，负载均衡都是有Netflix公司开源的<strong>Ribbon</strong>组件来实现的，甚至Ribbon被直接集成到了Eureka-client和Nacos-Discovery中。</p><p>但是自SpringCloud2020版本开始，已经弃用Ribbon，改用Spring自己开源的<strong>Spring Cloud LoadBalancer</strong>了，我们使用的OpenFeign的也已经与其整合。</p><table><thead><tr><th style="text-align:left;">Spring Cloud 版本</th><th style="text-align:left;">默认负载均衡策略</th></tr></thead><tbody><tr><td style="text-align:left;">2020.x 之前</td><td style="text-align:left;">Ribbon（轮询）</td></tr><tr><td style="text-align:left;">2020.x 及之后</td><td style="text-align:left;">Spring Cloud LoadBalancer（轮询）</td></tr></tbody></table><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│              Spring Cloud LoadBalancer 架构                      │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ┌─────────────┐                                                │</span>
<span class="line">│  │  OpenFeign  │                                                │</span>
<span class="line">│  └──────┬──────┘                                                │</span>
<span class="line">│         ↓                                                       │</span>
<span class="line">│  ┌─────────────────────────────────────────────────────────┐    │</span>
<span class="line">│  │           Spring Cloud LoadBalancer                     │    │</span>
<span class="line">│  │  ┌───────────────┐    ┌───────────────────────────────┐ │    │</span>
<span class="line">│  │  │ LoadBalancer  │ →  │ ServiceInstanceListSupplier   │ │    │</span>
<span class="line">│  │  │ (选择策略)     │    │ (从注册中心获取实例列表)          │ │    │</span>
<span class="line">│  │  └───────────────┘    └───────────────────────────────┘ │    │</span>
<span class="line">│  └─────────────────────────────────────────────────────────┘    │</span>
<span class="line">│         ↓                                                       │</span>
<span class="line">│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │</span>
<span class="line">│  │  Nacos      │    │  Eureka     │    │  Consul     │          │</span>
<span class="line">│  │  注册中心    │    │  注册中心     │    │  注册中心    │          │</span>
<span class="line">│  └─────────────┘    └─────────────┘    └─────────────┘          │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体的<strong>调用流程</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│                    完整调用流程                                   │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  1. 服务启动                                                     │</span>
<span class="line">│     ↓                                                           │</span>
<span class="line">│     注册到注册中心 (Nacos/Eureka)                                 │</span>
<span class="line">│     实例信息：{host, port, metadata, weight}                     │</span>
<span class="line">│                                                                │</span>
<span class="line">│  2. 调用方发起请求                                                │</span>
<span class="line">│     ↓                                                           │</span>
<span class="line">│     @FeignClient(name = &quot;user-service&quot;)                         │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  3. LoadBalancer 介入                                            │</span>
<span class="line">│     ↓                                                           │</span>
<span class="line">│     a. 从缓存/注册中心获取 user-service 实例列表                    │</span>
<span class="line">│     b. 根据策略选择一个实例                                        │</span>
<span class="line">│     c. 返回 ServiceInstance                                     │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  4. 发起实际 HTTP 请求                                            │</span>
<span class="line">│     ↓                                                           │</span>
<span class="line">│     http://selected-host:port/api/xxx                           │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  5. 请求完成，更新统计信息（如响应时间）                              │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="切换负载均衡算法" tabindex="-1"><a class="header-anchor" href="#切换负载均衡算法"><span>切换负载均衡算法</span></a></h2><p>之前分析源码的时候我们发现负载均衡的算法是有<code>ReactiveLoadBalancer</code>来定义的，我们发现它的实现类有三个：</p><ul><li><strong>RoundRobinLoadBalancer</strong>（轮询）</li><li><strong>RandomLoadBalancer</strong>（随机）</li><li><strong>NacosLoadBalancer</strong>（Nacos配置）</li></ul><p>其中<code>RoundRobinLoadBalancer</code>和<code>RandomLoadBalancer</code>是由<code>Spring-Cloud-Loadbalancer</code>模块提供的，而<code>NacosLoadBalancer</code>则是由<code>Nacos-Discorvery</code>模块提供的。</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OpenFeignConfig</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">ReactorLoadBalancer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">&gt;</span></span> <span class="token function">reactorServiceInstanceLoadBalancer</span><span class="token punctuation">(</span></span>
<span class="line">            <span class="token class-name">Environment</span> environment<span class="token punctuation">,</span> </span>
<span class="line">        	<span class="token class-name">NacosDiscoveryProperties</span> properties<span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">LoadBalancerClientFactory</span> loadBalancerClientFactory<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> name <span class="token operator">=</span> environment<span class="token punctuation">.</span><span class="token function">getProperty</span><span class="token punctuation">(</span><span class="token class-name">LoadBalancerClientFactory</span><span class="token punctuation">.</span><span class="token constant">PROPERTY_NAME</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">NacosLoadBalancer</span><span class="token punctuation">(</span></span>
<span class="line">                loadBalancerClientFactory<span class="token punctuation">.</span><span class="token function">getLazyProvider</span><span class="token punctuation">(</span></span>
<span class="line">                    name<span class="token punctuation">,</span> </span>
<span class="line">                    <span class="token class-name">ServiceInstanceListSupplier</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">,</span> </span>
<span class="line">            name<span class="token punctuation">,</span> </span>
<span class="line">            properties<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>不要在这里加<code>@Configuration</code>注解，要让其针对client装配</p></blockquote><p>由于这个OpenFeignConfig没有加<code>@Configuration</code>注解，也就没有被Spring加载，因此是不会生效的。接下来，我们要在<strong>启动类</strong>上通过注解来声明这个配置。</p><p>有两种做法：</p><ul><li>全局配置：对所有服务生效</li></ul><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@LoadBalancerClients(defaultConfiguration = OpenFeignConfig.class)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>局部配置：只对某个服务生效</li></ul><div class="language-Java line-numbers-mode" data-highlighter="prismjs" data-ext="Java" data-title="Java"><pre><code><span class="line">@LoadBalancerClients({</span>
<span class="line">        @LoadBalancerClient(value = &quot;item-service&quot;, configuration = OpenFeignConfig.class)</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>如果只需要切换到随机，其实也可以在yml配置中切换：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token comment"># application.yml</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 全局负载均衡策略配置</span></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">loadbalancer</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment"># 方式1：指定策略名称（2022.x+ 版本）</span></span>
<span class="line">      <span class="token key atrule">configurations</span><span class="token punctuation">:</span> random  <span class="token comment"># 可选值：round-robin, random</span></span>
<span class="line">      </span>
<span class="line">      <span class="token comment"># 方式2：缓存配置</span></span>
<span class="line">      <span class="token key atrule">cache</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">        <span class="token key atrule">ttl</span><span class="token punctuation">:</span> 35s</span>
<span class="line">        <span class="token key atrule">capacity</span><span class="token punctuation">:</span> <span class="token number">256</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><p>Nacos的负载均衡其实就是优先本集群然后<strong>加权随机</strong>，对于权值，我们直接到nacos可视化界面设置对应服务的集群实例即可配置权重。</p><blockquote><p>权重也可以直接在yml中配置：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token comment"># order-service (提供者)</span></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> order<span class="token punctuation">-</span>service</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">nacos</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">discovery</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">server-addr</span><span class="token punctuation">:</span> localhost<span class="token punctuation">:</span><span class="token number">8848</span></span>
<span class="line">        <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">weight</span><span class="token punctuation">:</span> <span class="token number">10</span>  <span class="token comment"># 权重配置</span></span>
<span class="line">          <span class="token key atrule">version</span><span class="token punctuation">:</span> 2.0.0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote>`,23)])])}const d=s(i,[["render",p]]),o=JSON.parse('{"path":"/docs/SpingCloud/bagu/5.yuanchengdiaoyong.html","title":"远程调用","lang":"en-US","frontmatter":{"title":"远程调用","date":"2026-2-17"},"headers":[{"level":2,"title":"负载均衡流程","slug":"负载均衡流程","link":"#负载均衡流程","children":[]},{"level":2,"title":"切换负载均衡算法","slug":"切换负载均衡算法","link":"#切换负载均衡算法","children":[]}],"git":{"createdTime":1774363188000,"updatedTime":1774363188000,"contributors":[{"name":"SaltFishGC","email":"130335482+SaltFishGC@users.noreply.github.com","commits":1}]},"filePathRelative":"docs/SpingCloud/八股/5.远程调用.md"}');export{d as comp,o as data};
