---
title: WebRTC
date: 2026-2-18
---

接口文档：[WebRTC API - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)

简易入门：[WebRTC入门指南WebRTC入门指南：实现浏览器间的实时通信 什么是WebRTC？ WebRTC（Web Real- - 掘金](https://juejin.cn/post/7509367333522964480)

​	[WebRTC入门，这一篇就够了 - 知乎](https://zhuanlan.zhihu.com/p/624357784)

**WebRTC**（Web Real-Time Communication）是一种支持浏览器进行**实时音视频通信**和**任意数据交换**的技术，无需安装插件或第三方软件。它通过一系列 API 实现点对点（P2P）连接。

## **核心概念**

1. **RTCPeerConnection**: 代表本地设备与远程对等方之间的连接，是 WebRTC 的核心接口，负责处理媒体流和数据流的传输。
2. **MediaStream**: 代表媒体流，通常包含一个或多个轨道（`MediaStreamTrack`），如音频轨道和视频轨道。通常通过 `navigator.mediaDevices.getUserMedia()` 获取。
3. **RTCDataChannel**: 代表两个对等方之间的双向数据通道，用于传输任意二进制数据（如文本、文件、游戏状态等）。
4. **信令 (Signaling)**: WebRTC 本身不包含信令服务器。在建立 P2P 连接之前，通信双方需要通过自定义的信令机制（如 WebSocket、HTTP 请求等）交换会话描述协议（SDP）信息和 ICE 候选者（ICE Candidates），以协商连接参数和网络路径。
5. **ICE (Interactive Connectivity Establishment)**: 用于穿透 NAT 和防火墙，找到双方之间最佳的通信路径。涉及 STUN 和 TURN 服务器。

## **基本使用步骤**

建立一个基本的 WebRTC 连接通常遵循以下流程：

1. **创建对等连接对象**:
   双方都创建一个 `RTCPeerConnection` 实例。通常需要配置 STUN/TURN 服务器信息以应对复杂的网络环境。
2. **获取本地媒体流 (可选，针对音视频)**:
   使用 `navigator.mediaDevices.getUserMedia()` 请求用户权限并获取本地的音视频流。
3. **添加媒体流或创建数据通道**:
   - **音视频**: 将获取到的 `MediaStream` 添加到 `RTCPeerConnection` 中（使用 `addTrack` 或旧的 `addStream`）。
   - **数据**: 调用 `createDataChannel()` 创建一个数据通道（仅由发起方调用）。
4. **创建并设置本地描述 (Offer/Answer)**:
   - **发起方 (Caller)**: 调用 `createOffer()` 生成一个 SDP Offer，然后通过 `setLocalDescription()` 将其设置为本地描述。
   - **接收方 (Callee)**: 收到 Offer 后，调用 `setRemoteDescription()` 设置远程描述，然后调用 `createAnswer()` 生成 SDP Answer，再通过 `setLocalDescription()` 设置为本地描述。
5. **交换信令信息**:
   - 当调用 `setLocalDescription` 后，通过监听 `icecandidate` 事件获取 ICE 候选者。
   - 将生成的 SDP (Offer/Answer) 和 ICE 候选者通过信令服务器发送给对方。
   - 收到对方的 SDP 后，调用 `setRemoteDescription()`。
   - 收到对方的 ICE 候选者后，调用 `addIceCandidate()`。
6. **处理远程媒体流**:
   监听 `RTCPeerConnection` 的 `track` 事件。当远程媒体流到达时，该事件会被触发，可以将接收到的轨道添加到本地的 `<video>` 或 `<audio>` 元素中播放。
7. **处理数据通道消息**:
   监听 `RTCDataChannel` 的 `message` 事件来接收对方发送的数据，使用 `send()` 方法发送数据。

## 重要接口

**RTCPeerConnection（核心连接对象）**

| 属性/方法                      | 说明                                | Vue 使用建议                      |
| :----------------------------- | :---------------------------------- | :-------------------------------- |
| `constructor(config)`          | 创建连接实例，配置 STUN/TURN 服务器 | 在 `onMounted` 中初始化           |
| `addTrack(track, stream)`      | 添加媒体轨道到连接                  | 获取媒体流后调用                  |
| `createOffer()/createAnswer()` | 创建 SDP Offer/Answer               | 返回 Promise，用 async/await 处理 |
| `setLocalDescription(desc)`    | 设置本地会话描述                    | 创建 Offer/Answer 后立即调用      |
| `setRemoteDescription(desc)`   | 设置远程会话描述                    | 收到对方 SDP 后调用               |
| `addIceCandidate(candidate)`   | 添加 ICE 候选者                     | 收到对方 ICE 后调用               |
| `ontrack`                      | 监听远程媒体轨道                    | 用箭头函数保持 this 上下文        |
| `onicecandidate`               | 监听 ICE 候选者生成                 | 将 candidate 发送给对方           |
| `onconnectionstatechange`      | 监听连接状态变化                    | 更新 Vue 响应式状态               |
| `close()`                      | 关闭连接                            | 在 `onUnmounted` 中调用           |

**MediaDevices（媒体设备访问）**

| 方法                        | 说明             | 注意事项                 |
| :-------------------------- | :--------------- | :----------------------- |
| `getUserMedia(constraints)` | 获取本地音视频流 | 需要用户授权，HTTPS 环境 |
| `enumerateDevices()`        | 枚举可用媒体设备 | 可用于设备选择功能       |
| `getDisplayMedia()`         | 获取屏幕共享流   | 用于屏幕共享场景         |

**RTCDataChannel（数据传输通道）**

| 方法/事件    | 说明                                      |
| :----------- | :---------------------------------------- |
| `send(data)` | 发送数据（支持字符串、Blob、ArrayBuffer） |
| `onmessage`  | 接收数据事件                              |
| `onopen`     | 通道打开事件                              |
| `onclose`    | 通道关闭事件                              |

## 状态管理

当我们做的是复杂的项目时一般推荐对WebRTC模块额外封装一套便用的**可复用接口**，同时最好使用pinia做好**状态管理**（注意pinia的状态是基于一个vue示例的，基于浏览器内存实现，和localstorage不一样，localstorage更持久：浏览器磁盘存储）因为通话基本上就本次vue的生命周期就可以完成，所以用内存的pinia即可完成。那么我们先来看看状态管理：

```js
import { defineStore } from "pinia"

export const useRTCStore = defineStore('rtc', {
  state: () => ({
    callState: 'idle',
    callType: null,
    remoteUser: null,
    roomId: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isMuted: false,
    isCameraOff: false,
    isScreenSharing: false
  }),
  actions: {
    setCallState(state) {
      this.callState = state;
    },
    setCallType(type) {
      this.callType = type;
    },
    setRemoteUser(user) {
      this.remoteUser = user;
    },
    setRoomId(roomId) {
      this.roomId = roomId;
    },
    setLocalStream(stream) {
      this.localStream = stream;
    },
    setRemoteStream(stream) {
      this.remoteStream = stream;
    },
    setPeerConnection(pc) {
      this.peerConnection = pc;
    },
    setMuted(muted) {
      this.isMuted = muted;
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach(track => {
          track.enabled = !muted;
        });
      }
    },
    setCameraOff(off) {
      this.isCameraOff = off;
      if (this.localStream) {
        this.localStream.getVideoTracks().forEach(track => {
          track.enabled = !off;
        });
      }
    },
    setScreenSharing(sharing) {
      this.isScreenSharing = sharing;
    },
    resetCall() {
      this.callState = 'idle';
      this.callType = null;
      this.remoteUser = null;
      this.roomId = null;
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
      }
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      this.isMuted = false;
      this.isCameraOff = false;
      this.isScreenSharing = false;
    }
  }
});

```







## 二次封装接口

有了自制的状态管理，就可以更加快速便捷的实现对于关键数据的调用了，为了让一些操作能够被复用/追踪，我们再准备一套接口：

```js
import { useRTCStore } from '@/stores/RTCStore'
import Request from './Request.js'
import Api from './Api.js'
import Message from './Message.js'

class WebRTCService {
  constructor() {
    this.peerConnection = null
    this.localStream = null
    this.remoteStream = null
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.hitv.com' },
        { urls: 'stun:stun.chat.bilibili.com' },
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
    this.rtcStore = null
    this.onRemoteStreamCallback = null
    this.onCallEndedCallback = null
    this.onIceCandidateCallback = null
  }

  /**
   * 初始化WebRTC服务
   */
  init() {
    this.rtcStore = useRTCStore()
  }

  /**
   * 获取本地媒体流
   * @param {string} callType - 'audio' | 'video'
   * @returns {MediaStream}
   */
  async getLocalStream(callType) {
    console.log('=== getLocalStream 开始 ===')
    console.log('callType:', callType)
    console.log('当前 localStream:', this.localStream)

    if (this.localStream) {
      console.log('停止之前的本地流')
      this.localStream.getTracks().forEach(track => {
        console.log('停止轨道:', track.kind, track.id)
        track.stop()
      })
      this.localStream = null
    }

    const constraints = { audio: true }
    console.log('初始 constraints:', JSON.stringify(constraints))

    try {
      console.log('开始枚举设备...')
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('枚举到的设备数量:', devices.length)
      
      devices.forEach((d, i) => {
        console.log(`设备[${i}]:`, d.kind, d.label || '(无标签)', d.deviceId)
      })

      const audioDevices = devices.filter(d => d.kind === 'audioinput')
      const videoDevices = devices.filter(d => d.kind === 'videoinput')
      console.log('音频输入设备数量:', audioDevices.length)
      console.log('视频输入设备数量:', videoDevices.length)

      const hasAudio = audioDevices.length > 0
      const hasVideo = videoDevices.length > 0

      if (!hasAudio) {
        console.error('未检测到麦克风设备!')
        throw new Error('未检测到麦克风设备')
      }

      if (callType === 'video' && hasVideo) {
        constraints.video = true
        console.log('启用视频约束')
      } else if (callType === 'video' && !hasVideo) {
        Message.error('未检测到摄像头设备，将无法发送视频画面')
        console.warn('未检测到摄像头设备，将无法发送视频画面')
      }

      console.log('最终 constraints:', JSON.stringify(constraints))
      console.log('开始调用 getUserMedia...')

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('getUserMedia 成功!')
      console.log('localStream id:', this.localStream.id)
      console.log('localStream active:', this.localStream.active)
      
      const tracks = this.localStream.getTracks()
      console.log('获取到的轨道数量:', tracks.length)
      
      tracks.forEach((track, i) => {
        console.log(`轨道[${i}]:`, {
          kind: track.kind,
          id: track.id,
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings: track.getSettings()
        })
      })

      this.rtcStore.setLocalStream(this.localStream)
      console.log('=== getLocalStream 完成 ===')
      return this.localStream
    } catch (error) {
      console.error('=== getLocalStream 失败 ===')
      console.error('错误名称:', error.name)
      console.error('错误消息:', error.message)
      console.error('错误堆栈:', error.stack)
      Message.error('获取本地媒体流失败: ' + error.message)
      if (error.name === 'NotAllowedError') {
        throw new Error('请允许访问麦克风/摄像头')
      } else if (error.name === 'NotFoundError') {
        throw new Error('未找到麦克风/摄像头设备')
      } else if (error.name === 'NotReadableError') {
        throw new Error('设备被其他应用占用')
      }
      throw error
    }
  }

  /**
   * 创建RTCPeerConnection
   * @returns {RTCPeerConnection}
   */
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration)
    this.rtcStore.setPeerConnection(this.peerConnection)

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('生成 ICE candidate:', event.candidate.candidate.substring(0, 50) + '...')
        this.sendIceCandidate(event.candidate)
      }
    }

    this.peerConnection.onicecandidateerror = (event) => {
      console.error('ICE candidate 错误:', event)
    }

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE连接状态:', this.peerConnection.iceConnectionState)
    }

    this.peerConnection.ontrack = (event) => {
      console.log('收到远程轨道:', event.track.kind, 'enabled:', event.track.enabled, 'muted:', event.track.muted, 'readyState:', event.track.readyState)
      console.log('event.streams:', event.streams)
      
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0]
        console.log('使用接收到的原始流')
      } else {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream()
        }
        if (!this.remoteStream.getTracks().find(t => t.id === event.track.id)) {
          this.remoteStream.addTrack(event.track)
          console.log('添加独立轨道到远程流:', event.track.kind, event.track.id)
        }
      }
      
      console.log('远程流当前轨道:', this.remoteStream.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, muted: t.muted })))
      
      this.rtcStore.setRemoteStream(this.remoteStream)
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream)
      }
    }

    this.peerConnection.onconnectionstatechange = () => {
      console.log('连接状态:', this.peerConnection.connectionState)
      if (this.peerConnection.connectionState === 'disconnected' ||
          this.peerConnection.connectionState === 'failed' ||
          this.peerConnection.connectionState === 'closed') {
        if (this.onCallEndedCallback) {
          this.onCallEndedCallback()
        }
      }
    }

    if (this.localStream) {
      console.log('添加本地轨道到连接:', this.localStream.getTracks().map(t => t.kind))
      this.localStream.getTracks().forEach(track => {
        const sender = this.peerConnection.addTrack(track, this.localStream)
        console.log('添加轨道成功:', track.kind, 'sender:', sender ? 'created' : 'null')
      })
      
      const audioTracks = this.localStream.getAudioTracks()
      const videoTracks = this.localStream.getVideoTracks()
      console.log('本地流轨道统计 - 音频:', audioTracks.length, '视频:', videoTracks.length)
    } else {
      console.warn('本地流不存在，无法添加轨道')
    }

    const transceivers = this.peerConnection.getTransceivers()
    console.log('当前 transceivers 数量:', transceivers.length)
    transceivers.forEach((t, i) => {
      console.log(`transceiver[${i}]:`, {
        mid: t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection,
        senderTrack: t.sender.track?.kind,
        receiverTrack: t.receiver.track?.kind
      })
    })

    return this.peerConnection
  }

  /**
   * 创建并发送Offer（主叫方）
   * @param {string} roomId - 房间ID
   * @param {string} toUserId - 目标用户ID
   */
  async createOffer(roomId, toUserId) {
    console.log('=== createOffer 开始 ===')
    console.log('roomId:', roomId, 'toUserId:', toUserId)
    console.log('当前 peerConnection:', this.peerConnection ? 'exists' : 'null')
    
    if (!this.peerConnection) {
      console.log('创建新的 PeerConnection')
      this.createPeerConnection()
    }

    this.rtcStore.setRoomId(roomId)

    console.log('创建 offer...')
    const offer = await this.peerConnection.createOffer()
    console.log('offer 创建成功, type:', offer.type)
    
    console.log('设置 localDescription...')
    await this.peerConnection.setLocalDescription(offer)
    console.log('localDescription 设置完成')

    console.log('发送 offer 信令...')
    await this.sendSignal({
      type: 'offer',
      toUserId: toUserId,
      roomId: roomId,
      sdp: offer.sdp
    })
    console.log('=== createOffer 完成 ===')

    this.rtcStore.setCallState('calling')
  }

  /**
   * 创建并发送Answer（被叫方）
   * @param {string} sdp - 收到的offer sdp
   * @param {string} roomId - 房间ID
   * @param {string} toUserId - 目标用户ID
   */
  async createAnswer(sdp, roomId, toUserId) {
    console.log('=== createAnswer 开始 ===')
    console.log('roomId:', roomId, 'toUserId:', toUserId)
    console.log('当前 peerConnection:', this.peerConnection ? 'exists' : 'null')
    
    if (!this.peerConnection) {
      console.log('创建新的 PeerConnection')
      this.createPeerConnection()
    }

    this.rtcStore.setRoomId(roomId)

    console.log('设置 remoteDescription (offer)...')
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    }))
    console.log('remoteDescription 设置完成')

    console.log('创建 answer...')
    const answer = await this.peerConnection.createAnswer()
    console.log('answer 创建成功, type:', answer.type)
    
    console.log('设置 localDescription...')
    await this.peerConnection.setLocalDescription(answer)
    console.log('localDescription 设置完成')

    console.log('发送 answer 信令...')
    await this.sendSignal({
      type: 'answer',
      toUserId: toUserId,
      roomId: roomId,
      sdp: answer.sdp
    })
    console.log('=== createAnswer 完成 ===')

    this.rtcStore.setCallState('connected')
  }

  async handleAnswer(sdp) {
    console.log('=== handleAnswer 开始 ===')
    console.log('当前 peerConnection:', this.peerConnection ? 'exists' : 'null')
    
    if (this.peerConnection) {
      console.log('设置 remoteDescription (answer)...')
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      }))
      console.log('remoteDescription 设置完成')
      console.log('=== handleAnswer 完成 ===')
      this.rtcStore.setCallState('connected')
    } else {
      console.error('handleAnswer: peerConnection 不存在!')
    }
  }

  async addIceCandidate(candidate) {
    console.log('=== addIceCandidate ===')
    console.log('candidate:', candidate.candidate?.substring(0, 50) + '...')
    console.log('当前 peerConnection:', this.peerConnection ? 'exists' : 'null')
    console.log('remoteDescription:', this.peerConnection?.remoteDescription ? 'set' : 'not set')
    
    if (this.peerConnection) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        console.log('ICE candidate 添加成功')
      } catch (e) {
        console.error('添加 ICE candidate 失败:', e)
      }
    }
  }

  /**
   * 发送ICE候选
   * @param {RTCIceCandidate} candidate - ICE候选
   */
  async sendIceCandidate(candidate) {
    const toUserId = this.rtcStore.remoteUser?.contactId
    const roomId = this.rtcStore.roomId

    if (!toUserId || !roomId) {
      console.error('缺少必要参数')
      return
    }

    await this.sendSignal({
      type: 'candidate',
      toUserId: toUserId,
      roomId: roomId,
      candidate: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex
      }
    })
  }

  /**
   * 发送信令到服务器
   * @param {Object} signalData - 信令数据
   */
  async sendSignal(signalData) {
    try {
      const result = await Request({
        url: Api.webrtcSignal,
        method: 'POST',
        params: signalData,
        showLoading: false,
        dataType: 'json'
      })
      return result
    } catch (error) {
      console.error('发送信令失败:', error)
    }
  }

  /**
   * 切换麦克风
   * @param {boolean} muted - 是否静音
   */
  toggleAudio(muted) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted
      })
      this.rtcStore.setMuted(muted)
    }
  }

  /**
   * 切换摄像头
   * @param {boolean} off - 是否关闭
   */
  toggleVideo(off) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !off
      })
      this.rtcStore.setCameraOff(off)
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop())
      this.remoteStream = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    this.rtcStore?.resetCall()
  }

  /**
   * 设置远程流回调
   * @param {Function} callback - 回调函数
   */
  onRemoteStream(callback) {
    this.onRemoteStreamCallback = callback
  }

  /**
   * 设置通话结束回调
   * @param {Function} callback - 回调函数
   */
  onCallEnded(callback) {
    this.onCallEndedCallback = callback
  }

  /**
   * 设置ICE候选回调
   * @param {Function} callback - 回调函数
   */
  onIceCandidate(callback) {
    this.onIceCandidateCallback = callback
  }
}

export default new WebRTCService()

```

然后就可以直接在view组件里面直接import并使用了。

## 注意事项

### 本地设备无法与其他应用进程共享

麦克风，摄像头是无法共享的，所以一台电脑上测不了请注意！

> 那为什么WebRTC在页面上做实验的时候可以多开？
>
> | 特性     | 浏览器多标签页                     | Electron 多实例                  |
> | :------- | :--------------------------------- | :------------------------------- |
> | 进程架构 | 多标签页共享**同一个媒体服务进程** | 每个 Electron 实例是**独立进程** |
> | 设备句柄 | 浏览器内部统一管理，**只申请一次** | 每个实例都向系统**单独申请**     |
> | 结果     | ✅ 可以共享摄像头                   | ❌ 第二个实例会被拒绝             |



### 远程流直接使用对方提供的

有很多配置创建自己的再配不够用，直接track拿到就装配好即可：

```js
    this.peerConnection.ontrack = (event) => {
      console.log('收到远程轨道:', event.track.kind, 'enabled:', event.track.enabled, 'muted:', event.track.muted, 'readyState:', event.track.readyState)
      console.log('event.streams:', event.streams)
      
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0]
```



### 远程音视频流直接使用传输的stream

在bindRemoteStream的时候直接使用远程提供的，不要自己new！

```js
this.peerConnection.ontrack = (event) => {
      console.log('收到远程轨道:', event.track.kind, 'enabled:', event.track.enabled, 'muted:', event.track.muted, 'readyState:', event.track.readyState)
      console.log('event.streams:', event.streams)
      
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0]
        console.log('使用接收到的原始流')
      } else {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream()
        }
        if (!this.remoteStream.getTracks().find(t => t.id === event.track.id)) {
          this.remoteStream.addTrack(event.track)
          console.log('添加独立轨道到远程流:', event.track.kind, event.track.id)
        }
      }
      
      console.log('远程流当前轨道:', this.remoteStream.getTracks().map(t => ({ kind: t.kind, id: t.id, enabled: t.enabled, muted: t.muted })))
      
      this.rtcStore.setRemoteStream(this.remoteStream)
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream)
      }
    }
```

> 这里使用赋值就行（不用考虑音视频的两条道）是因为WebRTC分两次传输媒体流，第一次一般是音频，第二次两个媒体流其实都在里面（流式传输）



### 发起方没法正确获取接收方响应的媒体流

是可以正常连接，接收方拿到的媒体流是没有毛病的（媒体流是正常传输的）。

**问题根因分析**

Answer 的 SDP 不匹配

**流程对比**

```
┌─────────────────────────────────────────────────────────────────┐
│                    发起方 → 接收方 (成功 ✓)                       │
├─────────────────────────────────────────────────────────────────┤
│ 发起方 Offer:                                                   │
│   m=audio: sendrecv (有 audioTrack)                            │
│                                                                 │
│ 接收方处理:                                                      │
│   1. setRemoteDescription(offer) ✓                             │
│   2. audio transceiver.receiver 被激活                          │
│   3. ontrack 触发，收到音频 ✓                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    接收方 → 发起方 (失败 ✗)                       │
├─────────────────────────────────────────────────────────────────┤
│ 接收方 Answer (旧代码问题):                                      │
│   m=audio: sendrecv (有 audioTrack) ✓                          │
│   m=video: sendrecv (sender.track = null!) ✗                   │
│                                                                 │
│ 发起方处理:                                                      │
│   1. setRemoteDescription(answer)                              │
│   2. 发现 video m-line 但自己没有请求视频                         │
│   3. SDP 协商出现不一致                                          │
│   4. ontrack 不触发 ✗                                           │
└─────────────────────────────────────────────────────────────────┘
```

核心问题：多余的 video m-line

**发起方的 Offer（音频通话）：**

```
v=0
...
m=audio 9 RTP/AVP 111  ← 只有音频
a=rtpmap:111 opus/48000/2
a=sendrecv
```

**接收方的 Answer（旧代码）：**

```
v=0
...
m=audio 9 RTP/AVP 111
a=rtpmap:111 opus/48000/2
a=sendrecv  ← 正常

m=video 0 RTP/AVP 96  ← 多余的！发起方没有请求
a=rtpmap:96 H264/90000
a=sendrecv  ← 问题！想发送视频但没有 track
```

为什么这会导致发起方收不到媒体？

#### **原因1：SDP 协商不一致**

```
发起方期望：
  - 只协商 audio
  - 没有 video 的接收能力准备

接收方 Answer：
  - 协商了 audio + video
  - video 部分声明 sendrecv 但实际无法发送
```

这种不一致可能导致：

- WebRTC 实现认为协商有问题
- 媒体流传输被阻塞

#### **原因2：Transceiver 方向冲突**

```js
// 发起方（音频通话）
transceivers: [
  { kind: 'audio', direction: 'sendrecv' }  // 只有这一个
]

// 接收方 Answer 后，发起方收到：
// "你想发送视频给我？但我没有 video transceiver！"
// WebRTC 可能拒绝或忽略这个不匹配的媒体
```

#### **原因3：ICE 候选绑定问题**

多余的 video m-line 会生成额外的 ICE 候选，但这些候选可能：

- 绑定到错误的组件
- 导致连接状态异常

为什么接收方能收到发起方的媒体？

因为**接收方有 audio transceiver 的 receiver**：

```js
// 接收方（旧代码）
transceivers: [
  { kind: 'audio', direction: 'sendrecv', receiver: RTCRtpReceiver },  // 有接收器
  { kind: 'video', direction: 'sendrecv', receiver: RTCRtpReceiver }   // 也有接收器
]

// 发起方发送 audio
// 接收方的 audio receiver 可以接收 ✓
```

**接收方的 receiver 是正常工作的**，所以能收到发起方的媒体。

为什么发起方收不到接收方的媒体？

因为**发起方没有 video transceiver**，而且 **audio 的协商可能被 video 的异常影响**：

```js
// 发起方
transceivers: [
  { kind: 'audio', direction: 'sendrecv' }  // 只有这个
]

// 接收方 Answer 说："我要发送 audio + video"
// 发起方：我没有 video transceiver，怎么接收？
// 可能的结果：整个协商被认为有问题，audio 也受影响
```

#### 图解

```
                    旧代码问题
                        
发起方                              接收方
   │                                  │
   │  Offer (只有 audio)              │
   │ ──────────────────────────────> │
   │                                  │ 创建 audio + video transceiver
   │                                  │ addTrack(audioTrack) 
   │                                  │
   │  Answer (audio + video)          │
   │ <────────────────────────────── │
   │                                  │
   │ "video? 我没请求啊！"             │
   │ 协商可能出问题                     │
   │                                  │
   │  ontrack 不触发 ✗                │  ontrack 触发 ✓
   │                                  │
   │         媒体流传输                │
   │ <══════════════════════════════ │  ✗ 被阻塞
   │                                  │
   │         媒体流传输                │
   │ ═══════════════════════════════> │  ✓ 正常
   │                                  │  ontrack 触发 ✓
```

#### 代码方面原因

| 问题                          | 原因                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| 发起方收不到接收方的音频/视频 | addTransceiver 强制创建了多余的 transceiver，导致 SDP 协商时方向不匹配 |
| 接收方有"幽灵"视频轨道        | 手动创建的 video transceiver receiver 被激活，但没有实际的视频流 |
| ICE 连接状态显示 connected    | ICE 连接成功 ≠ 媒体流传输成功，SDP 协商问题会导致媒体流无法传输 |

#### Transceiver 是什么？
Transceiver（收发器）是 WebRTC 中管理媒体轨道的核心概念：

```
Transceiver = Sender + Receiver
              ↓         ↓
           发送轨道   接收轨道
```
每个 transceiver 对应 SDP 中的一个 m= 行（媒体描述）。

#### addTrack vs addTransceiver 的区别

```js
// 方式1: addTrack - 推荐
// 自动创建 transceiver，轨道和 transceiver 一一对应
peerConnection.addTrack(audioTrack, stream)
// 结果：创建 1 个 audio transceiver，sender.track = 
audioTrack

// 方式2: addTransceiver - 手动创建
// 先创建空的 transceiver，再尝试关联轨道
peerConnection.addTransceiver('audio', { direction: 
'sendrecv' })
peerConnection.addTransceiver('video', { direction: 
'sendrecv' })
// 结果：创建 2 个 transceiver，但 sender.track 都是 null
```

#### 解决方案

```js
createPeerConnection() {
  // 只用 addTrack，让 WebRTC 自动创建需要的 transceiver
  if (this.localStream) {
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream)
    })
  }
}
```

```
发起方:
- addTrack(audioTrack) → 创建 1 个 audio transceiver
- SDP: m=audio sendrecv

接收方:
- addTrack(audioTrack) → 创建 1 个 audio transceiver  
- SDP: m=audio sendrecv

结果: 完美匹配！✓
```

```
发起方:
- addTrack(audioTrack) → 创建 audio transceiver
- addTrack(videoTrack) → 创建 video transceiver
- SDP: m=audio, m=video

接收方:
- addTrack(audioTrack) → 创建 audio transceiver
- addTrack(videoTrack) → 创建 video transceiver
- SDP: m=audio, m=video

结果: 完美匹配！✓
```

**核心原则 ：**永远让 **addTrack** 自动创建 transceiver，**不要手动 addTransceiver** ，这样可以确保双方的 SDP 完全匹配；不要混用 addTransceiver 和 addTrack ，只用 addTrack 让 WebRTC 自动管理 transceiver。

#### 总结

| 方向            | 结果   | 原因                                                         |
| --------------- | ------ | ------------------------------------------------------------ |
| 发起方 → 接收方 | ✓ 成功 | 接收方有对应的 receiver，可以接收                            |
| 接收方 → 发起方 | ✗ 失败 | Answer 中多余的 video m-line 导致协商不一致，发起方无法正确处理 |

**不是"解析有问题"，而是"协商不一致导致媒体流传输被阻塞"**。WebRTC 要求双方的 SDP 必须匹配，多余的或缺失的 m-line 都可能导致问题。
