# MathScope — Fourier Mathematics Specification

**Document:** Fourier Mathematics Specification  
**Version:** 0.1  
**Status:** Proposed Mathematical Contract

## 1. General Conventions

All initial signals use:

- Fundamental period: \(T=2\pi\).
- Principal interval: \((-\pi,\pi)\).
- Normalized amplitude: \([-1,1]\).
- Maximum harmonic index: \(N\).

The Fourier Series convention is:

\[
f(x)\sim \frac{a_0}{2}+
\sum_{n=1}^{\infty}
\left(a_n\cos(nx)+b_n\sin(nx)\right)
\]

Coefficients:

\[
a_0=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\,dx
\]

\[
a_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos(nx)\,dx
\]

\[
b_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin(nx)\,dx
\]

The finite partial sum is:

\[
S_N(x)=\frac{a_0}{2}+
\sum_{n=1}^{N}
\left(a_n\cos(nx)+b_n\sin(nx)\right)
\]

N denotes the highest harmonic index, not the number of nonzero terms.

## 2. Signal Definitions

All signals are extended periodically with period \(2\pi\).

### 2.1 Square Wave

On the principal interval:

\[
f_s(x)=
\begin{cases}
-1,&-\pi<x<0\\
1,&0<x<\pi
\end{cases}
\]

At jump discontinuities, define the signal value as the midpoint of the one-sided limits.

The function is odd and has zero mean.

Fourier coefficients:

\[
a_0=0,\qquad a_n=0
\]

\[
b_n=
\begin{cases}
\frac{4}{\pi n},&n\text{ odd}\\
0,&n\text{ even}
\end{cases}
\]

Therefore:

\[
f_s(x)\sim
\frac{4}{\pi}
\sum_{k=0}^{\infty}
\frac{\sin((2k+1)x)}{2k+1}
\]

### 2.2 Sawtooth Wave

On the principal interval:

\[
f_{saw}(x)=\frac{x}{\pi},
\qquad -\pi<x<\pi
\]

At the periodic jump points, define the value as the midpoint of the one-sided limits.

The function is odd and has zero mean.

Fourier coefficients:

\[
a_0=0,\qquad a_n=0
\]

\[
b_n=\frac{2(-1)^{n+1}}{\pi n}
\]

Therefore:

\[
f_{saw}(x)\sim
\frac{2}{\pi}
\sum_{n=1}^{\infty}
\frac{(-1)^{n+1}\sin(nx)}{n}
\]

### 2.3 Triangle Wave

On the principal interval:

\[
f_t(x)=1-\frac{2|x|}{\pi}
\]

The function is even, continuous, and piecewise linear.

Fourier coefficients:

\[
a_0=0,\qquad b_n=0
\]

\[
a_n=
\begin{cases}
\frac{8}{\pi^2n^2},&n\text{ odd}\\
0,&n\text{ even}
\end{cases}
\]

Therefore:

\[
f_t(x)\sim
\frac{8}{\pi^2}
\sum_{k=0}^{\infty}
\frac{\cos((2k+1)x)}{(2k+1)^2}
\]

## 3. Harmonic Index Convention

The user-controlled parameter N represents the highest harmonic index.

The partial sum always includes all indices from 1 through N, including coefficients that are zero.

Initial UI configuration:

- Minimum: 1.
- Maximum: 50.
- Default: 9.
- Increment: 1.

## 4. Sampling Convention

Use a uniform midpoint grid over one period:

\[
x_i=-\pi+
\left(i+\frac12\right)\frac{2\pi}{M}
\]

where:

\[
i=0,\ldots,M-1
\]

Initial sample count:

\[
M=2048
\]

The sample count is configurable internally and may be revised after performance evaluation.

The midpoint grid avoids sampling exactly at the principal interval endpoints and, for even M, at the central square-wave discontinuity.

## 5. Error Metrics

### 5.1 Sampled RMSE

\[
RMSE_N=
\sqrt{
\frac{1}{M}
\sum_{i=0}^{M-1}
\left(f(x_i)-S_N(x_i)\right)^2
}
\]

This approximates the normalized \(L^2\) error over one period.

### 5.2 Sampled Maximum Absolute Error

\[
E_{\max,N}=
\max_{0\leq i<M}
|f(x_i)-S_N(x_i)|
\]

This is a sampled maximum, not the exact continuous maximum.

Both metrics must disclose their sampling assumptions.

## 6. Discontinuity Convention

For a piecewise smooth periodic function, the Fourier series converges at a jump to:

\[
S(x_0)=
\frac{f(x_0^-)+f(x_0^+)}{2}
\]

The mathematical evaluation convention and visual representation must be consistent.

Original discontinuous signals must be rendered as separate line segments across jumps.

The renderer must not draw misleading diagonal connections across discontinuities.

## 7. Gibbs Phenomenon

Gibbs behavior is relevant to the Square Wave and Sawtooth Wave because both contain jump discontinuities.

As N increases:

- Oscillations become increasingly localized.
- The overshoot does not vanish in the limiting process.
- The relative overshoot approaches approximately 8.949% of the jump magnitude.

This theoretical value must not be confused with a finite-resolution numerical measurement.

The Triangle Wave is continuous and should not be presented as having a jump-discontinuity Gibbs overshoot.

## 8. Numerical Validation Requirements

Tests must cover:

1. Signal symmetry.
2. Signal periodicity.
3. Signal amplitude bounds.
4. Analytical coefficient values.
5. Zero even harmonics for Square and Triangle waves.
6. Partial sum evaluation.
7. Discontinuity conventions.
8. Error metric calculations.
9. Invalid harmonic indices.
10. NaN and Infinity prevention for invalid inputs.

## 9. Mathematical References for Implementation

The implementation should follow the definitions in this document.

Any change to:

- Period normalization.
- Signal definitions.
- Coefficient conventions.
- Harmonic indexing.
- Error metrics.

must be reflected in both the implementation and this specification.

Mathematical correctness takes precedence over visual convenience.