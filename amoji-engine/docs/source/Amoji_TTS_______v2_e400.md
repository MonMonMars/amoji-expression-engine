# Amoji —— TTS + Amoji引擎 技術整合規格 v2(更新:Step Audio EditX/IndexTTS2主打）

⚠️ 呢份文件取代之前嘅「Kokoro整合技術規格」——因應廣東話支援需要,改用
Step Audio EditX(情緒表現力優先)/IndexTTS2(即時反應優先)做主要方案,
Kokoro保留做冇廣東話需求場景嘅備選(英文/日文等)。

---

## Part 1:核心架構(不變)——單一情緒來源,雙向輸出

```
Layer 1(統一情緒強度值:emotion, intensity, valence, arousal)
              |
       分岔去兩條pipeline:
       Amoji引擎(表情/動作) -> Blendshape序列(有timestamp)
       TTS層(聲音/語速/停頓/副語言標記) -> 音頻波形(有timestamp)
              |
       兩者共用同一個時間軸基準,同步播放
```

---

## Part 2:新增——副語言標記(Paralinguistic Tags)同 Amoji 表情引擎配對

Step Audio EditX 提供 20+ 副語言標記(呼吸、笑聲、嘆氣、輕笑等),呢個
係之前Kokoro完全冇嘅能力——而家可以將呢啲標記,直接對接返已經寫好
嘅表情/身體研究,做到「聲畫雙重確認」嘅演出效果。

### 2.1 笑聲標記 -> 大笑嘅頭部/軀幹推導邏輯(直接對接)
之前「微笑與大笑類型研究」文件已經設計咗「大笑係頭部主導動作,軀幹/
肩膊動作由頭部動態推導(PD控制器)」嘅邏輯——而家可以直接掛鈎:

```
函數 onParalinguisticTag(tag, layer1):
  如果 tag == 'laughter':
    觸發Amoji引擎嘅大笑子狀態:
      headBobIntensity = layer1.arousal
      torsoderivationEnabled = true  (PD控制器推導軀幹)
    同步TTS輸出笑聲音效,標記做syncedWithFacial=true
```

### 2.2 嘆氣標記 -> 呼吸系統(Layer B)直接對接
```
如果 tag == 'sigh':
  觸發Amoji引擎嘅呼吸模式:
    type = 'exhale-emphasis'
    accessoryMuscleActivation = 0.6  (對應Layer B嘅頸肩緊張參數)
```

### 2.3 呼吸標記 -> 待機系統(Layer I)節奏同步
```
如果 tag == 'breathing':
  直接同步Layer I嘅breathingBpm參數,唔使兩套呼吸邏輯各自運作
```

### 2.4 完整對照表

| TTS副語言標記 | 對接嘅Amoji系統 |
|---|---|
| laughter(笑聲) | Layer 1大笑子狀態(頭部主導+軀幹推導) |
| sigh(嘆氣) | Layer B(accessoryMuscleActivation呼氣強調) |
| breathing(呼吸) | Layer I(待機呼吸節奏同步) |
| chuckle(輕笑) | Layer 1微笑子狀態(親和型/獎勵型微笑) |

呢個係全套系統目前為止,聲音同表情結合得最緊密嘅一個整合點——之前
研究一直強調「聲音同表情要共享情緒來源」,而家有咗副語言標記,可以做到
更細緻嘅「事件級」同步(唔止情緒數值同步,連「呢一刻笑咗出嚟」呢類具體
事件都同步)。

---

## Part 3:實作程式碼骨架

```
# TTS side (Step Audio EditX 或 IndexTTS2)
函數 synthesize_with_paralinguistics(text, layer1_output, script_annotations):
    tts_input = build_prompt(text, emotion, style, paralinguistic_tags)
    audio, tag_timestamps = tts_engine.generate(tts_input)
    回傳 audio, tag_timestamps  # 俾Amoji引擎做同步觸發用

# 同步層
函數 generate_performance(script_line, layer1):
    audio, tag_events = synthesize_with_paralinguistics(...)
    facial_track = amoji_engine.render(layer1)
    對每個 event in tag_events:
        amoji_engine.trigger_at_timestamp(event.tag, event.timestamp)
    回傳 { facial_track, audio, tag_events }
```

---

## Part 4:語言分流建議
```
廣東話/普通話對話 -> Step Audio EditX(首選,情緒表現力最強)
                     或 IndexTTS2(如需要更低延遲)
純英文對話        -> Kokoro(已驗證穩定,Apache 2.0)或 Step Audio EditX
```

---

## Part 5:成本結構(不變,依然接近零)
```
TTS(Step Audio EditX/IndexTTS2/Kokoro):全部Apache 2.0,CPU/一般GPU可跑
Amoji引擎:確定性規則,零LLM推理成本
Apple Foundation Models(如做App):200萬下載前免費(對話決策層)
```

## 下一步
1. 想我做一個 prototype,示範「笑聲標記觸發大笑頭部/軀幹連動」嘅實際
視覺效果?
2. 定係想針對 Step Audio EditX 嘅30+說話風格,逐一對應返五個人格
檔案(家居/企業/陪伴/教育/醫療),做一張映射表?
