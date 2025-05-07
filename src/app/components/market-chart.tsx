"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import type { TimeRange } from "@/lib/types"

interface MarketChartProps {
  data: any[]
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "All"]

export default function MarketChart({ data, timeRange, onTimeRangeChange }: MarketChartProps) {
  const [showMovingAverage, setShowMovingAverage] = useState(true)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-lg">
          <p className="text-sm">{`${payload[0].payload.date}`}</p>
          <p className="text-sm text-white">{`Price: ${payload[0].value.toFixed(2)}`}</p>
          {showMovingAverage && payload[1] && (
            <p className="text-sm text-amber-500">{`MA: ${payload[1].value.toFixed(2)}`}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={cn(
                "px-3 py-1 text-sm rounded",
                timeRange === range ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800",
              )}
              onClick={() => onTimeRangeChange(range)}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
            <span className="text-sm text-gray-300">S&P 500</span>
          </div>
          {showMovingAverage && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-600 mr-2"></div>
              <span className="text-sm text-gray-300">Moving average</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#ffffff" }}
            />
            {showMovingAverage && (
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke="#d97706"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#d97706" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
