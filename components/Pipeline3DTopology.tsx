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
  Maximize2
} from 'lucide-react';

interface StationInfo {
  id: string;
  name: string;
  versionTag: string;
  stepNumber: string;
  badgeColor: string;
  pos: [number, number, number];
  color: number;
}

const STATIONS: StationInfo[] = [
  {
    id: 'inputs',
    name: 'Input Dispatcher',
    versionTag: 'Identical JSON Vectors',
    stepNumber: '01',
    badgeColor: 'border-accent text-accent bg-card',
    pos: [-6.2, 0, 0],
    color: 0x0284c7
  },
  {
    id: 'v3',
    name: 'Baseline Runtime',
    versionTag: 'zod@3.23.8 Oracle',
    stepNumber: '02A',
    badgeColor: 'border-status-success text-status-success bg-status-successBg',
    pos: [-2.2, 2.2, -1.2],
    color: 0x059669
  },
  {
    id: 'v4',
    name: 'Candidate Runtime',
    versionTag: 'zod@4.6.7 Upgrade',
    stepNumber: '02B',
    badgeColor: 'border-status-error text-status-error bg-status-errorBg',
    pos: [-2.2, -2.2, 1.2],
    color: 0xdc2626
  },
  {
    id: 'comparator',
    name: 'AST Comparison Core',
    versionTag: 'Deterministic Diff',
    stepNumber: '03',
    badgeColor: 'border-accent text-accent bg-card',
    pos: [1.8, 0, 0],
    color: 0x0284c7
  },
  {
    id: 'differences',
    name: 'Observed Differences',
    versionTag: 'Empirical Evidence',
    stepNumber: '04',
    badgeColor: 'border-line text-ink-primary bg-card',
    pos: [5.2, 0, 0],
    color: 0x0ea5e9
  },
  {
    id: 'ai',
    name: 'NVIDIA Nemotron AI',
    versionTag: 'Nebius Token Factory',
    stepNumber: '05',
    badgeColor: 'border-accent text-white bg-accent',
    pos: [8.5, 0, 0],
    color: 0x142638
  }
];

interface Pipeline3DTopologyProps {
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export default function Pipeline3DTopology({ selectedNodeId, onSelectNode }: Pipeline3DTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf7fb);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 11, 18);
    camera.lookAt(0.5, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 3. Subtle Isometric Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0xb8e2ef, 0xd4f0f8);
    gridHelper.position.y = -2.8;
    scene.add(gridHelper);

    // 4. Stations Group
    const stationsGroup = new THREE.Group();
    scene.add(stationsGroup);

    const stationMeshes: { id: string; mesh: THREE.Object3D; ring: THREE.Mesh }[] = [];

    // Helper to create glossy platforms
    STATIONS.forEach((station) => {
      const group = new THREE.Group();
      group.position.set(...station.pos);

      // Base Pedestal
      const baseGeo = new THREE.CylinderGeometry(1.0, 1.15, 0.45, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.22;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // Colored Accent Ring
      const ringGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 64);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: station.color,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.02;
      group.add(ringMesh);

      // Central Processing Core Shape
      let coreMesh: THREE.Mesh;
      if (station.id === 'inputs') {
        const geo = new THREE.SphereGeometry(0.52, 24, 24);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.3 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.65;
      } else if (station.id === 'v3') {
        const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const mat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.65;
      } else if (station.id === 'v4') {
        const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const mat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.65;
      } else if (station.id === 'comparator') {
        const geo = new THREE.OctahedronGeometry(0.68, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.4 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.75;
      } else if (station.id === 'differences') {
        const geo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 6);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.2 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.65;
      } else {
        // AI Nemotron node
        const geo = new THREE.IcosahedronGeometry(0.7, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x142638, roughness: 0.2, metalness: 0.5 });
        coreMesh = new THREE.Mesh(geo, mat);
        coreMesh.position.y = 0.75;
      }

      coreMesh.castShadow = true;
      group.add(coreMesh);

      // Outer Gyroscope Halo for active or selected node
      const haloGeo = new THREE.TorusGeometry(1.25, 0.025, 12, 48);
      const haloMat = new THREE.MeshBasicMaterial({ color: station.color, transparent: true, opacity: 0.7 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = 0.65;
      group.add(haloMesh);

      // Store references for raycasting & animation
      (group as any).stationId = station.id;
      (coreMesh as any).stationId = station.id;
      stationsGroup.add(group);

      stationMeshes.push({
        id: station.id,
        mesh: group,
        ring: haloMesh
      });
    });

    // 5. Connecting 3D Pipeline Splines
    // Branch 1: Input to v3 (Baseline)
    const curveInputToV3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.2, 0.65, 0),
      new THREE.Vector3(-4.4, 1.4, -0.6),
      new THREE.Vector3(-2.2, 2.85, -1.2)
    ]);

    // Branch 2: Input to v4 (Candidate)
    const curveInputToV4 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.2, 0.65, 0),
      new THREE.Vector3(-4.4, -1.4, 0.6),
      new THREE.Vector3(-2.2, -1.55, 1.2)
    ]);

    // Branch 3: v3 to Comparator
    const curveV3ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 2.85, -1.2),
      new THREE.Vector3(0.0, 1.2, -0.5),
      new THREE.Vector3(1.8, 0.75, 0)
    ]);

    // Branch 4: v4 to Comparator
    const curveV4ToComp = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, -1.55, 1.2),
      new THREE.Vector3(0.0, -1.2, 0.5),
      new THREE.Vector3(1.8, 0.75, 0)
    ]);

    // Branch 5: Comparator to Evidence
    const curveCompToDiff = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.8, 0.75, 0),
      new THREE.Vector3(3.5, 0.75, 0),
      new THREE.Vector3(5.2, 0.65, 0)
    ]);

    // Branch 6: Evidence to AI
    const curveDiffToAI = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.2, 0.65, 0),
      new THREE.Vector3(6.85, 0.75, 0),
      new THREE.Vector3(8.5, 0.75, 0)
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
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
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

    // 6. Traveling Luminous Packets (Spheres)
    const packets = allCurves.map(({ curve, color }) => {
      const geo = new THREE.SphereGeometry(0.16, 16, 16);
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

    // Mouse drag rotation handling
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
        // Clamp to prevent disorienting view
        targetRotationY = Math.max(-0.6, Math.min(0.6, targetRotationY));
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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth damped rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      stationsGroup.rotation.y = currentRotationY;

      // Animate core shapes & halos
      stationMeshes.forEach(({ id, mesh, ring }) => {
        const isSelected = id === selectedNodeId;
        ring.rotation.z += delta * 1.2;
        ring.rotation.x = Math.sin(time * 2) * 0.2;

        if (isSelected) {
          ring.scale.setScalar(1.0 + Math.sin(time * 5) * 0.08);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.95;
        } else {
          ring.scale.setScalar(1.0);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.45;
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

    // Resize Handler
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
        className="w-full h-[360px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating 3D Badge Overlay Navigation */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-line shadow-card text-[11px] font-mono text-ink-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span className="font-semibold">3D Architecture Topology</span>
          <span className="text-ink-muted">|</span>
          <span className="text-ink-secondary">Click any 3D node or drag to rotate view</span>
        </div>

        {/* Selected Node Status Badge */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          {STATIONS.map((st) => {
            const isSelected = st.id === selectedNodeId;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectNode(st.id)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all border ${
                  isSelected
                    ? `${st.badgeColor} shadow-card font-bold ring-1 ring-accent scale-105`
                    : 'border-line bg-white/90 text-ink-secondary hover:text-ink-primary hover:bg-white'
                }`}
              >
                {st.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint Bar */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-ink-secondary pointer-events-none">
        <div className="flex items-center space-x-2 bg-white/90 px-2.5 py-0.5 rounded-full border border-line backdrop-blur-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-status-success" />
          <span>v3 Oracle</span>
          <span className="text-ink-muted">/</span>
          <span className="inline-block w-2 h-2 rounded-full bg-status-error" />
          <span>v4 Candidate</span>
          <span className="text-ink-muted">/</span>
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          <span>AST Core</span>
        </div>

        <span className="bg-white/90 px-2 py-0.5 rounded-full border border-line backdrop-blur-sm hidden sm:inline-block">
          Interactive WebGL • 60 FPS
        </span>
      </div>
    </div>
  );
}
