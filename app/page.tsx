'use client'; // 👈 这一行非常重要，标记为客户端组件

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react'; // 👈 这里用到了 lucide-react
import { fetchWallpapersFromClient } from '@/lib/alist';

export default function Home() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 页面加载时获取壁纸
    fetchWallpapersFromClient()
      .then(data => setWallpapers(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <header className="mb-10 text-center pt-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
          WWZ Wallpaper
        </h1>
        <p className="text-gray-400 mt-2">Powered by Alist & GitHub Pages</p>
      </header>

      {/* 加载中状态 */}
      {loading && (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      )}

      {/* 空状态 */}
      {!loading && wallpapers.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p>No wallpapers found.</p>
          <p className="text-sm mt-2">Check console for errors or verify Alist path.</p>
        </div>
      )}

      {/* 图片列表 */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
        {wallpapers.map((wp) => (
          <div key={wp.name} className="group relative break-inside-avoid rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={wp.thumbnail}
                alt={wp.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={true} // 👈 必须加这个
              />
              
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <span className="text-sm font-medium px-4 text-center truncate w-full">{wp.name}</span>
                <span className="text-xs text-gray-300">{wp.size}</span>
                
                <a
                  href={wp.url}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold transition-colors"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
