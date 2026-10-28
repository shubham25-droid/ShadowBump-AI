'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Cpu, 
  Sparkles, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Maximize2
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
  glowColor: string;
  description: string;
  mechanism: string;
  verdictRole: string;
}

const STAGES: StageTelemetry[] = [
  {
    id: 'inputs',
    step: '01',
    title: 'Test Input Injector',
    subtitle: 'Identical Stdin Stream',
    tag: 'Test Vector Source',
    coords: [-7.5, 0, 0],
    color: 0xe2e8f0, // Platinum Silver
    hex: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.4)',
    description: 'Generates edge cases (missing required fields, NaN, coercion edge cases) and feeds identical payloads simultaneously.',
    mechanism: 'Synchronized JSON serialization piped to both child processes.',
    verdictRole: 'Guarantees any output divergence is 100% caused by dependency code.'
  },
  {
    id: 'v3-box',
    step: '02A',
    title: 'Baseline Sandbox (v3)',
    subtitle: 'zod@3.23.8 Environment',
    tag: 'Baseline Node.js Subprocess',
    coords: [-2.5, 3.2, -1],
    color: 0x10b981, // Emerald
    hex: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Executes inputs in an isolated Node.js child process running Zod v3.23.8 under a strict 5,000ms timeout.',
    mechanism: 'Captures baseline validation results, issue codes, and legacy error.errors properties.',
    verdictRole: 'Acts as the ground-truth behavioral oracle.'
  },
  {
    id: 'v4-box',
    step: '02B',
    title: 'Candidate Sandbox (v4)',
    subtitle: 'zod@4.6.7 Environment',
    tag: 'Candidate Node.js Subprocess',
    coords: [-2.5, -3.2, 1],
    color: 0xf43f5e, // Rose / Regression
    hex: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    description: 'Executes the exact same inputs in a parallel isolated Node.js child process running Zod v4.6.7.',
    mechanism: 'Captures candidate output structures, removed properties, and altered error issue arrays.',
    verdictRole: 'Surfaces silent regressions and breaking changes.'
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
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Compares outputs, exception shapes, and property access deterministically without AI hallucination.',
    mechanism: 'Deep structural equality check and custom-error retention verification.',
    verdictRole: 'Separates benign changes from contract-breaking regressions.'
  },
  {
    id: 'nebius-ai',
    step: '04',
    title: 'NVIDIA Nemotron Engine',
    subtitle: 'Nebius Token Factory',
    tag: 'AI Root-Cause Synthesis',
    coords: [7.5, 0, 0],
    color: 0x94a3b8, // Titanium Slate
    hex: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    description: 'Sends the raw empirical diff to NVIDIA Llama-3.1-Nemotron-70B on Nebius Token Factory at temp=0.1.',
    mechanism: 'Grounded model inference: synthesizes root cause, blast radius, and Before/After migration diff.',
    verdictRole: 'Provides actionable developer remediation code.'
  }
];

export default function InsaneTopology3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageTelemetry>(STAGES[2]); // Default on candidate or comparator
  const [isPaused, setIsPaused] = useState(false);
  const [cameraMode, setCameraMode] = useState<'free' | 'locked'>('free');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 480;

    // 1. Scene, Camera, WebGL Renderer (Grey Theme: #101115)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101115);

    // Subtle background fog for depth
    scene.fog = new THREE.FogExp2(0x101115, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting (Neutral Crisp White & Titanium Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(15, 20, 15);
    scene.add(dirLight);

    const sideLight1 = new THREE.PointLight(0x94a3b8, 2, 30);
    sideLight1.position.set(-6, -5, 5);
    scene.add(sideLight1);

    const sideLight2 = new THREE.PointLight(0xe2e8f0, 2, 30);
    sideLight2.position.set(-5, 5, -5);
    scene.add(sideLight2);

    // 3. Slate Grey Grid Floor
    const grid = new THREE.GridHelper(36, 36, 0x383e4e, 0x1d202a);
    grid.position.y = -4.5;
    scene.add(grid);

    // 4. Floating Stage Platforms with Glass & Glowing Cores
    const stageMeshes: { group: THREE.Group; stage: StageTelemetry; coreMesh: THREE.Mesh }[] = [];
    const stagePosMap = new Map<string, THREE.Vector3>();

    STAGES.forEach((stage) => {
      const pos = new THREE.Vector3(...stage.coords);
      stagePosMap.set(stage.id, pos);

      const group = new THREE.Group();
      group.position.copy(pos);
      group.userData = { stage };

      // Outer glowing wireframe octagon / cylinder
      const outerGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 8);
      const outerMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: stage.color,
        emissiveIntensity: 0.4
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      // Inner glowing core (Icosahedron Crystal)
      const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        roughness: 0.15,
        metalness: 0.75,
        emissive: stage.color,
        emissiveIntensity: 0.65
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // Orbiting energy ring
      const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      scene.add(group);
      stageMeshes.push({ group, stage, coreMesh });
    });

    // 5. Laser Connecting Beams & Flowing Photon Packets
    const connections = [
      ['inputs', 'v3-box'],
      ['inputs', 'v4-box'],
      ['v3-box', 'comparator'],
      ['v4-box', 'comparator'],
      ['comparator', 'nebius-ai']
    ];

    const photonPackets: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number; speed: number }[] = [];
    const photonGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Pure Silver-White Photons

    connections.forEach(([fromId, toId]) => {
      const p1 = stagePosMap.get(fromId);
      const p2 = stagePosMap.get(toId);
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (p1.z !== p2.z) ? 0.7 : 0.3;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x252833,
        emissive: 0xd1d5db,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.75
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Add 2 glowing photon packets flowing along each pipeline
      for (let i = 0; i < 2; i++) {
        const pMesh = new THREE.Mesh(photonGeo, photonMat);
        scene.add(pMesh);
        photonPackets.push({
          mesh: pMesh,
          curve,
          offset: Math.random(),
          speed: 0.006 + Math.random() * 0.003
        });
      }
    });

    // 6. Floating Silver Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 30;
      dustPositions[i + 1] = (Math.random() - 0.5) * 15;
      dustPositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x9ca3af, size: 0.1, transparent: true, opacity: 0.5 });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 7. Raycasting for Clicking Stages
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

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPaused) {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Animate photon packets along the pipeline curves
        photonPackets.forEach((p) => {
          p.offset = (p.offset + p.speed) % 1;
          const pos = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pos);
        });

        // Rotate stage cores and rings
        stageMeshes.forEach(({ group, stage, coreMesh }) => {
          coreMesh.rotation.y += 0.015;
          coreMesh.rotation.x += 0.008;

          const isSelected = activeStage.id === stage.id;
          if (isSelected) {
            group.scale.setScalar(1.2 + Math.sin(time * 3) * 0.04);
            (coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.1;
          } else {
            group.scale.setScalar(1.0);
            (coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55;
          }
        });

        // Subtle dust drift
        dustParticles.rotation.y = time * 0.02;

        // Smooth cinematic camera orbit
        if (cameraMode === 'free') {
          camera.position.x = Math.sin(time * 0.25) * 1.5;
          camera.position.y = 4 + Math.cos(time * 0.35) * 0.8;
          camera.lookAt(0, 0, 0);
        }
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
  }, [isPaused, activeStage.id, cameraMode]);

  return (
    <div className="w-full rounded-2xl border border-zinc-750 bg-[#161821]/95 shadow-card backdrop-blur-xl overflow-hidden">
      {/* 3D Header & Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-750 px-5 py-3.5 bg-[#121319]">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Interactive Differential Twin Pipeline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                3D WebGL Engine
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Interactive 5-stage pipeline: Inputs ➔ Twin Sandboxes ➔ AST Comparator ➔ NVIDIA Nemotron
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 transition-all"
          >
            {isPaused ? <Play className="h-3 w-3 text-emerald-400" /> : <Pause className="h-3 w-3 text-zinc-300" />}
            <span>{isPaused ? 'Resume 3D' : 'Pause'}</span>
          </button>
          <button
            onClick={() => setActiveStage(STAGES[0])}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative w-full h-[480px] bg-[#101115] cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Holographic Labels on top of 3D Canvas */}
        <div className="absolute top-4 left-4 pointer-events-none space-y-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-xs text-zinc-300 font-mono backdrop-blur-md shadow-card">
            <Cpu className="h-3.5 w-3.5 text-zinc-400 animate-pulse" />
            Click any 3D stage node to inspect its telemetry & isolation role
          </span>
        </div>

        {/* Floating Telemetry HUD Card for Active Stage */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg pointer-events-auto">
          <div className="p-4 rounded-xl border border-zinc-650 bg-[#151720]/95 backdrop-blur-xl shadow-card text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold text-zinc-950 shadow-sm"
                  style={{ backgroundColor: activeStage.hex }}
                >
                  STEP {activeStage.step}
                </span>
                <span className="font-bold text-white text-sm">
                  {activeStage.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                {activeStage.tag}
              </span>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              {activeStage.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-750 text-[11px] font-mono">
              <div>
                <span className="text-zinc-400 block">Mechanism:</span>
                <span className="text-white truncate block">{activeStage.mechanism}</span>
              </div>
              <div>
                <span className="text-zinc-300 block">Why It Matters:</span>
                <span className="text-zinc-200 truncate block">{activeStage.verdictRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Clear Interactive Stage Bar */}
      <div className="border-t border-zinc-750 bg-[#121319] p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {STAGES.map((s) => {
            const isSelected = activeStage.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-400 shadow-glowSubtle ring-1 ring-zinc-400/50'
                    : 'bg-zinc-850/60 border-zinc-750 hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-300">
                    STEP {s.step}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full shadow-sm"
                    style={{ backgroundColor: s.hex }}
                  />
                </div>
                <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {s.title}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
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
