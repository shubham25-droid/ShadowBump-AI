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
  Sparkles,
  Zap,
  Code2,
  Lock,
  Compass
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
    shortLabel: 'Input Stream',
    badge: 'STAGE 01 • DISPATCHER',
    tag: 'Input Dispatcher',
    coords: [-6.4, 0, 0],
    color: 0x0064d2, // Royal Cobalt Blue
    hex: '#0064d2',
    description: 'Generates or loads identical test payloads and dispatches identical JSON vectors to both environments simultaneously over stdin.',
    mechanism: 'Piped through stdin to isolated Node.js child processes without network or disk mutation.',
    verdictRole: 'Guarantees that 100% of observable differences are caused by library code changes, eliminating test pollution.',
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
    verdictRole: 'Establishes the ground-truth benchmark. Custom error messages and error.errors properties are honored.',
    codeSnippet: 'z.string({ required_error: "Username is required" });\n// v3 Output: "Username is required"\n// v3 error.errors: defined Array(1)',
    quarantineSpecs: 'Child Process • 5s Watchdog • Zero Net Access'
  },
  {
    id: 'v4-box',
    step: '02B',
    title: 'Candidate Sandbox (zod@4.6.7)',
    shortLabel: 'Candidate v4',
    badge: 'STAGE 02B • UPGRADE TARGET',
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
    shortLabel: 'AST Diff',
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

// Helper to generate high-DPI 3D Billboard Canvas Labels
function createBillboardLabel(title: string, subtitle: string, badgeColor: string, tag: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Smooth background container with glowing border
  ctx.fillStyle = 'rgba(8, 24, 39, 0.92)';
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 144, 20);
  ctx.fill();
  ctx.stroke();

  // Top Accent Tag Pill
  ctx.fillStyle = badgeColor;
  ctx.beginPath();
  ctx.roundRect(24, 24, 180, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(tag.toUpperCase(), 36, 45);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(title, 24, 88);

  // Subtitle
  ctx.fillStyle = '#bcd2e5';
  ctx.font = '16px monospace';
  ctx.fillText(subtitle, 24, 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true, 
    depthTest: false 
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.4, 1.06, 1.0);
  return sprite;
}

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
    setSimStep('INPUT_DISPATCH');
    setActiveStage(STAGES[0]);

    setTimeout(() => {
      setSimStep('TWIN_EXECUTION');
      setActiveStage(STAGES[2]); // Show candidate v4 regression
    }, 1200);

    setTimeout(() => {
      setSimStep('AST_DIFF_DETECTION');
      setActiveStage(STAGES[3]); // Show comparator
    }, 2600);

    setTimeout(() => {
      setSimStep('NVIDIA_SYNTHESIS');
      setActiveStage(STAGES[4]); // Show NVIDIA AI
    }, 4000);

    setTimeout(() => {
      setSimStep('COMPLETED');
      setIsSimulating(false);
    }, 5500);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 500;

    // 1. Scene, Camera, WebGL Renderer (Transparent to blend with clinical atmosphere)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 17.5);
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

    // 2. Full-featured OrbitControls for user exploration
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above floor
    controls.minDistance = 8;
    controls.maxDistance = 28;
    controls.enablePan = true;

    // 3. Clinical Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    dirLight.position.set(12, 18, 12);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x0064d2, 0.9);
    fillLight.position.set(-12, -6, -6);
    scene.add(fillLight);

    // 4. Reflective Floor Grid with Cyan/Navy Traces
    const grid = new THREE.GridHelper(36, 36, 0x1c456e, 0x0c243e);
    grid.position.y = -3.6;
    scene.add(grid);

    // Ambient floating data particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.45
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 5. Multi-tiered Architectural Pedestals with Holographic Containment Shields
    const stageMeshes: { 
      group: THREE.Group; 
      stage: StageTelemetry; 
      coreMesh: THREE.Mesh | THREE.Group; 
      ringMesh: THREE.Mesh;
      shieldMesh?: THREE.Mesh;
      billboard: THREE.Sprite;
    }[] = [];
    const stagePosMap = new Map<string, THREE.Vector3>();

    STAGES.forEach((stage) => {
      const pos = new THREE.Vector3(...stage.coords);
      stagePosMap.set(stage.id, pos);

      const group = new THREE.Group();
      group.position.copy(pos);
      group.userData = { stage };

      // Base Pedestal (Brushed Dark Slate Steel)
      const baseGeo = new THREE.CylinderGeometry(1.45, 1.6, 0.45, 48);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0c243e,
        roughness: 0.25,
        metalness: 0.8
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      group.add(baseMesh);

      // Upper Chrome Bevel Ring
      const bevelGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.12, 36);
      const bevelMat = new THREE.MeshStandardMaterial({
        color: 0x1c456e,
        roughness: 0.15,
        metalness: 0.95
      });
      const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
      bevelMesh.position.y = 0.26;
      group.add(bevelMesh);

      // Outer Glowing LED Perimeter Ring
      const ringGeo = new THREE.TorusGeometry(1.62, 0.05, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({ 
        color: stage.color,
        emissive: stage.color,
        emissiveIntensity: 1.6,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.18;
      group.add(ringMesh);

      let coreMesh: THREE.Mesh | THREE.Group;
      let shieldMesh: THREE.Mesh | undefined;

      // Customized Core Geometry per Architectural Stage
      if (stage.id === 'inputs') {
        // Stage 1: Dual Icosahedron Core
        const coreGeo = new THREE.IcosahedronGeometry(0.68, 0);
        const coreMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.6,
          metalness: 0.85,
          roughness: 0.15
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.y = 1.05;
        group.add(coreMesh);
      } else if (stage.id === 'v3-box' || stage.id === 'v4-box') {
        // Stages 2A & 2B: Silicon Microchip Die inside Frosted Containment Chamber
        const sandboxGroup = new THREE.Group();

        // Silicon die stack
        const chipGeo = new THREE.BoxGeometry(0.9, 0.25, 0.9);
        const chipMat = new THREE.MeshStandardMaterial({
          color: 0x081827,
          metalness: 0.9,
          roughness: 0.1
        });
        const chip = new THREE.Mesh(chipGeo, chipMat);
        chip.position.y = 0.55;
        sandboxGroup.add(chip);

        // Glowing silicon core glyph
        const glyphGeo = new THREE.OctahedronGeometry(0.48, 0);
        const glyphMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.8,
          metalness: 0.9,
          roughness: 0.1
        });
        const glyph = new THREE.Mesh(glyphGeo, glyphMat);
        glyph.position.y = 1.15;
        sandboxGroup.add(glyph);

        // Transparent Quarantined Glass Cylinder
        const shieldGeo = new THREE.CylinderGeometry(1.25, 1.25, 1.8, 32, 1, true);
        const shieldMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          transparent: true,
          opacity: 0.2,
          roughness: 0.1,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.position.y = 1.1;
        sandboxGroup.add(shieldMesh);

        // Shield top rim
        const shieldRimGeo = new THREE.TorusGeometry(1.25, 0.035, 16, 48);
        const shieldRimMat = new THREE.MeshBasicMaterial({ color: stage.color });
        const shieldRim = new THREE.Mesh(shieldRimGeo, shieldRimMat);
        shieldRim.rotation.x = Math.PI / 2;
        shieldRim.position.y = 2.0;
        sandboxGroup.add(shieldRim);

        coreMesh = sandboxGroup;
        group.add(sandboxGroup);
      } else if (stage.id === 'comparator') {
        // Stage 3: Interlocking Dual Wireframe Cubes (Structural AST Diff)
        const compGroup = new THREE.Group();
        const innerGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
        const innerMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.7,
          metalness: 0.8,
          roughness: 0.2
        });
        const innerBox = new THREE.Mesh(innerGeo, innerMat);
        innerBox.position.y = 1.1;
        compGroup.add(innerBox);

        const outerGeo = new THREE.BoxGeometry(1.15, 1.15, 1.15);
        const outerMat = new THREE.MeshBasicMaterial({
          color: stage.color,
          wireframe: true
        });
        const outerBox = new THREE.Mesh(outerGeo, outerMat);
        outerBox.position.y = 1.1;
        compGroup.add(outerBox);

        coreMesh = compGroup;
        group.add(compGroup);
      } else {
        // Stage 4: NVIDIA Nemotron Neural Sphere with Gyroscopic Electron Orbit Rings
        const aiGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: stage.color,
          emissive: stage.color,
          emissiveIntensity: 0.85,
          metalness: 0.8,
          roughness: 0.1
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.y = 1.1;
        aiGroup.add(sphere);

        // Gyro ring 1
        const gyro1Geo = new THREE.TorusGeometry(0.95, 0.035, 16, 48);
        const gyro1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const gyro1 = new THREE.Mesh(gyro1Geo, gyro1Mat);
        gyro1.position.y = 1.1;
        gyro1.rotation.x = Math.PI / 3;
        aiGroup.add(gyro1);

        // Gyro ring 2
        const gyro2Geo = new THREE.TorusGeometry(1.05, 0.035, 16, 48);
        const gyro2Mat = new THREE.MeshBasicMaterial({ color: 0x0064d2 });
        const gyro2 = new THREE.Mesh(gyro2Geo, gyro2Mat);
        gyro2.position.y = 1.1;
        gyro2.rotation.y = Math.PI / 4;
        aiGroup.add(gyro2);

        coreMesh = aiGroup;
        group.add(aiGroup);
      }

      // 3D Billboard Canvas Label hovering directly over node
      const billboard = createBillboardLabel(
        stage.shortLabel, 
        stage.tag, 
        stage.hex, 
        `STEP ${stage.step}`
      );
      billboard.position.set(0, 2.7, 0);
      group.add(billboard);

      scene.add(group);
      stageMeshes.push({ group, stage, coreMesh, ringMesh, shieldMesh, billboard });
    });

    // 6. Dual-layer Optical Fiber Conduits with Flowing Laser Data Packets
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

    const packetGeo = new THREE.SphereGeometry(0.18, 16, 16);

    connections.forEach(({ from, to, color }) => {
      const p1 = stagePosMap.get(from);
      const p2 = stagePosMap.get(to);
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 0.45;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      
      // Outer glass protective conduit
      const outerTubeGeo = new THREE.TubeGeometry(curve, 48, 0.08, 12, false);
      const outerTubeMat = new THREE.MeshStandardMaterial({
        color: 0x0c243e,
        transparent: true,
        opacity: 0.65,
        roughness: 0.3,
        metalness: 0.8
      });
      const outerTube = new THREE.Mesh(outerTubeGeo, outerTubeMat);
      scene.add(outerTube);

      // Inner illuminated core rail
      const innerRailGeo = new THREE.TubeGeometry(curve, 48, 0.025, 8, false);
      const innerRailMat = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8
      });
      const innerRail = new THREE.Mesh(innerRailGeo, innerRailMat);
      scene.add(innerRail);

      // Multi-packet photon stream
      for (let i = 0; i < 3; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: color });
        const pMesh = new THREE.Mesh(packetGeo, pMat);
        scene.add(pMesh);
        packetTokens.push({
          mesh: pMesh,
          curve,
          offset: (i * 0.33) + Math.random() * 0.1,
          speed: 0.0075 + Math.random() * 0.002
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

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update OrbitControls
      controls.update();

      if (!isPaused) {
        // Continuous Flow of Data Packets
        packetTokens.forEach((p) => {
          p.offset = (p.offset + p.speed) % 1;
          const pos = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pos);
        });

        // Rotate stage cores & highlight active selection
        stageMeshes.forEach(({ group, stage, coreMesh, ringMesh, shieldMesh }) => {
          if (coreMesh) {
            coreMesh.rotation.y += 0.015;
          }

          if (shieldMesh) {
            shieldMesh.rotation.y -= 0.008;
          }

          const isSelected = activeStage.id === stage.id;
          if (isSelected) {
            group.scale.setScalar(1.08 + Math.sin(time * 3.5) * 0.025);
            (ringMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.4;
          } else {
            group.scale.setScalar(1.0);
            (ringMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.3;
          }
        });

        // Subtle floating motion on background data particles
        particleField.rotation.y = time * 0.018;
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
      {/* 3D Header Bar with Live Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-line px-5 py-3.5 bg-hero">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-button bg-accent/20 text-tech border border-accent/40 shadow-sm">
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

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[500px] bg-bg/50 backdrop-blur-sm cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Top Floating Helper Controls */}
        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 border border-line text-xs text-ink-secondary font-mono shadow-card backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tech animate-pulse" />
            Click any 3D pedestal to inspect • Drag to rotate 360° • Scroll to zoom
          </span>
        </div>

        {/* Floating Telemetry & Code Inspection Card (Non-Truncated, Full Details) */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg pointer-events-auto">
          <div className="p-4 sm:p-5 rounded-card border border-line bg-card/95 backdrop-blur-md shadow-panel text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-sm"
                  style={{ backgroundColor: activeStage.hex }}
                >
                  {activeStage.badge}
                </span>
                <span className="font-heading font-bold text-white text-sm">
                  {activeStage.title}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-hero text-tech flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {activeStage.quarantineSpecs}
              </span>
            </div>

            <p className="text-ink-secondary text-xs leading-relaxed">
              {activeStage.description}
            </p>

            {/* Live Code Snippet Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-tech uppercase font-bold flex items-center gap-1">
                <Code2 className="h-3 w-3" />
                Runtime Execution Vector:
              </span>
              <pre className="p-2.5 rounded border border-line bg-[#081827] text-[11px] font-mono text-tech overflow-x-auto leading-relaxed">
                <code>{activeStage.codeSnippet}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-line text-[11px] font-mono">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase font-bold">Mechanism:</span>
                <span className="text-white block leading-snug">{activeStage.mechanism}</span>
              </div>
              <div>
                <span className="text-tech block text-[10px] uppercase font-bold">Why It Matters:</span>
                <span className="text-ink-secondary block leading-snug">{activeStage.verdictRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Clear Interactive Stage Bar */}
      <div className="border-t border-line bg-hero p-3 sm:p-4">
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
                  {s.title}
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
