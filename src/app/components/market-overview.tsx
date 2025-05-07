"use client"
import { cn } from "@/lib/utils"

interface MarketOverviewProps {
  data: any[]
  isLoading: boolean
  onAssetSelect: (assetName: string) => void
  selectedAsset: string
}

export default function MarketOverview({ data, isLoading, onAssetSelect, selectedAsset }: MarketOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse flex justify-between">
            <div className="h-6 bg-gray-700 rounded w-24"></div>
            <div className="h-6 bg-gray-700 rounded w-20"></div>
            <div className="h-6 bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.name}
          className={cn(
            "flex justify-between items-center py-2 cursor-pointer hover:bg-gray-800 rounded px-2 transition-colors",
            selectedAsset === item.name && "bg-gray-800",
          )}
          onClick={() => onAssetSelect(item.name)}
        >
          <div className="font-medium w-32">{item.name}</div>
          <div className="text-right w-24">{item.value.toFixed(2)}</div>
          <div className={cn("text-right w-20", item.change >= 0 ? "text-green-500" : "text-red-500")}>
            {item.change >= 0 ? "+" : ""}
            {item.change.toFixed(2)}
          </div>
          <div
            className={cn(
              "text-right w-20 rounded px-2 py-1",
              item.changePercent >= 0 ? "bg-green-900/50 text-green-500" : "bg-red-900/50 text-red-500",
            )}
          >
            {item.changePercent >= 0 ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  )
}
