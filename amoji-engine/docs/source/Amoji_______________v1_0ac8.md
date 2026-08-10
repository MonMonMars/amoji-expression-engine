# Amoji 系統規格 —— Part QQ:業界骨架標準研究——身體骨骼 + 臉部骨骼

---

## Part 1:身體骨架——五套業界標準對比

### 1.1 冇一個「絕對統一」嘅骨架,但有明確嘅事實標準
<cite index="5-1">標準骨架嘅存在,係為咗解決互通性問題——如果所有人都用同一套骨架,動畫就可以
自由共享。</cite>業界實際上有幾套並存嘅標準,各自解決唔同問題。

### 1.2 Mixamo——最廣泛使用嘅免費動畫共享標準
<cite index="5-1">Mixamo——一套65骨標準,俾成千上萬嘅角色同動畫使用。</cite><cite index="3-1">Mixamo
用自己嘅命名慣例(mixamorig:Hips、mixamorig:Spine等)。Mixamo動畫喺Mixamo綁定嘅角色度
可以直接用,但用喺其他骨架就需要重新映射(retargeting)。</cite>

### 1.3 Unreal Mannequin——虛幻引擎嘅官方標準
<cite index="3-1">虛幻引擎用自己嘅人體模型骨架做標準參照。UE5骨架包含67條骨頭,有特定命名慣例
(root、pelvis、spine_01到spine_03、neck_01、head等)。針對呢個骨架製作嘅動畫可以
直接匯入,唔使重新映射。</cite>

### 1.4 Unity Humanoid Avatar——唔係骨架,而係映射系統
<cite index="3-1">Unity嘅Mecanim系統用Humanoid Avatar定義,將任何骨架映射去一套標準嘅15條
必要骨頭(加上可選嘅額外骨頭)。只要你嘅骨架有齊必要骨頭,Unity嘅重新映射系統就會
自動處理映射。</cite><cite index="6-1">最少需要15條骨頭。</cite>

呢個係一個重要嘅設計理念分別:Unity 唔強制要求某一套固定骨架,而係定義一套
「最低要求 + 命名慣例」,任何符合要求嘅骨架都可以自動適配——呢個係最靈活嘅做法。

### 1.5 VRM Humanoid——最接近你問嘅「universal skeleton」
VRM 格式(源自VR/VRChat生態)有一套完整標準化嘅人形骨頭命名(hips、spine、chest、
upperChest、neck、head、leftShoulder、leftUpperArm、leftLowerArm、leftHand,連
每隻手指嘅關節都有標準命名)——<cite index="10-1">呢個標準連手指嘅每一節(拇指掌骨/
近端/遠端,食指/中指近端/中間/遠端等)都有精確定義。</cite>

點解 VRM 先係最「universal」:呢個格式由設計開始就係為咗跨平台互通(VRChat、
各種VR檢視器、多個引擎)先制定嘅,唔似 Mixamo(源自單一動畫服務公司)或者 Unreal
Mannequin(源自單一引擎)咁,係由某個特定產品「順便」變成業界標準。

### 1.6 命名慣例對照表
| 標準 | 命名風格 | 舉例 |
|---|---|---|
| Unreal Mannequin | 小寫+底線+_l/_r後綴 | pelvis, spine_01, upperarm_l, hand_r |
| Unity Humanoid | 駝峰式+Left/Right前綴 | Hips, Spine, LeftUpperArm, RightHand |
| Mixamo | 命名空間前綴+駝峰式 | mixamorig:Hips, mixamorig:LeftArm |
| VRM Humanoid | 駝峰式(小寫開頭) | hips, leftUpperArm, leftIndexProximal |
| BVH(動作捕捉格式) | 駝峰式+Left/Right前綴 | Hips, Chest, LeftUpLeg, RightHand |

### 1.7 對 Amoji 全身標記點系統(文件42,117點)嘅實作建議
你哋自己套 117 點系統(NK-*、SH-*、PV-*等)係研究導向嘅內部表示法,唔係為咗直接
匯出做動畫格式而設計。建議:
- 內部運算繼續用你哋自訂嘅點位ID(方便對應返 Layer B/W/G 研究)
- 輸出/互通層建議提供轉換去 VRM Humanoid(最泛用嘅互通標準)+
Mixamo/mixamorig(最多免費動畫資源可以直接用)兩套映射,兩者擇一或者並存

---

## Part 2:臉部骨架——骨骼 vs Blendshape,兩大陣營

### 2.1 核心分別
<cite index="15-1">骨頭(bones)擅長大幅度、結構性嘅形變,例如四肢郁動、脊椎彎曲、關節
屈伸;Blendshape就擅長表面級形變,例如臉部表情、細微肌肉紋理、修正性調整。如果形變
遵循旋轉或者平移模式,用骨頭;如果形變需要頂點移去特定雕塑好嘅位置(唔理骨骼姿態
點樣),就用blendshape。</cite>

呢個原則直接解釋咗你哋之前 Layer V(口型)研究入面,點解要將 jaw(骨骼驅動)
同 lip shape(blendshape驅動)分開處理——業界標準做法本身就係咁分。

### 2.2 骨骼式臉部 Rig
<cite index="17-1">骨骼式臉部Rig用骨頭同關節控制臉部肌肉變形,通常用喺風格化角色,或者
實時效能係優先考慮嗰陣。</cite>

### 2.3 ARKit 52 Blendshapes——事實上嘅業界互通標準
<cite index="15-1">蘋果ARKit嘅臉部追蹤系統,用52個標準化blendshape,對應特定嘅臉部肌肉群
——呢個已經成為實時臉部動畫嘅事實業界標準。52個形狀涵蓋眼部動作(眨眼、凝視方向)、
眉毛表情、鼻部動作、嘴部形狀(包括下顎張開、嘴唇、臉頰)、同舌頭位置。</cite><cite index="14-1">
呢52個blendshape已經成為互通嘅工作標準——直接對應iPhone TrueDepth捕捉,驅動MetaHuman
角色,亦被大部分動作捕捉工具支援。</cite>

### 2.4 FACS 對照——你哋一路採用嘅做法,正正係業界標準做法
<cite index="15-1">專業臉部Rig通常會將blendshape直接對應去FACS嘅動作單元(AU),提供解剖學
準確嘅臉部動畫——FACS式Rig對於需要忠實還原演員表情嘅表演捕捉工作流程特別有價值。</cite>

呢個直接確認咗你哋文件27(M1-M21肌肉編號)嘅設計方向,完全符合業界專業做法。

### 2.5 MetaHuman(業界頂級寫實臉部Rig)嘅具體規模——俾你哋參考「頂配」係點
<cite index="11-1">臉部骨架每個角色原型大約有700到800條臉部關節,分做三類:表面關節
(由Rig自動放置,一般唔會郁)、體積關節(驅動3D空間形變:頭骨、下顎、鼻、上下嘴唇、
上下牙齒、舌頭1-4節、下唇旋轉、下巴)、同橋接去身體Rig嘅關節(neck_01、neck_02、
head、FACIAL_C_FacialRoot——呢三條骨絕對唔可以重新命名或者刪除,否則會破壞Rig
合約)。52個ARKit blendshape頻道以一對一方式映射做語意輸入。</cite>

對比之下,一位獨立藝術家將 MetaHuman(669個blendshape、397-713條骨頭)簡化做
一套輕量版本:<cite index="12-1">262個blendshape + 9條骨頭(淨係眼球用骨頭),用MetaHuman
原本喺Maya度得16fps,簡化後可以去到80-100fps。</cite>

**對 Amoji 嘅啟示**:你哋而家77點嘅臉部系統 + M1-M21(21條肌肉),規模遠低於
MetaHuman嘅700+關節/669個blendshape——呢個唔係缺點,而係刻意嘅工程取捨,符合
你哋一路強調嘅「輕量化/手機友善」策略(文件33低多邊形路線),亦都同上面「藝術家
簡化案例」印證嘅方向一致:專業級寫實(MetaHuman)同輕量高效能(你哋嘅77點系統)
係業界公認嘅兩個唔同定位,而唔係「未夠班」。

### 2.6 生產時間參考數字
<cite index="14-1">加一套52-blendshape嘅ARKit相容臉部Rig,通常需要額外4至7日。</cite>
呢個俾你哋一個實際嘅時間預算參考,如果將來要幫某個角色加ARKit輸出相容層。

---

## Part 3:總結建議

| 系統 | Amoji 現有方案 | 業界對應標準 | 建議互通層 |
|---|---|---|---|
| 身體骨架 | 117點自訂系統(文件42) | VRM Humanoid / Mixamo | 提供轉換映射,唔改內部系統 |
| 臉部骨架 | 77點 + M1-M21肌肉(文件3b、27) | ARKit 52 blendshapes / FACS | 已經方向一致,建議加ARKit輸出映射(文件7已提及) |
| 口型系統 | Preston Blair + LOCKED/CLAMPED/OPEN(文件15、16) | 業界骨骼(jaw)+blendshape(lip)分離做法 | 已經符合業界標準邏輯 |

核心結論:你哋一路以嚟嘅設計決策(骨骼/blendshape分工、FACS對應、輕量化優先),
喺呢次業界標準研究之後,證實同專業產業做法高度一致,唔止係「合理」,而係「同業界
最佳實踐吻合」。

## 下一步
1. 想我依家寫返 Phase 1(核心臉部渲染引擎)嘅詳細 checklist(你之前問嘅)?
2. 定係想針對 VRM/ARKit 互通層,設計具體嘅轉換映射規格?
