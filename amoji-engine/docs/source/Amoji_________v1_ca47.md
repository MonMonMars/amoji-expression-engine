# Amoji —— 代碼庫結構規劃(Public repo vs Private repo)

基於引擎結構圖嘅分類,轉化做實際嘅代碼庫組織方式。

---

## 建議兩個獨立 Git 倉庫

```
amoji-protocol(公開倉庫,GitHub public repo)
- README.md                          -- AEP協議介紹
- spec/
  - aep-v0.1.md                      -- AEP協議規格文件(CC-BY 4.0)
  - layer-ca-architecture.md         -- Layer CA概念文件(架構,唔含具體數值)
  - layer-mt-architecture.md         -- Layer MT概念文件(架構,唔含具體數值)
- examples/
  - basic-8-emotions.json            -- 免費層8基礎情緒範例
  - schema-validators/               -- JSON schema驗證工具
- reference-client/                  -- 渲染層參考實現(Elastic License 2.0)
  - three-js-renderer/               -- Three.js thin client
  - scenekit-renderer/                -- SceneKit thin client(如適用)
- LICENSE                            -- 協議CC-BY 4.0 + 客戶端Elastic License 2.0雙授權說明


amoji-core(私有倉庫,永遠唔公開)
- engine/
  - layers/
    - emotionFormulas.js             -- 複合情緒區域分工演算法
    - moodEngine.js                  -- Layer -1心情引擎公式
    - muscleTable.js                 -- M1-M21幅度矩陣具體數值(最高機密)
    - visemeResolver.js              -- 口型LOCKED/CLAMPED/OPEN邏輯
    - characterArchetypes/           -- 各原型具體行為學數值(貓/動物等)
    - movementTiming.js              -- Layer MT具體參數(誇張倍數等)
  - compliance/
    - aiDisclosure.js                -- 可考慮部分開放(觸發時機邏輯)
    - antiAddiction.js               -- 閾值數值保密
    - crisisIntervention.js          -- 絕對機密,偵測邏輯永不對外
- api/                               -- 雲端API服務層(部署喺你哋自己嘅伺服器)
- tests/                             -- 內部測試,唔隨代碼公開
```

---

## 資料流向(對應之前嘅上雲/落地分類)

```
客戶端(amoji-protocol嘅reference-client)
    向下經HTTPS API調用
你哋嘅雲端伺服器(amoji-core,私有部署)
    內部運算(客戶睇唔到)
    只回傳運算結果(blendshape序列/AU關鍵幀)
客戶端接收結果,做插值/渲染(唔涉及核心公式)
```

關鍵原則:amoji-core 嘅代碼永遠唔會被編譯/打包成客戶端可以睇到嘅
形式——就算你哋將來要做落地版SDK(例如俾機械人商喺自己硬件上運行,
唔可以每次都上雲),都應該將核心公式編譯做binary/混淆代碼,而唔係交出
可讀嘅原始碼。

## 下一步
已經處理返你要求嘅repo結構。接住做返你另外兩個問題(法規審核vs保密嘅
矛盾、講嘢速度同停頓研究)。
