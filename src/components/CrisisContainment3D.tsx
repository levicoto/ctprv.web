import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Shield } from 'lucide-react';
import { type CrisisScenarioItem, useI18n } from '../lib/i18n';

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

/**
 * Stepped architectural obsidian containment plinth (LatheGeometry).
 */
function createContainmentPlinthGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.0, -1.78),
    new THREE.Vector2(1.24, -1.78),
    new THREE.Vector2(1.24, -1.67),
    new THREE.Vector2(1.08, -1.61),
    new THREE.Vector2(0.96, -1.49),
    new THREE.Vector2(0.74, -1.38),
    new THREE.Vector2(0.64, -1.16),
    new THREE.Vector2(0.82, -1.0),
    new THREE.Vector2(0.74, -0.95),
    new THREE.Vector2(0.52, -1.06),
    new THREE.Vector2(0.0, -1.1),
  ];
  return new THREE.LatheGeometry(points, 48);
}

/**
 * Turned brushed-platinum isolation collar seated on the obsidian plinth.
 */
function createIsolationCollarGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.5, -1.06),
    new THREE.Vector2(0.84, -0.96),
    new THREE.Vector2(0.96, -0.82),
    new THREE.Vector2(0.89, -0.78),
    new THREE.Vector2(0.72, -0.92),
    new THREE.Vector2(0.46, -1.0),
  ];
  return new THREE.LatheGeometry(points, 48);
}

/**
 * Machined brushed-platinum crown/base compression cap for the Faraday chamber.
 */
function createCompressionCapGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.0, 0.2),
    new THREE.Vector2(0.32, 0.2),
    new THREE.Vector2(0.58, 0.11),
    new THREE.Vector2(0.64, 0.03),
    new THREE.Vector2(0.56, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  return new THREE.LatheGeometry(points, 40);
}

/**
 * Curved quadrant vault shutter (arc sector ExtrudeGeometry with bevels) centered radially along +X.
 * Four of these form a cylindrical Faraday crystal vault that physically seals around the core.
 */
function createQuadrantShieldGeometry(): THREE.ExtrudeGeometry {
  const innerR = 0.68;
  const outerR = 0.9;
  const halfAngle = Math.PI * 0.205; // leaves crisp precision architectural seam between the 4 shutters
  const segments = 24;

  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(-halfAngle) * innerR, Math.sin(-halfAngle) * innerR);
  for (let i = 0; i <= segments; i++) {
    const a = -halfAngle + (i / segments) * (halfAngle * 2);
    shape.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
  }
  for (let i = segments; i >= 0; i--) {
    const a = -halfAngle + (i / segments) * (halfAngle * 2);
    shape.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
  }
  shape.closePath();

  const height = 1.24;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 3,
  });

  // Extrude is along Z [0..height]; rotate so arc lies in XZ plane and height spans Y [-height/2..+height/2]
  geo.translate(0, 0, -height / 2);
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/**
 * Non-color linear thickness map for thin-film dichroic iridescence on the crystal shutters.
 */
function createIridescenceThicknessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgb(0, 48, 0)');
    grad.addColorStop(0.38, 'rgb(0, 168, 0)');
    grad.addColorStop(0.72, 'rgb(0, 242, 0)');
    grad.addColorStop(1, 'rgb(0, 92, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const radial = ctx.createRadialGradient(
      size * 0.4,
      size * 0.36,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.65
    );
    radial.addColorStop(0, 'rgba(0, 255, 0, 0.48)');
    radial.addColorStop(0.55, 'rgba(0, 134, 0, 0.24)');
    radial.addColorStop(1, 'rgba(0, 32, 0, 0.44)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  return tex;
}

/**
 * Precision calibration vernier dial texture on the containment base collar.
 */
function createCalibrationRingTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.24)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const major = i % 5 === 0;
      const cardinal = i % 15 === 0;
      const r0 = size * (cardinal ? 0.36 : major ? 0.39 : 0.415);
      const r1 = size * 0.445;
      ctx.strokeStyle = cardinal
        ? 'rgba(255, 255, 255, 0.78)'
        : major
          ? 'rgba(226, 232, 240, 0.46)'
          : 'rgba(148, 163, 184, 0.24)';
      ctx.lineWidth = cardinal ? 2.6 : major ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createSoftShadowMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 12, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0, 0, 0, 0.76)');
    g.addColorStop(0.52, 'rgba(0, 0, 0, 0.3)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Pre-allocated color instances outside render loop (zero GC per frame)
const ALERT_EMISSIVE = new THREE.Color(0xfde68a);
const SEALED_EMISSIVE = new THREE.Color(0xbae6fd);
const ALERT_LIGHT = new THREE.Color(0xfef3c7);
const SEALED_LIGHT = new THREE.Color(0xe0f2fe);
const _workEmissive = new THREE.Color();
const _workLight = new THREE.Color();

interface CrisisContainment3DProps {
  scenarioId: CrisisScenarioItem['id'];
  containmentProgress: number; // 0..1
}

export default function CrisisContainment3D({
  scenarioId,
  containmentProgress,
}: CrisisContainment3DProps) {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  const scenarioRef = useRef<CrisisScenarioItem['id']>(scenarioId);
  const progressRef = useRef<number>(containmentProgress);

  useEffect(() => {
    scenarioRef.current = scenarioId;
  }, [scenarioId]);

  useEffect(() => {
    progressRef.current = THREE.MathUtils.clamp(containmentProgress, 0, 1);
  }, [containmentProgress]);

  useEffect(() => {
    const container = mountRef.current;
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
      setFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.transmissionResolutionScale = 0.5;
    renderer.shadowMap.enabled = false;

    const w0 = container.clientWidth || 560;
    const h0 = container.clientHeight || 420;
    renderer.setSize(w0, h0);
    renderer.domElement.className = 'block w-full h-full outline-none touch-pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const darkBg = 0x0c0c0e;
    scene.background = new THREE.Color(darkBg);
    scene.fog = new THREE.FogExp2(darkBg, 0.044);

    const baseCameraZ = 7.55;
    const initialAspect = w0 / Math.max(h0, 1);
    const camera = new THREE.PerspectiveCamera(34, initialAspect, 0.1, 50);
    camera.position.set(0, 0.16, baseCameraZ * Math.max(1, 1.22 / initialAspect));
    camera.lookAt(0, -0.04, 0);

    // Studio Environment Reflection (mandatory for refractive crystal & brushed platinum)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();

    // Warm/Cool 3-Point Studio Rig
    const hemi = new THREE.HemisphereLight(0xf8fafc, 0x18181b, 0.94);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfffcf5, 2.5);
    key.position.set(4.2, 5.4, 5.0);
    scene.add(key);

    const coolRim = new THREE.DirectionalLight(0xdbeafe, 2.15);
    coolRim.position.set(-4.6, 2.7, -3.5);
    scene.add(coolRim);

    const pearlRim = new THREE.DirectionalLight(0xf3e8ff, 1.55);
    pearlRim.position.set(4.1, -2.1, -3.6);
    scene.add(pearlRim);

    const corePointLight = new THREE.PointLight(0xfef3c7, 2.35, 5.2, 1.6);
    corePointLight.position.set(0, 0.18, 0.1);
    scene.add(corePointLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const iridTex = createIridescenceThicknessMap();
    const dialTex = createCalibrationRingTexture(renderer.capabilities.getMaxAnisotropy());
    const shadowTex = createSoftShadowMap();
    const textures: THREE.Texture[] = [envRT.texture, iridTex, dialTex, shadowTex];

    // 1. Stepped Architectural Obsidian Plinth Material (roughness ~0.38)
    const obsidianPlinthMat = new THREE.MeshPhysicalMaterial({
      color: 0x131318,
      metalness: 0.68,
      roughness: 0.38,
      iridescence: 0.34,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [180, 440],
      clearcoat: 0.65,
      clearcoatRoughness: 0.16,
    });

    // 2. Anisotropic Brushed Platinum Hardware (roughness ~0.11 — >=0.27 delta from obsidian)
    const brushedPlatinumMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.96,
      roughness: 0.11,
      anisotropy: 0.85,
      iridescence: 0.28,
      iridescenceIOR: 1.36,
      iridescenceThicknessRange: [200, 460],
      clearcoat: 0.42,
      clearcoatRoughness: 0.08,
    });

    // 3. Matte Obsidian Inner Faraday Frame (roughness ~0.52)
    const innerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x17171e,
      metalness: 0.56,
      roughness: 0.52,
    });

    // 4. Dichroic Refractive Crystal Quadrant Vault Shutters
    const crystalShieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.03,
      roughness: 0.038,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 1.0,
      ior: 1.76,
      thickness: 1.95,
      dispersion: isSoftwareGl ? 0 : 0.92,
      attenuationColor: new THREE.Color(0xdbeafe),
      attenuationDistance: 2.5,
      iridescence: 1.0,
      iridescenceIOR: 1.52,
      iridescenceThicknessRange: [185, 620],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.45,
      specularColor: new THREE.Color(0xffffff),
      envMapIntensity: 2.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    });

    // 5. Vapor-Deposited Iridescent Faraday Orbital Ring
    const iridescentOrbitalMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.78,
      roughness: 0.14,
      iridescence: 1.0,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [195, 590],
      iridescenceThicknessMap: iridTex,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    // 6. Luminous Identity Core Material (transitions from warm amber alert to cool sapphire seal)
    const identityCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: ALERT_EMISSIVE.clone(),
      emissiveIntensity: 1.85,
      metalness: 0.18,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    // 7. Calibration Vernier Ring Decal Material
    const dialDecalMat = new THREE.MeshBasicMaterial({
      map: dialTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    materials.push(
      obsidianPlinthMat,
      brushedPlatinumMat,
      innerFrameMat,
      crystalShieldMat,
      iridescentOrbitalMat,
      identityCoreMat,
      dialDecalMat
    );

    // =========================================================================
    // Composite Cryptographic Faraday Containment Chamber (10 distinct parts)
    // =========================================================================
    const sculptureRoot = new THREE.Group();
    sculptureRoot.position.set(0, 0.06, 0);
    scene.add(sculptureRoot);

    // Part 1: Stepped Obsidian Containment Plinth
    const plinthGeo = createContainmentPlinthGeometry();
    geometries.push(plinthGeo);
    const plinthMesh = new THREE.Mesh(plinthGeo, obsidianPlinthMat);
    plinthMesh.renderOrder = 0;
    sculptureRoot.add(plinthMesh);

    // Part 2: Turned Brushed-Platinum Isolation Collar & Base Trim Ring + Vernier Dial
    const collarGeo = createIsolationCollarGeometry();
    const baseTrimGeo = new THREE.TorusGeometry(1.1, 0.022, 20, 84);
    baseTrimGeo.rotateX(Math.PI / 2);
    const dialDiscGeo = new THREE.RingGeometry(0.68, 1.04, 64);
    dialDiscGeo.rotateX(-Math.PI / 2);
    geometries.push(collarGeo, baseTrimGeo, dialDiscGeo);

    const collarMesh = new THREE.Mesh(collarGeo, brushedPlatinumMat);
    sculptureRoot.add(collarMesh);

    const baseTrimMesh = new THREE.Mesh(baseTrimGeo, brushedPlatinumMat);
    baseTrimMesh.position.y = -1.65;
    sculptureRoot.add(baseTrimMesh);

    const dialDiscMesh = new THREE.Mesh(dialDiscGeo, dialDecalMat);
    dialDiscMesh.position.y = -0.94;
    dialDiscMesh.renderOrder = 2;
    sculptureRoot.add(dialDiscMesh);

    // Chamber Floating Assembly
    const chamberCenterY = 0.2;
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, chamberCenterY, 0);
    sculptureRoot.add(chamberGroup);

    // Part 3: Central Faceted Identity Core + Inner Obsidian Nucleus Lattice
    const coreIcoGeo = new THREE.IcosahedronGeometry(0.4, 0);
    const innerCageGeo = new THREE.OctahedronGeometry(0.54, 0);
    const cageEdgesGeo = new THREE.EdgesGeometry(innerCageGeo, 12);
    innerCageGeo.dispose();
    const cageLineMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.42,
    });
    geometries.push(coreIcoGeo, cageEdgesGeo);
    materials.push(cageLineMat);

    const coreMesh = new THREE.Mesh(coreIcoGeo, identityCoreMat);
    coreMesh.renderOrder = 1;
    chamberGroup.add(coreMesh);

    const innerLatticeLines = new THREE.LineSegments(cageEdgesGeo, cageLineMat);
    innerLatticeLines.renderOrder = 2;
    chamberGroup.add(innerLatticeLines);

    // Part 4 & 5: Four Quadrant Dichroic Crystal Faraday Shutters + Platinum Actuator Rods
    const shutterGeo = createQuadrantShieldGeometry();
    const pistonRodGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.26, 18);
    pistonRodGeo.rotateZ(Math.PI / 2);
    const lugBlockGeo = new THREE.BoxGeometry(0.08, 0.24, 0.12);
    geometries.push(shutterGeo, pistonRodGeo, lugBlockGeo);

    const quadrantGroups: { group: THREE.Group; dirX: number; dirZ: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const qGroup = new THREE.Group();
      qGroup.rotation.y = angle;

      const crystalShutter = new THREE.Mesh(shutterGeo, crystalShieldMat);
      crystalShutter.renderOrder = 5;
      qGroup.add(crystalShutter);

      // Exterior platinum locking spine along each crystal quadrant
      const spineLug = new THREE.Mesh(lugBlockGeo, brushedPlatinumMat);
      spineLug.position.set(0.92, 0, 0);
      spineLug.renderOrder = 6;
      qGroup.add(spineLug);

      // Upper & lower radial actuator pins
      const upperPin = new THREE.Mesh(pistonRodGeo, innerFrameMat);
      upperPin.position.set(0.58, 0.44, 0);
      upperPin.renderOrder = 2;
      qGroup.add(upperPin);

      const lowerPin = new THREE.Mesh(pistonRodGeo, innerFrameMat);
      lowerPin.position.set(0.58, -0.44, 0);
      lowerPin.renderOrder = 2;
      qGroup.add(lowerPin);

      chamberGroup.add(qGroup);
      quadrantGroups.push({
        group: qGroup,
        dirX: Math.cos(angle),
        dirZ: -Math.sin(angle),
      });
    }

    // Part 6 & 7: Upper & Lower Brushed-Platinum Compression Caps + Finial
    const capGeo = createCompressionCapGeometry();
    const finialGeo = new THREE.ConeGeometry(0.06, 0.18, 24);
    geometries.push(capGeo, finialGeo);

    const upperCapGroup = new THREE.Group();
    const upperCapMesh = new THREE.Mesh(capGeo, brushedPlatinumMat);
    upperCapMesh.renderOrder = 6;
    upperCapGroup.add(upperCapMesh);
    const finialMesh = new THREE.Mesh(finialGeo, brushedPlatinumMat);
    finialMesh.position.y = 0.28;
    finialMesh.renderOrder = 6;
    upperCapGroup.add(finialMesh);
    upperCapGroup.position.y = 0.72;
    chamberGroup.add(upperCapGroup);

    const lowerCapGroup = new THREE.Group();
    const lowerCapMesh = new THREE.Mesh(capGeo, obsidianPlinthMat);
    lowerCapMesh.rotation.x = Math.PI;
    lowerCapMesh.renderOrder = 4;
    lowerCapGroup.add(lowerCapMesh);
    lowerCapGroup.position.y = -0.72;
    chamberGroup.add(lowerCapGroup);

    // Part 8: Brushed-Platinum Equatorial Gimbal Lock Ring + 4 Cardinal Lugs
    const equatorialGroup = new THREE.Group();
    chamberGroup.add(equatorialGroup);

    const eqRingGeo = new THREE.TorusGeometry(1.26, 0.028, 22, 108);
    eqRingGeo.rotateX(Math.PI / 2);
    const eqNodeGeo = new THREE.CylinderGeometry(0.056, 0.056, 0.11, 20);
    geometries.push(eqRingGeo, eqNodeGeo);

    const eqRingMesh = new THREE.Mesh(eqRingGeo, brushedPlatinumMat);
    eqRingMesh.renderOrder = 6;
    equatorialGroup.add(eqRingMesh);

    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const node = new THREE.Mesh(eqNodeGeo, brushedPlatinumMat);
      node.position.set(Math.cos(a) * 1.26, 0, Math.sin(a) * 1.26);
      node.renderOrder = 6;
      equatorialGroup.add(node);
    }

    // Part 9: Tilted Iridescent Faraday Orbital Perimeter Ring
    const orbitalGroup = new THREE.Group();
    orbitalGroup.rotation.x = Math.PI * 0.34;
    orbitalGroup.rotation.z = -Math.PI * 0.16;
    chamberGroup.add(orbitalGroup);

    const orbitalGeo = new THREE.TorusGeometry(1.54, 0.018, 20, 120);
    const markerGeo = new THREE.SphereGeometry(0.04, 16, 14);
    geometries.push(orbitalGeo, markerGeo);

    const orbitalMesh = new THREE.Mesh(orbitalGeo, iridescentOrbitalMat);
    orbitalMesh.renderOrder = 6;
    orbitalGroup.add(orbitalMesh);

    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const m = new THREE.Mesh(markerGeo, brushedPlatinumMat);
      m.position.set(Math.cos(a) * 1.54, Math.sin(a) * 1.54, 0);
      orbitalGroup.add(m);
    }

    // Part 10: Grounded Contact Shadow Plane beneath Plinth
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.78,
    });
    geometries.push(shadowGeo);
    materials.push(shadowMat);
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.76;
    scene.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Unified Desktop + Mobile Pointer, Touch, Scroll & State Kinematics
    let cursorX = 0;
    let cursorY = 0;
    let scrollYaw = 0;
    let scrollPitch = 0;
    let gyroX = 0;
    let gyroY = 0;
    let gyroBaseGamma: number | null = null;
    let gyroBaseBeta: number | null = null;
    let smoothX = 0;
    let smoothY = 0;
    let smoothProgress = progressRef.current;
    let smoothScenarioAngle = 0;
    let smoothOrbitalTilt = -Math.PI * 0.16;
    let isHovered = false;
    let isTouchActive = false;
    let touchActuateUntil = 0;
    let focusFactor = 0;

    let isVisible = true;
    let cachedDocTop = 0;
    let cachedHeight = h0;
    let cachedVh = Math.max(window.innerHeight, 1);
    let cachedCompact = window.innerWidth < 1024;
    let lastScrollTime = 0;

    const syncLayoutMetrics = () => {
      const rect = container.getBoundingClientRect();
      cachedDocTop = rect.top + window.scrollY;
      cachedHeight = Math.max(rect.height, 1);
      cachedVh = Math.max(window.innerHeight, 1);
      cachedCompact = window.innerWidth < 1024;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isVisible || e.pointerType === 'touch') return;
      cursorX = THREE.MathUtils.clamp((e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1, -1, 1);
      cursorY = THREE.MathUtils.clamp(-(e.clientY / cachedVh) * 2 + 1, -1, 1);
    };

    const updateFromTouch = (touch: Touch) => {
      const rect = container.getBoundingClientRect();
      const nx = (((touch.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1) * 1.25;
      const ny = (-((touch.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1) * 1.25;
      cursorX = THREE.MathUtils.clamp(nx, -1, 1);
      cursorY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isTouchActive = true;
        touchActuateUntil = performance.now() + 1400;
        updateFromTouch(e.touches[0]);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isTouchActive = true;
        updateFromTouch(e.touches[0]);
      }
    };

    const onTouchEnd = () => {
      isTouchActive = false;
      cursorX *= 0.35;
      cursorY *= 0.35;
    };

    const computeScrollTilt = () => {
      if (prefersReducedMotion) {
        scrollYaw = 0;
        scrollPitch = 0;
        return;
      }
      const viewportTop = cachedDocTop - window.scrollY;
      const centerDelta = (cachedVh * 0.5 - (viewportTop + cachedHeight * 0.5)) / (cachedVh * 0.65);
      const yawScale = cachedCompact ? 0.52 : 0.18;
      const pitchScale = cachedCompact ? 0.34 : 0.12;
      scrollYaw = THREE.MathUtils.clamp(centerDelta * yawScale, -0.58, 0.58);
      scrollPitch = THREE.MathUtils.clamp(-centerDelta * pitchScale, -0.42, 0.42);
    };

    const onScroll = () => {
      lastScrollTime = performance.now();
      if (!isVisible) return;
      computeScrollTilt();
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!isVisible || prefersReducedMotion || e.gamma === null || e.beta === null) return;
      if (gyroBaseGamma === null || gyroBaseBeta === null) {
        gyroBaseGamma = e.gamma;
        gyroBaseBeta = e.beta;
      }
      gyroX = THREE.MathUtils.clamp((e.gamma - gyroBaseGamma) / 28, -0.65, 0.65);
      gyroY = THREE.MathUtils.clamp(-(e.beta - gyroBaseBeta) / 28, -0.55, 0.55);
    };

    const onEnter = () => {
      isHovered = true;
    };
    const onLeave = () => {
      isHovered = false;
    };

    syncLayoutMetrics();
    computeScrollTilt();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    let contextLost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onRestored = () => {
      contextLost = false;
      syncLoopState();
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const clock = new THREE.Clock();
    let frameId = 0;
    let running = false;
    let disposed = false;
    let scrollAccum = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed || !running) return;
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
      if (disposed || !running) return;

      const rawDt = Math.min(clock.getDelta(), 0.05);
      const now = performance.now();
      const activelyScrolling = !isSoftwareGl && now - lastScrollTime < 110;

      if (activelyScrolling) {
        scrollAccum += rawDt;
        if (scrollAccum < 1 / 30) {
          frameId = requestAnimationFrame(tick);
          return;
        }
      }

      const dt = activelyScrolling ? Math.min(scrollAccum, 0.05) : rawDt;
      scrollAccum = 0;
      const elapsed = clock.getElapsedTime();

      if (!contextLost) {
        const activeTargetX = THREE.MathUtils.clamp(cursorX + gyroX + scrollYaw, -1.05, 1.05);
        const activeTargetY = THREE.MathUtils.clamp(cursorY + gyroY + scrollPitch, -1.0, 1.0);
        const shouldFocus = isHovered || isTouchActive || now < touchActuateUntil;

        const scen = scenarioRef.current;
        const targetScenarioYaw =
          scen === 'hack' ? 0 : scen === 'extortion' ? Math.PI * 0.25 : -Math.PI * 0.25;
        const targetOrbitalTilt =
          scen === 'reputation' ? Math.PI * 0.22 : scen === 'extortion' ? 0.04 : -Math.PI * 0.16;

        smoothX = THREE.MathUtils.damp(smoothX, activeTargetX, 5.4, dt);
        smoothY = THREE.MathUtils.damp(smoothY, activeTargetY, 5.4, dt);
        focusFactor = THREE.MathUtils.damp(focusFactor, shouldFocus ? 1 : 0, 5.0, dt);
        smoothProgress = THREE.MathUtils.damp(smoothProgress, progressRef.current, 4.6, dt);
        smoothScenarioYaw: {
          smoothScenarioAngle = THREE.MathUtils.damp(
            smoothScenarioAngle,
            targetScenarioYaw,
            4.2,
            dt
          );
          break smoothScenarioYaw;
        }
        smoothOrbitalTilt = THREE.MathUtils.damp(smoothOrbitalTilt, targetOrbitalTilt, 4.2, dt);

        const motionScale = prefersReducedMotion ? 0.15 : 1.0;

        // Effective seal combines checklist progress with subtle hover preview compression
        const sealFactor = THREE.MathUtils.clamp(
          smoothProgress * 0.85 + focusFactor * 0.28 * (1 - smoothProgress * 0.5),
          0,
          1
        );

        sculptureRoot.rotation.y = smoothX * 0.28 + Math.sin(elapsed * 0.36) * 0.06 * motionScale;
        sculptureRoot.rotation.x = -smoothY * 0.14;

        chamberGroup.position.y =
          chamberCenterY + Math.sin(elapsed * 1.1) * 0.032 * (1 - smoothProgress * 0.45) * motionScale;
        chamberGroup.rotation.y = smoothScenarioAngle + smoothX * 0.22;

        // Radially seal the 4 dichroic crystal vault quadrants around the core
        const radialGap = THREE.MathUtils.lerp(0.24, 0.018, sealFactor);
        for (let i = 0; i < quadrantGroups.length; i++) {
          const q = quadrantGroups[i];
          q.group.position.set(q.dirX * radialGap, 0, q.dirZ * radialGap);
        }

        // Vertically cinch upper & lower platinum compression caps
        const capOffset = THREE.MathUtils.lerp(0.8, 0.66, sealFactor);
        upperCapGroup.position.y = capOffset;
        lowerCapGroup.position.y = -capOffset;

        // Core spin slows & stabilizes into calm sapphire luminescence as containment completes
        const coreSpinSpeed = THREE.MathUtils.lerp(0.95, 0.28, smoothProgress) * motionScale;
        coreMesh.rotation.y = elapsed * coreSpinSpeed;
        coreMesh.rotation.x = elapsed * coreSpinSpeed * 0.55;
        innerLatticeLines.rotation.y = -elapsed * coreSpinSpeed * 0.65;
        innerLatticeLines.rotation.z = elapsed * 0.22 * motionScale;

        _workEmissive.copy(ALERT_EMISSIVE).lerp(SEALED_EMISSIVE, smoothProgress);
        identityCoreMat.emissive.copy(_workEmissive);
        identityCoreMat.emissiveIntensity = 1.65 + focusFactor * 0.35 + smoothProgress * 0.25;

        _workLight.copy(ALERT_LIGHT).lerp(SEALED_LIGHT, smoothProgress);
        corePointLight.color.copy(_workLight);
        corePointLight.position.x = smoothX * 0.4;
        corePointLight.position.y = chamberCenterY + smoothY * 0.3;

        equatorialGroup.rotation.y =
          -smoothScenarioAngle * 0.6 +
          Math.sin(elapsed * 0.5) * 0.14 * (1 - smoothProgress * 0.7) * motionScale;
        equatorialGroup.rotation.z = smoothY * 0.12;

        dialDiscMesh.rotation.y = smoothX * 0.35 + smoothProgress * (Math.PI * 0.5);

        orbitalGroup.rotation.z = smoothOrbitalTilt + smoothX * 0.18;
        orbitalMesh.rotation.z = elapsed * 0.2 * motionScale;

        coolRim.position.x = -4.6 + smoothX * 2.4;
        coolRim.position.y = 2.7 + smoothY * 1.6;
        pearlRim.position.x = 4.1 - smoothX * 2.2;
        pearlRim.position.y = -2.1 - smoothY * 1.4;

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    function syncLoopState() {
      const shouldRun = !disposed && isVisible && !document.hidden && !contextLost;
      if (shouldRun && !running) {
        running = true;
        clock.getDelta();
        scrollAccum = 0;
        tick();
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      }
    }

    const onVisibilityChange = () => {
      syncLoopState();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisible = entries[0].isIntersecting;
          if (isVisible) {
            syncLayoutMetrics();
            computeScrollTilt();
          }
          syncLoopState();
        }
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(1, Math.floor(entry.contentRect.width));
      const h = Math.max(1, Math.floor(entry.contentRect.height));
      const aspect = w / h;
      camera.aspect = aspect;
      camera.position.z = baseCameraZ * Math.max(1, 1.22 / aspect);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      syncLayoutMetrics();
    });
    ro.observe(container);

    syncLoopState();

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
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

  if (fallback) {
    return (
      <div className="relative w-full aspect-[5/4] min-h-[340px] max-h-[500px] rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-center shadow-sm">
          <Shield className="w-9 h-9 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={t.crisisPage.hero.chamberAria}
      className="relative w-full aspect-[5/4] min-h-[340px] max-h-[500px] rounded-2xl border border-zinc-900/90 bg-[#0C0C0E] overflow-hidden select-none touch-pan-y shadow-xl shadow-zinc-950/15"
    >
      <div ref={mountRef} className="w-full h-full touch-pan-y" />
    </div>
  );
}
