// marketData.ts
import type { MarketDataItem, TimeRange, ChartDataPoint } from "./types"

const apiKey = 'VZ1M52HU6F2CC8TT'

const symbolsMap: { [key: string]: { symbol: string, fullName: string } } = {
  "S&P 500": { symbol: "SPY", fullName: "SPDR S&P 500 ETF Trust" },
  "Nasdaq": { symbol: "QQQ", fullName: "Invesco QQQ Trust" },
  "Dow Jones": { symbol: "DIA", fullName: "SPDR Dow Jones Industrial Average ETF Trust" },
  "Russell 2000": { symbol: "IWM", fullName: "iShares Russell 2000 ETF" },
  "Crude Oil": { symbol: "USO", fullName: "United States Oil Fund" },
  "Gold": { symbol: "GLD", fullName: "SPDR Gold Shares" },
  "Silver": { symbol: "SLV", fullName: "iShares Silver Trust" },
  "10-Year Bond": { symbol: "TLT", fullName: "iShares 20+ Year Treasury Bond ETF" },
  "Bitcoin": { symbol: "BTC-USD", fullName: "Bitcoin / US Dollar" },
}

export async function fetchMarketData(): Promise<MarketDataItem[]> {
  const symbols = Object.entries(symbolsMap)

  const promises = symbols.map(async ([name, { symbol }]) => {
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${symbol}`)
      }

      const data = await res.json()
      const quote = data['Global Quote']

      if (!quote || typeof quote !== 'object' || !quote['05. price']) {
        console.warn(`Unexpected API response for ${name} (${symbol}):`, data)
        return fallbackMarketItem(name)
      }

      return {
        name,
        fullName: symbolsMap[name].fullName,
        value: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      } as MarketDataItem
    } catch (err) {
      console.error(`Error fetching data for ${name} (${symbol}):`, err)
      return fallbackMarketItem(name)
    }
  })

  return Promise.all(promises)
}

function fallbackMarketItem(name: string): MarketDataItem {
  return {
    name,
    fullName: symbolsMap[name].fullName,
    value: 0,
    change: 0,
    changePercent: 0,
  }
}

// ---- Chart Mock Data ---- //

export async function fetchChartData(asset: string, timeRange: TimeRange): Promise<ChartDataPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // simulate delay

  const points = timeRangeToPoints(timeRange)
  const baseValue = getBaseValueForAsset(asset)
  const volatility = getVolatilityForAsset(asset)

  const data: ChartDataPoint[] = []
  let currentValue = baseValue

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility
    currentValue = Math.max(currentValue + change, baseValue * 0.7)

    const date = getDateForPoint(i, points, timeRange)
    data.push({ date, price: currentValue, movingAverage: 0 })
  }

  const movingAveragePeriod = Math.max(5, Math.floor(points / 10))
  for (let i = 0; i < points; i++) {
    const sum = data.slice(Math.max(0, i - movingAveragePeriod + 1), i + 1).reduce((acc, dp) => acc + dp.price, 0)
    const count = Math.min(i + 1, movingAveragePeriod)
    data[i].movingAverage = sum / count
  }

  return data
}

// ---- Helpers ---- //

function timeRangeToPoints(timeRange: TimeRange): number {
  switch (timeRange) {
    case "1D": return 24
    case "1W": return 35
    case "1M": return 30
    case "3M": return 90
    case "1Y": return 252
    case "All": return 1000
    default: return 30
  }
}

function getBaseValueForAsset(asset: string): number {
  switch (asset) {
    case "S&P 500": return 498
    case "Nasdaq": return 433
    case "Dow Jones": return 384
    case "Russell 2000": return 199
    case "Crude Oil": return 71
    case "Gold": return 184
    case "Silver": return 20
    case "10-Year Bond": return 93
    case "Bitcoin": return 24000
    default: return 100
  }
}

function getVolatilityForAsset(asset: string): number {
  switch (asset) {
    case "Bitcoin": return 2000
    case "Crude Oil": return 3
    case "Silver": return 2
    case "Gold": return 1.5
    case "Russell 2000": return 1.2
    case "Nasdaq": return 1
    case "S&P 500": return 0.8
    case "Dow Jones": return 0.7
    case "10-Year Bond": return 0.3
    default: return 1
  }
}

function getDateForPoint(index: number, totalPoints: number, timeRange: TimeRange): string {
  const now = new Date()
  const date = new Date(now)

  switch (timeRange) {
    case "1D":
      date.setHours(9 + Math.floor((index / totalPoints) * 7))
      date.setMinutes((index % (totalPoints / 7)) * 60)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    case "1W":
    case "1M":
    case "3M":
    case "1Y":
    case "All":
      date.setDate(now.getDate() - (totalPoints - index - 1))
      return date.toLocaleDateString([], { month: "short", day: "numeric" })

    default:
      return date.toLocaleDateString()
  }
}
