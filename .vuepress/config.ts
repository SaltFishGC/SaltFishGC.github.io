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
        }
      ],
    },
    navbar: [
      { text: "主页", link: "/" },
      { text: "Blog", link: "/categories/blog/1.html" },
      {
        text: "笔记",
        children: [
          {
            text: "仿wx", link: "/docs/wx/常用命令",
            children: [
              { text: "常用命令", link: "/docs/wx/常用命令" },
              { text: "前端部分", link: "/docs/wx/前端部分/Eletron速记" },
              { text: "后端部分", link: "/docs/wx/后端部分/Netty速记" }
            ]
          },
          {
            text: "黑马点评", link: "/docs/黑马点评/项目相关/简介",
            children: [
              { text: "项目相关", link: "/docs/黑马点评/项目相关/简介" },
              { text: "业务设计", link: "/docs/黑马点评/业务设计/1.短信登录" },
              { text: "高级篇", link: "/docs/黑马点评/高级篇/1.分布式缓存" },
              { text: "原理八股文", link: "/docs/黑马点评/原理八股文/网络模型" },
              { text: "应用知识", link: "/docs/黑马点评/应用知识/常见业务问题及八股文" },
              { text: "对脚手架的更新", link: "/docs/黑马点评/对脚手架的更新/对RedisUtil的更新" }
            ]
          }
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