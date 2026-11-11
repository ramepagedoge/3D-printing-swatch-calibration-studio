import JSZip from 'jszip';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import baseProjectSettings from '../constants/baseProjectSettings.json' with { type: 'json' };
import { healMesh } from './meshHealer.js';

function generateUuid(index) {
  const hex = index.toString(16).padStart(4, '0');
  return `000100${hex.slice(0, 2)}-${hex.slice(2, 4)}cb-4c03-9d28-${String(index).padStart(12, '0')}`;
}

/**
 * Packages a valid MakerWorld/Bambu Studio 3MF archive with full multi-part assembly support.
 * Calibration cards (Ironing matrix, Fuzzy skin matrix, Tolerance stations, Bridge gauge)
 * are exported as an assembly object where each test station/patch is an independent part
 * with its specific slicer modifier parameters injected into Metadata/model_settings.config.
 */
export async function exportTo3MF(geometry, params, thumbnailBlob) {
  const zip = new JSZip();

  const presetId = geometry.userData?.presetId || 'card';
  const modelName = `Bambu_${params.brand || 'Custom'}_${params.material || 'PLA'}_${presetId}_128x75`.replace(/\s+/g, '_');

  let parts = geometry.userData?.parts;
  if (!parts || parts.length === 0) {
    parts = [{
      name: `${modelName}_Part`,
      geometry: geometry,
      meta: {}
    }];
  }

  // 1. [Content_Types].xml
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="config" ContentType="text/plain"/>
 <Default Extension="json" ContentType="application/json"/>
 <Default Extension="xml" ContentType="application/xml"/>
</Types>`);

  // 2. _rels/.rels
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/core/2015/02/3dmodel"/>
 <Relationship Target="/Metadata/plate_1.png" Id="rel-2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
 <Relationship Target="/Auxiliaries/.thumbnails/thumbnail_3mf.png" Id="rel-3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"/>
</Relationships>`);

  // 3. 3D/_rels/3dmodel.model.rels
  zip.file('3D/_rels/3dmodel.model.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`);

  // Serialize Parts into 3D/Objects/object_1.model and build components & config
  let objectsXml = '';
  let componentsXml = '';
  let partsConfigXml = '';

  parts.forEach((p, idx) => {
    const objId = idx + 1;
    const partId = idx + 1;

    // Run topological heal & weld vertices purely by position so all adjacent triangles share vertex indices (100% watertight manifold)
    const healedGeo = healMesh(p.geometry, 1e-4);
    const nonIndexed = healedGeo.toNonIndexed();
    const cleanGeo = new THREE.BufferGeometry();
    cleanGeo.setAttribute('position', nonIndexed.attributes.position);
    const welded = BufferGeometryUtils.mergeVertices(cleanGeo, 1e-4);

    const pos = welded.attributes.position.array;
    const vertexCount = welded.attributes.position.count;
    const rawIndex = welded.index ? welded.index.array : [];
    const cleanTris = [];
    for (let i = 0; i < rawIndex.length; i += 3) {
      const a = rawIndex[i], b = rawIndex[i + 1], c = rawIndex[i + 2];
      if (a !== b && b !== c && c !== a) {
        cleanTris.push(a, b, c);
      }
    }
    const triCount = cleanTris.length / 3;

    const vArr = new Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) {
      const i3 = i * 3;
      vArr[i] = `     <vertex x="${pos[i3].toFixed(5)}" y="${pos[i3 + 1].toFixed(5)}" z="${pos[i3 + 2].toFixed(5)}" />\n`;
    }

    const tArr = new Array(triCount);
    for (let i = 0; i < triCount; i++) {
      const i3 = i * 3;
      tArr[i] = `     <triangle v1="${cleanTris[i3]}" v2="${cleanTris[i3 + 1]}" v3="${cleanTris[i3 + 2]}" />\n`;
    }

    const vXml = vArr.join('');
    const tXml = tArr.join('');

    const objUuid = generateUuid(idx * 2 + 1);
    const compUuid = generateUuid(idx * 2 + 2);

    objectsXml += `  <object id="${objId}" p:UUID="${objUuid}" type="model">\n   <mesh>\n    <vertices>\n${vXml}    </vertices>\n    <triangles>\n${tXml}    </triangles>\n   </mesh>\n  </object>\n`;
    componentsXml += `    <component p:path="/3D/Objects/object_1.model" objectid="${objId}" p:UUID="${compUuid}" transform="1 0 0 0 1 0 0 0 1 0 0 0"/>\n`;

    let metaLines = '';
    for (const [k, v] of Object.entries(p.meta || {})) {
      metaLines += `      <metadata key="${k}" value="${v}"/>\n`;
    }

    partsConfigXml += `    <part id="${partId}" subtype="normal_part" uuid="${compUuid}">
      <metadata key="name" value="${p.name}"/>
      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>
      <metadata key="source_file" value="${modelName}.stl"/>
      <metadata key="source_object_id" value="0"/>
      <metadata key="source_volume_id" value="${idx}"/>
      <metadata key="source_offset_x" value="0"/>
      <metadata key="source_offset_y" value="0"/>
      <metadata key="source_offset_z" value="0"/>
      <metadata key="extruder" value="1"/>
${metaLines}      <mesh_stat face_count="${triCount}" edges_fixed="0" degenerate_facets="0" facets_removed="0" facets_reversed="0" backwards_edges="0"/>
    </part>\n`;
  });

  // 4. 3D/Objects/object_1.model
  zip.file('3D/Objects/object_1.model', `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
${objectsXml} </resources>
</model>`);

  // 5. 3D/3dmodel.model (Centered on Bambu Bed at 128, 128)
  const assemblyId = parts.length + 1;
  const assemblyUuid = generateUuid(parts.length * 2 + 10);
  const buildUuid = generateUuid(parts.length * 2 + 11);
  const itemUuid = generateUuid(parts.length * 2 + 12);

  zip.file('3D/3dmodel.model', `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">
 <metadata name="Application">BambuStudio-02.07.01.62</metadata>
 <metadata name="BambuStudio:3mfVersion">1</metadata>
 <resources>
  <object id="${assemblyId}" p:UUID="${assemblyUuid}" type="model">
   <components>
${componentsXml}   </components>
  </object>
 </resources>
 <build p:UUID="${buildUuid}">
  <item objectid="${assemblyId}" p:UUID="${itemUuid}" transform="1 0 0 0 1 0 0 0 1 128 128 0" printable="1"/>
 </build>
</model>`);

  // 6. Metadata/cut_information.xml
  zip.file('Metadata/cut_information.xml', `<?xml version="1.0" encoding="utf-8"?>
<objects>
 <object id="1">
  <cut_id id="0" check_sum="1" connectors_cnt="0"/>
 </object>
</objects>`);

  // 7. Metadata/model_settings.config
  zip.file('Metadata/model_settings.config', `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <object id="${assemblyId}">
    <metadata key="name" value="${modelName}"/>
    <metadata key="extruder" value="1"/>
${partsConfigXml}  </object>
  <plate>
    <metadata key="plater_id" value="1"/>
    <metadata key="plater_name" value="Plate 1 - ${modelName}"/>
    <metadata key="locked" value="false"/>
    <metadata key="thumbnail_file" value="Metadata/plate_1.png"/>
    <metadata key="filament_maps" value="1 1 1 1"/>
    <model_instance>
      <metadata key="object_id" value="${assemblyId}"/>
      <metadata key="instance_id" value="0"/>
      <metadata key="identify_id" value="1"/>
    </model_instance>
  </plate>
  <assemble>
    <assemble_item object_id="${assemblyId}" instance_id="0" transform="1 0 0 0 1 0 0 0 1 128 128 0" offset="0 0 0" />
  </assemble>
</config>`);

  // 8. Metadata/slice_info.config
  zip.file('Metadata/slice_info.config', `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <header>
    <header_item key="X-BBL-Client-Type" value="slicer"/>
    <header_item key="X-BBL-Client-Version" value="02.07.01.62"/>
  </header>
  <plate>
    <metadata key="index" value="1"/>
  </plate>
</config>`);

  // 9. Metadata/project_settings.config: Preserve user default slicer & filament settings
  const projCfg = { ...baseProjectSettings };
  projCfg['version'] = '02.07.01.62';

  // Only inject targeted test parameters when relevant, keeping user defaults for everything else
  if (presetId === 'bridge' || params.bridgeSpeed !== undefined) {
    projCfg['bridge_speed'] = [String(params.bridgeSpeed || 50), String(params.bridgeSpeed || 50)];
    projCfg['bridge_flow'] = String(params.bridgeFlow || 0.95);
  }
  if (presetId === 'ironing' || params.flowRatio !== undefined) {
    projCfg['flow_ratio'] = [String(params.flowRatio || 0.98)];
  }

  projCfg['filament_settings_id'] = [`${params.brand || 'Custom'} ${params.material || 'PLA'} @BBL X1C`];

  // If multi-part matrix contains per-part ironing settings, global ironing is 'no ironing'
  const hasIroningParts = parts.some(p => p.meta && p.meta.ironing_type);
  if (hasIroningParts) {
    projCfg['ironing_type'] = 'no ironing';
  } else if (params.enableIroning) {
    projCfg['ironing_type'] = 'top';
    projCfg['ironing_flow'] = `${params.ironingFlow || 15}%`;
    projCfg['ironing_spacing'] = String(params.ironingSpacing || 0.15);
    projCfg['ironing_speed'] = String(params.ironingSpeed || 30);
  }

  // If multi-part matrix contains per-part fuzzy skin settings, global fuzzy is 'none'
  const hasFuzzyParts = parts.some(p => p.meta && p.meta.fuzzy_skin);
  projCfg['fuzzy_skin_noise_type'] = params.fuzzyNoiseType || 'classic';
  if (hasFuzzyParts) {
    projCfg['fuzzy_skin'] = 'none';
  } else if (params.enableFuzzy) {
    projCfg['fuzzy_skin'] = 'all';
    projCfg['fuzzy_skin_point_distance'] = String(params.fuzzyPointDistance || 0.5);
    projCfg['fuzzy_skin_thickness'] = String(params.fuzzyThickness || 0.3);
  }

  zip.file('Metadata/project_settings.config', JSON.stringify(projCfg, null, 2));

  // 10. Metadata/filament_sequence.json
  zip.file('Metadata/filament_sequence.json', JSON.stringify({
    plate_1: { nozzle_sequence: [], optimal_assignment: [], sequence: [] }
  }));

  // 11. Thumbnails
  if (thumbnailBlob) {
    zip.file('Metadata/plate_1.png', thumbnailBlob);
    zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', thumbnailBlob);
    zip.file('Auxiliaries/.thumbnails/thumbnail_middle.png', thumbnailBlob);
    zip.file('Auxiliaries/.thumbnails/thumbnail_small.png', thumbnailBlob);
  } else {
    const dummyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    zip.file('Metadata/plate_1.png', dummyPng, { base64: true });
    zip.file('Auxiliaries/.thumbnails/thumbnail_3mf.png', dummyPng, { base64: true });
    zip.file('Auxiliaries/.thumbnails/thumbnail_middle.png', dummyPng, { base64: true });
    zip.file('Auxiliaries/.thumbnails/thumbnail_small.png', dummyPng, { base64: true });
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}
