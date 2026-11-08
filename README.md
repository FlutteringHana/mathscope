# MathScope

**Interactive Mathematics Explorer**

Explore mathematics through computation and visualization.

## Overview

MathScope is an interactive mathematics exploration platform focused on visualizing mathematical structures, transformations, and computational phenomena.

The project aims to make abstract mathematical concepts easier to explore through interactive experiments, numerical computation, and dynamic visualization.

## Design Philosophy

- **Interactive:** Mathematical parameters should produce immediate visual feedback.
- **Mathematical:** Computations should be accurate, transparent, and mathematically justified.
- **Visual:** Visualization should help users understand mathematical structures and behavior.
- **Modular:** Each mathematical topic should be independently extensible.
- **Educational:** Experiments should communicate both results and underlying mathematical principles.

## Initial Scope

The first development milestone focuses on a Fourier Series Explorer.

Planned capabilities include:

- Interactive periodic signal visualization.
- Fourier series approximation.
- Harmonic decomposition.
- Numerical error analysis.
- Exploration of convergence and the Gibbs phenomenon.

These are planned features, not yet implemented.

## Technology Stack

| Category | Technology |
|---|---|
| Language | TypeScript |
| UI Framework | React |
| Build Tool | Vite |
| Styling | CSS Modules and CSS Variables |
| Linting | Oxlint |
| Visualization | Plotly.js (planned) |
| Mathematics | Custom TypeScript modules initially |
| Formula Rendering | KaTeX (planned) |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Architecture Principles

MathScope follows a modular architecture with clear separation between:

- **Core:** Mathematical models and computational algorithms.
- **Experiments:** Experiment-specific logic and configuration.
- **Visualization:** Rendering and graphical representation.
- **Application:** User interface and application-level interaction.

Mathematical computation should remain independent of React and rendering implementations.

## Roadmap

- [x] P0: Project initialization and development environment.
- [ ] P1: Application Shell and visual design system.
- [ ] P2: Fourier computation engine.
- [ ] P3: Interactive Fourier visualization.
- [ ] P4: Mathematical analysis and error visualization.
- [ ] P5: First MVP release.
- [ ] Future: Linear Algebra, Complex Analysis, Calculus, and Differential Equations.

## Project Status

**Early Development — Foundation Stage**

MathScope is an actively developed personal project. Features and architecture may evolve as the project grows.