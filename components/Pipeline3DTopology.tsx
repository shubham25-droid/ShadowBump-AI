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
  Box
} from 'lucide-react';

interface StationTelemetry {
  id: string;
  step: string;
  oneWord: string;
  subword: string;
  pos: [number, number, number];
  primaryColor: string;
  colorHex: number;
  bgHex: string;
  borderHex: string;
  textColor: string;
}

const STATIONS: StationTelemetry[] = [
  {
    id: 'inputs',
    step: 'STEP 01',
    oneWord: 'INPUT',
    subword: 'Identical JSON Vectors',
    pos: [-6.4, 0, 0],
    primaryColor: '#0284c7',
    colorHex: 0x0284c7,
    bgHex: '#ffffff',
    borderHex: '#0284c7',
    textColor: '#142638'
  },
  {
    id: 'v3',
    step: 'BASELINE',
    oneWord: 'ZOD v3',
    subword: 'v3.23.8 (Oracle)',
    pos: [-2.1, 2.2, -1.0],
    primaryColor: '#059669',
    colorHex: 0x059669,
    bgHex: '#ffffff',
    borderHex: '#059669',
    textColor: '#142638'
  },
  {
    id: 'v4',
    step: 'CANDIDATE',
    oneWord: 'ZOD v4',
    subword: 'v4.6.7 (Target)',
    pos: [-2.1, -2.2, 1.0],
    primaryColor: '#dc2626',
    colorHex: 0xdc2626,
    bgHex: '#ffffff',
    borderHex: '#dc2626',
    textColor: '#142638'
  },
  {
    id: 'comparator',
    step: 'STEP 03',
    oneWord: 'DIFF',
    subword: 'AST Comparator Core',
    pos: [2.1, 0, 0],
    primaryColor: '#0284c7',
    colorHex: 0x0284c7,
    bgHex: '#ffffff',
    borderHex: '#0284c7',
    textColor: '#142638'
  },
  {
    id: 'differences',
    step: 'STEP 04',
    oneWord: 'EVIDENCE',
    subword: 'Deterministic Proof',
    pos: [5.6, 0, 0],
    primaryColor: '#0ea5e9',
    colorHex: 0x0ea5e9,
    bgHex: '#ffffff',
    borderHex: '#0ea5e9',
    textColor: '#142638'
  },
  {
    id: 'ai',
    step: 'STEP 05',
    oneWord: 'AI FIX',
    subword: 'NVIDIA Nemotron 70B',
    pos: [9.0, 0, 0],
    primaryColor: '#142638',
    colorHex: 0x142638,
    bgHex: '#142638',
    borderHex: '#0284c7',
    textColor: '#ffffff'
  }
];

function createTileTexture(st: StationTelemetry) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const isDark = st.id === 'ai';

  // 1. Tile Base Canvas
  ctx.fillStyle = isDark ? '#142638' : '#ffffff';
  ctx.beginPath();
  ctx.roundRect(12, 12, 488, 232, 28);
  ctx.fill();

  // 2. Crisp Border
  ctx.lineWidth = 10;
  ctx.strokeStyle = st.primaryColor;
  ctx.stroke();

  // 3. Step Badge Pill
  ctx.fillStyle = isDark ? '#0284c7' : `${st.primaryColor}18`;
  ctx.beginPath();
  ctx.roundRect(36, 32, 140, 36, 10);
  ctx.fill();

  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillStyle = isDark ? '#ffffff' : st.primaryColor;
  ctx.fillText(st.step, 48, 57);

  // 4. BIG BOLD ONE WORD
  ctx.font = '800 68px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#ffffff' : '#142638';
  ctx.fillText(st.oneWord, 36, 142);

  // 5. Subtitle Tag
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#93c5fd' : '#45647e';
  ctx.fillText(st.subword, 38, 195);

  // 6. Active status indicator dot
  ctx.beginPath();
  ctx.arc(456, 50, 10, 0, Math.PI * 2);
  ctx.fillStyle = st.primaryColor;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

interface Pipeline3DTopologyProps {
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export default function Pipeline3DTopology({ selectedNodeId, onSelectNode }: Pipeline3DTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf7fb);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 9.5, 18.5);
    camera.lookAt(1.0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(10, 20, 16);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xbfe9f7, 0.6);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 3. Isometric Floor Grid
    const gridHelper = new THREE.GridHelper(36, 36, 0xb8e2ef, 0xd4f0f8);
    gridHelper.position.y = -3.2;
    scene.add(gridHelper);

    // 4. Stations Group (3D Server Blade Tiles with One-Word Labels)
    const stationsGroup = new THREE.Group();
    scene.add(stationsGroup);

    const tileMeshes: { id: string; group: THREE.Group; box: THREE.Mesh; halo: THREE.Mesh }[] = [];

    STATIONS.forEach((st) => {
      const group = new THREE.Group();
      group.position.set(...st.pos);

      // A. Ground Shadow Pedestal
      const baseGeo = new THREE.CylinderGeometry(1.35, 1.5, 0.35, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.4;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // B. Beveled Colored Activity Ring
      const rimGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
      rimGeo.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshBasicMaterial({ color: st.colorHex });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.position.y = -0.2;
      group.add(rimMesh);

      // C. 3D Architectural Tile Block (with CanvasTexture printed on front)
      const tileTexture = createTileTexture(st);
      const tileGeo = new THREE.BoxGeometry(2.3, 1.25, 0.22);

      const frontMat = new THREE.MeshStandardMaterial({
        map: tileTexture,
        roughness: 0.2,
        metalness: 0.1,
      });
      const sideMat = new THREE.MeshStandardMaterial({
        color: st.id === 'ai' ? 0x0f1d2d : 0xffffff,
        roughness: 0.3,
        metalness: 0.15,
      });

      // Assign texture to front face (+Z), side color to other 5 faces
      const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
      const boxMesh = new THREE.Mesh(tileGeo, materials);
      boxMesh.position.y = 0.5;
      boxMesh.castShadow = true;
      group.add(boxMesh);

      // D. Selection Halo Indicator
      const haloGeo = new THREE.TorusGeometry(1.5, 0.03, 12, 48);
      const haloMat = new THREE.MeshBasicMaterial({ color: st.colorHex, transparent: true, opacity: 0.4 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.5;
      group.add(haloMesh);

      (group as any).stationId = st.id;
      (boxMesh as any).stationId = st.id;
      stationsGroup.add(group);

      tileMeshes.push({
        id: st.id,
        group,
        box: boxMesh,
        halo: haloMesh,
      });
    });

    // 5. Connecting 3D Pipelines
    const curveInputToV3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0.5, 0),
      new THREE.Vector3(-3.8, 1.5, -0.5),
      new THREE.Vector3(-3.2, 2.2, -1.0)
    ]);

    const curveInputToV4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0.5, 0),
      new THREE.Vector3(-3.8, -1.5, 0.5),
      new THREE.Vector3(-3.2, -2.2, 1.0)
    ]);

    const curveV3ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.0, 2.2, -1.0),
      new THREE.Vector3(0.4, 1.2, -0.4),
      new THREE.Vector3(0.9, 0.5, 0)
    ]);

    const curveV4ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.0, -2.2, 1.0),
      new THREE.Vector3(0.4, -1.2, 0.4),
      new THREE.Vector3(0.9, 0.5, 0)
    ]);

    const curveCompToDiff = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.2, 0.5, 0),
      new THREE.Vector3(3.8, 0.5, 0),
      new THREE.Vector3(4.4, 0.5, 0)
    ]);

    const curveDiffToAI = new THREE.CatmullRomCurve3([
      new THREE.Vector3(6.8, 0.5, 0),
      new THREE.Vector3(7.3, 0.5, 0),
      new THREE.Vector3(7.8, 0.5, 0)
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
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.055, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
    });

    // 6. Traveling Data Packets
    const packets = allCurves.map(({ curve, color }) => {
      const geo = new THREE.SphereGeometry(0.18, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return { mesh, curve, progress: Math.random() };
    });

    // 7. Raycasting & Click Interactivity
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

    // Mouse drag rotation handling (safely clamped)
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
        targetRotationY = Math.max(-0.4, Math.min(0.4, targetRotationY));
        prevMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      stationsGroup.rotation.y = currentRotationY;

      // Pulse selected tile halo
      tileMeshes.forEach(({ id, box, halo }) => {
        const isSelected = id === selectedNodeId;

        if (isSelected) {
          halo.rotation.z += delta * 1.5;
          halo.scale.setScalar(1.0 + Math.sin(time * 5) * 0.08);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.95;
          box.position.y = 0.5 + Math.sin(time * 3) * 0.05;
        } else {
          halo.scale.setScalar(1.0);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.35;
          box.position.y = 0.5;
        }
      });

      // Animate Traveling Data Packets
      packets.forEach((packet) => {
        packet.progress = (packet.progress + delta * 0.35) % 1.0;
        const point = packet.curve.getPointAt(packet.progress);
        packet.mesh.position.copy(point);
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
  }, [selectedNodeId, onSelectNode]);

  return (
    <div className="relative rounded-card border border-line bg-card/90 overflow-hidden shadow-panel">
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-[400px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Banner Explaining the 3D Meaning */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-line shadow-card text-[11px] font-mono text-ink-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <strong className="font-heading font-bold text-ink-primary">3D Execution Pipeline:</strong>
          <span className="text-ink-secondary">Click any 3D node to inspect technical details</span>
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
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all border ${
                  isSelected
                    ? 'border-accent bg-accent text-white font-bold shadow-subtle'
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
        <div className="flex items-center space-x-2 bg-white/90 px-3 py-1 rounded-full border border-line backdrop-blur-sm pointer-events-auto">
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

        <span className="bg-white/90 px-2.5 py-1 rounded-full border border-line backdrop-blur-sm hidden sm:inline-block">
          Drag horizontally to rotate 3D angle
        </span>
      </div>
    </div>
  );
}
