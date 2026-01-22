'use client'; // 👈 必须加这一行，标记为客户端组件

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';

// 定义数据类型
interface Wallpaper {
  name: string;
  url: string;
  thumbnail: string;
  size: string;
}

export default function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  // 这里的配置要和 lib/alist.ts 逻辑保持一致，或者直接在这里写
  const ALIST_API = 'https://alist.wwz.im';
  const WALLPAPER_PATH = '/Wallpaper'; // ⚠️ 确保路径正确

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${ALIST_API}/api/fs/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: WALLPAPER_PATH,
            page: 1,
            per_page: 50,
            refresh: false
          })
        });
        const data = await res.json();
        
        if (data.code === 200) {
          const files = data.data.content
            .filter((f: any) => !f.is_dir)
            .map((file: any) => {
               const rawUrl = `${ALIST_API}/d${WALLPAPER_PATH}/${encodeURIComponent(file.name)}`;
               return {
                 name: file.name,
                 // 优先用缩略图，没有则用原图
                 thumbnail: file.thumb || rawUrl,
                 url: rawUrl,
                 size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
               };
            });
          setWallpapers(files);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading wallpapers...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-3xl font-bold">WWZ Wallpaper</h1>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
        {wallpapers.map((wp) => (
          <div key={wp.name} className="group relative break-inside-avoid rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
            <div className="relative aspect-[9/16]">
              <Image
                src={wp.thumbnail}
                alt={wp.name}
                fill
                className="object-cover"
                unoptimized={true} // 👈 静态站点必须加这个
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <a
                    href={wp.url}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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