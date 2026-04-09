/**
 * 腾讯云 COS 配置和公共函数
 * Tencent Cloud COS Configuration and Utilities
 */

const COS_CONFIG = {
  // COS 存储桶配置
  bucket: 'kemi-assets-1420707478',
  region: 'ap-shanghai',
  // CDN 加速域名（可选，留空则使用默认 COS 域名）
  cdnDomain: 'https://kemi-assets-1420707478.cos.ap-shanghai.myqcloud.com',
  
  // 图片质量和格式优化参数
  imageOptimization: {
    // 启用基础图片处理
    enabled: true,
    // 默认质量 (1-100)
    quality: 85,
    // 启用 WebP 自适应（如果浏览器支持）
    enableWebP: true,
    // 启用渐进式 JPEG
    progressive: true,
    // 启用智能缩放
    smartResize: true,
  },

  // 根据设备类型的图片优化策略
  responsiveOptimization: {
    mobile: {
      quality: 75,
      maxWidth: 800,
    },
    tablet: {
      quality: 80,
      maxWidth: 1200,
    },
    desktop: {
      quality: 85,
      maxWidth: 1920,
    },
  },
};

/**
 * 生成优化的 COS 图片 URL
 * @param {string} path - 图片相对路径 (e.g., 'images/avatar.jpg')
 * @param {Object} options - 优化选项
 * @returns {string} 优化后的完整 URL
 */
function generateCOSImageUrl(path, options = {}) {
  const {
    quality = COS_CONFIG.imageOptimization.quality,
    format = null, // 'webp', 'jpg', 'png', etc.
    width = null,
    height = null,
    mode = 'lfit', // lfit (等比例缩放) | fill (填充) | crop (裁剪)
    responsive = false,
  } = options;

  // 规范化路径
  let normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  // 构建基础 URL
  let url = `${COS_CONFIG.cdnDomain}/${normalizedPath}`;

  // 构建图片处理参数
  const params = [];

  // 质量参数
  if (quality < 100) {
    params.push(`imageMogr2/quality/${quality}`);
  }

  // 格式参数（支持 WebP 自适应）
  if (format) {
    if (format === 'webp' && COS_CONFIG.imageOptimization.enableWebP) {
      params.push(`format/webp`);
    } else if (format) {
      params.push(`format/${format}`);
    }
  } else if (COS_CONFIG.imageOptimization.enableWebP && supportsWebP()) {
    params.push(`format/webp`);
  }

  // 尺寸参数
  if (width || height) {
    const sizeParam = `thumbnail/${width || ''}x${height || ''}`;
    params.push(sizeParam);
  }

  // 如果有参数，添加到 URL
  if (params.length > 0) {
    url += `?${params.join('|')}`;
  }

  return url;
}

/**
 * 获取响应式图片 URL（根据设备类型优化）
 * @param {string} path - 图片相对路径
 * @param {string} deviceType - 设备类型 ('mobile' | 'tablet' | 'desktop')
 * @returns {string} 优化后的 URL
 */
function getResponsiveImageUrl(path, deviceType = 'desktop') {
  const optimization = COS_CONFIG.responsiveOptimization[deviceType] || COS_CONFIG.responsiveOptimization.desktop;
  return generateCOSImageUrl(path, {
    quality: optimization.quality,
    width: optimization.maxWidth,
    mode: 'lfit',
  });
}

/**
 * 自动销检测设备类型
 * @returns {string} 设备类型
 */
function detectDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * 获取自适应响应式图片 URL
 * @param {string} path - 图片相对路径
 * @returns {string} 根据当前设备优化的 URL
 */
function getAdaptiveImageUrl(path) {
  return getResponsiveImageUrl(path, detectDeviceType());
}

/**
 * 检查浏览器是否支持 WebP
 * @returns {boolean}
 */
function supportsWebP() {
  if (typeof window === 'undefined') return false;
  
  // 快速检查
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * 生成图片的多个尺寸变体（用于 srcset）
 * @param {string} path - 图片相对路径
 * @returns {string} srcset 字符串
 */
function generateImageSrcSet(path) {
  if (!COS_CONFIG.imageOptimization.smartResize) {
    return generateCOSImageUrl(path);
  }

  const sizes = [
    { width: 480, dpr: '1x' },
    { width: 960, dpr: '2x' },
    { width: 1440, dpr: '3x' },
  ];

  return sizes
    .map(({ width, dpr }) => `${generateCOSImageUrl(path, { width })} ${dpr}`)
    .join(', ');
}

/**
 * 为图片元素设置优化的源
 * @param {HTMLImageElement} img - 图片元素
 * @param {string} path - 图片相对路径
 * @param {Object} options - 优化选项
 */
function optimizeImageElement(img, path, options = {}) {
  img.src = generateCOSImageUrl(path, options);
  
  if (COS_CONFIG.imageOptimization.smartResize) {
    img.srcset = generateImageSrcSet(path);
  }

  // 添加 loading 属性用于原生懒加载
  if (!img.hasAttribute('loading')) {
    img.loading = 'lazy';
  }
}

/**
 * 预加载图片
 * @param {string|string[]} paths - 单个或多个图片路径
 */
function preloadImages(paths) {
  const pathArray = Array.isArray(paths) ? paths : [paths];
  
  pathArray.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = generateCOSImageUrl(path);
    document.head.appendChild(link);
  });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COS_CONFIG,
    generateCOSImageUrl,
    getResponsiveImageUrl,
    getAdaptiveImageUrl,
    detectDeviceType,
    supportsWebP,
    generateImageSrcSet,
    optimizeImageElement,
    preloadImages,
  };
}
