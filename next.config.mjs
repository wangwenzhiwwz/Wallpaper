/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 开启静态导出：生成纯 HTML/CSS/JS
  output: 'export',
  
  // 2. 关闭图片优化：GitHub Pages 没有 Node 服务器处理图片压缩
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alist.wwz.im',
      },
    ],
  },
  
  // 3. (可选) 如果你的仓库不是 username.github.io，而是 username.github.io/my-repo
  // 你需要把下面这行取消注释，并填入你的仓库名
  // basePath: '/my-repo-name',
};

export default nextConfig;