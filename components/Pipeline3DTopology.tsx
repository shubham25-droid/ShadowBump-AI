'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Box,
  Eye,
  Compass
} from 'lucide-react';

interface StationTelemetry {
  id: string;
  step: string;
  oneWord: string;
  subword: string;
  statusBadge: string;
  pos: [number, number, number];
  primaryColor: string;
  colorHex: number;
  badgeBg: string;
  isDark?: boolean;
}

const STATIONS: StationTelemetry[] = [
  {
    id: 'inputs',
    step: 'STEP 01',
    oneWord: 'INPUT',
    subword: 'Identical JSON Stream',
    statusBadge: 'DISPATCH',
    pos: [-6.6, 0, 0],
    primaryColor: '#0284c7',
    colorHex: 0x0284c7,
    badgeBg: '#e0f2fe'
  },
  {
    id: 'v3',
    step: 'BASELINE',
    oneWord: 'ZOD v3',
    subword: 'v3.23.8 (Oracle)',
    statusBadge: 'ORACLE ✓',
    pos: [-2.2, 2.3, -1.0],
    primaryColor: '#059669',
    colorHex: 0x059669,
    badgeBg: '#dcfce7'
  },
  {
    id: 'v4',
    step: 'CANDIDATE',
    oneWord: 'ZOD v4',
    subword: 'v4.6.7 (Target)',
    statusBadge: 'REGRESSION ✗',
    pos: [-2.2, -2.3, 1.0],
    primaryColor: '#dc2626',
    colorHex: 0xdc2626,
    badgeBg: '#fee2e2'
  },
  {
    id: 'comparator',
    step: 'STEP 03',
    oneWord: 'DIFF',
    subword: 'AST Comparator Core',
    statusBadge: 'AST MISMATCH',
    pos: [2.1, 0, 0],
    primaryColor: '#0284c7',
    colorHex: 0x0284c7,
    badgeBg: '#e0f2fe'
  },
  {
    id: 'differences',
    step: 'STEP 04',
    oneWord: 'EVIDENCE',
    subword: 'Deterministic Proof',
    statusBadge: 'VERIFIED',
    pos: [5.8, 0, 0],
    primaryColor: '#0ea5e9',
    colorHex: 0x0ea5e9,
    badgeBg: '#e0f2fe'
  },
  {
    id: 'ai',
    step: 'STEP 05',
    oneWord: 'AI FIX',
    subword: 'NVIDIA Nemotron 70B',
    statusBadge: 'SYNTHESIS',
    pos: [9.3, 0, 0],
    primaryColor: '#38bdf8',
    colorHex: 0x38bdf8,
    badgeBg: '#1e293b',
    isDark: true
  }
];

// High-Definition Retina Canvas Texture Generator (1024 x 512)
function createRetinaTileTexture(st: StationTelemetry) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  const isDark = st.isDark;

  // 1. Tile Base with Vertical Gradient Sheen
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  if (isDark) {
    bgGrad.addColorStop(0, '#142638');
    bgGrad.addColorStop(1, '#0b1622');
  } else {
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f9fc');
  }

  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(16, 16, 992, 480, 48);
  ctx.fill();

  // 2. High-Precision Double Border
  ctx.lineWidth = 14;
  ctx.strokeStyle = st.primaryColor;
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = isDark ? '#38bdf833' : '#c8e7f266';
  ctx.stroke();

  // 3. Top Left: Step Badge Pill
  ctx.fillStyle = isDark ? '#1e293b' : `${st.primaryColor}18`;
  ctx.beginPath();
  ctx.roundRect(56, 52, 220, 64, 20);
  ctx.fill();

  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  ctx.fillStyle = st.primaryColor;
  ctx.fillText(st.step, 80, 96);

  // 4. Top Right: Status Outcome Pill
  ctx.fillStyle = st.badgeBg;
  ctx.beginPath();
  ctx.roundRect(680, 52, 280, 64, 20);
  ctx.fill();

  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillStyle = st.primaryColor;
  ctx.textAlign = 'center';
  ctx.fillText(st.statusBadge, 820, 95);
  ctx.textAlign = 'left';

  // 5. BIG BOLD ONE-WORD DISPLAY (Linear / Vercel style)
  ctx.font = '900 128px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#ffffff' : '#142638';
  ctx.fillText(st.oneWord, 56, 276);

  // 6. Subtitle & Version Info
  ctx.font = '600 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#93c5fd' : '#45647e';
  ctx.fillText(st.subword, 60, 370);

  // 7. Micro Hardware Dots at Bottom
  ctx.fillStyle = isDark ? '#38bdf8' : st.primaryColor;
  ctx.beginPath();
  ctx.arc(68, 440, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '500 24px "JetBrains Mono", monospace';
  ctx.fillStyle = isDark ? '#7596af' : '#7596af';
  ctx.fillText('SHADOWBUMP differential-harness', 92, 448);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

interface Pipeline3DTopologyProps {
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export default function Pipeline3DTopology({ selectedNodeId, onSelectNode }: Pipeline3DTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'front' | 'top'>('iso');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 420;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf7fb);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 10, 19);
    camera.lookAt(1.2, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance',
      stencil: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.replaceChildren(renderer.domElement);

    // 2. High-End Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(12, 22, 18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbfe9f7, 0.7);
    fillLight.position.set(-18, 12, -10);
    scene.add(fillLight);

    // Local Accent Lights for v3 (Green) and v4 (Red)
    const v3Light = new THREE.PointLight(0x059669, 1.2, 8);
    v3Light.position.set(-2.2, 3.0, -1.0);
    scene.add(v3Light);

    const v4Light = new THREE.PointLight(0xdc2626, 1.2, 8);
    v4Light.position.set(-2.2, -3.0, 1.0);
    scene.add(v4Light);

    // 3. Subtle Isometric Floor Grid
    const gridHelper = new THREE.GridHelper(38, 38, 0xb8e2ef, 0xd8f1f8);
    gridHelper.position.y = -3.4;
    scene.add(gridHelper);

    // 4. Stations Group
    const stationsGroup = new THREE.Group();
    scene.add(stationsGroup);

    const tileMeshes: { id: string; group: THREE.Group; box: THREE.Mesh; halo: THREE.Mesh; glowRing: THREE.Mesh }[] = [];

    STATIONS.forEach((st) => {
      const group = new THREE.Group();
      group.position.set(...st.pos);

      // A. Lower Metallic Chamfered Pedestal (Tier 1)
      const baseGeo = new THREE.CylinderGeometry(1.55, 1.75, 0.28, 48);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.18,
        metalness: 0.2,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.45;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // B. Upper Gloss Deck (Tier 2) with Soft Neon Halo
      const upperDeckGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.16, 48);
      const upperDeckMat = new THREE.MeshStandardMaterial({
        color: st.isDark ? 0x142638 : 0xffffff,
        roughness: 0.15,
        metalness: 0.15,
      });
      const upperDeckMesh = new THREE.Mesh(upperDeckGeo, upperDeckMat);
      upperDeckMesh.position.y = -0.24;
      upperDeckMesh.receiveShadow = true;
      group.add(upperDeckMesh);

      // C. Colored Laser Accent Ring
      const glowRingGeo = new THREE.TorusGeometry(1.45, 0.05, 16, 64);
      glowRingGeo.rotateX(Math.PI / 2);
      const glowRingMat = new THREE.MeshBasicMaterial({ color: st.colorHex });
      const glowRingMesh = new THREE.Mesh(glowRingGeo, glowRingMat);
      glowRingMesh.position.y = -0.15;
      group.add(glowRingMesh);

      // D. Architectural Desktop Stand Bracket behind tile
      const bracketGeo = new THREE.BoxGeometry(0.5, 0.9, 0.55);
      const bracketMat = new THREE.MeshStandardMaterial({
        color: 0xd8eff6,
        roughness: 0.3,
        metalness: 0.4
      });
      const bracketMesh = new THREE.Mesh(bracketGeo, bracketMat);
      bracketMesh.position.set(0, 0.25, -0.25);
      bracketMesh.rotation.x = -0.22;
      group.add(bracketMesh);

      // E. 3D Architectural Word Tile (Tilted 12.6° backwards towards isometric camera)
      const tileTexture = createRetinaTileTexture(st);
      const tileGeo = new THREE.BoxGeometry(2.55, 1.38, 0.22);

      const frontMat = new THREE.MeshStandardMaterial({
        map: tileTexture,
        roughness: 0.15,
        metalness: 0.08,
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: st.isDark ? 0x0f1d2d : 0xffffff,
        roughness: 0.25,
        metalness: 0.15,
      });

      // Front face (+Z) gets high-res CanvasTexture
      const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
      const boxMesh = new THREE.Mesh(tileGeo, materials);
      boxMesh.position.y = 0.55;
      boxMesh.rotation.x = -0.22; // Perfect perpendicular tilt to isometric camera!
      boxMesh.castShadow = true;
      group.add(boxMesh);

      // F. Dynamic Orbit Selection Ring
      const haloGeo = new THREE.TorusGeometry(1.65, 0.03, 16, 64);
      const haloMat = new THREE.MeshBasicMaterial({ color: st.colorHex, transparent: true, opacity: 0.35 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.55;
      group.add(haloMesh);

      (group as any).stationId = st.id;
      (boxMesh as any).stationId = st.id;
      stationsGroup.add(group);

      tileMeshes.push({
        id: st.id,
        group,
        box: boxMesh,
        halo: haloMesh,
        glowRing: glowRingMesh
      });
    });

    // 5. Connecting Fiber-Optic 3D Pipelines
    const curveInputToV3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.3, 0.55, 0),
      new THREE.Vector3(-3.9, 1.55, -0.5),
      new THREE.Vector3(-3.3, 2.3, -1.0)
    ]);

    const curveInputToV4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.3, 0.55, 0),
      new THREE.Vector3(-3.9, -1.55, 0.5),
      new THREE.Vector3(-3.3, -2.3, 1.0)
    ]);

    const curveV3ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, 2.3, -1.0),
      new THREE.Vector3(0.5, 1.3, -0.4),
      new THREE.Vector3(0.9, 0.55, 0)
    ]);

    const curveV4ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, -2.3, 1.0),
      new THREE.Vector3(0.5, -1.3, 0.4),
      new THREE.Vector3(0.9, 0.55, 0)
    ]);

    const curveCompToDiff = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.3, 0.55, 0),
      new THREE.Vector3(3.9, 0.55, 0),
      new THREE.Vector3(4.6, 0.55, 0)
    ]);

    const curveDiffToAI = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7.0, 0.55, 0),
      new THREE.Vector3(7.6, 0.55, 0),
      new THREE.Vector3(8.1, 0.55, 0)
    ]);

    const allCurves = [
      { curve: curveInputToV3, color: 0x93c5fd },
      { curve: curveInputToV4, color: 0x93c5fd },
      { curve: curveV3ToComp, color: 0x6ee7b7 },
      { curve: curveV4ToComp, color: 0xfca5a5 },
      { curve: curveCompToDiff, color: 0x7dd3fc },
      { curve: curveDiffToAI, color: 0x38bdf8 }
    ];

    allCurves.forEach(({ curve, color }) => {
      // Outer glass pipeline sleeve
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.06, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.15,
        transparent: true,
        opacity: 0.88
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
    });

    // 6. Traveling Luminous Energy Pulses (Dual-Spheres with trailing effect)
    const packets = allCurves.map(({ curve, color }) => {
      const leadGeo = new THREE.SphereGeometry(0.19, 16, 16);
      const leadMat = new THREE.MeshBasicMaterial({ color });
      const leadMesh = new THREE.Mesh(leadGeo, leadMat);
      scene.add(leadMesh);

      const trailGeo = new THREE.SphereGeometry(0.11, 12, 12);
      const trailMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
      const trailMesh = new THREE.Mesh(trailGeo, trailMat);
      scene.add(trailMesh);

      return { leadMesh, trailMesh, curve, progress: Math.random() };
    });

    // 7. Raycasting & Interactive Clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stationsGroup.children, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        while (current && !(current as any).stationId) {
          current = current.parent;
        }
        if (current && (current as any).stationId) {
          onSelectNode((current as any).stationId);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);

    // Mouse drag rotation handling (clamped safely)
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.005;
        targetRotationY = Math.max(-0.45, Math.min(0.45, targetRotationY));
        prevMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth rotation damping
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      stationsGroup.rotation.y = currentRotationY;

      // Animate selection halo & float
      tileMeshes.forEach(({ id, box, halo, glowRing }) => {
        const isSelected = id === selectedNodeId;

        if (isSelected) {
          halo.rotation.z += delta * 1.5;
          halo.scale.setScalar(1.0 + Math.sin(time * 5) * 0.08);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.95;
          glowRing.scale.setScalar(1.0 + Math.sin(time * 4) * 0.04);
          box.position.y = 0.55 + Math.sin(time * 3) * 0.04;
        } else {
          halo.scale.setScalar(1.0);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.3;
          glowRing.scale.setScalar(1.0);
          box.position.y = 0.55;
        }
      });

      // Animate Traveling Dual-Particle Data Energy
      packets.forEach((packet) => {
        packet.progress = (packet.progress + delta * 0.32) % 1.0;
        const leadPoint = packet.curve.getPointAt(packet.progress);
        packet.leadMesh.position.copy(leadPoint);

        const trailProgress = Math.max(0, packet.progress - 0.04);
        const trailPoint = packet.curve.getPointAt(trailProgress);
        packet.trailMesh.position.copy(trailPoint);
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('mousedown', onMouseDown);
      renderer.dispose();
    };
  }, [selectedNodeId, onSelectNode, cameraPreset]);

  return (
    <div className="relative rounded-card border border-line bg-gradient-to-b from-white to-[#EAF7FB]/40 overflow-hidden shadow-panel">
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-[420px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Bar with Stage Pills */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-line shadow-card text-[11px] font-mono text-ink-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <strong className="font-heading font-bold text-ink-primary">Architectural Pipeline:</strong>
          <span className="text-ink-secondary">Click any 3D station to inspect evidence</span>
        </div>

        {/* Node Buttons Bar */}
        <div className="pointer-events-auto flex items-center space-x-1">
          {STATIONS.map((st) => {
            const isSelected = st.id === selectedNodeId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectNode(st.id)}
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-all border ${
                  isSelected
                    ? 'border-accent bg-accent text-white font-bold shadow-subtle scale-105'
                    : 'border-line bg-white/90 text-ink-secondary hover:text-ink-primary hover:bg-white'
                }`}
              >
                {st.oneWord}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Pipeline Legend */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-ink-secondary pointer-events-none">
        <div className="flex items-center space-x-2 bg-white/95 px-3 py-1 rounded-full border border-line backdrop-blur-sm pointer-events-auto shadow-card">
          <span className="font-bold text-accent">INPUT</span>
          <span className="text-ink-muted">→</span>
          <span className="font-bold text-status-success">ZOD v3</span>
          <span className="text-ink-muted">&amp;</span>
          <span className="font-bold text-status-error">ZOD v4</span>
          <span className="text-ink-muted">→</span>
          <span className="font-bold text-accent">DIFF</span>
          <span className="text-ink-muted">→</span>
          <span className="font-bold text-ink-primary">EVIDENCE</span>
          <span className="text-ink-muted">→</span>
          <span className="font-bold text-ink-primary">AI FIX</span>
        </div>

        <span className="bg-white/95 px-3 py-1 rounded-full border border-line backdrop-blur-sm shadow-card hidden sm:inline-block">
          Drag horizontally to rotate 3D view
        </span>
      </div>
    </div>
  );
}
