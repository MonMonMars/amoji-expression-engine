# Amoji 系統規格 —— Part LL:全身標記點系統(Layer 2-Body)—— 前後完整版

呢份文件將臉部點位系統(24/57/77點)延伸落全身,涵蓋前面同背面,對應返之前已經做好嘅
Layer B(頸肩呼吸)、Layer W(步態)、Layer G(手勢)研究,將呢啲研究入面用到嘅參數
(shoulderHeight、accessoryMuscleActivation、armSwingOrigin 等),正式對應去具體嘅
標記點,做法仿照業界動作捕捉標準(文件8提過嘅 Vicon 51點系統邏輯)。

---

## 座標系統延伸說明
沿用返臉部系統嘅慣例:
- 每個點都有中性/靜止位置做基準(0,0,0)
- 「前/後」分開標記,因為好多動作(例如聳肩、挺胸、拱背)前後點位嘅位移方向唔一致
- 強度量表(0/1/>1)沿用,人類生理極限=1,誇張/機械人模式可以 >1

---

## Part 1:身體前面(Front)—— 24 點

### I. 頸部前方(Neck Front)—— 1 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| NK-FRONT | 頸窩 | 鎖骨中間、喉結下方 | Layer B(頭頸傾斜嘅參考基準點) |

### II. 肩膊/鎖骨(Shoulder/Clavicle)—— 4 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| CL-L | 左鎖骨 | 鎖骨中段 | Layer B(shoulderHeight) |
| CL-R | 右鎖骨 | 對稱於 CL-L | 同上 |
| SH-L | 左肩峰 | 肩膊最外側頂點 | Layer B(accessoryMuscleActivation驅動嘅肩膊微起伏) |
| SH-R | 右肩峰 | 對稱於 SH-L | 同上 |

### III. 胸口(Chest/Sternum)—— 3 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| CS-TOP | 胸骨上切跡 | 頸窩下方 | Layer B(呼吸起伏嘅主要參考點) |
| CS-CTR | 胸骨中點 | 兩乳之間 | 同上,呼吸幅度嘅視覺化中心 |
| CS-LOW | 胸骨下端 | 肋骨下緣交界 | 深呼吸/大笑嗰陣嘅胸腔擴張範圍 |

### IV. 手臂前側(Arm Front)—— 8 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| UA-L | 左上臂中段 | 肩膊與手肘之間 | Layer G(armSwingOrigin=shoulder時嘅追蹤點) |
| UA-R | 右上臂中段 | 對稱於 UA-L | 同上 |
| EL-L | 左手肘 | 肘關節外側 | Layer G(armSwingOrigin=elbow時嘅關鍵樞紐,對應恐懼步態) |
| EL-R | 右手肘 | 對稱於 EL-L | 同上 |
| FA-L | 左前臂中段 | 手肘與手腕之間 | Layer W(步態手臂擺動幅度) |
| FA-R | 右前臂中段 | 對稱於 FA-L | 同上 |
| WR-L | 左手腕 | 腕關節 | Layer G(手勢終端定位) |
| WR-R | 右手腕 | 對稱於 WR-L | 同上 |

### V. 手部(Hand)—— 4 點(簡化版,唔做逐指節)
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| HN-L | 左手掌心 | 手背中心 | Layer G(Affect Display / Adaptor 嘅手部姿態) |
| HN-R | 右手掌心 | 對稱於 HN-L | 同上 |
| FG-L-PT | 左食指尖 | 食指末端 | Layer G(Illustrator 指示動作/Emblem 手勢細節) |
| FG-R-PT | 右食指尖 | 對稱於 FG-L-PT | 同上 |

### VI. 骨盆前方(Pelvis Front)—— 3 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| PV-CTR | 恥骨聯合 | 骨盆前方中點 | Layer W(重心參考) |
| PV-L | 左髂前上棘 | 骨盆左前方突起 | Layer W(髖部擺動/weight shift) |
| PV-R | 右髂前上棘 | 對稱於 PV-L | 同上 |

### VII. 腿部前方(Leg Front)—— 6 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| TH-L | 左大腿前側 | 髖與膝之間 | Layer W(步幅追蹤) |
| TH-R | 右大腿前側 | 對稱於 TH-L | 同上 |
| KN-L | 左膝蓋 | 髕骨中點 | Layer W(步態關鍵樞紐,cadence判讀) |
| KN-R | 右膝蓋 | 對稱於 KN-L | 同上 |
| SK-L | 左小腿前側 | 膝與踝之間(脛骨) | Layer W(步幅延伸) |
| SK-R | 右小腿前側 | 對稱於 SK-L | 同上 |

### VIII. 足部前方(Foot Front)—— 4 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| AN-L | 左腳踝 | 踝關節前方 | Layer W(footstepWeight判讀) |
| AN-R | 右腳踝 | 對稱於 AN-L | 同上 |
| TO-L | 左腳拇趾尖 | 大拇趾末端 | Layer W(步態推進蹬地細節) |
| TO-R | 右腳拇趾尖 | 對稱於 TO-R | 同上 |

---

## Part 2:身體背面(Back)—— 16 點

### I. 頸部背面(Neck Back)—— 1 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| NK-BACK | 第七頸椎(C7) | 頸背最突出嘅脊椎骨 | 業界標準mocap參考點,Layer B頭部傾斜嘅背面校準 |

### II. 肩胛骨(Scapula)—— 2 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| SC-L | 左肩胛骨 | 肩胛骨下角 | Layer B(斜方肌/提肩胛肌繃緊嘅視覺化,文件18) |
| SC-R | 右肩胛骨 | 對稱於 SC-L | 同上 |

### III. 脊椎(Spine)—— 3 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| SP-T | 胸椎中段 | 兩肩胛骨之間 | Layer W(彎腰弓背程度,大笑/傷心姿態) |
| SP-L | 腰椎 | 背部中下方 | Layer B(挺胸/佝僂姿態) |
| SP-S | 薦椎 | 腰部最下方、臀部上方 | 重心COG參考點(文件34已提及) |

### IV. 手臂背面(Arm Back)—— 2 點(三頭肌,補充前面手臂點)
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| UA-L-BACK | 左上臂後側 | 三頭肌中段 | Layer G(手臂旋前/旋後細節,較少用,進階選用) |
| UA-R-BACK | 右上臂後側 | 對稱於 UA-L-BACK | 同上 |

### V. 臀部(Gluteal)—— 2 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| GL-L | 左臀 | 臀肌最突出點 | Layer W(重心/weight shift背面參考) |
| GL-R | 右臀 | 對稱於 GL-L | 同上 |

### VI. 膝後(Popliteal)—— 2 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| KN-L-BACK | 左膝窩 | 膝蓋後方凹陷處 | Layer W(腿部彎曲角度嘅精確判讀) |
| KN-R-BACK | 右膝窩 | 對稱於 KN-L-BACK | 同上 |

### VII. 腳跟(Heel)—— 2 點
| ID | 點位名稱 | 位置描述 | 對應 Layer |
|---|---|---|---|
| HL-L | 左腳跟 | 跟骨最後方 | Layer W(footstepWeight嘅落地重踏判讀,對應憤怒步態) |
| HL-R | 右腳跟 | 對稱於 HL-L | 同上 |

---

## Part 3:總點位統計

| 部位 | 點數 |
|---|---|
| 臉部(57點專業版 + 擴充18點) | 77 |
| 身體前面 | 24 |
| 身體背面 | 16 |
| 全身總計(臉+身體) | 117 |

---

## Part 4:同現有 Layer 嘅完整對應表

```
Layer B(頸肩呼吸)  → NK-FRONT/BACK, CL-L/R, SH-L/R, CS-TOP/CTR/LOW, SC-L/R, SP-T/L/S
Layer W(步態)      → PV-*, TH-*, KN-*, SK-*, AN-*, TO-*, HL-*, GL-*(重心/步幅/落地)
Layer G(手勢)      → UA-*, EL-*, FA-*, WR-*, HN-*, FG-*(手臂/手部姿態)
姿態搖晃研究        → SP-S(重心COG參考,文件34)
```

**設計原則同臉部系統一致**:每個點位都可以獨立對應返之前已經寫好嘅研究/公式(Layer B
嘅 accessoryMuscleActivation、Layer W 嘅五情緒步態表、Layer G 嘅五類手勢分類),
呢份文件純粹係將抽象參數,正式綁定去具體嘅空間座標點,方便 Claude Code 實作 3D 骨架
綁定(rigging)嗰陣有明確嘅點位對照表可以跟。

## 下一步
1. 想我將呢117點嘅系統,加落 3D 角色 prototype 度,做一個可以睇到全身骨架點位嘅示範?
2. 定係同步返去總交接文件同 Complete Spec(v15)?
