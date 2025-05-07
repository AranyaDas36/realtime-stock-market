"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import axios from "axios";

interface SectorData {
  name: string;
  change: number;
}

export default function SectorPerformance() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        setLoading(true);
        const url = "https://financialmodelingprep.com/api/v3/sectors-performance?apikey=d3iD4LXZhLWYqN1dCBg201U82wlBqJWv";
        const response = await axios.get(url);

        console.log("Raw API Response:", response.data); // Log the API response to check the data structure

        // Parse changesPercentage, which might be a string like "47.3976468395652%"
        const formattedData: SectorData[] = response.data.map((sector: any) => {
          let changeValue: number = 0;
          if (typeof sector.changesPercentage === "string") {
            // Remove the '%' symbol and parse as a float
            changeValue = parseFloat(sector.changesPercentage.replace("%", ""));
          } else if (typeof sector.changesPercentage === "number") {
            changeValue = sector.changesPercentage;
          }

          return {
            name: sector.sector || "Unknown",
            change: isNaN(changeValue) ? 0 : changeValue, // Fallback to 0 if parsing fails
          };
        });

        console.log("Formatted Data:", formattedData); // Log the formatted data

        setSectors(formattedData);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch sector data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectorData();

    // Polling every 60 seconds to update sector data
    const intervalId = setInterval(fetchSectorData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to format the percentage change with a + or - sign
  const formatChange = (change: number) => {
    if (isNaN(change)) {
      return "N/A"; // Return "N/A" if the value is not a valid number
    }
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  // Function to determine the CSS class based on the change value
  const getChangeColorClass = (change: number) => {
    if (isNaN(change)) return "text-gray-400"; // Handle invalid numbers
    if (change > 0) return "text-green-500"; // Green for positive changes
    if (change < 0) return "text-red-500"; // Red for negative changes
    return "text-gray-400"; // Gray for no change
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

  if (error) {
    return (
      <Card className="w-full bg-black text-white">
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-400">{error}</div>
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
        {sectors.length === 0 ? (
          <div className="text-center text-gray-400">No sector data available</div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}