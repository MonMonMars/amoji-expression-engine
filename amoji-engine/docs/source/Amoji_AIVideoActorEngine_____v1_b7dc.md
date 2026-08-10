# Amoji AI Video Actor Engine —— 技術對接規格

## 正式命名同定位
你提出嘅命名準確咁描述咗呢條產品線嘅本質:AI Video Actor Engine——一個
讀劇本、用低多邊形即時3D演出嘅「AI演員」引擎,專門服務AI影片生成平台。呢個
命名比之前「表情控制信號供應商」仲要傳神——你哋唔係賣一堆數值,你哋賣緊嘅
係一個識演戲嘅演員。

同之前「低多邊形似真但假路線」文件完美銜接——「低多邊形即時3D」正正係
已經研究證實嘅、容錯率最闊、渲染成本最低嘅路線,啱晒俾影片生成平台做
即時conditioning(即時演算,唔係預渲染,速度優先)。

---

## Part 1:控制信號嘅兩種輸出模式

### 模式一:逐幀 Blendshape 權重序列(啱ARKit相容pipeline)
```
{
  "format": "amoji-blendshape-sequence-v1",
  "frameRate": 24,
  "duration": 3.5,
  "frames": [
    { "t": 0.0, "blendshapes": { "browInnerUp":0.0, "mouthSmileLeft":0.1, "jawOpen":0.05 } },
    { "t": 0.042, "blendshapes": { "etc": "etc" } }
  ]
}
```

### 模式二:關鍵幀 AU(動作單元)強度時間軸(輕量,啱做高層次控制)
```
{
  "format": "amoji-au-keyframes-v1",
  "keyframes": [
    { "t": 0.0, "emotion": "neutral", "auIntensities": { "AU1":0, "AU4":0, "AU12":0 } },
    { "t": 1.2, "emotion": "suspicious", "auIntensities": { "AU4":0.4, "AU14":0.6 } },
    { "t": 2.8, "emotion": "happy", "auIntensities": { "AU6":0.9, "AU12":1.0 } }
  ],
  "interpolation": "step-out-curve"
}
```
interpolation:"step-out-curve" 對應 Alba Emoting Step-Out過渡曲線研究——
你哋提供嘅唔止係數值,仲有「點樣過渡」,呢個係業界純audio-driven方案做唔到嘅。

---

## Part 2:解決 Higgsfield 三大痛點嘅具體技術對應

| Higgsfield痛點(原話) | Amoji解決方案 |
|---|---|
| 僵硬冇變化嘅表情 | Layer I待機系統:呼吸/眨眼/微掃視持續輸出,唔存在完全靜止嘅幀 |
| 表情喺30秒後開始循環 | 多變體隨機輪換邏輯,可壓縮應用去更短片段 |
| 懷疑/分心/諷刺呢類細膩情緒傳遞唔準確 | 複合情緒引擎(區域分工,而唔係線性平均) |
| 聲音語氣同塊面對唔上 | Layer 1統一情緒值同時驅動表情+未來語氣參數,共享同一情緒來源 |
| 同一角色喺唔同段落判若兩人 | Layer -1心情引擎提供跨片段情緒連續性 |

---

## Part 3:整合流程
```
Step 1:客戶提供劇本/情緒指令
Step 2:AI Video Actor Engine處理,輸出模式一/二嘅JSON控制信號
Step 3:客戶自己嘅影片生成pipeline,將信號當conditioning輸入
Step 4:客戶模型生成實際影片畫面
```
Amoji責任範圍止於Step 2——Step 3、4屬於客戶技術棧。

## Part 4:API 介面草案
```
POST /v1/generate-actor-performance
{
  "script": [{ "text":"你嘅提案畀拒絕咗。", "emotionHint":"neutral" }],
  "outputFormat": "blendshape-sequence 或 au-keyframes",
  "frameRate": 24,
  "renderTier": "low-poly-realtime",
  "personaId": "default"
}
```

## 下一步
1. 想我做一個 prototype,由一段文字劇本實際產生blendshape序列JSON樣本?
2. 定係想搵吓仲有邊啲AI影片生成平台可以做接觸目標(唔止Higgsfield一間)?
