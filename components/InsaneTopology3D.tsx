'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  Zap,
  Code2
} from 'lucide-react';

interface StageTelemetry {
  id: string;
  step: string;
  title: string;
  shortLabel: string;
  badge: string;
  tag: string;
  coords: [number, number, number];
  color: number;
  hex: string;
  description: string;
  mechanism: string;
  verdictRole: string;
  codeSnippet: string;
  quarantineSpecs: string;
}

const STAGES: StageTelemetry[] = [
  {
    id: 'inputs',
    step: '01',
    title: 'Synchronized Input Stream',
    shortLabel: 'Input Dispatcher',
    badge: 'STAGE 01 • DISPATCHER',
    tag: 'Input Dispatcher',
    coords: [-6.4, 0, 0],
    color: 0x0064d2, // Royal Blue
    hex: '#0064d2',
    description: 'Generates or loads identical test payloads and streams synchronized JSON vectors simultaneously to both environments via stdin pipes.',
    mechanism: 'Piped through stdin to isolated Node.js child processes without network or disk mutations.',
    verdictRole: 'Guarantees that 100% of observable differences are caused strictly by library version changes, eliminating test pollution.',
    codeSnippet: 'const payload = { email: "alex@company.org", age: 28 };\nstreamToStdin([baselineV3, candidateV4], payload);',
    quarantineSpecs: 'Synchronized Stdin • Deterministic JSON'
  },
  {
    id: 'v3-box',
    step: '02A',
    title: 'Baseline Sandbox (zod@3.23.8)',
    shortLabel: 'Baseline v3',
    badge: 'STAGE 02A • ORACLE',
    tag: 'Ground-Truth Oracle',
    coords: [-2.0, 2.5, 0],
    color: 0x10b981, // Emerald Green
    hex: '#10b981',
    description: 'Executes inputs against the established baseline library inside an isolated child process under a strict 5-second watchdog timer.',
    mechanism: 'Executes z.object schema in quarantine; captures validated output and legacy error.errors properties.',
    verdictRole: 'Establishes empirical expected behavior. Custom error messages and error.errors properties are honored.',
    codeSnippet: 'z.string({ required_error: "Username is required" });\n// v3 Output: "Username is required"\n// v3 error.errors: defined Array(1)',
    quarantineSpecs: 'Child Process • 5s Watchdog • Zero Net Access'
  },
  {
    id: 'v4-box',
    step: '02B',
    title: 'Candidate Sandbox (zod@4.6.7)',
    shortLabel: 'Candidate v4',
    badge: 'STAGE 02B • BREAKING TARGET',
    tag: 'Upgrade Target',
    coords: [-2.0, -2.5, 0],
    color: 0xef4444, // Crimson Red / Regression Alert
    hex: '#ef4444',
    description: 'Executes the exact same inputs against candidate library code in a parallel, isolated Node.js runtime.',
    mechanism: 'Executes candidate code in quarantine; detects altered exception structures, dropped options, and removed properties.',
    verdictRole: 'Surfaces silent regressions and breaking interface shifts before they reach production.',
    codeSnippet: 'z.string({ required_error: "Username is required" });\n// v4 Output: "Invalid input: expected string, received undefined"\n// v4 error.errors: undefined (BREAKING)',
    quarantineSpecs: 'Child Process • 5s Watchdog • Zero Net Access'
  },
  {
    id: 'comparator',
    step: '03',
    title: 'Deterministic AST Comparator',
    shortLabel: 'AST Comparator',
    badge: 'STAGE 03 • COMPARATOR',
    tag: 'Differential Engine',
    coords: [2.2, 0, 0],
    color: 0xf59e0b, // Amber Gold
    hex: '#f59e0b',
    description: 'Compares runtime outputs, error structures, and property access deterministically without any AI hallucination.',
    mechanism: 'Deep structural equality assertions and property-retention checks executed in pure TypeScript.',
    verdictRole: 'Classifies results into 4 rigorous tiers: MATCH, BEHAVIORAL_DIFFERENCE, POTENTIAL_REGRESSION, or EXECUTION_ERROR.',
    codeSnippet: 'const isDiff = !deepEqual(oldRes.output, newRes.output);\nconst isRegression = oldRes.hasErrorsProp && !newRes.hasErrorsProp;\nreturn classify(isDiff, isRegression);',
    quarantineSpecs: 'Pure Math AST • Zero-AI Deterministic Diff'
  },
  {
    id: 'nebius-ai',
    step: '04',
    title: 'NVIDIA Nemotron Synthesis',
    shortLabel: 'NVIDIA Nemotron',
    badge: 'STAGE 04 • NEBIUS AI',
    tag: 'Root-Cause Synthesis',
    coords: [6.4, 0, 0],
    color: 0x38bdf8, // Ice Sky Blue
    hex: '#38bdf8',
    description: 'Sends the raw empirical diff to NVIDIA Llama-3.1-Nemotron-70B on Nebius Token Factory at temperature 0.1.',
    mechanism: 'Grounded model inference: diagnoses root cause, assesses blast radius, and generates reproducible migration diffs.',
    verdictRole: 'Provides concrete before/after code migration fixes grounded purely in observable test evidence.',
    codeSnippet: 'const explanation = await nebiusClient.chat.completions.create({\n  model: "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",\n  temperature: 0.1,\n  messages: [systemPrompt, evidencePayload]\n});',
    quarantineSpecs: 'NVIDIA 70B • Nebius Token Factory • Temp 0.1'
  }
];

export default function InsaneTopology3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageTelemetry>(STAGES[2]); // Default on candidate v4
  const [isPaused, setIsPaused] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<string>('IDLE');

  // Interactive Simulation Trigger
  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep('DISPATCHING INPUT');
    setActiveStage(STAGES[0]);

    setTimeout(() => {
      setSimStep('TWIN RUNTIME EXECUTION');
      setActiveStage(STAGES[2]); // Candidate v4
    }, 1300);

    setTimeout(() => {
      setSimStep('DETERMINISTIC AST COMPARISON');
      setActiveStage(STAGES[3]); // Comparator
    }, 2700);

    setTimeout(() => {
      setSimStep('NVIDIA NEMOTRON SYNTHESIS');
      setActiveStage(STAGES[4]); // NVIDIA AI
    }, 4100);

    setTimeout(() => {
      setSimStep('COMPLETED');
      setIsSimulating(false);
    }, 5500);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 380;

    // 1. Scene, Camera, WebGL Renderer (Transparent to blend with clinical slate-grey)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 5.0, 18.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Full-featured OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.08; // Stay strictly above floor
    controls.minDistance = 9;
    controls.maxDistance = 26;
    controls.enablePan = false;

    // 3. Clinical Daylight Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe4edf5, 2.0);
    dirLight.position.set(12, 18, 12);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x0064d2, 0.8);
    fillLight.position.set(-12, -6, -6);
    scene.add(fillLight);

    // 4. Clinical Slate-Grey Floor Grid
    const grid = new THREE.GridHelper(34, 34, 0x2e4153, 0x1b2733);
    grid.position.y = -3.5;
    scene.add(grid);

    // 5. Precision Hardware Pedestals
    const stageMeshes: { 
      group: THREE.Group; 
      stage: StageTelemetry; 
      coreMesh: THREE.Mesh | THREE.Group; 
      ringMesh: THREE.Mesh;
    }[] = [];
    const stagePosMap = new Map<string, THREE.Vector3>();

    STAGES.forEach((stage) => {
      const pos = new THREE.Vector3(...stage.coords);
      stagePosMap.set(stage.id, pos);

      const group = new THREE.Group();
      group.position.copy(pos);
      group.userData = { stage };

      // Base Pedestal (Precision Brushed Slate-Steel)
      const baseGeo = new THREE.CylinderGeometry(1.4, 1.55, 0.42, 48);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1f2e3c,
        roughness: 0.3,
        metalness: 0.75
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      group.add(baseMesh);

      // Chamfered Metallic Edge
      const bevelGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.1, 36);
      const bevelMat = new THREE.MeshStandardMaterial({
        color: 0x2e4153,
        roughness: 0.2,
        metalness: 0.9
      });
      const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
      bevelMesh.position.y = 0.24;
      group.add(bevelMesh);

      // Base Status Indicator Ring
      const ringGeo = new THREE.TorusGeometry(1.56, 0.045, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({ 
        color: stage.color,
        emissive: stage.color,
        emissiveIntensity: 1.4,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.16;
      group.add(ringMesh);

      let coreMesh: THREE.Mesh | THREE.Group;

      if (stage.id === 'inputs') {
        // Stage 1: Dual Dispatcher Core
        const coreGeo = new THREE.IcosahedronGeometry(0.65, 0);
        const coreMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.y = 0.95;
        group.add(coreMesh);
      } else if (stage.id === 'v3-box' || stage.id === 'v4-box') {
        // Stages 2A & 2B: Silicon Process Core with Glass Containment Shield
        const sandboxGroup = new THREE.Group();

        // Silicon die
        const chipGeo = new THREE.BoxGeometry(0.85, 0.2, 0.85);
        const chipMat = new THREE.MeshStandardMaterial({
          color: 0x17212b,
          metalness: 0.85,
          roughness: 0.2
        });
        const chip = new THREE.Mesh(chipGeo, chipMat);
        chip.position.y = 0.48;
        sandboxGroup.add(chip);

        // Core Prism
        const glyphGeo = new THREE.OctahedronGeometry(0.44, 0);
        const glyphMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.7,
          metalness: 0.8,
          roughness: 0.2
        });
        const glyph = new THREE.Mesh(glyphGeo, glyphMat);
        glyph.position.y = 1.05;
        sandboxGroup.add(glyph);

        // Glass containment shield
        const shieldGeo = new THREE.CylinderGeometry(1.15, 1.15, 1.6, 32, 1, true);
        const shieldMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          transparent: true,
          opacity: 0.16,
          roughness: 0.1,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.y = 1.0;
        sandboxGroup.add(shield);

        coreMesh = sandboxGroup;
        group.add(sandboxGroup);
      } else if (stage.id === 'comparator') {
        // Stage 3: Interlocking AST Analysis Cubes
        const compGroup = new THREE.Group();
        const innerGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const innerMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.6,
          metalness: 0.75,
          roughness: 0.25
        });
        const innerBox = new THREE.Mesh(innerGeo, innerMat);
        innerBox.position.y = 1.0;
        compGroup.add(innerBox);

        const outerGeo = new THREE.BoxGeometry(1.05, 1.05, 1.05);
        const outerMat = new THREE.MeshBasicMaterial({
          color: stage.color,
          wireframe: true
        });
        const outerBox = new THREE.Mesh(outerGeo, outerMat);
        outerBox.position.y = 1.0;
        compGroup.add(outerBox);

        coreMesh = compGroup;
        group.add(compGroup);
      } else {
        // Stage 4: NVIDIA Nemotron Neural Core
        const aiGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.75,
          metalness: 0.8,
          roughness: 0.2
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.y = 1.0;
        aiGroup.add(sphere);

        // Orbit ring
        const orbitGeo = new THREE.TorusGeometry(0.9, 0.03, 16, 48);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.position.y = 1.0;
        orbit.rotation.x = Math.PI / 3;
        aiGroup.add(orbit);

        coreMesh = aiGroup;
        group.add(aiGroup);
      }

      scene.add(group);
      stageMeshes.push({ group, stage, coreMesh, ringMesh });
    });

    // 6. Optical Conduit Pipes & Flowing Data Pulses
    const connections = [
      { from: 'inputs', to: 'v3-box', color: 0x10b981 },
      { from: 'inputs', to: 'v4-box', color: 0xef4444 },
      { from: 'v3-box', to: 'comparator', color: 0x10b981 },
      { from: 'v4-box', to: 'comparator', color: 0xef4444 },
      { from: 'comparator', to: 'nebius-ai', color: 0x38bdf8 }
    ];

    const packetTokens: { 
      mesh: THREE.Mesh; 
      curve: THREE.CatmullRomCurve3; 
      offset: number; 
      speed: number;
    }[] = [];

    const packetGeo = new THREE.SphereGeometry(0.16, 16, 16);

    connections.forEach(({ from, to, color }) => {
      const p1 = stagePosMap.get(from);
      const p2 = stagePosMap.get(to);
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 0.35;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      
      // Outer glass protective conduit
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.06, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x1f2e3c,
        transparent: true,
        opacity: 0.6,
        roughness: 0.3,
        metalness: 0.8
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Flowing data packets
      for (let i = 0; i < 2; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: color });
        const pMesh = new THREE.Mesh(packetGeo, pMat);
        scene.add(pMesh);
        packetTokens.push({
          mesh: pMesh,
          curve,
          offset: (i * 0.5) + Math.random() * 0.1,
          speed: 0.007 + Math.random() * 0.002
        });
      }
    });

    // 7. Raycasting for Clicking Pedestals
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
        let parent: THREE.Object3D | null = intersects[0].object;
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

      const time = clock.getElapsedTime();
      controls.update();

      if (!isPaused) {
        // Continuous Flow of Data Packets
        packetTokens.forEach((p) => {
          p.offset = (p.offset + p.speed) % 1;
          const pos = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pos);
        });

        // Rotate stage cores & highlight active selection
        stageMeshes.forEach(({ group, stage, coreMesh, ringMesh }) => {
          if (coreMesh) {
            coreMesh.rotation.y += 0.012;
          }

          const isSelected = activeStage.id === stage.id;
          if (isSelected) {
            group.scale.setScalar(1.06 + Math.sin(time * 3.0) * 0.02);
            (ringMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
          } else {
            group.scale.setScalar(1.0);
            (ringMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.1;
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
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPaused, activeStage.id]);

  return (
    <div className="w-full rounded-card border border-line bg-card overflow-hidden shadow-panel">
      {/* 3D Header Bar with Simulation & View Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-line px-5 py-3.5 bg-hero">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-button bg-accent/20 text-tech border border-accent/30 shadow-sm">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <span>Differential Architecture Pipeline</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-card text-ink-secondary border border-line uppercase">
                Interactive 3D Pipeline
              </span>
            </h3>
            <p className="text-xs text-ink-secondary">
              Input ➔ Twin Isolated Sandboxes (v3 vs v4) ➔ Deterministic AST Comparator ➔ NVIDIA Nemotron
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 mt-2 sm:mt-0">
          <button
            onClick={triggerSimulation}
            disabled={isSimulating}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-button text-xs font-mono font-bold transition-all shadow-glowBlue ${
              isSimulating
                ? 'bg-status-warning text-black animate-pulse'
                : 'bg-accent hover:bg-accent-hover text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{isSimulating ? `Simulating: ${simStep}` : 'Simulate Test Vector'}</span>
          </button>

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

      {/* 3D WebGL Canvas Viewport (100% Unobstructed & Crystal Clear) */}
      <div className="relative w-full h-[380px] bg-bg/40 backdrop-blur-sm cursor-grab active:cursor-grabbing border-b border-line">
        <div ref={mountRef} className="w-full h-full" />

        {/* Top Floating Helper Controls */}
        <div className="absolute top-3.5 left-4 pointer-events-none flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/90 border border-line text-[11px] text-ink-secondary font-mono shadow-card backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-tech animate-pulse" />
            Click any 3D pod to inspect • Drag to rotate 360° • Scroll to zoom
          </span>
        </div>
      </div>

      {/* Dedicated Inspection Panel (Positioned Below Canvas - Zero View Obstruction!) */}
      <div className="p-4 sm:p-5 bg-card/90 border-b border-line text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-line gap-2">
          <div className="flex items-center space-x-2.5">
            <span 
              className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-sm"
              style={{ backgroundColor: activeStage.hex }}
            >
              {activeStage.badge}
            </span>
            <span className="font-heading font-bold text-white text-sm sm:text-base">
              {activeStage.title}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded border border-line bg-hero text-tech flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-tech" />
            {activeStage.quarantineSpecs}
          </span>
        </div>

        <p className="text-ink-secondary text-xs sm:text-sm leading-relaxed">
          {activeStage.description}
        </p>

        {/* Live Code Snippet Preview */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-tech uppercase font-bold flex items-center gap-1.5">
            <Code2 className="h-3 w-3" />
            Runtime Execution Vector:
          </span>
          <pre className="p-3 rounded border border-line bg-[#16202a] text-xs font-mono text-tech overflow-x-auto leading-relaxed">
            <code>{activeStage.codeSnippet}</code>
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-line text-xs font-mono">
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-bold mb-0.5">Execution Mechanism:</span>
            <span className="text-white block leading-relaxed">{activeStage.mechanism}</span>
          </div>
          <div>
            <span className="text-tech block text-[10px] uppercase font-bold mb-0.5">Soundness & Verdict Role:</span>
            <span className="text-ink-secondary block leading-relaxed">{activeStage.verdictRole}</span>
          </div>
        </div>
      </div>

      {/* 5-Step Clear Interactive Stage Bar */}
      <div className="bg-hero p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {STAGES.map((s) => {
            const isSelected = activeStage.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s)}
                className={`text-left p-3 rounded-card border transition-all ${
                  isSelected
                    ? 'bg-card border-accent shadow-glowBlue ring-1 ring-accent'
                    : 'bg-card/70 border-line hover:bg-card text-ink-secondary hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-tech">
                    STEP {s.step}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full shadow-sm"
                    style={{ backgroundColor: s.hex }}
                  />
                </div>
                <div className={`font-heading text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-ink-secondary'}`}>
                  {s.shortLabel}
                </div>
                <div className="text-[11px] text-ink-muted font-mono truncate mt-1">
                  {s.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
