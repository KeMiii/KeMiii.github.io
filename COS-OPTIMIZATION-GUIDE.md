# 腾讯云 COS 图片加速加载指南
# Tencent Cloud COS Image Acceleration Guide

## 📋 简介 (Overview)

本项目已集成腾讯云 COS (Cloud Object Storage) CDN 加速，用于优化图片加载性能。通过自动化的图片处理、懒加载和无损压缩，让您的网站加载速度更快。

This project integrates Tencent Cloud COS CDN acceleration for optimized image loading performance.

---

## 🎯 核心功能 (Features)

### 1. **自动图片优化 (Automatic Image Optimization)**
- 智能质量压缩 (85% 质量)
- WebP 格式自适应支持
- 设备自适应分辨率
- 渐进式图片加载

### 2. **CDN 加速 (CDN Acceleration)**
- 腾讯云全球 CDN 节点
- 自动地域加速
- 缓存策略优化

### 3. **懒加载 (Lazy Loading)**
- Intersection Observer API
- 支持 50px 加载提前量
- 自动错误处理

### 4. **高级图片处理 (Advanced Image Operations)**
- 动态质量调整
- 格式转换
- 尺寸缩放
- 图片效果处理

---

## 🚀 快速开始 (Quick Start)

### 基础使用 - 使用 COS 配置

已经为您配置好的 COS 信息：

```javascript
// assets/js/cos-config.js 中的配置
COS_CONFIG = {
  bucket: 'kemi-assets-1420707478',
  region: 'ap-shanghai',
  cdnDomain: 'https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com',
  imageOptimization: {
    quality: 85,      // 图片质量 1-100
    enableWebP: true, // 启用 WebP
  }
}
```

### 在 HTML 上使用图片

现有 HTML 中的图片已使用完整 COS URL：

```html
<!-- ✅ 已优化 - 使用完整 COS URL -->
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/avatar.jpg" alt="头像">

<!-- 摄影图库 - 已启用原生懒加载 -->
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photos/photo1.jpg" alt="摄影" loading="lazy">
```

---

## 💻 API 参考 (API Reference)

### 1. `generateCOSImageUrl(path, options)`
生成优化的 COS 图片 URL

```javascript
// 基础用法
const url = generateCOSImageUrl('images/avatar.jpg');

// 带优化参数
const optimizedUrl = generateCOSImageUrl('images/avatar.jpg', {
  quality: 80,        // 质量 1-100
  format: 'webp',     // 格式：webp, jpg, png, etc.
  width: 800,         // 宽度（像素）
  height: 600,        // 高度（像素）
  mode: 'lfit'        // 缩放模式：lfit(等比), fill(填充), crop(裁剪)
});

// 应用于 HTML 元素
const img = document.querySelector('img');
img.src = optimizedUrl;
```

### 2. `getResponsiveImageUrl(path, deviceType)`
获取设备适配的图片 URL

```javascript
// 基于设备类型的优化
const mobileUrl = getResponsiveImageUrl('images/avatar.jpg', 'mobile');   // 质量 75
const tabletUrl = getResponsiveImageUrl('images/avatar.jpg', 'tablet');   // 质量 80
const desktopUrl = getResponsiveImageUrl('images/avatar.jpg', 'desktop'); // 质量 85
```

### 3. `getAdaptiveImageUrl(path)`
自动根据当前设备获取优化 URL

```javascript
// 自动检测设备并应用对应优化
const url = getAdaptiveImageUrl('images/avatar.jpg');
```

### 4. `generateImageSrcSet(path)`
生成响应式图片集合（用于 srcset）

```javascript
// 生成 srcset 字符串
const srcset = generateImageSrcSet('images/photo.jpg');
// 结果: "...480px 1x, ...960px 2x, ...1440px 3x"

<img src="..." srcset="{{ srcset }}" sizes="(max-width: 600px) 100vw, 600px">
```

### 5. `optimizeImageElement(img, path, options)`
为 HTML 图片元素应用优化

```javascript
const img = document.querySelector('img.portfolio-img');
optimizeImageElement(img, 'images/avatar.jpg', {
  quality: 85,
  format: 'webp'
});

// 等价于:
// img.src = 优化的 URL
// img.srcset = 响应式集合
// img.loading = 'lazy'
```

### 6. `preloadImages(paths)`
预加载关键图片

```javascript
// 预加载单个图片
preloadImages('images/avatar.jpg');

// 预加载多个图片
preloadImages([
  'images/avatar.jpg',
  'images/portfolio/project1.jpg',
  'images/portfolio/project2.jpg'
]);
```

---

## 🎨 ImageOptimizer 类 (Detailed API)

### 初始化

```javascript
// 全局实例已自动创建
const optimizer = imageOptimizer; // 或创建新实例
// const optimizer = new ImageOptimizer({
//   lazyLoad: true,
//   progressiveLoading: true,
//   errorFallback: true
// });
```

### 使用 data 属性标记图片

```html
<!-- 自动优化图片 -->
<img data-cos-src="images/avatar.jpg" 
     data-quality="85"
     data-width="400"
     class="cos-img"
     alt="头像">

<img data-cos-src="images/photo.jpg" 
     data-quality="75"
     data-format="webp"
     class="cos-img"
     alt="摄影作品">
```

### 主要方法

```javascript
// 优化所有标记了 data-cos-src 的图片
imageOptimizer.optimizeAllImages();

// 优化单个图片元素
imageOptimizer.optimizeImage(imgElement);

// 获取加载统计
const stats = imageOptimizer.getStats();
console.log(stats); 
// { loaded: 15, failed: 0, pending: 3, total: 18 }

// 销毁优化器（清理观察器）
imageOptimizer.destroy();
```

---

## 📊 高级用法 (Advanced Usage)

### 1. 渐进式图片加载

自动加载低质量图片占位符，然后替换为高质量版本：

```javascript
const img = document.querySelector('img');
optimizeImageElement(img, 'images/large-photo.jpg', {
  quality: 95,        // 最终质量
  progressive: true   // 启用渐进式加载
});

// 注意：这在 ImageOptimizer 配置中可以启用
// progressiveLoading: true (已默认启用)
```

### 2. 条件式图片处理

根据文件类型应用不同优化：

```javascript
function optimizeByType(path) {
  if (path.endsWith('.png')) {
    return generateCOSImageUrl(path, {
      format: 'webp',
      quality: 90
    });
  } else if (path.endsWith('.jpeg') || path.endsWith('.jpg')) {
    return generateCOSImageUrl(path, {
      quality: 85
    });
  }
  return generateCOSImageUrl(path);
}
```

### 3. 响应式图片尺寸

```html
<!-- 使用 srcset 和 sizes 属性 -->
<img 
  src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=800"
  srcset="
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=480 480w,
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=960 960w,
    https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photo.jpg?width=1440 1440w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 1000px"
  alt="响应式图片">
```

### 4. 图片特效处理

```javascript
// 应用模糊效果
const blurUrl = applyImageOperations(
  generateCOSImageUrl('images/photo.jpg'),
  { blur: 10 }
);

// 调整亮度
const brighterUrl = applyImageOperations(
  generateCOSImageUrl('images/photo.jpg'),
  { brightness: 100 }
);

// 组合多个效果
const effectUrl = applyImageOperations(
  generateCOSImageUrl('images/photo.jpg'),
  { 
    quality: 80,
    blur: 5,
    brightness: 50,
    contrast: 50
  }
);
```

---

## 🔧 配置修改 (Custom Configuration)

### 修改 COS 配置

编辑 `assets/js/cos-config.js`：

```javascript
const COS_CONFIG = {
  bucket: 'your-bucket-name',
  region: 'ap-shanghai',
  cdnDomain: 'https://your-custom-domain.com',
  
  imageOptimization: {
    enabled: true,
    quality: 85,        // ← 修改默认质量
    enableWebP: true,   // ← 启用/禁用 WebP
    progressive: true,
    smartResize: true,
  },

  responsiveOptimization: {
    mobile: {
      quality: 75,      // ← 移动端质量
      maxWidth: 800,
    },
    tablet: {
      quality: 80,      // ← 平板质量
      maxWidth: 1200,
    },
    desktop: {
      quality: 85,      // ← 桌面版质量
      maxWidth: 1920,
    },
  },
};
```

### 修改图片加载器配置

编辑 `assets/js/image-optimizer.js`：

```javascript
const imageOptimizer = new ImageOptimizer({
  lazyLoad: true,              // 启用懒加载
  placeholders: true,          // 显示占位符
  errorFallback: true,         // 错误回退
  progressiveLoading: true,    // 渐进式加载
});
```

---

## 📈 性能优化建议 (Performance Tips)

### 1. **关键图片预加载**

```javascript
// 在 main.js 中修改 initCOSImageOptimization 函数
const criticalImages = [
  'images/avatar.jpg',              // 首屏头像
  'images/portfolio/main.jpg',      // 首屏作品封面
  'images/photos/featured.jpg',     // 特色摄影
];

preloadImages(criticalImages);
```

### 2. **设备适配优化**

```javascript
// 自动根据设备提供最优分辨率
function optimizeAllByDevice() {
  const imgs = document.querySelectorAll('img[data-cos-src]');
  const deviceType = detectDeviceType();
  
  imgs.forEach(img => {
    const path = img.dataset.cosSrc;
    img.src = getResponsiveImageUrl(path, deviceType);
  });
}

optimizeAllByDevice();
```

### 3. **图像CDN 缓存策略**

COS 默认缓存配置已启用：
- **浏览器缓存**: 7 天
- **CDN 缓存**: 30 天
- 查询参数变化时刷新

### 4. **质量平衡**

```
推荐质量设置:
- 摄影作品 (高质量): 85-90
- 缩略图 (低质量): 70-75
- 移动端 (平衡): 75-80
- 桌面版 (最佳): 85-90
```

---

## 🐛 错误处理 (Error Handling)

### 自动错误回退

```javascript
// ✅ 自动处理 - ImageOptimizer 内置
<img src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/not-found.jpg"
     class="cos-img-loading"
     alt="图片">

<!-- 加载失败时自动显示占位符 -->
<div class="image-placeholder">
  <span>K</span>  <!-- 回退显示 -->
</div>
```

### 调试图片加载

```javascript
// 在浏览器控制台查看加载统计
console.log(imageOptimizer.getStats());

// 启用调试模式
setupImageMonitoring(); // 在控制台输出详细加载信息
```

---

## 📱 实际案例 (Real-world Examples)

### 案例 1: 摄影图库优化

```html
<!-- 转换前 -->
<img src="assets/images/photo.jpg" alt="摄影作品">

<!-- 转换后 - 带完整优化 -->
<img 
  src="https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com/images/photos/photo.jpg?imageMogr2/quality/85|format/webp"
  loading="lazy"
  alt="摄影作品">
```

### 案例 2: 响应式作品集

```javascript
// 生成不同设备的 URL
const getPortfolioImageUrl = (filename) => {
  const deviceType = detectDeviceType();
  const optimization = COS_CONFIG.responsiveOptimization[deviceType];
  
  return generateCOSImageUrl(`images/portfolio/${filename}`, {
    quality: optimization.quality,
    width: optimization.maxWidth
  });
};

// 使用
const portfolioImg = getPortfolioImageUrl('project-cover.jpg');
```

---

## 🔐 安全性 (Security)

- COS URL 使用已配置的公开访问权限
- 所有图片通过 HTTPS 传输
- CDN 防盗链（如需配置）

---

## 📚 相关资源 (Resources)

- [腾讯云 COS 官方文档](https://cloud.tencent.com/document/product/436)
- [COS 图片处理文档](https://cloud.tencent.com/document/product/436/44879)
- [CDN 性能优化指南](https://cloud.tencent.com/document/product/228)

---

## ✅ 清单 (Checklist)

- [x] COS 配置文件创建 (`cos-config.js`)
- [x] 图片优化器创建 (`image-optimizer.js`)
- [x] HTML 脚本集成
- [x] 懒加载实现
- [x] WebP 自适应支持
- [x] 设备响应式优化
- [x] 错误处理机制
- [x] 文档完成

---

## 💬 常见问题 (FAQ)

**Q: 如何修改 COS bucket 信息？**
A: 编辑 `assets/js/cos-config.js` 中的 `COS_CONFIG` 对象。

**Q: 如何禁用 WebP 转换？**
A: 设置 `imageOptimization.enableWebP = false`

**Q: 图片加载失败怎么办？**
A: 自动显示占位符。检查图片 URL 和 COS 访问权限。

**Q: 如何自定义图片质量？**
A: 在调用时指定 `quality` 参数，或修改 `COS_CONFIG` 默认值。

---

**最后更新**: 2025 年 4 月
**维护者**: Kemi Huang
