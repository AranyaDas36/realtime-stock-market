export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "All"

export interface MarketDataItem {
  name: string
  fullName?: string
  value: number
  change: number
  changePercent: number
}

export interface ChartDataPoint {
  date: string
  price: number
  movingAverage: number
}
