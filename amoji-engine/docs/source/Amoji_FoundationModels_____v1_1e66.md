# Amoji —— Apple Foundation Models + Amoji引擎 技術整合架構

呢份文件將「零成本對話層」同「Amoji表情引擎」嘅實際整合方式寫清楚,俾將來
實際開發(Claude Code或者你自己)跟。

---

## Part 1:整體架構圖

```
用戶輸入(文字/語音轉文字)
       |
       v
Apple Foundation Models framework
  LanguageModelSession(裝置端優先)
  複雜任務fallback → AFM Cloud(200萬下載前免費)
  輸出:對話回覆文字 + 語意情緒判斷
       |
       v
轉換做 AEP 格式(見AEP規格文件)
{ emotion:"happy", intensity:0.7, valence:..., arousal:... }
       |
       v
Amoji 引擎(純Swift/JS確定性邏輯,唔涉及任何LLM推理,零額外成本)
  Layer 1-W 全套(情緒/眼球/呼吸/口型/手勢)
       |
       v
Three.js / SceneKit / RealityKit 渲染
       |
       v
角色動畫輸出畀用戶睇
```

關鍵設計原則:兩個系統之間嘅唯一介面,就係 AEP 協議格式——Foundation
Models 負責「診斷用戶輸入,決定講咩、表達咩情緒」,Amoji 引擎負責「將呢個
決定,轉化做實際嘅表情/動作」,兩者完全分離,呼應「純生成引擎定位」文件
嘅核心原則。

---

## Part 2:Foundation Models 側嘅實作要點(Swift)

### 2.1 基本 Session 設定
```swift
import FoundationModels

let session = LanguageModelSession(
  instructions: """
  你係一個名叫[角色名]嘅陪伴角色。回覆用戶嗰陣,除咗文字回覆,
  仲要用結構化輸出提供你而家嘅情緒狀態(對應AEP協議格式)。
  """
)
```

### 2.2 結構化輸出(用 @Generable,直接產生 AEP 格式)
```swift
@Generable
struct AmojiResponse {
  @Guide(description: "角色嘅文字回覆")
  var replyText: String
  @Guide(description: "情緒分類,限定8個基礎類別之一")
  var emotion: String
  @Guide(description: "情緒強度,0.0至1.0")
  var intensity: Double
}
```
呢個直接對應 Foundation Models 嘅 @Generable/@Guide 巨集(結構化輸出),
令模型輸出可以直接映射做 AEP 嘅 EmotionState 結構,唔使額外解析。

### 2.3 裝置端 vs AFM Cloud 嘅自動切換
Foundation Models 框架本身會按任務複雜度自動判斷用裝置端定AFM Cloud——
開發者唔使自己寫判斷邏輯,但建議喺角色設計嗰陣,盡量將對話keep喺「相對
專注嘅語言任務」範圍(陪伴/角色扮演對話),減少觸發需要AFM Cloud嘅複雜
推理,咁樣可以確保喺200萬下載後,萬一AFM Cloud唔再免費,你哋嘅實際
依賴程度都相對細。

---

## Part 3:Amoji 引擎側嘅接口設計

### 3.1 統一輸入介面(接收AEP格式)
```javascript
// engine/api/aepReceiver.js
function receiveAEPInput(aepPayload) {
  validateNoRawBiometricData(aepPayload);
  return applyComplianceGate(aepPayload, currentContext);
}
```

### 3.2 渲染層嘅選擇(對應十級系統)
```
如果用SceneKit/RealityKit(蘋果原生3D框架)—— 適合追求同iOS生態最緊密
  整合,效能最好,但而家已有嘅prototype全部係Three.js
如果用Three.js(WKWebView內嵌)—— 可以直接沿用而家29個prototype嘅代碼,
  開發速度快,但效能略遜於原生框架
```
建議:MVP階段用 WKWebView 內嵌 Three.js(重用已有嘅大量prototype代碼,
開發速度最快),後期如果對效能有更高要求,先考慮遷移去SceneKit/
RealityKit原生實現。

---

## Part 4:成本監控建議
```
- 追蹤累計首次下載數字,設定150萬下載時嘅預警(留50萬緩衝期做遷移規劃)
- 監控AFM Cloud嘅實際調用比例(如果大部分對話都停留喺裝置端,
  代表角色設計已經做得夠「專注」,超過200萬後嘅風險較低)
- 預先評估:如果需要轉用付費雲端LLM(Claude/GPT/Gemini),大約每用戶
  每月成本,俾定價策略做調整依據
```

## 下一步
1. 想我依家用 Claude Code(呢個sandbox)實際起一個 Amoji 引擎嘅 repo 骨架
(Phase 0),為之後接駁 Foundation Models 做準備?
2. 定係想針對「AFM Cloud免費層用盡之後嘅遷移計劃」,搵更多細節?
