const PRESETS = {
  sunrise: {
    label: '暖阳',
    description: '柔和、明亮，适合大多数品牌网站。',
    startColor: '#FFC768',
    middleColor: '#FF9E1B',
    endColor: '#FF5A1F',
    angle: 0,
    highlight: 76,
    shape: 'circle'
  },
  mango: {
    label: '芒果汽水',
    description: '更轻快一点，适合作品集和内容站。',
    startColor: '#FFE085',
    middleColor: '#FFB01F',
    endColor: '#FF6B2D',
    angle: 8,
    highlight: 66,
    shape: 'circle'
  },
  ember: {
    label: '热浪',
    description: '底部对比更强，整体更有冲击力。',
    startColor: '#FFB15C',
    middleColor: '#FF7D00',
    endColor: '#FF3D12',
    angle: 354,
    highlight: 82,
    shape: 'circle'
  },
  softSquare: {
    label: '柔和方形',
    description: '更像应用图标，适合产品型网站。',
    startColor: '#FFC86C',
    middleColor: '#FF9F20',
    endColor: '#FF5B24',
    angle: 0,
    highlight: 72,
    shape: 'rounded-square'
  },
  coralBloom: {
    label: '珊瑚光',
    description: '偏粉橙调，适合轻盈品牌。',
    startColor: '#FFD0B5',
    middleColor: '#FF8E6E',
    endColor: '#FF5D73',
    angle: 12,
    highlight: 74,
    shape: 'circle'
  },
  peachFizz: {
    label: '蜜桃汽泡',
    description: '更甜一点，适合生活方式站点。',
    startColor: '#FFE1BA',
    middleColor: '#FFB36B',
    endColor: '#FF7A59',
    angle: 6,
    highlight: 70,
    shape: 'circle'
  },
  sunsetJam: {
    label: '落日果酱',
    description: '暖紫过渡更丰富，视觉更浓。',
    startColor: '#FFCA80',
    middleColor: '#FF7B54',
    endColor: '#D9487D',
    angle: 18,
    highlight: 78,
    shape: 'circle'
  },
  lavaPop: {
    label: '熔岩泡泡',
    description: '高饱和暖红，适合强调存在感。',
    startColor: '#FFC372',
    middleColor: '#FF6E27',
    endColor: '#FF2A3D',
    angle: 356,
    highlight: 80,
    shape: 'circle'
  },
  oceanMist: {
    label: '海雾',
    description: '清透蓝绿，适合科技和工具类。',
    startColor: '#B9F4FF',
    middleColor: '#53C7F5',
    endColor: '#1570EF',
    angle: 0,
    highlight: 68,
    shape: 'circle'
  },
  lagoon: {
    label: '蓝湖',
    description: '更沉静的蓝青配色。',
    startColor: '#CCFFF1',
    middleColor: '#2FD5C4',
    endColor: '#1565D8',
    angle: 10,
    highlight: 70,
    shape: 'circle'
  },
  arcticGlow: {
    label: '极地光',
    description: '冷白到冰蓝，干净而现代。',
    startColor: '#F2FCFF',
    middleColor: '#88D8FF',
    endColor: '#3D7CFF',
    angle: 4,
    highlight: 84,
    shape: 'circle'
  },
  auroraMint: {
    label: '极光薄荷',
    description: '青绿和蓝紫混合，识别度高。',
    startColor: '#D9FFE8',
    middleColor: '#49E5B1',
    endColor: '#5865F2',
    angle: 24,
    highlight: 76,
    shape: 'circle'
  },
  mintCandy: {
    label: '薄荷糖',
    description: '轻松、清新，适合内容社区。',
    startColor: '#E4FFE6',
    middleColor: '#86F2A8',
    endColor: '#2BCB7E',
    angle: 0,
    highlight: 64,
    shape: 'circle'
  },
  matchaCream: {
    label: '抹茶奶霜',
    description: '低刺激的柔和绿色。',
    startColor: '#F2FFD5',
    middleColor: '#B6E667',
    endColor: '#58B84E',
    angle: 350,
    highlight: 72,
    shape: 'rounded-square'
  },
  neonLime: {
    label: '霓虹青柠',
    description: '更锐利醒目，适合实验风格。',
    startColor: '#F7FF8A',
    middleColor: '#8FFF44',
    endColor: '#14C96F',
    angle: 8,
    highlight: 82,
    shape: 'rounded-square'
  },
  skyBerry: {
    label: '天青莓果',
    description: '蓝到莓紫，适合年轻产品。',
    startColor: '#D5EDFF',
    middleColor: '#6CB7FF',
    endColor: '#8B49FF',
    angle: 16,
    highlight: 74,
    shape: 'circle'
  },
  iris: {
    label: '鸢尾',
    description: '蓝紫过渡自然，偏精致气质。',
    startColor: '#E0D5FF',
    middleColor: '#9A78FF',
    endColor: '#5B39D6',
    angle: 0,
    highlight: 70,
    shape: 'circle'
  },
  violetPop: {
    label: '紫罗兰电流',
    description: '带一点霓虹感，适合创意站点。',
    startColor: '#F1D4FF',
    middleColor: '#C65CFF',
    endColor: '#6D28FF',
    angle: 20,
    highlight: 82,
    shape: 'rounded-square'
  },
  plumNight: {
    label: '李子夜色',
    description: '深紫到洋红，情绪更强。',
    startColor: '#FFCCE4',
    middleColor: '#C052D7',
    endColor: '#5A189A',
    angle: 340,
    highlight: 78,
    shape: 'rounded-square'
  },
  berrySoda: {
    label: '莓果汽水',
    description: '更甜一点，品牌感会更活泼。',
    startColor: '#FFD6EE',
    middleColor: '#FF7BC3',
    endColor: '#E5407A',
    angle: 8,
    highlight: 72,
    shape: 'circle'
  },
  roseQuartz: {
    label: '玫瑰石英',
    description: '低饱和粉调，适合优雅品牌。',
    startColor: '#FFE7EE',
    middleColor: '#F8A7BF',
    endColor: '#E26D95',
    angle: 0,
    highlight: 68,
    shape: 'circle'
  },
  candyDusk: {
    label: '糖果暮色',
    description: '粉蓝混色，偏梦幻氛围。',
    startColor: '#FFE0F9',
    middleColor: '#9E8CFF',
    endColor: '#4D8BFF',
    angle: 30,
    highlight: 74,
    shape: 'circle'
  },
  sandDune: {
    label: '砂丘',
    description: '沙色过渡更稳重，适合企业站。',
    startColor: '#FFF0C9',
    middleColor: '#E2B06D',
    endColor: '#9C6B3C',
    angle: 0,
    highlight: 66,
    shape: 'rounded-square'
  },
  bronzeGlow: {
    label: '铜辉',
    description: '更厚重的金属暖调。',
    startColor: '#FFE2B4',
    middleColor: '#C88B44',
    endColor: '#7A4A21',
    angle: 350,
    highlight: 72,
    shape: 'rounded-square'
  },
  cocoaBerry: {
    label: '可可莓',
    description: '棕红混合，适合精品类品牌。',
    startColor: '#F7D1C4',
    middleColor: '#C56A55',
    endColor: '#6A2C3E',
    angle: 15,
    highlight: 70,
    shape: 'rounded-square'
  },
  storm: {
    label: '风暴蓝',
    description: '深海蓝层次，适合严肃产品。',
    startColor: '#D7E6FF',
    middleColor: '#5687FF',
    endColor: '#173B8F',
    angle: 356,
    highlight: 74,
    shape: 'rounded-square'
  },
  cyberSun: {
    label: '赛博日光',
    description: '黄橙到蓝紫，冲突感更强。',
    startColor: '#FFF08A',
    middleColor: '#FF8F3F',
    endColor: '#505CFF',
    angle: 28,
    highlight: 80,
    shape: 'circle'
  },
  polarBerry: {
    label: '冰莓',
    description: '冷感蓝紫里带一点甜味。',
    startColor: '#E5F7FF',
    middleColor: '#72C7FF',
    endColor: '#C74DFF',
    angle: 12,
    highlight: 76,
    shape: 'circle'
  }
};

const DEFAULT_PRESET = 'sunrise';
const state = { ...PRESETS[DEFAULT_PRESET], preset: DEFAULT_PRESET };

const elements = {
  presetList: document.getElementById('presetList'),
  previewStage: document.getElementById('previewStage'),
  tabPreview: document.getElementById('tabPreview'),
  preview64: document.getElementById('preview64'),
  preview32: document.getElementById('preview32'),
  preview16: document.getElementById('preview16'),
  startColor: document.getElementById('startColor'),
  middleColor: document.getElementById('middleColor'),
  endColor: document.getElementById('endColor'),
  startColorHex: document.getElementById('startColorHex'),
  middleColorHex: document.getElementById('middleColorHex'),
  endColorHex: document.getElementById('endColorHex'),
  startSwatch: document.getElementById('startSwatch'),
  middleSwatch: document.getElementById('middleSwatch'),
  endSwatch: document.getElementById('endSwatch'),
  shape: document.getElementById('shape'),
  angle: document.getElementById('angle'),
  highlight: document.getElementById('highlight'),
  angleValue: document.getElementById('angleValue'),
  highlightValue: document.getElementById('highlightValue'),
  downloadSvg: document.getElementById('downloadSvg'),
  downloadPng: document.getElementById('downloadPng'),
  copySvg: document.getElementById('copySvg'),
  copyHtml: document.getElementById('copyHtml'),
  resetControls: document.getElementById('resetControls'),
  htmlSnippet: document.getElementById('htmlSnippet'),
  statusText: document.getElementById('statusText')
};

function normalizeHex(value, fallback) {
  const trimmed = String(value || '').trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const chars = trimmed.slice(1).split('');
    return `#${chars.map((char) => `${char}${char}`).join('').toUpperCase()}`;
  }

  return fallback;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showStatus(message) {
  elements.statusText.textContent = message;

  window.clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = window.setTimeout(() => {
    if (elements.statusText.textContent === message) {
      elements.statusText.textContent = '';
    }
  }, 2400);
}

function renderPresetList() {
  elements.presetList.innerHTML = Object.entries(PRESETS)
    .map(([key, preset]) => {
      const isActive = state.preset === key ? 'is-active' : '';
      const previewSvg = buildSvg(`preset-${key}`, preset);

      return `
        <button
          type="button"
          class="preset-button glass-panel ${isActive}"
          data-preset="${key}"
        >
          <div class="preset-preview">
            ${previewSvg}
          </div>
          <div class="px-1 pb-1 pt-4">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="display-font text-lg font-bold text-[#25140a]">${escapeHtml(preset.label)}</span>
              <span class="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-[#9d6126]">${escapeHtml(
                preset.shape === 'circle' ? 'Circle' : 'App'
              )}</span>
            </div>
            <p class="text-sm leading-6 text-[#6f4b37]">${escapeHtml(preset.description)}</p>
          </div>
        </button>
      `;
    })
    .join('');

  elements.presetList.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      applyPreset(button.dataset.preset);
    });
  });
}

function applyPreset(presetKey) {
  const preset = PRESETS[presetKey];

  if (!preset) {
    return;
  }

  Object.assign(state, preset, { preset: presetKey });
  syncControls();
  renderAll();
}

function getShapeMarkup(shapeValue, inset, boxSize) {
  if (shapeValue === 'circle') {
    const radius = boxSize / 2;
    const center = inset + radius;

    return {
      clip: `<circle cx="${center}" cy="${center}" r="${radius}" />`,
      stroke: `<circle cx="${center}" cy="${center}" r="${radius - 0.8}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.6" />`
    };
  }

  const radiusRatio = shapeValue === 'squircle' ? 0.34 : 0.24;
  const radius = boxSize * radiusRatio;

  return {
    clip: `<rect x="${inset}" y="${inset}" width="${boxSize}" height="${boxSize}" rx="${radius}" ry="${radius}" />`,
    stroke: `<rect x="${inset + 0.8}" y="${inset + 0.8}" width="${boxSize - 1.6}" height="${boxSize - 1.6}" rx="${Math.max(
      radius - 0.8,
      0
    )}" ry="${Math.max(radius - 0.8, 0)}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.6" />`
  };
}

function buildSvg(idPrefix, options = state) {
  const size = 512;
  const inset = 0;
  const boxSize = size;
  const highlightStrength = Number(options.highlight) / 100;
  const shape = getShapeMarkup(options.shape, inset, boxSize);
  const baseGradientId = `${idPrefix}-base`;
  const topGlowId = `${idPrefix}-top-glow`;
  const bottomGlowId = `${idPrefix}-bottom-glow`;
  const clipId = `${idPrefix}-clip`;

  return `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="渐变网站图标预览">
      <defs>
        <linearGradient id="${baseGradientId}" x1="50%" y1="0%" x2="50%" y2="100%" gradientTransform="rotate(${options.angle} .5 .5)">
          <stop offset="0%" stop-color="${options.startColor}" />
          <stop offset="58%" stop-color="${options.middleColor}" />
          <stop offset="100%" stop-color="${options.endColor}" />
        </linearGradient>
        <radialGradient id="${topGlowId}" cx="30%" cy="18%" r="72%">
          <stop offset="0%" stop-color="#FFF8D8" stop-opacity="${0.18 + highlightStrength * 0.36}" />
          <stop offset="38%" stop-color="${options.startColor}" stop-opacity="${0.1 + highlightStrength * 0.22}" />
          <stop offset="100%" stop-color="${options.startColor}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${bottomGlowId}" cx="52%" cy="88%" r="62%">
          <stop offset="0%" stop-color="${options.endColor}" stop-opacity="${0.16 + highlightStrength * 0.34}" />
          <stop offset="50%" stop-color="${options.endColor}" stop-opacity="${0.1 + highlightStrength * 0.14}" />
          <stop offset="100%" stop-color="${options.endColor}" stop-opacity="0" />
        </radialGradient>
        <clipPath id="${clipId}">
          ${shape.clip}
        </clipPath>
      </defs>
      <g clip-path="url(#${clipId})">
        <rect width="512" height="512" fill="url(#${baseGradientId})" />
        <rect width="512" height="512" fill="url(#${topGlowId})" />
        <rect width="512" height="512" fill="url(#${bottomGlowId})" />
      </g>
      ${shape.stroke}
    </svg>
  `.trim();
}

function updateFavicon(svgString) {
  let link = document.querySelector('link[data-generated-favicon]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.dataset.generatedFavicon = 'true';
    document.head.appendChild(link);
  }

  link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

function renderIconInto(element, prefix) {
  element.innerHTML = buildSvg(prefix);
}

function getSvgMarkup() {
  return buildSvg('download');
}

function renderSnippet() {
  const snippet = `<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;
  elements.htmlSnippet.textContent = snippet;
}

function renderSwatches() {
  if (elements.startSwatch) {
    elements.startSwatch.style.background = state.startColor;
  }

  if (elements.middleSwatch) {
    elements.middleSwatch.style.background = state.middleColor;
  }

  if (elements.endSwatch) {
    elements.endSwatch.style.background = state.endColor;
  }
}

function syncControls() {
  elements.startColor.value = state.startColor;
  elements.middleColor.value = state.middleColor;
  elements.endColor.value = state.endColor;
  elements.startColorHex.value = state.startColor;
  elements.middleColorHex.value = state.middleColor;
  elements.endColorHex.value = state.endColor;
  elements.shape.value = state.shape;
  elements.angle.value = String(state.angle);
  elements.highlight.value = String(state.highlight);
}

function renderAll() {
  renderPresetList();
  renderSwatches();
  renderSnippet();
  renderIconInto(elements.previewStage, 'preview-stage');
  renderIconInto(elements.tabPreview, 'preview-tab');
  renderIconInto(elements.preview64, 'preview-64');
  renderIconInto(elements.preview32, 'preview-32');
  renderIconInto(elements.preview16, 'preview-16');
  elements.angleValue.textContent = `${state.angle}°`;
  elements.highlightValue.textContent = `${state.highlight}%`;
  updateFavicon(getSvgMarkup());
}

function handleColorPair(colorKey, colorInput, textInput) {
  const commitValue = (value) => {
    const next = normalizeHex(value, state[colorKey]);
    state[colorKey] = next;
    colorInput.value = next;
    textInput.value = next;
    state.preset = '';
    renderAll();
  };

  colorInput.addEventListener('input', () => commitValue(colorInput.value));
  textInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(textInput.value) || /^#[0-9a-fA-F]{3}$/.test(textInput.value)) {
      commitValue(textInput.value);
    }
  });
  textInput.addEventListener('blur', () => {
    commitValue(textInput.value);
  });
}

function svgToPngBlob(svgString, size) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      context.clearRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('Unable to create PNG blob.'));
      }, 'image/png');
    };

    image.onerror = () => reject(new Error('Unable to load generated SVG.'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    showStatus(successMessage);
  } catch (error) {
    console.error(error);
    showStatus('复制失败，请检查浏览器权限。');
  }
}

handleColorPair('startColor', elements.startColor, elements.startColorHex);
handleColorPair('middleColor', elements.middleColor, elements.middleColorHex);
handleColorPair('endColor', elements.endColor, elements.endColorHex);

elements.shape.addEventListener('change', () => {
  state.shape = elements.shape.value;
  state.preset = '';
  renderAll();
});

elements.angle.addEventListener('input', () => {
  state.angle = Number(elements.angle.value);
  state.preset = '';
  renderAll();
});

elements.highlight.addEventListener('input', () => {
  state.highlight = Number(elements.highlight.value);
  state.preset = '';
  renderAll();
});

elements.downloadSvg.addEventListener('click', () => {
  const svgString = getSvgMarkup();
  downloadBlob(
    new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }),
    'gradient-favicon.svg'
  );
  showStatus('SVG 已下载。');
});

elements.downloadPng.addEventListener('click', async () => {
  try {
    const svgString = getSvgMarkup();
    const pngBlob = await svgToPngBlob(svgString, 512);
    downloadBlob(pngBlob, 'gradient-favicon.png');
    showStatus('PNG 已下载。');
  } catch (error) {
    console.error(error);
    showStatus('PNG 导出失败，请重试。');
  }
});

elements.copySvg.addEventListener('click', async () => {
  await copyText(getSvgMarkup(), '图标代码已复制。');
});

elements.copyHtml.addEventListener('click', async () => {
  await copyText(elements.htmlSnippet.textContent, '接入代码已复制。');
});

elements.resetControls.addEventListener('click', () => {
  applyPreset(DEFAULT_PRESET);
  showStatus('已恢复初始方案。');
});

syncControls();
renderAll();
