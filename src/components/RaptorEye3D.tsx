import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Compass } from 'lucide-react';
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

/**
 * Stepped architectural obsidian pedestal base (LatheGeometry) that anchors the Palantír orb.
 */
function createPedestalBaseGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.0, -1.78),
    new THREE.Vector2(1.18, -1.78),
    new THREE.Vector2(1.18, -1.68),
    new THREE.Vector2(1.04, -1.63),
    new THREE.Vector2(0.96, -1.52),
    new THREE.Vector2(0.76, -1.42),
    new THREE.Vector2(0.62, -1.24),
    new THREE.Vector2(0.74, -1.06),
    new THREE.Vector2(0.84, -0.94),
    new THREE.Vector2(0.76, -0.90),
    new THREE.Vector2(0.56, -1.04),
    new THREE.Vector2(0.0, -1.08),
  ];
  return new THREE.LatheGeometry(points, 72);
}

/**
 * Turned brushed-platinum chalice collar seated atop the obsidian pedestal, cradling the orb.
 */
function createPlatinumCradleGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0.54, -1.05),
    new THREE.Vector2(0.82, -0.95),
    new THREE.Vector2(0.95, -0.78),
    new THREE.Vector2(0.89, -0.74),
    new THREE.Vector2(0.72, -0.90),
    new THREE.Vector2(0.50, -0.99),
  ];
  return new THREE.LatheGeometry(points, 72);
}

/**
 * Sculpted architectural claw/buttress prong embracing the lower hemisphere of the Palantír sphere.
 */
function createCradleProngGeometry(): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.72, -1.16, 0),
    new THREE.Vector3(0.94, -0.88, 0),
    new THREE.Vector3(1.12, -0.52, 0),
    new THREE.Vector3(1.17, -0.18, 0),
  ]);
  return new THREE.TubeGeometry(curve, 36, 0.042, 16, false);
}

/**
 * Procedural concentric Fresnel lighthouse lens & calibration reticle texture.
 */
function createFresnelLensTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;

    const coreGrad = ctx.createRadialGradient(cx, cy, size * 0.02, cx, cy, size * 0.5);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.18, '#e0f2fe');
    coreGrad.addColorStop(0.42, '#93c5fd');
    coreGrad.addColorStop(0.72, '#1e293b');
    coreGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, size, size);

    // Stepped concentric Fresnel prism ridges
    const rings = [0.14, 0.22, 0.30, 0.38, 0.45];
    rings.forEach((r, idx) => {
      ctx.strokeStyle =
        idx < 2 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(224, 242, 254, 0.48)';
      ctx.lineWidth = idx === 0 ? 3.0 : 2.0;
      ctx.beginPath();
      ctx.arc(cx, cy, size * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Precision optical crosshairs & azimuth ticks
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const major = i % 9 === 0;
      const r0 = size * (major ? 0.16 : 0.34);
      const r1 = size * 0.47;
      ctx.strokeStyle = major ? 'rgba(255, 255, 255, 0.65)' : 'rgba(186, 230, 253, 0.28)';
      ctx.lineWidth = major ? 2.0 : 1.1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
      ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Smooth volumetric beam falloff texture for the internal lighthouse observation cone.
 * On ConeGeometry UV.y: 1.0 = apex (at beacon source), 0.0 = wide base (outer fade).
 */
function createVolumetricBeamTexture(): THREE.CanvasTexture {
  const w = 128;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Canvas y=0 corresponds to UV.y=1 (apex), y=h corresponds to UV.y=0 (outer open end)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
    grad.addColorStop(0.18, 'rgba(224, 242, 254, 0.56)');
    grad.addColorStop(0.52, 'rgba(186, 230, 253, 0.20)');
    grad.addColorStop(0.85, 'rgba(147, 197, 253, 0.05)');
    grad.addColorStop(1.0, 'rgba(147, 197, 253, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Non-color linear thickness map for thin-film dichroic iridescence on the Palantír crystal.
 */
function createIridescenceThicknessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgb(0, 44, 0)');
    grad.addColorStop(0.35, 'rgb(0, 162, 0)');
    grad.addColorStop(0.7, 'rgb(0, 244, 0)');
    grad.addColorStop(1, 'rgb(0, 86, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const radial = ctx.createRadialGradient(
      size * 0.42,
      size * 0.36,
      size * 0.04,
      size * 0.5,
      size * 0.5,
      size * 0.64
    );
    radial.addColorStop(0, 'rgba(0, 255, 0, 0.50)');
    radial.addColorStop(0.56, 'rgba(0, 132, 0, 0.24)');
    radial.addColorStop(1, 'rgba(0, 28, 0, 0.46)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
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
    g.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    g.addColorStop(0.52, 'rgba(0, 0, 0, 0.28)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function RaptorEye3D() {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

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
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const w0 = container.clientWidth || 560;
    const h0 = container.clientHeight || 420;
    renderer.setSize(w0, h0);
    renderer.domElement.className = 'block w-full h-full outline-none touch-pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const darkBg = 0x0c0c0e;
    scene.background = new THREE.Color(darkBg);
    scene.fog = new THREE.FogExp2(darkBg, 0.045);

    const baseCameraZ = 7.45;
    const initialAspect = w0 / Math.max(h0, 1);
    const camera = new THREE.PerspectiveCamera(34, initialAspect, 0.1, 50);
    camera.position.set(0, 0.12, baseCameraZ * Math.max(1, 1.24 / initialAspect));
    camera.lookAt(0, -0.06, 0);

    // Studio Environment Reflection (mandatory for refractive crystal & brushed platinum)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xf8fafc, 0x18181b, 0.92);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfffcf5, 2.55);
    key.position.set(4.1, 5.2, 5.1);
    scene.add(key);

    const coolRim = new THREE.DirectionalLight(0xdbeafe, 2.2);
    coolRim.position.set(-4.6, 2.6, -3.6);
    scene.add(coolRim);

    const pearlRim = new THREE.DirectionalLight(0xf3e8ff, 1.65);
    pearlRim.position.set(4.2, -2.2, -3.5);
    scene.add(pearlRim);

    // Internal point light representing the seeing-stone's active optical beacon
    const beaconPointLight = new THREE.PointLight(0xe0f2fe, 2.4, 5.5, 1.6);
    beaconPointLight.position.set(0, 0.16, 0.15);
    scene.add(beaconPointLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const iridTex = createIridescenceThicknessMap();
    const fresnelTex = createFresnelLensTexture(renderer.capabilities.getMaxAnisotropy());
    const beamTex = createVolumetricBeamTexture();
    const shadowTex = createSoftShadowMap();
    const textures: THREE.Texture[] = [envRT.texture, iridTex, fresnelTex, beamTex, shadowTex];

    // 1. Stepped Architectural Obsidian Monument Material (roughness ~0.38)
    const obsidianPedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x131318,
      metalness: 0.68,
      roughness: 0.38,
      iridescence: 0.32,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [180, 440],
      clearcoat: 0.65,
      clearcoatRoughness: 0.16,
    });

    // 2. Anisotropic Brushed Platinum Precision Hardware (roughness ~0.11 — >=0.25 delta from obsidian)
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

    // 3. Matte Dark Optical Chamber Barrel Material (roughness ~0.52)
    const lanternHousingMat = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      metalness: 0.52,
      roughness: 0.52,
    });

    // 4. Outer Refractive Dichroic Crystal Palantír Sphere Material
    const palantirCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.03,
      roughness: 0.036,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.34 : 1.0,
      ior: 1.78,
      thickness: 2.15,
      dispersion: isSoftwareGl ? 0 : 0.94,
      attenuationColor: new THREE.Color(0xdbeafe),
      attenuationDistance: 2.6,
      iridescence: 1.0,
      iridescenceIOR: 1.52,
      iridescenceThicknessRange: [185, 620],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.45,
      specularColor: new THREE.Color(0xffffff),
      envMapIntensity: 2.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.025,
      depthWrite: false,
    });

    // 5. Vapor-Deposited Iridescent Astrolabe Ring Material
    const iridescentAstrolabeMat = new THREE.MeshPhysicalMaterial({
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

    // 6. Luminous Fresnel Observation Lens & Crystalline Beacon Heart
    const fresnelLensMat = new THREE.MeshPhysicalMaterial({
      map: fresnelTex,
      color: 0xffffff,
      emissive: new THREE.Color(0xe0f2fe),
      emissiveMap: fresnelTex,
      emissiveIntensity: 1.55,
      metalness: 0.25,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const coreCrystalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0xbae6fd),
      emissiveIntensity: 2.35,
      metalness: 0.1,
      roughness: 0.15,
    });

    // 7. Volumetric Lighthouse Observation Cone Material
    const volumetricBeamMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.44,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const secondaryBeamMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      color: 0xc7d2fe,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    materials.push(
      obsidianPedestalMat,
      brushedPlatinumMat,
      lanternHousingMat,
      palantirCrystalMat,
      iridescentAstrolabeMat,
      fresnelLensMat,
      coreCrystalMat,
      volumetricBeamMat,
      secondaryBeamMat
    );

    // =========================================================================
    // Root Palantír & Observation Beacon Assembly (9 distinct architectural parts)
    // =========================================================================
    const sculptureRoot = new THREE.Group();
    sculptureRoot.position.set(0, 0.08, 0);
    scene.add(sculptureRoot);

    // Part 1: Stepped Architectural Obsidian Pedestal Base
    const pedestalGeo = createPedestalBaseGeometry();
    geometries.push(pedestalGeo);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, obsidianPedestalMat);
    pedestalMesh.renderOrder = 0;
    sculptureRoot.add(pedestalMesh);

    // Part 2: Turned Brushed-Platinum Cradle Collar + Base Trim Ring
    const cradleGeo = createPlatinumCradleGeometry();
    const baseTrimRingGeo = new THREE.TorusGeometry(1.06, 0.024, 20, 84);
    baseTrimRingGeo.rotateX(Math.PI / 2);
    geometries.push(cradleGeo, baseTrimRingGeo);

    const cradleMesh = new THREE.Mesh(cradleGeo, brushedPlatinumMat);
    sculptureRoot.add(cradleMesh);

    const baseTrimRing = new THREE.Mesh(baseTrimRingGeo, brushedPlatinumMat);
    baseTrimRing.position.y = -1.64;
    sculptureRoot.add(baseTrimRing);

    // Part 3: Four Sculpted Platinum Cradle Prongs Embracing the Seeing-Stone
    const prongGeo = createCradleProngGeometry();
    const prongTipGeo = new THREE.SphereGeometry(0.052, 20, 16);
    geometries.push(prongGeo, prongTipGeo);

    for (let i = 0; i < 4; i++) {
      const prongGroup = new THREE.Group();
      prongGroup.rotation.y = (i * Math.PI) / 2 + Math.PI / 4;

      const prongMesh = new THREE.Mesh(prongGeo, brushedPlatinumMat);
      prongGroup.add(prongMesh);

      const prongTip = new THREE.Mesh(prongTipGeo, brushedPlatinumMat);
      prongTip.position.set(1.17, -0.18, 0);
      prongGroup.add(prongTip);

      sculptureRoot.add(prongGroup);
    }

    // Center of the Palantír Seeing-Stone Orb
    const orbCenterY = 0.16;
    const orbGroup = new THREE.Group();
    orbGroup.position.set(0, orbCenterY, 0);
    sculptureRoot.add(orbGroup);

    // Part 4: Internal Gimbaled Lighthouse / Reconnaissance Turret (tracks user gaze)
    const beaconTurretGroup = new THREE.Group();
    orbGroup.add(beaconTurretGroup);

    // 4a. Faceted Crystalline Luminous Core inside the Lantern
    const coreOctaGeo = new THREE.OctahedronGeometry(0.24, 1);
    geometries.push(coreOctaGeo);
    const coreCrystalMesh = new THREE.Mesh(coreOctaGeo, coreCrystalMat);
    coreCrystalMesh.renderOrder = 1;
    beaconTurretGroup.add(coreCrystalMesh);

    // 4b. Precision Obsidian & Platinum Optical Barrel / Lighthouse Drum
    const barrelGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.42, 40, 1, true);
    barrelGeo.rotateX(Math.PI / 2);
    const frontBezelGeo = new THREE.TorusGeometry(0.33, 0.032, 20, 64);
    const rearBezelGeo = new THREE.TorusGeometry(0.35, 0.024, 18, 64);
    geometries.push(barrelGeo, frontBezelGeo, rearBezelGeo);

    const barrelMesh = new THREE.Mesh(barrelGeo, lanternHousingMat);
    barrelMesh.position.z = -0.02;
    barrelMesh.renderOrder = 1;
    beaconTurretGroup.add(barrelMesh);

    const frontBezel = new THREE.Mesh(frontBezelGeo, brushedPlatinumMat);
    frontBezel.position.z = 0.20;
    frontBezel.renderOrder = 2;
    beaconTurretGroup.add(frontBezel);

    const rearBezel = new THREE.Mesh(rearBezelGeo, brushedPlatinumMat);
    rearBezel.position.z = -0.22;
    rearBezel.renderOrder = 1;
    beaconTurretGroup.add(rearBezel);

    // 4c. Anterior Concentric Fresnel Lighthouse Bullseye Lens (faces +Z along gaze)
    const fresnelDiscGeo = new THREE.CircleGeometry(0.315, 48);
    geometries.push(fresnelDiscGeo);
    const fresnelDisc = new THREE.Mesh(fresnelDiscGeo, fresnelLensMat);
    fresnelDisc.position.z = 0.205;
    fresnelDisc.renderOrder = 2;
    beaconTurretGroup.add(fresnelDisc);

    // Rear secondary optical lens cap
    const rearLensDisc = new THREE.Mesh(fresnelDiscGeo, fresnelLensMat);
    rearLensDisc.rotation.y = Math.PI;
    rearLensDisc.scale.setScalar(0.78);
    rearLensDisc.position.z = -0.225;
    rearLensDisc.renderOrder = 1;
    beaconTurretGroup.add(rearLensDisc);

    // Part 5: Volumetric Observation Light Beam Projecting from the Fresnel Lens
    // ConeGeometry default apex is at +height/2 on Y, base at -height/2.
    // Rotate -PI/2 around X so apex sits at z=0.20 and opens outward toward +Z!
    const primaryBeamLength = 1.68;
    const primaryBeamGeo = new THREE.ConeGeometry(0.68, primaryBeamLength, 48, 1, true);
    primaryBeamGeo.translate(0, -primaryBeamLength / 2, 0);
    primaryBeamGeo.rotateX(-Math.PI / 2);
    geometries.push(primaryBeamGeo);

    const primaryBeamMesh = new THREE.Mesh(primaryBeamGeo, volumetricBeamMat);
    primaryBeamMesh.position.z = 0.18;
    primaryBeamMesh.renderOrder = 3;
    beaconTurretGroup.add(primaryBeamMesh);

    // Subtle counter-sweep lighthouse beam (-Z) for authentic 360° beacon depth
    const rearBeamLength = 1.12;
    const rearBeamGeo = new THREE.ConeGeometry(0.42, rearBeamLength, 36, 1, true);
    rearBeamGeo.translate(0, -rearBeamLength / 2, 0);
    rearBeamGeo.rotateX(Math.PI / 2);
    geometries.push(rearBeamGeo);

    const rearBeamMesh = new THREE.Mesh(rearBeamGeo, secondaryBeamMat);
    rearBeamMesh.position.z = -0.20;
    rearBeamMesh.renderOrder = 2;
    beaconTurretGroup.add(rearBeamMesh);

    // Part 6: Internal Floating Calibration Equatorial Ring inside the Orb
    const innerReticleGeo = new THREE.TorusGeometry(0.74, 0.012, 16, 84);
    geometries.push(innerReticleGeo);
    const innerReticleRing = new THREE.Mesh(innerReticleGeo, iridescentAstrolabeMat);
    innerReticleRing.rotation.x = Math.PI * 0.36;
    innerReticleRing.renderOrder = 2;
    orbGroup.add(innerReticleRing);

    // Part 7: The Palantír Seeing-Stone Outer Refractive Dichroic Crystal Sphere
    const palantirSphereGeo = new THREE.SphereGeometry(1.12, 64, 48);
    geometries.push(palantirSphereGeo);
    const palantirSphere = new THREE.Mesh(palantirSphereGeo, palantirCrystalMat);
    palantirSphere.renderOrder = 5;
    orbGroup.add(palantirSphere);

    // Part 8: Precision Brushed-Platinum Meridian Gimbal Ring + Vernier Pivot Nodes
    const meridianGroup = new THREE.Group();
    orbGroup.add(meridianGroup);

    const meridianRingGeo = new THREE.TorusGeometry(1.36, 0.030, 24, 112);
    const pivotNodeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.14, 24);
    pivotNodeGeo.rotateZ(Math.PI / 2);
    geometries.push(meridianRingGeo, pivotNodeGeo);

    const meridianRing = new THREE.Mesh(meridianRingGeo, brushedPlatinumMat);
    meridianRing.renderOrder = 6;
    meridianGroup.add(meridianRing);

    const leftPivot = new THREE.Mesh(pivotNodeGeo, brushedPlatinumMat);
    leftPivot.position.set(-1.36, 0, 0);
    meridianGroup.add(leftPivot);

    const rightPivot = new THREE.Mesh(pivotNodeGeo, brushedPlatinumMat);
    rightPivot.position.set(1.36, 0, 0);
    meridianGroup.add(rightPivot);

    // Crown Zenith Finial atop the Meridian Ring (classic lighthouse / astrolabe spire accent)
    const finialConeGeo = new THREE.ConeGeometry(0.058, 0.18, 24);
    geometries.push(finialConeGeo);
    const crownFinial = new THREE.Mesh(finialConeGeo, brushedPlatinumMat);
    crownFinial.position.set(0, 1.47, 0);
    meridianGroup.add(crownFinial);

    // Part 9: Tilted Iridescent Azimuth Astrolabe Ring with Cardinal Calibration Nodes
    const azimuthGroup = new THREE.Group();
    azimuthGroup.rotation.x = Math.PI * 0.38;
    azimuthGroup.rotation.z = -Math.PI * 0.12;
    orbGroup.add(azimuthGroup);

    const azimuthRingGeo = new THREE.TorusGeometry(1.56, 0.019, 20, 120);
    const tickMarkerGeo = new THREE.SphereGeometry(0.042, 16, 14);
    geometries.push(azimuthRingGeo, tickMarkerGeo);

    const azimuthRing = new THREE.Mesh(azimuthRingGeo, iridescentAstrolabeMat);
    azimuthRing.renderOrder = 6;
    azimuthGroup.add(azimuthRing);

    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const marker = new THREE.Mesh(tickMarkerGeo, brushedPlatinumMat);
      marker.position.set(Math.cos(a) * 1.56, Math.sin(a) * 1.56, 0);
      azimuthGroup.add(marker);
    }

    // Grounded Contact Shadow Plane beneath the Obsidian Pedestal
    const shadowGeo = new THREE.PlaneGeometry(4.4, 4.4);
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

    // Unified Desktop + Mobile Gaze, Beacon Sweep & Tilt Interaction
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
    let isHovered = false;
    let isTouchActive = false;
    let touchActuateUntil = 0;
    let focusFactor = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      cursorX = THREE.MathUtils.clamp((e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1, -1, 1);
      cursorY = THREE.MathUtils.clamp(
        -(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1,
        -1,
        1
      );
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

    const updateScrollTilt = () => {
      if (prefersReducedMotion) {
        scrollYaw = 0;
        scrollPitch = 0;
        return;
      }
      const rect = container.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);
      const centerDelta = (vh * 0.5 - (rect.top + rect.height * 0.5)) / (vh * 0.65);
      const isCompact = window.innerWidth < 1024;
      const yawScale = isCompact ? 0.52 : 0.18;
      const pitchScale = isCompact ? 0.34 : 0.12;
      scrollYaw = THREE.MathUtils.clamp(centerDelta * yawScale, -0.58, 0.58);
      scrollPitch = THREE.MathUtils.clamp(-centerDelta * pitchScale, -0.42, 0.42);
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (prefersReducedMotion || e.gamma === null || e.beta === null) return;
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

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', updateScrollTilt, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
    updateScrollTilt();

    let contextLost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

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
      const aspect = w / h;
      camera.aspect = aspect;
      camera.position.z = baseCameraZ * Math.max(1, 1.24 / aspect);
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
        const activeTargetX = THREE.MathUtils.clamp(cursorX + gyroX + scrollYaw, -1.05, 1.05);
        const activeTargetY = THREE.MathUtils.clamp(cursorY + gyroY + scrollPitch, -1.0, 1.0);
        const shouldFocus =
          isHovered || isTouchActive || performance.now() < touchActuateUntil;

        smoothX = THREE.MathUtils.damp(smoothX, activeTargetX, 5.4, dt);
        smoothY = THREE.MathUtils.damp(smoothY, activeTargetY, 5.4, dt);
        focusFactor = THREE.MathUtils.damp(focusFactor, shouldFocus ? 1 : 0, 5.0, dt);

        const motionScale = prefersReducedMotion ? 0.15 : 1.0;

        // Subtle poise of the entire architectural Palantír monument
        sculptureRoot.rotation.y = smoothX * 0.24 + Math.sin(elapsed * 0.38) * 0.06 * motionScale;
        sculptureRoot.rotation.x = -smoothY * 0.12;

        // Gentle levitation of the crystal sphere & gimbal rings within the platinum cradle
        orbGroup.position.y = orbCenterY + Math.sin(elapsed * 1.15) * 0.035 * motionScale;

        // Internal Lighthouse Observation Turret sweeps smoothly when idle and locks onto cursor/touch
        const idleSweepYaw = Math.sin(elapsed * 0.72) * 0.42 * (1 - focusFactor * 0.65) * motionScale;
        const idleSweepPitch = Math.cos(elapsed * 0.54) * 0.14 * (1 - focusFactor * 0.65) * motionScale;
        beaconTurretGroup.rotation.y = smoothX * 0.62 + idleSweepYaw;
        beaconTurretGroup.rotation.x = -smoothY * 0.46 + idleSweepPitch;

        // Faceted inner crystal heart spins gently & brightens on focus
        coreCrystalMesh.rotation.y = elapsed * 0.85 * motionScale;
        coreCrystalMesh.rotation.z = elapsed * 0.45 * motionScale;
        fresnelLensMat.emissiveIntensity = 1.55 + focusFactor * 0.55;
        volumetricBeamMat.opacity = 0.42 + focusFactor * 0.18;

        // Beam narrows into a sharper reconnaissance lock on hover/touch
        const beamApertureScale = 1.0 - focusFactor * 0.18;
        primaryBeamMesh.scale.set(beamApertureScale, beamApertureScale, 1.0 + focusFactor * 0.12);

        // Calibrated gimbal & astrolabe rings articulate with mechanical precision
        meridianGroup.rotation.y = smoothX * 0.28 - Math.sin(elapsed * 0.48) * 0.12 * motionScale;
        meridianGroup.rotation.x = -smoothY * 0.16;

        azimuthGroup.rotation.z = -Math.PI * 0.12 + elapsed * 0.18 * motionScale + smoothX * 0.22;
        innerReticleRing.rotation.z = -elapsed * 0.26 * motionScale - smoothX * 0.3;

        // Dynamic grazing rim lights sweep thin-film iridescence across the seeing-stone
        coolRim.position.x = -4.6 + smoothX * 2.5;
        coolRim.position.y = 2.6 + smoothY * 1.7;
        pearlRim.position.x = 4.2 - smoothX * 2.3;
        pearlRim.position.y = -2.2 - smoothY * 1.5;
        beaconPointLight.position.x = smoothX * 0.45;
        beaconPointLight.position.y = orbCenterY + smoothY * 0.35;

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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', updateScrollTilt);
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
          <Compass className="w-9 h-9 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={t.raptor.hero.eyeAria}
      className="relative w-full aspect-[5/4] min-h-[340px] max-h-[500px] rounded-2xl border border-zinc-900/90 bg-[#0C0C0E] overflow-hidden select-none touch-pan-y shadow-xl shadow-zinc-950/15"
    >
      <div ref={mountRef} className="w-full h-full touch-pan-y" />
    </div>
  );
}
