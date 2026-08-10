# Lilith Expression DNA —— 總系統規格 v1
## 「AI 導演/編劇 → 劇本 → 機械人演員演出」完整 Pipeline

本文件整合之前所有研究同設計(點位系統、情緒表、微表情、好萊塢技術、演員訓練研究),
並加入新架構:將 AI 定位做「編劇/導演」,機械人定位做「演員」——呢個對應正正就係
真實電影製作嘅分工模式。

---

## 0. 核心比喻:電影/劇場製作分工

| 電影製作角色 | 職責 | 對應你套系統 |
|---|---|---|
| 編劇 (Screenwriter) | 寫對白 + 情緒/舞台指示 | AI 語言模型(生成對白 + 情緒標籤) |
| 導演 (Director) | 詮釋劇本、俾演員方向、決定節奏 | AI 語言模型(生成 mood/pacing 指示) |
| 演員 (Actor) | 跟劇本演出,同時加入自己嘅細節、反應、臨場發揮 | 機械人 / Lilith 表情引擎 |
| 場記/場務 | 確保連戲(emotional continuity) | Actor's Discretion Engine(見 Part D) |

**關鍵原則**(源自 Andy Serkis 訪談):<cite index="67-1">「點樣建立一個角色嘅心理狀態、情緒內容,呢個過程係一樣嘅」</cite>——即係話,劇本負責「講咩」,演員負責「點樣講、點樣感受」。AI 唔應該試圖控制每一個肌肉細節(嗰啲交返俾表情引擎/演員嘅專業),AI 只需要俾「導演級指示」。

---

## Part A:劇本格式(AI 輸出規格)

AI 唔直接輸出點位數值,而係輸出一份「劇本」——呢個係 Layer 0,新增喺你之前 Layer 1-3 之上。

```json
{
  "line_id": "L042",
  "text": "我諗都幾好嘅…",
  "dialogue_emotion": {
    "primary": "sad",
    "secondary": "angry",
    "intensity": 0.5
  },
  "mood": {
    "state": "embarrassed",
    "baseline_intensity": 0.3
  },
  "directions": {
    "pause_before_ms": 400,
    "gaze": "avoid",
    "step_out_before": false
  },
  "allow_improvisation": true
}
```

### 欄位解釋

| 欄位 | 意義 | 對應你之前系統 |
|---|---|---|
| `text` | 對白內容 | (交俾 TTS/lip-sync) |
| `dialogue_emotion` | **呢一句嘢**嘅情緒——短暫、針對呢句對白 | Layer 1(情緒強度值)+ 複合情緒(Part B) |
| `mood` | **場景/呢一段時間**嘅背景心理狀態——持續較耐、強度低、唔針對任何特定嘢 | 新增 Layer -1(見 Part C) |
| `directions.pause_before_ms` | 講呢句嘢前停頓幾耐 | 對應 Alba Emoting「先呼吸、後表情」時序 |
| `directions.gaze` | 眼神指示 | PL-L/PL-R 瞳孔點位 |
| `directions.step_out_before` | 呢句之前係咪要「清空」返中性 | Alba Emoting Step-Out(見 Part D） |
| `allow_improvisation` | 呢句期間容唔容許演員自由發揮(例如聽到意外嘢嗰陣) | Actor's Discretion Engine(見 Part D) |

### 情緒 (Emotion) vs 心情 (Mood)——心理學上嘅正式分別
呢個分別喺你套系統入面好重要,建議明確區分:
- **情緒(Emotion)**:短暫、強度可以好高、**有明確對象**(因為呢句說話/呢件事而觸發),對應「dialogue_emotion」,直接驅動 Layer 1-2
- **心情(Mood)**:持續較耐(可以係成場戲、成日)、強度通常較低、**冇明確單一對象**(唔係因為邊句嘢,而係一種瀰漫嘅背景狀態),對應「mood」,唔會直接輸出去點位,而係**改變其他情緒嘅表現方式**(見 Part C)

---

## Part B:複合情緒引擎(Compound Emotion Engine)

延續之前 Ekman 21 種複合情緒嘅研究,`dialogue_emotion` 支援 primary + secondary 組合。**組合邏輯唔係數值平均,而係按面部區域分工**(跟返 Martinez 研究嘅發現):

```
region_ownership = {
  brow:   secondary_dominant ? secondary : primary,
  eye:    secondary_dominant ? secondary : primary,
  cheek:  primary,
  mouth:  primary,
  nose:   primary,
  jaw:    primary
}
```

### 優先實作嘅 6 組複合情緒(按對話場景實用性排序)

| 複合情緒 | Brow/Eye 攞邊個 | Cheek/Mouth 攞邊個 | 典型使用場景 |
|---|---|---|---|
| 開心的驚訝 | surprised | happy | 收到驚喜、意外好消息 |
| 傷心的憤怒 | angry | sad(嘴角) | 覺得被辜負、委屈 |
| 恐懼的厭惡 | fear | disgust | 見到恐怖又噁心嘅嘢 |
| 恐懼的驚訝 | surprised(加強) | fear(嘴部橫拉) | 突發驚嚇 |
| 憤怒的厭惡 | angry | disgust | 鄙視、憤慨 |
| 傷心的恐懼 | fear | sad | 擔心失去、不安嘅難過 |

**實作方式**:唔使重新寫呢六組嘅點位表——直接引用返你之前已經做晒嘅 8 個單一情緒表,按上面嘅「區域分工」規則,運行時動態組合。呢個設計嘅好處係**新增複合情緒零成本**(淨係加一行 region_ownership 規則,唔使畫新表)。

---

## Part C:心情引擎(Mood Engine)—— Layer -1

心情唔會產生自己嘅點位表,而係做三件事:

### C.1 情緒偏壓(Emotional Bias)
心情會令某啲情緒「較難完全展現」,某啲「較容易展現」。例如 mood=embarrassed 嘅角色,就算 dialogue_emotion=happy,個「開心」都會被輕微壓抑(例如 blush 參數保留、eyeOpen 唔完全放鬆),因為「尷尬」呢個底層心情持續拉扯緊。

```
displayed_params = happy_params * (1 - mood.baseline_intensity * suppression_factor)
                  + mood_signature_leak * mood.baseline_intensity
```

### C.2 待機基線偏移(Idle Baseline Shift)
中性(intensity=0)狀態唔再係真正嘅 0,而係心情簽名嘅低強度版本。例如 mood=ssuspicious 嘅角色,就算冇講緊嘢,個中性表情都會帶少少瞇眼、單邊眉毛輕微高——對應 Serkis 講嘅「內在能量下限」。

### C.3 心情轉換(比情緒轉換慢好多)
心情唔應該即時切換,建議用秒/分鐘為單位嘅緩慢過渡(相對情緒係 0.1-0.5 秒),因為心情本質上就係「唔會突然變」先叫心情。

---

## Part D:演員自由度引擎(Actor's Discretion Engine)—— 「加返啲嘢」嘅具體實作

呢個直接回應你講嘅「機械人有時要跟劇本、有時要自己加多啲嘢」。分三個機制:

### D.1 連戲延續(Emotional Continuity / Given Circumstances)
除非劇本明確標示 `step_out_before: true`,否則新一句對白唔會由零開始,而係由**上一句殘留嘅情緒狀態**過渡落嚟(呼應 Alba Emoting:情緒會自然殘留,要主動 step-out 先會清空)。呢個令連續對話唔會顯得「講完一句就重置晒」咁生硬。

### D.2 被動洩漏(Passive Leakage)——呢個你之前已經有
Layer 3 嘅微表情洩漏機制,依家掛喺 mood 度而唔止係「表面情緒 vs 底層情緒」——`mood` 會持續、低強度咁洩漏入任何 `dialogue_emotion` 之中,唔使 AI 特登指令。

### D.3 主動即興(Active Improvisation)——回應「意外嘢」
當 `allow_improvisation: true`,而且發生咗劇本冇預料到嘅事(例如用戶打斷、突然嘅聲音/畫面刺激),Actor's Discretion Engine 可以喺**唔等待新一句 AI 劇本**嘅情況下,即時生成一個有限度嘅反應:

```
improvised_reaction = f(current_mood, character_personality_profile, stimulus_type)
```

**character_personality_profile** 係你之前冇提過但呢度需要新增嘅概念——一組角色性格權重(例如「外向度」「情緒穩定度」「防衛心」),用嚟約束即興反應嘅範圍,確保 Lilith 唔會「性格分裂」(例如一個設定成內斂嘅角色,即興反應唔應該係誇張大笑)。

**安全邊界**:即興反應永遠**唔可以覆蓋**一句已經到達嘅 AI 劇本指令,只可以填補「劇本未覆蓋嘅空隙」——呢個保證咗 AI 導演永遠有最終話事權,機械人演員嘅自由度係「補完」唔係「造反」。

---

## Part E:完整運行時 Pipeline(俾 Claude Code 實作參考)

```
┌─────────────────┐
│  AI 語言模型      │  生成劇本(text + dialogue_emotion + mood + directions)
└────────┬────────┘
         ▼
┌─────────────────┐
│  劇本解析器        │  驗證格式、填補預設值
└────────┬────────┘
         ▼
┌─────────────────┐
│  Mood Engine     │  Layer -1:更新背景心情狀態、計算偏壓同待機基線
└────────┬────────┘
         ▼
┌─────────────────┐
│ Compound Emotion │  Layer 0→1:組合 primary+secondary,輸出情緒強度值
│    Engine        │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Point Mapping    │  Layer 1→2:套用之前做嘅 8+ 情緒對照表(24或57點)
│    Table         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Temporal Layer   │  Layer 3:眨眼、微表情洩漏、Step-Out 過渡曲線
└────────┬────────┘
         ▼
┌─────────────────┐
│ Actor Discretion │  連戲延續 + 主動即興(如有需要,喺呢層插入未預期反應)
│    Engine        │
└────────┬────────┘
         ▼
┌─────────────────┐
│  渲染輸出         │  臉部點位 / ARKit blendshapes / 機械人伺服馬達訊號
└─────────────────┘
```

### 建議資料結構(Claude Code 實作用)
- 之前所有 markdown 表格,建議轉做 JSON 資料檔(例如 `emotions/happy.json`),每個情緒一個檔,包含強度公式(可以直接搬 v2 prototype 入面 `EMOTIONS` object 嘅寫法)
- Mood、Compound、Discretion 三個引擎建議寫成獨立可測試嘅純函數(input state → output state),方便單元測試同日後換第三方模型

---

## 下一步(已完成 1、3;下面做 2)
接住落嚟會更新 prototype(v3),加入:
1. 「劇本模式」輸入面板——打一句對白 + 揀情緒/心情,睇引擎點樣即時運算輸出
2. 複合情緒示範(開心的驚訝、傷心的憤怒等)
3. 連戲延續示範(連續輸入兩句對白,睇下情緒點樣自然過渡而唔係重置)
