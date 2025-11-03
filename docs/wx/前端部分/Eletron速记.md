---
title: Eletron速记
date: 2025/11/3
tags:
 - 笔记
 - 前端
 - Eletron
categories:
 - notes
---

### 渲染线程vue与主线程

主线程才能和本地交互

#### 渲染线程与主线程之间的交互

ipc

on与send

需要回调函数且不需要返回值

handle与invoke（双向通信）

需要返回值

如果是分开配置的，记得在主线程index里面导入ipc的方法

| 特性                  | `send` + `on`                              | `invoke` + `handle`                        |
| --------------------- | ------------------------------------------ | ------------------------------------------ |
| **通信方向**          | 单向（渲染 → 主）或 双向（需手动 `reply`） | 双向（支持返回值）                         |
| **能否返回数据**      | ❌ 不能直接返回（需用 `reply`）             | ✅ 可以 `return` 数据（支持 `Promise`）     |
| **是否异步（await）** | ❌ 不支持 `await`，只能用事件               | ✅ 支持 `await`，可 `async/await`           |
| **错误处理**          | 需手动发送错误事件                         | ✅ `throw` 错误会自动 reject Promise        |
| **Electron 版本要求** | 所有版本                                   | `handle`/`invoke` 需要 **Electron >= 7**   |
| **推荐使用场景**      | 简单通知、事件广播                         | 需要等待结果的请求（如读文件、数据库查询） |

| 场景                                           | 推荐方式                             |
| ---------------------------------------------- | ------------------------------------ |
| 获取数据（如读文件、查数据库）                 | ✅ `invoke` + `handle`                |
| 触发操作但不需要返回值（如打开窗口、播放音乐） | ✅ `send` + `on`                      |
| 通知类事件（如"用户登录了"）                   | ✅ `send` + `on`（主进程广播）        |
| 需要等待结果的 UI 操作                         | ✅ `invoke` + `handle`                |
| 实时通信、高频事件                             | ✅ `send` + `on`（避免 Promise 开销） |

### 零碎

#### 放入托盘（右下角）

#### 窗口事件

#### Store本地缓存

这个缓存能够在关闭进程后依旧记录导入的信息，可以以键值对的形式实现对关键数据的存储：

```javascript
const Store = require('electron-store');
const store = new Store();

let userId = null;
const initUserId = (_userId) => {
    userId = _userId;
}
const getUserId = () => {
    return userId;
}
const setData = (key, value) => {
    store.set(key, value);
}

const getData = (key) => {
    return store.get(key);
}

// 键值对形式存储
const setUserData = (key, value) => {
    setData(userId + key, value);
}

const getUserData = (key) => {
    return getData(userId + key);
}

const deleteUserData = (key) => {
    store.delete(userId + key);
}

export default {
    initUserId,
    getUserId,
    setData,
    getData,
    setUserData,
    getUserData,
    deleteUserData
}
```



#### pinia的缓存

pinia提供了一套非常好用的vue的工具，有和store效果相近的store可供选择：

 **pinia能够实现关闭页面后的数据缓存**，因为：

- 利用了浏览器的 `localStorage` API
- localStorage 是持久性存储，除非用户手动清除或程序主动删除
- 页面重新加载时可以从 localStorage 恢复数据到 Pinia store

由于项目选择的是eletron，他的内核就是一个谷歌浏览器，所以pinia提供的store也是可以直接使用的。但注意，这一部分是vue特供的，所以需要在renderer渲染器中使用！

```javascript
import { defineStore } from "pinia"
export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    userInfo: {}
  }),
  actions: {
    setInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    getInfo() {
      return this.userInfo;
    }
  }
});
```

注意和eletron的store区分，一个是主线程的，一个是渲染器线程的。