export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

export const TRANSLATIONS = {
  en: {
    appTitle: 'Bambu Swatch & Calibration Studio',
    appSubtitle: 'Customizable 3D Printing Calibration & Swatch Card Studio',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Copy Specs',
    copied: 'Copied!',
    exportSTL: 'Download STL',
    export3MF: 'Download Bambu 3MF',
    generating: 'Generating 3D...',
    guideSpecs: 'Guide & Specs',
    
    // Preset Titles & Clean Descriptions
    presets: {
      swatch: {
        name: 'Translucent Filament Swatch',
        desc: 'Standard 128×75mm card with 5-step thickness window, lanyard hole, and line width gauge.'
      },
      bridge: {
        name: 'Dual-Track Bridging Test Card',
        desc: 'Narrow (2mm) and wide (5mm) bridging tracks across 5 spans with a 1-5mm droop gauge.'
      },
      ironing: {
        name: 'Top Surface Ironing Matrix',
        desc: '4×5 matrix testing flow rates against line spacings for optimal top surface finish.'
      },
      fuzzy: {
        name: 'Vertical Fuzzy Skin Matrix',
        desc: 'Standalone vertical card with a 4×4 tactile grid of point distance vs skin thickness.'
      },
      tolerance: {
        name: 'Precision Tolerance Gauge',
        desc: '4 pin diameters across 5 clearance gap levels (20 stations) to evaluate fit and shrinkage.'
      }
    },

    // Parameter Panel
    modelSelectTitle: 'Select Calibration Card (128×75mm)',
    matrixParamsTitle: 'Preset Matrix & Geometry',
    ironingXTitle: 'X-Axis: Line Spacing (5 Cols)',
    ironingYTitle: 'Y-Axis: Flow Rate % (4 Rows)',
    fuzzyXTitle: 'X-Axis: Point Distance (4 Cols)',
    fuzzyYTitle: 'Y-Axis: Skin Thickness (4 Rows)',
    toleranceYTitle: 'Y-Axis: 4 Pin Diameters',
    toleranceXTitle: 'X-Axis: 5 Clearance Gaps (mm)',
    
    minSpacing: 'Min Spacing',
    maxSpacing: 'Max Spacing',
    minFlow: 'Min Flow',
    maxFlow: 'Max Flow',
    minDistance: 'Min Distance',
    maxDistance: 'Max Distance',
    minThickness: 'Min Thickness',
    maxThickness: 'Max Thickness',
    
    row1Small: 'Row 1 (Small)',
    row2MedSm: 'Row 2 (Med-Sm)',
    row3MedLg: 'Row 3 (Med-Lg)',
    row4Large: 'Row 4 (Large)',
    colLabel: 'Col',
    
    minSpan: 'Min Span',
    maxSpan: 'Max Span',
    pillarHeight: 'Bridge Height',
    translucentSteps: '5-Step Translucent Thickness (mm):',
    stepLabel: 'Step',
    includeHole: 'Include standard Ø4.5mm lanyard hole',
    
    filamentSection: 'Filament & Material',
    brand: 'Brand',
    materialProfile: 'Material Profile',
    colorFinish: 'Color & Finish',
    finishGlossy: 'Glossy',
    finishMatte: 'Matte',
    finishSilk: 'Silk',
    finishCF: 'CF Carbon',
    
    slicerSection: 'Slicer Settings Override',
    nozzleTemp: 'Nozzle Temp',
    bedTemp: 'Bed Temp',
    bridgeSpeed: 'Bridge Speed',
    bridgeFlow: 'Bridge Flow',
    flowRatio: 'Extrusion Flow',
    kFactor: 'Pressure Adv. (K)',
    
    customNotes: 'Physical Text Notes',
    customNotesPlaceholder: 'e.g. 0.4 NOZZLE / DRY 6H',
    dimensions: 'Dimensions',
    standardCard: '128 × 75 mm (150%) Standard Card',
    triangles: 'Triangles:',

    // Modal Guide
    infoTitle: 'Bambu Studio & MakerWorld 3MF Standards',
    infoSubtitle: 'Client-side generation of watertight 2-manifold 3D meshes packaged into standard Bambu Studio and MakerWorld 3MF projects.',
    infoFeature1Title: '1. Explicit Plate & Assemble Definitions',
    infoFeature1Desc: 'Fully declares <plate> and <assemble> tags in Metadata/model_settings.config to guarantee 100% compatibility with MakerWorld cloud slicing.',
    infoFeature2Title: '2. Stable Version Compatibility',
    infoFeature2Desc: 'Project configuration is locked to the internationally recognized stable release 02.07.01.62.',
    infoFeature3Title: '3. Crisp Physical Text & Slicer Parameter Injection',
    infoFeature3Desc: 'Text is embossed directly onto model surfaces for razor-sharp 3D prints, while customized temperature, bridge speed, and flow settings are injected directly into the 3MF slicer config.',
    cliVerifyTitle: 'Local Bambu Studio CLI Verification Command:',
    closeBtn: 'Got it'
  },

  zh: {
    appTitle: 'Bambu 色票與校準矩陣生成器',
    appSubtitle: '拓竹客製化耗材色票與參數校準模型生成器',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: '複製參數',
    copied: '已複製！',
    exportSTL: '下載 STL',
    export3MF: '下載 Bambu 3MF',
    generating: '運算幾何中...',
    guideSpecs: '規格指南',

    presets: {
      swatch: {
        name: '多階透光色票樣卡',
        desc: '標準 128×75mm 規格，具備 5 階透光窗、掛孔與精度肋條。'
      },
      bridge: {
        name: '雙軌橋接測試校準卡',
        desc: '窄線 (2mm) 與寬帶 (5mm) 雙軌 5 階跨距測試，附帶 1~5mm 階梯下垂量測標尺。'
      },
      ironing: {
        name: '表面熨燙校準矩陣卡',
        desc: '4×5 測試矩陣（流量% × 行間距），精準調校頂層平整度與光澤。'
      },
      fuzzy: {
        name: '垂直外壁 Fuzzy 噪波卡',
        desc: '直立獨立卡片，包含 4×4 點間距與噪波厚度矩陣，直觀比對手感觸感。'
      },
      tolerance: {
        name: '精密配合公差量規卡',
        desc: '4 組不同圓銷直徑配合 5 階公差間隙（共 20 個插孔），測試機構裝配與材料收縮。'
      }
    },

    modelSelectTitle: '測試卡模型切換 (128×75mm)',
    matrixParamsTitle: '測試專屬矩陣與幾何參數',
    ironingXTitle: 'X 軸：線間距 (5 欄)',
    ironingYTitle: 'Y 軸：熨燙流量 % (4 列)',
    fuzzyXTitle: 'X 軸：點間距 (4 欄)',
    fuzzyYTitle: 'Y 軸：噪波厚度 (4 列)',
    toleranceYTitle: 'Y 軸：4 組測試圓銷直徑',
    toleranceXTitle: 'X 軸：5 階配合間隙 (mm)',
    
    minSpacing: '最小間距',
    maxSpacing: '最大間距',
    minFlow: '最小流量',
    maxFlow: '最大流量',
    minDistance: '最小間距',
    maxDistance: '最大間距',
    minThickness: '最小厚度',
    maxThickness: '最大厚度',
    
    row1Small: '列 1 (小)',
    row2MedSm: '列 2 (中小)',
    row3MedLg: '列 3 (中大)',
    row4Large: '列 4 (大)',
    colLabel: '行',
    
    minSpan: '最小跨距',
    maxSpan: '最大跨距',
    pillarHeight: '橋接架空高度',
    translucentSteps: '5 階透光窗底厚 (mm)：',
    stepLabel: '階',
    includeHole: '包含標準 Ø4.5mm 左側掛卡孔',
    
    filamentSection: '耗材基本資訊與外觀',
    brand: '耗材品牌',
    materialProfile: '材質設定檔',
    colorFinish: '外觀光澤與顏色',
    finishGlossy: 'Glossy 光澤',
    finishMatte: 'Matte 消光',
    finishSilk: 'Silk 絲綢',
    finishCF: 'CF 碳纖',
    
    slicerSection: 'Slicer 核心切片參數覆寫',
    nozzleTemp: '噴嘴溫度',
    bedTemp: '熱床溫度',
    bridgeSpeed: '橋接速度',
    bridgeFlow: '橋接流量比',
    flowRatio: '全域流量比',
    kFactor: '壓力提前 (K)',
    
    customNotes: '實體陰刻備忘文字',
    customNotesPlaceholder: '自訂刻印在模型上的標註 (如 0.4 NOZZLE / DRY 6H)',
    dimensions: '尺寸規格',
    standardCard: '128 × 75 mm (150%) 統一色票規格',
    triangles: '幾何三角面數:',

    infoTitle: 'Bambu Studio & MakerWorld 3MF 規格標準',
    infoSubtitle: '純前端動態生成 100% 水密流形（2-Manifold）的 3D 實體模型，原生相容 Bambu Studio 與 MakerWorld 的標準 3MF 專案檔。',
    infoFeature1Title: '1. 顯式定義盤面與組裝關係（MakerWorld 0 盤面相容）',
    infoFeature1Desc: '在 Metadata/model_settings.config 中完整包含 <plate>、<assemble> 與耗材映射，無縫通過 MakerWorld Headless 雲端切片引擎驗證。',
    infoFeature2Title: '2. 版本鎖定與向下相容性',
    infoFeature2Desc: '專案設定檔嚴格鎖定於國際穩定發布版本 02.07.01.62，杜絕高版本切片引擎造成的解析錯誤。',
    infoFeature3Title: '3. 實體陽刻與即時切片覆寫',
    infoFeature3Desc: '文字直接陽刻於模型頂面，清晰銳利；下載的 3MF 會直接將你調整的溫度、橋接速度與流量比預先填入切片軟體中。',
    cliVerifyTitle: '本機 Bambu Studio CLI 驗證指令:',
    closeBtn: '我知道了'
  },

  de: {
    appTitle: 'Bambu Farb- & Kalibrierstudio',
    appSubtitle: 'Anpassbarer 3D-Druck-Kalibrier- und Musterkarten-Generator',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Werte kopieren',
    copied: 'Kopiert!',
    exportSTL: 'STL herunterladen',
    export3MF: 'Bambu 3MF laden',
    generating: 'Wird berechnet...',
    guideSpecs: 'Anleitung & Specs',

    presets: {
      swatch: {
        name: 'Lichtdurchlässiges Farbmuster',
        desc: 'Standard 128×75mm Karte mit 5 Stufen Lichtdurchlässigkeit, Loch und Linienmessung.'
      },
      bridge: {
        name: 'Doppelspur-Brücken-Testkarte',
        desc: 'Schmale (2mm) und breite (5mm) Brückenspuren über 5 Längen mit 1-5mm Durchhangmesser.'
      },
      ironing: {
        name: 'Oberflächen-Glättungsmatrix',
        desc: '4×5 Matrix zur Abstimmung von Flussrate und Linienabstand für glatte Oberflächen.'
      },
      fuzzy: {
        name: 'Vertikale Fuzzy Skin Testkarte',
        desc: 'Aufrechte Testkarte mit 4×4 Raster aus Punktabstand und Dicke für taktile Texturen.'
      },
      tolerance: {
        name: 'Präzisions-Toleranzlehre',
        desc: '4 Stiftdurchmesser über 5 Spielstufen (20 Stationen) zur Passungs- und Schrumpfungsmessung.'
      }
    },

    modelSelectTitle: 'Testkarte wählen (128×75mm)',
    matrixParamsTitle: 'Matrix- & Geometrieparameter',
    ironingXTitle: 'X-Achse: Linienabstand (5 Spalten)',
    ironingYTitle: 'Y-Achse: Flussrate % (4 Zeilen)',
    fuzzyXTitle: 'X-Achse: Punktabstand (4 Spalten)',
    fuzzyYTitle: 'Y-Achse: Hautdicke (4 Zeilen)',
    toleranceYTitle: 'Y-Achse: 4 Stiftdurchmesser',
    toleranceXTitle: 'X-Achse: 5 Passungsspiele (mm)',
    
    minSpacing: 'Min. Abstand',
    maxSpacing: 'Max. Abstand',
    minFlow: 'Min. Fluss',
    maxFlow: 'Max. Fluss',
    minDistance: 'Min. Abstand',
    maxDistance: 'Max. Abstand',
    minThickness: 'Min. Dicke',
    maxThickness: 'Max. Dicke',
    
    row1Small: 'Reihe 1 (Klein)',
    row2MedSm: 'Reihe 2 (M-Klein)',
    row3MedLg: 'Reihe 3 (M-Groß)',
    row4Large: 'Reihe 4 (Groß)',
    colLabel: 'Spalte',
    
    minSpan: 'Min. Spannweite',
    maxSpan: 'Max. Spannweite',
    pillarHeight: 'Brückenhöhe',
    translucentSteps: '5 Stufen Lichtdurchlässigkeit (mm):',
    stepLabel: 'Stufe',
    includeHole: 'Inklusive Ø4,5mm Aufhängeloch',
    
    filamentSection: 'Filament & Material',
    brand: 'Marke',
    materialProfile: 'Materialprofil',
    colorFinish: 'Farbe & Oberfläche',
    finishGlossy: 'Glänzend',
    finishMatte: 'Matt',
    finishSilk: 'Seide',
    finishCF: 'CF Karbon',
    
    slicerSection: 'Slicer-Einstellungen',
    nozzleTemp: 'Düsentemperatur',
    bedTemp: 'Betttemperatur',
    bridgeSpeed: 'Brückengeschwindigkeit',
    bridgeFlow: 'Brückenfluss',
    flowRatio: 'Flussverhältnis',
    kFactor: 'Pressure Advance (K)',
    
    customNotes: 'Geprägter Notiztext',
    customNotesPlaceholder: 'z.B. 0.4 NOZZLE / DRY 6H',
    dimensions: 'Abmessungen',
    standardCard: '128 × 75 mm (150%) Standardkarte',
    triangles: 'Dreiecke:',

    infoTitle: 'Bambu Studio & MakerWorld 3MF Standards',
    infoSubtitle: 'Generierung von wasserdichten 2-Manifold 3D-Modellen, kompatibel mit Bambu Studio und MakerWorld.',
    infoFeature1Title: '1. Explizite Druckbett- & Montagedefinitionen',
    infoFeature1Desc: 'Vollständige Deklaration von <plate> und <assemble> für 100% Kompatibilität mit dem MakerWorld Cloud-Slicer.',
    infoFeature2Title: '2. Stabile Versionskompatibilität',
    infoFeature2Desc: 'Konfiguration ist auf die internationale Version 02.07.01.62 festgelegt.',
    infoFeature3Title: '3. Gestochen scharfer Text & Slicer-Parameter',
    infoFeature3Desc: 'Präzise Modellbeschriftung und automatische Übertragung aller Druck- und Temperaturwerte in die 3MF-Datei.',
    cliVerifyTitle: 'Bambu Studio CLI Überprüfungsbefehl:',
    closeBtn: 'Verstanden'
  },

  fr: {
    appTitle: 'Bambu Studio de Nuanciers & Calibration',
    appSubtitle: 'Générateur de cartes de test et nuanciers d’impression 3D personnalisables',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Copier réglages',
    copied: 'Copié !',
    exportSTL: 'Télécharger STL',
    export3MF: 'Télécharger Bambu 3MF',
    generating: 'Génération 3D...',
    guideSpecs: 'Guide & Spécifications',

    presets: {
      swatch: {
        name: 'Échantillon de filament translucide',
        desc: 'Carte standard 128×75mm avec 5 épaisseurs de transparence, trou de suspension et jauges de ligne.'
      },
      bridge: {
        name: 'Carte de test de pontage double voie',
        desc: 'Pistes étroite (2mm) et large (5mm) sur 5 portées avec jauge d’affaissement 1-5mm.'
      },
      ironing: {
        name: 'Matrice de lissage de surface',
        desc: 'Matrice 4×5 combinant débit et espacement pour une finition de surface ultra-lisse.'
      },
      fuzzy: {
        name: 'Matrice de peau floue verticale',
        desc: 'Carte verticale autonome avec grille 4×4 de distance et épaisseur pour textures tactiles.'
      },
      tolerance: {
        name: 'Jauge de tolérance de précision',
        desc: '4 diamètres de broche sur 5 jeux d’ajustement (20 alésages) pour tester emboîtement et retrait.'
      }
    },

    modelSelectTitle: 'Sélectionner une carte de test (128×75mm)',
    matrixParamsTitle: 'Paramètres de matrice et géométrie',
    ironingXTitle: 'Axe X : Espacement des lignes (5 cols)',
    ironingYTitle: 'Axe Y : Débit de lissage % (4 rangs)',
    fuzzyXTitle: 'Axe X : Distance de point (4 cols)',
    fuzzyYTitle: 'Axe Y : Épaisseur de texture (4 rangs)',
    toleranceYTitle: 'Axe Y : 4 diamètres de broche',
    toleranceXTitle: 'Axe X : 5 jeux de dégagement (mm)',
    
    minSpacing: 'Espacement min',
    maxSpacing: 'Espacement max',
    minFlow: 'Débit min',
    maxFlow: 'Débit max',
    minDistance: 'Distance min',
    maxDistance: 'Distance max',
    minThickness: 'Épaisseur min',
    maxThickness: 'Épaisseur max',
    
    row1Small: 'Rang 1 (Petit)',
    row2MedSm: 'Rang 2 (Moy-Petit)',
    row3MedLg: 'Rang 3 (Moy-Grand)',
    row4Large: 'Rang 4 (Grand)',
    colLabel: 'Col',
    
    minSpan: 'Portée min',
    maxSpan: 'Portée max',
    pillarHeight: 'Hauteur de pont',
    translucentSteps: '5 épaisseurs de transparence (mm) :',
    stepLabel: 'Niveau',
    includeHole: 'Inclure le trou de suspension Ø4,5mm',
    
    filamentSection: 'Filament & Matériau',
    brand: 'Marque',
    materialProfile: 'Profil matériau',
    colorFinish: 'Couleur & Finition',
    finishGlossy: 'Brillant',
    finishMatte: 'Mat',
    finishSilk: 'Satiné / Soie',
    finishCF: 'Fibre de carbone',
    
    slicerSection: 'Réglages du slicer',
    nozzleTemp: 'Temp. buse',
    bedTemp: 'Temp. plateau',
    bridgeSpeed: 'Vitesse de pont',
    bridgeFlow: 'Débit de pont',
    flowRatio: 'Débit global',
    kFactor: 'Avance de pression (K)',
    
    customNotes: 'Texte physique gravé',
    customNotesPlaceholder: 'ex. BUSE 0.4 / SÉCHAGE 6H',
    dimensions: 'Dimensions',
    standardCard: 'Carte standard 128 × 75 mm (150%)',
    triangles: 'Triangles :',

    infoTitle: 'Normes Bambu Studio & MakerWorld 3MF',
    infoSubtitle: 'Génération de maillages 3D 100% étanches (2-Manifold) encapsulés dans des projets 3MF officiels.',
    infoFeature1Title: '1. Déclarations explicites de plateau & d’assemblage',
    infoFeature1Desc: 'Contient les balises <plate> et <assemble> dans Metadata/model_settings.config pour un découpage cloud MakerWorld sans faille.',
    infoFeature2Title: '2. Compatibilité de version stable',
    infoFeature2Desc: 'Fichiers configurés pour la version internationale stable 02.07.01.62.',
    infoFeature3Title: '3. Gravure physique & injection des paramètres',
    infoFeature3Desc: 'Textes en relief ultra-nets et injection automatique de vos températures, vitesses et débits dans le trancheur.',
    cliVerifyTitle: 'Commande CLI locale de vérification Bambu Studio :',
    closeBtn: 'Fermer'
  },

  es: {
    appTitle: 'Bambu Estudio de Muestras y Calibración',
    appSubtitle: 'Generador configurable de tarjetas de calibración y muestras de filamento 3D',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Copiar datos',
    copied: '¡Copiado!',
    exportSTL: 'Descargar STL',
    export3MF: 'Descargar Bambu 3MF',
    generating: 'Generando 3D...',
    guideSpecs: 'Guía y especificaciones',

    presets: {
      swatch: {
        name: 'Muestra de filamento translúcido',
        desc: 'Tarjeta estándar de 128×75mm con ventana de 5 grosores de luz, orificio y calibre de líneas.'
      },
      bridge: {
        name: 'Tarjeta de puentes de doble vía',
        desc: 'Pistas estrecha (2mm) y ancha (5mm) en 5 tramos con regla de caída de 1-5mm.'
      },
      ironing: {
        name: 'Matriz de alisado de superficie',
        desc: 'Matriz 4×5 para calibrar flujo y espaciado de líneas para un acabado superficial suave.'
      },
      fuzzy: {
        name: 'Matriz vertical de piel difusa',
        desc: 'Tarjeta vertical autónoma con rejilla 4×4 de distancia y grosor para acabados táctiles.'
      },
      tolerance: {
        name: 'Calibre de tolerancias de precisión',
        desc: '4 diámetros en 5 niveles de holgura (20 estaciones) para medir ajuste mecánico y contracción.'
      }
    },

    modelSelectTitle: 'Seleccionar tarjeta de calibración (128×75mm)',
    matrixParamsTitle: 'Parámetros de matriz y geometría',
    ironingXTitle: 'Eje X: Espaciado de líneas (5 cols)',
    ironingYTitle: 'Eje Y: Tasa de flujo % (4 filas)',
    fuzzyXTitle: 'Eje X: Distancia de punto (4 cols)',
    fuzzyYTitle: 'Eje Y: Grosor de piel (4 filas)',
    toleranceYTitle: 'Eje Y: 4 diámetros de pasador',
    toleranceXTitle: 'Eje X: 5 holguras de ajuste (mm)',
    
    minSpacing: 'Espaciado mín',
    maxSpacing: 'Espaciado máx',
    minFlow: 'Flujo mín',
    maxFlow: 'Flujo máx',
    minDistance: 'Distancia mín',
    maxDistance: 'Distancia máx',
    minThickness: 'Grosor mín',
    maxThickness: 'Grosor máx',
    
    row1Small: 'Fila 1 (Pequeño)',
    row2MedSm: 'Fila 2 (Med-Peq)',
    row3MedLg: 'Fila 3 (Med-Gde)',
    row4Large: 'Fila 4 (Grande)',
    colLabel: 'Col',
    
    minSpan: 'Longitud mín',
    maxSpan: 'Longitud máx',
    pillarHeight: 'Altura del puente',
    translucentSteps: '5 grosores de translucidez (mm):',
    stepLabel: 'Paso',
    includeHole: 'Incluir orificio estándar de Ø4.5mm',
    
    filamentSection: 'Filamento y material',
    brand: 'Marca',
    materialProfile: 'Perfil de material',
    colorFinish: 'Color y acabado',
    finishGlossy: 'Brillante',
    finishMatte: 'Mate',
    finishSilk: 'Seda',
    finishCF: 'Fibra de carbono',
    
    slicerSection: 'Ajustes de laminación (Slicer)',
    nozzleTemp: 'Temp. boquilla',
    bedTemp: 'Temp. cama',
    bridgeSpeed: 'Velocidad puente',
    bridgeFlow: 'Flujo de puente',
    flowRatio: 'Tasa de flujo global',
    kFactor: 'Avance de presión (K)',
    
    customNotes: 'Texto físico grabado',
    customNotesPlaceholder: 'ej. BOQUILLA 0.4 / SECAR 6H',
    dimensions: 'Dimensiones',
    standardCard: 'Tarjeta estándar 128 × 75 mm (150%)',
    triangles: 'Triángulos:',

    infoTitle: 'Estándares Bambu Studio & MakerWorld 3MF',
    infoSubtitle: 'Generación directa de geometrías 100% estancas (2-Manifold) empaquetadas en proyectos estándar 3MF.',
    infoFeature1Title: '1. Definición explícita de cama y ensamblado',
    infoFeature1Desc: 'Incluye etiquetas <plate> y <assemble> para compatibilidad total con el motor de corte en la nube de MakerWorld.',
    infoFeature2Title: '2. Versión estable compatible',
    infoFeature2Desc: 'Configuración fijada en la versión estable internacional 02.07.01.62.',
    infoFeature3Title: '3. Textos nítidos en relieve e inyección de datos',
    infoFeature3Desc: 'Rotulación nítida y traspaso automático de parámetros de temperatura y velocidad al laminador.',
    cliVerifyTitle: 'Comando de verificación CLI local de Bambu Studio:',
    closeBtn: 'Entendido'
  },

  it: {
    appTitle: 'Bambu Studio Campioni e Calibrazione',
    appSubtitle: 'Generatore configurabile di schede di calibrazione e campioni filamento 3D',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Copia dati',
    copied: 'Copiato!',
    exportSTL: 'Scarica STL',
    export3MF: 'Scarica Bambu 3MF',
    generating: 'Generazione 3D...',
    guideSpecs: 'Guida e specifiche',

    presets: {
      swatch: {
        name: 'Campione filamento traslucido',
        desc: 'Scheda standard 128×75mm con finestra a 5 spessori, foro e guide per spessore linee.'
      },
      bridge: {
        name: 'Scheda di test bridging a doppio binario',
        desc: 'Tracce stretta (2mm) e larga (5mm) su 5 campate con misuratore di flessione 1-5mm.'
      },
      ironing: {
        name: 'Matrice stiratura superficie (Ironing)',
        desc: 'Matrice 4×5 per calibrare flusso e spaziatura per finiture superficiali perfettamente lisce.'
      },
      fuzzy: {
        name: 'Matrice verticale pelle sfocata (Fuzzy)',
        desc: 'Scheda verticale autonoma con griglia tattile 4×4 di distanza punti e spessore.'
      },
      tolerance: {
        name: 'Calibro di precisione tolleranze',
        desc: '4 diametri di perno su 5 livelli di gioco (20 stazioni) per testare accoppiamento e ritiro.'
      }
    },

    modelSelectTitle: 'Seleziona scheda di calibrazione (128×75mm)',
    matrixParamsTitle: 'Parametri matrice e geometria',
    ironingXTitle: 'Asse X: Spaziatura linee (5 col)',
    ironingYTitle: 'Asse Y: Flusso stiratura % (4 righe)',
    fuzzyXTitle: 'Asse X: Distanza punti (4 col)',
    fuzzyYTitle: 'Asse Y: Spessore pelle (4 righe)',
    toleranceYTitle: 'Asse Y: 4 diametri perno',
    toleranceXTitle: 'Asse X: 5 giochi di tolleranza (mm)',
    
    minSpacing: 'Spaziatura min',
    maxSpacing: 'Spaziatura max',
    minFlow: 'Flusso min',
    maxFlow: 'Flusso max',
    minDistance: 'Distanza min',
    maxDistance: 'Distanza max',
    minThickness: 'Spessore min',
    maxThickness: 'Spessore max',
    
    row1Small: 'Riga 1 (Piccolo)',
    row2MedSm: 'Riga 2 (Med-Picc)',
    row3MedLg: 'Riga 3 (Med-Gde)',
    row4Large: 'Riga 4 (Grande)',
    colLabel: 'Col',
    
    minSpan: 'Campata min',
    maxSpan: 'Campata max',
    pillarHeight: 'Altezza ponte',
    translucentSteps: '5 spessori di traslucenza (mm):',
    stepLabel: 'Passo',
    includeHole: 'Includi foro di sospensione Ø4.5mm',
    
    filamentSection: 'Filamento e materiale',
    brand: 'Marca',
    materialProfile: 'Profilo materiale',
    colorFinish: 'Colore e finitura',
    finishGlossy: 'Lucido',
    finishMatte: 'Opaco',
    finishSilk: 'Seta',
    finishCF: 'Fibra di carbonio',
    
    slicerSection: 'Parametri dello slicer',
    nozzleTemp: 'Temp. ugello',
    bedTemp: 'Temp. piano',
    bridgeSpeed: 'Velocità ponte',
    bridgeFlow: 'Flusso ponte',
    flowRatio: 'Rapporto di flusso',
    kFactor: 'Avanzamento pressione (K)',
    
    customNotes: 'Note fisiche incise',
    customNotesPlaceholder: 'es. UGELLO 0.4 / ESSICCA 6H',
    dimensions: 'Dimensioni',
    standardCard: 'Scheda standard 128 × 75 mm (150%)',
    triangles: 'Triangoli:',

    infoTitle: 'Standard Bambu Studio & MakerWorld 3MF',
    infoSubtitle: 'Modelli 3D privi di errori e 100% a tenuta (2-Manifold) confezionati in file 3MF nativi.',
    infoFeature1Title: '1. Definizione esplicita di piatto e assemblaggio',
    infoFeature1Desc: 'Dichiarazione completa dei tag <plate> e <assemble> per compatibilità totale con lo slicer cloud di MakerWorld.',
    infoFeature2Title: '2. Compatibilità di versione stabile',
    infoFeature2Desc: 'Configurazione bloccata sulla versione stabile internazionale 02.07.01.62.',
    infoFeature3Title: '3. Rilievi nitidi e parametri pronti per la stampa',
    infoFeature3Desc: 'Testo in rilievo ben definito e iniezione automatica delle temperature e velocità direttamente nel file di stampa.',
    cliVerifyTitle: 'Comando verifica CLI Bambu Studio locale:',
    closeBtn: 'Chiudi'
  },

  nl: {
    appTitle: 'Bambu Kleurstaal- & Kalibratiestudio',
    appSubtitle: 'Aanpasbare 3D-print kalibratie- en kleurstaalmaker',
    bblTag: 'BBL 3MF V02.07',
    copySpecs: 'Kopieer specs',
    copied: 'Gekopieerd!',
    exportSTL: 'Download STL',
    export3MF: 'Download Bambu 3MF',
    generating: '3D genereren...',
    guideSpecs: 'Handleiding & Specs',

    presets: {
      swatch: {
        name: 'Lichtdoorlatend kleurstaal',
        desc: 'Standaard 128×75mm kaart met 5 diktestappen, ophanggat en lijndiktetests.'
      },
      bridge: {
        name: 'Dubbelspoor brugtestkaart',
        desc: 'Smalle (2mm) en brede (5mm) bruggen over 5 overspanningen met 1-5mm doorbuigingsmeter.'
      },
      ironing: {
        name: 'Oppervlakte strijkmatrix (Ironing)',
        desc: '4×5 matrix om stroomsnelheid en lijnafstand te testen voor een perfect glad oppervlak.'
      },
      fuzzy: {
        name: 'Verticale Fuzzy Skin testkaart',
        desc: 'Opstaande testkaart met 4×4 rooster van puntafstand en dikte voor voelbare texturen.'
      },
      tolerance: {
        name: 'Precisie tolerantieladder',
        desc: '4 pendiameters over 5 spelingstrappen (20 stations) om passing en krimp te testen.'
      }
    },

    modelSelectTitle: 'Kies kalibratiekaart (128×75mm)',
    matrixParamsTitle: 'Matrix- & geometrie-instellingen',
    ironingXTitle: 'X-as: Lijnafstand (5 kolommen)',
    ironingYTitle: 'Y-as: Strijksnelheid % (4 rijen)',
    fuzzyXTitle: 'X-as: Puntafstand (4 kolommen)',
    fuzzyYTitle: 'Y-as: Huiddikte (4 rijen)',
    toleranceYTitle: 'Y-as: 4 pendiameters',
    toleranceXTitle: 'X-as: 5 spelingsmaten (mm)',
    
    minSpacing: 'Min. afstand',
    maxSpacing: 'Max. afstand',
    minFlow: 'Min. stroom',
    maxFlow: 'Max. stroom',
    minDistance: 'Min. afstand',
    maxDistance: 'Max. afstand',
    minThickness: 'Min. dikte',
    maxThickness: 'Max. dikte',
    
    row1Small: 'Rij 1 (Klein)',
    row2MedSm: 'Rij 2 (Med-Kl)',
    row3MedLg: 'Rij 3 (Med-Gr)',
    row4Large: 'Rij 4 (Groot)',
    colLabel: 'Kol',
    
    minSpan: 'Min. overspanning',
    maxSpan: 'Max. overspanning',
    pillarHeight: 'Brughoogte',
    translucentSteps: '5 stappen transparante dikte (mm):',
    stepLabel: 'Stap',
    includeHole: 'Inclusief standaard Ø4,5mm ophanggat',
    
    filamentSection: 'Filament & materiaal',
    brand: 'Merk',
    materialProfile: 'Materiaalprofiel',
    colorFinish: 'Kleur & afwerking',
    finishGlossy: 'Glanzend',
    finishMatte: 'Mat',
    finishSilk: 'Zijde',
    finishCF: 'Koolstofvezel (CF)',
    
    slicerSection: 'Slicer-instellingen',
    nozzleTemp: 'Nozzletemp.',
    bedTemp: 'Bedtemp.',
    bridgeSpeed: 'Brugsnelheid',
    bridgeFlow: 'Brugstroom',
    flowRatio: 'Stroomverhouding',
    kFactor: 'Drukcompensatie (K)',
    
    customNotes: 'Fysieke notitietekst',
    customNotesPlaceholder: 'bijv. 0.4 NOZZLE / DROOG 6U',
    dimensions: 'Afmetingen',
    standardCard: '128 × 75 mm (150%) standaardkaart',
    triangles: 'Driehoeken:',

    infoTitle: 'Bambu Studio & MakerWorld 3MF Standaarden',
    infoSubtitle: '100% waterdichte 2-Manifold 3D-modellen, verpakt in officiële Bambu Studio en MakerWorld 3MF-projecten.',
    infoFeature1Title: '1. Expliciete printbed- & assemblagedefinities',
    infoFeature1Desc: 'Volledige opname van <plate> en <assemble> tags voor naadloze werking met de MakerWorld cloud-slicer.',
    infoFeature2Title: '2. Stabiele versiecompatibiliteit',
    infoFeature2Desc: 'Configuratie is vergrendeld op de internationale stabiele versie 02.07.01.62.',
    infoFeature3Title: '3. Scherp reliëf en geïntegreerde slicerparameters',
    infoFeature3Desc: 'Directe scherpe reliëftekst op het oppervlak en automatische overname van temperaturen en snelheden in de slicer.',
    cliVerifyTitle: 'Lokaal Bambu Studio CLI verificatiecommando:',
    closeBtn: 'Begrepen'
  }
};

export function getTranslation(lang = 'en') {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
