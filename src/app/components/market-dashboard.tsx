"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import MarketOverview from "./market-overview"
import MarketChart from "./market-chart"
import { fetchMarketData, fetchChartData } from "@/lib/api"
import type { TimeRange } from "@/lib/types"

interface MarketDataItem {
  name: string
  fullName: string
  value: number
  // add more fields as needed
}

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState<MarketDataItem[]>([])
  const [chartData, setChartData] = useState<any[]>([]) // Ideally replace any[] with proper chart data type
  const [selectedAsset, setSelectedAsset] = useState<string>("S&P 500")
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("1D")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchMarketData()
        setMarketData(data)

        if (data.length > 0) {
          setSelectedAsset(data[0].name)
        }
      } catch (error) {
        console.error("Error fetching market data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchChartData(selectedAsset, selectedTimeRange)
        setChartData(data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    if (selectedAsset) {
      loadChartData()
    }
  }, [selectedAsset, selectedTimeRange])

  const handleAssetSelect = (assetName: string) => {
    setSelectedAsset(assetName)
  }

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range)
  }

  const selectedAssetData = marketData.find((item) => item.name === selectedAsset)

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-400 mb-8">Markets</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-950">
        <div className="bg-gray-950 rounded-lg p-6">
          <MarketOverview
            data={marketData}
            isLoading={isLoading}
            onAssetSelect={handleAssetSelect}
            selectedAsset={selectedAsset}
          />
        </div>

        <div className="bg-gray-950 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-medium">{selectedAssetData?.fullName || selectedAsset}</h2>
            <ChevronRight className="ml-2 h-5 w-5 text-gray-500" />
          </div>
          <div className="text-2xl font-medium mb-6">
            {selectedAssetData ? selectedAssetData.value.toFixed(2) : "N/A"}
          </div>

          <MarketChart
            data={chartData}
            timeRange={selectedTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </div>
      </div>
    </div>
  )
}
