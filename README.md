# ShadowBump AI
> **Catch Behavioral Changes Before Production.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-shadowbump--ai.onrender.com-0064d2.svg?style=for-the-badge&logo=render&logoColor=white)](https://shadowbump-ai.onrender.com)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Hackathon: Nebius x NVIDIA](https://img.shields.io/badge/Nebius_x_NVIDIA-Global_AI_Hackathon-76b900.svg)](https://nebiusglobalaihackathon.devpost.com/)
[![Track: Coding & Agentic Engineering](https://img.shields.io/badge/Track-Coding_%26_Agentic_Engineering-0284c7.svg)](https://nebiusglobalaihackathon.devpost.com/)
[![Model: NVIDIA Nemotron-70B](https://img.shields.io/badge/NVIDIA_Model-Llama--3.1--Nemotron--70B-76b900.svg)](https://build.nvidia.com/)
[![Infrastructure: Nebius Token Factory](https://img.shields.io/badge/Compute-Nebius_Token_Factory-8b5cf6.svg)](https://tokenfactory.nebius.com/)

---

## 1. The Core Problem

When developers upgrade a software dependency (such as migrating from **Zod v3 to Zod v4**), the project often compiles cleanly and standard happy-path unit tests pass. 

However, subtle behavioral regressions frequently slip through:
* **Custom Error Options Deprecated**: In Zod 3, `z.string({ required_error: "Must be provided" })` rendered custom error messages. In Zod 4, `{ required_error: ... }` is discarded in favor of a unified `{ error: ... }` callback, silently reverting API errors to generic text (`"Invalid input: expected string, received undefined"`).
* **Interface Property Removal**: In Zod 3, `error.errors` was populated alongside `error.issues`. In Zod 4, `error.errors` is `undefined`. Any downstream API handler or UI form doing `res.error.errors.map(...)` throws an unhandled `TypeError` in production.
* **Coercion & Error Semantics**: Date coercion and numeric NaN parsing format errors differently (`"nan"` vs `"NaN"`).

---

## 2. The Solution: ShadowBump AI

**ShadowBump AI** is a professional developer tool and differential testing harness that:
1. Spawns **two isolated twin runtime environments** (baseline version in `environments/v3` and candidate version in `environments/v4`).
2. Streams **identical test vectors** simultaneously to both environments over standard input with strict execution timeouts and sanitized environments.
3. Evaluates observable outputs, error objects, and property access using a **deterministic differential comparator**.
4. Distinguishes a **behavioral difference** from an actual **potential regression** (using explicit test oracles).
5. Queries an **NVIDIA open-source model (`nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`) via Nebius Token Factory** to synthesize root causes, evaluate blast radius, and generate before/after migration code diffs.
6. Generates **standalone, reproducible code snippets** developers can immediately copy and run in their local terminals.

---

## 3. Interactive Architecture & Pipeline Topology

ShadowBump AI structures differential verification into an 8-stage pipeline, visualizable via our interactive 3D WebGL / Canvas isometric topology:

```text
[1. Dependency Config] ──────► [2. Shared Input Stream]
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [3. Old Runtime (v3)]                         [4. New Runtime (v4)]
         (zod@3.23.8)                                  (zod@4.6.7)
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                          [5. Deterministic Comparator]
                                       ▼
                          [6. Evidence Synthesizer]
                                       ▼
                   [7. NVIDIA Nemotron via Nebius Token Factory]
                                       ▼
                              [8. Diagnostic Report]
```

---

## 4. Technology Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React.
* **Interactive 3D**: Three.js WebGL with isometric camera, animated data-flow curves, and reduced-motion controls.
* **Execution Engine**: Node.js child-process isolated sandboxes (`environments/v3` and `environments/v4`) with 5s timeout guards and stripped environment credentials.
* **AI Provider**: **Nebius Token Factory** (`https://api.tokenfactory.nebius.com/v1`) using **NVIDIA Llama-3.1-Nemotron-70B-Instruct-HF** at temperature `0.1` for grounded root-cause analysis.

---

## 5. Quickstart & Installation

### Prerequisites
* Node.js `>= 18.0.0`
* npm `>= 9.0.0`

### Step 1: Clone & Install Root Dependencies
```bash
git clone https://github.com/your-username/shadow-bump-ai.git
cd shadow-bump-ai
npm install
```

### Step 2: Install Twin Sandboxes
```bash
# Install Zod v3 baseline sandbox
cd environments/v3
npm install

# Install Zod v4 candidate sandbox
cd ../v4
npm install

# Return to root
cd ../..
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your **Nebius Token Factory** API key:
```ini
NEBIUS_API_KEY=your_nebius_api_key_here
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL=nvidia/Llama-3.1-Nemotron-70B-Instruct-HF
```

> **Note on Graceful Deterministic Fallback**: If `NEBIUS_API_KEY` is not provided, the application runs entirely in deterministic mode. The core twin-environment differential testing engine executes normally, capturing all AST differences and reproduction snippets, while displaying a transparent notice regarding the AI synthesis layer.

### Step 4: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Real-World Demonstration Scenarios

ShadowBump AI includes 4 verified empirical scenarios comparing `zod@3.23.8` vs `zod@4.6.7`:

1. **User Registration: Custom Error Map Deprecation**:
   * *Problem*: `required_error` in `z.string({ required_error: "Username is required" })` is ignored in Zod 4.
   * *Evidence*: v3 returns `"Username is required"`; v4 returns `"Invalid input: expected string, received undefined"`.
2. **Downstream API Adapter: `error.errors` Property Removal**:
   * *Problem*: In Zod 3, `ZodError` has `.errors` and `.issues`. In Zod 4, `.errors` is `undefined`.
   * *Evidence*: Downstream code doing `error.errors.map()` throws `TypeError` in production.
3. **Coercion & Numeric Edge Cases (Date & NaN Normalization)**:
   * *Problem*: `z.coerce.date("")` error phrasing differs; `z.number().safeParse(NaN)` changes received identifier from `"nan"` to `"NaN"`.
4. **Record Dictionary Validation**:
   * *Problem*: Structural and error reporting variations for non-matching dictionary value constraints.

---

## 7. Nebius x NVIDIA Hackathon Compliance

* **Competition**: Nebius x NVIDIA Global AI Hackathon
* **Track**: Coding and Agentic Engineering
* **Compute Infrastructure**: Nebius Token Factory (`api.tokenfactory.nebius.com`)
* **NVIDIA Model**: `nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`
* **Evidence Grounding**: The AI model is strictly prompted with normalized empirical diffs from actual execution—it does not hallucinate package behavior or fake test passes.

---

## 8. 3-Minute Video Demonstration Plan

1. **0:00 - 0:35: The Problem**:
   * Introduce a dependency upgrade PR (Zod v3 to v4).
   * Demonstrate unit tests passing while an edge-case form input fails silently.
2. **0:35 - 1:15: Interactive 3D Architecture**:
   * Walk through the 8-stage differential pipeline on the landing page.
   * Show how identical test vectors are streamed into isolated twin sandboxes.
3. **1:15 - 2:05: Live Analysis in Workspace**:
   * Select the *User Registration* scenario, add a custom edge-case vector, and execute.
   * Review the real-time execution across both environments.
4. **2:05 - 2:45: Evidence & NVIDIA Nemotron Explanation**:
   * Inspect the side-by-side AST diff.
   * Review the NVIDIA Nemotron root-cause analysis and migration code snippet generated via Nebius Token Factory.
   * Copy and run the reproducible test script in the terminal.
5. **2:45 - 3:00: Summary & Open-Source Takeaways**:
   * Highlight soundness principles and limitations.

---

## 9. License

Released under the [Apache 2.0 License](LICENSE).
