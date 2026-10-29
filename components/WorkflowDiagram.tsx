'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Cpu, GitCompare } from 'lucide-react';

interface WorkflowNode {
  id: string;
  title: string;
  label: string;
  tag: string;
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
    tag: 'Input Dispatcher',
    status: 'Ready',
    details: {
      purpose: 'Feeds identical input vectors to both environments concurrently without shared memory.',
      mechanism: 'Synchronized stdin serialization directly into isolated child process standard input.',
      boundary: 'Sanitized input queue; memory-bounded payload.'
    },
    linkHref: '/workspace',
    linkText: 'Configure inputs in Workspace'
  },
  v3: {
    id: 'v3',
    title: 'Baseline Runtime',
    label: 'zod@3.23.8 Oracle',
    tag: 'Ground-Truth Oracle',
    status: 'Quarantined Process',
    details: {
      purpose: 'Runs baseline schema validation and establishes the ground-truth expected outcome.',
      mechanism: 'Isolated Node.js child process under a strict 5-second watchdog timer.',
      boundary: 'Stripped environment with no host secrets or mutation access.'
    }
  },
  v4: {
    id: 'v4',
    title: 'Candidate Runtime',
    label: 'zod@4.6.7 Upgrade Target',
    tag: 'Upgrade Target',
    status: 'Quarantined Process',
    details: {
      purpose: 'Runs identical test inputs against candidate upgraded package code.',
      mechanism: 'Parallel isolated Node.js child process with 5-second watchdog timer.',
      boundary: 'Captures candidate outputs, altered exception structures, and removed properties.'
    }
  },
  comparator: {
    id: 'comparator',
    title: 'Comparison Engine',
    label: 'Deterministic AST Diff',
    tag: 'Differential Engine',
    status: 'Deterministic Rule',
    details: {
      purpose: 'Compares return data, error arrays, and property removals mathematically without AI guessing.',
      mechanism: 'Deep structural AST equality checks and property-retention assertions.',
      boundary: 'In-memory deterministic algorithm; zero AI hallucination.'
    },
    linkHref: '/workspace',
    linkText: 'Execute in Workspace'
  },
  differences: {
    id: 'differences',
    title: 'Observed Differences',
    label: 'Empirical Evidence',
    tag: 'Evidence Package',
    status: 'Categorized Output',
    details: {
      purpose: 'Separates benign changes from contract-breaking potential regressions.',
      mechanism: 'Four-tier classification: Match, Behavioral Difference, Potential Regression, Execution Error.',
      boundary: 'Empirically verified diff payload with reproducible code snippet.'
    },
    linkHref: '/results',
    linkText: 'Inspect evidence diffs'
  },
  ai: {
    id: 'ai',
    title: 'AI Root-Cause Explanation',
    label: 'NVIDIA Nemotron via Nebius',
    tag: 'AI Synthesis',
    status: 'Evidence-Grounded',
    details: {
      purpose: 'Explains underlying architectural breaking changes and suggests concrete migration diffs.',
      mechanism: 'Queries nvidia/Llama-3.1-Nemotron-70B on Nebius Token Factory at temperature 0.1.',
      boundary: 'Server-side only; API key never exposed to client bundles.'
    }
  }
};

export default function WorkflowDiagram() {
  const [selectedId, setSelectedId] = useState<string>('comparator');
  const activeNode = WORKFLOW_NODES[selectedId] || WORKFLOW_NODES.comparator;

  return (
    <div className="rounded-card border border-line bg-card p-5 sm:p-6 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block">
            Differential Pipeline
          </span>
          <h2 className="font-heading text-base sm:text-lg font-bold text-ink-primary mt-0.5">
            Two-Dimensional Execution Flow
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Controlled differential testing from input dispatch to evidence-grounded model synthesis.
          </p>
        </div>
        <span className="text-[11px] font-mono text-ink-muted self-start sm:self-auto">
          Click any stage to inspect technical role
        </span>
      </div>

      {/* 2D Interactive Diagram */}
      <div className="py-2">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 text-xs">
          {/* Node 1: Inputs */}
          <button
            type="button"
            onClick={() => setSelectedId('inputs')}
            className={`flex-1 p-3.5 rounded-card border text-left transition-all ${
              selectedId === 'inputs'
                ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-subtle'
                : 'border-line bg-card hover:bg-panelHover'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Step 01</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-line bg-hero text-ink-secondary">
                Input
              </span>
            </div>
            <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.inputs.title}</div>
            <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.inputs.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4 text-ink-muted" />
            <ArrowDown className="lg:hidden h-4 w-4 text-ink-muted" />
          </div>

          {/* Parallel Block: Baseline vs Candidate */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Top Branch: Baseline v3 */}
            <button
              type="button"
              onClick={() => setSelectedId('v3')}
              className={`p-3 rounded-card border text-left transition-all ${
                selectedId === 'v3'
                  ? 'border-status-success bg-status-successBg ring-1 ring-status-success shadow-subtle'
                  : 'border-line bg-card hover:bg-panelHover'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Parallel A</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-successBg text-status-success font-semibold border border-status-success/30">
                  Oracle (v3)
                </span>
              </div>
              <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.v3.title}</div>
              <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.v3.label}</div>
            </button>

            {/* Bottom Branch: Candidate v4 */}
            <button
              type="button"
              onClick={() => setSelectedId('v4')}
              className={`p-3 rounded-card border text-left transition-all ${
                selectedId === 'v4'
                  ? 'border-status-error bg-status-errorBg ring-1 ring-status-error shadow-subtle'
                  : 'border-line bg-card hover:bg-panelHover'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Parallel B</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-errorBg text-status-error font-semibold border border-status-error/30">
                  Candidate (v4)
                </span>
              </div>
              <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.v4.title}</div>
              <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.v4.label}</div>
            </button>
          </div>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4 text-ink-muted" />
            <ArrowDown className="lg:hidden h-4 w-4 text-ink-muted" />
          </div>

          {/* Node 3: Comparison Engine */}
          <button
            type="button"
            onClick={() => setSelectedId('comparator')}
            className={`flex-1 p-3.5 rounded-card border text-left transition-all ${
              selectedId === 'comparator'
                ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-subtle'
                : 'border-line bg-card hover:bg-panelHover'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Step 03</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hero text-accent font-semibold border border-accent/25">
                AST Diff
              </span>
            </div>
            <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.comparator.title}</div>
            <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.comparator.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4 text-ink-muted" />
            <ArrowDown className="lg:hidden h-4 w-4 text-ink-muted" />
          </div>

          {/* Node 4: Differences */}
          <button
            type="button"
            onClick={() => setSelectedId('differences')}
            className={`flex-1 p-3.5 rounded-card border text-left transition-all ${
              selectedId === 'differences'
                ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-subtle'
                : 'border-line bg-card hover:bg-panelHover'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Step 04</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-line bg-hero text-ink-secondary">
                Evidence
              </span>
            </div>
            <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.differences.title}</div>
            <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.differences.label}</div>
          </button>

          {/* Connector Arrow */}
          <div className="flex items-center justify-center text-ink-muted shrink-0 py-1 lg:py-0">
            <ArrowRight className="hidden lg:block h-4 w-4 text-ink-muted" />
            <ArrowDown className="lg:hidden h-4 w-4 text-ink-muted" />
          </div>

          {/* Node 5: AI Explanation */}
          <button
            type="button"
            onClick={() => setSelectedId('ai')}
            className={`flex-1 p-3.5 rounded-card border text-left transition-all ${
              selectedId === 'ai'
                ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-subtle'
                : 'border-line bg-card hover:bg-panelHover'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold">Step 05</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hero text-tech border border-line font-medium">
                AI Synthesis
              </span>
            </div>
            <div className="font-heading font-bold text-ink-primary text-xs">{WORKFLOW_NODES.ai.title}</div>
            <div className="text-[11px] font-mono text-ink-secondary mt-0.5">{WORKFLOW_NODES.ai.label}</div>
          </button>
        </div>
      </div>

      {/* Selected Node Technical Details Drawer */}
      <div className="p-4 rounded-card border border-line bg-hero text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-line">
          <div className="flex items-center space-x-2.5">
            <span className="font-heading font-bold text-ink-primary text-sm">
              {activeNode.title}
            </span>
            <span className="text-[11px] font-mono text-ink-secondary">
              ({activeNode.label})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-card text-ink-primary">
              Status: {activeNode.status}
            </span>
          </div>

          {activeNode.linkHref && (
            <Link
              href={activeNode.linkHref}
              className="inline-flex items-center space-x-1 text-accent hover:text-accent-hover font-semibold text-xs transition-colors"
            >
              <span>{activeNode.linkText}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-ink-secondary">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
              Purpose
            </span>
            <p className="leading-relaxed">{activeNode.details.purpose}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
              Mechanism
            </span>
            <p className="leading-relaxed">{activeNode.details.mechanism}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-primary block mb-0.5">
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
