import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Eye, RotateCw, Grid, Compass, Maximize2 } from 'lucide-react';

const Viewport3D = forwardRef(function Viewport3D({ geometry, params, isGenerating, t }, ref) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const wireframeMeshRef = useRef(null);

  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Expose thumbnail capture to parent
  useImperativeHandle(ref, () => ({
    captureThumbnailBlob: async () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;

      // Temporarily render clean preview without wireframe overlay
      const wireMesh = wireframeMeshRef.current;
      const prevWireVisible = wireMesh ? wireMesh.visible : false;
      if (wireMesh) wireMesh.visible = false;

      const canvas = rendererRef.current.domElement;
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      if (wireMesh) wireMesh.visible = prevWireVisible;

      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/png');
      });
    }
  }));

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene (Warm Japanese Washi Workbench)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#EAE6DF');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(0, -90, 80);
    camera.up.set(0, 0, 1);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 5);
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip below bed
    controlsRef.current = controls;

    // 5. Studio Lighting (tuned for Washi light workbench)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffdf9, 1.5);
    dirLight1.position.set(60, -80, 100);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 0.65);
    dirLight2.position.set(-60, 60, 80);
    scene.add(dirLight2);

    const bottomFill = new THREE.DirectionalLight(0xffffff, 0.3);
    bottomFill.position.set(0, 0, -50);
    scene.add(bottomFill);

    // 6. Bambu 256x256 Bed Reference & Grid
    const bedGrid = new THREE.GridHelper(256, 32, 0x3D6B52, 0xD5CFC4);
    bedGrid.rotateX(Math.PI / 2);
    bedGrid.position.z = -0.05;
    scene.add(bedGrid);

    // Bed Border Outline (256x256)
    const bedBorderGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-128, -128, 0),
      new THREE.Vector3(128, -128, 0),
      new THREE.Vector3(128, 128, 0),
      new THREE.Vector3(-128, 128, 0),
      new THREE.Vector3(-128, -128, 0)
    ]);
    const bedBorderMat = new THREE.LineBasicMaterial({ color: 0xB8B0A2 });
    const bedBorder = new THREE.Line(bedBorderGeo, bedBorderMat);
    scene.add(bedBorder);

    // 7. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync OrbitControls autoRotate state without stale closures in the mount loop
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [autoRotate]);

  // Update Mesh and Materials
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !geometry) return;

    // Remove previous mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current.material.dispose();
      meshRef.current = null;
    }
    if (wireframeMeshRef.current) {
      scene.remove(wireframeMeshRef.current);
      wireframeMeshRef.current.geometry.dispose();
      wireframeMeshRef.current.material.dispose();
      wireframeMeshRef.current = null;
    }

    // Material setup based on finish
    let roughness = 0.35;
    let metalness = 0.08;
    if (params.finish === 'matte') {
      roughness = 0.88;
      metalness = 0.02;
    } else if (params.finish === 'silk') {
      roughness = 0.18;
      metalness = 0.45;
    } else if (params.finish === 'cf') {
      roughness = 0.75;
      metalness = 0.25;
    }

    const material = new THREE.MeshStandardMaterial({
      color: params.color || '#00ae42',
      roughness: roughness,
      metalness: metalness,
      flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Wireframe overlay (Sumi ink for crisp visibility on light surfaces)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x2C2A29,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.visible = wireframe;
    scene.add(wireMesh);
    wireframeMeshRef.current = wireMesh;

  }, [geometry, params.color, params.finish, wireframe]);

  const setCameraView = (view) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (view === 'top') {
      camera.position.set(0, 0, 130);
      controls.target.set(0, 0, 0);
    } else if (view === 'iso') {
      camera.position.set(-65, -85, 75);
      controls.target.set(0, 0, 5);
    } else if (view === 'front') {
      camera.position.set(0, -110, 15);
      controls.target.set(0, 0, 5);
    } else if (view === 'side') {
      camera.position.set(110, 0, 15);
      controls.target.set(0, 0, 5);
    }
    controls.update();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Viewport Toolbar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        gap: '6px',
        background: 'rgba(247, 245, 240, 0.9)',
        backdropFilter: 'blur(12px)',
        padding: '5px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 14px rgba(44, 42, 41, 0.06)',
        zIndex: 10
      }}>
        <button
          className="btn-secondary"
          onClick={() => setCameraView('top')}
          style={{ padding: '6px 10px', fontSize: '12px' }}
          title={t?.viewTop || 'Top'}
        >
          {t?.viewTop || 'Top'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setCameraView('iso')}
          style={{ padding: '6px 10px', fontSize: '12px' }}
          title={t?.viewIso || 'Iso'}
        >
          {t?.viewIso || 'Iso'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setCameraView('front')}
          style={{ padding: '6px 10px', fontSize: '12px' }}
          title={t?.viewFront || 'Front'}
        >
          {t?.viewFront || 'Front'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setCameraView('side')}
          style={{ padding: '6px 10px', fontSize: '12px' }}
          title={t?.viewSide || 'Side'}
        >
          {t?.viewSide || 'Side'}
        </button>
      </div>

      {/* Right Tools */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '6px',
        background: 'rgba(247, 245, 240, 0.9)',
        backdropFilter: 'blur(12px)',
        padding: '5px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 14px rgba(44, 42, 41, 0.06)',
        zIndex: 10
      }}>
        <button
          className={`btn-secondary ${wireframe ? 'active' : ''}`}
          onClick={() => setWireframe(!wireframe)}
          style={{
            padding: '6px 10px',
            background: wireframe ? 'rgba(61, 107, 82, 0.14)' : 'transparent',
            borderColor: wireframe ? 'var(--bambu-green)' : 'transparent',
            boxShadow: 'none'
          }}
          title={t?.toggleWireframe || 'Toggle Wireframe'}
        >
          <Grid size={15} color={wireframe ? 'var(--bambu-green)' : 'currentColor'} />
        </button>
        <button
          className={`btn-secondary ${autoRotate ? 'active' : ''}`}
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            padding: '6px 10px',
            background: autoRotate ? 'rgba(61, 107, 82, 0.14)' : 'transparent',
            borderColor: autoRotate ? 'var(--bambu-green)' : 'transparent',
            boxShadow: 'none'
          }}
          title={t?.toggleAutoRotate || 'Auto-rotate Turntable'}
        >
          <RotateCw size={15} color={autoRotate ? 'var(--bambu-green)' : 'currentColor'} />
        </button>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(247, 245, 240, 0.72)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          zIndex: 30
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(61, 107, 82, 0.2)',
            borderTopColor: 'var(--bambu-green)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
            {t?.recalculatingGeo || 'Recalculating 3D Geometry...'}
          </div>
        </div>
      )}

      {/* Bed Spec Info Pill */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        background: 'rgba(247, 245, 240, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '4px 10px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(44, 42, 41, 0.05)'
      }}>
        {t?.bedSizeInfo || 'Bambu Lab X1C / P1S Bed Size: 256 × 256 mm'}
      </div>
    </div>
  );
});

export default Viewport3D;
