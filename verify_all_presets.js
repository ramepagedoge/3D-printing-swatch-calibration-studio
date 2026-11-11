import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {
  generateSwatchCard,
  generateBridgeCard,
  generateIroningCard,
  generateFuzzySkinCard,
  generateToleranceCard
} from './src/services/geometryGenerator.js';
import { exportTo3MF } from './src/services/threeMfExporter.js';

async function verifyAllPresets() {
  console.log('='.repeat(70));
  console.log('Bambu Studio CLI Verification: All 5 Presets with Multi-Part 3MF Exporter');
  console.log('='.repeat(70));

  const fontJson = JSON.parse(fs.readFileSync('public/fonts/helvetiker_bold.typeface.json', 'utf8'));
  const loader = new FontLoader();
  const font = loader.parse(fontJson);

  const defaultParams = {
    brand: 'Bambu Lab',
    material: 'PLA Basic',
    nozzleTemp: 220,
    bedTemp: 55,
    bridgeSpeed: 50,
    bridgeFlow: 0.95,
    flowRatio: 0.98,
    kFactor: 0.020,
    notes: '85x50 UNIFIED CARD',
    includeHole: true,

    // Swatch
    translucentSteps: [0.2, 0.4, 0.6, 0.8, 1.0],

    // Bridge
    bridgeMinSpan: 10,
    bridgeMaxSpan: 50,
    bridgePillarHeight: 7.0,

    // Ironing 4x5
    ironingMinSpacing: 0.10,
    ironingMaxSpacing: 0.20,
    ironingMinFlow: 10,
    ironingMaxFlow: 25,

    // Fuzzy 4x4
    fuzzyMinThickness: 0.1,
    fuzzyMaxThickness: 0.4,
    fuzzyMinDistance: 0.2,
    fuzzyMaxDistance: 0.8,

    // Tolerance (4 rows x 5 cols)
    clearances: [0.10, 0.15, 0.20, 0.25, 0.30],
    toleranceDia1: 3.0,
    toleranceDia2: 4.5,
    toleranceDia3: 6.0,
    toleranceDia4: 7.5
  };

  const presets = [
    { id: 'swatch', fn: generateSwatchCard },
    { id: 'bridge', fn: generateBridgeCard },
    { id: 'ironing', fn: generateIroningCard },
    { id: 'fuzzy', fn: generateFuzzySkinCard },
    { id: 'tolerance', fn: generateToleranceCard }
  ];

  let allOk = true;

  for (const p of presets) {
    console.log(`\n[Generating: ${p.id.toUpperCase()}]`);
    const geo = p.fn(defaultParams, font);
    const partsCount = geo.userData?.parts?.length || 1;
    console.log(`  Parts detected: ${partsCount}`);

    // Export using the actual exportTo3MF production function
    const blob = await exportTo3MF(geo, defaultParams);
    const buffer = Buffer.from(await blob.arrayBuffer());

    const outPath = `/tmp/test_export_${p.id}.3mf`;
    fs.writeFileSync(outPath, buffer);

    // Run Slicing Verification with Bambu Studio CLI
    const sliceDir = `/tmp/verify_export_${p.id}`;
    if (fs.existsSync(sliceDir)) fs.rmSync(sliceDir, { recursive: true, force: true });
    fs.mkdirSync(sliceDir);

    const cmd = `/Applications/BambuStudio.app/Contents/MacOS/BambuStudio --slice 0 --outputdir "${sliceDir}" "${outPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
      console.error(`  CLI Execution Error for ${p.id}:`, e.message);
      allOk = false;
      continue;
    }

    const resJsonPath = path.join(sliceDir, 'result.json');
    if (fs.existsSync(resJsonPath)) {
      const res = JSON.parse(fs.readFileSync(resJsonPath, 'utf-8'));
      const plate = res.sliced_plates?.[0];
      const ok = res.return_code === 0 && plate?.objects?.length > 0;
      const ironingTime = plate?.feature_type_times?.Ironing ? `${plate.feature_type_times.Ironing.toFixed(1)}s` : '0s';
      console.log(`  [Result: ${p.id.padEnd(10)}] Code: ${res.return_code} (${res.error_string}) | Objects: ${plate?.objects?.length} | Ironing: ${ironingTime} | Print Time: ${(plate?.total_predication / 60).toFixed(1)}m => ${ok ? 'PASSED ✅' : 'FAILED ❌'}`);
      if (!ok) allOk = false;
    } else {
      console.error(`  result.json not found for ${p.id}`);
      allOk = false;
    }
  }

  console.log('\n' + '='.repeat(70));
  if (allOk) {
    console.log('🎉 ALL 5 PRESETS SUCCESSFULLY VERIFIED VIA BAMBU STUDIO CLI!');
  } else {
    console.error('❌ SOME PRESETS FAILED VERIFICATION!');
    process.exit(1);
  }
}

verifyAllPresets().catch(console.error);
