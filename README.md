# IRIS — Identity-Regulated Inference System

A continual learning framework for Small Language Models (SLMs) grounded in the psychology of identity-protective cognition.

---

## Overview

IRIS is a decision-theoretic regulatory layer that governs belief update decisions in continually learning language models. Rather than treating every incoming piece of information as an unconditional fine-tuning signal, IRIS evaluates whether a proposed update should be assimilated into an existing belief structure, accommodated by restructuring that belief, or isolated via branching when the two are irreconcilable.

The framework is grounded in three layers of empirical psychology:

- **Brandtstädter & Greve (1994)** — adaptive self-regulation as the theoretical core: identity-continuity concern directly governs the assimilation/accommodation balance
- **Steele (1988) & Sherman & Cohen (2006)** — self-integrity maintenance as the motivational mechanism explaining *why* systems resist restructuring
- **Whitbourne et al. (2002)** — Identity Process Theory as the operationalization layer, providing empirically grounded, measurable constructs for identity assimilation and accommodation styles

The primary computational target is SLMs operating under real-world resource constraints — limited parameter capacity, inference-time efficiency requirements, and minimal memory overhead. IRIS is not a new training algorithm; it is a regulatory layer that sits above the update mechanism and controls when and how updates are applied.

---

## Repository Structure

```
selfware/
├── frontend/          # React + Vite chat interface
├── backend/           # Express + Drizzle ORM API server
│   ├── src/
│   │   ├── conversations/
│   │   │   ├── conversations.routes.js
│   │   │   ├── conversations.controller.js
│   │   │   ├── conversations.repo.js
│   │   │   └── conversations.validator.js
│   │   └── messages/
│   │       ├── messages.routes.js
│   │       ├── messages.controller.js
│   │       ├── messages.repo.js
│   │       └── messages.validator.js
│   └── db/
│       ├── schema.js
│       ├── index.js
│       └── migrate.js
└── model/             # IRIS controller + CORE belief tree (in progress)
```

---

## Core Components

### CORE — Coherent Operaional Representation of Epistemic-identity

A weighted directed dependency tree representing the model's identity-defining belief structure. SELF is an unscored sentinel root node. Direct children are high-centrality foundational beliefs organized across three flat categories: self-model beliefs, value beliefs, and epistemic beliefs. Centrality is computed structurally as `subtree_size / total_nodes`.

CORE is initialized by probing the base model with a fixed battery of identity-relevant behavioral questions, formalizing consistent responses as tree nodes, and encoding the structure via QLoRA fine-tuning.

### IRIS — Identity-Regulated Integrity Signal

The regulatory controller. On each proposed belief update, IRIS computes an identity-integrity signal:

```
T = (1 − α) · T₁ − α · (T₂ · T₃)
```

Where:
- **T₁** = plasticity demand — magnitude of epistemic displacement (confidence shift between prior and posterior)
- **T₂** = identity-defining centrality — retrieved from CORE; acts as a gating multiplier
- **T₃** = cascade ratio — `subtree_size / total_beliefs`, estimating downstream structural impact
- **α** = assimilative inertia — psychologically grounded in Brandtstädter & Greve; modulates dynamically via Sherman & Cohen's identity-buffering heuristic post-update

Decision thresholds τ_A and τ_B gate the three possible update actions:

| Condition | Action |
|-----------|--------|
| T < τ_A | Assimilate — update within existing belief structure |
| τ_A ≤ T < τ_B | Accommodate — revise belief structure |
| T ≥ τ_B | Branch — isolate irreconcilable competency |

---

## Experimental Design

The study compares two model instances forked from the same QLoRA checkpoint:

- **Baseline** — unconditional belief updates, no regulatory layer
- **Treatment** — IRIS-gated updates

Base model: [Gemma 4 E4B](https://huggingface.co/google/gemma-4e4b) (Apache 2.0). Hosted on AWS EC2 (g4dn.xlarge).

Conversations are organized by experimental condition and phase:

| Phase | Condition | Description |
|-------|-----------|-------------|
| Belief-Confirming | Treatment / Baseline | 2-day cycles of confirming inputs |
| Belief-Contradicting | Treatment / Baseline | 2-day cycles of contradicting inputs |

The Self-Concept Clarity Inventory (Campbell et al., 1996) is administered every 2 days via automated cron job. Primary statistical analysis uses a linear mixed-effects model with time × treatment condition as the key interaction term.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| ORM | Drizzle ORM |
| Database | Neon Postgres (serverless) |
| Inference | FastAPI (Python), AWS EC2 g4dn.xlarge |
| Fine-tuning | QLoRA |

---

## Status

- [x] Frontend chat interface
- [x] Backend API + database schema
- [ ] CORE belief tree implementation
- [ ] IRIS controller
- [ ] AWS inference server
- [ ] Experiment launch

---

## Academic Context

This project is a COGS 402 capstone at the University of British Columbia. The primary contribution is a regulatory framework and derived design heuristics for identity-preserving continual learning in SLMs — not a novel algorithm or empirical result. Novelty comes from reframing the stability-plasticity dilemma through the lens of identity-protective cognition and formalizing that reframing into principled computational design constraints.

Supervised by Dr. Christopher Mole and Dr. Paul Bucci.

---

## License

Apache 2.0 — consistent with the base model license.