# MathScope — UI Design Specification

**Document:** UI Design Specification  
**Version:** 0.1  
**Status:** Draft for Review

## 1. Design Direction

Visual direction: Scientific Laboratory.

MathScope should resemble a modern scientific computing environment rather than a conventional SaaS dashboard.

Key characteristics:

- Dark graphite background.
- Subtle grid and border treatments.
- Cyan and teal visualization accents.
- Clear mathematical typography.
- Dense but organized information.
- Minimal decorative elements.

## 2. Application Layout

### 2.1 Main Structure

The application uses a three-column layout.

| Region | Proposed Width | Responsibility |
|---|---:|---|
| Sidebar | 240px | Navigation |
| Workspace | Flexible | Main experiment content |
| Inspector | 300px | Experiment controls |

A shared Header sits above the three regions.

The layout should use CSS Grid and responsive design tokens.

### 2.2 Navigation Sidebar

Contains:

- MathScope logo and application name.
- Calculus & Analysis.
- Linear Algebra.
- Complex Analysis.
- Fourier & Signal Processing.
- Differential Equations.

Fourier Explorer is the only active experiment in the initial MVP.

Other categories should be visibly marked as planned rather than presented as functional features.

### 2.3 Workspace

The Workspace contains three navigation tabs:

1. Experiment
2. Theory
3. Analysis

Switching tabs must preserve the current experiment configuration.

#### Experiment Tab

Contains:

- Experiment title.
- Short experiment description.
- Combined signal chart.
- Harmonic Components section.

The main chart overlays the original signal and Fourier approximation.

Individual harmonic components are displayed in a separate expandable section below the main chart.

#### Theory Tab

Contains:

- Signal definition.
- Fourier series formulation.
- Coefficient definitions.
- Symmetry properties.
- Convergence behavior.
- Relevant mathematical explanations.

Mathematical expressions are rendered using KaTeX.

#### Analysis Tab

Contains:

- Fourier coefficient table.
- Sampled RMSE.
- Sampled maximum absolute error.
- Convergence information.
- Gibbs phenomenon analysis when applicable.

Numerical metrics must identify their sampling assumptions.

### 2.4 Inspector Panel

Contains:

| Control | Type |
|---|---|
| Signal Selection | Select |
| Maximum Harmonic Index | Slider |
| Original Signal Visibility | Toggle |
| Fourier Approximation Visibility | Toggle |
| Harmonic Components Visibility | Toggle |
| Reset Parameters | Button |

Initial parameter configuration:

- Signal: Square Wave.
- Maximum Harmonic Index: 9.
- Minimum N: 1.
- Maximum N: 50.
- Step: 1.

The range is provisional and may be adjusted after performance testing.

## 3. Visualization Design

### 3.1 Main Combined Plot

The main chart displays:

- Original Signal.
- Fourier Partial Sum.

Proposed visual distinction:

- Original Signal: neutral light-colored line.
- Fourier Approximation: cyan line.

Use clear axes, tick labels, grid lines, and a legend.

For discontinuous signals, the original signal must be rendered as separate segments rather than connecting across jumps with misleading diagonal lines.

### 3.2 Harmonic Components

Display individual nonzero harmonic terms up to N.

Users should be able to inspect individual terms and their contribution to the Fourier approximation.

The harmonic view should not overcrowd the main combined chart.

## 4. Design Tokens

Initial color palette:

| Token | Value |
|---|---|
| Background | `#0B0F14` |
| Surface | `#111821` |
| Elevated Surface | `#17212B` |
| Border | `#263341` |
| Primary Text | `#E6EDF3` |
| Secondary Text | `#8B9AA9` |
| Primary Accent | `#55D6E8` |
| Secondary Accent | `#2DD4BF` |
| Violet | `#A78BFA` |
| Amber | `#FBBF24` |

These values are initial design proposals, not immutable requirements.

## 5. Typography

- Primary font: Inter, with system sans-serif fallback.
- Monospace font: JetBrains Mono, with system monospace fallback.
- Mathematical notation: KaTeX.

Do not require downloading external fonts in the initial implementation.

## 6. Responsive Behavior

### Desktop

Display the complete three-column layout.

### Medium Screens

Allow the Inspector to collapse.

### Small Screens

Transform Sidebar and Inspector into drawer-style panels.

The visualization must retain adequate space for readable graphs.

## 7. Interaction Principles

- Parameter changes should update the experiment immediately.
- Every slider must display its current value.
- Switching tabs must preserve experiment state.
- Color must not be the only means of distinguishing data.
- Controls should have accessible labels and keyboard support.
- Respect reduced-motion preferences.

## 8. Visual Scope Boundaries

Not included in the MVP:

- Customizable dashboard layouts.
- Drag-and-drop panel arrangement.
- Multiple themes.
- Complex animation timelines.
- Multi-window workspaces.
- User-configurable color palettes.

## 9. Design Acceptance Criteria

The UI implementation is acceptable when:

- All three layout regions are present.
- Navigation and experiment tabs work.
- The Inspector exposes all required controls.
- The design follows the documented color and typography system.
- Layout adapts to smaller viewports.
- Interactive controls are keyboard accessible.
- No mathematical functionality is falsely represented as implemented before the engine exists.