'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  GitCompare,
  Terminal,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface StageTelemetry {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  tag: string;
  coords: [number, number, number];
  color: number;
  hex: string;
  description: string;
  mechanism: string;
  verdictRole: string;
}

const STAGES: StageTelemetry[] = [
  {
    id: 'inputs',
    step: '01',
    title: 'Synchronized Input Stream',
    subtitle: 'Identical Test Payloads',
    tag: 'Input Dispatcher',
    coords: [-6.8, 0, 0],
    color: 0x0066cc, // Cobalt Blue
    hex: '#0066cc',
    description: 'Generates or loads identical test vectors and streams the exact same JSON payloads to both environments simultaneously.',
    mechanism: 'Piped through stdin to isolated Node.js child processes.',
    verdictRole: 'Guarantees that any observable difference is 100% caused by dependency version changes.'
  },
  {
    id: 'v3-box',
    step: '02A',
    title: 'Baseline Sandbox (zod@3.23.8)',
    subtitle: 'Quarantined Node.js Process',
    tag: 'Ground-Truth Oracle',
    coords: [-2.0, 2.7, 0],
    color: 0x10b981, // Emerald
    hex: '#10b981',
    description: 'Executes inputs against the established baseline library inside an isolated child process under a strict 5-second watchdog timer.',
    mechanism: 'Captures baseline validation output, issue codes, and legacy error.errors properties.',
    verdictRole: 'Establishes empirical expected behavior.'
  },
  {
    id: 'v4-box',
    step: '02B',
    title: 'Candidate Sandbox (zod@4.6.7)',
    subtitle: 'Quarantined Node.js Process',
    tag: 'Upgrade Target',
    coords: [-2.0, -2.7, 0],
    color: 0xef4444, // Crimson / Regression
    hex: '#ef4444',
    description: 'Executes the exact same inputs against candidate library code in a parallel, isolated Node.js runtime.',
    mechanism: 'Captures candidate outputs, removed properties, and altered exception structures.',
    verdictRole: 'Surfaces silent regressions and breaking interface shifts.'
  },
  {
    id: 'comparator',
    step: '03',
    title: 'Deterministic AST Comparator',
    subtitle: 'Zero-AI Mathematical Diff',
    tag: 'Differential Engine',
    coords: [2.5, 0, 0],
    color: 0xf59e0b, // Amber
    hex: '#f59e0b',
    description: 'Compares runtime outputs, error structures, and property access deterministically without any AI hallucination.',
    mechanism: 'Deep structural equality check and property-retention assertion.',
    verdictRole: 'Classifies results into 4 rigorous tiers: MATCH, BEHAVIORAL_DIFFERENCE, POTENTIAL_REGRESSION, or EXECUTION_ERROR.'
  },
  {
    id: 'nebius-ai',
    step: '04',
    title: 'NVIDIA Nemotron Synthesis',
    subtitle: 'Nebius Token Factory',
    tag: 'Root-Cause Explanation',
    coords: [7.0, 0, 0],
    color: 0x38bdf8, // Ice Sky Blue
    hex: '#38bdf8',
    description: 'Sends the raw empirical diff to NVIDIA Llama-3.1-Nemotron-70B on Nebius Token Factory at temperature 0.1.',
    mechanism: 'Grounded model inference: diagnoses root cause, assesses blast radius, and generates reproducible migration diff.',
    verdictRole: 'Provides concrete before/after code migration fixes.'
  }
];

export default function InsaneTopology3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageTelemetry>(STAGES[2]); // Default on candidate v4
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 450;

    // 1. Scene, Camera, WebGL Renderer (Slate Navy Theme #0c1d2e)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1d2e);
    scene.fog = new THREE.FogExp2(0x0c1d2e, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3, 17);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Clinical Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x0066cc, 0.7);
    fillLight.position.set(-10, -5, -5);
    scene.add(fillLight);

    // 3. Slate Blue Floor Grid
    const grid = new THREE.GridHelper(32, 32, 0x23425e, 0x152c44);
    grid.position.y = -3.8;
    scene.add(grid);

    // 4. Architectural Pedestals (Deep Slate Cylinders with Glowing Accent Rings)
    const stageMeshes: { group: THREE.Group; stage: StageTelemetry; markerMesh: THREE.Mesh }[] = [];
    const stagePosMap = new Map<string, THREE.Vector3>();

    STAGES.forEach((stage) => {
      const pos = new THREE.Vector3(...stage.coords);
      stagePosMap.set(stage.id, pos);

      const group = new THREE.Group();
      group.position.copy(pos);
      group.userData = { stage };

      // Base Pedestal
      const baseGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.5, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x152c44,
        roughness: 0.2,
        metalness: 0.6
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      group.add(baseMesh);

      // Accent Ring on the Pedestal
      const ringGeo = new THREE.TorusGeometry(1.3, 0.04, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: stage.color });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.25;
      group.add(ringMesh);

      // Elevated Stage Marker (Floating Diamond Prism)
      const markerGeo = new THREE.OctahedronGeometry(0.58, 0);
      const markerMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        roughness: 0.15,
        metalness: 0.8,
        emissive: stage.color,
        emissiveIntensity: 0.35
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.y = 0.9;
      group.add(markerMesh);

      scene.add(group);
      stageMeshes.push({ group, stage, markerMesh });
    });

    // 5. Clean Connecting Conduits & Flowing Test Packet Tokens
    const connections = [
      ['inputs', 'v3-box'],
      ['inputs', 'v4-box'],
      ['v3-box', 'comparator'],
      ['v4-box', 'comparator'],
      ['comparator', 'nebius-ai']
    ];

    const packetTokens: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number; speed: number }[] = [];
    const tokenGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const tokenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Ice Cyan Packets

    connections.forEach(([fromId, toId]) => {
      const p1 = stagePosMap.get(fromId);
      const p2 = stagePosMap.get(toId);
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (p1.z !== p2.z) ? 0.45 : 0.25;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x1a344d,
        emissive: 0x0066cc,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.85
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Flowing photon packets
      for (let i = 0; i < 2; i++) {
        const pMesh = new THREE.Mesh(tokenGeo, tokenMat);
        scene.add(pMesh);
        packetTokens.push({
          mesh: pMesh,
          curve,
          offset: Math.random(),
          speed: 0.006 + Math.random() * 0.002
        });
      }
    });

    // 6. Raycasting for Clicking Pedestals
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        stageMeshes.flatMap(s => s.group.children)
      );

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.stage) {
          parent = parent.parent;
        }
        if (parent?.userData?.stage) {
          setActiveStage(parent.userData.stage);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPaused) {
        const time = clock.getElapsedTime();

        // Animate packet tokens along the curves
        packetTokens.forEach((p) => {
          p.offset = (p.offset + p.speed) % 1;
          const pos = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pos);
        });

        // Rotate and highlight active stage marker
        stageMeshes.forEach(({ group, stage, markerMesh }) => {
          markerMesh.rotation.y += 0.012;
          markerMesh.rotation.z += 0.006;

          const isSelected = activeStage.id === stage.id;
          if (isSelected) {
            group.scale.setScalar(1.15 + Math.sin(time * 3) * 0.03);
            markerMesh.position.y = 1.0 + Math.sin(time * 2.5) * 0.1;
          } else {
            group.scale.setScalar(1.0);
            markerMesh.position.y = 0.9;
          }
        });

        // Gentle camera orbit
        camera.position.x = Math.sin(time * 0.18) * 1.2;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPaused, activeStage.id]);

  return (
    <div className="w-full rounded-card border border-line bg-hero overflow-hidden shadow-panel">
      {/* 3D Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-line px-5 py-3.5 bg-card">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-button bg-accent/20 text-tech">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <span>Differential Comparison Architecture</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent/20 text-tech border border-accent/30 uppercase">
                Interactive 3D Pipeline
              </span>
            </h3>
            <p className="text-xs text-ink-secondary">
              Input ➔ Twin Isolated Sandboxes (v3 vs v4) ➔ Deterministic AST Comparator ➔ NVIDIA Nemotron
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-button text-xs font-mono border border-line bg-card hover:bg-panelHover text-ink-secondary hover:text-white transition-colors"
          >
            {isPaused ? <Play className="h-3 w-3 text-status-success" /> : <Pause className="h-3 w-3 text-ink-secondary" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            onClick={() => setActiveStage(STAGES[0])}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-button text-xs font-mono border border-line bg-card hover:bg-panelHover text-ink-secondary hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative w-full h-[450px] bg-bg cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Clear Instructions Badge */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 border border-line text-xs text-ink-secondary font-mono shadow-card backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tech animate-pulse" />
            Click any physical pedestal in 3D to inspect its execution role
          </span>
        </div>

        {/* Floating Telemetry HUD Card for Active Stage */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md pointer-events-auto">
          <div className="p-4 rounded-card border border-line bg-card/95 backdrop-blur-md shadow-panel text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-sm"
                  style={{ backgroundColor: activeStage.hex }}
                >
                  STAGE {activeStage.step}
                </span>
                <span className="font-heading font-bold text-white text-sm">
                  {activeStage.title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-hero text-tech">
                {activeStage.tag}
              </span>
            </div>

            <p className="text-ink-secondary text-xs leading-relaxed">
              {activeStage.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-[11px] font-mono">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase font-bold">Mechanism:</span>
                <span className="text-white truncate block">{activeStage.mechanism}</span>
              </div>
              <div>
                <span className="text-tech block text-[10px] uppercase font-bold">Why It Matters:</span>
                <span className="text-ink-secondary truncate block">{activeStage.verdictRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Clear Interactive Stage Bar */}
      <div className="border-t border-line bg-card p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {STAGES.map((s) => {
            const isSelected = activeStage.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s)}
                className={`text-left p-3 rounded-card border transition-all ${
                  isSelected
                    ? 'bg-hero border-accent shadow-glowBlue ring-1 ring-accent'
                    : 'bg-card border-line hover:bg-panelHover text-ink-secondary hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-tech">
                    STEP {s.step}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full shadow-sm"
                    style={{ backgroundColor: s.hex }}
                  />
                </div>
                <div className={`font-heading text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-ink-secondary'}`}>
                  {s.title}
                </div>
                <div className="text-[11px] text-ink-muted font-mono truncate mt-0.5">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
