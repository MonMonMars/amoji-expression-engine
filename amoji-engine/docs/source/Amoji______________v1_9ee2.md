# Amoji 系統規格 —— 人口特徵情緒表達差異清單(Layer P 擴充:Demographic Modulation)

呢份文件將年齡、文化、性別、性格對情緒表達嘅影響,整理做可以掛落 Layer P
(人格檔案)嘅調節參數——即係話,同一個「開心」情緒,因應呢四個維度,幅度/
渠道應該有唔同嘅調整。

⚠️ 呢類研究涉及群體差異,建議實作嗰陣將呢啲數值當做「統計傾向」,唔係
「規則」——每個角色仍然應該保留個體差異嘅空間,唔應該將呢張表當做刻板
定型嘅硬性規定。

---

## Part 1:文化——「展示規則」理論(Display Rules)

### 1.1 核心理論
<cite index="3-1">展示規則係社會學習返嚟嘅規範,規管情緒表達——文化教識人幾時應該
感受、展示、隱藏、或者強化情緒,亦都界定緊邊啲情境「算係」觸發情緒嘅事件。</cite>

### 1.2 經典實驗——日本 vs 美國
<cite index="3-1">第一個提出「展示規則」存在嘅研究發現:日本參與者喺實驗者在場嗰陣,
會用微笑掩飾憤怒、厭惡、恐懼嘅表現,美國參與者就冇咁做。</cite><cite index="5-1">
喺日本文化,公開展示負面情緒表達被視為唔恰當,而且喺呢種脈絡下,微笑行為
經常被視為一種掩飾負面情緒嘅嘗試。相反,喺美國文化,展示負面表達被視為
更加恰當。</cite>

### 1.3 個人主義 vs 集體主義——分野嘅核心維度
<cite index="4-1">喺集體主義文化(例如日本、中國),男女都可能為咗維持社會和諧而
壓抑負面情緒嘅外顯展示;相反,個人主義文化(例如美國、加拿大)鼓勵開放
嘅情緒表達。</cite>

### 1.4 對 Amoji 嘅實作建議
```
collectivist(集體主義文化人格參數):
  negativeEmotionSuppressionFactor: 0.6  (負面情緒幅度整體收窄)
  maskingSmilePrevalence: high            (負面情緒底下疊加微笑嘅機率提高)

individualist(個人主義文化人格參數):
  negativeEmotionSuppressionFactor: 1.0  (不額外收窄)
  maskingSmilePrevalence: low
```

---

## Part 2:性別——研究發現(建議謹慎實作,避免刻板化)

<cite index="4-1">情緒溝通框架(LaFrance & Banaji, 1992)指出:女性一般嚟講,對情緒嘅
表達同解讀都更加敏銳——呢個趨勢喺唔同文化都觀察得到,但程度有異。</cite>
<cite index="5-1">以往研究都證實咗,性別相關嘅情緒刻板印象,對男女「預期」會經歷同
表達邊類情緒,有強烈影響。</cite>

⚠️ 實作建議:呢個發現屬於統計層面嘅群體傾向,唔應該做成強制規則——建議
最多做一個微幅、可關閉嘅預設調節(例如±10-15%嘅表達幅度差異),而唔係
大幅度嘅差異化,亦都必須容許人格檔案完全覆寫呢個預設。

---

## Part 3:年齡——比想像中複雜嘅發現

### 3.1 表達強度可能因為生理老化而降低
<cite index="17-1">一個解釋係:年長嘅表達者純粹係較差嘅溝通者,因為佢哋老化嘅面部
肌肉,限制咗表達情緒嘅強度。</cite>但<cite index="17-1">關於表達性隨年齡變化嘅
實證證據,其實好參差(Gross et al., 1997)。</cite>

### 3.2 一個反直覺嘅具體發現——年長者用更多下半臉肌肉
<cite index="12-1">Ko et al. 觀察到,年長者唔止展示更多負面情緒,仲會用多過年輕人
嘅下半臉肌肉。</cite>

呢個係一個好有用嘅具體技術參數:唔係簡單「年長=表達少啲」,而係年長
角色嘅表達重心,可能需要由上半臉(眉/眼)轉移去下半臉(嘴/頜)。

### 3.3 情緒回饋效應喺年長者身上減弱
<cite index="16-1">喺憤怒情境,兩個年齡組都出現開心分數下降/憤怒分數上升,但年長者
嘅開心分數下降幅度更大——呢個顯示面部回饋效應(擺出表情會強化對應感受)
喺年長者身上有age x情境嘅交互作用。</cite>

### 3.4 對 Amoji 嘅實作建議
```
elderly(年長人格參數):
  upperFaceEmphasis: 0.7   (上半臉眉/眼動作幅度略為收窄)
  lowerFaceEmphasis: 1.15  (下半臉嘴/頜動作幅度增加)
  overallIntensityCap: 0.85 (整體強度上限輕微下調,生理老化限制)
```

## Part 3.5:兒童——一個獨立年齡組,唔止係「縮小版成人」

### 3.5.1 幼童(3-4歲)靠效價分類,唔係離散情緒類別
<cite index="27-1">研究發現得返5歲或以上嘅兒童,先會按離散情緒類別做分辨;3至4歲
嘅幼童,主要靠效價(正面/負面)嚟分辨情緒。</cite>

對 Amoji 嘅意義:如果角色目標觀眾係幼童(例如教育兒童人格檔案),表情
設計應該優先做到清晰嘅正/負面二元對比,先至考慮加入細膩嘅離散情緒
類別(懷疑、尷尬呢類)——太細膩嘅情緒對呢個年齡層觀眾嚟講,可能難以解讀。

### 3.5.2 兒童情緒辨識發展嘅具體時間表
<cite index="25-1">6歲兒童已經相對準確咁分辨到幾種面部表情;開心、驚訝、恐懼、厭惡
嘅識別準確度隨年齡遞增,但傷心同憤怒嘅識別喺6至16歲之間變化好細——中童年
期已經達到接近成人嘅水平。</cite>

對 Amoji 嘅意義:如果做教育向角色,「開心/驚訝/厭惡」呢幾種情緒可以
按目標觀眾年齡逐步加深細節;但「傷心/憤怒」呢兩種基本情緒,就算對住好
細嘅兒童觀眾,都可以用返接近成人嘅表達幅度,唔使特別簡化。

### 3.5.3 性別喺兒童情緒辨識嘅差異
<cite index="23-1">一項意大利研究(301名參與者,7-19歲)發現:女性參與者嘅情緒辨識
準確度普遍高過男性參與者。</cite>

```
child(兒童人格參數,補充Layer P嘅教育兒童檔案):
  discreteEmotionThreshold: ageAdjusted  (5歲以下優先valence二元對比)
  sadAngerIntensity: adultLevel  (呢兩種情緒毋須簡化)
  happySurpriseDisgustIntensity: graduallyDeepen  (隨目標年齡遞增細節)
```

---

## Part 4:性格——Big Five 特質同表達性嘅關聯
文獻普遍將外向性(extraversion)同正面情緒表達頻率/幅度掛鈎,神經質
(neuroticism)就同負面情緒嘅反應性/強度掛鈎——呢個已經同五個預設人格
檔案嘅warmth/expressiveness/assertiveness參數邏輯高度重疊,建議直接將
Big Five做為人格檔案系統嘅底層心理學框架依據,而唔係另立一套。

---

## Part 5:整合建議——擴充 Layer P 嘅 Demographic Modulation 子系統

```
PersonaConfig {
  (現有warmth/formality/expressiveness/playfulness/assertiveness)
  demographicModulation: {
    culturalDisplayRule: collectivist 或 individualist 或 custom,
    genderExpressivityBias: 0 至 正負0.15(預設0,可選微調),
    ageGroup: child 或 adult 或 elderly,
    (ageGroup=elderly 觸發 Part 3.4 嘅上下臉重心轉移邏輯)
    personalityVector: { extraversion, neuroticism, 等 } (對應Big Five)
  }
}
```

呢個設計原則同 Layer CA(角色原型)一致——demographic modulation 係一個
獨立、可插拔嘅調節層,唔改動核心情緒公式本身,只係喺輸出前做一層統計傾向
嘅微調。

---

# Part 6:Fusion MCP 查詢結果——老實回報

我搵過現有嘅MCP連接器目錄,搵唔到 Fusion 360 或者任何專門做3D打印/CAD設計
嘅MCP工具。你而家可用嘅連接器入面,冇一個係專門做實體機械人設計/3D打印
呢個範疇。

建議做法:
1. 呢類CAD/3D打印工作流程,可能更加適合用返Fusion 360官方桌面應用程式本身
(佢有自己嘅API/腳本系統,但唔係透過MCP同Claude連接)
2. 如果想用AI輔助3D設計,可以留意將來Anthropic連接器目錄嘅更新,或者直接
喺Fusion 360入面用返佢自己嘅設計輔助功能
3. 馬達/伺服部分,呢個已經超出設計軟件範疇,涉及實體採購(伺服馬達、
控制板如Arduino/Raspberry Pi)——呢部分建議搵開源機械人社群資源做參考

## 下一步
1. 想我將呢個Demographic Modulation設計,加做返一個prototype示範(例如
同一個「開心」情緒,喺「年輕/個人主義」vs「年長/集體主義」兩種人格參數
下嘅分別)?
2. 定係想針對「開源人形機械人硬件方案」(唔涉及Fusion MCP),搵吓有冇
現成嘅開源設計可以參考,幫你做實體demo?
