# Amoji 系統規格 —— Part WW:動作風格層級(Layer MT —— Movement Timing)

## 呢個係第三個獨立維度——同「寫實度」「角色原型」都正交

你哋而家已經有兩個維度:Layer 十級(視覺寫實度)、Layer CA(角色原型)。
今次要求嘅「Disney卡通動作」「日本動漫動作」,講緊嘅唔係外觀寫實度,而係動作嘅
時序/節奏本身——即使外觀一模一樣(例如同一個Level 4 anime角色),動作可以用
寫實時序、動漫時序、定係卡通時序去演繹,三者效果完全唔同。

---

## Part 1:三個動作時序層級嘅技術定義

### Level R——寫實/動作捕捉時序(基準,已有)
<cite index="30-1">24幀/秒,「on ones」——每一格菲林都係獨立畫嘅新畫面。</cite>
呢個係你哋 Layer 1-W 現有系統嘅預設時序假設,對應真實人類生理速度嘅動作曲線。

### Level A(中間層級)——日本動漫/有限動畫時序
<cite index="30-1">有限動畫一般用大約8幀/秒,係好多電視動漫製作嘅標準幀數。</cite>
<cite index="30-1">呢個唔一定代表質素較低——有限動畫容許好多省時技巧,可以喺提升
關鍵畫面質素同流暢度嘅同時,改善成體演出。</cite>

### Level A 嘅三個具體技巧
技巧一:局部集中動作——<cite index="30-1">唔使重新畫成個畫面,場景嘅靜態元素保持
不變,郁動集中喺表現力最重要嘅特定區域(例如嘴巴、眼睛、手部)。</cite>

技巧二:「拖影格」(Smear Frame)——<cite index="29-1">快速郁動只用三個畫格表達:
開始狀態、結束狀態、同一個模擬低快門速度相機所拍到嘅「模糊格」。</cite>

技巧三:「全限制」動畫(進階技法)——<cite index="27-1">部分日本動畫師用「straight
ahead」(逐格順序畫,唔預先規劃關鍵姿勢)嘅手法,呢種風格由始至終都唔會完全定格
喺任何特定姿勢——最著名嘅例子係磯光雄,佢稱呢種手法做「全限制動畫」。</cite>

### Level C——Disney/卡通誇張時序(最高誇張)
<cite index="32-1">迪士尼動畫師喺1930年代發展出十二條動畫原則:壓縮拉伸
(squash and stretch)、預備動作(anticipation)、佈局(staging)、直接逐格/
關鍵姿勢兩種畫法、跟隨動作同重疊動作(follow through and overlapping action)、
漸入漸出(slow in and slow out)、弧線運動(arcs)、次要動作(secondary action)、
時間感(timing)、誇張(exaggeration)、立體感(solid drawing)、吸引力(appeal)。</cite>
<cite index="31-1">跟隨動作原則:身體較鬆散嘅部分(例如頭髮、衣服)會較慢郁動,拖喺
主要動作後面。</cite>

---

## Part 2:三層對比總表

| 特徵 | Level R(寫實) | Level A(動漫) | Level C(Disney) |
|---|---|---|---|
| 有效幀率 | 24fps連續 | ~8fps,局部集中 | 24fps但誇張物理 |
| 過渡方式 | 平滑插值 | 定格姿勢間跳接,或拖影格 | 平滑但有預備/跟隨動作 |
| 身體形變 | 冇(解剖學準確) | 極少(除非刻意誇張鏡頭) | 大幅壓縮拉伸(rubber-hose) |
| 適合場景 | 高保真數位人、實體機械人 | 一般對話/日常互動,3D避免恐怖谷嘅有效手法 | 兒童教育、吉祥物、高度誇張表演 |

重要發現:有限動畫技巧本身就係恐怖谷對策——<cite index="26-1">現代3D動畫師借鑑
有限動畫嘅技巧,可以幫助避開恐怖谷效應,強調藝術風格化多於超寫實動作。3D動畫入面,
渲染時間可能極度昂貴——透過採用有限動畫嘅技巧(例如減少關鍵幀數量、拉長定格時間、
減少唔必要嘅背景動作),3D動畫師可以同時減少渲染時間同製作成本。</cite>

呢個直接為你哋提供一個額外嘅技術/商業論述:Level A(動漫時序)唔止係美術
選擇,仲同時係一個恐怖谷風險降低手段、渲染成本降低手段(局部集中動作 = 唔使
全螢幕重新運算)。

---

## Part 3:Layer MT 嘅架構定義

```
CharacterArchetype(Layer CA) x SurfaceRenderer(十級) x MovementTiming(Layer MT)
= 完整嘅角色演出配置,三個維度互相正交,可自由組合

Layer MT 定義:
  Level R: interpolationMode=smooth, frameRate=24, exaggerationMultiplier=1.0
  Level A: interpolationMode=held-pose, effectiveFrameRate=8,
           focusedMotionRegions=[mouth,eyes,hands](其餘部位維持靜態),
           smearFrameEnabled=true(快速動作用三格拖影表達)
  Level C: interpolationMode=smooth, frameRate=24,
           squashStretchEnabled=true, anticipationFramesBeforeAction=true,
           followThroughEnabled=true, exaggerationMultiplier=1.3-2.0
           (呼應強度>1機制,呢度變成動作時序本身嘅誇張)
```

示例組合:
- 「Level 4外觀(anime) x Level A時序(動漫)」= 最典型嘅VTuber/日本動畫風格
- 「Level 4外觀(anime) x Level C時序(Disney)」= 誇張度更高、更似西方卡通嘅
混合風格
- 「Level 9外觀(MetaHuman級寫實) x Level R時序」= 反覆強調嘅高風險完全寫實
路線,必須全部一致

## 下一步
1. 想我做一個 prototype,示範同一個角色,分別用 Level R/A/C 三種動作時序播放
同一個「開心」表情轉場?
2. 定係同步返去總交接文件同 Complete Spec(v22,連同今次全部新文件一齊)?
