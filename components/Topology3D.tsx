'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  Layers, 
  GitBranch, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface StageInfo {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  tag: string;
  coords: [number, number, number];
  color: number;
  hex: string;
  badgeColor: string;
  whatItDoes: string;
  whyItMatters: string;
}

const STAGES: StageInfo[] = [
  {
    id: 'inputs',
    stepNumber: '01',
    title: 'Shared Test Input',
    subtitle: 'Identical Test Vectors',
    tag: 'Input Vector',
    coords: [-6, 0, 0],
    color: 0x0284c7, // Sky
    hex: '#0284c7',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    whatItDoes: 'Generates and feeds identical test payloads into both dependency versions simultaneously.',
    whyItMatters: 'Guarantees that any observed variance is caused strictly by the dependency bump, not differing inputs.'
  },
  {
    id: 'v3-box',
    stepNumber: '02A',
    title: 'Baseline Sandbox (v3)',
    subtitle: 'zod@3.23.8',
    tag: 'Isolated Runtime',
    coords: [-1.5, 2.2, 0],
    color: 0x10b981, // Emerald
    hex: '#10b981',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    whatItDoes: 'Executes the inputs in an isolated Node.js child process running Zod v3.23.8.',
    whyItMatters: 'Records the baseline behavior: parsed outputs, error shapes, and legacy properties like error.errors.'
  },
  {
    id: 'v4-box',
    stepNumber: '02B',
    title: 'Candidate Sandbox (v4)',
    subtitle: 'zod@4.6.7',
    tag: 'Isolated Runtime',
    coords: [-1.5, -2.2, 0],
    color: 0x8b5cf6, // Violet
    hex: '#8b5cf6',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    whatItDoes: 'Executes the exact same inputs in a parallel isolated Node.js process running Zod v4.6.7.',
    whyItMatters: 'Reveals breaking changes: dropped options like required_error and undefined error.errors.'
  },
  {
    id: 'comparator',
    stepNumber: '03',
    title: 'Deterministic Comparator',
    subtitle: 'AST & Structural Diff',
    tag: 'Diff Engine',
    coords: [2.5, 0, 0],
    color: 0xf59e0b, // Amber
    hex: '#f59e0b',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    whatItDoes: 'Compares the output values, error codes, and properties between v3 and v4 without AI hallucination.',
    whyItMatters: 'Distinguishes a harmless difference from a potential regression before passing evidence forward.'
  },
  {
    id: 'nebius-ai',
    stepNumber: '04',
    title: 'NVIDIA Nemotron (Nebius)',
    subtitle: 'Root Cause & Blast Radius',
    tag: 'AI Synthesis',
    coords: [6.5, 0, 0],
    color: 0x0ea5e9, // Bright Sky
    hex: '#0ea5e9',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    whatItDoes: 'Sends the raw empirical diff to NVIDIA Llama-3.1-Nemotron-70B on Nebius Token Factory.',
    whyItMatters: 'Explains the architectural breaking change and generates copy-pasteable migration fixes.'
  }
];

export default function Topology3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageInfo>(STAGES[0]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 320;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Clean light slate-50

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0.5, 0.5, 17);
    camera.lookAt(0.5, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Bright Soft Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 15, 12);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.8);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    // 3. Stage Platforms (Clean 3D Cylinders with White Tops)
    const stageMeshes: { mesh: THREE.Mesh; stage: StageInfo }[] = [];
    const stagePosMap = new Map<string, THREE.Vector3>();

    STAGES.forEach((stage) => {
      const pos = new THREE.Vector3(...stage.coords);
      stagePosMap.set(stage.id, pos);

      // Main stage platform
      const geo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: stage.color,
        roughness: 0.3,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData = { stage };
      scene.add(mesh);
      stageMeshes.push({ mesh, stage });

      // Clean white top cap
      const capGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.05, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(pos.x, pos.y + 0.2, pos.z);
      scene.add(cap);
    });

    // 4. Clean Connecting Beams
    // Path 1: Input -> Baseline (v3)
    // Path 2: Input -> Candidate (v4)
    // Path 3: Baseline (v3) -> Comparator
    // Path 4: Candidate (v4) -> Comparator
    // Path 5: Comparator -> NVIDIA AI
    const connections = [
      ['inputs', 'v3-box'],
      ['inputs', 'v4-box'],
      ['v3-box', 'comparator'],
      ['v4-box', 'comparator'],
      ['comparator', 'nebius-ai']
    ];

    const pulses: { mesh: THREE.Mesh; curve: THREE.LineCurve3; progress: number }[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

    connections.forEach(([fromId, toId]) => {
      const p1 = stagePosMap.get(fromId);
      const p2 = stagePosMap.get(toId);
      if (!p1 || !p2) return;

      const curve = new THREE.LineCurve3(p1, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.07, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1, // clean slate-300
        roughness: 0.4
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Data pulse
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulseMesh);
      pulses.push({
        mesh: pulseMesh,
        curve: curve,
        progress: Math.random()
      });
    });

    // 5. Click Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stageMeshes.map(s => s.mesh));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        if (clickedMesh.userData?.stage) {
          setActiveStage(clickedMesh.userData.stage);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 6. Animation
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPaused) {
        // Move data pulses
        pulses.forEach((p) => {
          p.progress = (p.progress + 0.008) % 1;
          const pos = p.curve.getPointAt(p.progress);
          p.mesh.position.copy(pos);
        });

        // Gentle floating effect on selected stage
        stageMeshes.forEach(({ mesh, stage }) => {
          const isSelected = activeStage.id === stage.id;
          if (isSelected) {
            mesh.scale.set(1.15, 1.15, 1.15);
            mesh.rotation.y += 0.01;
          } else {
            mesh.scale.set(1.0, 1.0, 1.0);
            mesh.rotation.y = 0;
          }
        });
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
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Topology Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Twin-Environment Differential Pipeline
          </h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            (How ShadowBump AI Works)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs"
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            onClick={() => setActiveStage(STAGES[0])}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-[320px] bg-[#f8fafc] cursor-pointer">
        <div ref={mountRef} className="w-full h-full" />

        {/* Quick Hint */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-medium text-slate-600 shadow-xs">
            <Info className="h-3.5 w-3.5 text-sky-600" />
            Click any platform to inspect that step
          </span>
        </div>
      </div>

      {/* Simplified, Crystal-Clear 5-Stage Step Bar */}
      <div className="border-t border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isSelected = activeStage.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s)}
                className={`text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white border-sky-400 shadow-sm ring-1 ring-sky-400/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    STEP {s.stepNumber}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: s.hex }}
                  />
                </div>
                <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {s.title}
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Explanation Box (Clean & Readable) */}
        <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white"
              style={{ backgroundColor: activeStage.hex }}
            >
              STEP {activeStage.stepNumber}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {activeStage.title}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              — {activeStage.tag}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                What happens here:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {activeStage.whatItDoes}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider block mb-0.5">
                Why it matters:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {activeStage.whyItMatters}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
