// src/components/PriceWidget.tsx
import React, { useState, useEffect } from 'react';

const STABLECOINS = [
  { id: 'tether', symbol: 'USDT', color: 'bg-green-500' },
  { id: 'usd-coin', symbol: 'USDC', color: 'bg-blue-500' },
  { id: 'dai', symbol: 'DAI', color: 'bg-yellow-500' }
];

export default function PriceWidget() {
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,dai&vs_currencies=usd'
      );
      const data = await response.json();
      setPrices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // 每 30 秒更新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 my-8 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg">Live Stablecoin Prices (USD)</h3>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STABLECOINS.map((coin) => (
          <div key={coin.id} className="bg-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className={`w-8 h-8 ${coin.color} rounded-full mb-2 flex items-center justify-center text-[10px] font-bold text-white`}>
              {coin.symbol}
            </span>
            <span className="text-slate-400 text-sm">{coin.symbol}</span>
            <span className="text-white font-mono text-xl">
              ${loading ? '---' : prices[coin.id]?.usd.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-slate-500 text-[10px] mt-4 text-center">Data provided by CoinGecko • Updates every 30s</p>
    </div>
  );
}