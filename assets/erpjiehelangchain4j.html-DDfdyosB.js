import{b as l,c as i,d as s,g as e,r as t,o as r}from"./app-9EpopRw3.js";const d={};function p(c,n){const a=t("MermaidDiagram");return r(),i("div",null,[n[0]||(n[0]=s(`<p>没什么好说的，企业最爱，写到简历上夯爆了</p><p>盘古大模型（貌似不赖，调查一下）</p><p>很好，现在请围绕这个教学项目实现的几个功能：LLM对话，Tool函数调用，RAG检索 结合现在提到的自主ollama以及Qdrant部署，包装一个ERP的可以写到实习简历上的项目经历 我们现在先不急着真的写出完整的项目经历，我们先来收集一下哪些erp的功能可以结合Langchain4j实现</p><p>很好的想法！让我帮你梳理一下 ERP 系统中可以结合 LangChain4j 实现的功能模块，这些都是很好的简历亮点。</p><h2 id="📋-erp-系统功能模块分析" tabindex="-1"><a class="header-anchor" href="#📋-erp-系统功能模块分析"><span>📋 ERP 系统功能模块分析</span></a></h2><h3 id="一、核心-erp-功能-ai-增强点" tabindex="-1"><a class="header-anchor" href="#一、核心-erp-功能-ai-增强点"><span><strong>一、核心 ERP 功能 + AI 增强点</strong></span></a></h3><h4 id="_1-智能客服与工单系统-💬" tabindex="-1"><a class="header-anchor" href="#_1-智能客服与工单系统-💬"><span><strong>1. 智能客服与工单系统</strong> 💬</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 客户咨询回复</span>
<span class="line">- 工单创建与分类</span>
<span class="line">- 问题路由到对应部门</span>
<span class="line"></span>
<span class="line">AI 增强（LangChain4j）:</span>
<span class="line">✅ LLM 对话 - 7×24 小时智能客服</span>
<span class="line">✅ Tool 调用 - 自动查询订单状态、库存信息</span>
<span class="line">✅ RAG 检索 - 从产品手册、FAQ 中检索答案</span>
<span class="line">✅ 工单自动分类 - 根据描述自动分配到技术/销售/售后</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>基于 Ollama 本地部署的 Qwen2.5 大模型</li><li>使用 Qdrant 向量数据库存储产品知识库</li><li>实现多轮对话记忆（MongoDB）</li><li>工具函数调用查询企业数据</li></ul><hr><h4 id="_2-智能采购助手-🛒" tabindex="-1"><a class="header-anchor" href="#_2-智能采购助手-🛒"><span><strong>2. 智能采购助手</strong> 🛒</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 采购申请审批</span>
<span class="line">- 供应商管理</span>
<span class="line">- 库存预警</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;帮我查看 A 供应商的交货记录&quot;</span>
<span class="line">✅ Tool 调用 - 查询库存量、历史价格、供应商评分</span>
<span class="line">✅ RAG 检索 - 采购合同条款、合规要求检索</span>
<span class="line">✅ 智能建议 - &quot;根据历史数据，建议采购 500 件&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>函数调用对接 MySQL 业务数据库</li><li>基于历史数据的智能预测</li><li>合同文档的 RAG 检索</li></ul><hr><h4 id="_3-销售数据分析助手-📊" tabindex="-1"><a class="header-anchor" href="#_3-销售数据分析助手-📊"><span><strong>3. 销售数据分析助手</strong> 📊</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 销售报表生成</span>
<span class="line">- 客户订单跟踪</span>
<span class="line">- 业绩统计</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;上季度华东区销售额是多少？&quot;</span>
<span class="line">✅ Tool 调用 - 执行 SQL 查询、生成图表</span>
<span class="line">✅ RAG 检索 - 销售政策、折扣规则检索</span>
<span class="line">✅ 自然语言 BI - &quot;显示 Top 10 客户&quot; → 自动生成图表</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>Text-to-SQL 能力</li><li>动态数据可视化</li><li>多维度数据分析</li></ul><hr><h4 id="_4-人力资源智能助手-👥" tabindex="-1"><a class="header-anchor" href="#_4-人力资源智能助手-👥"><span><strong>4. 人力资源智能助手</strong> 👥</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 员工档案管理</span>
<span class="line">- 考勤统计</span>
<span class="line">- 请假审批</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;我还有多少年假？&quot;</span>
<span class="line">✅ Tool 调用 - 查询考勤记录、剩余假期</span>
<span class="line">✅ RAG 检索 - 员工手册、制度文档检索</span>
<span class="line">✅ 智能招聘 - 简历筛选、JD 匹配度分析</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>敏感数据脱敏处理</li><li>多轮对话确认意图</li><li>文档相似度匹配</li></ul><hr><h4 id="_5-仓储物流优化-📦" tabindex="-1"><a class="header-anchor" href="#_5-仓储物流优化-📦"><span><strong>5. 仓储物流优化</strong> 📦</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 入库/出库管理</span>
<span class="line">- 库存盘点</span>
<span class="line">- 货位管理</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;A 商品放在哪个仓库？&quot;</span>
<span class="line">✅ Tool 调用 - 查询实时库存、库位信息</span>
<span class="line">✅ RAG 检索 - 危险品存储规范、操作流程</span>
<span class="line">✅ 路径优化 - &quot;如何最高效完成这 10 个拣货任务？&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>空间数据查询优化</li><li>运筹优化算法集成</li><li>安全规范智能提醒</li></ul><hr><h4 id="_6-财务报告生成-💰" tabindex="-1"><a class="header-anchor" href="#_6-财务报告生成-💰"><span><strong>6. 财务报告生成</strong> 💰</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 财务报表</span>
<span class="line">- 成本核算</span>
<span class="line">- 预算管理</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;解释本月管理费用增长原因&quot;</span>
<span class="line">✅ Tool 调用 - 聚合财务数据、计算比率</span>
<span class="line">✅ RAG 检索 - 会计准则、税法条款</span>
<span class="line">✅ 异常检测 - &quot;发现 3 笔异常报销&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>财务数据准确性校验</li><li>审计轨迹追踪</li><li>合规性检查</li></ul><hr><h4 id="_7-生产计划排程-🏭" tabindex="-1"><a class="header-anchor" href="#_7-生产计划排程-🏭"><span><strong>7. 生产计划排程</strong> 🏭</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 生产订单管理</span>
<span class="line">- 物料需求计划 (MRP)</span>
<span class="line">- 产能规划</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;下周能完成多少订单？&quot;</span>
<span class="line">✅ Tool 调用 - 查询设备状态、物料库存</span>
<span class="line">✅ RAG 检索 - 工艺文件、质量标准</span>
<span class="line">✅ 智能排程 - 考虑交期、产能、物料约束</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>多约束条件优化</li><li>实时数据集成</li><li>风险预警机制</li></ul><hr><h4 id="_8-质量管理助手-✅" tabindex="-1"><a class="header-anchor" href="#_8-质量管理助手-✅"><span><strong>8. 质量管理助手</strong> ✅</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">现有功能：</span>
<span class="line">- 质检记录</span>
<span class="line">- 不合格品处理</span>
<span class="line">- 质量追溯</span>
<span class="line"></span>
<span class="line">AI 增强:</span>
<span class="line">✅ LLM 对话 - &quot;最近批次合格率如何？&quot;</span>
<span class="line">✅ Tool 调用 - 统计良率、趋势分析</span>
<span class="line">✅ RAG 检索 - 检验标准、ISO 规范</span>
<span class="line">✅ 根因分析 - &quot;分析不良品产生的原因&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>技术亮点：</strong></p><ul><li>统计分析自动化</li><li>质量知识图谱</li><li>追溯链条构建</li></ul><hr><h3 id="二、技术架构亮点-简历加分项" tabindex="-1"><a class="header-anchor" href="#二、技术架构亮点-简历加分项"><span><strong>二、技术架构亮点（简历加分项）</strong></span></a></h3>`,47)),e(a,{code:"graph%20TB%0A%20%20%20%20A%5BERP%20%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%5D%20--%3E%20B%5BAI%20%E4%B8%AD%E5%8F%B0%20-%20LangChain4j%5D%0A%20%20%20%20B%20--%3E%20C%5BOllama%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%3Cbr%2F%3EQwen2.5%2FDeepSeek%5D%0A%20%20%20%20B%20--%3E%20D%5BQdrant%20%E5%90%91%E9%87%8F%E5%BA%93%3Cbr%2F%3E%E7%9F%A5%E8%AF%86%E5%BA%93%2FRAG%5D%0A%20%20%20%20B%20--%3E%20E%5BTool%20%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%3Cbr%2F%3E%E4%B8%9A%E5%8A%A1%20API%5D%0A%20%20%20%20B%20--%3E%20F%5BMongoDB%3Cbr%2F%3E%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BF%86%5D%0A%20%20%20%20%0A%20%20%20%20C%20--%3E%20G%5B%E6%99%BA%E8%83%BD%E5%AE%A2%E6%9C%8D%5D%0A%20%20%20%20C%20--%3E%20H%5B%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%5D%0A%20%20%20%20C%20--%3E%20I%5B%E6%B5%81%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%8C%96%5D%0A%20%20%20%20%0A%20%20%20%20style%20B%20fill%3A%23FFD700%0A%20%20%20%20style%20C%20fill%3A%2390EE90%0A%20%20%20%20style%20D%20fill%3A%2387CEEB%0A"}),n[1]||(n[1]=s('<hr><h3 id="三、可量化的项目成果-写进简历" tabindex="-1"><a class="header-anchor" href="#三、可量化的项目成果-写进简历"><span><strong>三、可量化的项目成果（写进简历）</strong></span></a></h3><table><thead><tr><th>指标</th><th>改善前</th><th>改善后</th><th>提升</th></tr></thead><tbody><tr><td>客服响应时间</td><td>5 分钟</td><td>即时</td><td>⬆️ 100%</td></tr><tr><td>工单分类准确率</td><td>人工 70%</td><td>AI 92%</td><td>⬆️ 22%</td></tr><tr><td>数据查询效率</td><td>手动 15 分钟</td><td>AI 30 秒</td><td>⬆️ 95%</td></tr><tr><td>培训成本</td><td>2 周</td><td>3 天</td><td>⬇️ 78%</td></tr><tr><td>知识库检索</td><td>关键词匹配</td><td>语义理解</td><td>⬆️ 40%</td></tr></tbody></table><hr><h3 id="四、推荐的实习项目组合" tabindex="-1"><a class="header-anchor" href="#四、推荐的实习项目组合"><span><strong>四、推荐的实习项目组合</strong></span></a></h3><p>基于你的技术栈，我建议包装成：</p><p><strong>项目名称：</strong> 《基于大语言模型的智能 ERP 系统设计与实现》</p><p><strong>核心功能模块（选 3-4 个）：</strong></p><ol><li>✅ <strong>智能客服系统</strong>（展示 LLM 对话 + RAG）</li><li>✅ <strong>销售数据助手</strong>（展示 Tool 调用 + 数据分析）</li><li>✅ <strong>采购决策支持</strong>（展示多工具协同）</li><li>✅ <strong>员工自助助手</strong>（展示 HR 场景应用）</li></ol><p><strong>技术栈标签：</strong></p><ul><li>Spring Boot 3.x</li><li>LangChain4j 1.0</li><li>Ollama（本地大模型部署）</li><li>Qdrant（向量数据库）</li><li>MongoDB（对话记忆）</li><li>MySQL（业务数据）</li><li>React/Vue（前端，可选）</li></ul><hr><h3 id="五、下一步行动建议" tabindex="-1"><a class="header-anchor" href="#五、下一步行动建议"><span><strong>五、下一步行动建议</strong></span></a></h3><p>现在我们可以：</p><ol><li><strong>选择 2-3 个核心场景</strong> - 聚焦最有代表性的功能</li><li><strong>设计数据结构</strong> - MySQL 表结构、Qdrant Collection 设计</li><li><strong>定义 Tool 函数</strong> - 哪些业务逻辑封装成工具</li><li><strong>准备知识库文档</strong> - 用于 RAG 的产品手册、制度文档</li><li><strong>编写项目经历</strong> - 用 STAR 法则包装</li></ol><p>你想先从哪个功能模块开始深入设计？或者需要我帮你整理一份完整的项目经历草稿吗？🎯</p><h1 id="成品" tabindex="-1"><a class="header-anchor" href="#成品"><span>成品</span></a></h1><p>SmartERP Copilot —— 基于大模型的企业资源计划智能助手</p><p>技术栈： SpringBoot 3 · LangChain4j · Ollama (Qwen2.5) · Qdrant · MongoDB · MySQL · Redis</p><p>项目描述： 针对传统 ERP 数据查询难、制度检索慢的痛点，设计并实现基于 <strong>LangChain4j</strong> 的智能助手模块。采用 <strong>Ollama</strong> 本地部署大模型保障数据隐私，利用 <strong>Qdrant</strong> 构建企业知识库，通过 <strong>RAG</strong> 与 <strong>Tool Calling</strong> 技术实现自然语言查数、制度问答及单据辅助填写，建立“人机协同、只读不写”的安全作业模式。</p><p>核心职责：</p><ul><li><strong>RAG 知识库引擎：</strong> 基于 <strong>LangChain4j</strong> 实现文档切片与向量化流水线，将产品手册/财务制度存入 <strong>Qdrant</strong>。支持语义检索与<strong>原文溯源高亮</strong>，解决关键词匹配率低问题，制度查询效率提升 90%。</li><li><strong>安全数据报表助手：</strong> 封装只读 Java Tool 函数集（如 <code>querySalesTrend</code>），LLM 仅负责意图识别与参数提取，<strong>严禁生成动态 SQL</strong>。自动输出含环比分析、异常预警的结构化报表，所有查询行为写入 <code>ai_audit_log</code> 确保可追溯。</li><li><strong>业务流程辅助向导：</strong> 利用 <strong>MongoDB</strong> 存储多轮对话上下文，在单据填写场景提供<strong>草稿预填充</strong>与合规风险提示（如超预算预警）。采用 <strong>“AI 建议 + 人工确认”</strong> 机制，杜绝自动化执行风险。</li><li><strong>私有化部署与审计：</strong> 使用 <strong>Ollama</strong> 容器化部署 <strong>Qwen2.5</strong> 模型，通过 Prompt 工程约束输出为严格 JSON。构建全链路审计模块，记录输入/输出/工具调用日志，对敏感操作实施拦截策略。</li></ul>',22))])}const v=l(d,[["render",p]]),u=JSON.parse('{"path":"/docs/ruozhiidea/erpjiehelangchain4j.html","title":"Erp结合Langchain4J","lang":"en-US","frontmatter":{"title":"Erp结合Langchain4J","date":"2026-3-24"},"headers":[{"level":2,"title":"📋 ERP 系统功能模块分析","slug":"📋-erp-系统功能模块分析","link":"#📋-erp-系统功能模块分析","children":[{"level":3,"title":"一、核心 ERP 功能 + AI 增强点","slug":"一、核心-erp-功能-ai-增强点","link":"#一、核心-erp-功能-ai-增强点","children":[]},{"level":3,"title":"二、技术架构亮点（简历加分项）","slug":"二、技术架构亮点-简历加分项","link":"#二、技术架构亮点-简历加分项","children":[]},{"level":3,"title":"三、可量化的项目成果（写进简历）","slug":"三、可量化的项目成果-写进简历","link":"#三、可量化的项目成果-写进简历","children":[]},{"level":3,"title":"四、推荐的实习项目组合","slug":"四、推荐的实习项目组合","link":"#四、推荐的实习项目组合","children":[]},{"level":3,"title":"五、下一步行动建议","slug":"五、下一步行动建议","link":"#五、下一步行动建议","children":[]}]}],"git":{"createdTime":1780464568000,"updatedTime":1780464568000,"contributors":[{"name":"SaltFishGC","email":"130335482+SaltFishGC@users.noreply.github.com","commits":1}]},"filePathRelative":"docs/若智idea/erp结合langchain4j.md"}');export{v as comp,u as data};
