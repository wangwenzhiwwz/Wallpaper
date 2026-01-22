'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, Loader2, AlertCircle } from 'lucide-react';

// 配置
const ALIST_API = 'https://alist.wwz.im';
const WALLPAPER_PATH = '/Wallpaper'; // 确保这里大小写和网盘一致

export default function Home() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${ALIST_API}/api/fs/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: WALLPAPER_PATH,
            page: 1,
            per_page: 60,
            refresh: false
          })
        });
        
        const data = await res.json();
        
        if (data.code !== 200) {
          throw new Error(data.message || 'Failed to fetch');
        }

        const files = data.data.content
          .filter((f: any) => !f.is_dir)
          .map((file: any) => {
             const rawUrl = `${ALIST_API}/d${WALLPAPER_PATH}/${encodeURIComponent(file.name)}`;
             return {
               name: file.name,
               thumbnail: file.thumb || rawUrl,
               url: rawUrl,
               size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
             };
          });
          
        setWallpapers(files);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <header className="mb-10 text-center pt-8">
        <h1 className="text-3xl font-bold mb-2">WWZ Wallpaper</h1>
        <p className="text-gray-500 text-sm">Powered by Alist & GitHub Pages</p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center py-20 text-red-400">
          <AlertCircle size={40} className="mb-4" />
          <p>Error: {error}</p>
          <p className="text-xs text-gray-500 mt-2">Check Alist path or CORS settings.</p>
        </div>
      )}

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
        {wallpapers.map((wp) => (
          <div key={wp.name} className="group relative break-inside-avoid rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
            <div className="relative aspect-[9/16]">
              <Image
                src={wp.thumbnail}
                alt={wp.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <span className="text-xs text-gray-300">{wp.size}</span>
                <a
                  href={wp.url}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold"
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
