# MathScope — Technical Architecture

**Document:** Technical Architecture  
**Version:** 0.1  
**Status:** Proposed

## 1. Architecture Goals

The architecture should:

1. Separate mathematical computation from presentation.
2. Separate mathematical models from rendering implementations.
3. Support multiple independent mathematical experiments.
4. Maintain strong TypeScript type safety.
5. Remain simple enough for incremental development.
6. Avoid premature generalization.

## 2. Technology Stack

| Layer | Technology | Status |
|---|---|---|
| Language | TypeScript | Selected |
| UI | React | Selected |
| Build | Vite | Selected |
| Styling | CSS Modules + CSS Variables | Selected |
| Linting | Oxlint | Selected |
| Package Manager | npm | Selected |
| Testing | Vitest | Planned for M2 |
| Charting | Plotly.js or custom renderer | To be evaluated |
| Formula Rendering | KaTeX | Planned for M4 |

No backend or database is required for the MVP.

## 3. Architectural Layers

### 3.1 Application Layer

Responsibilities:

- Application entry point.
- Global layout.
- Navigation.
- Experiment selection.
- Application-level state.

This layer should not implement mathematical algorithms.

### 3.2 Experiment Layer

Responsibilities:

- Experiment-specific UI.
- Experiment configuration.
- Experiment state.
- Connecting mathematical computation to visualization.

The Fourier experiment belongs here.

### 3.3 Core Mathematics Layer

Responsibilities:

- Mathematical definitions.
- Signal models.
- Fourier coefficients.
- Fourier series evaluation.
- Numerical sampling.
- Error metrics.

This layer must not depend on React, DOM APIs, or rendering libraries.

### 3.4 Visualization Layer

Responsibilities:

- Transforming computed data into visual representations.
- Rendering signal curves.
- Rendering harmonic components.
- Handling graph interactions.

The visualization layer should consume data produced by the mathematical core.

It must not independently reimplement Fourier mathematics.

### 3.5 Shared UI Layer

Responsibilities:

- Reusable buttons.
- Sliders.
- Select controls.
- Panels.
- Tabs.
- Layout primitives.

Shared components should remain independent of specific mathematical experiments.

## 4. Proposed Source Structure

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── layout/
│   └── navigation/
│
├── components/
│   ├── ui/
│   └── layout/
│
├── experiments/
│   └── fourier/
│       ├── components/
│       ├── hooks/
│       ├── state/
│       └── config/
│
├── core/
│   ├── signals/
│   └── fourier/
│
├── visualization/
│   ├── charts/
│   └── adapters/
│
├── styles/
│   ├── tokens.css
│   └── global.css
│
└── main.tsx

tests/
```

This is a proposed logical structure.

Directories should be created when their corresponding implementation begins, not all at once.

## 5. Core Data Concepts

### 5.1 Signal Identification

Use a discriminated union for supported signal identifiers.

```typescript
type SignalId =
  | "square"
  | "sawtooth"
  | "triangle";
```

### 5.2 Fourier Coefficients

Represent a coefficient set explicitly.

```typescript
interface FourierCoefficient {
  n: number;
  a: number;
  b: number;
}
```

The coefficient convention is documented separately in the mathematics specification.

### 5.3 Experiment Configuration

The Fourier experiment should have an explicit configuration model.

Conceptually:

```typescript
interface FourierExperimentConfig {
  signalId: SignalId;
  maxHarmonic: number;
  showOriginal: boolean;
  showApproximation: boolean;
  showHarmonics: boolean;
}
```

The exact implementation may evolve as the UI is developed.

## 6. Data Flow

The expected data flow is:

```text
User Interaction
       |
       v
Experiment State
       |
       v
Fourier Computation Core
       |
       +------------------+
       |                  |
       v                  v
Sampled Signal Data   Error Metrics
       |
       v
Visualization Layer
       |
       v
React UI Rendering
```

The Theory and Analysis tabs consume the relevant mathematical definitions and computed results.

The UI should not duplicate mathematical calculations.

## 7. Dependency Direction

Expected dependency rules:

- Application may depend on Experiment and Shared UI.
- Experiment may depend on Core and Visualization.
- Visualization may depend on shared mathematical data types.
- Core must remain independent of React and Visualization.
- Shared UI must not depend on individual experiments.

Avoid circular dependencies.

## 8. State Management

Use React's built-in state mechanisms initially.

Recommended starting points:

- `useState` for simple local controls.
- `useReducer` if experiment state transitions become more complex.
- Custom hooks for reusable experiment behavior.

Do not introduce Redux, Zustand, or another state management library unless actual complexity justifies it.

Experiment configuration should persist when switching between tabs.

## 9. Rendering Strategy

The renderer must be replaceable without modifying the Fourier engine.

For the initial implementation, evaluate:

- Plotly.js.
- Native SVG.
- Canvas-based rendering.

The choice should consider:

- Interaction support.
- Visual quality.
- Update performance.
- TypeScript integration.
- Customization.
- Bundle size.
- Development complexity.

Keep the renderer behind a clear component boundary.

Do not prematurely build a generalized charting framework.

## 10. Testing Strategy

### Core Mathematics

Use Vitest for:

- Signal definitions.
- Fourier coefficients.
- Partial sum evaluation.
- Sampling.
- Error metrics.
- Boundary conditions.

### UI

Add component tests when interaction complexity justifies them.

### Integration

Verify that changing experiment configuration produces the correct computed visualization.

### Build Verification

Run:

```bash
npm run lint
npm run build
```

after relevant changes.

## 11. Dependency Policy

- Avoid dependencies without a clear purpose.
- Keep mathematical computation in project-owned modules initially.
- Prefer small, focused libraries.
- Do not introduce a backend for the MVP.
- Evaluate charting dependencies before committing to a rendering architecture.

## 12. Future Architecture Evolution

Potential future additions:

- Experiment registration and discovery.
- Web Workers for expensive computations.
- WebGL / WebGPU rendering.
- Shared mathematical utilities.
- Export and serialization.
- User-defined experiments.

These should be introduced only when actual requirements appear.