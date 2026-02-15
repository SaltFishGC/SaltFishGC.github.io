import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite';

export default defineUserConfig({
  title: "SaltFishGC`s Blog",
  bundler: viteBundler(),
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
    colorModeSwitch: false, // 是否展示颜色模式开关，默认 true
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
            children: ["wx/常用命令"]
          },
          {
            text: "前端部分",
            children: [
              "wx/前端部分/Eletron速记",
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
              "wx/后端部分/Netty速记",
              "wx/后端部分/业务中学到的东西（后端",
              "wx/后端部分/修改设计（后端",
              "wx/后端部分/同样的业务场景，微信是怎么做的？",
              "wx/后端部分/对代码生成器的优化",
              "wx/后端部分/数据库和缓存存储形式整理",
              "wx/后端部分/遇到的问题（后端"
            ]
          }
          ]
        },
        {
          text: "黑马点评",
          collapsible: false,
          children: [
            {
              text: "项目相关",
              children: [
                "黑马点评/项目相关/简介",
                "黑马点评/项目相关/常用命令",
                "黑马点评/项目相关/包装简历"
              ]
            },
            {
              text: "业务设计",
              children: [
                "黑马点评/业务设计/1.短信登录",
                "黑马点评/业务设计/2.缓存",
                "黑马点评/业务设计/3.优惠券秒杀",
                "黑马点评/业务设计/4.分布式锁(Redisson)",
                "黑马点评/业务设计/5.秒杀优化",
                "黑马点评/业务设计/6.Redis消息队列",
                "黑马点评/业务设计/7.达人探店",
                "黑马点评/业务设计/8.好友关注",
                "黑马点评/业务设计/9.附件商铺",
                "黑马点评/业务设计/10.用户签到",
                "黑马点评/业务设计/11.uv统计"
              ]
            },
            {
              text: "高级篇",
              children: [
                "黑马点评/高级篇/1.分布式缓存",
                "黑马点评/高级篇/2.多级缓存",
                "黑马点评/高级篇/3.最佳实践",
                "黑马点评/高级篇/Redis存在的问题"
              ]
            },
            {
              text: "原理八股文",
              children: [
                "黑马点评/原理八股文/网络模型",
                "黑马点评/原理八股文/数据结构",
                "黑马点评/原理八股文/内存汰换",
                "黑马点评/原理八股文/通信协议"
              ]
            },
            {
              text: "应用知识",
              children: [
                "黑马点评/应用知识/Redis特性",
                "黑马点评/应用知识/常见业务问题及八股文",
                "黑马点评/应用知识/杂七杂八的异常"
              ]
            },
            {
              text: "对脚手架的更新",
              children: [
                "黑马点评/对脚手架的更新/对RedisUtil的更新"
              ]
            }
          ]
        },
        {
          text: "黑马商城",
          collapsible: false,
          children: [
            {
              text: "Docker",
              children: [
                "黑马商城/Docker/1.简介",
                "黑马商城/Docker/2.自定义容器",
                "黑马商城/Docker/3.应用部署",
                "黑马商城/Docker/4.容器间通信"
              ]
            },
            {
              text: "MybatisPlus",
              children: [
                "黑马商城/MybatisPlus/1.简介",
                "黑马商城/MybatisPlus/2.Wrapper",
                "黑马商城/MybatisPlus/3.结合Wrapper和mapper",
                "黑马商城/MybatisPlus/4.自制SQL",
                "黑马商城/MybatisPlus/5.IService",
                "黑马商城/MybatisPlus/6.IService的lambda链式调用",
                "黑马商城/MybatisPlus/7.IService的批量插入",
                "黑马商城/MybatisPlus/8.分页插件",
                "黑马商城/MybatisPlus/9.额外功能"
              ]
            },
            {
              text: "八股",
              children: [
                "黑马商城/八股/1.Spring",
                "黑马商城/八股/2.JWT",
                "黑马商城/八股/3.微服务"
              ]
            },
            {
              text: "微服务",
              children: [
                "黑马商城/微服务/1.部署原项目",
                "黑马商城/微服务/2.项目初步认识",
                "黑马商城/微服务/3.服务管理（注册中心Nacos）",
                "黑马商城/微服务/4.远程调用（OpenFeign）",
                "黑马商城/微服务/5.微服务网关（Gateway）",
                "黑马商城/微服务/6.配置管理（配置中心Nacos）",
                "黑马商城/微服务/7.服务保护（Sentinel熔断限流）",
                "黑马商城/微服务/8.分布式事务（Seata）",
                "黑马商城/微服务/9.消息队列（MQ）",
                "黑马商城/微服务/10.ElasticSearch",
                "黑马商城/微服务/EX：Common模块的注意事项",
                "黑马商城/微服务/EX：链路追踪"
              ]
            }
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
          {text: "仿wx", link: "/docs/wx/常用命令"},
          {text: "黑马点评", link: "/docs/黑马点评/项目相关/简介"},
          {text: "黑马商城", link: "/docs/黑马商城/Docker/1.简介"}
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