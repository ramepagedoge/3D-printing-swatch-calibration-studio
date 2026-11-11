import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {
  generateSwatchCard,
  generateBridgeCard,
  generateIroningCard,
  generateFuzzySkinCard,
  generateToleranceCard
} from './src/services/geometryGenerator.js';
import { exportTo3MF } from './src/services/threeMfExporter.js';

async function generateAndVerifyMakerWorldDefaults() {
  console.log('='.repeat(75));
  console.log('MakerWorld Official 5 Default 3MF Exporter & Bambu CLI Verifier');
  console.log('='.repeat(75));

  const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
  const loader = new FontLoader();
  const font = loader.parse(fontJson);

  const defaultParams = {
    brand: 'Bambu Lab',
    material: 'PLA Basic',
    color: '#00AE42',
    finish: 'glossy',
    nozzleTemp: 220,
    bedTemp: 55,
    bridgeSpeed: 50,
    bridgeFlow: 0.95,
    flowRatio: 0.98,
    kFactor: 0.020,
    maxVolSpeed: 21,
    notes: 'STANDARD 0.4 NOZZLE',
    includeHole: true,

    // Swatch specific
    translucentSteps: [0.2, 0.4, 0.6, 0.8, 1.0],

    // Bridge specific
    bridgeMinSpan: 10,
    bridgeMaxSpan: 50,
    bridgePillarHeight: 7.0,

    // Ironing 4x5 matrix specific
    ironingMinSpacing: 0.10,
    ironingMaxSpacing: 0.20,
    ironingMinFlow: 10,
    ironingMaxFlow: 25,
    enableIroning: false,
    ironingFlow: 15,
    ironingSpacing: 0.15,
    ironingSpeed: 30,

    // Fuzzy skin specific (4x4 standalone vertical)
    fuzzyMinThickness: 0.1,
    fuzzyMaxThickness: 0.4,
    fuzzyMinDistance: 0.2,
    fuzzyMaxDistance: 0.8,
    enableFuzzy: false,
    fuzzyPointDistance: 0.5,
    fuzzyThickness: 0.3,

    // Tolerance specific (4 rows x 5 cols)
    clearances: [0.10, 0.15, 0.20, 0.25, 0.30],
    toleranceDia1: 3.0,
    toleranceDia2: 4.5,
    toleranceDia3: 6.0,
    toleranceDia4: 7.5
  };

  const outputDir = path.resolve('MakerWorld_Default_3MFs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const items = [
    {
      id: 'swatch',
      filename: '01_Bambu_Swatch_Card_128x75.3mf',
      nameZh: '多階透光色票卡 (150% 128x75mm)',
      fn: generateSwatchCard
    },
    {
      id: 'bridge',
      filename: '02_Bambu_Bridge_Test_Card_128x75.3mf',
      nameZh: '雙軌懸空橋接測試卡 (150% 128x75mm)',
      fn: generateBridgeCard
    },
    {
      id: 'ironing',
      filename: '03_Bambu_Ironing_Matrix_Card_128x75.3mf',
      nameZh: '表面熨燙參數矩陣卡 (150% 128x75mm)',
      fn: generateIroningCard
    },
    {
      id: 'fuzzy',
      filename: '04_Bambu_Fuzzy_Skin_Matrix_Card_128x75.3mf',
      nameZh: '垂直 Fuzzy Skin 矩陣卡 (150% 128x75mm)',
      fn: generateFuzzySkinCard
    },
    {
      id: 'tolerance',
      filename: '05_Bambu_Tolerance_Gauge_Card_128x75.3mf',
      nameZh: '精密公差測試卡 (150% 128x75mm)',
      fn: generateToleranceCard
    }
  ];

  const results = [];

  for (const item of items) {
    console.log(`\n📦 [Processing] ${item.filename} (${item.nameZh})`);

    // 1. Generate Geometry
    const geo = item.fn(defaultParams, font);
    const partsCount = geo.userData?.parts?.length || 1;
    console.log(`   Geometry parts: ${partsCount}`);

    // 2. Initial Export to 3MF
    const initialBlob = await exportTo3MF(geo, defaultParams);
    const initialBuffer = Buffer.from(await initialBlob.arrayBuffer());

    const temp3mfPath = path.join('/tmp', `temp_${item.filename}`);
    fs.writeFileSync(temp3mfPath, initialBuffer);

    // 3. Render 512x512 Plate Thumbnail via Bambu Studio CLI
    const tempPngDir = path.join('/tmp', `png_${item.id}`);
    if (fs.existsSync(tempPngDir)) fs.rmSync(tempPngDir, { recursive: true, force: true });
    fs.mkdirSync(tempPngDir, { recursive: true });

    let finalBuffer = initialBuffer;
    try {
      execSync(`/Applications/BambuStudio.app/Contents/MacOS/BambuStudio --export-png 0 --camera-view 0 --outputdir "${tempPngDir}" "${temp3mfPath}"`, { stdio: 'pipe' });
      const renderedPngPath = path.join(tempPngDir, 'plate_1_0.png');
      if (fs.existsSync(renderedPngPath)) {
        const pngBuf = fs.readFileSync(renderedPngPath);
        // Inject high-res rendered thumbnail into the 3MF zip
        const zip = await JSZip.loadAsync(initialBuffer);
        zip.file('Metadata/plate_1.png', pngBuf);
        zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', pngBuf);
        zip.file('Auxiliaries/.thumbnails/thumbnail_middle.png', pngBuf);
        zip.file('Auxiliaries/.thumbnails/thumbnail_small.png', pngBuf);
        finalBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
        console.log(`   📸 Rendered & embedded 512x512 Bambu thumbnail (${(pngBuf.length / 1024).toFixed(1)} KB)`);
      }
    } catch (e) {
      console.warn(`   ⚠️ Thumbnail generation warning: ${e.message}`);
    }

    // 4. Save Final 3MF
    const finalFilePath = path.join(outputDir, item.filename);
    fs.writeFileSync(finalFilePath, finalBuffer);
    console.log(`   💾 Saved to: ${finalFilePath} (${(finalBuffer.length / 1024).toFixed(1)} KB)`);

    // 5. Bambu Studio CLI Slicing Verification
    const sliceDir = path.join('/tmp', `verify_${item.id}`);
    if (fs.existsSync(sliceDir)) fs.rmSync(sliceDir, { recursive: true, force: true });
    fs.mkdirSync(sliceDir, { recursive: true });

    let sliceOk = false;
    let sliceDetail = {};

    try {
      execSync(`/Applications/BambuStudio.app/Contents/MacOS/BambuStudio --slice 0 --outputdir "${sliceDir}" "${finalFilePath}"`, { stdio: 'pipe' });
      const resJsonPath = path.join(sliceDir, 'result.json');
      if (fs.existsSync(resJsonPath)) {
        const res = JSON.parse(fs.readFileSync(resJsonPath, 'utf8'));
        const plate = res.sliced_plates?.[0];
        const warning = plate?.warning_message || '';
        const objects = plate?.objects || [];
        const printTimeMin = ((plate?.total_predication || 0) / 60).toFixed(1);
        const weightG = plate?.filaments?.[0]?.total_used_g?.toFixed(1) || '0';

        sliceOk = res.return_code === 0 && objects.length > 0;
        sliceDetail = {
          returnCode: res.return_code,
          errorString: res.error_string,
          warningMessage: warning,
          objectsCount: objects.length,
          triangles: plate?.triangle_count,
          printTimeMin,
          weightG
        };

        if (sliceOk) {
          console.log(`   ✅ Slicing PASS: ${res.error_string} | Print Time: ${printTimeMin} min | Filament: ${weightG}g | Triangles: ${plate?.triangle_count} | Warnings: ${warning ? warning : '0 (None)'}`);
        } else {
          console.error(`   ❌ Slicing FAILED: code=${res.return_code}, objects=${objects.length}`);
        }
      }
    } catch (e) {
      console.error(`   ❌ CLI Error: ${e.message}`);
    }

    results.push({
      item,
      sliceOk,
      sliceDetail,
      path: finalFilePath
    });
  }

  console.log('\n' + '='.repeat(75));
  console.log('SUMMARY OF MAKERWORLD DEFAULT FILES');
  console.log('='.repeat(75));
  results.forEach(r => {
    const status = r.sliceOk ? '✅ READY FOR MAKERWORLD' : '❌ FAILED';
    console.log(`${r.item.filename}: ${status}`);
    console.log(`  -> Time: ${r.sliceDetail.printTimeMin}m | Filament: ${r.sliceDetail.weightG}g | Warnings: ${r.sliceDetail.warningMessage || 'None'}`);
  });
}

generateAndVerifyMakerWorldDefaults().catch(console.error);
