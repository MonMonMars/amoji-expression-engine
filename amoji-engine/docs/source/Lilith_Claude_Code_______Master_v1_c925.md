# Lilith Expression DNA —— Claude Code 總交接文件 (Master Handoff v1)

## ⚠️ 已知未來本地化需求(中國大陸市場,見商業策略文件 Part 6)
若日後系統需要支援中國大陸市場(已有明確商業理由,詳見 `Amotion_商業模式更新_v2.md`
Part 6),Claude Code 實作時應該預留以下擴充空間,避免後期大幅重構:
- Layer 0(劇本)/ Layer T(填充語庫):需要簡體中文版本,唔止繁體
- Layer V(口型系統):Preston Blair 口型表源自英文語音學,普通話(聲調語言)嘅共同
發音規律需要獨立研究,唔可以直接沿用英文版參數
- Layer -1(心情引擎):文化偏壓參數可能需要因應大陸用戶獨立校準
- 資料儲存架構:建議由設計初期就採用「本機優先、最小雲端依賴」原則(見產品倫理準則
文件),同時降低中國數據本地化合規風險,亦符合一般用戶私隱最佳實踐

## 公司品牌資訊(更新)
- **公司名稱**:Amoji(前稱 Amotion——已改用 Amoji,發音更順口易記,即使字面意思稍為不及
  Amotion 直接,但品牌辨識度優先)
- **Slogan**:"A Bridge Between AI and Human"(AI 與人類之間的橋樑)——呼應成套系統嘅核心
  定位:唔係另一個 AI 模型,而係令 AI 嘅表達更有人性、更容易被人類理解同信任嘅「橋樑層」
- **「Lilith」**:呢個係示範/開發用嘅角色demo名,唔係公司名——公司對外一律用 Amoji

## ⚠️ 技術策略更新(3D 優先)
之前 v1-v11 prototype 全部係 2D 像素風示範,用嚟快速驗證邏輯。正式產品化方向已定為
**3D 優先**(3D-First)——原因同機械人 AI 訓練業界普遍使用 3D 模擬環境嘅慣常做法一致,
亦令引擎更容易同 B2B 客戶(3D avatar LLM 平台、機械人公司)直接對接。**核心引擎邏輯
(Layer 1-3、E、B、G、V 全部參數/公式)不受影響,只需要更換渲染層模組。**詳見文件21
(商業模式更新)同文件22(3D技術路線研究)。

呢份文件係總索引 + 實作藍圖,唔重複之前每份文件嘅細節內容,而係將佢哋組織成一份
Claude Code 可以直接跟住做嘅工程規格。**建議 Claude Code 開工前,先完整讀晒下面「文件庫」入面全部檔案。**

---

## 0. 一句講晒個系統係咩

Lilith Expression DNA 係一套「情緒語意 → 臉部/身體演出」引擎:AI 負責生成劇本(對白 + 情緒 +
心情指示),引擎負責將呢啲指示轉化做逐點嘅臉部動畫數值,同時填補劇本冇覆蓋嘅空隙(連戲、
微表情、延遲期間嘅自然反應),按唔同「人格檔案」調整表現方式,最終可以輸出去自家點位系統
或者 ARKit 相容格式,驅動 2D/3D/機械人。

---

## 1. 完整文件庫(按閱讀順序)

| # | 檔案 | 內容 | 對應層級 |
|---|---|---|---|
| 1 | `Lilith_臉部動點位置圖_v1.md` | 24 點輕量版點位定義 | Layer 2 基礎 |
| 2 | `Lilith_臉部動點位置圖_v2.md` | 57 點專業版 + 強度量表(0/1/>1)+ 瞳孔方向點位 | Layer 2 完整 |
| 3 | `Lilith_情緒示範_開心_v1.md` | 開心情緒逐點填表示範(輕量+專業雙版本) | Layer 1→2 映射範例 |
| 4 | `Lilith_情緒示範_思考尷尬驚訝懷疑_v1.md` | 四個情緒逐點填表 + 眼神方向 | Layer 1→2 |
| 5 | `Lilith_情緒示範_憤怒傷心厭惡恐懼_v1.md` | Ekman 六大情緒補完 + 分辨要點 | Layer 1→2 |
| 6 | `Lilith_系統架構_兩層數值與微表情研究_v1.md` | 正式定義 Layer 1/2 + 微表情心理學(先眼後口、洩漏規則) | Layer 3 理論基礎 |
| 7 | `Lilith_好萊塢動捕技術研究_v1.md` | Weta FACS 侷限性、ARKit 52 相容策略 | 系統定位/相容性 |
| 8 | `Lilith_人類表情清單與演員訓練研究_v1.md` | 21種複合情緒清單、Alba Emoting、Andy Serkis 演員法 | Layer 3 理論基礎 |
| 9 | `Lilith_總系統規格_AI劇本至演員演出_v1.md` | 劇本格式(Layer 0)、複合情緒引擎、Mood Engine、Actor's Discretion Engine | 核心架構 |
| 10 | `Lilith_系統規格_延遲橋接系統_v1.md` | Layer T 設計、HRI 填充語研究 | Layer T |
| 11 | `Lilith_系統規格_思考模式心理學基礎_v1.md` | 填充語心理學、眼神移離研究、認知負荷分級 | Layer T 理論基礎 |
| 12 | `Lilith_系統規格_預設人格檔案_v1.md` | 五個人格檔案(家居/企業/陪伴/教育/醫療) | Layer P(人格) |
| 13 | `Lilith_系統規格_眼睛錨點與微動作研究_v1.md` | 錨點/注意力目標、頭-眼協調、VOR、微掃視/飄移/震顫、情緒瞳孔放大數值 | Layer E(眼球運動) |
| 14 | `Lilith_系統規格_EasterEgg集合_v1.md` | 五個已被推翻嘅流行迷思(NLP眼神、摸鼻、眼神迴避、交叉手臂、微表情測謊),獨立命名空間 | Easter Egg(非科學) |
| 15 | `Lilith_系統規格_口型系統_v1.md` | Preston Blair 10口型標準、口型-情緒混合公式(ExpressionBot)、JALI Jaw/Lip分離概念 | Layer V(口型) |
| 16 | `Lilith_系統規格_臉部肌肉解剖與口型覆蓋架構_v1.md` | 表情肌肉解剖(顏面神經 vs 三叉神經)、Jaw/Lip/Corner 三態覆蓋架構(LOCKED/CLAMPED/OPEN),修正v8相加缺陷 | Layer V 修正版 |
| 17 | `Lilith_系統規格_頸肩呼吸_v1.md` | 頭頸傾斜(側傾/俯仰)、肩膊(高度/圓展)、呼吸(速率/深度/規律性),補完Alba Emoting缺口 | Layer B(身體) |
| 18 | `Lilith_系統規格_頸肩呼吸肌肉解剖學_v1.md` | 頸肩肌肉(斜方肌/提肩胛肌/SCM/斜角肌)+ 呼吸肌肉(橫膈膜/肋間肌/輔助肌),發現SCM/斜角肌雙重身份→統攝參數accessoryMuscleActivation | Layer B 修正版 |
| 19 | `Lilith_系統規格_手勢層_v1.md` | Ekman-Friesen五類手勢分類(Emblem/Illustrator/Regulator/Affect Display/Adaptor),覆蓋優先次序架構 | Layer G(手勢) |
| 20 | `Amotion_商業模式更新_v2.md` | 3D優先策略、Amoji品牌定位、Grok Companions市場驗證、四大客戶區隔 | 商業策略 |
| 21 | `Amoji_3D技術路線研究_v1.md` | Three.js/Unity/Unreal/PlayCanvas比較,各客戶區隔建議引擎 | 技術路線 |
| 22 | `Amoji_Studio_MVP規格_v1.md` | B2C AI動畫師工具MVP功能範圍、定價、時間線 | 產品規格 |
| 23 | `Amoji_系統規格_待機模式研究_v1.md` | Idle Mode業界研究(呼吸bpm、次要動作、90秒法則、人格專屬idle簽名) | Layer I(待機) |
| 24 | `Amoji_系統規格_全身語言與步態_v1.md` | Johansson光點行者研究、五情緒步態量化數據(速度/步幅/手臂擺動)、恐懼遠端手臂擺動、姿態搖晃/凍結反應 | Layer W(步態) |
| 25 | `Amoji_系統規格_對話與演講眼神模式_v1.md` | Dyadic對話輪流發言眼神研究(Kendon)、Presentation演講掃視技巧、講者三角身體移動 | Layer E 擴充(情境模式) |
| 26 | `Amoji_總覽圖表_情境情緒時刻_v1.md` | 三張總覽表:情境×Layer、情緒×全部Layer參數矩陣、時刻/時序觸發表 | 速查總表 |
| 27 | `Amoji_系統規格_共同發音與主導函數模型_v1.md` | Cohen-Massaro(1993)主導函數模型、預期性/延續性共同發音,升級Layer V由離散口型做連續混合 | Layer V 深化版 |
| 28 | `Amoji_系統規格_微笑與大笑類型研究_v1.md` | 三功能微笑模型(獎勵/親和/支配,精確FACS對照)、大笑身體動作(頭部主導→軀幹肩膊推導) | Layer 1 深化(笑嘅子狀態) |
| 29 | `Amoji_系統規格_安慰行為研究_v1.md` | CT觸覺神經纖維(1-10cm/s最愉悅撫摸速度)、治療師語速研究(穩定>減慢)、一致性原則(不一致降低信任度45%) | 安慰模式(跨Layer) |
| 30 | `Amoji_系統規格_肌肉編號與情緒幅度表_v1.md` | 21條臉部肌肉編號目錄(M1-M21)對應點位、11種情緒×肌肉動作幅度矩陣、「開心/關懷闊·指責/憤怒窄」風格化設計 | Layer 2 深化(肌肉層) |
| 31 | `Amoji_系統規格_恐怖谷研究_v1.md` | Mori(1970)恐怖谷假說、動作比外觀更關鍵、50ms極速反應、科學爭議、風格化vs寫實路線風險評估 | 商業/技術風險管理 |
| 32 | `Amoji_系統規格_恐怖谷修復策略_v1.md` | 跨模態不匹配為核心成因(臉聲寫實度不匹配實證)、業界仿生機械人技術細節(呼吸/眨眼毫秒級/故障自偵測)、對話能力緩解恐怖谷新方向、「跨越恐怖谷清單」 | 商業/技術風險管理(超寫實項目) |
| 33 | `Amoji_系統規格_間接研究_動畫與虛擬偶像_v1.md` | VTuber雙重身份結構、初音未來kawaii設計對策、Disney誇張化防禦機制、局部寫實新陷阱、比例偏移路線(Avatar/Gollum) | 美術方向風險管理 |
| 34 | `Amoji_系統規格_FinalFantasy案例研究_v1.md` | Final Fantasy: The Spirits Within(2001)商業失敗案例、半寫實類別對照實驗、熟悉度緩解的正確理解、眼睛係獨立恐怖谷成因 | 案例研究/風險管理 |
| 35 | `Amoji_系統規格_恐怖谷解決方案總覽_v1.md` | 按證據強度分四級嘅完整解決方案清單、MacDorman(2016)一致性實證、誇張動作有效性嘅精確機制 | 風險管理總覽 |
| 36 | `Amoji_系統規格_低多邊形似真但假路線_v1.md` | Schwind等眼動追蹤研究(低精細度=闊容錯範圍)、WoW-style業界命名、手機部署優勢、一致性檢查 | Layer 2 渲染策略 |
| 37 | `Amoji_系統規格_Alita與FinalFantasy遊戲案例研究_v1.md` | Alita成功跨越案例(眼睛9百萬多邊形、局部放大技巧)、FFVII Remake主角/背景角色資源分配問題、Rebirth用戶熟悉度反彈 | 案例研究/風險管理 |
| 38 | `Amoji_系統規格_總結論_寫實高多邊形路線_v1.md` | 六點總結論:技術可行但代價高、失敗案例多於成功、核心成因為不一致、眼睛係唯一共同優先部位、不建議做預設路線 | 決策總結 |
| 39 | `Amoji_系統規格_現役仿生機械人製造商_v1.md` | Engineered Arts:Ameca(刻意人工膚色)vs Mesmer(追求全寫實)同公司對照實驗、Sophia結構不一致教訓 | 現實案例/風險管理 |
| 40 | `Amoji_系統規格_DetroitLastOfUs案例研究_v1.md` | TLOU原版全手畫臉部動畫(零mocap)勝過純數據捕捉、TLOU2眼球掃視疊加注視目標(獨立印證Layer E)、Detroit誇張表情警示 | 案例研究/核心論述 |
| 41 | `Amoji_系統規格_AheadFormOriginF1案例_v1.md` | Origin F1可換面皮、瞳孔內置鏡頭、評價兩極化(對比Ameca)、25馬達vs43條臉部肌肉嘅技術現實 | 現實案例/風險管理 |
| 42 | `Amoji_系統規格_2026競爭格局三間公司_v1.md` | UBTech UWorld U1系列(已開賣$17,600-$146,000)、Realbotix Melody(上市公司,LLM中立,已有照護/教育合作)、三間公司對照總表 | 商業/競爭情報 |
| 43 | `Amoji_系統規格_三公司產品深度研究與反饋_v1.md` | UBTech已故親人複製爭議、現場記者「表情依然機械」反饋、Realbotix公司起源背景、隱私架構正面參考 | 競爭情報/倫理警示 |
| 44 | `Amoji_產品倫理準則_v1.md` | 三條紅線(已故真人複製禁令、心理健康包裝審查、親密定位分流)+ 本機優先隱私架構參考 | 產品倫理準則 |
| 45 | `Amotion_商業模式更新_v2.md` | 商業策略(含新增Part 6:中國大陸市場——B2B授權切入、簡體中文/普通話口型/數據本地化需求) | 商業策略(附錄) |
| 46 | `Lilith_臉部動點位置圖_v3_擴充版.md` | 新增18個臉部細節點(太陽穴/耳朵/下頜輪廓/人中/眉間/額外前額),總計77點 | Layer 2 深化(臉部) |
| 47 | `Amoji_系統規格_全身標記點系統_v1.md` | 全身前面24點+背面16點,對應Layer B/W/G現有參數,全身總計117點(臉77+身體40) | Layer 2-Body(全身) |
| 48 | `Amoji_系統規格_中國大陸監管要求研究_v1.md` | 《人工智能擬人化互動服務管理暫行辦法》(2026年7月生效)、生成式AI備案制度、高風險AI分類 | 監管合規研究 |
| 49 | `Amoji_系統規格_全球監管格局_歐盟美國_v1.md` | 歐盟AI法案第50條(2026年8月生效)、加州SB243/紐約AI Companion法、三大司法管轄區對照表 | 監管合規研究 |
| 50 | `Amoji_系統規格_合規三機制技術規格_v1.md` | AI披露/防沉迷/心理危機介入三模組嘅具體技術規格(Layer P標準組件),跨司法管轄區參數整合 | 合規技術規格 |
| 51 | `Amoji_系統規格_純生成引擎定位落實清單_v1.md` | 架構/合約/文件三層落實「純生成非偵測」定位,輸入合約限定抽象語意標籤,瞳孔同步功能重新設計方向 | 架構原則/合規 |
| 52 | `Amoji_完整程式開發進度清單_v1.md` | 20個Phase嘅完整實作路線圖(Phase 0基礎設施到Phase 20正式產品化),含依賴關係圖同MVP範圍建議 | 總體實作路線圖 |
| 53 | `Amoji_Phase0詳細實作Checklist_v1.md` | Phase 0逐步指引:資料夾結構、合規骨架(三模組空殼+不可繞過關卡+純生成邊界聲明) | Phase詳細指引 |
| 54 | `Amoji_Phase1詳細實作Checklist_v1.md` | Phase 1逐步指引:點位轉譯、情緒公式、強度量表、渲染器骨架、視覺驗證 | Phase詳細指引 |
| 55 | `Amoji_Phase2詳細實作Checklist_v1.md` | Phase 2逐步指引:肌肉編號對照、口型覆蓋架構、MBP強制閉合驗證 | Phase詳細指引 |
| 56 | `Amoji_系統規格_業界骨架標準研究_v1.md` | 身體骨架五大標準(Mixamo/Unreal/Unity/VRM/BVH),VRM為最接近universal嘅標準;臉部骨骼vs blendshape、ARKit52互通標準、MetaHuman規模參考 | 業界標準研究 |
| 57 | `Amoji_系統規格_十級表情呈現系統_v1.md` | 十級Surface Renderer(發光體→2D像素→Anime→低多邊形→Pixar式→比例偏移→半寫實→MetaHuman級→實體機械人),恐怖谷風險曲線、產品分級定價階梯 | 渲染架構/商業分級 |
| 58 | `Amoji_系統規格_十級類別適配研究_v1.md` | 「風格化優勢」「人似」中間地帶研究(推翻越似人越好)、B2B場景分級建議、2D vs 3D硬件部署考量 | 產品定位研究 |
| 59 | `Amoji_系統規格_風格清單與AI架構決策_v1.md` | 8種美術風格清單(低多邊形/賽璐璐/體素/半寫實動漫/Pixar式等)擴充Level3-7;AI(語意決策)vs傳統編程(表情生成)混合架構建議 | 美術/架構決策 |
| 61 | `Amoji_系統規格_角色原型適配層_v1.md` | Layer CA(角色原型適配層):動物(耳朵/尾巴研究)、鳥類、外星生物、擬人化物件(Luxo Jr原則)、機械人五大原型;「Amoji係擬人化引擎」核心原則 | 架構擴展(物種無關) |
| 63 | `Amoji_IP策略與估值評估_v1.md` | IP保護分類建議(專利vs商業機密)、2026年估值市場數據、風險因素評估、行動清單 | 商業/法律策略 |
| 64 | `Amoji_候選專利技術描述_生成偵測分離架構_v1.md` | 生成/偵測分離架構嘅正式技術描述(俾專利律師評估用),含系統圖示、技術特徵、與現有技術區別 | 專利候選文件 |
| 65 | `Amoji_授權費率與條款建議_v1.md` | 三條產品線嘅授權模式/定價階梯、合約必備條款清單(已故真人複製禁令、生物特徵回饋禁止等) | 商業/合約策略 |
| 66 | `Amoji_系統規格_動作風格層級_v1.md` | Layer MT(動作時序層級):寫實/日本動漫(有限動畫,8fps,局部動作,拖影格)/Disney卡通(十二原則)三級,恐怖谷/渲染成本雙重效益 | 架構擴展(動作維度) |
| 68 | `Amoji_開放標準協議策略_v1.md` | Open Core商業模式研究、MongoDB/Elastic/HashiCorp/Redis牌照戰爭教訓、「協議開放/引擎不開源」核心策略 | 商業策略(開源治理) |
| 69 | `Amoji_Emotion_Protocol_AEP_v0.1.md` | AEP協議正式規格(EmotionState/CompoundEmotionState/CharacterArchetype JSON schema),**CC-BY 4.0已確認採用** | 公開協議規格 |
| 70 | `Amoji_開源牌照比較_v1.md` | MIT/Elastic License 2.0/SSPL/BSL四種牌照對比,建議參考實現用Elv2或BSL | 商業/法律策略 |
| 71 | `lilith/amoji_*.html`(共二十九個原型) | 參考實作 | — |

---

## 2. 完整 Layer 架構(終版)

```
┌─────────────────────────────────────────────────┐
│ Layer I · 待機模式 (Idle Mode) ⚠️ 常駐背景進程      │
│   永遠運行,唔會被其他Layer「取代」,只會被疊加/暫時蓋過   │
│   呼吸(按人格15-25bpm)+ 次要動作(重心/頭浮動)        │
│   + 3-4個變體隨機輪換(90秒法則,避免顯得單調重複)       │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer P · 人格檔案 (Persona)                       │
│   五個預設:家居/企業文件/陪伴/教育兒童/醫療照護        │
│   → 決定其他所有層級嘅「參數封頂/篩選規則」            │
│   ⚠️ 內建全球合規三機制(強制,非選用):                │
│      AI身份披露 / 防沉迷提醒 / 心理危機介入(最高優先級) │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 0 · AI 劇本 (Script)                        │
│   { text, dialogue_emotion, mood, directions }    │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer V · 口型系統 (Viseme)                        │
│   文字→音素→口型,Preston Blair 10口型             │
│   + LOCKED/CLAMPED/OPEN 三態覆蓋架構(MVP版)         │
│   + jawOpen(三叉神經)/lipShape/corner(顏面神經)分軌 │
│   ⚠️ 深化版:Cohen-Massaro主導函數模型,音素間        │
│      連續時間混合(預期性/延續性共同發音,取代跳格)     │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer -1 · 心情引擎 (Mood Engine)                  │
│   背景偏壓 + 待機基線偏移 + 慢速過渡                  │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 1 · 情緒強度值 (Emotion Intensity)           │
│   0 → 1(人類極限)→ >1(誇張),含複合情緒區域分工邏輯    │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer CA · 角色原型適配層 (Character Archetype)    │
│   人類/動物/鳥類/外星生物/擬人化物件/機械人五大原型    │
│   決定「呢個角色實際擁有邊啲表達渠道」,物種無關       │
│   ⚠️ Amoji本質係擬人化引擎;動物原型渠道須有行為學根據 │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer MT · 動作時序層級 (Movement Timing)          │
│   Level R寫實(24fps連續)/ Level A動漫(~8fps局部    │
│   集中動作+拖影格)/ Level C迪士尼(十二原則+誇張)     │
│   ⚠️ 與十級寫實度、Layer CA正交,可自由組合;         │
│      Level A同時係恐怖谷對策+渲染成本降低手段         │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 2 · 臉部點位值 (Facial Point Position)       │
│   24點輕量版 / 57點專業版 / 77點深化版 + 瞳孔方向     │
│   (PL-L/PL-R)                                     │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 2-Body · 全身標記點 (Full-Body Points)       │
│   身體前面24點 + 背面16點 = 40點,對應Layer B/W/G    │
│   全身總計:117點(臉77 + 身體40)                    │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer E · 眼球運動子系統 (Eye Anchor & Micro-move) │
│   錨點/注意力目標、頭-眼協調、VOR 補償、             │
│   微掃視/飄移/震顫、瞳孔隨情緒放大、輻輳、平滑追蹤      │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer B · 頸肩呼吸子系統 (Neck/Shoulder/Breathing) │
│   頭部側傾/俯仰、accessoryMuscleActivation 統攝參數 │
│   (SCM/斜角肌雙重身份→同時驅動頸緊+肩隨呼吸微起伏)    │
│   ⚠️ 必須與 Layer E 聯合判讀(例:低頭+直視=憤怒,      │
│      低頭+迴避=傷心——單看頭部角度無法區分)            │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer G · 手勢層 (Gesture)                        │
│   Emblem(LOCKED,劇本指令)> Illustrator/Regulator   │
│   (CLAMPED,語音同步)> Affect Display(OPEN,情緒)     │
│   > Adaptor(Mood驅動,填補空隙,掛Layer D之下)         │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer W · 步態層 (Walking/Gait)                   │
│   walkSpeed/strideLength/armSwing(shoulder|elbow)  │
│   /verticalBounce/footstepWeight/posturalSway      │
│   ⚠️ 憤怒單靠步態辨識度最低,須配合Layer B/G;         │
│      凍結反應(威脅)覆蓋持續焦慮嘅搖晃基線             │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer 3 · 時間/真實度層 (Temporal/Authenticity)    │
│   眨眼、微表情洩漏(先眼後口)、Step-Out 過渡曲線        │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer D · 演員自由度引擎 (Actor's Discretion)       │
│   連戲延續 / 被動洩漏 / 主動即興(受人格檔案約束)       │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ Layer T · 延遲橋接層 (Latency Bridging)            │
│   思考姿態、填充語分級(<0.3s / 0.3-1s / 1-3s / >3s) │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ 十級 Surface Renderer(表面渲染層,可插拔)          │
│   Level 1發光體 → Level 4 Anime → Level 7比例偏移  │
│   → Level 9 MetaHuman級 → Level 10 實體機械人       │
│   ⚠️ 恐怖谷風險曲線:Level 7-8 為最高風險區          │
│   同一 Layer 1 輸出,各級實作相同 render() 介面      │
└───────────────────┬───────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│ 渲染輸出:自家點位 / ARKit 52 blendshapes / 伺服訊號  │
└─────────────────────────────────────────────────┘
```

---

## 3. 建議專案資料夾結構

```
lilith-expression-engine/
├── data/
│   ├── points/
│   │   ├── light-24.json          # 文件1 轉譯
│   │   └── pro-57.json            # 文件2 轉譯
│   ├── emotions/
│   │   ├── happy.json             # 文件3
│   │   ├── sad.json  angry.json  surprised.json  fear.json  disgust.json   # 文件5
│   │   ├── thinking.json  embarrassed.json  suspicious.json                 # 文件4
│   │   └── concerned.json         # 文件12 新增
│   ├── compounds/
│   │   └── region-ownership-rules.json   # 文件9 Part B
│   ├── personas/
│   │   ├── home.json  corp.json  mate.json  edu.json  care.json            # 文件12
│   ├── visemes/
│   │   └── preston-blair-10.json  # 文件15,口型定義+emotionWeight表
│   ├── body/
│   │   └── layer-b-emotion-map.json  # 文件17,頭頸/肩膊/呼吸情緒對照表
│   ├── fillers/
│   │   └── filler-pools.json      # 文件10+11,按人格分組
│   └── arkit-mapping.json         # 文件7,57點→ARKit 52 對照表
├── engine/
│   ├── idleMode.js                # Layer I(常駐背景,呼吸/次要動作/變體輪換)— 文件23
│   ├── moodEngine.js              # Layer -1
│   ├── compoundEmotionEngine.js   # Layer 1 複合邏輯
│   ├── pointMapper.js             # Layer 1→2
│   ├── visemeEngine.js            # Layer V(文字轉口型 + 口型-情緒混合公式)— 文件15
│   ├── eyeAnchorSystem.js         # Layer E(錨點/頭眼協調/VOR)— 文件13
│   ├── microsaccadeEngine.js      # Layer E(微掃視/飄移/震顫/瞳孔)— 文件13
│   ├── neckShoulderBreathing.js   # Layer B(頭頸/肩膊/呼吸,需與Layer E聯合讀取)— 文件17
│   ├── temporalLayer.js           # Layer 3(眨眼/洩漏/step-out)
│   ├── discretionEngine.js        # Layer D
│   ├── latencyBridge.js           # Layer T
│   └── personaController.js       # Layer P(封頂/篩選邏輯)
├── render/
│   ├── canvasRenderer2D.js        # 對應 prototype v1-v5 嘅畫布邏輯
│   └── arkitExporter.js           # 輸出 ARKit 相容格式
└── prototypes/                    # 直接搬字過紙 v1-v5.html 做參考/測試頁
```

---

## 4. 核心資料結構(合併定義,實作時用呢個做準)

### 4.1 情緒表資料格式(取代之前 markdown 表格)
```json
{
  "id": "happy",
  "layers": {
    "brow": { "L": "browLY", "R": "browRY" },
    "eye": { "openL": "eyeOpenL", "openR": "eyeOpenR" },
    "gaze": { "x": "gazeX", "y": "gazeY" },
    "mouth": { "cornerL": "cornerL", "cornerR": "cornerR", "open": "mouthOpen", "width": "mouthWidth" },
    "cheek": { "blush": "blush" },
    "nose": { "flare": "noseFlare" }
  },
  "formula_note": "見 prototype EMOTIONS object,每個參數係 t(強度) 嘅函數"
}
```
*(實作建議:直接將 v3/v5 prototype 入面 `EMOTIONS` object 嘅寫法搬去 `emotions/*.json` 描述唔到嘅部分,保留做 `.js` 公式函數,JSON 淨係做中介描述/文件用途)*

### 4.2 劇本格式(Layer 0,已在文件9定義)
沿用文件 9 嘅 schema,唔重複貼。

### 4.3 人格檔案格式
```json
{
  "id": "home",
  "name": "家居服務機械人",
  "traits": { "warmth":0.75, "formality":0.3, "expressiveness":0.55, "playfulness":0.5, "assertiveness":0.45 },
  "intensityCap": 0.7,
  "bannedEmotions": ["angry","disgust","fear"],
  "allowedEmotions": ["neutral","happy","sad","thinking","embarrassed","suspicious","surprised","happy_surprised"],
  "fillerPool": ["等我睇睇⋯","幫緊你,等等⋯","嗯,搞掂緊⋯","等我核對返⋯"],
  "idleAmplitude": 0.7,
  "moodVolatility": "slow"
}
```

---

## 5. 建議實作階段(俾 Claude Code 排優先次序)

**Phase 1 — 核心渲染(對應 prototype v1-v2)**
- 將 24/57 點位表轉做 JSON
- 實作 8 個基礎情緒 + 強度量表映射
- 靜態渲染器(2D canvas,可參考 v1/v2 code)

**Phase 2 — 時間軸行為(對應 prototype v2 的洩漏/眨眼)**
- 眨眼待機循環
- 微表情洩漏疊加(先眼後口時序)
- Step-Out 過渡曲線

**Phase 3 — 複合情緒 + 心情引擎(對應 prototype v3)**
- 複合情緒區域分工邏輯
- Mood Engine(背景偏壓、待機基線偏移)
- 劇本模式(連戲延續 vs Step-Out 對比)

**Phase 4 — 延遲橋接(對應 prototype v4)**
- 延遲檢測 + 分級填充語系統
- 思考姿態 + 眼神移離幅度分級

**Phase 5 — 人格系統(對應 prototype v5)**
- 五個人格檔案接入
- 人格參數封頂/篩選邏輯套用去所有上游層級

**Phase 6 — 輸出相容層(尚未做 prototype,下一步)**
- ARKit 52 blendshapes 映射器(參考文件7 Part 3)
- JSON/WebSocket 輸出介面,俾 Unity/Unreal/機械人伺服系統接入

---

## 6. 尚未覆蓋、值得記錄嘅擴充方向
- 身體姿態層(手勢、轉頭、姿勢)—— 文件10 提過,而家淨係得臉部
- 語音同步(lip-sync)同表情層點樣疊加唔衝突
- 多角色場景(兩個 Lilith 級角色互動時嘅眼神/情緒互相影響)
- 呼吸模式(Alba Emoting 完整三組件:呼吸/姿勢/表情,而家淨係做咗表情)

## 6. 已知迷思/已排除項目(Known Myths — Excluded from Science Layer)

呢個清單專門記錄「聽落合理、流行文化廣泛相信,但經查證後冇可靠學術支持」嘅講法。目的係
避免日後(你自己、team member、或者盡職審查嘅專利代理人/投資者)重新將呢啲講法當做「研究
根據」誤植返入 Layer 1-3/E 嘅正式系統。全部歸類做獨立嘅 `easterEggs` 命名空間(見文件14)。

| 迷思 | 結論 | 排除原因 |
|---|---|---|
| NLP 眼神方向定真假(望右上=講大話) | 已推翻 | 2012年 PLoS ONE(Wiseman et al.)真實案例+實驗均無支持 |
| 摸鼻/摸面=講大話(Pinocchio Effect) | 已推翻 | 多位研究者(Mark Frank、ten Brinke)明確否定 |
| 迴避眼神接觸=講大話 | 已推翻 | 冇證據支持,講真話者思考時同樣會眼神迴避 |
| 交叉手臂=防衛/收埋嘢 | 已推翻 | 多數只是舒適/習慣行為 |
| 訓練微表情辨識=可靠人肉測謊機 | 已推翻(應用層面) | GAO報告:訓練後準確度不比隨機猜測好。**注意**:微表情洩漏現象本身(文件6)依然有效,推翻嘅只係「訓練觀察者可以實時準確測謊」呢個過度推論 |

**維護原則**:日後如果再研究到新嘅「流行但唔科學」講法,應該持續加入呢個表,唔好直接假設「聽過就係啱」。

## 下一步
呢份文件已經可以交俾 Claude Code 開工。想我而家:
1. 將某一個 Phase(建議 Phase 1)寫成更細嘅逐步實作 checklist?
2. 轉去做商業/專利文件,評估呢套系統值幾多錢、點賣?
