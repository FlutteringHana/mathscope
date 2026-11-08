export interface Point { readonly x: number; readonly y: number }
export interface PlotSeries {
  readonly id: string
  readonly label: string
  readonly color: 'neutral' | 'cyan' | 'violet'
  readonly dashed?: boolean
  readonly segments: readonly (readonly Point[])[]
}
