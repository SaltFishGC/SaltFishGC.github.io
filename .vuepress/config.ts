import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite';
import { mermaidPlugin } from './plugins/mermaid'

export default defineUserConfig({
  title: "SaltFishGC`s Blog",
  bundler: viteBundler(),
  plugins: [
    // 其他插件...
    mermaidPlugin
  ],
  // bundler: webpackBundler(),
  theme: recoTheme({
    logo: "/doge.jpg",
    author: "SaltFishGC",
    authorAvatar: "/doge.jpg",
    docsRepo: "https://github.com/SaltFishGC",
    docsBranch: "main",
    // docsDir: "example",
    lastUpdatedText: "",
    colorMode: 'dark', // dark, light, 默认 auto
    colorModeSwitch: true, // 是否展示颜色模式开关，默认 true
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    // series 为原 sidebar
    series: {
      "/docs/": [
        {
          text: "仿wx",
          collapsible: false,
          children: [{
            text: "常用命令",
            children: ["wx/常用命令", "wx/项目总结"]
          },
          {
            text: "前端部分",
            children: [
              "wx/前端部分/Eletron速记",
              "wx/前端部分/WebRTC",
              "wx/前端部分/WebRTC实现多端消息同步",
              "wx/前端部分/WebSocket客户端",
              "wx/前端部分/nginx",
              "wx/前端部分/session，token，jwt",
              "wx/前端部分/sqlite本地缓存",
              "wx/前端部分/vue基本速记",
              "wx/前端部分/修改设计",
              "wx/前端部分/遇到的问题（前端"
            ]
          },
          {
            text: "后端部分",
            children: [
              "wx/后端部分/MQ优化数据库写入",
              "wx/后端部分/Netty速记",
              "wx/后端部分/OSS",
              "wx/后端部分/WebRTC",
              "wx/后端部分/业务中学到的东西（后端",
              "wx/后端部分/修改设计（后端",
              "wx/后端部分/加密与解密",
              "wx/后端部分/同样的业务场景，微信是怎么做的？",
              "wx/后端部分/对代码生成器的优化",
              "wx/后端部分/数据库和缓存存储形式整理",
              "wx/后端部分/离线消息推送",
              "wx/后端部分/遇到的问题（后端"
            ]
          }
          ]
        },
        {
          text: "Redis专项",
          collapsible: false,
          children: [
            {
              text: "项目相关",
              children: [
                "Redis专项/项目相关/简介",
                "Redis专项/项目相关/常用命令",
                "Redis专项/项目相关/包装简历"
              ]
            },
            {
              text: "业务设计",
              children: [
                "Redis专项/业务设计/1.短信登录",
                "Redis专项/业务设计/2.缓存",
                "Redis专项/业务设计/3.优惠券秒杀",
                "Redis专项/业务设计/4.分布式锁(Redisson)",
                "Redis专项/业务设计/5.秒杀优化",
                "Redis专项/业务设计/6.Redis消息队列",
                "Redis专项/业务设计/7.达人探店",
                "Redis专项/业务设计/8.好友关注",
                "Redis专项/业务设计/9.附件商铺",
                "Redis专项/业务设计/10.用户签到",
                "Redis专项/业务设计/11.uv统计"
              ]
            },
            {
              text: "高级篇",
              children: [
                "Redis专项/高级篇/1.分布式缓存",
                "Redis专项/高级篇/2.多级缓存",
                "Redis专项/高级篇/3.最佳实践",
                "Redis专项/高级篇/Redis存在的问题"
              ]
            },
            {
              text: "原理八股文",
              children: [
                "Redis专项/原理八股文/网络模型",
                "Redis专项/原理八股文/数据结构",
                "Redis专项/原理八股文/内存汰换",
                "Redis专项/原理八股文/通信协议"
              ]
            },
            {
              text: "应用知识",
              children: [
                "Redis专项/应用知识/Redis特性",
                "Redis专项/应用知识/常见业务问题及八股文",
                "Redis专项/应用知识/杂七杂八的异常"
              ]
            },
            {
              text: "对脚手架的更新",
              children: [
                "Redis专项/对脚手架的更新/对RedisUtil的更新"
              ]
            }
          ]
        },
        {
          text: "SpingCloud",
          collapsible: false,
          children: [
            {
              text: "Docker",
              children: [
                "SpingCloud/Docker/1.简介",
                "SpingCloud/Docker/2.自定义容器",
                "SpingCloud/Docker/3.应用部署",
                "SpingCloud/Docker/4.容器间通信"
              ]
            },
            {
              text: "MybatisPlus",
              children: [
                "SpingCloud/MybatisPlus/1.简介",
                "SpingCloud/MybatisPlus/2.Wrapper",
                "SpingCloud/MybatisPlus/3.结合Wrapper和mapper",
                "SpingCloud/MybatisPlus/4.自制SQL",
                "SpingCloud/MybatisPlus/5.IService",
                "SpingCloud/MybatisPlus/6.IService的lambda链式调用",
                "SpingCloud/MybatisPlus/7.IService的批量插入",
                "SpingCloud/MybatisPlus/8.分页插件",
                "SpingCloud/MybatisPlus/9.额外功能"
              ]
            },
            {
              text: "八股",
              children: [
                "SpingCloud/八股/1.Spring",
                "SpingCloud/八股/2.JWT",
                "SpingCloud/八股/3.分布式事务",
                "SpingCloud/八股/3.微服务",
                "SpingCloud/八股/4.注册中心",
                "SpingCloud/八股/5.远程调用",
                "SpingCloud/八股/6.服务保护"
              ]
            },
            {
              text: "微服务",
              children: [
                "SpingCloud/微服务/1.部署原项目",
                "SpingCloud/微服务/2.项目初步认识",
                "SpingCloud/微服务/3.服务管理（注册中心Nacos）",
                "SpingCloud/微服务/4.远程调用（OpenFeign）",
                "SpingCloud/微服务/5.微服务网关（Gateway）",
                "SpingCloud/微服务/6.配置管理（配置中心Nacos）",
                "SpingCloud/微服务/7.服务保护（Sentinel熔断限流）",
                "SpingCloud/微服务/8.分布式事务（Seata）",
                "SpingCloud/微服务/9.消息队列（MQ）",
                "SpingCloud/微服务/10.ElasticSearch",
                "SpingCloud/微服务/EX：Common模块的注意事项",
                "SpingCloud/微服务/EX：链路追踪"
              ]
            }
          ]
        },
        {
          text: "langchain4j",
          collapsible: false,
          children: [
            "langchain4j/1.简要介绍",
            "langchain4j/2.大模型",
            "langchain4j/3.简单使用LLM",
            "langchain4j/4.高级方式",
            "langchain4j/5.配置总结",
            "langchain4j/6.自制本地项目"
          ]
        },
        {
          text: "测试",
          collapsible: false,
          children: [
            "测试/Jmeter",
            "测试/Pytest"
          ]
        },
        {
          text: "若智idea",
          collapsible: false,
          children: [
            "若智idea/安排",
            "若智idea/comfyui研究报告",
            "若智idea/erp结合langchain4j",
            "若智idea/godot跑团小游戏",
            "若智idea/seedance2.0封装网站",
            "若智idea/做一个测试框架",
            "若智idea/同花顺api研究报告",
            "若智idea/基于Redis的类爱发电项目",
            "若智idea/小说助手 文生文ai网站",
            "若智idea/用Qt实现一个开发助手"
          ]
        }
      ],
    },
    navbar: [
      { text: "主页", link: "/" },
      { text: "Blog", link: "/categories/blog/1.html" },
      {
        text: "笔记",
        children: [
          { text: "仿wx", link: "/docs/wx/常用命令" },
          { text: "Redis专项", link: "/docs/Redis专项/项目相关/简介" },
          { text: "SpingCloud", link: "/docs/SpingCloud/Docker/1.简介" },
          { text: "langchain4j", link: "/docs/langchain4j/1.简要介绍" },
          { text: "测试", link: "/docs/测试/Jmeter" },
          { text: "若智idea", link: "/docs/若智idea/安排" }
        ],
      },
    ],
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});