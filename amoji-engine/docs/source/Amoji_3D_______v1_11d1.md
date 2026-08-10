# Amoji —— 3D 技術路線研究與建議

## 三個選項嘅核心分別

| | Three.js | Unity | Unreal Engine |
|---|---|---|---|
| 本質 | <cite index="87-1">輕量級,直接喺瀏覽器運行,適合網頁3D視覺同動畫</cite> | <cite index="87-1">完整遊戲引擎,內建物理、AI、VR等功能</cite> | <cite index="88-1">面向AAA遊戲、虛擬製作、建築/汽車可視化嘅完整實時技術套件</cite> |
| 部署方式 | 直接喺網頁 `<canvas>` 運行,唔使下載 | <cite index="84-1">2026年WebGL2.0喺手機瀏覽器全球支援率超過92%,但Unity WebGL係「全有或全冇」——要嘛成個引擎載入,要嘛乜都唔render;原生App(iOS/Android)反而係佢強項</cite> | 主要用於原生App/主機,網頁部署唔係強項 |
| 學習曲線 | <cite index="86-1">如果你已經識JavaScript,即日就可以出到第一個3D項目</cite> | <cite index="86-1">需要學識C#,學習成本較高但職涯機會較大</cite> | 更高,C++或藍圖(visual scripting) |
| 成本 | 開源免費 | <cite index="84-1">2026年Runtime Fee爭議已經取消(遊戲類客戶),但5人團隊嘅授權費都要每年11,550美元起——非遊戲類客戶嘅收費模式要另外向Unity銷售確認</cite> | 免費,但商業產品有票房/營收分成 |
| 複雜系統支援 | <cite index="84-1">如果項目需要物理模擬、布娃娃系統、複雜AI、碰撞偵測、動畫狀態機,Unity全部原生支援;喺Three.js做同等功能要額外花幾星期到幾個月自行開發</cite> | 原生支援 | 原生支援,業界最強 |
| SEO/網頁整合 | <cite index="84-1">可以喺3D內容周圍疊加正常HTML,搜尋引擎同AI搜尋都爬到文字內容;Core Web Vitals分數較好</cite> | Unity WebGL將所有嘢塞入單一canvas,SEO較差 | 不適用(非網頁優先) |

## 新興選項:PlayCanvas(值得留意)
<cite index="85-1">PlayCanvas係網頁世界最接近Unity工作流程嘅引擎,MIT開源,用TypeScript/JavaScript寫邏輯,
資產經伺服器管線輸出做GLB格式。</cite>對於想要「Unity級工作流程但保持喺瀏覽器」嘅團隊,呢個
係一個中間選項。

## 對 Amoji 四個客戶區隔嘅建議

| 客戶區隔 | 建議引擎 | 理由 |
|---|---|---|
| B2C #1(AI動畫師工具) | **Three.js**(起步)或 PlayCanvas | 網頁優先,零安裝門檻,快速迭代,啱你哋而家嘅資源規模;你套引擎邏輯本身就係 JSON 驅動(見總交接文件 Part 4),渲染層可以獨立換 |
| B2C #2(Apple App Store 插件) | **Unity**(或原生 RealityKit) | Grok Companions 本身都係 mobile-only 嘅原生 App 體驗;Unity 喺 App Store 部署、動畫狀態機呢方面最成熟 |
| B2B #1(LLM 平台授權) | 視乎對方技術棧——**建議引擎中立**,提供 Three.js SDK(網頁客戶)+ Unity SDK(App客戶)兩種輸出格式 | 大型 LLM 客戶技術棧唔統一,Grok 用緊自己嘅Mobile 3D引擎,你哋淨係提供「情緒數值→動畫參數」呢層,實際渲染由對方決定 |
| B2B #2(機械人公司) | **Unity** | 機械人業界對 Unity 熟悉程度較高(動畫狀態機、複雜行為邏輯呢方面成熟),亦都同機械人訓練慣用嘅 3D 模擬環境哲學一致 |

## 建議路線圖
1. **第一階段**:用 Three.js 做 B2C #1(AI動畫師工具)嘅 web MVP——你哋核心引擎邏輯(Layer 1-3、
E、B、G、V)全部係純 JS 函數,渲染器換 Three.js 嘅 3D mesh/blendshape 驅動,對接你之前
「ARKit 52 blendshape 相容輸出」嗰個設計(文件7),Three.js 生態對 glTF/ARKit blendshape
支援成熟
2. **第二階段**:驗證咗核心邏輯喺 3D 有效之後,先投資做 Unity 版本,俾 App Store 插件同機械人
B2B 客戶用
3. **貫穿全程**:保持核心引擎(情緒→參數嘅映射邏輯)同渲染層分離,呢個係你哋已經喺總交接
文件確立咗嘅架構原則,唔使因為換渲染引擎而重寫核心邏輯

## 下一步
想我針對 B2C #1(AI動畫師工具)寫一份具體嘅 MVP 產品規格?
