import Navbar from "@/app/components/nabvar"
import MarketDashboard from "@/app/components/market-dashboard"
import SectorPerformance from "@/app/components/sector-performance"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-gray-200">
      <Navbar />

      <div className="flex flex-col items-center justify-start flex-1 p-4 md:p-24">
        <div className="w-full max-w-6xl space-y-12">
          <div className="flex align-center justify-between ">
          <div className="bg-gradient-to-r from-[#0f3324] via-[#0b1b14] to-black border rounded-2xl">

              <div className="flex m-4 h-7 bg-gray-800 rounded-xl">
                <div className="bold pl-4">
                  The markets are 
                </div>
                <div className="text-green-500 pl-2 pr-4 bold">bullish</div>
              </div>

            </div>
            <div>
              <SectorPerformance />
            </div>
          </div>
          <MarketDashboard />
        </div>
      </div>
    </main>
  )
}
