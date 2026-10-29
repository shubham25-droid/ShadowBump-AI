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
  Code
} from 'lucide-react';

interface StationTelemetry {
  id: string;
  stepNumber: string;
  name: string;
  versionTag: string;
  pos: [number, number, number];
  color: number;
  hex: string;
  badgeStyle: string;
  tagline: string;
  codeSnippet: string;
  verdict: string;
}

const STATIONS: StationTelemetry[] = [
  {
    id: 'inputs',
    stepNumber: '01',
    name: 'Input Dispatcher',
    versionTag: 'Identical JSON Stream',
    pos: [-6.8, 0, 0],
    color: 0x0284c7,
    hex: '#0284c7',
    badgeStyle: 'border-accent text-accent bg-card',
    tagline: 'Feeds identical input to both versions',
    codeSnippet: '{"age": 28, "email": "dev@co"}',
    verdict: 'Dispatched to twin runtimes'
  },
  {
    id: 'v3',
    stepNumber: '02A',
    name: 'Baseline Runtime',
    versionTag: 'zod@3.23.8 (Oracle)',
    pos: [-2.4, 2.5, -1.2],
    color: 0x059669,
    hex: '#059669',
    badgeStyle: 'border-status-success text-status-success bg-[#E6F7F3]',
    tagline: 'Ground-truth established outcome',
    codeSnippet: 'error: "Username is required"',
    verdict: 'error.errors: Array(1) ✓'
  },
  {
    id: 'v4',
    stepNumber: '02B',
    name: 'Candidate Runtime',
    versionTag: 'zod@4.6.7 (Target)',
    pos: [-2.4, -2.5, 1.2],
    color: 0xdc2626,
    hex: '#dc2626',
    badgeStyle: 'border-status-error text-status-error bg-[#FEE2E2]',
    tagline: 'Altered behavioral response',
    codeSnippet: 'error: "Invalid input: expected..."',
    verdict: 'error.errors: undefined ✗'
  },
  {
    id: 'comparator',
    stepNumber: '03',
    name: 'AST Comparison Core',
    versionTag: 'Deterministic Diff',
    pos: [1.8, 0, 0],
    color: 0x0284c7,
    hex: '#0284c7',
    badgeStyle: 'border-accent text-accent bg-card',
    tagline: 'Deep structural equality assertions',
    codeSnippet: 'diff: custom_msg_dropped',
    verdict: 'POTENTIAL REGRESSION'
  },
  {
    id: 'differences',
    stepNumber: '04',
    name: 'Observed Differences',
    versionTag: 'Empirical Evidence',
    pos: [5.4, 0, 0],
    color: 0x0ea5e9,
    hex: '#0ea5e9',
    badgeStyle: 'border-line text-ink-primary bg-card',
    tagline: 'Evidence package with reproduction',
    codeSnippet: 'corpus: 3 regressions / 2 matches',
    verdict: 'Evidence Locked'
  },
  {
    id: 'ai',
    stepNumber: '05',
    name: 'NVIDIA Nemotron AI',
    versionTag: 'Nebius Token Factory',
    pos: [9.0, 0, 0],
    color: 0x142638,
    hex: '#142638',
    badgeStyle: 'border-accent text-white bg-accent',
    tagline: 'Evidence-grounded root-cause analysis',
    codeSnippet: 'fix: error.issues.map(...)',
    verdict: 'Migration Diff Ready'
  }
];

interface ScreenPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

interface Pipeline3DTopologyProps {
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export default function Pipeline3DTopology({ selectedNodeId, onSelectNode }: Pipeline3DTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf7fb);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 12, 21);
    camera.lookAt(1.0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 22, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xbfe9f7, 0.6);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 3. Subtle Isometric Floor Grid
    const gridHelper = new THREE.GridHelper(36, 36, 0xb8e2ef, 0xd4f0f8);
    gridHelper.position.y = -3.2;
    scene.add(gridHelper);

    // 4. Stations Group
    const stationsGroup = new THREE.Group();
    scene.add(stationsGroup);

    const stationMeshes: { id: string; group: THREE.Group; halo: THREE.Mesh; core: THREE.Mesh }[] = [];

    STATIONS.forEach((st) => {
      const group = new THREE.Group();
      group.position.set(...st.pos);

      // A. Layered Pedestal (Glossy White Base)
      const baseGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.45, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.22;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // B. Beveled Colored Status Rim
      const rimGeo = new THREE.TorusGeometry(1.15, 0.055, 16, 64);
      rimGeo.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshBasicMaterial({ color: st.color });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.position.y = 0.02;
      group.add(rimMesh);

      // C. Central Server / Processing Module Shape
      let coreMesh: THREE.Mesh;
      if (st.id === 'inputs') {
        const geo = new THREE.SphereGeometry(0.55, 24, 24);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.3 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.7;
      } else if (st.id === 'v3') {
        // Server Container Pod (Green)
        const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const mat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.7;
      } else if (st.id === 'v4') {
        // Server Container Pod (Red)
        const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const mat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.7;
      } else if (st.id === 'comparator') {
        // Dual-Lens AST Comparator Prism
        const geo = new THREE.OctahedronGeometry(0.72, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.4 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.8;
      } else if (st.id === 'differences') {
        // Evidence Vault Block
        const geo = new THREE.CylinderGeometry(0.6, 0.6, 0.85, 6);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.7;
      } else {
        // NVIDIA Neural Core
        const geo = new THREE.IcosahedronGeometry(0.75, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x142638, roughness: 0.25, metalness: 0.5 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.8;
      }

      coreMesh.castShadow = true;
      group.add(coreMesh);

      // D. Floating Vertical Pin Connector pointing up to HUD
      const pinGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8);
      const pinMat = new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.5 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.y = 1.4;
      group.add(pinMesh);

      // E. Rotating Gyroscope Halo
      const haloGeo = new THREE.TorusGeometry(1.3, 0.025, 12, 48);
      const haloMat = new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.6 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.7;
      group.add(haloMesh);

      (group as any).stationId = st.id;
      (coreMesh as any).stationId = st.id;
      stationsGroup.add(group);

      stationMeshes.push({
        id: st.id,
        group,
        halo: haloMesh,
        core: coreMesh
      });
    });

    // 5. 3D Connecting Pipelines
    const curveInputToV3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.8, 0.7, 0),
      new THREE.Vector3(-4.8, 1.6, -0.6),
      new THREE.Vector3(-2.4, 3.2, -1.2)
    ]);

    const curveInputToV4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.8, 0.7, 0),
      new THREE.Vector3(-4.8, -1.6, 0.6),
      new THREE.Vector3(-2.4, -1.8, 1.2)
    ]);

    const curveV3ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 3.2, -1.2),
      new THREE.Vector3(-0.2, 1.4, -0.6),
      new THREE.Vector3(1.8, 0.8, 0)
    ]);

    const curveV4ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, -1.8, 1.2),
      new THREE.Vector3(-0.2, -1.4, 0.6),
      new THREE.Vector3(1.8, 0.8, 0)
    ]);

    const curveCompToDiff = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.8, 0.8, 0),
      new THREE.Vector3(3.6, 0.75, 0),
      new THREE.Vector3(5.4, 0.7, 0)
    ]);

    const curveDiffToAI = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.4, 0.7, 0),
      new THREE.Vector3(7.2, 0.8, 0),
      new THREE.Vector3(9.0, 0.8, 0)
    ]);

    const allCurves = [
      { curve: curveInputToV3, color: 0x93c5fd, label: 'Identical Input A' },
      { curve: curveInputToV4, color: 0x93c5fd, label: 'Identical Input B' },
      { curve: curveV3ToComp, color: 0x6ee7b7, label: 'Baseline Output' },
      { curve: curveV4ToComp, color: 0xfca5a5, label: 'Candidate Output' },
      { curve: curveCompToDiff, color: 0x7dd3fc, label: 'Diff Vector' },
      { curve: curveDiffToAI, color: 0x38bdf8, label: 'Evidence Package' }
    ];

    allCurves.forEach(({ curve, color }) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.055, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
    });

    // 6. Traveling Luminous Data Packets
    const packets = allCurves.map(({ curve, color }) => {
      const geo = new THREE.SphereGeometry(0.18, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return { mesh, curve, progress: Math.random() };
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

    // 8. Animation & Screen Coordinate Projection Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth damped rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      stationsGroup.rotation.y = currentRotationY;

      // Animate core shapes & halos
      stationMeshes.forEach(({ id, halo, core }) => {
        const isSelected = id === selectedNodeId;
        halo.rotation.z += delta * 1.2;
        halo.rotation.x = Math.sin(time * 2) * 0.2;

        core.rotation.y += delta * 0.5;

        if (isSelected) {
          halo.scale.setScalar(1.0 + Math.sin(time * 5) * 0.08);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.95;
        } else {
          halo.scale.setScalar(1.0);
          (halo.material as THREE.MeshBasicMaterial).opacity = 0.45;
        }
      });

      // Animate Traveling Data Packets
      packets.forEach((packet) => {
        packet.progress = (packet.progress + delta * 0.35) % 1.0;
        const point = packet.curve.getPointAt(packet.progress);
        packet.mesh.position.copy(point);
      });

      renderer.render(scene, camera);

      // 9. Project 3D station coordinates to 2D HTML screen space
      const newCoords: Record<string, { x: number; y: number }> = {};
      STATIONS.forEach((st) => {
        tempVec.set(st.pos[0], st.pos[1] + 2.1, st.pos[2]);
        tempVec.applyEuler(stationsGroup.rotation);
        tempVec.project(camera);

        const screenX = (tempVec.x * 0.5 + 0.5) * container.clientWidth;
        const screenY = (-(tempVec.y * 0.5) + 0.5) * 450;
        newCoords[st.id] = { x: screenX, y: screenY };
      });

      setScreenPositions(newCoords);
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
        className="w-full h-[450px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Banner Explaining the 3D Meaning */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-line shadow-card text-[11px] font-mono text-ink-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <strong className="font-heading font-bold text-ink-primary">Differential Testing Topology:</strong>
          <span className="text-ink-secondary">Identical payload splits into twin sandboxes, then AST engine surfaces breaks</span>
        </div>

        <div className="bg-white/95 px-3 py-1 rounded-full border border-line shadow-card text-[11px] font-mono text-ink-secondary hidden md:inline-block">
          Click any 3D node to inspect empirical data
        </div>
      </div>

      {/* 3D Position-Anchored Spatial HUD Cards */}
      {STATIONS.map((st) => {
        const coord = screenPositions[st.id];
        if (!coord) return null;
        const isSelected = st.id === selectedNodeId;

        return (
          <div
            key={st.id}
            onClick={() => onSelectNode(st.id)}
            style={{
              position: 'absolute',
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto',
            }}
            className={`cursor-pointer transition-all duration-150 group ${
              isSelected ? 'scale-105 z-20' : 'hover:scale-102 z-10 opacity-95'
            }`}
          >
            <div
              className={`p-2.5 rounded-card border shadow-panel bg-white/95 backdrop-blur-sm transition-all max-w-[175px] sm:max-w-[195px] space-y-1 ${
                isSelected
                  ? 'border-accent ring-2 ring-accent/30 shadow-card'
                  : 'border-line hover:border-accent/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold text-accent">
                  STEP {st.stepNumber}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold truncate ${st.badgeStyle}`}>
                  {st.versionTag}
                </span>
              </div>

              <div className="font-heading font-bold text-[11px] text-ink-primary truncate">
                {st.name}
              </div>

              {/* Real Code Preview Pill */}
              <div className="p-1 rounded bg-hero/70 border border-line font-mono text-[9px] text-ink-primary truncate">
                <code>{st.codeSnippet}</code>
              </div>

              {/* Status Outcome */}
              <div className="text-[9px] font-mono font-semibold text-ink-secondary flex items-center justify-between pt-0.5">
                <span>{st.verdict}</span>
              </div>
            </div>

            {/* Pin Pointer Arrow down to 3D Pedestal */}
            <div className="w-0 h-0 mx-auto border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white/95" />
          </div>
        );
      })}

      {/* Bottom Pipeline Legend */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-ink-secondary pointer-events-none">
        <div className="flex items-center space-x-2 bg-white/90 px-3 py-1 rounded-full border border-line backdrop-blur-sm pointer-events-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          <span>Input Vector</span>
          <span className="text-ink-muted">→</span>
          <span className="inline-block w-2 h-2 rounded-full bg-status-success" />
          <span>v3 Oracle</span>
          <span className="text-ink-muted">&amp;</span>
          <span className="inline-block w-2 h-2 rounded-full bg-status-error" />
          <span>v4 Target</span>
          <span className="text-ink-muted">→</span>
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          <span>AST Core</span>
          <span className="text-ink-muted">→</span>
          <span className="inline-block w-2 h-2 rounded-full bg-ink-primary" />
          <span>NVIDIA AI</span>
        </div>

        <span className="bg-white/90 px-2.5 py-1 rounded-full border border-line backdrop-blur-sm hidden sm:inline-block">
          Drag to rotate 3D view
        </span>
      </div>
    </div>
  );
}
