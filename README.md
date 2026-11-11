# Bambu Swatch & Calibration Studio
### 拓竹 3D 列印客製化色票與測試模型即時生成器 (Web 應用)

[English](#english-summary) | 繁體中文

一個專為 **Bambu Lab（X1-Carbon / P1S / P1P / A1 / A1 mini）** 與 **MakerWorld** 社群打造的純前端 3D 色票與校準模型生成工具。

使用者可以直接在瀏覽器中選定耗材品牌、材質、設定溫度與測試矩陣參數，前端透過 **Three.js** 進行毫秒級即時 3D 渲染與水密流形運算，並一鍵匯出**完全符合 MakerWorld 雲端發布規範與 Bambu Studio 原生切片**的 `.3mf` 專案檔！

---

## 🌟 核心特色 (全系列 150% 放大規格 128×75mm，厚度與孔洞尺寸嚴格保真)

1. **5 款專業測試模型庫 (Built-in Model Presets)**：
   - 📇 **多階透光色票卡 (Pro Swatch Card)**：$127.5\times 75.0\times 2.4\text{ mm}$（150% 放大規格）、標準 Ø4.5mm 穿繩掛孔（孔徑保真）、5 階透光天窗與浮雕對比圓環（0.2、0.4、0.6、0.8、1.0mm）、4 階線寬精度肋條、3 階孔徑收縮圓孔（Ø2/Ø3/Ø4mm 孔徑保真）、4 階光澤反射階梯。
   - 🌉 **雙軌懸空橋接測試卡 (Dual-Track Bridge Gauge)**：完整配置於 128×75mm 盤面內，15~75mm 跨距測試、每階具備窄線與寬帶雙軌、底板鏤空透光檢查窗、1~5mm 階梯下垂量測標尺（量測高度保真）。
   - 🪞 **4×5 表面熨燙校準矩陣卡 (Top Surface Ironing Matrix)**：完整 4 行 × 5 列 = 20 個大面積獨立樣塊（15.75×11.25mm，0.8mm 測試厚度保真）。左側標記 **F%**（流量 10%~25%），頂部標記 **S(mm)**（間距 0.10~0.20mm），各區塊獨立切片參數。
   - 🌊 **4×4 直立垂直列印 Fuzzy 噪波卡 (Vertical Fuzzy Skin Matrix)**：獨立直立垂直列印（無須額外支撐）。在 128×75mm 垂直外壁生成 4 行 (厚度 0.1~0.4mm) × 4 列 (點間距 0.2~0.8mm) = 16 個獨立噪波樣本，Ø4.5mm 掛孔保真，正面文字清晰雕刻。
   - 🎯 **4排銷徑精密公差量規 (Precision Tolerance Gauge)**：4 行測試銷直徑（Ø3.0 / Ø4.5 / Ø6.0 / Ø7.5mm 嚴格保真）× 5 列配合間隙（0.10~0.30mm 配合公差保真）= 20 個垂直站點，直立 90° TOLERANCE 標題編排，帶硬幣扭轉槽與實體床面基座。

2. **真正多零件組裝與每零件獨立切片修改器 (True Multi-Part Assembly & Per-Part Slicer Modifiers)**：
   - 匯出 3MF 時封裝為 Bambu Studio 標準的 **Assembly 組裝件**，內部包含多個獨立 `part`。
   - **4×5 表面熨燙矩陣**：底板基座為 `Base_Plate`（保持無熨燙），上方 20 個測試方塊各為獨立 `part`，直接注入各自的 `ironing_flow`、`ironing_spacing`、`ironing_speed`，切片後呈現真實熨燙時間！
   - **4×4 Fuzzy 噪波矩陣**：16 個立面樣塊各自注入 `fuzzy_skin="all"`、`fuzzy_skin_point_distance` 與 `fuzzy_skin_thickness`。
   - **公差配合量規**：20 個測試站點銷柱各為獨立零件，確保切片時保持物理間隙。

3. **即時極速渲染 (Real-time Live Auto-Rendering)**：
   - 調整滑桿或輸入數值即時自動重新計算幾何與著色，操作流暢無延遲。

4. **多國語言介面 (Multilingual Support)**：
   - 預設英文介面（English），支援繁體中文（zh-TW）、德文（Deutsch）、法文（Français）、西班牙文（Español）、義大利文（Italiano）與荷蘭文（Nederlands）一鍵切換。

5. **100% 遵守 MakerWorld 雲端切片與 Bambu Studio 規範**：
   - **顯式盤面與組裝定義**：在 `Metadata/model_settings.config` 中顯式定義 `<plate>`（`plater_id="1"`、`filament_maps="1 1 1 1"`）與 `<assemble>`，徹底根除 MakerWorld 無介面雲端切片時的「0 盤面報錯（`got plate count 0`）」。
   - **版本向下相容性**：切片專案全域版本統一鎖定國際發布穩定版 `02.07.01.62`，杜絕高版本切片引擎造成的解析錯誤。
   - **100% 水密流形幾何**：0 open edges、0 non-manifold edges，通過 Bambu Studio CLI 嚴格驗證。

---

## 🌐 部署至 GitHub Pages (一鍵分享線上連結)

本專案為純靜態 Web App，已設定 `vite.config.js` (`base: './'`) 與 GitHub Actions 自動部署工作流，任何人開啟網址就能直接使用，不需安裝任何環境！

### 步驟 1：建立 GitHub 儲存庫並推動程式碼
在終端機中進入本專案資料夾：
```bash
cd "projects/3D Printing/bambu-swatch-calibration-studio"

# 初始化 Git（若尚未初始化）
git init
git add .
git commit -m "Initial commit: Bambu Swatch & Calibration Studio"

# 將分支命名為 main
git branch -M main

# 在 GitHub 上建立一個全新的空白 Repository（例如命名為 bambu-swatch-calibration-studio）
# 然後將 origin 替換為你的 GitHub 倉庫網址：
git remote add origin https://github.com/<你的GitHub帳號>/bambu-swatch-calibration-studio.git
git push -u origin main
```

### 步驟 2：在 GitHub 啟用 Pages
1. 前往 GitHub 該專案頁面，點選頂部 **Settings**。
2. 在左側選單點選 **Pages**。
3. 在 **Build and deployment** > **Source** 下拉選單中，選擇 **GitHub Actions**。
4. 儲存後，GitHub Actions 會自動執行 `.github/workflows/deploy.yml` 進行打包與部署（約需 1 分鐘）。
5. 部署完成後，上方會顯示專屬線上網址：
   `https://<你的GitHub帳號>.github.io/bambu-swatch-calibration-studio/`

> 💡 **也可以使用 Vercel 免費一鍵匯入**：前往 [vercel.com](https://vercel.com)，點選 **Add New Project**，連接你的 GitHub 倉庫，無須修改任何設定直接點 **Deploy**，30 秒內即可獲得獨立的 `.vercel.app` 專屬網址！

---

## 📦 MakerWorld 官方預設 3MF 檔案

專案已預先產生並通過 Bambu Studio CLI 驗證的 5 款標準 3MF 檔案，存放在：
`projects/3D Printing/bambu-swatch-calibration-studio/MakerWorld_Default_3MFs/`
以及：
`projects/3D Printing/MakerWorld_Default_Calibration_Cards/`

| 檔案名稱 | 測試卡類型 | 規格尺寸 | Bambu CLI 檢驗 |
|---|---|---|---|
| `01_Bambu_Swatch_Card_85x50.3mf` | 5 階透光標準色票卡 | 85 × 50 × 2.4 mm | ✅ Passed (0 warnings) |
| `02_Bambu_Bridge_Test_Card_85x50.3mf` | 雙軌懸空橋接卡 (10~50mm) | 85 × 50 × 9.4 mm | ✅ Passed (0 warnings) |
| `03_Bambu_Ironing_Matrix_Card_85x50.3mf` | 表面熨燙 4×5 矩陣 (20 個修改器) | 85 × 50 × 3.2 mm | ✅ Passed (0 warnings) |
| `04_Bambu_Fuzzy_Skin_Matrix_Card_85x50.3mf` | 垂直立體 Fuzzy 4×4 矩陣 (16 個修改器) | 85 × 2.4 × 50.0 mm | ✅ Passed (0 warnings) |
| `05_Bambu_Tolerance_Gauge_Card_85x50.3mf` | 4 排銷徑精密公差卡 (20 孔位) | 85 × 50 × 4.8 mm | ✅ Passed (0 warnings) |

所有檔案均內嵌 512×512 原生 Bambu Studio 盤面預覽縮圖，上傳 MakerWorld 即可自動辨識盤面與零件修改器！

---

## 🛠️ 本地開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 打包生產版本
npm run build

# 執行 5 款預設模型全自動切片檢驗
node verify_all_presets.js

# 重新匯出 5 款 MakerWorld 官方 3MF 檔案（含縮圖渲染）
node export_and_verify_makerworld.js
```
