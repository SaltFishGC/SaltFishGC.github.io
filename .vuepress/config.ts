import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  title: "SaltFishGC`s Blog",
  description: "Welcome to my blog",
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  theme: recoTheme({
    logo: "/doge.jpg",
    author: "SaltFishGC",
    authorAvatar: "/doge.jpg",
    docsRepo: "https://github.com/SaltFishGC",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    // series 为原 sidebar
    series: {
      "/docs/wx/": [
        {
          text: "仿wx",
          children: [{
            text: "常用命令",
            children: ["常用命令"]
          },
          {
            text: "前端部分",
            children: [
              "前端部分/Eletron速记",
              "前端部分/WebSocket客户端",
              "前端部分/nginx",
              "前端部分/session，token，jwt",
              "前端部分/sqlite本地缓存",
              "前端部分/vue基本速记",
              "前端部分/添加设计",
              "前端部分/遇到的问题（前端"
            ]
          },
          {
            text: "后端部分",
            children: [
              "后端部分/Netty速记",
              "后端部分/业务中学到的东西（后端",
              "后端部分/修改设计（后端",
              "后端部分/同样的业务场景，微信是怎么做的？",
              "后端部分/对代码生成器的优化",
              "后端部分/数据库和缓存存储形式整理",
              "后端部分/遇到的问题（后端"
            ]
          }
          ]
        }

      ]
    },
    navbar: [
      { text: "主页", link: "/" },
      { text: "Blog", link: "/categories/blog/1.html" },
      {
        text: "笔记",
        children: [
          {
            text: "仿wx",
            children: [
              { text: "常用命令", link: "/docs/wx/常用命令" },
              { text: "前端部分", link: "/docs/wx/前端部分/Eletron速记" },
              { text: "后端部分", link: "/docs/wx/后端部分/Netty速记" }
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