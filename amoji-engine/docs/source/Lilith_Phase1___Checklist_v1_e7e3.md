# Lilith Expression DNA —— Phase 1 實作 Checklist(俾 Claude Code 直接跟)

目標:完成核心渲染引擎——8 個基礎情緒 + 強度量表 + 可運行嘅 2D 渲染器。對應 prototype v1-v2。

---

## Step 1:資料轉譯(將 markdown 表轉做 JSON)

- [ ] 建立 `data/points/light-24.json`,將 `Lilith_臉部動點位置圖_v1.md` 入面 24 個點位(ID + 名稱 + 位置描述)轉做結構化 JSON 陣列
- [ ] 建立 `data/points/pro-57.json`,同樣轉譯 v2 文件嘅 57 點(含瞳孔 PL-L/PL-R)
- [ ] 每個點位物件格式統一:
  ```json
  { "id": "EB-L1", "region": "eyebrow", "side": "left", "label": "左眉頭", "description": "最靠近鼻樑一端" }
  ```
- [ ] 驗證:兩個 JSON 檔案嘅點位總數分別係 24 同 57(唔計靜態參考點)

## Step 2:情緒公式轉譯

- [ ] 直接由 `lilith_pixel_prototype_v3.html`(或 v5)入面嘅 `BASE` object 抽出,建立 `engine/emotionFormulas.js`
- [ ] 為每個情緒(neutral, happy, sad, angry, surprised, fear, disgust, thinking, embarrassed, suspicious, concerned)寫一個 function,輸入強度 `t`,輸出參數物件
- [ ] 每個 function 對應返 `Lilith_情緒示範_*.md` 三份文件入面嘅逐點填表數值——**檢查公式輸出喺 t=0.3/0.6/1.0 三個關鍵值嘅時候,係咪同文件表格數值大致吻合**(容許為咗程式化而做嘅簡化,但方向唔可以錯)
- [ ] 加單元測試:`t=0` 必須輸出全部參數等於 neutral(0)嘅數值

## Step 3:強度量表驗證

- [ ] 實作 clamp/warning 機制:當任何情緒 function 收到 `t > 1.0`,喺 debug log 標示「超出人類生理範圍,進入動畫/機械人誇張模式」
- [ ] 確保 `t` 值可以支援到 1.6(對應之前 prototype 嘅上限),但預設 UI 滑桿建議上限 1.0,>1.0 需要顯式開關先解鎖(避免誤用)

## Step 4:2D 渲染器

- [ ] 將 `lilith_pixel_prototype_v2.html` 入面嘅 `draw(params, meta)` function 搬去 `render/canvasRenderer2D.js`,拆做獨立、可重用嘅 module(唔再係內嵌 script)
- [ ] 渲染器輸入應該係「純參數物件」(唔可以直接讀 DOM/UI 元素),方便將來換第三方渲染引擎
- [ ] 保留現有嘅簡化五官設計(頭/眉/眼/鼻/口/腮紅)作為 placeholder,清楚註明「呢個唔係最終美術,等實際像素稿完成後替換」

## Step 5:基本互動介面

- [ ] 情緒下拉選單(9+1 個情緒)
- [ ] 強度滑桿(0-1,或者開發者模式 0-1.6)
- [ ] 即時渲染(選完即刻反映,唔使按確認)

## Step 6:輸出驗證清單(Phase 1 完成嘅判斷標準)
- [ ] 揀「開心」+ 強度 1.0,對比返 `Lilith_情緒示範_開心_v1.md` 嘅「大笑」數值,肉眼睇落個表情合理(顴骨升高、嘴角上揚、眼睛微瞇)
- [ ] 揀「恐懼」vs「驚訝」兩個 t=1.0,肉眼確認兩者有可辨識嘅分別(恐懼嘴部橫向拉伸、驚訝嘴部垂直張開——對應文件 5 嘅「重要分辨點」)
- [ ] 中性(t=0)睇落係一個平靜、非死寂嘅表情(即使 Phase 1 未做眨眼,都唔應該完全冇任何自然感)

## Step 7:程式碼交付格式
- [ ] 全部 emotion formula 用純函數(pure function),冇 side effect,方便單元測試
- [ ] 渲染器同資料層完全分離(渲染器唔應該識自己讀 JSON 檔案,由上層 caller 傳參數落去)
- [ ] 附一個 README,講清楚點樣新增一個新情緒(應該只需要加一個新 function + 喺選單度加一行,唔應該要改渲染器)

---

## Phase 1 完成之後,自然銜接 Phase 2(時間軸行為)
Phase 1 淨係做靜態單一畫面。下一步(Phase 2)先加眨眼、微表情洩漏、Step-Out——
呢個時候先需要 `requestAnimationFrame` 循環同狀態機,現階段唔使超前設計。
