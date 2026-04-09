# 🚀 KEMI HUANG - Personal Website Deployment Guide

## 📋 部署清单

### 第一步：上传到 GitHub

**方法 A：使用 GitHub 网页（推荐新手）**

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号（KeMiii）

2. **创建新仓库**
   - 点击右上角 `+` → `New repository`
   - Repository name: `kemiii.github.io`
   - ⚠️ 注意：这个名称是固定的，会自动生成 GitHub Pages
   - 选择 `Public`
   - 点击 `Create repository`

3. **上传文件**
   - 在仓库页面，点击 `uploading an existing file`
   - 将 `kemiii.github.io` 文件夹中的所有文件拖拽到上传区域
   - 点击 `Commit changes`

4. **等待部署**
   - 进入 `Settings` → `Pages`
   - 确认 Source 是 `Deploy from a branch` → `main` → `/ (root)`
   - 等待 2-5 分钟
   - 访问 https://kemiii.github.io 查看

---

### 第二步：配置自定义域名（可选）

如果你有域名（如 `kemi.design`、`kemi.me` 等）：

1. **购买域名**
   - 推荐：阿里云、腾讯云、Cloudflare
   - 价格：.com 约 60元/年

2. **添加 DNS 记录**
   - 登录你的域名服务商
   - 添加 CNAME 记录：
     - 主机记录：`@` 或 `www`
     - 记录类型：`CNAME`
     - 记录值：`kemiii.github.io`

3. **配置 GitHub Pages**
   - 在仓库 `Settings` → `Pages` → `Custom domain`
   - 输入你的域名
   - 勾选 `Enforce HTTPS`

4. **创建 CNAME 文件**（可选）
   - 在仓库根目录创建 `CNAME` 文件
   - 内容：你的域名（如 `kemi.design`）

---

### 第三步：上传摄影作品

**方法 A：上传到 GitHub 仓库（推荐）**

1. 在仓库中创建 `assets/photos` 文件夹
2. 将照片上传到该文件夹
3. 修改 `index.html` 中的图片路径

**方法 B：使用图床（推荐用于大量图片）**

推荐图床服务：
- **SM.MS**: https://sm.ms （免费，无需登录）
- **路过图床**: https://imgchr.com
- **腾讯云 COS**: https://cloud.tencent.com/product/cos
- **GitHub + jsDelivr CDN**: 上传到仓库，用 jsDelivr 加速

示例：
```html
<!-- 本地图片 -->
<img src="assets/photos/my-photo.jpg" alt="摄影作品">

<!-- jsDelivr CDN -->
<img src="https://cdn.jsdelivr.net/gh/KeMiii/kemiii.github.io/assets/photos/my-photo.jpg" alt="摄影作品">
```

---

### 第四步：上传简历 PDF

1. 将你的简历 PDF 命名为 `resume.pdf`
2. 上传到 `assets/resume/` 文件夹
3. 确保下载链接正确：`./assets/resume/resume.pdf`

---

## 🔧 常用操作

### 更新网站内容

1. 修改 `index.html` 中的内容
2. 重新上传修改的文件
3. GitHub Pages 会自动重新部署

### 添加更多项目

在 `index.html` 中找到 `<!-- 项目 3: 持续更新 -->` 部分，按相同格式添加：

```html
<article class="portfolio-card">
    <div class="card-image">
        <img src="assets/images/your-project.jpg" alt="项目名称">
    </div>
    <div class="card-content">
        <div class="card-meta">
            <span class="card-tag">类别</span>
            <span class="card-date">2024</span>
        </div>
        <h3 class="card-title">项目名称</h3>
        <p class="card-desc">项目描述...</p>
        <div class="card-tech">
            <span>技术1</span>
            <span>技术2</span>
        </div>
    </div>
</article>
```

---

## 📱 二维码生成

网站已内置二维码功能，会自动为当前 URL 生成二维码。

如果需要单独生成二维码：
- 访问：https://www.qrcode-monkey.com/
- 输入你的网站 URL
- 下载高清二维码图片

---

## ⚠️ 常见问题

### Q: 网站显示 404？
- 确认仓库名称是 `kemiii.github.io`
- 确认 GitHub Pages 已启用（Settings → Pages）
- 等待 5-10 分钟后重试

### Q: 照片无法显示？
- 检查图片路径是否正确
- 确保图片已上传到仓库
- GitHub 文件名区分大小写

### Q: 自定义域名不生效？
- DNS 记录可能需要 24-48 小时生效
- 确认 CNAME 记录配置正确
- 尝试清除浏览器缓存

---

## 📞 需要帮助？

- GitHub Pages 文档: https://docs.github.com/en/pages
- 给我发邮件: kemi24678@gmail.com
- GitHub Issue: https://github.com/KeMiii/kemiii.github.io/issues

---

**祝你的求职顺利！🎉**
