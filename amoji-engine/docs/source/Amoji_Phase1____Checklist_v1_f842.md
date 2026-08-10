# Amoji —— Phase 1 詳細實作 Checklist(核心臉部渲染引擎)

承接 Phase 0(合規骨架已搭好)。呢個 Phase 目標:8 個基礎情緒可以喺 2D/3D 畫面度
正確渲染出嚟,通過肉眼驗證。完成之後先入 Phase 2(肌肉/口型)。

---

## Step 1:點位資料轉譯

```
建立 data/points/light-24.json —— 轉譯文件2(24點輕量版)
建立 data/points/pro-57.json —— 轉譯文件3(57點專業版)
建立 data/points/extended-77.json —— 轉譯文件3b(77點擴充版)
每個點位物件統一格式:
  { id, region, side, label, description }
驗證:三個檔案點位數量分別係 24/57/77(唔計靜態參考點)
```

## Step 2:情緒公式轉譯

```
建立 engine/layers/emotionFormulas.js
為 8 個基礎情緒(開心/傷心/憤怒/驚訝/恐懼/厭惡/思考/懷疑)各寫一個 pure function
每個 function 輸入強度 t,輸出參數物件(browLY, eyeOpenL, cornerL 等全部欄位)
交叉檢查:t=0.3/0.6/1.0 三個關鍵值,同文件4-6嘅逐點填表數值大致吻合
單元測試:t=0 時,輸出必須完全等於中性(neutral)參數
```

## Step 3:強度量表驗證機制

```
實作 clamp 輔助函數:clamp(value, cap)
實作 t > 1.0 嘅 debug 警告(唔阻止運行,但log提示「超出人類生理範圍」)
UI/API 層預設 t 上限 1.0,>1.0 需要顯式 unlockOverdrive 參數先解鎖
```

## Step 4:渲染器骨架(2D 起步)

```
建立 render/canvasRenderer2D.js
輸入純參數物件(唔可以直接讀DOM/UI元素,方便換渲染引擎)
實作 draw(params, meta) 函數,包含:頭部橢圓、眉毛、眼睛(含瞳孔)、鼻、嘴
保留簡化五官設計,註明「非最終美術,待實際角色資產完成後替換」
```

## Step 5:基本互動介面

```
情緒下拉選單(8個基礎情緒)
強度滑桿(0-1,開發者模式可解鎖到1.6)
即時渲染(選咗即刻反映)
```

## Step 6:視覺驗證清單(肉眼檢查,對應原始Phase1 checklist)

```
開心 t=1.0:對比「大笑」數值,顴骨升高/嘴角上揚/眼睛微瞇——睇落合理
恐懼 vs 驚訝 t=1.0:兩者有肉眼可分辨嘅差異(恐懼嘴部橫向拉伸 vs 驚訝垂直張開)
中性 t=0:平靜但非死寂(即使Phase 3先做眨眼,呢刻都唔應該完全僵硬)
```

## Step 7:單元測試覆蓋

```
tests/emotions.test.js:
  - 測試每個情緒 function 喺 t=0 時輸出等於 neutral
  - 測試每個情緒 function 喺 t=1.0 時,關鍵參數(例如happy嘅cornerL)方向正確
    (負值=向上,對應之前設計)
  - 測試 clamp 機制喺 t=1.5 時正確標記 overdrive 狀態
npm test 全部通過
```

## Step 8:程式碼交付驗收標準

```
新增一個情緒,只需要:(a) 加一個新 function,(b) 喺選單加一行 —— 唔應該要改渲染器
渲染器同資料層完全分離,渲染器唔識自己讀JSON檔案
README 有清楚說明點樣新增情緒
全部通過 applyComplianceGate()(Phase 0 建立嘅關卡,雖然Phase 1未有實質合規邏輯
觸發,但架構上必須經過)
```

---

## Phase 1 完成之後
自然銜接 Phase 2(肌肉編號對應 + Preston Blair口型系統)。Phase 1
淨係做靜態單一畫面,Phase 2 先開始加入口型嘅LOCKED/CLAMPED/OPEN覆蓋邏輯。

---

## 補充:Layer CA(角色原型)整合注意事項
文件51(角色原型適配層)喺 Phase 1 完成之後先加入,但建議喺 Phase 1 嘅資料結構
設計階段(Step 1)已經預留埋擴充空間:

```
情緒公式(Step 2)嘅輸出,應該定義做「通用抽象值」(valence/arousal/browLY等),
唔好將渲染邏輯寫死喺人類專屬嘅參數名入面(例如渲染器唔應該假設一定有「cornerL」
呢個參數存在)——呢個做法令 Phase 1 完成嘅人類渲染器,將來加返 Layer CA 嗰陣,
唔使推倒重來,淨係加多幾個原型定義就得
```

## 下一步
1. 想我寫返 Phase 2(肌肉/口型)嘅同等細緻 checklist?
2. 定係將呢份文件同之前業界骨架研究、Phase 0 checklist,一齊同步返去總交接文件同
Complete Spec(v18)?
