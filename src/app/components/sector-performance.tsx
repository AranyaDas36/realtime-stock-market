"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface SectorData {
  name: string;
  change: number;
}

export default function SectorPerformance() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API delay and load mock data
    const timeoutId = setTimeout(() => {
      const mockData: SectorData[] = [
        { name: "Technology", change: 1.23 },
        { name: "Energy", change: -0.57 },
        { name: "Healthcare", change: 0.89 },
        { name: "Financials", change: -1.12 },
        { name: "Consumer Discretionary", change: 0.25 },
        { name: "Industrials", change: -0.91 },
        { name: "Materials", change: 1.45 },
        { name: "Utilities", change: 0.04 },
      ];

      setSectors(mockData);
      setLoading(false);
    }, 1000); // Simulate 1s delay

    return () => clearTimeout(timeoutId);
  }, []);

  const formatChange = (change: number) => {
    if (isNaN(change)) return "N/A";
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  const getChangeColorClass = (change: number) => {
    if (isNaN(change)) return "text-gray-400";
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-400";
  };

  if (loading) {
    return (
      <Card className="w-full bg-black text-white">
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Split sectors into two columns
  const midpoint = Math.ceil(sectors.length / 2);
  const leftColumnSectors = sectors.slice(0, midpoint);
  const rightColumnSectors = sectors.slice(midpoint);

  return (
    <Card className="w-full bg-black text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">Sector Performance</CardTitle>
        <div className="text-sm text-gray-400">% price change</div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            {leftColumnSectors.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between py-2">
                <div className="text-gray-400">{sector.name}</div>
                <div
                  className={`rounded-md px-2 py-1 ${getChangeColorClass(sector.change)} bg-black bg-opacity-30`}
                >
                  {formatChange(sector.change)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {rightColumnSectors.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between py-2">
                <div className="text-gray-400">{sector.name}</div>
                <div
                  className={`rounded-md px-2 py-1 ${getChangeColorClass(sector.change)} bg-black bg-opacity-30`}
                >
                  {formatChange(sector.change)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
