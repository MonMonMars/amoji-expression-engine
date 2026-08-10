# Amoji —— Phase 0 詳細實作 Checklist(專案基礎設施 + 合規骨架)

呢份文件將總路線圖(文件49)嘅 Phase 0,拆做 Claude Code 可以逐步跟住做嘅具體步驟。
Phase 0 完成之後,先開始 Phase 1(核心臉部渲染)。

---

## Step 1:資料夾結構

```
mkdir -p amoji-engine/{data,engine,render,prototypes,tests}
mkdir -p amoji-engine/data/{points,emotions,compounds,personas,fillers}
mkdir -p amoji-engine/engine/compliance
mkdir -p amoji-engine/engine/layers
git init 並建立 .gitignore(node_modules, .env, dist/)
建立 package.json,設定專案名 "amoji-expression-engine"
```

## Step 2:選定同安裝渲染依賴
```
npm install three
(如果用 React 前端)npm install react react-dom
記錄選用理由(參考文件48:B2C工具用Three.js起步)
```

## Step 3:核心資料結構定義(TypeScript/JSDoc 型別,方便後續維護)
```
定義 EmotionParams 型別(browLY, eyeOpenL, cornerL 等全部參數)
定義 ScriptLine 型別(對應 Layer 0 劇本 schema,文件10)
定義 PersonaConfig 型別(對應五人格檔案,文件13)
定義 ComplianceEvent 型別(見下面 Step 5)
```

## Step 4:CI/測試骨架
```
選定測試框架(建議 vitest,輕量、同 Three.js 生態相容好)
建立 tests/emotions.test.js 空殼,預留 Phase 1 用
建立 GitHub Actions(或者對應 CI)基本 workflow:npm test on push
```

---

## Step 5:合規骨架(呢個 Phase 0 嘅重點,對應文件45、46)

### 5.1 建立三個合規模組空殼(唔使實作邏輯,先定義介面)
```javascript
// engine/compliance/aiDisclosure.js
export class AIDisclosureModule {
  constructor(config) { this.config = config; }
  onSessionStart(userContext) { /* Phase 6 實作 */ }
  onPeriodicCheck(sessionDuration, isMinor) { /* Phase 6 實作 */ }
}

// engine/compliance/antiAddiction.js
export class AntiAddictionModule {
  constructor(config) { this.config = config; }
  trackDuration(sessionId) { /* Phase 6 實作 */ }
  checkThreshold(sessionDuration, isMinor) { /* Phase 6 實作 */ }
}

// engine/compliance/crisisIntervention.js
export class CrisisInterventionModule {
  constructor(config) { this.config = config; }
  scanForDistressSignals(userText) { /* Phase 6 實作,須極度謹慎設計避免假陽性/假陰性 */ }
  overrideResponse(detectedCrisis) { /* 優先級最高,見下面5.3 */ }
}
```

### 5.2 定義合規事件匯流排(Compliance Event Bus)
```
建立一個中央事件系統,任何 Layer 輸出前,都必須經過合規檢查層
設計原則:合規檢查層必須係「不可繞過」嘅架構位置——唔可以係一個可選
middleware,而係渲染管線嘅強制關卡
```

```javascript
// engine/compliance/complianceGate.js
export function applyComplianceGate(rawOutput, context) {
  // 1. 優先檢查 Crisis(最高優先級,可以完全覆蓋 rawOutput)
  const crisisCheck = crisisModule.scanForDistressSignals(context.userText);
  if (crisisCheck.triggered) {
    return crisisModule.overrideResponse(crisisCheck);
    // 呢個 return 必須喺函數最前面,確保後續Layer邏輯完全唔會執行
  }
  // 2. AI 披露檢查(唔覆蓋輸出,但可能疊加標籤/提示)
  aiDisclosureModule.onSessionStart(context);
  // 3. 防沉迷檢查
  antiAddictionModule.checkThreshold(context.sessionDuration, context.isMinor);
  // 4. 正常返回原始輸出
  return rawOutput;
}
```

### 5.3 定義「不可繞過」嘅架構規則(寫成文件,俾之後所有開發者睇到)
```
喺 engine/compliance/README.md 寫低:
「任何新增嘅 Layer/功能,輸出必須經過 applyComplianceGate() 先可以送去渲染層。
 唔可以直接由 Layer 輸出跳過呢個關卡。Code Review 必須檢查呢一點。」
```

### 5.4 純生成引擎邊界檢查(對應文件46)
```
檢查 ScriptLine 型別定義,確認完全冇「rawCameraFrame」「rawAudioWaveform」
「biometricSensorData」呢類欄位
喺 engine/README.md 加一句架構原則聲明:
「本引擎唯一接受嘅輸入係抽象語意標籤(文字/數值),絕不處理任何用戶生物特徵
 原始數據。如果需要用戶情緒感知功能,必須做喺host application層面,以文字
 標籤形式傳入,唔可以掛喺呢個repo入面。」
```

---

## Step 6:Phase 0 完成驗收標準
```
專案可以 npm install && npm test 成功執行(就算測試內容係空嘅)
三個合規模組嘅檔案已經建立,介面已定義(邏輯留返 Phase 6 先實作)
applyComplianceGate() 已經存在,雖然而家仲冇嘢好處理(冇 Layer 輸出),
但架構位置已經確立
兩份 README(engine/compliance/README.md、engine/README.md)已經寫低
「不可繞過」同「純生成邊界」兩條架構原則
```

完成以上先可以開始 Phase 1——目的係確保表情引擎由第一行代碼開始,就已經喺
一個合規、乾淨嘅架構骨架上面生長,唔使等成個引擎做晒先返轉頭大幅重構。

## 下一步
1. 想我針對 Phase 1(核心臉部渲染引擎)都寫一份同等細緻嘅逐步 checklist?
2. 定係同步呢份文件返去總交接文件同 Complete Spec?
