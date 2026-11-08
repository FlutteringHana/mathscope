# MathScope Development Guidelines

## 1. Project

MathScope - Interactive Mathematics Explorer.

A long-term interactive mathematics visualization platform.

## 2. Language and Communication

- Use TypeScript for application code.
- Use English for all user-facing UI text.
- Use English for code identifiers and comments.
- Chinese is acceptable for developer discussions and explanations.
- Mathematical notation should follow standard conventions.

## 3. Technology Stack

- React for UI components.
- TypeScript for application logic.
- Vite for development and production builds.
- CSS Modules and CSS Variables for styling.
- Oxlint for linting.
- npm as the package manager.

Do not introduce additional dependencies without a clear technical justification.

Do not replace existing tooling without discussing the reason.

Preserve the package-lock.json consistency.

## 4. Architecture

Keep the following responsibilities separate:

- Core: mathematical computation and mathematical models.
- Experiments: experiment-specific logic and configuration.
- Visualization: graphical rendering and interaction with visual elements.
- Application: UI composition and application-level state.

Additional rules:

- Keep mathematical computation independent of React.
- Keep visualization independent of mathematical models.
- Prefer small, reusable components.
- Avoid unnecessary abstractions.
- Do not introduce backend infrastructure unless required.

## 5. Mathematical Correctness

- Prefer pure functions for mathematical computation.
- Document important mathematical definitions and conventions.
- Explicitly handle domain restrictions and boundary conditions.
- Consider numerical precision and floating-point errors.
- Do not silently hide numerical errors.
- Distinguish analytical results from numerical approximations.
- Document assumptions behind numerical methods.
- Add unit tests for mathematical algorithms when test infrastructure is available.

## 6. UI and Visualization

- Follow the Scientific Laboratory visual direction.
- Use a dark theme as the default.
- Prefer consistent design tokens and CSS variables.
- Keep visualizations readable and mathematically meaningful.
- Avoid unnecessary decorative UI elements.
- Keep user-facing text in English.

## 7. Development Practices

- Preserve existing TypeScript compiler settings.
- Do not weaken type safety to bypass errors.
- Avoid unnecessary changes to unrelated files.
- Do not modify generated files or node_modules manually.
- Do not edit package-lock.json directly.
- Explain architectural changes before introducing major abstractions.

## 8. Verification

After relevant code changes, run:

```bash
npm run lint
npm run build
```

Do not claim tests have passed unless they have actually been executed.

A dedicated test framework will be introduced when the mathematical computation modules are developed.

Do not invent npm scripts that do not exist.

## 9. Reporting

After completing a task, report:

- Summary of changes.
- Files created or modified.
- Dependencies added or removed.
- Verification commands executed.
- Known limitations or remaining issues.

Prefer incremental, reviewable changes over large, unrelated modifications.