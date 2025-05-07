import type { MarketDataItem, TimeRange, ChartDataPoint } from "./types"

// This function simulates fetching market data from an API

const apiKey = 'VZ1M52HU6F2CC8TT';

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
    const symbols = Object.entries(symbolsMap);
  
    const promises = symbols.map(async ([name, { symbol }]) => {
      try {
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
        const data = await res.json();
        const quote = data['Global Quote'];
  
        if (!quote || !quote['05. price']) {
          console.error(`Invalid or missing data for ${name} (${symbol}):`, data);
          return {
            name,
            fullName: symbolsMap[name].fullName,
            value: 0,
            change: 0,
            changePercent: 0,
          } as MarketDataItem;
        }
  
        return {
          name,
          fullName: symbolsMap[name].fullName,
          value: parseFloat(quote['05. price']) || 0,
          change: parseFloat(quote['09. change']) || 0,
          changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        } as MarketDataItem;
      } catch (err) {
        console.error(`Error fetching data for ${name} (${symbol}):`, err);
        return {
          name,
          fullName: symbolsMap[name].fullName,
          value: 0,
          change: 0,
          changePercent: 0,
        } as MarketDataItem;
      }
    });
  
    return Promise.all(promises);
  }
  
// This function simulates fetching chart data from an API
export async function fetchChartData(asset: string, timeRange: TimeRange): Promise<ChartDataPoint[]> {
  // In a real application, you would fetch this data from a financial API
  // For demonstration purposes, we're generating mock data

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const points = timeRangeToPoints(timeRange)
  const baseValue = getBaseValueForAsset(asset)
  const volatility = getVolatilityForAsset(asset)

  const data: ChartDataPoint[] = []
  let currentValue = baseValue

  for (let i = 0; i < points; i++) {
    // Generate a random price movement
    const change = (Math.random() - 0.5) * volatility
    currentValue += change

    // Ensure the value doesn't go below a certain threshold
    if (currentValue < baseValue * 0.7) {
      currentValue = baseValue * 0.7
    }

    const date = getDateForPoint(i, points, timeRange)

    data.push({
      date,
      price: currentValue,
      movingAverage: 0, // Will be calculated after all points are generated
    })
  }

  // Calculate moving average
  const movingAveragePeriod = Math.max(5, Math.floor(points / 10))
  for (let i = 0; i < points; i++) {
    if (i < movingAveragePeriod - 1) {
      // Not enough previous points for moving average
      data[i].movingAverage = data[i].price
    } else {
      // Calculate simple moving average
      let sum = 0
      for (let j = 0; j < movingAveragePeriod; j++) {
        sum += data[i - j].price
      }
      data[i].movingAverage = sum / movingAveragePeriod
    }
  }

  return data
}

// Helper functions
function timeRangeToPoints(timeRange: TimeRange): number {
  switch (timeRange) {
    case "1D":
      return 24 // Hourly for a day
    case "1W":
      return 7 * 5 // Daily for a week (5 trading days)
    case "1M":
      return 30 // Daily for a month
    case "3M":
      return 90 // Daily for 3 months
    case "1Y":
      return 252 // Trading days in a year
    case "All":
      return 1000 // Many points for "All" time
    default:
      return 30
  }
}

function getBaseValueForAsset(asset: string): number {
  // Return a realistic base value for each asset
  switch (asset) {
    case "S&P 500":
      return 498
    case "Nasdaq":
      return 433
    case "Dow Jones":
      return 384
    case "Russell 2000":
      return 199
    case "Crude Oil":
      return 71
    case "Gold":
      return 184
    case "Silver":
      return 20
    case "10-Year Bond":
      return 93
    case "Bitcoin":
      return 24
    default:
      return 100
  }
}

function getVolatilityForAsset(asset: string): number {
  // Return a realistic volatility for each asset
  switch (asset) {
    case "Bitcoin":
      return 2.0 // Highly volatile
    case "Crude Oil":
      return 1.0
    case "Silver":
      return 0.8
    case "Gold":
      return 0.6
    case "Russell 2000":
      return 0.5
    case "Nasdaq":
      return 0.4
    case "S&P 500":
      return 0.3
    case "Dow Jones":
      return 0.3
    case "10-Year Bond":
      return 0.1 // Least volatile
    default:
      return 0.5
  }
}

function getDateForPoint(index: number, totalPoints: number, timeRange: TimeRange): string {
  const now = new Date()
  let date: Date

  switch (timeRange) {
    case "1D":
      // Hours in a day
      date = new Date(now)
      date.setHours(9 + Math.floor((index / totalPoints) * 7)) // 9 AM to 4 PM (market hours)
      date.setMinutes(Math.floor((index % (totalPoints / 7)) * 60))
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    case "1W":
      // Days in a week
      date = new Date(now)
      date.setDate(now.getDate() - (totalPoints - index - 1))
      return date.toLocaleDateString([], { month: "short", day: "numeric" })

    case "1M":
    case "3M":
      // Days in a month or 3 months
      date = new Date(now)
      date.setDate(now.getDate() - (totalPoints - index - 1))
      return date.toLocaleDateString([], { month: "short", day: "numeric" })

    case "1Y":
      // Trading days in a year
      date = new Date(now)
      date.setDate(now.getDate() - (totalPoints - index - 1))
      return date.toLocaleDateString([], { month: "short", year: "numeric" })

    case "All":
      // Many points for "All" time
      date = new Date(now)
      date.setMonth(now.getMonth() - (totalPoints - index - 1) / 30)
      return date.toLocaleDateString([], { month: "short", year: "numeric" })

    default:
      date = new Date(now)
      date.setDate(now.getDate() - (totalPoints - index - 1))
      return date.toLocaleDateString()
  }
}
