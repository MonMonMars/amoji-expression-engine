# Amoji Emotion Protocol (AEP) v0.1 —— 公開協議規格文件(草稿）

**授權條款(License):本協議規格文件採用 [Creative Commons Attribution 4.0
International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/) 授權
——任何人都可以自由分享、改編、商業使用呢份規格,唯一要求係標明出處
(「基於 Amoji Emotion Protocol」)。此授權僅適用於本協議規格文件本身,唔
延伸至 Amoji 引擎嘅參考實現代碼(參考實現嘅授權條款獨立處理,見開源牌照
比較文件)。**

仿照 HTTP/MIDI 呢類協議文件嘅寫法:呢份文件定義嘅係「資料格式同介面」,唔係
「實現方式」——任何人都可以根據呢份規格,寫自己嘅實現,但實現嘅品質(即係
心理學/解剖學根據幾紮實)由各自負責,Amoji 引擎係官方參考實現。

---

## 0. 狀態
呢份係草稿(Draft)版本,版本號 v0.1,對應返之前 Layer 1 嘅設計。正式發佈前
建議搵開源治理經驗嘅顧問審閱格式慣例(例如仿照 IETF RFC 嘅章節結構)。

## 1. 範圍(Scope)
AEP 定義咗一套與渲染引擎無關嘅資料格式,用嚟喺「決定角色情緒」嘅系統(例如
對話AI/劇本引擎)同「將情緒轉化做視覺/機械輸出」嘅系統(例如Amoji引擎或者
其他實現)之間,傳遞情緒資訊。AEP 本身唔規定點樣渲染表情,只係規定「表達
呢個決定」用嘅共同語言。

## 2. 核心資料結構

### 2.1 EmotionState(必要欄位)
```json
{
  "emotion": "happy",
  "intensity": 0.7,
  "valence": 0.7,
  "arousal": 0.5
}
```
| 欄位 | 型別 | 範圍 | 說明 |
|---|---|---|---|
| emotion | string | 見附錄A分類清單 | 主要情緒分類(基礎8種或複合情緒) |
| intensity | float | 0.0-1.0(容許>1.0做誇張模式) | 情緒強度,0=中性,1.0=人類生理極限 |
| valence | float | -1.0至1.0 | 情緒效價(負面至正面),用喺唔支援完整
表情系統嘅簡化渲染器(例如發光體介面) |
| arousal | float | 0.0-1.0 | 喚醒/激活程度,獨立於效價(例如恐懼同
憤怒都係負valence但高arousal) |

### 2.2 CompoundEmotionState(選用,擴充複合情緒)
```json
{
  "primary": {"emotion":"surprised","regionWeight":0.5},
  "secondary": {"emotion":"happy","regionWeight":0.5},
  "regionMapping": "upper-lower"
}
```

### 2.3 MoodState(選用,背景心情偏壓)
```json
{ "baselineValence": -0.2, "baselineArousal": 0.1, "decayRate": 0.05 }
```

### 2.4 CharacterArchetype(選用,對應Layer CA)
```json
{
  "archetypeId": "quadruped-mammal",
  "availableChannels": ["earPosition","tailPosition","tailMotion","bodyPosture","eyeState"],
  "forbiddenChannels": ["mouthCornerSmile"]
}
```

### 2.5 SpeechPacing(選用,擴充聲學節奏)
```json
{
  "rateMultiplier": 1.3,
  "pauseRatio": 0.6,
  "prePausePlacement": "before-key-phrase",
  "fillerBias": "uh-over-um"
}
```
由 arousal/dominance 公式推導(見講嘢速度與停頓研究文件):
```
speechRate = baseRate * (1 + arousal * rateMultiplier - dominance * 0.1)
pauseRatio = basePauseRatio * (1 - arousal * pauseReductionFactor)
```

## 3. 時序事件(Temporal Events)
```json
{ "eventType": "blink", "timestamp": 1234.5 }
{ "eventType": "microLeak", "region": "eyes", "durationMs": 80 }
{ "eventType": "latencyBridge", "tier": "1-3s", "action": "pensive_filler" }
```

## 4. 一致性規則(Conformance Rules)

### 4.1 必要行為
實現 AEP 嘅系統,必須:
- 對相同輸入嘅 EmotionState,喺相同 CharacterArchetype 下產生一致(可重現)嘅
輸出(呼應恐怖谷一致性研究)
- 支援至少附錄A嘅8個基礎情緒分類

### 4.2 強度超出範圍嘅處理
intensity > 1.0 代表要求超出人類生理極限嘅誇張表現(例如卡通/機械人風格)。
實現可以選擇支援或者拒絕(clamp返1.0),但必須喺文件講明自己嘅行為。

### 4.3 合規事件(建議但非強制於協議層)
```json
{ "eventType": "complianceCheck", "type": "crisisIntervention", "priority": "override" }
```
呢類事件屬於建議性擴充,協議本身唔強制要求實現合規邏輯(合規要求由部署地區
法規決定,唔屬於AEP範圍),但建議所有實現都預留呢個事件類型嘅處理介面。

## 附錄A:基礎情緒分類清單(v0.1)
```
happy, sad, angry, fear, surprised, disgust, thinking, suspicious
```
複合情緒建議以 "primary+secondary" 組合命名(例如 "happily_surprised"),
命名慣例參考 Du & Martinez (2014) 21類複合情緒分類。

## 附錄B:同業界既有標準嘅關係
AEP 唔取代 ARKit 52 blendshapes——兩者屬於協議棧嘅唔同層級:AEP 定義「情緒
決策層」(呢個角色而家應該有咩感受),ARKit 定義「幾何輸出層」(臉部要郁成
點樣)。一個完整實現可以係:AI決策 → AEP格式 → Amoji引擎(或者其他AEP實現)
→ ARKit blendshapes → 3D渲染。

## 治理決定(已確認)
- ✅ 協議本身:CC-BY 4.0(已確認採用)
- Amoji 官方參考實現(引擎代碼)牌照獨立處理,見開源牌照比較文件
