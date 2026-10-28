'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ExternalLink } from 'lucide-react';

interface WorkflowNode {
  id: string;
  title: string;
  label: string;
  status: string;
  details: {
    purpose: string;
    mechanism: string;
    boundary: string;
  };
  linkHref?: string;
  linkText?: string;
}

const WORKFLOW_NODES: Record<string, WorkflowNode> = {
  inputs: {
    id: 'inputs',
    title: 'Test Input Stream',
    label: 'Identical JSON Vectors',
    status: 'Ready',
    details: {
      purpose: 'Feeds identical input vectors to both environments concurrently.',
      mechanism: 'Synchronized stdin serialization without shared memory.',
      boundary: 'Sanitized input queue (memory-bounded).'
    },
    linkHref: '/workspace',
    linkText: 'Configure inputs in Workspace'
  },
  v3: {
    id: 'v3',
    title: 'Old Version Execution',
    label: 'zod@3.23.8 Baseline',
    status: 'Isolated Subprocess',
    details: {
      purpose: 'Runs baseline schema validation and records existing output structure.',
      mechanism: 'Isolated Node.js child process with 5s timeout.',
      boundary: 'Stripped environment (zero access to host secrets).'
    }
  },
  v4: {
    id: 'v4',
    title: 'New Version Execution',
    label: 'zod@4.6.7 Candidate',
    status: 'Isolated Subprocess',
    details: {
      purpose: 'Runs identical inputs against target upgraded package.',
      mechanism: 'Parallel isolated Node.js child process with 5s timeout.',
      boundary: 'Stripped environment (zero access to host secrets).'
    }
  },
  comparator: {
    id: 'comparator',
    title: 'Comparison Engine',
    label: 'Deterministic Diff',
    status: 'Deterministic Rule',
    details: {
      purpose: 'Compares return data, error arrays, and property removals without AI guessing.',
      mechanism: 'Deep structural AST equality and explicit oracle checks.',
      boundary: 'In-memory deterministic algorithm.'
    },
    linkHref: '/results',
    linkText: 'View latest comparison findings'
  },
  differences: {
    id: 'differences',
    title: 'Observed Differences',
    label: 'Empirical Evidence',
    status: 'Categorized Output',
    details: {
      purpose: 'Separates benign changes from contract-breaking potential regressions.',
      mechanism: 'Four-tier classification: Match, Difference, Regression, Error.',
      boundary: 'Empirically verified diff payload.'
    },
    linkHref: '/results',
    linkText: 'Inspect evidence diffs'
  },
  ai: {
    id: 'ai',
    title: 'AI Root-Cause Explanation',
    label: 'NVIDIA Nemotron via Nebius',
    status: 'Evidence-Grounded',
    details: {
      purpose: 'Explains underlying architectural breaking changes and generates migration fixes.',
      mechanism: 'Queries nvidia/Llama-3.1-Nemotron-70B on Nebius Token Factory at temp=0.1.',
      boundary: 'Server-side only (API key never exposed to browser).'
    }
  }
};

export default function WorkflowDiagram() {
  const [selectedId, setSelectedId] = useState<string>('comparator');
  const activeNode = WORKFLOW_NODES[selectedId] || WORKFLOW_NODES.comparator;

  return (
    <div className="rounded-lg border border-line bg-panel p-5 shadow-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            Execution Flow Diagram
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Controlled differential testing pipeline from input dispatch to evidence-grounded AI synthesis.
          </p>
        </div>
        <span className="text-[11px] font-mono text-ink-secondary">
          Click any node to inspect technical details
        </span>
      </div>

      {/* 2D Interactive Diagram */}
      <div className="py-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          {/* Node 1: Inputs */}
          <button
            type="button"
            onClick={() => setSelectedId('inputs')}
            className={`flex-1 p-3.5 rounded border text-left transition-colors ${
              selectedId === 'inputs'
                ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                : 'border-line bg-panel hover:bg-background text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Step 01</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-line bg-background text-ink-secondary">
                Input
              </span>
            </div>
            <div className="font-bold text-ink-primary">{WORKFLOW_NODES.inputs.title}</div>
            <div className="text-[11px] text-ink-secondary mt-0.5">{WORKFLOW_NODES.inputs.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4" />
            <ArrowDown className="lg:hidden h-4 w-4" />
          </div>

          {/* Parallel Block: Old vs New */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Top Branch: Old */}
            <button
              type="button"
              onClick={() => setSelectedId('v3')}
              className={`p-3 rounded border text-left transition-colors ${
                selectedId === 'v3'
                  ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                  : 'border-line bg-panel hover:bg-background text-ink-primary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-ink-secondary uppercase">Parallel A</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-status-success-bg text-status-success font-medium">
                  v3 Baseline
                </span>
              </div>
              <div className="font-bold text-ink-primary text-xs">{WORKFLOW_NODES.v3.title}</div>
              <div className="text-[11px] text-ink-secondary font-mono mt-0.5">{WORKFLOW_NODES.v3.label}</div>
            </button>

            {/* Bottom Branch: New */}
            <button
              type="button"
              onClick={() => setSelectedId('v4')}
              className={`p-3 rounded border text-left transition-colors ${
                selectedId === 'v4'
                  ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                  : 'border-line bg-panel hover:bg-background text-ink-primary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-ink-secondary uppercase">Parallel B</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-line bg-background text-ink-secondary font-medium">
                  v4 Candidate
                </span>
              </div>
              <div className="font-bold text-ink-primary text-xs">{WORKFLOW_NODES.v4.title}</div>
              <div className="text-[11px] text-ink-secondary font-mono mt-0.5">{WORKFLOW_NODES.v4.label}</div>
            </button>
          </div>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4" />
            <ArrowDown className="lg:hidden h-4 w-4" />
          </div>

          {/* Node 3: Comparison Engine */}
          <button
            type="button"
            onClick={() => setSelectedId('comparator')}
            className={`flex-1 p-3.5 rounded border text-left transition-colors ${
              selectedId === 'comparator'
                ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                : 'border-line bg-panel hover:bg-background text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Step 03</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-subtle text-accent font-medium">
                Diff Engine
              </span>
            </div>
            <div className="font-bold text-ink-primary">{WORKFLOW_NODES.comparator.title}</div>
            <div className="text-[11px] text-ink-secondary mt-0.5">{WORKFLOW_NODES.comparator.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4" />
            <ArrowDown className="lg:hidden h-4 w-4" />
          </div>

          {/* Node 4: Differences */}
          <button
            type="button"
            onClick={() => setSelectedId('differences')}
            className={`flex-1 p-3.5 rounded border text-left transition-colors ${
              selectedId === 'differences'
                ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                : 'border-line bg-panel hover:bg-background text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Step 04</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-line bg-background text-ink-secondary">
                Evidence
              </span>
            </div>
            <div className="font-bold text-ink-primary">{WORKFLOW_NODES.differences.title}</div>
            <div className="text-[11px] text-ink-secondary mt-0.5">{WORKFLOW_NODES.differences.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4" />
            <ArrowDown className="lg:hidden h-4 w-4" />
          </div>

          {/* Node 5: AI Explanation */}
          <button
            type="button"
            onClick={() => setSelectedId('ai')}
            className={`flex-1 p-3.5 rounded border text-left transition-colors ${
              selectedId === 'ai'
                ? 'border-accent bg-accent-subtle/50 text-ink-primary ring-1 ring-accent'
                : 'border-line bg-panel hover:bg-background text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-secondary uppercase">Step 05</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background border border-line text-ink-secondary">
                Synthesis
              </span>
            </div>
            <div className="font-bold text-ink-primary">{WORKFLOW_NODES.ai.title}</div>
            <div className="text-[11px] text-ink-secondary mt-0.5">{WORKFLOW_NODES.ai.label}</div>
          </button>
        </div>
      </div>

      {/* Selected Node Technical Details Drawer */}
      <div className="mt-2 p-4 rounded border border-line bg-background text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-line">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-ink-primary text-sm">
              {activeNode.title}
            </span>
            <span className="text-[11px] font-mono text-ink-secondary">
              ({activeNode.label})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-panel text-ink-primary">
              Status: {activeNode.status}
            </span>
          </div>

          {activeNode.linkHref && (
            <Link
              href={activeNode.linkHref}
              className="inline-flex items-center space-x-1 text-accent hover:text-accent-hover font-medium text-xs"
            >
              <span>{activeNode.linkText}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-ink-secondary">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
              Purpose
            </span>
            <p className="leading-relaxed">{activeNode.details.purpose}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
              Mechanism
            </span>
            <p className="leading-relaxed">{activeNode.details.mechanism}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
              Isolation Boundary
            </span>
            <p className="leading-relaxed font-mono text-[11px] text-ink-primary">
              {activeNode.details.boundary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
