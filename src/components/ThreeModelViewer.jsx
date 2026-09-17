import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Sun, Moon, Maximize2, Minimize2, Eye, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * ThreeModelViewer
 * Embedded interactive 3D spatial massing viewer for architectural projects.
 * Supports procedural architectural geometries, wireframe mode, daylight shadow studies,
 * OrbitControls, full screen, and automated WebGL / reduced-motion fallback.
 */
export function ThreeModelViewer({ project, fallbackImage }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [duskLight, setDuskLight] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);
  const dirLightRef = useRef(null);
  const ambLightRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAutoRotate(false);
    }
  }, []);

  useEffect(() => {
    if (!webGLSupported || !canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0910); // Deep violet-black surface

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(16, 12, 22);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above ground plane
    controls.minDistance = 6;
    controls.maxDistance = 50;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);
    ambLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(18, 26, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    const d = 16;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Subtle blue/purple fill light
    const fillLight = new THREE.DirectionalLight(0x4a3b75, 0.6);
    fillLight.position.set(-15, 8, -15);
    scene.add(fillLight);

    // 6. Ground Datum Plane with Grid
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060608,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(50, 50, 0x29233d, 0x181522);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 7. Architectural Geometry Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    buildArchitecturalModel(modelGroup, project?.model3d?.type || 'courtyard-house');

    setIsLoading(false);

    // 8. Animation Loop
    let mounted = true;
    const animate = () => {
      if (!mounted) return;
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, [webGLSupported, project?.model3d?.type]);

  // Update wireframe state
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => { m.wireframe = wireframe; });
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // Update lighting (Day / Dusk)
  useEffect(() => {
    if (!dirLightRef.current || !ambLightRef.current) return;
    if (duskLight) {
      dirLightRef.current.color.setHex(0xf97316); // Warm low dusk sun
      dirLightRef.current.intensity = 0.9;
      dirLightRef.current.position.set(24, 6, 8);
      ambLightRef.current.color.setHex(0x29233d);
      ambLightRef.current.intensity = 0.3;
    } else {
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 1.2;
      dirLightRef.current.position.set(18, 26, 14);
      ambLightRef.current.color.setHex(0xffffff);
      ambLightRef.current.intensity = 0.45;
    }
  }, [duskLight]);

  // Update autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!webGLSupported) {
    return (
      <div className="three-fallback-container">
        <img src={fallbackImage || project?.coverImage} alt={project?.title} className="three-fallback-img" />
        <div className="three-fallback-banner">
          <AlertCircle size={16} />
          <span>WebGL acceleration not detected. Displaying high-resolution architectural plate.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`three-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}
      aria-label={`Interactive 3D massing study of ${project?.title}`}
    >
      <canvas ref={canvasRef} className="three-canvas" />

      {/* Top Metadata Header */}
      <div className="three-overlay-top">
        <div className="three-model-tag">
          <span className="live-dot" />
          <span className="model-label">SPATIAL MASSING // {project?.model3d?.dimensions || '3D STUDY'}</span>
        </div>
        <div className="three-actions">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`three-btn ${wireframe ? 'active' : ''}`}
            title="Toggle Tectonic Wireframe"
            aria-label="Toggle Tectonic Wireframe"
          >
            <Eye size={15} />
            <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
          </button>
          <button
            onClick={() => setDuskLight(!duskLight)}
            className={`three-btn ${duskLight ? 'active' : ''}`}
            title="Toggle Solar Study (Dusk/Noon)"
            aria-label="Toggle Solar Study"
          >
            {duskLight ? <Moon size={15} /> : <Sun size={15} />}
            <span>{duskLight ? 'Dusk' : 'Noon'}</span>
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`three-btn ${autoRotate ? 'active' : ''}`}
            title="Toggle Auto Rotation"
            aria-label="Toggle Auto Rotation"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={resetCamera}
            className="three-btn"
            title="Reset Camera View"
            aria-label="Reset Camera View"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="three-btn"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Bottom Information Bar */}
      <div className="three-overlay-bottom">
        <p className="three-caption">
          <strong>{project?.model3d?.label || project?.title}:</strong> {project?.model3d?.description || 'Click and drag to rotate massing. Scroll to zoom.'}
        </p>
        <span className="three-hints">ORBIT: LEFT DRAG · PAN: RIGHT DRAG · ZOOM: SCROLL</span>
      </div>

      {isLoading && (
        <div className="three-loading-state">
          <div className="three-spinner" />
          <span>INITIALIZING SPATIAL GEOMETRY...</span>
        </div>
      )}
    </div>
  );
}

/**
 * Procedural Architectural Geometry Builder
 * Generates clean, crisp architectural masses matching each studio typology.
 */
function buildArchitecturalModel(group, type) {
  // Clear any existing children
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const primaryMat = new THREE.MeshStandardMaterial({
    color: 0xd8d6cf, // Cast concrete / limestone
    roughness: 0.65,
    metalness: 0.1
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: 0x1e1c28, // Dark basalt / oxidized zinc
    roughness: 0.5,
    metalness: 0.3
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x181522,
    roughness: 0.1,
    metalness: 0.85,
    transparent: true,
    opacity: 0.75
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x7c4d32, // Warm African iroko louvers
    roughness: 0.7,
    metalness: 0.05
  });

  switch (type) {
    case 'courtyard-house': {
      // House in the Fold: 4 flanking wings with central courtyard
      const wingNorth = new THREE.Mesh(new THREE.BoxGeometry(14, 3.8, 3.5), primaryMat);
      wingNorth.position.set(0, 1.9, -5);
      wingNorth.castShadow = true;
      wingNorth.receiveShadow = true;

      const wingSouth = new THREE.Mesh(new THREE.BoxGeometry(14, 3.4, 3.5), primaryMat);
      wingSouth.position.set(0, 1.7, 5);
      wingSouth.castShadow = true;
      wingSouth.receiveShadow = true;

      const wingEast = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.2, 7.5), primaryMat);
      wingEast.position.set(5.25, 2.1, 0);
      wingEast.castShadow = true;
      wingEast.receiveShadow = true;

      const wingWest = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.4, 7.5), primaryMat);
      wingWest.position.set(-5.25, 1.7, 0);
      wingWest.castShadow = true;
      wingWest.receiveShadow = true;

      // Sunken central courtyard reflecting pool
      const poolGeo = new THREE.BoxGeometry(7, 0.2, 6.5);
      const poolMat = new THREE.MeshStandardMaterial({ color: 0x1a2638, roughness: 0.1, metalness: 0.9 });
      const pool = new THREE.Mesh(poolGeo, poolMat);
      pool.position.set(0, 0.1, 0);
      pool.receiveShadow = true;

      // Roof monitors / clerestory
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 3), secondaryMat);
      monitor.position.set(2, 4.5, -5);
      monitor.castShadow = true;

      // Wooden shading louvers
      for (let i = -6; i <= 6; i += 1.2) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.4), woodMat);
        louver.position.set(i, 2, 6.8);
        louver.castShadow = true;
        group.add(louver);
      }

      group.add(wingNorth, wingSouth, wingEast, wingWest, pool, monitor);
      break;
    }

    case 'tower-void': {
      // After the Flood: Amphibious pier & elevated archives
      const pierBase = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 8), secondaryMat);
      pierBase.position.set(0, 0.4, 0);
      pierBase.receiveShadow = true;

      // Vertical pylons
      for (let x = -8; x <= 8; x += 4) {
        for (let z = -3; z <= 3; z += 6) {
          const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 8, 12), secondaryMat);
          pylon.position.set(x, 4, z);
          pylon.castShadow = true;
          group.add(pylon);
        }
      }

      // Suspended archive box with carve-outs
      const archiveBox = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 7), primaryMat);
      archiveBox.position.set(0, 6.5, 0);
      archiveBox.castShadow = true;
      archiveBox.receiveShadow = true;

      // Glass viewing void
      const glassVoid = new THREE.Mesh(new THREE.BoxGeometry(18.2, 1.8, 4), glassMat);
      glassVoid.position.set(0, 6.2, 0);

      group.add(pierBase, archiveBox, glassVoid);
      break;
    }

    case 'folded-plate': {
      // Material / Matter: Origami folded structural plates
      const numPlates = 7;
      for (let i = 0; i < numPlates; i++) {
        const plateGeo = new THREE.BoxGeometry(1.8, 5, 0.15);
        const plate = new THREE.Mesh(plateGeo, secondaryMat);
        const xOffset = (i - 3) * 2.2;
        const angle = ((i % 2 === 0 ? 1 : -1) * 28 * Math.PI) / 180;
        plate.position.set(xOffset, 2.5, Math.sin(i * 0.8) * 1.5);
        plate.rotation.y = angle;
        plate.rotation.z = ((i - 3) * 3 * Math.PI) / 180;
        plate.castShadow = true;
        plate.receiveShadow = true;
        group.add(plate);

        // Tension cable connecting tops
        if (i < numPlates - 1) {
          const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.4, 6);
          const cableMat = new THREE.MeshBasicMaterial({ color: 0xb0aeb6 });
          const cable = new THREE.Mesh(cableGeo, cableMat);
          cable.position.set(xOffset + 1.1, 4.8, 0);
          cable.rotation.z = Math.PI / 2;
          group.add(cable);
        }
      }
      break;
    }

    case 'civic-colonnade': {
      // Common Ground: Colonnade with rhythmic porticos
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 7), secondaryMat);
      plinth.position.set(0, 0.3, 0);
      plinth.receiveShadow = true;

      const canopy = new THREE.Mesh(new THREE.BoxGeometry(23, 0.8, 8), primaryMat);
      canopy.position.set(0, 5.2, 0);
      canopy.castShadow = true;

      // Colonnade pillars
      for (let x = -9.5; x <= 9.5; x += 3.8) {
        const col1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.6, 0.8), primaryMat);
        col1.position.set(x, 2.6, 2.6);
        col1.castShadow = true;

        const col2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.6, 0.8), primaryMat);
        col2.position.set(x, 2.6, -2.6);
        col2.castShadow = true;

        group.add(col1, col2);
      }

      group.add(plinth, canopy);
      break;
    }

    case 'cantilever-mass': {
      // Monolith & Canopy: Heavy cantilevered concrete mass
      const baseCore = new THREE.Mesh(new THREE.BoxGeometry(7, 9, 8), secondaryMat);
      baseCore.position.set(-4, 4.5, 0);
      baseCore.castShadow = true;
      baseCore.receiveShadow = true;

      const cantileverBox = new THREE.Mesh(new THREE.BoxGeometry(15, 4.5, 9), primaryMat);
      cantileverBox.position.set(2.5, 6.5, 0);
      cantileverBox.castShadow = true;
      cantileverBox.receiveShadow = true;

      const underGlass = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 7.5), glassMat);
      underGlass.position.set(3, 2, 0);

      group.add(baseCore, cantileverBox, underGlass);
      break;
    }

    case 'stilt-pavilion':
    default: {
      // Ecotone: Stilt bamboo diagrid pavilion
      const stiltBase = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 12), secondaryMat);
      stiltBase.position.set(0, 2.5, 0);
      stiltBase.castShadow = true;

      // Stilts
      for (let x = -6; x <= 6; x += 4) {
        for (let z = -4; z <= 4; z += 4) {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3, 8), secondaryMat);
          stilt.position.set(x, 1.25, z);
          stilt.castShadow = true;
          group.add(stilt);
        }
      }

      // Diagrid roof canopy
      const roof = new THREE.Mesh(new THREE.ConeGeometry(9, 4, 8, 1, true), woodMat);
      roof.position.set(0, 5.5, 0);
      roof.rotation.y = Math.PI / 8;
      roof.castShadow = true;

      group.add(stiltBase, roof);
      break;
    }
  }
}

export default ThreeModelViewer;
