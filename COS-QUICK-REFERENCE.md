# COS 图片优化 - 快速参考指南
# COS Image Optimization - Quick Reference

## 🎯 快速操作 (Quick Actions)

### 添加新图片到 COS

```html
<!-- 方法 1: 简单 COS URL（已自动优化） -->
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/new-image.jpg" 
     alt="描述"
     loading="lazy">

<!-- 方法 2: 使用函数生成URL -->
<script>
  const url = generateCOSImageUrl('images/new-image.jpg');
  img.src = url;
</script>

<!-- 方法 3: 使用优化参数 -->
<script>
  const url = generateCOSImageUrl('images/new-image.jpg', {
    quality: 85,
    format: 'webp',
    width: 800
  });
</script>
```

---

## 📋 常用代码片段 (Code Snippets)

### 片段 1: 添加摄影作品

```html
<!-- 摄影图库 - 带完整优化 -->
<div class="gallery-item" onclick="openGalleryByIndex('photos', 0)">
  <img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photos/PHOTO_NAME.jpg" 
       alt="摄影作品" 
       loading="lazy">
</div>
```

### 片段 2: 添加作品集卡片

```html
<!-- 作品集卡片 -->
<article class="portfolio-card">
  <div class="card-image">
    <img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/portfolio/PROJECT.png" 
         alt="项目描述" 
         class="portfolio-img"
         onerror="this.parentElement.querySelector('.card-placeholder').style.display='flex';">
    <div class="card-overlay">
      <i data-lucide="play"></i>
    </div>
  </div>
</article>
```

### 片段 3: 添加头像/个人照片

```html
<!-- 关于区域头像 -->
<div class="image-frame">
  <img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/avatar.jpg" 
       alt="Kemi Huang" 
       class="avatar-img"
       onload="this.style.opacity='1'; this.nextElementSibling.style.opacity='0';">
  <div class="image-placeholder" style="opacity: 1;">
    <span>K</span>
  </div>
</div>
```

### 片段 4: 响应式图片集

```html
<!-- 多分辨率响应式 -->
<img 
  src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg"
  srcset="
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=480 480w,
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=960 960w,
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=1440 1440w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 1000px"
  alt="响应式图片">
```

---

## 🔧 常见任务 (Common Tasks)

### 任务 1: 修改图片质量

```javascript
// 提高质量到 90%
const highQualityUrl = generateCOSImageUrl('images/avatar.jpg', {
  quality: 90
});

// 降低质量到 70% (用于缩略图)
const lowQualityUrl = generateCOSImageUrl('images/thumb.jpg', {
  quality: 70
});
```

### 任务 2: 转换图片格式为 WebP

```javascript
// 转换为 WebP
const webpUrl = generateCOSImageUrl('images/photo.jpg', {
  format: 'webp',
  quality: 85
});

// 转换为 PNG
const pngUrl = generateCOSImageUrl('images/photo.jpg', {
  format: 'png'
});
```

### 任务 3: 缩放图片到特定尺寸

```javascript
// 缩放到 800x600
const resizedUrl = generateCOSImageUrl('images/large.jpg', {
  width: 800,
  height: 600,
  mode: 'lfit'  // 等比例缩放（保持比例）
});

// 只指定宽度，高度自动
const responsiveUrl = generateCOSImageUrl('images/photo.jpg', {
  width: 800
});
```

### 任务 4: 预加载关键图片

```javascript
// 在页面加载前预加载
preloadImages([
  'images/avatar.jpg',
  'images/portfolio/main-project.jpg'
]);
```

### 任务 5: 为所有 COS 图片启用原生懒加载

```html
<!-- 自动为所有 COS 图片添加 loading="lazy" -->
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg" 
     loading="lazy"
     alt="照片">
```

---

## 🚀 性能优化 (Performance Optimization)

### 移动优先策略

```javascript
// 获取移动优化的 URL
const mobileUrl = getResponsiveImageUrl('images/photo.jpg', 'mobile');
// 质量: 75, 宽度: 800px
```

### 自适应设备加载

```javascript
// 自动根据设备类型优化
function loadResponsiveImages() {
  const images = document.querySelectorAll('[data-cos-src]');
  images.forEach(img => {
    const adaptiveUrl = getAdaptiveImageUrl(img.dataset.cosSrc);
    img.src = adaptiveUrl;
  });
}

loadResponsiveImages();
```

### 关键内容首屏加载

```javascript
// 优先加载首屏图片
const viewportImages = document.querySelectorAll('img[loading="lazy"]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 立即加载
      entry.target.src = entry.target.dataset.src;
    }
  });
}, { rootMargin: '50px' });

viewportImages.forEach(img => observer.observe(img));
```

---

## 🎨 样式和 UI 反馈

### 加载状态 CSS

```css
/* 图片加载中 */
.cos-img-loading {
  animation: imageLoadingPulse 1.5s ease-in-out infinite;
  opacity: 0.7;
}

/* 图片加载完成 */
.cos-img-loaded {
  animation: imageLoadedFadeIn 0.3s ease-out;
  opacity: 1;
}

/* 图片加载失败 */
.cos-img-error {
  opacity: 0.5;
  background-color: rgba(239, 68, 68, 0.1);
}
```

### HTML 属性

```html
<!-- 为图片添加加载状态 -->
<img data-cos-src="images/photo.jpg" 
     data-quality="85"
     data-width="800"
     alt="照片"
     class="portfolio-img">
```

---

## 📊 监控和调试 (Monitoring & Debugging)

### 获取加载统计

```javascript
// 在浏览器控制台查看
console.log(imageOptimizer.getStats());
// 输出: { loaded: 15, failed: 0, pending: 3, total: 18 }
```

### 启用详细日志

```javascript
// 监控所有图片加载情况
setupImageMonitoring();
// 在控制台查看: [COS] 图片加载成功: ...
```

### 手动触发优化

```javascript
// 优化所有标记的图片
imageOptimizer.optimizeAllImages();

// 优化单个图片
imageOptimizer.optimizeImage(imgElement);
```

---

## 🔑 配置速查 (Config Cheat Sheet)

```javascript
const COS_CONFIG = {
  // COS 桶信息
  bucket: 'kemi-assets-1420707478',
  region: 'ap-shanghai',
  cdnDomain: 'https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com',
  
  // 图片优化
  imageOptimization: {
    quality: 85,          // 1-100, 默认质量
    enableWebP: true,     // 启用 WebP 转换
    progressive: true,    // 渐进式 JPEG
    smartResize: true,    // 智能缩放
  },
  
  // 设备优化
  responsiveOptimization: {
    mobile: { quality: 75, maxWidth: 800 },
    tablet: { quality: 80, maxWidth: 1200 },
    desktop: { quality: 85, maxWidth: 1920 },
  }
};
```

---

## 🌍 COS 域名

```
标准域名: https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com
CDN 加速: https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com (已配置)
```

---

## ✅ 最佳实践 (Best Practices)

### DO ✅

```javascript
// ✅ 使用 COS 完整 URL
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg">

// ✅ 添加 loading="lazy"
<img src="..." loading="lazy">

// ✅ 使用函数生成优化 URL
const url = generateCOSImageUrl('images/photo.jpg');

// ✅ 为首屏图片预加载
preloadImages(['images/avatar.jpg']);

// ✅ 使用 alt 属性
<img src="..." alt="描述文本">
```

### DON'T ❌

```javascript
// ❌ 不要使用相对路径
<img src="assets/images/photo.jpg">

// ❌ 不要用本地路径替代 COS 
<img src="./images/photo.jpg">

// ❌ 不要忽略 alt 属性
<img src="...">

// ❌ 不要加载超大原始文件
// 应该使用 generateCOSImageUrl() 压缩
```

---

## 🔗 快速链接 (Quick Links)

- [完整文档](./COS-OPTIMIZATION-GUIDE.md)
- [COS 配置](./assets/js/cos-config.js)
- [图片优化器](./assets/js/image-optimizer.js)
- [优化样式](./assets/css/cos-optimization.css)

---

**最后更新**: 2025年4月
**维护**: Kemi Huang
