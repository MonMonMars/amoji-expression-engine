# Amoji Emotion Protocol(AEP)v1.0 —— 公開協議規格文件

## 文件狀態
呢份文件定義咗一套開放、免費、任何人都可以實現嘅AI情緒表達交換格式,仿照
IETF RFC / W3C 規格文件嘅撰寫慣例。呢個協議本身唔受版權/專利限制,任何人
都可以自由實現(implement)——Amoji Inc. 保留「Amoji」品牌名同官方參考實現
(reference implementation)嘅權利,但協議本身唔屬於任何一方獨佔。

---

## 1. 概述(Overview)
Amoji Emotion Protocol(AEP)定義咗一套標準化嘅資料格式,用嚟喺「情緒決策端」
(通常係一個對話AI/LLM)同「表情表現端」(渲染引擎、機械人控制系統)之間傳遞
情緒語意資訊。AEP 刻意保持「表現無關」(presentation-agnostic)——同一個AEP
訊息,可以驅動由簡單發光體到寫實3D人臉、由人類角色到機械人嘅任何呈現形式。

## 2. 設計原則
```
2.1 抽象優先(Abstraction First)
    AEP 訊息只包含抽象語意標籤(情緒類別、強度數值),唔包含任何實現細節
    (唔規定「用邊條肌肉」、「用邊個渲染器」)

2.2 生物特徵隔離(Biometric Isolation)
    AEP 訊息結構上唔容許夾帶原始生物特徵數據(鏡頭畫面、音頻波形、生理
    感測器讀數)——呢個係協議層面嘅強制規範,唔止係實現建議

2.3 向後相容(Backward Compatibility)
    新版本協議必須保持對舊版本訊息嘅解讀能力,允許漸進式升級

2.4 呈現無關(Presentation Agnostic)
    協議唔規定接收端點樣呈現——由發光體、2D卡通、3D寫實、到實體機械人,
    全部都係合法嘅AEP接收端實現
```

## 3. 核心資料結構

### 3.1 EmotionFrame(情緒幀,協議嘅基本單位)
```
{
  "aep_version": "1.0",
  "timestamp": "ISO-8601",
  "emotion": {
    "primary": "happy | sad | angry | fear | surprised | disgust | thinking | suspicious",
    "compound": ["happy", "surprised"],
    "intensity": 0.0,
    "valence": -1.0,
    "arousal": 0.0
  },
  "mood_bias": {
    "background_valence": 0.0,
    "duration_hint": "transient | sustained"
  },
  "context": {
    "situation": "dyadic | presentation | idle | camera",
    "persona_tags": ["companion", "corporate", "care", "education", "home"]
  }
}
```

### 3.2 欄位定義
| 欄位 | 類型 | 必填 | 說明 |
|---|---|---|---|
| emotion.primary | enum | 是 | 8個基礎情緒類別之一 |
| emotion.compound | array | 否 | 複合情緒嘅組成情緒(最多2個) |
| emotion.intensity | float [0,無限) | 是 | 0=中性,1=人類生理極限,>1=誇張(接收端可自行決定是否容許) |
| emotion.valence | float [-1,1] | 否 | 情緒效價,俾冇對應特定情緒類別嘅簡化接收端使用 |
| emotion.arousal | float [0,1] | 否 | 喚醒度,同上 |
| mood_bias | object | 否 | 背景心情偏壓,持續性情緒基線調整 |
| context.situation | enum | 否 | 情境模式提示,俾接收端決定眼神/身體行為邏輯 |

### 3.3 禁止欄位(協議層面明文禁止)
```
以下欄位類型,任何AEP合規實現都唔可以定義或者接受:
- 原始影像/視訊數據(raw_camera_frame, video_buffer 等)
- 原始音頻波形(raw_audio_waveform)
- 生理感測器原始讀數(heart_rate_raw, gsr_raw 等)

如果實現需要根據呢類數據推斷情緒,呢個推斷邏輯必須發生喺AEP協議邊界之外,
由外部系統轉換做上述合規嘅EmotionFrame先傳入
```

## 4. 合規等級(Conformance Levels)
```
Level A(基礎合規)——支援 emotion.primary + emotion.intensity 最基本欄位
Level B(標準合規)——加埋支援 compound、valence、arousal
Level C(完整合規)——加埋支援 mood_bias、context,並且實現「生物特徵隔離」
                     嘅強制驗證(即係第3.3節提到嘅禁止欄位檢查)
```

## 5. 版本演進政策
協議版本號跟 Semantic Versioning——大版本號變動代表破壞性改動,細版本號
變動保證向後相容。Amoji Inc. 承諾核心協議(第3、4節)喺可見將來保持穩定,
擴充功能會以「可選擴充欄位」形式加入,唔會破壞現有實現。

## 6. 商標同實現聲明
"Amoji" 名稱同標誌屬於 Amoji Inc. 商標。任何實現咗本協議嘅第三方系統,可以
聲明「AEP 相容」(AEP-compliant),但唔可以聲稱係「Amoji」官方產品,除非
獲得正式授權。Amoji Inc. 提供嘅官方參考實現(Amoji Engine)包含超出本協議
基礎範圍嘅進階功能(複合情緒演算法、心情引擎、合規三機制、多物種角色原型等),
呢啲屬於商業產品,唔包含喺本協議嘅免費開放範圍內。

## 下一步
1. 想我而家做第二部分——開源牌照(AGPLv3 vs Elastic License 2.0 vs BSL)嘅
詳細法律比較,俾你決定「參考實現」(reference implementation)用邊種牌照?
