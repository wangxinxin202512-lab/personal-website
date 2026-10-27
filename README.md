# 王兆鑫个人网站 · 前两页

- `index.html`：唯一的网站入口。蓝色封面连续折叠两次，随后同页显示可交互的洞洞板；没有进入或返回按钮。
- `board.html`：直接打开第二页，供后续开发挂件展开内容。
- 第二页进场时六个挂件依次轻微晃动并停下。悬停或点击挂件、点击左栏 01–05 对应目录，都会让目标挂件再次晃动。
- `assets/welcome-final.png`：用户确认的首页图。
- `assets/board-final.png`：用户手改定稿、二维码已清晰化的洞洞板主图。
- `assets/board-stationary.png` 与 `assets/object-*.png`：从定稿主图拆出的固定板材和独立挂件图层，保持原图排布。
- `assets/fold-one.jpg`、`assets/fold-two.jpg`、`assets/paper-back.jpg`：折纸关键帧与纸背纹理。

无需安装依赖，直接打开 `index.html` 即可。也可以在此文件夹运行 `python -m http.server 4173`，访问 `http://localhost:4173/`。
