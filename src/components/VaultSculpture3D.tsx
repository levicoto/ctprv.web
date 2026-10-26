import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Lock } from 'lucide-react';
import { useI18n } from '../lib/i18n';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createRoundedRectPath(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function createPadlockBodyGeometry(): THREE.ExtrudeGeometry {
  const shape = createRoundedRectPath(2.04, 1.74, 0.34);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.68,
    curveSegments: 36,
    bevelEnabled: true,
    bevelThickness: 0.11,
    bevelSize: 0.1,
    bevelSegments: 6,
  });
  geo.center();
  return geo;
}

function createInternalCoreGeometry(): THREE.ExtrudeGeometry {
  const shape = createRoundedRectPath(1.42, 1.14, 0.22);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    curveSegments: 28,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4,
  });
  geo.center();
  return geo;
}

function createFrontFrameGeometry(): THREE.ExtrudeGeometry {
  const outer = createRoundedRectPath(1.82, 1.52, 0.26);
  const hole = new THREE.Path();
  const w = 1.58;
  const h = 1.28;
  const r = 0.18;
  const x = -w / 2;
  const y = -h / 2;
  hole.moveTo(x + r, y);
  hole.lineTo(x + w - r, y);
  hole.quadraticCurveTo(x + w, y, x + w, y + r);
  hole.lineTo(x + w, y + h - r);
  hole.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  hole.lineTo(x + r, y + h);
  hole.quadraticCurveTo(x, y + h, x, y + h - r);
  hole.lineTo(x, y + r);
  hole.quadraticCurveTo(x, y, x + r, y);
  outer.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(outer, {
    depth: 0.036,
    curveSegments: 28,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function createGlassInlayGeometry(): THREE.ExtrudeGeometry {
  const shape = createRoundedRectPath(1.56, 1.26, 0.17);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    curveSegments: 28,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function createShackleTubeGeometry(tubeRadius: number): THREE.TubeGeometry {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const r = 0.62;
  const legBottom = -0.35;
  const archBaseY = 0.56;

  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-r, legBottom, 0),
      new THREE.Vector3(-r, archBaseY, 0)
    )
  );

  const arcPoints: THREE.Vector3[] = [];
  const segments = 28;
  for (let i = 0; i <= segments; i++) {
    const theta = Math.PI - (i / segments) * Math.PI;
    arcPoints.push(
      new THREE.Vector3(Math.cos(theta) * r, archBaseY + Math.sin(theta) * r, 0)
    );
  }
  path.add(new THREE.CatmullRomCurve3(arcPoints));

  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(r, archBaseY, 0),
      new THREE.Vector3(r, legBottom, 0)
    )
  );

  return new THREE.TubeGeometry(path, 96, tubeRadius, 32, false);
}

function createKeyholeGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const circleR = 0.115;
  const circleY = 0.09;
  const startAngle = -Math.PI * 0.32;
  const endAngle = Math.PI + Math.PI * 0.32;

  shape.absarc(0, circleY, circleR, startAngle, endAngle, false);
  shape.lineTo(-0.088, -0.21);
  shape.quadraticCurveTo(0, -0.235, 0.088, -0.21);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.045,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

/**
 * Non-color linear thickness map (green channel 0..1) for organic thin-film dichroic iridescence.
 */
function createIridescenceThicknessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgb(0, 38, 0)');
    grad.addColorStop(0.35, 'rgb(0, 145, 0)');
    grad.addColorStop(0.68, 'rgb(0, 235, 0)');
    grad.addColorStop(1, 'rgb(0, 95, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const radial = ctx.createRadialGradient(
      size * 0.38,
      size * 0.34,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.65
    );
    radial.addColorStop(0, 'rgba(0, 255, 0, 0.45)');
    radial.addColorStop(0.6, 'rgba(0, 130, 0, 0.2)');
    radial.addColorStop(1, 'rgba(0, 30, 0, 0.4)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  return tex;
}

function createDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const major = i % 4 === 0;
      const r1 = major ? size * 0.38 : size * 0.41;
      const r2 = size * 0.46;
      ctx.strokeStyle = major ? 'rgba(9, 9, 11, 0.68)' : 'rgba(82, 82, 91, 0.36)';
      ctx.lineWidth = major ? 2.5 : 1.4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(9, 9, 11, 0.32)');
    grad.addColorStop(0.48, 'rgba(9, 9, 11, 0.12)');
    grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function VaultSculpture3D() {
  const { t } = useI18n();
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialW = container.clientWidth || 600;
    const initialH = container.clientHeight || 520;
    renderer.setSize(initialW, initialH);
    renderer.domElement.className = 'block w-full h-full outline-none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0xf4f4f5;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.038);

    const camera = new THREE.PerspectiveCamera(36, initialW / initialH, 0.1, 60);
    camera.position.set(0, 0.15, 7.4);
    camera.lookAt(0, -0.05, 0);

    // Studio Reflection Environment (critical for refractive & iridescent crystal)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.035);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // Studio Rig with Subtle Grazing Highlights for Thin-Film Dichroic Interference
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x71717a, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf7, 2.35);
    keyLight.position.set(4.2, 6.0, 5.4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const coolGrazingLight = new THREE.DirectionalLight(0xe0f2fe, 1.85);
    coolGrazingLight.position.set(-5.0, 2.8, -3.6);
    scene.add(coolGrazingLight);

    const pearlGrazingLight = new THREE.DirectionalLight(0xf5f3ff, 1.45);
    pearlGrazingLight.position.set(4.6, -2.4, -3.8);
    scene.add(pearlGrazingLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const iridTex = createIridescenceThicknessMap();
    const textures: THREE.Texture[] = [envRT.texture, iridTex];

    // 1. Primary Dichroic Iridescent Crystal (Padlock Outer Monolith)
    const dichroicBodyGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf6f8fc,
      metalness: 0.04,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.56 : 1.0,
      ior: 1.68,
      thickness: 1.85,
      dispersion: isSoftwareGl ? 0 : 0.85,
      attenuationColor: new THREE.Color(0xb4bcc8),
      attenuationDistance: 2.15,
      iridescence: 1.0,
      iridescenceIOR: 1.44,
      iridescenceThicknessRange: [170, 590],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.35,
      specularColor: new THREE.Color(0xffffff),
      envMapIntensity: 2.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      depthWrite: false,
    });

    // 2. High-IOR Dichroic Crystal Shackle Material
    const dichroicShackleGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.05,
      roughness: 0.045,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.58 : 1.0,
      ior: 1.76,
      thickness: 1.25,
      dispersion: isSoftwareGl ? 0 : 0.92,
      attenuationColor: new THREE.Color(0xcbd5e1),
      attenuationDistance: 1.75,
      iridescence: 1.0,
      iridescenceIOR: 1.52,
      iridescenceThicknessRange: [210, 620],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.4,
      envMapIntensity: 2.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    });

    // 3. Front Prismatic Escutcheon Lens
    const prismaticInlayMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.02,
      roughness: 0.04,
      transmission: isSoftwareGl ? 0 : 0.94,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 1.0,
      ior: 1.62,
      thickness: 0.75,
      dispersion: isSoftwareGl ? 0 : 0.75,
      iridescence: 1.0,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [250, 540],
      iridescenceThicknessMap: iridTex,
      envMapIntensity: 1.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      depthWrite: false,
    });

    // 4. Sculpted Internal Obsidian Vault Core (visible & refracted inside the crystal body)
    const internalObsidianCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x121216,
      metalness: 0.86,
      roughness: 0.26,
      iridescence: 0.45,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [180, 480],
      clearcoat: 0.75,
      clearcoatRoughness: 0.14,
    });

    // 5. Brushed Platinum Hardware with Subtle Vapor-Deposited Sheen
    const brushedPlatinumMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f4f6,
      metalness: 0.95,
      roughness: 0.12,
      anisotropy: 0.8,
      iridescence: 0.28,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [200, 440],
      clearcoat: 0.35,
    });

    const deepKeyholeMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.5,
      roughness: 0.62,
    });

    // 6. Vapor-Coated Iridescent Orbital Ring
    const iridescentHaloMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d4d8,
      metalness: 0.72,
      roughness: 0.14,
      iridescence: 1.0,
      iridescenceIOR: 1.46,
      iridescenceThicknessRange: [190, 560],
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    materials.push(
      dichroicBodyGlassMat,
      dichroicShackleGlassMat,
      prismaticInlayMat,
      internalObsidianCoreMat,
      brushedPlatinumMat,
      deepKeyholeMat,
      iridescentHaloMat
    );

    // Composite Architectural Dichroic Padlock Group
    const padlockRoot = new THREE.Group();
    padlockRoot.position.set(0, -0.05, 0);
    scene.add(padlockRoot);

    // Layer 0 (Opaque Core): Internal Obsidian Security Core + Dual Platinum Locking Pins inside Crystal
    const coreGeo = createInternalCoreGeometry();
    const pinGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.98, 24);
    geometries.push(coreGeo, pinGeo);

    const internalCoreMesh = new THREE.Mesh(coreGeo, internalObsidianCoreMat);
    internalCoreMesh.position.set(0, -0.58, 0);
    internalCoreMesh.castShadow = !isSoftwareGl;
    internalCoreMesh.renderOrder = 0;
    padlockRoot.add(internalCoreMesh);

    const leftInternalPin = new THREE.Mesh(pinGeo, brushedPlatinumMat);
    leftInternalPin.position.set(-0.62, -0.36, 0);
    leftInternalPin.renderOrder = 1;
    padlockRoot.add(leftInternalPin);

    const rightInternalPin = new THREE.Mesh(pinGeo, brushedPlatinumMat);
    rightInternalPin.position.set(0.62, -0.36, 0);
    rightInternalPin.renderOrder = 1;
    padlockRoot.add(rightInternalPin);

    // Layer 2 (Refractive Outer Shell): Monolithic Chamfered Dichroic Glass Padlock Body
    const bodyGeo = createPadlockBodyGeometry();
    geometries.push(bodyGeo);
    const bodyMesh = new THREE.Mesh(bodyGeo, dichroicBodyGlassMat);
    bodyMesh.position.set(0, -0.58, 0);
    bodyMesh.renderOrder = 2;
    padlockRoot.add(bodyMesh);

    // Layer 3: Precision Platinum Escutcheon Frames + Prismatic Front Lens
    const frameGeo = createFrontFrameGeometry();
    const glassInlayGeo = createGlassInlayGeometry();
    geometries.push(frameGeo, glassInlayGeo);

    const frontFrame = new THREE.Mesh(frameGeo, brushedPlatinumMat);
    frontFrame.position.set(0, -0.58, 0.455);
    frontFrame.renderOrder = 3;
    padlockRoot.add(frontFrame);

    const backFrame = new THREE.Mesh(frameGeo, brushedPlatinumMat);
    backFrame.position.set(0, -0.58, -0.455);
    backFrame.renderOrder = 3;
    padlockRoot.add(backFrame);

    const frontGlass = new THREE.Mesh(glassInlayGeo, prismaticInlayMat);
    frontGlass.position.set(0, -0.58, 0.44);
    frontGlass.renderOrder = 3;
    padlockRoot.add(frontGlass);

    // Shackle Assembly: Inner Brushed-Platinum Core Rod + Outer Iridescent Dichroic Crystal Tube
    const shackleGroup = new THREE.Group();
    const shackleInnerCoreGeo = createShackleTubeGeometry(0.056);
    const shackleOuterGlassGeo = createShackleTubeGeometry(0.168);
    geometries.push(shackleInnerCoreGeo, shackleOuterGlassGeo);

    const shackleInnerCore = new THREE.Mesh(shackleInnerCoreGeo, brushedPlatinumMat);
    shackleInnerCore.castShadow = !isSoftwareGl;
    shackleInnerCore.renderOrder = 1;
    shackleGroup.add(shackleInnerCore);

    const shackleOuterCrystal = new THREE.Mesh(shackleOuterGlassGeo, dichroicShackleGlassMat);
    shackleOuterCrystal.renderOrder = 2;
    shackleGroup.add(shackleOuterCrystal);

    padlockRoot.add(shackleGroup);

    // Turned Lathe Locking Collars at Shackle Entry Points
    const collarPoints = [
      new THREE.Vector2(0.165, 0.0),
      new THREE.Vector2(0.255, 0.0),
      new THREE.Vector2(0.255, 0.06),
      new THREE.Vector2(0.215, 0.1),
      new THREE.Vector2(0.17, 0.1),
    ];
    const collarGeo = new THREE.LatheGeometry(collarPoints, 32);
    geometries.push(collarGeo);

    const leftCollar = new THREE.Mesh(collarGeo, brushedPlatinumMat);
    leftCollar.position.set(-0.62, 0.38, 0);
    leftCollar.renderOrder = 3;
    padlockRoot.add(leftCollar);

    const rightCollar = new THREE.Mesh(collarGeo, brushedPlatinumMat);
    rightCollar.position.set(0.62, 0.38, 0);
    rightCollar.renderOrder = 3;
    padlockRoot.add(rightCollar);

    // Central Security Cylinder Dial + Keyhole
    const dialGroup = new THREE.Group();
    dialGroup.position.set(0, -0.58, 0.475);

    const cylinderBezelGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.055, 48);
    cylinderBezelGeo.rotateX(Math.PI / 2);
    geometries.push(cylinderBezelGeo);
    const cylinderBezel = new THREE.Mesh(cylinderBezelGeo, brushedPlatinumMat);
    cylinderBezel.renderOrder = 4;
    dialGroup.add(cylinderBezel);

    const dialTex = createDialTexture(renderer.capabilities.getMaxAnisotropy());
    textures.push(dialTex);
    const dialPlaneGeo = new THREE.CircleGeometry(0.37, 48);
    const dialPlaneMat = new THREE.MeshBasicMaterial({
      map: dialTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    geometries.push(dialPlaneGeo);
    materials.push(dialPlaneMat);
    const dialTicks = new THREE.Mesh(dialPlaneGeo, dialPlaneMat);
    dialTicks.position.z = 0.03;
    dialTicks.renderOrder = 5;
    dialGroup.add(dialTicks);

    const keyholeGeo = createKeyholeGeometry();
    geometries.push(keyholeGeo);
    const keyholeMesh = new THREE.Mesh(keyholeGeo, deepKeyholeMat);
    keyholeMesh.position.z = 0.033;
    keyholeMesh.renderOrder = 5;
    dialGroup.add(keyholeMesh);

    padlockRoot.add(dialGroup);

    // Iridescent Orbital Perimeter Ring
    const haloGeo = new THREE.TorusGeometry(2.05, 0.018, 20, 108);
    geometries.push(haloGeo);
    const haloRing = new THREE.Mesh(haloGeo, iridescentHaloMat);
    haloRing.rotation.x = Math.PI * 0.38;
    haloRing.rotation.y = -Math.PI * 0.14;
    padlockRoot.add(haloRing);

    // Grounded Contact Shadow
    const shadowTex = createContactShadowTexture();
    textures.push(shadowTex);
    const shadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.82,
    });
    geometries.push(shadowGeo);
    materials.push(shadowMat);
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.18;
    scene.add(shadowMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pure mouse-hover interaction (no controls)
    let targetX = 0;
    let targetY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let isCanvasHovered = false;
    let hoverLift = 0;

    const onWindowPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = -(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1;
      targetX = THREE.MathUtils.clamp(nx, -1, 1);
      targetY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const onPointerEnter = () => {
      isCanvasHovered = true;
    };
    const onPointerLeave = () => {
      isCanvasHovered = false;
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(1, Math.floor(entry.contentRect.width));
      const h = Math.max(1, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isVisible && !contextLost) {
        smoothX = THREE.MathUtils.damp(smoothX, targetX, 5.2, dt);
        smoothY = THREE.MathUtils.damp(smoothY, targetY, 5.2, dt);
        hoverLift = THREE.MathUtils.damp(hoverLift, isCanvasHovered ? 1 : 0, 5.0, dt);

        const motionScale = prefersReducedMotion ? 0.15 : 1.0;

        // Smooth floating poise + responsive cursor tilt
        padlockRoot.position.y = -0.05 + Math.sin(elapsed * 1.1) * 0.055 * motionScale;
        padlockRoot.rotation.y = smoothX * 0.58 + Math.sin(elapsed * 0.45) * 0.08 * motionScale;
        padlockRoot.rotation.x = -smoothY * 0.34;
        padlockRoot.rotation.z = -smoothX * 0.06;

        // Subtle mechanical response on mouse hover: shackle & internal pins glide smoothly
        shackleGroup.position.y = hoverLift * 0.22;
        leftInternalPin.position.y = -0.36 + hoverLift * 0.08;
        rightInternalPin.position.y = -0.36 + hoverLift * 0.08;
        dialTicks.rotation.z = smoothX * 0.45 + hoverLift * (Math.PI * 0.25);

        // Counter-tilting orbital iridescent ring
        haloRing.rotation.x = Math.PI * 0.38 - smoothY * 0.28;
        haloRing.rotation.y = -Math.PI * 0.14 - smoothX * 0.35 + elapsed * 0.14 * motionScale;

        // Dynamic grazing highlights sweeping thin-film spectrum as cursor moves
        coolGrazingLight.position.x = -5.0 + smoothX * 2.8;
        coolGrazingLight.position.y = 2.8 + smoothY * 2.0;
        pearlGrazingLight.position.x = 4.6 - smoothX * 2.4;
        pearlGrazingLight.position.y = -2.4 - smoothY * 1.8;

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onWindowPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      io.disconnect();
      ro.disconnect();

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tex) => tex.dispose());
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFallback) {
    return (
      <div className="relative w-full h-[440px] lg:h-[540px] rounded-2xl border border-zinc-200 bg-zinc-100 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl border border-zinc-300 bg-white flex items-center justify-center shadow-sm">
          <Lock className="w-9 h-9 text-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={t.hero.padlockAria}
      className="relative w-full h-[440px] lg:h-[540px] rounded-2xl border border-zinc-200/90 bg-[#F4F4F5] overflow-hidden select-none"
    >
      <div ref={canvasMountRef} className="w-full h-full" />
    </div>
  );
}
