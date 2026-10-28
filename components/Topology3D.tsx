'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Cpu, 
  ArrowRight, 
  Server, 
  Binary, 
  Sparkles, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Info,
  RotateCcw,
  Pause,
  Play
} from 'lucide-react';

interface TopologyNode {
  id: string;
  number: number;
  label: string;
  stage: string;
  coords: [number, number, number]; // 3D coordinates
  color: number; // Hex color for Three.js
  hexString: string;
  description: string;
  technicalDetails: {
    inputs: string;
    processing: string;
    outputs: string;
    isolation: string;
  };
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'dep-config',
    number: 1,
    label: 'Dependency Configuration',
    stage: 'Input Spec',
    coords: [-6, 2, 0],
    color: 0x0284c7, // Sky
    hexString: '#0284c7',
    description: 'Defines target dependency (zod), baseline version (v3.23.8), candidate version (v4.6.7), and validation schemas.',
    technicalDetails: {
      inputs: 'Scenario definition, target semver ranges',
      processing: 'Resolves environment dependencies, validates schema definitions',
      outputs: 'Environment launch blueprints',
      isolation: 'Static config / No execution'
    }
  },
  {
    id: 'input-stream',
    number: 2,
    label: 'Shared Test Input Stream',
    stage: 'Vector Feed',
    coords: [-2.5, 2, 0],
    color: 0x38bdf8, // Light sky
    hexString: '#38bdf8',
    description: 'Generates and delivers identical test vectors to both execution environments simultaneously to guarantee parity.',
    technicalDetails: {
      inputs: 'Deterministic edge-case corpus & fuzz candidates',
      processing: 'Synchronized JSON vector serialization',
      outputs: 'Identical payload streams piped to stdin',
      isolation: 'Memory bounded test-vector queue'
    }
  },
  {
    id: 'env-old',
    number: 3,
    label: 'Old Runtime Environment',
    stage: 'Sandbox v3',
    coords: [1, 3.5, -2],
    color: 0x10b981, // Emerald
    hexString: '#10b981',
    description: 'Isolated Node.js child process running Zod v3.23.8. Captures baseline outputs, ZodError instances, and legacy properties.',
    technicalDetails: {
      inputs: 'Stdin stream with test inputs',
      processing: 'zod@3.23.8 execution with 5s timeout & stripped env',
      outputs: 'JSON results: output values, errors, error.errors access',
      isolation: 'Separate process, no secrets inherited'
    }
  },
  {
    id: 'env-new',
    number: 4,
    label: 'New Runtime Environment',
    stage: 'Sandbox v4',
    coords: [1, 0.5, 2],
    color: 0x8b5cf6, // Violet
    hexString: '#8b5cf6',
    description: 'Parallel isolated Node.js child process running Zod v4.6.7 under identical constraints.',
    technicalDetails: {
      inputs: 'Stdin stream with test inputs (identical to v3)',
      processing: 'zod@4.6.7 execution with 5s timeout & stripped env',
      outputs: 'JSON results: output values, errors, missing error.errors',
      isolation: 'Separate process, no secrets inherited'
    }
  },
  {
    id: 'diff-comparator',
    number: 5,
    label: 'Deterministic Comparator',
    stage: 'Diff Engine',
    coords: [4.5, 2, 0],
    color: 0xf59e0b, // Amber
    hexString: '#f59e0b',
    description: 'AST & semantic diff engine. Compares results deterministically, distinguishing behavioral differences from confirmed regressions.',
    technicalDetails: {
      inputs: 'Old & New environment result payloads',
      processing: 'Deep structural comparison, custom error retention check',
      outputs: 'Classified diff items: MATCH, DIFF, REGRESSION',
      isolation: 'Deterministic in-memory diff algorithm'
    }
  },
  {
    id: 'evidence-collector',
    number: 6,
    label: 'Evidence Synthesizer',
    stage: 'Evidence Pack',
    coords: [7.5, 2, 0],
    color: 0xec4899, // Pink
    hexString: '#ec4899',
    description: 'Prunes irrelevant data and packages the smallest useful evidence payload with side-by-side reproduction cases.',
    technicalDetails: {
      inputs: 'Classified diffs & failing input cases',
      processing: 'Normalization, stack trace scrubbing, snippet generation',
      outputs: 'Clean prompt payload for NVIDIA Nemotron',
      isolation: 'Zero PII / Sanitized payload'
    }
  },
  {
    id: 'nebius-model',
    number: 7,
    label: 'NVIDIA Nemotron via Nebius',
    stage: 'AI Inference',
    coords: [10.5, 3.2, 0],
    color: 0x14b8a6, // Teal
    hexString: '#14b8a6',
    description: 'Real runtime call to Nebius Token Factory querying NVIDIA Llama-3.1-Nemotron-70B for root cause synthesis and code remedies.',
    technicalDetails: {
      inputs: 'Empirical diff evidence package via OpenAI-compatible API',
      processing: 'NVIDIA Nemotron-70B reasoning at temp=0.1',
      outputs: 'Root cause explanation, blast radius, migration code diff',
      isolation: 'Server-side only (API key never exposed to client)'
    }
  },
  {
    id: 'final-report',
    number: 8,
    label: 'Diagnostic Report',
    stage: 'Decision Artifact',
    coords: [13.5, 2, 0],
    color: 0x22c55e, // Green
    hexString: '#22c55e',
    description: 'Interactive developer report featuring side-by-side AST diffs, risk assessment, and one-click copyable reproduction scripts.',
    technicalDetails: {
      inputs: 'Deterministic comparison + NVIDIA AI synthesis',
      processing: 'Report structuring & reproducible script formatting',
      outputs: 'Actionable developer inspection view',
      isolation: 'Client-rendered structured interface'
    }
  }
];

// Connection edges indicating data flow
const EDGES: [string, string][] = [
  ['dep-config', 'input-stream'],
  ['input-stream', 'env-old'],
  ['input-stream', 'env-new'],
  ['env-old', 'diff-comparator'],
  ['env-new', 'diff-comparator'],
  ['diff-comparator', 'evidence-collector'],
  ['evidence-collector', 'nebius-model'],
  ['nebius-model', 'final-report'],
  ['evidence-collector', 'final-report'] // Direct bypass line
];

export default function Topology3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<TopologyNode>(TOPOLOGY_NODES[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(3.5, 7, 18);
    camera.lookAt(3.5, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 2, 50);
    pointLight.position.set(4, 5, 5);
    scene.add(pointLight);

    // 3. Grid Plane (Subtle engineering floor)
    const gridHelper = new THREE.GridHelper(36, 36, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // 4. Create 3D Nodes
    const nodeMeshes: { mesh: THREE.Mesh; node: TopologyNode }[] = [];
    const nodeLookup = new Map<string, THREE.Vector3>();

    TOPOLOGY_NODES.forEach((node) => {
      const pos = new THREE.Vector3(...node.coords);
      nodeLookup.set(node.id, pos);

      // Node base geometry: Cylinder with rounded top or bevel
      const geometry = new THREE.CylinderGeometry(0.75, 0.85, 0.6, 24);
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.2,
        metalness: 0.7,
        emissive: node.color,
        emissiveIntensity: 0.25
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      mesh.userData = { node };
      scene.add(mesh);
      nodeMeshes.push({ mesh, node });

      // Pulsing outer orbit ring
      const ringGeo = new THREE.RingGeometry(1.05, 1.15, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(pos);
      ring.position.y -= 0.25;
      scene.add(ring);
    });

    // 5. Create Connection Curves & Animated Flow Particles
    const curves: THREE.CatmullRomCurve3[] = [];
    const particlesList: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number; speed: number }[] = [];

    const particleGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    EDGES.forEach(([fromId, toId]) => {
      const p1 = nodeLookup.get(fromId);
      const p2 = nodeLookup.get(toId);
      if (!p1 || !p2) return;

      // Arc middle point
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      // Lift the arc slightly
      mid.y += (p1.z !== p2.z) ? 0.8 : 0.4;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      curves.push(curve);

      // Tube geometry for line
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.5,
        metalness: 0.3,
        transparent: true,
        opacity: 0.7
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Add flowing data packet particle
      const pMesh = new THREE.Mesh(particleGeo, particleMat);
      scene.add(pMesh);
      particlesList.push({
        mesh: pMesh,
        curve: curve,
        offset: Math.random(),
        speed: 0.004 + Math.random() * 0.002
      });
    });

    // 6. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        if (clickedMesh.userData?.node) {
          setSelectedNode(clickedMesh.userData.node);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isPaused) {
        const delta = clock.getDelta();

        // Update flowing particles
        particlesList.forEach(p => {
          p.offset = (p.offset + p.speed) % 1;
          const pos = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pos);
        });

        // Gentle camera orbit if not actively interacting
        const time = clock.getElapsedTime() * 0.2;
        camera.position.x = 3.5 + Math.sin(time) * 0.8;
        camera.position.y = 7 + Math.cos(time * 0.7) * 0.3;
        camera.lookAt(3.5, 2, 0);

        // Highlight selected node
        nodeMeshes.forEach(({ mesh, node }) => {
          const isSelected = selectedNode.id === node.id;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = isSelected ? 0.8 : 0.25;
          mesh.scale.setScalar(isSelected ? 1.15 : 1.0);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPaused, selectedNode.id]);

  return (
    <div className="w-full rounded-xl border border-surface-border bg-surface-card overflow-hidden shadow-2xl">
      {/* Topology Header Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-border px-4 py-3 bg-surface-200/80">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200">
            Interactive Architecture Topology
          </h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            (8-Stage Differential Pipeline)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={isPaused ? 'Resume 3D animation' : 'Pause animation (Reduced Motion)'}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            onClick={() => setSelectedNode(TOPOLOGY_NODES[0])}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Reset focus to Stage 1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative w-full h-[440px] bg-[#090d16] cursor-pointer">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Quick Hint */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-sky-400" />
            Click any 3D node to inspect pipeline data flow
          </span>
        </div>

        {/* Selected Stage HUD Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md pointer-events-auto">
          <div className="p-3.5 rounded-lg border border-slate-700/80 bg-slate-900/95 backdrop-blur-md shadow-xl text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span 
                  className="inline-flex items-center justify-center h-5 w-5 rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: selectedNode.hexString }}
                >
                  {selectedNode.number}
                </span>
                <span className="font-semibold text-slate-100 text-sm">
                  {selectedNode.label}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950">
                {selectedNode.stage}
              </span>
            </div>
            <p className="text-slate-300 text-xs mb-2.5 leading-relaxed">
              {selectedNode.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800 pt-2 font-mono">
              <div>
                <span className="text-slate-400 block">Processing:</span>
                <span className="text-slate-200 truncate block">{selectedNode.technicalDetails.processing}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Isolation:</span>
                <span className="text-sky-300 truncate block">{selectedNode.technicalDetails.isolation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Node Selector Tabs (Ensures Keyboard & Touch Accessibility) */}
      <div className="border-t border-surface-border bg-surface-200 p-2 sm:p-3 overflow-x-auto">
        <div className="flex items-center space-x-1.5 min-w-max">
          {TOPOLOGY_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: node.hexString }} 
                />
                <span>{node.number}. {node.stage}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
