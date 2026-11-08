import type { SignalId } from '../../../core/types'

export const commonFormulas = {
  partialSum: String.raw`S_N(x)=\frac{a_0}{2}+\sum_{n=1}^{N}\left(a_n\cos(nx)+b_n\sin(nx)\right)`,
  integrals: String.raw`a_0=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\,dx,\quad a_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos(nx)\,dx,\quad b_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin(nx)\,dx`,
  midpoint: String.raw`x_i=-\pi+\left(i+\frac12\right)\frac{2\pi}{M},\quad i=0,\ldots,M-1,\quad M=2048`,
  rmse: String.raw`\operatorname{RMSE}_N=\sqrt{\frac{1}{M}\sum_{i=0}^{M-1}\left(f(x_i)-S_N(x_i)\right)^2}`,
  maxError: String.raw`E_{\max,N}=\max_{0\le i<M}\left|f(x_i)-S_N(x_i)\right|`,
  jump: String.raw`\lim_{N\to\infty} S_N(x_0)=\frac{f(x_0^-)+f(x_0^+)}{2}`,
}

export const theory: Record<SignalId, { definition: string; coefficients: string; series: string; symmetry: string; convergence: string; boundary: string }> = {
  square: {
    definition: String.raw`f_s(x)=\begin{cases}-1&-\pi<x<0\\0&x=0\\1&0<x<\pi\end{cases}`,
    coefficients: String.raw`a_0=0,\quad a_n=0,\quad b_n=\begin{cases}\frac{4}{\pi n}&n\text{ odd}\\0&n\text{ even}\end{cases}`,
    series: String.raw`f_s(x)\sim\frac{4}{\pi}\sum_{k=0}^{\infty}\frac{\sin((2k+1)x)}{2k+1}`,
    symmetry: 'Odd symmetry: f(−x) = −f(x). Zero mean; only odd-indexed sine terms are nonzero. Coefficients decay as 1/n.',
    convergence: 'The series converges to ±1 away from jumps and to 0 at each jump. Increasing N localizes the ringing, but the limiting Gibbs overshoot persists.',
    boundary: 'Extend with period 2π. At every x = kπ, define f(x) = 0, the midpoint of the one-sided limits.',
  },
  sawtooth: {
    definition: String.raw`f_{\mathrm{saw}}(x)=\frac{x}{\pi},\qquad -\pi<x<\pi`,
    coefficients: String.raw`a_0=0,\quad a_n=0,\quad b_n=\frac{2(-1)^{n+1}}{\pi n}`,
    series: String.raw`f_{\mathrm{saw}}(x)\sim\frac{2}{\pi}\sum_{n=1}^{\infty}\frac{(-1)^{n+1}\sin(nx)}{n}`,
    symmetry: 'Odd symmetry: f(−x) = −f(x). Zero mean; every sine harmonic contributes, with alternating coefficient signs. Coefficients decay as 1/n.',
    convergence: 'The series converges to x/π in the principal interval and to 0 at the periodic jumps. Gibbs ringing occurs at the periodic boundary, not at the origin.',
    boundary: 'Extend with period 2π. At x = (2k + 1)π, define f(x) = 0, the midpoint of the one-sided limits.',
  },
  triangle: {
    definition: String.raw`f_t(x)=1-\frac{2|x|}{\pi},\qquad -\pi\le x\le\pi`,
    coefficients: String.raw`a_0=0,\quad b_n=0,\quad a_n=\begin{cases}\frac{8}{\pi^2n^2}&n\text{ odd}\\0&n\text{ even}\end{cases}`,
    series: String.raw`f_t(x)\sim\frac{8}{\pi^2}\sum_{k=0}^{\infty}\frac{\cos((2k+1)x)}{(2k+1)^2}`,
    symmetry: 'Even symmetry: f(−x) = f(x). Zero mean; only odd-indexed cosine terms are nonzero. Coefficients decay as 1/n².',
    convergence: 'The signal is continuous, including its periodic boundary. The absolutely summable coefficients give uniform convergence. Corners slow local approximation, but there is no jump-discontinuity Gibbs overshoot.',
    boundary: 'Extend with period 2π. The peak is f(0) = 1 and f(±π) = −1. Corners are changes in slope, not jumps in the function.',
  },
}
