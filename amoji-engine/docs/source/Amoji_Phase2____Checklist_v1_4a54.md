# Amoji —— Phase 2 詳細實作 Checklist(肌肉解剖對應 + 口型覆蓋架構)

承接 Phase 1(核心情緒渲染已完成)。呢個 Phase 目標:將情緒參數對應去解剖學肌肉,
並且實作口型覆蓋架構,令講嘢同表情可以正確共存。

---

## Step 1:肌肉編號對照表

```
建立 data/muscles/m1-m21.json —— 轉譯 M1-M21 肌肉目錄(編號、名稱、對應點位、主要動作)
建立 data/muscles/emotion-perimeter-table.json —— 轉譯肌肉x情緒動作幅度矩陣
(11種情緒:開心/關懷/傷心/憤怒/指責/恐懼/驚訝/厭惡/思考/懷疑/尷尬)
實作 applyMusclePerimeter(rawValue, muscleId, emotionId) 函數
單元測試:「指責」情緒嘅 M1(額肌)封頂值應該低過「傷心」,但 M13(提口角肌)應該
高過大部分其他肌肉——驗證「選擇性收窄」邏輯
```

## Step 2:口型系統資料

```
建立 data/visemes/preston-blair-10.json —— 10個口型(AI/E/O/U/FV/L/MBP/CONS/REST)
每個口型定義三個參數狀態:jaw、width、corner,各自標記 LOCKED/CLAMPED/OPEN
建立 charToViseme(char) 函數(簡化版文字轉口型,母音/雙唇音/其他輔音分類)
```

## Step 3:覆蓋架構核心邏輯

```
函數 resolveMouth(visemeKey, emotionParams, intensity):
  1. 讀取 VISEME_TABLE[visemeKey] 嘅規則
  2. corner 參數(情緒嘅主要戰場):
     - LOCKED 狀態 → 直接用規則值,忽略情緒
     - CLAMPED 狀態 → 規則值 + 情緒偏移,clamp 喺允許範圍內
     - OPEN 狀態 → 完全由情緒決定
  3. jaw / width 參數(口型主導):
     - OPEN 狀態先容許情緒接管,否則直接用規則值
單元測試:MBP(雙唇音)+ 開心情緒 t=1.0 → jaw 必須等於 0(完全閉合),
唔理情緒強度幾高
單元測試:AI(大張口)+ 憤怒情緒 → corner 應該反映憤怒嘅嘴角參數(OPEN狀態)
```

## Step 4:共同發音(選用,可跳過留返後期)

```
如果時間許可:實作 Cohen-Massaro 主導函數,取代離散口型跳格,做連續時間混合
如果跳過:標記 TODO,喺 README 註明「MVP用離散版本,見共同發音深化版文件」
```

## Step 5:整合測試

```
播放一句包含 m/b/p 嘅句子(例如"mama papa"),搭配「開心」情緒 t=1.0
驗證:嘴部喺講到 m/b/p 嗰陣強制閉合,冇因為開心情緒而「漏氣」半開
驗證:上半臉(眉/眼)完全唔受口型影響,情緒 100% 主導
```

## Step 6:驗收標準

```
新增一個口型,只需要喺 preston-blair-10.json 加一條記錄 —— 唔使改 resolveMouth 邏輯
上下臉分離原則喺程式碼結構上清晰可見(唔會有一個函數同時處理眉毛同嘴巴)
全部通過 applyComplianceGate()
```

## 下一步
自然銜接 Phase 3(時間軸/真實度層:眨眼、微表情洩漏、Step-Out)。
