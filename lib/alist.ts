// lib/alist.ts

// ⚠️ 请确保这里的路径和你 Alist 后台完全一致，大小写敏感！
const WALLPAPER_PATH = '/Wallpaper'; 
const ALIST_API = 'https://alist.wwz.im';

export async function fetchWallpapersFromClient() {
  try {
    const res = await fetch(`${ALIST_API}/api/fs/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: WALLPAPER_PATH,
        page: 1,
        per_page: 60, // 一次加载 60 张
        refresh: false
      })
    });

    const data = await res.json();
    
    if (data.code !== 200) {
      console.error("Alist API Error:", data.message);
      return [];
    }

    return data.data.content
      .filter((item: any) => !item.is_dir)
      .map((file: any) => {
        // 构造直链
        const rawUrl = `${ALIST_API}/d${WALLPAPER_PATH}/${encodeURIComponent(file.name)}`;
        return {
          name: file.name,
          thumbnail: file.thumb || rawUrl,
          url: rawUrl,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        };
      });

  } catch (error) {
    console.error("Network Error:", error);
    return [];
  }
}