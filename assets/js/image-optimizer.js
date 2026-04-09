/**
 * 图片加载优化器
 * Image Loading Optimizer
 */

class ImageOptimizer {
  constructor(config = {}) {
    this.config = {
      lazyLoad: true,
      placeholders: true,
      errorFallback: true,
      progressiveLoading: true,
      ...config,
    };
    
    this.imageMap = new Map(); // 存储图片加载状态
    this.observer = null;
    this.init();
  }

  /**
   * 初始化图片优化器
   */
  init() {
    if (this.config.lazyLoad && 'IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    }
    
    this.setupImageLoadListeners();
  }

  /**
   * 设置交叉观察器用于懒加载
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * 为所有 COS 图片设置优化
   */
  optimizeAllImages() {
    // 选择所有 COS 图片
    const cosImages = document.querySelectorAll('[data-cos-src]');
    cosImages.forEach(img => this.optimizeImage(img));
  }

  /**
   * 优化单个图片元素
   * @param {HTMLImageElement} img - 图片元素
   */
  optimizeImage(img) {
    const cosSrc = img.dataset.cosSrc;
    if (!cosSrc) return;

    img.dataset.original = cosSrc;
    
    // 添加加载状态类
    img.classList.add('cos-img-loading');
    
    // 如果启用懒加载，观察元素
    if (this.config.lazyLoad && this.observer) {
      this.observer.observe(img);
    } else {
      this.loadImage(img);
    }

    // 添加错误处理
    if (this.config.errorFallback) {
      img.addEventListener('error', () => this.handleImageError(img));
    }

    this.imageMap.set(img, {
      src: cosSrc,
      loaded: false,
      failed: false,
    });
  }

  /**
   * 加载图片
   * @param {HTMLImageElement} img - 图片元素
   */
  loadImage(img) {
    const state = this.imageMap.get(img);
    if (!state) return;

    const options = {
      quality: parseInt(img.dataset.quality) || 85,
      format: img.dataset.format || null,
      width: parseInt(img.dataset.width) || null,
    };

    // 生成优化的 URL
    const optimizedUrl = generateCOSImageUrl(state.src, options);
    
    // 如果启用渐进式加载，先加载低质量版本
    if (this.config.progressiveLoading && !img.src) {
      const lowQualityUrl = generateCOSImageUrl(state.src, { 
        ...options, 
        quality: 40 
      });
      
      img.addEventListener('load', () => {
        if (!state.loaded) {
          state.loaded = true;
          img.classList.remove('cos-img-loading');
          img.classList.add('cos-img-loaded');
        }
      }, { once: true });

      img.src = lowQualityUrl;
      
      // 加载高质量版本
      const fullImage = new Image();
      fullImage.onload = () => {
        img.src = optimizedUrl;
      };
      fullImage.src = optimizedUrl;
    } else {
      img.src = optimizedUrl;
    }
  }

  /**
   * 处理图片加载错误
   * @param {HTMLImageElement} img - 图片元素
   */
  handleImageError(img) {
    const state = this.imageMap.get(img);
    if (state) {
      state.failed = true;
    }

    img.classList.remove('cos-img-loading');
    img.classList.add('cos-img-error');

    // 显示错误占位符
    const placeholder = img.parentElement?.querySelector('.image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  /**
   * 批量预加载关键图片
   * @param {string[]} paths - 图片路径数组
   */
  preloadCriticalImages(paths) {
    paths.forEach(path => preloadImages(path));
  }

  /**
   * 获取图片加载统计
   */
  getStats() {
    let loaded = 0;
    let failed = 0;
    let pending = 0;

    this.imageMap.forEach(state => {
      if (state.failed) failed++;
      else if (state.loaded) loaded++;
      else pending++;
    });

    return { loaded, failed, pending, total: this.imageMap.size };
  }

  /**
   * 销毁优化器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.imageMap.clear();
  }
}

/**
 * 为 COS 图片 URL 添加处理参数
 * @param {string} url - COS 图片 URL
 * @param {Object} operations - 处理操作 { quality, width, height, format, etc. }
 * @returns {string} 处理后的 URL
 */
function applyImageOperations(url, operations = {}) {
  const {
    quality,
    width,
    height,
    format,
    blur,
    brightness,
    contrast,
  } = operations;

  const params = [];

  if (quality) params.push(`imageMogr2/quality/${quality}`);
  if (width || height) params.push(`thumbnail/${width || ''}x${height || ''}`);
  if (format) params.push(`format/${format}`);
  if (blur) params.push(`blur/${blur}`);
  if (brightness !== undefined) params.push(`bright/${brightness}`);
  if (contrast !== undefined) params.push(`contrast/${contrast}`);

  if (params.length === 0) return url;

  const separator = url.includes('?') ? '|' : '?';
  return `${url}${separator}${params.join('|')}`;
}

/**
 * 生成矩形占位符（用于加载时显示）
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {string} color - 颜色
 * @returns {string} Base64 SVG 数据 URL
 */
function generatePlaceholderSvg(width = 400, height = 300, color = '#e5e7eb') {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${color}"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 设置图片加载监控
 */
function setupImageMonitoring() {
  // 监控所有图片加载
  const images = document.querySelectorAll('img[src*="kemi-assets"]');
  
  images.forEach(img => {
    img.addEventListener('load', () => {
      console.debug('[COS] 图片加载成功:', img.src.substring(0, 100));
    });
    
    img.addEventListener('error', () => {
      console.warn('[COS] 图片加载失败:', img.src.substring(0, 100));
    });
  });
}

// 创建全局实例
const imageOptimizer = new ImageOptimizer({
  lazyLoad: true,
  progressiveLoading: true,
  errorFallback: true,
});

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageOptimizer,
    applyImageOperations,
    generatePlaceholderSvg,
    setupImageMonitoring,
  };
}
