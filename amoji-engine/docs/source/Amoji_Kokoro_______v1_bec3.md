# Amoji —— Kokoro TTS + Amoji引擎 技術整合規格

呢份文件將「零成本語音層」同「Amoji表情引擎」用同一個共享情緒參考駁埋
一齊,解決AI Video Actor Engine技術規格入面提到嘅「聲音同塊面對唔上」
呢個核心問題。

---

## Part 1:核心架構——單一情緒來源,雙向輸出

```
Layer 1(統一情緒強度值:emotion, intensity, valence, arousal)
              |
       分岔去兩條pipeline:
       Amoji引擎(表情/動作) -> Blendshape序列(有timestamp)
       Kokoro TTS層(聲音/語速/停頓) -> 音頻波形(有timestamp)
              |
       兩者共用同一個時間軸基準,同步播放
```

呢個係整份規格最關鍵嘅設計原則:表情同聲音唔係兩條各自獨立嘅
pipeline,而係由同一組 Layer 1 數值分別驅動——呢個直接解決咗
Higgsfield自己承認嘅「聲音語氣同塊面對唔上」問題,因為兩者根本上共用
同一個情緒判斷,唔會出現「面部話開心,把聲話傷心」呢類矛盾。

---

## Part 2:Kokoro 側嘅具體整合

### 2.1 Kokoro 本身嘅限制——冇原生情緒標籤輸入
Kokoro 係一個相對簡單嘅TTS模型(8200萬參數,冇內置情緒條件控制),所以
情緒表達需要靠外部參數注入,而唔係模型自己識判斷:

```python
from kokoro import KPipeline

pipeline = KPipeline(lang_code='a')

def synthesize_with_emotion(text, layer1_output, speech_pacing):
    # 由AEP嘅speechPacing欄位,調整Kokoro嘅合成參數
    speed = speech_pacing['rateMultiplier']  # Kokoro原生支援speed參數
    audio = pipeline(text, voice='af_heart', speed=speed)
    # 停頓由劇本層面插入分段處理
    return audio
```

### 2.2 停頓嘅實作方式(Kokoro冇原生SSML支援,需要手動處理)
```python
def insert_pauses(script_segments, speech_pacing):
    # 根據 prePausePlacement 欄位,喺關鍵句子前插入靜音片段
    audio_clips = []
    for segment in script_segments:
        if segment.get('pauseBeforeMs'):
            audio_clips.append(silence(segment['pauseBeforeMs']))
        audio_clips.append(synthesize_with_emotion(segment['text'], None, speech_pacing))
    return concatenate(audio_clips)
```

### 2.3 音高/語調嘅限制——誠實講
Kokoro 本身冇提供直接嘅音高(pitch)調節參數——如果將來需要更精細嘅
音高控制(例如恐懼嗰陣提升F0),可能需要:
- 後製用DSP工具(例如librosa)做音高偏移,或者
- 換用另一個有更多控制維度嘅開源TTS(例如VibeVoice嘅「free-form inline
emotion control」)

---

## Part 3:同步機制——確保表情同聲音時間軸對齊

```
函數 generatePerformance(scriptLine):
  layer1 = computeEmotionState(scriptLine)   # Amoji核心引擎運算一次

  facialTrack = amojiEngine.render(layer1)    # 表情輸出
  audioTrack = kokoroTTS.synthesize(
    scriptLine.text, layer1, layer1.speechPacing  # 見AEP協議Part 2.5
  )

  回傳 { facialTrack, audioTrack, syncPoint: "shared-layer1-timestamp" }
```

關鍵原則:兩條track嘅timestamp都源自同一個Layer 1運算過程嘅時間軸,
唔係事後對齊(post-hoc alignment)——呢個做法從架構層面根絕咗「對唔上」
嘅風險,而唔係靠後製修補。

---

## Part 4:成本結構總覽(承接之前研究)

```
Kokoro TTS:Apache 2.0,CPU可運行,零授權費用
Amoji引擎:確定性規則,零LLM推理成本
Apple Foundation Models(如做App):200萬下載前免費(對話決策層)

總結:AI Video Actor Engine嘅完整pipeline(對話決策 -> 情緒判斷 ->
表情生成 -> 語音生成),理論上可以做到喺相當大嘅規模之前,現金成本
接近零——呢個係跨越三份研究文件(Foundation Models、Amoji核心
引擎、Kokoro)先砌埋一齊嘅完整低成本方案。
```

## 下一步
1. 想我做一個 prototype,實際示範文字劇本 → Layer 1 → 同步驅動一段
簡單語音 + 表情演出?
2. 定係想針對 Kokoro 嘅多語言支援(如果將來需要中文/廣東話配音),
搵吓佢實際支援程度?
