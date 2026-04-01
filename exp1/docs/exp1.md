🧪实验 1：搭一个“最小可观测” WebRTC 实验台

目标不是做产品，而是做一个可反复复现实验的小系统。

建议配置：

两个浏览器页面互通音视频
极简信令服务
每秒采集一次 getStats()
保存为日志或 CSV
能同时抓包

你甚至可以直接借助官方的 peer connection / ICE 示例验证连通性与 candidate 收集过程。官方的 Trickle ICE 示例会用指定的 ICEServers 创建 PeerConnection，并把收集到的 candidate 展示出来；官方 peer connection 文档也说明了 RTCPeerConnection 会进行 ICE candidate gathering。

这个实验最重要的不是“页面做得多漂亮”，而是你要把这些指标采出来：

candidate 类型
选中的 candidate pair
RTT
packets lost
jitter
发送/接收码率
帧率和播放状态

这些指标的来源就是标准 RTCStatsReport。

产出要求：

一份 stats 日志
一段抓包
一页纸说明：这次连通走的是什么 candidate，RTT/jitter 大概是多少
