import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite';
import { mermaidPlugin } from './plugins/mermaid'
import autoSeries from './auto-series.json'

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
    autoSetBlogCategories: true,
    autoAddCategoryToNavbar: {
      location: 2,
      showIcon: true,
    },
    categoriesText: '分类',
    tagsText: '标签',
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', {
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=LXGW+WenKai&display=swap',
        rel: 'stylesheet'
      }]
    ],
    series: autoSeries,
    navbar: [
      { text: "主页", link: "/" },
      { text: "时间线", link: "/timeline.html" },
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