# ShadowBump AI
> **Catch Behavioral Changes Before Production.**

[![Live Demo (Vercel)](https://img.shields.io/badge/Live_Demo-shadow--bump--ai.vercel.app-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://shadow-bump-ai.vercel.app/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Hackathon: Nebius x NVIDIA](https://img.shields.io/badge/Nebius_x_NVIDIA-Global_AI_Hackathon-76b900.svg)](https://nebiusglobalaihackathon.devpost.com/)
[![Track: Coding & Agentic Engineering](https://img.shields.io/badge/Track-Coding_%26_Agentic_Engineering-0284c7.svg)](https://nebiusglobalaihackathon.devpost.com/)
[![Model: NVIDIA Nemotron-70B](https://img.shields.io/badge/NVIDIA_Model-Llama--3.1--Nemotron--70B-76b900.svg)](https://build.nvidia.com/)
[![Compute: Nebius Token Factory](https://img.shields.io/badge/Compute-Nebius_Token_Factory-8b5cf6.svg)](https://tokenfactory.nebius.com/)

---

## 1. The Problem

When developers upgrade dependencies (such as migrating from **Zod v3 to Zod v4**), builds compile cleanly and standard happy-path unit tests pass. 

However, subtle behavioral regressions slip into production:
- **Custom Error Options Discarded**: In Zod 3, `z.string({ required_error: "Username required" })` worked. In Zod 4, `{ required_error: ... }` is discarded, silently falling back to generic text (`"Invalid input: expected string, received undefined"`).
- **Interface Property Removal**: In Zod 3, `error.errors` was populated. In Zod 4, `error.errors` is `undefined`. Any downstream API handler running `error.errors.map(...)` crashes with an unhandled `TypeError` in production.
- **Coercion Semantics**: `z.coerce.date("")` error phrasing and numeric `NaN` parsing received tags change without compile errors.

---

## 2. The Solution: ShadowBump AI

**ShadowBump AI** is a differential testing harness that detects breaking changes before production code is merged:

1. **Twin Isolated Sandboxes**: Spawns parallel Node.js child processes (`environments/v3` and `environments/v4`) with 5s watchdog timeouts.
2. **Identical Test Vectors**: Streams identical JSON inputs simultaneously to both environments.
3. **Deterministic AST Diff**: Compares observable return values and error objects mathematically without AI guesswork.
4. **NVIDIA Nemotron AI Synthesis**: Uses `nvidia/Llama-3.1-Nemotron-70B-Instruct-HF` via Nebius Token Factory to explain the root cause, quantify blast radius, and generate before/after code migration patches.
5. **Reproducible Proof**: Generates standalone terminal commands developers can run locally.

---

## 3. Architecture & Execution Flow

```text
[ Test Input Stream ]
         │
         ├───► [ Baseline Runtime (zod@3.23.8)  ] ──┐
         │                                          ▼
         └───► [ Candidate Runtime (zod@4.6.7) ] ──► [ Comparison Engine (AST Diff) ]
                                                            │
                                                            ▼
                                                   [ Observed Evidence ]
                                                            │
                                                            ▼
                                          [ NVIDIA Nemotron 70B via Nebius ]
                                                            │
                                                            ▼
                                                [ Root-Cause & Migration Fix ]
```

---

## 4. Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript | High-performance developer interface |
| **Styling** | Tailwind CSS, Plus Jakarta Sans, JetBrains Mono | Clean engineering design system |
| **Interactive 3D** | Three.js (WebGL) | Architectural 3D server-blade data flow |
| **Twin Sandboxes** | Node.js child processes, IPC streams | Isolated environments with 5s watchdog |
| **Comparison** | Deterministic AST Diff Engine | Zero-hallucination mathematical comparison |
| **AI Synthesis** | Nebius Token Factory (`nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`) | Root-cause analysis and migration code diffs |
| **Deployment** | Vercel Serverless Functions | Edge-ready serverless execution (~36ms latency) |

---

## 5. Live Deployments

- **Primary (Vercel)**: [https://shadow-bump-ai.vercel.app/](https://shadow-bump-ai.vercel.app/)
- **Backup (Render)**: [https://shadowbump-ai.onrender.com/](https://shadowbump-ai.onrender.com/)
- **Health Check API**: [https://shadow-bump-ai.vercel.app/api/health](https://shadow-bump-ai.vercel.app/api/health)

---

## 6. Quickstart (Local Setup)

```bash
# 1. Clone repository
git clone https://github.com/shubham25-droid/ShadowBump-AI.git
cd ShadowBump-AI

# 2. Install root dependencies
npm install

# 3. Install twin sandboxes
cd environments/v3 && npm install
cd ../v4 && npm install
cd ../..

# 4. Configure environment variables (optional for AI synthesis)
cp .env.example .env.local
# Set NEBIUS_API_KEY=your_token in .env.local

# 5. Run development server
npm run dev
```

> **Deterministic Fallback**: If `NEBIUS_API_KEY` is omitted, ShadowBump AI runs completely in deterministic mode. The twin sandboxes, AST diffing, and reproducible test vectors execute with zero external dependencies.

---

## 7. Differential Test Suite

Run differential verification suite directly:

```bash
# Run unit & differential assertions
node tests/differential.test.mjs

# Verify backend health and twin sandboxes
node scripts/verify-backend.mjs
```

---

## 8. Nebius x NVIDIA Hackathon Highlights

- **Track**: Coding and Agentic Engineering
- **Infrastructure**: Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1`)
- **Model**: `nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`
- **Core Principle**: Observed evidence first, AI explanation second. Zero hallucination.

---

## 9. Copyright & License

Copyright (c) 2026 Shubham Yadav and ShadowBump AI Contributors. All rights reserved.

ShadowBump AI is licensed under the **Apache License, Version 2.0**. You may use, modify, and distribute the project's licensed source code in accordance with the terms and conditions of this license.

A copy of the license is available at:

[https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, the software is distributed on an **"AS IS" BASIS**, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the Apache License 2.0 for the specific language governing permissions and limitations.

### Branding & Original Assets Protection

The ShadowBump AI name, logo, visual identity, and original design assets are not automatically granted trademark or other rights merely by virtue of this software license. Unless expressly permitted by applicable law or separately authorized in writing, do not imply endorsement, affiliation, or official association with the original project or its creator.

Third-party libraries, trademarks, and assets remain subject to their respective licenses and ownership rights. Unauthorized copying, cloning, re-branding, or distribution of this software's original visual assets and branding without prior written permission is strictly prohibited.
