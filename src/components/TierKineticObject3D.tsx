import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Shield } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export type ServiceTierId = 'argos' | 'atlas';

interface TierKineticObject3DProps {
  activeTier: ServiceTierId;
}

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

function buildShieldPath(scale: number): THREE.Shape {
  const s = scale;
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.32 * s);
  shape.quadraticCurveTo(0.55 * s, 1.32 * s, 1.02 * s, 1.08 * s);
  shape.lineTo(1.02 * s, 0.22 * s);
  shape.bezierCurveTo(1.02 * s, -0.52 * s, 0.54 * s, -1.06 * s, 0, -1.42 * s);
  shape.bezierCurveTo(-0.54 * s, -1.06 * s, -1.02 * s, -0.52 * s, -1.02 * s, 0.22 * s);
  shape.lineTo(-1.02 * s, 1.08 * s);
  shape.quadraticCurveTo(-0.55 * s, 1.32 * s, 0, 1.32 * s);
  return shape;
}

function buildShieldHolePath(scale: number): THREE.Path {
  const s = scale;
  const path = new THREE.Path();
  path.moveTo(0, 1.32 * s);
  path.quadraticCurveTo(0.55 * s, 1.32 * s, 1.02 * s, 1.08 * s);
  path.lineTo(1.02 * s, 0.22 * s);
  path.bezierCurveTo(1.02 * s, -0.52 * s, 0.54 * s, -1.06 * s, 0, -1.42 * s);
  path.bezierCurveTo(-0.54 * s, -1.06 * s, -1.02 * s, -0.52 * s, -1.02 * s, 0.22 * s);
  path.lineTo(-1.02 * s, 1.08 * s);
  path.quadraticCurveTo(-0.55 * s, 1.32 * s, 0, 1.32 * s);
  return path;
}

function createShieldRimGeometry(): THREE.ExtrudeGeometry {
  const outer = buildShieldPath(0.9);
  const inner = buildShieldHolePath(0.76);
  outer.holes.push(inner);

  const geo = new THREE.ExtrudeGeometry(outer, {
    depth: 0.045,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function createKeyholeEmblemGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const r = 0.095;
  const cy = 0.075;
  shape.absarc(0, cy, r, -Math.PI * 0.3, Math.PI * 1.3, false);
  shape.lineTo(-0.075, -0.17);
  shape.quadraticCurveTo(0, -0.19, 0.075, -0.17);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04,
    curveSegments: 24,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

function createIridescenceThicknessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, size, size, 0);
    grad.addColorStop(0, 'rgb(0, 45, 0)');
    grad.addColorStop(0.38, 'rgb(0, 165, 0)');
    grad.addColorStop(0.72, 'rgb(0, 245, 0)');
    grad.addColorStop(1, 'rgb(0, 85, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const radial = ctx.createRadialGradient(
      size * 0.5,
      size * 0.36,
      size * 0.04,
      size * 0.5,
      size * 0.5,
      size * 0.62
    );
    radial.addColorStop(0, 'rgba(0, 255, 0, 0.45)');
    radial.addColorStop(0.55, 'rgba(0, 120, 0, 0.22)');
    radial.addColorStop(1, 'rgba(0, 25, 0, 0.45)');
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
    const g = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
    g.addColorStop(0.5, 'rgba(0, 0, 0, 0.24)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function TierKineticObject3D({ activeTier }: TierKineticObject3DProps) {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tierRef = useRef<ServiceTierId>(activeTier);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    tierRef.current = activeTier;
  }, [activeTier]);

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

    const w0 = container.clientWidth || 520;
    const h0 = container.clientHeight || 340;
    renderer.setSize(w0, h0);
    renderer.domElement.className = 'block w-full h-full outline-none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const darkBg = 0x0c0c0e;
    scene.background = new THREE.Color(darkBg);
    scene.fog = new THREE.FogExp2(darkBg, 0.052);

    const baseCameraZ = 7.15;
    const initialAspect = w0 / Math.max(h0, 1);
    const camera = new THREE.PerspectiveCamera(35, initialAspect, 0.1, 50);
    camera.position.set(0, 0.04, baseCameraZ * Math.max(1, 1.32 / initialAspect));
    camera.lookAt(0, 0.0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xf8fafc, 0x18181b, 0.9);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfffcf5, 2.55);
    key.position.set(3.8, 4.8, 4.6);
    scene.add(key);

    const coolRim = new THREE.DirectionalLight(0xdbeafe, 2.05);
    coolRim.position.set(-4.4, 2.4, -3.6);
    scene.add(coolRim);

    const pearlRim = new THREE.DirectionalLight(0xf3e8ff, 1.55);
    pearlRim.position.set(4.0, -2.2, -3.4);
    scene.add(pearlRim);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const iridTex = createIridescenceThicknessMap();

    // 1. Primary Dichroic Iridescent Crystal Shield Body
    const dichroicShieldBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.05,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.54 : 1.0,
      ior: 1.72,
      thickness: 1.65,
      dispersion: isSoftwareGl ? 0 : 0.88,
      attenuationColor: new THREE.Color(0xdbeafe),
      attenuationDistance: 2.35,
      iridescence: 1.0,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [155, 620],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.4,
      specularColor: new THREE.Color(0xffffff),
      envMapIntensity: 2.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      depthWrite: false,
    });

    // 2. Floating Secondary Prismatic Glass Layer (expands in Z on hover / Atlas)
    const dichroicFrontPlateMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.03,
      roughness: 0.04,
      transmission: isSoftwareGl ? 0 : 0.94,
      transparent: true,
      opacity: isSoftwareGl ? 0.44 : 1.0,
      ior: 1.64,
      thickness: 0.85,
      dispersion: isSoftwareGl ? 0 : 0.8,
      iridescence: 1.0,
      iridescenceIOR: 1.54,
      iridescenceThicknessRange: [250, 560],
      iridescenceThicknessMap: iridTex,
      specularIntensity: 1.35,
      envMapIntensity: 2.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    });

    // 3. Inner Sculpted Obsidian Core (refracted through the crystal shield)
    const darkObsidian = new THREE.MeshPhysicalMaterial({
      color: 0x121217,
      metalness: 0.85,
      roughness: 0.28,
      iridescence: 0.4,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [180, 480],
      clearcoat: 0.7,
      clearcoatRoughness: 0.14,
    });

    // 4. Brushed Platinum Hardware
    const brushedPlatinum = new THREE.MeshPhysicalMaterial({
      color: 0xf1f1f4,
      metalness: 0.95,
      roughness: 0.12,
      anisotropy: 0.78,
      iridescence: 0.3,
      iridescenceIOR: 1.36,
      iridescenceThicknessRange: [200, 460],
      clearcoat: 0.35,
    });

    // 5. Vapor-Deposited Iridescent Wing Arcs
    const iridescentWingMat = new THREE.MeshPhysicalMaterial({
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
      dichroicShieldBodyMat,
      dichroicFrontPlateMat,
      darkObsidian,
      brushedPlatinum,
      iridescentWingMat
    );

    // Composite Multi-Layered Dichroic Cybersecurity Shield Group
    const shieldRoot = new THREE.Group();
    shieldRoot.position.set(0, 0.02, 0);
    scene.add(shieldRoot);

    // 0. Inner Sculpted Obsidian Core Crest (refracted inside the crystal shield)
    const innerCoreGeo = new THREE.ExtrudeGeometry(buildShieldPath(0.7), {
      depth: 0.14,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4,
    });
    innerCoreGeo.center();
    geometries.push(innerCoreGeo);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, darkObsidian);
    innerCoreMesh.position.z = -0.05;
    innerCoreMesh.renderOrder = 0;
    shieldRoot.add(innerCoreMesh);

    // 1. Brushed Platinum Inner Crest Rim (sandwiched inside crystal layers)
    const rimGeo = createShieldRimGeometry();
    geometries.push(rimGeo);
    const frontRim = new THREE.Mesh(rimGeo, brushedPlatinum);
    frontRim.position.z = 0.06;
    frontRim.renderOrder = 1;
    shieldRoot.add(frontRim);

    // 2. Primary Sculpted Dichroic Iridescent Crystal Shield Body
    const mainShieldGeo = new THREE.ExtrudeGeometry(buildShieldPath(1.0), {
      depth: 0.24,
      curveSegments: 36,
      bevelEnabled: true,
      bevelThickness: 0.085,
      bevelSize: 0.075,
      bevelSegments: 6,
    });
    mainShieldGeo.center();
    geometries.push(mainShieldGeo);
    const mainShield = new THREE.Mesh(mainShieldGeo, dichroicShieldBodyMat);
    mainShield.position.z = 0.05;
    mainShield.renderOrder = 2;
    shieldRoot.add(mainShield);

    // 3. Floating Front Prismatic Glass Shield Layer (separates smoothly on hover / Atlas)
    const glassPlateGeo = new THREE.ExtrudeGeometry(buildShieldPath(0.76), {
      depth: 0.05,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.016,
      bevelSegments: 4,
    });
    glassPlateGeo.center();
    geometries.push(glassPlateGeo);
    const glassShield = new THREE.Mesh(glassPlateGeo, dichroicFrontPlateMat);
    glassShield.position.z = 0.26;
    glassShield.renderOrder = 3;
    shieldRoot.add(glassShield);

    // 4. Central Medallion + Keyhole Emblem
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, 0.06, 0.32);

    const discGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.05, 48);
    discGeo.rotateX(Math.PI / 2);
    geometries.push(discGeo);
    const discMesh = new THREE.Mesh(discGeo, brushedPlatinum);
    discMesh.renderOrder = 4;
    medallionGroup.add(discMesh);

    const keyholeGeo = createKeyholeEmblemGeometry();
    geometries.push(keyholeGeo);
    const keyholeMesh = new THREE.Mesh(keyholeGeo, darkObsidian);
    keyholeMesh.position.z = 0.025;
    keyholeMesh.renderOrder = 5;
    medallionGroup.add(keyholeMesh);

    shieldRoot.add(medallionGroup);

    // 5. Flanking Iridescent Protective Wing Arcs
    const wingArcGeo = new THREE.TorusGeometry(1.58, 0.026, 20, 72, Math.PI * 0.56);
    geometries.push(wingArcGeo);

    const leftWing = new THREE.Mesh(wingArcGeo, iridescentWingMat);
    leftWing.rotation.z = Math.PI * 0.72;
    shieldRoot.add(leftWing);

    const rightWing = new THREE.Mesh(wingArcGeo, iridescentWingMat);
    rightWing.rotation.z = -Math.PI * 0.28;
    shieldRoot.add(rightWing);

    // 6. Contact Shadow Plane
    const shadowTex = createSoftShadowMap();
    const shadowGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    geometries.push(shadowGeo);
    materials.push(shadowMat);
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.82;
    scene.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let cursorX = 0;
    let cursorY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let isHovered = false;
    let hoverFactor = 0;
    let atlasMorph = tierRef.current === 'atlas' ? 1 : 0;

    const onPointerMove = (e: PointerEvent) => {
      cursorX = THREE.MathUtils.clamp((e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1, -1, 1);
      cursorY = THREE.MathUtils.clamp(-(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1, -1, 1);
    };
    const onEnter = () => {
      isHovered = true;
    };
    const onLeave = () => {
      isHovered = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);

    let isVisible = false;
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
      camera.position.z = baseCameraZ * Math.max(1, 1.32 / aspect);
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

      if (isVisible) {
        smoothX = THREE.MathUtils.damp(smoothX, cursorX, 5.2, dt);
        smoothY = THREE.MathUtils.damp(smoothY, cursorY, 5.2, dt);
        hoverFactor = THREE.MathUtils.damp(hoverFactor, isHovered ? 1 : 0, 5.0, dt);

        const targetMorph = tierRef.current === 'atlas' ? 1 : 0;
        atlasMorph = THREE.MathUtils.damp(atlasMorph, targetMorph, 4.8, dt);

        const mScale = prefersReducedMotion ? 0.15 : 1.0;

        shieldRoot.position.y = 0.02 + Math.sin(elapsed * 1.15) * 0.045 * mScale;
        shieldRoot.rotation.y = smoothX * 0.56 + Math.sin(elapsed * 0.4) * 0.06 * mScale;
        shieldRoot.rotation.x = -smoothY * 0.34;
        shieldRoot.rotation.z = -smoothX * 0.05;

        // Layered dichroic depth expansion on mouse hover or Atlas tier
        const depthBoost = hoverFactor * 0.15 + atlasMorph * 0.13;
        glassShield.position.z = 0.26 + depthBoost;
        medallionGroup.position.z = 0.32 + depthBoost * 1.25;

        const wingSpread = 0.08 + atlasMorph * 0.16 + hoverFactor * 0.12;
        leftWing.position.x = -wingSpread;
        rightWing.position.x = wingSpread;
        leftWing.rotation.y = smoothX * 0.22;
        rightWing.rotation.y = smoothX * 0.22;

        // Sweep grazing lights across beveled crystal faces for organic iridescence shifts
        coolRim.position.x = -4.4 + smoothX * 2.6;
        coolRim.position.y = 2.4 + smoothY * 1.8;
        pearlRim.position.x = 4.0 - smoothX * 2.2;
        pearlRim.position.y = -2.2 - smoothY * 1.6;

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
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      io.disconnect();
      ro.disconnect();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      iridTex.dispose();
      shadowTex.dispose();
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallback) {
    return (
      <div className="w-full aspect-[16/10] min-h-[250px] max-h-[360px] rounded-2xl bg-[#0C0C0E] border border-zinc-800 flex items-center justify-center p-6 text-zinc-300">
        <Shield className="w-8 h-8 text-zinc-300" />
      </div>
    );
  }

  return (
    <div
      aria-label={t.services.shieldAria}
      className="relative w-full aspect-[16/10] min-h-[250px] max-h-[360px] rounded-2xl bg-[#0C0C0E] border border-zinc-800 overflow-hidden select-none"
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
