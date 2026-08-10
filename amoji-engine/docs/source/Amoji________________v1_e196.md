# Amoji 系統規格 —— Part OO:合規三機制技術規格(Layer P 標準組件)

呢份文件將文件38(中國)、文件39(全球)嘅法規要求,轉化做一套具體、可實作嘅技術規格
——設計做全球通用嘅 Layer P 標準組件,唔係逐個市場分開做。

---

## 組件一:AI 身份披露(AI Disclosure Module)

### 跨司法管轄區要求整合
| 要求 | 來源 |
|---|---|
| 互動開始時披露 | 歐盟第50條 |
| 持續、顯眼咁公示(唔止一次性) | 中國擬人化互動辦法 |
| 「合理人可能被誤導」嗰陣必須披露 | 加州SB243 |

### 技術規格
```
AIDisclosureModule {
  triggerPoints: [
    "session_start",        // 每節對話開始時
    "periodic_reminder",     // 持續互動嘅定期提醒
    "on_ambiguity_risk"      // 偵測到用戶可能誤以為對緊真人嗰陣
  ],
  disclosureText: {
    default: "我係AI,唔係真人。",
  },
  displayMode: "prominent",  // 唔可以埋藏喺條款細字入面
  minorMode: {
    enabled: true,
    reminderInterval: 10800  // 10800秒 = 3小時(沿用加州SB243嘅具體數字)
  }
}
```

設計原則:呢個組件必須係架構層面強制存在,唔可以做成客戶可以完全關閉嘅選項——
最多容許客戶客製措辭/視覺呈現方式,但「揭露AI身份」呢個核心功能唔可以被停用。

---

## 組件二:防沉迷提醒(Anti-Addiction Reminder Module)

### 跨司法管轄區要求整合
中國明文要求「防沉迷提醒」;加州嘅「每3小時休息提醒」實質上都係防沉迷機制嘅具體實現。

### 技術規格
```
AntiAddictionModule {
  sessionDurationTracking: true,
  thresholds: {
    minor_detected: 10800,
    general_default: 21600,
  },
  reminderBehavior: {
    tone: "gentle_not_alarming",
    contentTemplate: "我哋已經傾咗一段時間,你要唔要休息一下?",
  },
  moodEngineInteraction: {
    dependencyPatternDetection: "optional_advanced_feature"
  }
}
```

設計原則:防沉迷機制唔應該同 Layer -1(心情引擎)嘅「建立長期關係感」呢個
陪伴人格核心賣點對立——建議定位做「健康嘅陪伴關係」框架下嘅其中一環,而唔係
對用戶體驗嘅打斷。

---

## 組件三:心理危機偵測/介入(Crisis Detection & Intervention Module)

### 跨司法管轄區要求整合
<cite index="34-1">加州要求:當用戶表達自殺意念、自殺、或自殘相關情緒,必須提供轉介
危機服務提供者(自殺熱線/危機短訊專線)嘅通知。</cite>

### 技術規格
```
CrisisInterventionModule {
  detectionTriggers: [
    "explicit_self_harm_language",
    "implicit_distress_pattern",
  ],
  responseProtocol: {
    priority: "OVERRIDE_ALL_OTHER_LAYERS",
    action: [
      "provide_crisis_resources_directly",
      "maintain_calm_stabilizing_tone",
      "avoid_ending_conversation",
    ],
    resourceDatabase: "region_specific_hotlines"
  },
  annualReporting: {
    trackMetrics: ["crisis_referral_count", "trigger_type_breakdown"]
  }
}
```

⭐ 關鍵設計原則:呢個模組嘅優先級必須高過 Layer 1(情緒)、Layer P(人格)嘅
正常運作邏輯——即係話,就算劇本/人格設定緊角色而家應該表現「開心」,一旦偵測到
用戶表達自殺/自殘意念,呢個模組必須覆蓋正常情緒輸出,強制切去關切/穩定嘅回應模式。
呢個同 Claude 自己嘅安全設計原則完全一致,建議直接參考。

---

## 整合架構圖

```
用戶輸入
    ↓
Crisis Detection(常駐監聽,最高優先級) ──→ 觸發時:OVERRIDE 全部其他Layer
    ↓(未觸發)
AI Disclosure(session_start/定期)
    ↓
Anti-Addiction(背景計時,達標先觸發)
    ↓
Layer 0-W 正常運作(劇本/情緒/身體/口型)
```

## 對五個人格檔案嘅適用性

| 人格 | AI披露 | 防沉迷 | 危機介入 |
|---|---|---|---|
| 家居服務 | 標準 | 標準 | 標準 |
| 企業文件 | 標準(互動短,較少觸發) | 較寬鬆閾值 | 標準 |
| 陪伴 | 標準+強化 | 重點適用 | 重點適用 |
| 教育兒童 | 強化(未成年人專屬規則) | 強化(每3小時) | 標準,轉介資源要適合兒童 |
| 醫療照護 | 標準 | 較寬鬆 | 強化(服務對象可能本身脆弱) |

## 下一步
1. 想我將呢三個模組加落 prototype 做示範?
2. 定係將呢份規格,連同文件38、39,一齊整合返去總交接文件同 Complete Spec(v16)?
