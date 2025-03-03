import os
import json

wallpaper_dir = "wallpaper"

images = sorted(
    [f for f in os.listdir(wallpaper_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))],
    key=lambda x: os.path.getmtime(os.path.join(wallpaper_dir, x)),
    reverse=True
)

image_list = [f"{wallpaper_dir}/{img}" for img in images]

with open("images.json", "w", encoding="utf-8") as f:
    json.dump(image_list, f, indent=4)

print(f"✅ images.json 生成成功！共 {len(images)} 张图片")
