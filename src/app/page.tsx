import MarketDashboard from "@/app/components/market-dashboard";
import SectorPerformance from "@/app/components/sector-performance";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-950 text-gray-200 p-4 md:p-24">
      <div className="w-full max-w-6xl space-y-12">
      <SectorPerformance />
        <MarketDashboard />
      </div>
    </main>
  );
}
