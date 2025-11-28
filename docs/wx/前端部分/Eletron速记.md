---
title: Eletron速记
date: 2025-11-28
---

官方文档：[简介 | Electron](https://www.electronjs.org/zh/docs/latest/)/[介绍 | Electron 框架](https://electron.js.cn/docs/latest/)

### 渲染线程vue与主线程

主线程才能和本地交互

ipcRenderer与ipcMain

**on**与**send**

需要回调函数且不需要返回值（异步即可）

**handle**与**invoke**（双向通信）

需要返回值（且请求线程会等待返回值，也就是说可以实现阻塞同步）

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
| 通知类事件（如“用户登录了”）                   | ✅ `send` + `on`（主进程广播）        |
| 需要等待结果的 UI 操作                         | ✅ `invoke` + `handle`                |
| 实时通信、高频事件                             | ✅ `send` + `on`（避免 Promise 开销） |

Electron主线程的`send`可以一次通知多个渲染进程。

1. **使用`webContents.getAllWebContents()`遍历所有渲染进程**

   ```javascript
   const { webContents } = require('electron')
   
   // 向所有渲染进程发送消息
   webContents.getAllWebContents().forEach(webContent => {
     if (!webContent.isDestroyed()) {
       webContent.send('channel-name', data)
     }
   })
   ```
   
2. **使用`BrowserWindow.getAllWindows()`遍历所有窗口**

   ```javascript
   const { BrowserWindow } = require('electron')
   
   // 向所有窗口的渲染进程发送消息
   BrowserWindow.getAllWindows().forEach(window => {
     window.webContents.send('channel-name', data)
   })
   ```
   
3. **向特定频道的所有监听者广播**

   ```javascript
   // 可以在处理函数中向多个渲染进程发送消息
   ipcMain.on('broadcast-message', (event, data) => {
     BrowserWindow.getAllWindows().forEach(window => {
       window.webContents.send('receive-broadcast', data)
     })
   })
   ```

注意主线程send需要指明对应的渲染线程的sender，渲染线程的多个组件共享来自主线程的消息

#### 渲染线程与组件

一个渲染线程其实就是一个vue实例，而一个vue实例中的所有组件都共用一个渲染线程（但注意！一个组件未打开时是无法接收主线程的消息的！所以对于公共的消息，请尽量使用一直在使用的组件来监听以防bug）

#### 渲染线程（组件）之间的交互

注意渲染线程之间是无法自动通信的（ipcRenderer之间无法通行），必须要通过主线程来进行信息转发传递，注意组件之间也是一样的！（当然组件之间可以通过父子参数，emit回调，pinia状态管理通信）

可以选择以下方式来实现组件之间的交互

1. **通过主进程中转** - 主进程负责消息路由
2. **使用状态管理** - 如Pinia/Vuex统一管理状态
3. **Vue事件总线** - 使用mitt等库实现组件间通信
4. **props和emit** - 父子组件标准通信方式

#### 渲染器与本地sqlite的交互

通过主线程的方式来实现与本地sqlite数据库的交互（准备好jdbc模版以及DAO类，只需要调用方法即可实现数据的缓存）



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

#### dialog实现文件打开器

```javascript
/**
 * 修改文件所在目录
 */
const changeLocalFolder = async () => {
	let settingInfo = await selectSettingInfo(store.getUserId());
	const sysSetting = JSON.parse(settingInfo.sysSetting);
	let localFileFolder = sysSetting.localFileFolder;
	const options = {
		properties: ['openDirectory'],
		defaultPath: localFileFolder
	};
	let result = await dialog.showOpenDialog(options);
	if (result.canceled) {
		return;
	}
};
```

使用dialog来打开文件选择器，其会返回选择的路径。
