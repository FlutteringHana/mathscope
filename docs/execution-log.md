# Fourier Explorer execution record

The user approved M0 and authorized sequential M1–M5 execution. Existing edits to `.gitignore` and the M0 status are preserved. Each task below inherits the scope and acceptance criteria of its matching task in `implementation-plan.md`; milestone dependencies are sequential. Automated verification means `npm test`, `npm run lint`, and `npm run build`. Review includes inspecting the implementation against the approved specifications and correcting observed failures before the milestone checkpoint.

## M1 — Application Shell

Status: verified.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M1-01 | Remove demo assets and update entry point / metadata | M0 | No starter content; dev server and production build work | Done |
| M1-02 | Establish tokens and shared control styling | M1-01 | Dark palette, typography, spacing, borders and focus styles inspected | Done |
| M1-03 | Header, navigation, workspace and Inspector | M1-02 | Three desktop columns; browser inspection | Done |
| M1-04 | Fourier navigation and planned categories | M1-03 | Active experiment and non-interactive Planned labels visible | Done |
| M1-05 | Three accessible workspace tabs | M1-03 | Browser checks preserve signal and N across all tabs | Done |
| M1-06 | Mock experiment controls and reset | M1-03 | Browser checks signal, N, visibility and reset | Done |
| M1-07 | Responsive layout and drawers | M1-03 | Desktop collapse; small-screen drawers, focus and overflow checks | Done |

Implementation: `src/app/`, `src/components/ui/`, `src/experiments/fourier/`, `src/styles/`, `src/main.tsx`, `index.html`; removed unused starter components/styles/assets. Added `vitest.config.ts`, `tests/shell.test.tsx`, npm test scripts and Vitest development dependency through npm (lockfile updated by npm).

Decisions: native dialog drawers provide modal focus management and Escape support. CSS Modules provide component styles; variables provide shared tokens. Configuration lives above tab content. M2 test setup was pulled into M1 to honor the requested per-milestone Vitest gate; no mathematical algorithms exist in M1 and no mathematical test results are claimed.

Verification: Vitest 1/1 passed; lint and build passed without warnings. Browser checks passed for signal/N changes, all tab transitions, harmonic visibility, reset, desktop layout, mobile drawers and focus entry. Browser window resizing has a minimum viewport of approximately 500 CSS pixels; narrower device emulation is deferred to M5. Review corrected duplicate slider IDs when drawers coexist with hidden desktop controls, and dialog cleanup behavior under React StrictMode.

Next: pure mathematical models, coefficients, partial sums, midpoint sampling and error metrics with mathematical tests (M2).

## M2 — Fourier Computation Engine

Status: verified. All tasks depend on M1 and the approved mathematical contract.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M2-01 | Vitest infrastructure | M1 | Node environment, TS discovery and npm scripts; completed early in M1 | Done |
| M2-02 | Signal, coefficient, sample and metric types | M2-01 | Typed pure API; production type checking | Done |
| M2-03 | Three periodic signal models | M2-02 | Symmetry, bounds, periodicity, endpoint and near-jump tests | Done |
| M2-04 | Analytical coefficients | M2-03 | Exact values, zero terms and independent midpoint integration tests | Done |
| M2-05 | Partial sums including DC | M2-04 | Known sums, N=0, highest-index convention and invalid-index tests | Done |
| M2-06 | Midpoint sampling | M2-05 | M=2048, coordinates, endpoint avoidance and segmentation metadata tests | Done |
| M2-07 | Sampled error metrics | M2-06 | Known RMSE/max values, scaled accumulation and invalid-input tests | Done |
| M2-08 | Mathematical contract tests | M2-03–07 | 54 tests passed across 3 suites; lint/build clean | Done |

Files: `src/core/types.ts`, `validation.ts`, `signals/signals.ts`, `fourier/{series,sampling,errors}.ts`, `tests/{fourier,architecture}.test.ts`, and experiment config's core type import. No dependencies added.

Decisions: the core accepts N=0 for DC-only mathematical evaluation and N≤50 for the MVP resource bound; UI remains 1–50. Sampling accepts 1–65536 points and intervals up to two periods for later Gibbs views. Canonical metrics use exactly 2048 midpoints over (−π,π). Coordinates beyond one million periods are rejected explicitly because phase reduction loses precision at large magnitudes. Near-jump values are not flattened using a broad epsilon. Scaled RMSE avoids overflow when squaring otherwise finite errors. Nonfinite results throw rather than silently producing NaN.

Verification: `npm test` 54/54; `npm run lint` and `npm run build` passed without warnings. Independent numerical integration checks harmonics 1, 2, 3, 8, 49 and 50 for every signal. Architecture test checks core's local imports and absence of DOM/React identifiers. Review confirmed the triangle is even and continuous and only square/sawtooth expose jump locations.

Next: renderer decision, adapters, combined plot, harmonic inspection and maximum-N interaction checks (M3).
