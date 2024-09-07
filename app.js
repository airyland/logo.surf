let defaultSize = 512

const generateIconSVG = (options) => {
  const {
    text = 'AI',
      size = defaultSize,
      bgColor = '#131516',
      radius = 80,
      fontFamily = 'Arial',
      fontWeight = 'normal',
      textColor = '#70e000',
      verticalOffset = 0
  } = options;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("xmlns", svgNS);

  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("width", size);
  rect.setAttribute("height", size);
  rect.setAttribute("fill", bgColor);
  rect.setAttribute("rx", radius);
  rect.setAttribute("ry", radius);
  svg.appendChild(rect);

  const textElement = document.createElementNS(svgNS, "text");
  textElement.setAttribute("x", "50%");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("dominant-baseline", "central");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("font-family", fontFamily);
  textElement.setAttribute("font-weight", fontWeight);
  textElement.setAttribute("fill", textColor);
  textElement.textContent = text;
  svg.appendChild(textElement);

  const adjustTextSizeAndPosition = () => {
    const isAllEnglish = /^[A-Za-z0-9\s]+$/.test(text);
    const charCount = text.length;

    let fontSize;
    if (charCount <= 2) {
      fontSize = size * 0.8;
    } else if (isAllEnglish) {
      fontSize = size * 0.75;
    } else {
      fontSize = size * 0.6;
    }

    textElement.setAttribute("font-size", fontSize);

    const maxWidth = size * 0.95;
    const maxHeight = size * 0.95;
    const scaleFactor = isAllEnglish ? 0.98 : 0.95;

    let iterations = 0;
    const maxIterations = 50;

    while (fontSize > 1 && iterations < maxIterations) {
      const bbox = textElement.getBBox();
      if (bbox.width <= maxWidth && bbox.height <= maxHeight) {
        break;
      }
      fontSize *= scaleFactor;
      textElement.setAttribute("font-size", fontSize);
      iterations++;
    }

    if (verticalOffset !== 0) {
      const offsetPixels = (size * verticalOffset) / 100;
      textElement.setAttribute("dy", `${offsetPixels}`);
    }
  };

  document.body.appendChild(svg);
  adjustTextSizeAndPosition();
  document.body.removeChild(svg);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};

const generateIconSVG4 = (options) => {
  const {
    text = 'AI',
      size = defaultSize,
      bgColor = '#131516',
      radius = 80,
      fontFamily = 'Arial',
      fontWeight = 'normal',
      textColor = '#70e000',
      verticalOffset = 0
  } = options;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("xmlns", svgNS);

  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("width", size);
  rect.setAttribute("height", size);
  rect.setAttribute("fill", bgColor);
  rect.setAttribute("rx", radius);
  rect.setAttribute("ry", radius);
  svg.appendChild(rect);

  const textElement = document.createElementNS(svgNS, "text");
  textElement.setAttribute("x", "50%");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("font-family", fontFamily);
  textElement.setAttribute("font-weight", fontWeight);
  textElement.setAttribute("fill", textColor);
  textElement.textContent = text;
  svg.appendChild(textElement);

  function autoAdjustVerticalPosition(text, fontFamily, fontSize, fontWeight, svgSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const metrics = ctx.measureText(text);

    const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const baselineOffset = metrics.fontBoundingBoxDescent;

    const textMiddleToBaseline = actualHeight / 2 - metrics.actualBoundingBoxDescent;

    const idealBaseline = svgSize / 2 + textMiddleToBaseline;
    const currentBaseline = svgSize / 2 + baselineOffset;
    const offset = (idealBaseline - currentBaseline) / svgSize * 100;

    return offset;
  }

  const adjustTextSizeAndPosition = () => {
    const isAllEnglish = /^[A-Za-z0-9\s]+$/.test(text);
    const charCount = text.length;

    let fontSize;
    if (charCount <= 2) {
      fontSize = size * 0.8;
    } else if (isAllEnglish) {
      fontSize = size * 0.75;
    } else {
      fontSize = size * 0.6;
    }

    textElement.setAttribute("font-size", fontSize);

    const maxWidth = size * 0.95;
    const maxHeight = size * 0.95;
    const scaleFactor = isAllEnglish ? 0.98 : 0.95;

    let iterations = 0;
    const maxIterations = 50;

    while (fontSize > 1 && iterations < maxIterations) {
      const bbox = textElement.getBBox();
      if (bbox.width <= maxWidth && bbox.height <= maxHeight) {
        break;
      }
      fontSize *= scaleFactor;
      textElement.setAttribute("font-size", fontSize);
      iterations++;
    }

    const autoOffset = autoAdjustVerticalPosition(text, fontFamily, fontSize, fontWeight, size);

    const totalOffset = autoOffset + parseFloat(verticalOffset);

    textElement.setAttribute("dy", `${totalOffset}%`);
  };

  document.body.appendChild(svg);
  adjustTextSizeAndPosition();
  document.body.removeChild(svg);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};

const generateIconSVG3 = (options) => {
  const {
    text = 'AI',
      size = defaultSize,
      bgColor = '#131516',
      radius = 80,
      fontFamily = 'Arial',
      fontWeight = 'normal',
      textColor = '#70e000',
      verticalOffset = 0
  } = options;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("xmlns", svgNS);

  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("width", size);
  rect.setAttribute("height", size);
  rect.setAttribute("fill", bgColor);
  rect.setAttribute("rx", radius);
  rect.setAttribute("ry", radius);
  svg.appendChild(rect);

  const textElement = document.createElementNS(svgNS, "text");
  textElement.setAttribute("x", "50%");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("font-family", fontFamily);
  textElement.setAttribute("font-weight", fontWeight);
  textElement.setAttribute("fill", textColor);
  textElement.textContent = text;
  svg.appendChild(textElement);

  function autoAdjustVerticalPosition(text, fontFamily, fontSize, svgSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const metrics = ctx.measureText(text);
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log('actualheight', actualHeight)
    const centerY = svgSize / 2;
    const textY = centerY + (metrics.actualBoundingBoxAscent - actualHeight / 2);
    const offset = (textY - centerY) / svgSize * 100;

    return -offset;
  }

  const adjustTextSizeAndPosition = () => {
    const isAllEnglish = /^[A-Za-z0-9\s]+$/.test(text);
    const charCount = text.length;

    let fontSize;
    if (charCount <= 2) {
      fontSize = size * 0.8;
    } else if (isAllEnglish) {
      fontSize = size * 0.75;
    } else {
      fontSize = size * 0.6;
    }

    textElement.setAttribute("font-size", fontSize);

    const maxWidth = size * 0.95;
    const maxHeight = size * 0.95;
    const scaleFactor = isAllEnglish ? 0.98 : 0.95;

    let iterations = 0;
    const maxIterations = 50;

    while (fontSize > 1 && iterations < maxIterations) {
      const bbox = textElement.getBBox();
      if (bbox.width <= maxWidth && bbox.height <= maxHeight) {
        break;
      }
      fontSize *= scaleFactor;
      textElement.setAttribute("font-size", fontSize);
      iterations++;
    }

    const autoOffset = autoAdjustVerticalPosition(text, fontFamily, fontSize, size);

    const totalOffset = autoOffset + parseFloat(verticalOffset);
    console.log('total offset', totalOffset)

    textElement.setAttribute("dy", `${totalOffset}%`);
  };

  document.body.appendChild(svg);
  adjustTextSizeAndPosition();
  document.body.removeChild(svg);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};

const generateIconSVG2 = (options) => {
  const {
    text = 'AI',
      size = defaultSize,
      bgColor = '#131516',
      radius = 80,
      fontFamily = 'Arial',
      fontWeight = 'normal',
      textColor = '#70e000',
      verticalOffset = 0
  } = options;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("xmlns", svgNS);
 
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("width", size);
  rect.setAttribute("height", size);
  rect.setAttribute("fill", bgColor);
  rect.setAttribute("rx", radius);
  rect.setAttribute("ry", radius);
  svg.appendChild(rect);


  const textElement = document.createElementNS(svgNS, "text");
  textElement.setAttribute("x", "50%");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("dominant-baseline", "central");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("font-family", fontFamily);
  textElement.setAttribute("font-weight", fontWeight);
  textElement.setAttribute("fill", textColor);
  textElement.textContent = text;
  svg.appendChild(textElement);

  function autoAdjustVerticalPosition(text, fontFamily, fontSize, svgSize) {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;

    const metrics = ctx.measureText(text);

    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const centerY = svgSize / 2;
    const textY = centerY + (metrics.actualBoundingBoxAscent - actualHeight / 2);
    const offset = (textY - centerY) / svgSize * 100;

    return -offset;
  }

  const adjustTextSizeAndPosition = () => {
    const isAllEnglish = /^[A-Za-z0-9\s]+$/.test(text);
    const charCount = text.length;

    let fontSize;
    if (charCount <= 2) {
      fontSize = size * 0.8; // Larger initial size for 1-2 characters
    } else if (isAllEnglish) {
      fontSize = size * 0.75; // Increased initial size for English
    } else {
      fontSize = size * 0.6; // Slightly increased for other characters
    }

    textElement.setAttribute("font-size", fontSize);

    const maxWidth = size * 0.95;
    const maxHeight = size * 0.95;
    const scaleFactor = isAllEnglish ? 0.98 : 0.95;

    let iterations = 0;
    const maxIterations = 50; // Prevent infinite loop

    while (fontSize > 1 && iterations < maxIterations) {
      const bbox = textElement.getBBox();
      if (bbox.width <= maxWidth && bbox.height <= maxHeight) {
        break;
      }
      fontSize *= scaleFactor;
      textElement.setAttribute("font-size", fontSize);
      iterations++;
    }

    // Fine-tune vertical position
    const bbox = textElement.getBBox();
    const verticalOffset = (size - bbox.height) / 2 - bbox.y;
    textElement.setAttribute("dy", verticalOffset);
  };

  // We need to append the SVG to the document temporarily to get accurate measurements
  document.body.appendChild(svg);
  adjustTextSizeAndPosition();
  document.body.removeChild(svg);

  // Convert SVG to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};



const colorSchemes = [{
    bg: '#1a365d',
    text: '#ffffff',
    name: 'Deep Blue'
  },
  {
    bg: '#2D3748',
    text: '#ED8936',
    name: 'Dark Gray & Orange'
  },
  {
    bg: '#744210',
    text: '#F6E05E',
    name: 'Brown & Yellow'
  },
  {
    bg: '#1A202C',
    text: '#63B3ED',
    name: 'Almost Black & Sky Blue'
  },
  {
    bg: '#702459',
    text: '#FBBF24',
    name: 'Purple & Yellow'
  },
  {
    bg: '#065F46',
    text: '#6EE7B7',
    name: 'Dark Green & Light Green'
  },
  {
    bg: '#3730A3',
    text: '#FCA5A5',
    name: 'Indigo & Light Red'
  },
  {
    bg: '#131516',
    text: '#70e000',
    name: 'Black & Neon Green'
  },
  {
    bg: '#E53E3E',
    text: '#FFFFFF',
    name: 'Red & White'
  },
  {
    bg: '#2B6CB0',
    text: '#BEE3F8',
    name: 'Blue & Light Blue'
  },
  {
    bg: '#2D3748',
    text: '#F7FAFC',
    name: 'Dark Gray & Off White'
  },
  {
    bg: '#975A16',
    text: '#FEFCBF',
    name: 'Brown & Pale Yellow'
  },
  {
    bg: '#276749',
    text: '#C6F6D5',
    name: 'Green & Pale Green'
  },
  {
    bg: '#6B46C1',
    text: '#E9D8FD',
    name: 'Purple & Lavender'
  },
  {
    bg: '#2C7A7B',
    text: '#81E6D9',
    name: 'Teal & Light Teal'
  },
  {
    bg: '#9C4221',
    text: '#FEEBC8',
    name: 'Burnt Orange & Peach'
  },
  {
    bg: '#000000',
    text: '#FFA31A',
    name: 'Bold Black & Yellow'
  }
];

const createColorSchemeButtons = () => {
  const container = document.getElementById('colorSchemes');
  colorSchemes.forEach((scheme, index) => {
    const button = document.createElement('button');
    button.className = 'py-2 px-2.5 rounded flex items-center justify-start hover:ring-2 hover:ring-gray-300 transition-all w-full';
    button.style.backgroundColor = scheme.bg;
    button.innerHTML = `
                 <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${scheme.text};"></span>
                 <span class="ml-2 text-xs truncate" style="color: ${scheme.text};">${scheme.name}</span>
             `;
    button.title = scheme.name; // Add title for tooltip on hover
    button.addEventListener('click', () => applyColorScheme(index));
    container.appendChild(button);
  });
};

const applyColorScheme = (index) => {
  const scheme = colorSchemes[index];
  document.getElementById('bgColor').value = scheme.bg;
  document.getElementById('textColor').value = scheme.text;
  document.getElementById('bgColorPicker').value = scheme.bg;
  document.getElementById('textColorPicker').value = scheme.text;
  document.getElementById('bgColorPreview').style.backgroundColor = scheme.bg;
  document.getElementById('textColorPreview').style.backgroundColor = scheme.text;
  generateIcon();
};


const defaultSettings = {
  text: 'AI',
  size: defaultSize,
  bgColor: '#131516',
  radius: 80,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  textColor: '#70e000',
  verticalOffset: 0
};

const generateIcon = () => {
  const options = {
    text: document.getElementById('text').value,
    size: parseInt(document.getElementById('size').value),
    bgColor: document.getElementById('bgColor').value,
    radius: parseInt(document.getElementById('radius').value),
    fontFamily: document.getElementById('fontFamily').value || 'Arial, sans-serif',
    fontWeight: document.getElementById('fontWeight').value,
    textColor: document.getElementById('textColor').value,
    verticalOffset: document.getElementById('verticalOffset').value || 0
  };

  const svgString = generateIconSVG(options);

  const preview = document.getElementById('preview');
  preview.innerHTML = svgString;
  return svgString;
};

const createFavicon = (size) => {
  const svgString = generateIcon();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    };
    const encodedSvg = encodeURIComponent(svgString);
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  });
};

const generateFavicons = async () => {
  const zip = new JSZip();

  // Add SVG
  const svgString = generateIcon();
  zip.file("favicon.svg", svgString);

  // Add PNGs
  const sizes = [16, 32, 180, 192, 512, 2048];
  const nameMap = {
    "180": "apple-touch-icon.png"
  }
  for (let size of sizes) {
    const blob = await createFavicon(size);
    zip.file(nameMap[size] || `favicon-${size}x${size}.png`, blob);
  }

  // Add ICO (16x16 and 32x32 combined)
  const ico16 = await createFavicon(16);
  const ico32 = await createFavicon(32);
  const ico48 = await createFavicon(48);
  // Note: Proper ICO creation requires additional processing
  // This is a simplified version
  const icoBlob = new Blob([ico16, ico32, ico48], {
    type: "image/x-icon"
  });
  zip.file("favicon.ico", icoBlob);

  // Generate ZIP file
  const content = await zip.generateAsync({
    type: "blob"
  });

  const date = new Date()
  const name = `${document.getElementById('text').value.trim()}-favicons-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}.zip`
  saveAs(content, name);
};

// Color picker setup
const setupColorPicker = (inputId, pickerId, previewId) => {
  const input = document.getElementById(inputId);
  const picker = document.getElementById(pickerId);
  const preview = document.getElementById(previewId);

  const updateColor = () => {
    preview.style.backgroundColor = input.value;
    picker.value = input.value;
    generateIcon();
  };

  input.addEventListener('input', updateColor);
  input.addEventListener('change', () => {
    if (/^#[0-9A-F]{6}$/i.test(input.value)) {
      updateColor();
    } else {
      input.value = '#000000';
      updateColor();
    }
  });

  picker.addEventListener('input', () => {
    input.value = picker.value;
    updateColor();
  });

  preview.addEventListener('click', () => picker.click());

  updateColor();
};

setupColorPicker('bgColor', 'bgColorPicker', 'bgColorPreview');
setupColorPicker('textColor', 'textColorPicker', 'textColorPreview');

// Reset functionality
const resetToDefault = () => {
  Object.keys(defaultSettings).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.value = defaultSettings[key];
      if (key === 'bgColor' || key === 'textColor') {
        const preview = document.getElementById(`${key}Preview`);
        const picker = document.getElementById(`${key}Picker`);
        preview.style.backgroundColor = defaultSettings[key];
        picker.value = defaultSettings[key];
      }
    }
  });
  document.getElementById('verticalOffsetValue').textContent = '0%';

  generateIcon();
};

// Copy HTML code functionality
document.getElementById('copyHtmlCode').addEventListener('click', () => {
  const htmlCode = document.getElementById('htmlCode').textContent;
  navigator.clipboard.writeText(htmlCode).then(() => {
    alert('HTML code copied to clipboard!');
  });
});

// Event listeners
document.getElementById('resetBtn').addEventListener('click', resetToDefault);
document.getElementById('generateBtn').addEventListener('click', generateIcon);
document.getElementById('downloadZip').addEventListener('click', generateFavicons);
document.getElementById('downloadSvg').addEventListener('click', () => {
  const svgString = generateIcon();
  const blob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8'
  });
  saveAs(blob, 'favicon.svg');
});
// document.getElementById('downloadIco').addEventListener('click', async () => {
//     const ico16 = await createFavicon(16);
//     const ico32 = await createFavicon(32);
//     const icoBlob = new Blob([ico16, ico32], {type: "image/x-icon"});
//     saveAs(icoBlob, 'favicon.ico');
// });

function svgToPng(svgString, size) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scale = 4;
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');

    ctx.scale(scale, scale);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };
    img.onerror = (err) => {
      reject(err);
    };

    const encodedSvg = encodeURIComponent(svgString);
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  });
}

document.getElementById('downloadPng').addEventListener('click', async () => {
  const svgString = generateIcon();
  const size = parseInt(document.getElementById('size').value);
  try {
    const pngBlob = await svgToPng(svgString, size);
    const url = URL.createObjectURL(pngBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicon.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error generating PNG:', err);
    alert('There was an error generating the PNG. Please try again.');
  }
});


const verticalOffsetInput = document.getElementById('verticalOffset');
const verticalOffsetValue = document.getElementById('verticalOffsetValue');

verticalOffsetInput.addEventListener('input', function() {
  console.log('changed', this.value)
  verticalOffsetValue.textContent = `${this.value}%`;
  generateIcon();
});

// Add event listeners to all input elements
const inputElements = document.querySelectorAll('input, select');
inputElements.forEach(element => {
  element.addEventListener('input', generateIcon);
});

const fontFamilyInput = document.getElementById('fontFamily');
const fontFamilySelect = document.getElementById('fontFamilySelect');

fontFamilySelect.addEventListener('change', function() {
  console.log('this.value', this.value)
  if (this.value) {
    fontFamilyInput.value = this.value;
    generateIcon();
  }
});

fontFamilyInput.addEventListener('blur', generateIcon);

fontFamilyInput.addEventListener('input', function() {
  fontFamilySelect.value = '';
});


// example
function createExampleDiv(svg, title, config) {
  const div = document.createElement('div');
  div.className = 'flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity';
  div.innerHTML = `
         <div class="w-16 h-16 mb-2">
           ${svg}
         </div>
         <p class="text-sm text-gray-600">${title}</p>
       `;

  div.addEventListener('click', () => {
    applyConfig(config);
    div.classList.add('example-clicked');
    setTimeout(() => div.classList.remove('example-clicked'), 300);
  });

  return div;
}

// Generate examples
const examples = [
  // {
  //   options: {
  //     text: 'PH',
  //     size: 512,
  //     bgColor: '#000000',
  //     textColor: '#FFA500',
  //     fontFamily: 'Arial, Arial, sans-serif',
  //     fontWeight: 'normal',
  //     radius: 0
  //   },
  //   title: 'Video Hub Style Part 2'
  // },
  {
    options: {
      text: 'Y',
      size: 512,
      bgColor: '#FF6600',
      textColor: '#FFFFFF',
      fontFamily: 'Arial Narrow, Arial, sans-serif',
      fontWeight: 'bold',
      radius: 16,
      fontSize: 300
    },
    title: 'Y Combinator Inspired'
  },

  {
    options: {
      text: 'SHIP',
      size: 512,
      bgColor: '#2E8B57',
      textColor: '#FFFFFF',
      fontFamily: 'Impact, ImpactFallback, sans-serif',
      fontWeight: 'normal',
      radius: 16
    },
    title: 'Ship It'
  },

  {
    options: {
      text: 'P',
      size: 512,
      bgColor: '#E60023',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 256
    },
    title: 'Visual Discovery Engine'
  },
  {
    options: {
      text: 'B',
      size: 512,
      bgColor: '#FF0000',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 8
    },
    title: 'News Network'
  },
  {
    options: {
      text: 'T',
      size: 512,
      bgColor: '#00A3E0',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica Neue, Arial, sans-serif',
      fontWeight: 'bold',
      radius: 32
    },
    title: 'Telecom Company'
  },
  {
    options: {
      text: '4',
      size: 512,
      bgColor: '#FFE600',
      textColor: '#000000',
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'French TV Channel'
  },
  {
    options: {
      text: 'C',
      size: 512,
      bgColor: '#00539B',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'Banking Giant'
  },
  {
    options: {
      text: 'U',
      size: 512,
      bgColor: '#232F3E',
      textColor: '#FF9900',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 64
    },
    title: 'Cloud Computing Leader'
  },
  {
    options: {
      text: '42',
      size: 512,
      bgColor: '#2E8B57',
      textColor: '#FFFFFF',
      fontFamily: 'Courier, monospace',
      fontWeight: 'bold',
      radius: 32
    },
    title: 'Answer to Everything'
  },
  {
    options: {
      text: '♫',
      size: 512,
      bgColor: '#FF1493',
      textColor: '#FFFFFF',
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold',
      radius: 100
    },
    title: 'Music Note'
  },

  {
    options: {
      text: 'f',
      size: 512,
      bgColor: '#1877F2',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 'bold',
      radius: 128
    },
    title: 'Social Network Giant'
  },

  {
    options: {
      text: 'in',
      size: 512,
      bgColor: '#0A66C2',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 8
    },
    title: 'Professional Network'
  },
  {
    options: {
      text: '𝕏',
      size: 512,
      bgColor: '#000000',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 128
    },
    title: 'Microblogging Platform'
  },

  {
    options: {
      text: 'N',
      size: 512,
      bgColor: '#E50914',
      textColor: '#FFFFFF',
      fontFamily: 'Bebas Neue, sans-serif',
      fontWeight: 'normal',
      radius: 4
    },
    title: 'Streaming Service'
  },
  {
    options: {
      text: 'M',
      size: 512,
      bgColor: '#0052CC',
      textColor: '#FFFFFF',
      fontFamily: 'Charlie Display, Arial, sans-serif',
      fontWeight: 'bold',
      radius: 8
    },
    title: 'Project Management Tool'
  },
  {
    options: {
      text: 'DEV',
      size: 512,
      bgColor: '#333333',
      textColor: '#00FF00',
      fontFamily: 'Courier, monospace',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Developer'
  },
  {
    options: {
      text: 'GIT',
      size: 512,
      bgColor: '#F1502F',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'bold',
      radius: 8
    },
    title: 'Git'
  },
  {
    options: {
      text: '₿',
      size: 512,
      bgColor: '#F2A900',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 256
    },
    title: 'Bitcoin'
  },
  {
    options: {
      text: 'NFT',
      size: 512,
      bgColor: '#FC3C7D',
      textColor: '#FFFFFF',
      fontFamily: 'Impact, ImpactFallback, sans-serif',
      fontWeight: 'normal',
      radius: 0
    },
    title: 'NFT'
  },
  {
    options: {
      text: '🌙',
      size: 512,
      bgColor: '#1E1E1E',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'To The Moon'
  },
  {
    options: {
      text: 'GM',
      size: 512,
      bgColor: '#FFC300',
      textColor: '#000000',
      fontFamily: 'Arial Black, sans-serif',
      fontWeight: 'normal',
      radius: 32
    },
    title: 'GM (Good Morning)'
  },
  {
    options: {
      text: '⛓',
      size: 512,
      bgColor: '#3C3C3D',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 64
    },
    title: 'Blockchain'
  },
  {
    options: {
      text: '🤔',
      size: 512,
      bgColor: '#FFD700',
      textColor: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Thinking Face'
  },
  {
    options: {
      text: 'LOL',
      size: 512,
      bgColor: '#FF4500',
      textColor: '#FFFFFF',
      fontFamily: 'Impact, ImpactFallback, sans-serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'LOL'
  },
  {
    options: {
      text: '🔥',
      size: 512,
      bgColor: '#FF6347',
      textColor: '#FFD700',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Fire Emoji'
  },
  {
    options: {
      text: 'U MAD?',
      size: 512,
      bgColor: '#E74C3C',
      textColor: '#FFFFFF',
      fontFamily: 'Impact, ImpactFallback, sans-serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'U MAD?'
  },
  {
    options: {
      text: '👌',
      size: 512,
      bgColor: '#27AE60',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'OK Hand'
  },
  {
    options: {
      text: '🍕',
      size: 512,
      bgColor: '#FF4500',
      textColor: '#FFFF00',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Pizza Time'
  },
  {
    options: {
      text: '01',
      size: 512,
      bgColor: '#00FF00',
      textColor: '#000000',
      fontFamily: 'Courier, monospace',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Binary Code'
  },
  {
    options: {
      text: '❤',
      size: 512,
      bgColor: '#FFFFFF',
      textColor: '#FF0000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 64
    },
    title: 'Love Heart'
  },
  {
    options: {
      text: '✦',
      size: 512,
      bgColor: '#191970',
      textColor: '#FFD700',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Starry Night'
  },
  {
    options: {
      text: '</>',
      size: 64,
      bgColor: '#282C34',
      textColor: '#33FF33',
      fontFamily: 'Courier',
      fontWeight: 'bold',
      radius: 8
    },
    title: 'Code Tags'
  },
  {
    options: {
      text: '404',
      size: 64,
      bgColor: '#cccccc',
      textColor: '#FFFFFF',
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'Not Found'
  },
  {
    options: {
      text: '{ }',
      size: 64,
      bgColor: '#F0DB4F',
      textColor: '#323330',
      fontFamily: 'Consolas',
      fontWeight: 'normal',
      radius: 16
    },
    title: 'JSON Object'
  },
  {
    options: {
      text: '∞',
      size: 64,
      bgColor: '#3498DB',
      textColor: '#FFFFFF',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      radius: 32
    },
    title: 'Infinity'
  },

  {
    options: {
      text: 'F2',
      size: 64,
      bgColor: '#1abc9c',
      textColor: '#ffffff',
      fontFamily: 'Impact',
      fontWeight: 'normal',
      radius: 6
    },
    title: 'Teal Duo'
  },
  {
    options: {
      text: '漢',
      size: 64,
      bgColor: '#e74c3c',
      textColor: '#f9e79f',
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'Chinese Seal'
  },
  {
    options: {
      text: 'あ',
      size: 64,
      bgColor: '#1abc9c',
      textColor: '#ffffff',
      fontFamily: '"Noto Sans JP", sans-serif',
      fontWeight: 'normal',
      radius: 16
    },
    title: 'Japanese Mint'
  },
  {
    options: {
      text: 'ß',
      size: 64,
      bgColor: '#34495e',
      textColor: '#e67e22',
      fontFamily: '"Fira Sans", sans-serif',
      fontWeight: 'normal',
      radius: 20
    },
    title: 'German Beta'
  },
  {
    options: {
      text: 'Ж',
      size: 64,
      bgColor: '#c0392b',
      textColor: '#f39c12',
      fontFamily: '"Ubuntu", sans-serif',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Kazakh Fire'
  },
  {
    options: {
      text: 'NB',
      size: 64,
      bgColor: '#e74c3c',
      textColor: '#f9e79f',
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 'normal',
      radius: 8
    },
    title: 'NB'
  },
  {
    options: {
      text: '☕',
      size: 64,
      bgColor: '#795548',
      textColor: '#fff8e1',
      fontFamily: '"Apple Color Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 32
    },
    title: 'Café Finder'
  },
  {
    options: {
      text: '🍽️',
      size: 64,
      bgColor: '#e74c3c',
      textColor: '#ffffff',
      fontFamily: '"Segoe UI Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 12
    },
    title: 'Recipe App'
  },
  {
    options: {
      text: '💰',
      size: 64,
      bgColor: '#27ae60',
      textColor: '#f9e79f',
      fontFamily: '"Noto Color Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 16
    },
    title: 'Budget Tracker'
  },
  {
    options: {
      text: '📷',
      size: 64,
      bgColor: '#34495e',
      textColor: '#ecf0f1',
      fontFamily: '"Segoe UI Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 8
    },
    title: 'Photo Editor'
  },
  {
    options: {
      text: '🎮',
      size: 64,
      bgColor: '#8e44ad',
      textColor: '#ffffff',
      fontFamily: '"Apple Color Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 24
    },
    title: 'Game Center'
  },
  {
    options: {
      text: '📅',
      size: 64,
      bgColor: '#e67e22',
      textColor: '#ffffff',
      fontFamily: '"Segoe UI Emoji", sans-serif',
      fontWeight: 'normal',
      radius: 4
    },
    title: 'Event Planner'
  },
  {
    options: {
      text: 'Dj',
      size: 64,
      bgColor: '#000000',
      textColor: '#F0FFF4',
      fontFamily: '"Impact", sans-serif',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'DJ Mixer'
  },
  {
    options: {
      text: '♨',
      size: 512,
      bgColor: '#FF4500',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'bold',
      radius: 64
    },
    title: 'Hot Springs'
  },
  {
    options: {
      text: '☃',
      size: 512,
      bgColor: '#87CEEB',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 128
    },
    title: 'Snowman'
  },
  {
    options: {
      text: '⌨',
      size: 512,
      bgColor: '#2F4F4F',
      textColor: '#00FF00',
      fontFamily: 'Courier, monospace',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Keyboard'
  },
  {
    options: {
      text: '✏',
      size: 512,
      bgColor: '#FFFF00',
      textColor: '#000000',
      fontFamily: 'Times New Roman, serif',
      fontWeight: 'normal',
      radius: 128
    },
    title: 'Pencil'
  },
  {
    options: {
      text: '⚠',
      size: 512,
      bgColor: '#FFD700',
      textColor: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Warning'
  },
  {
    options: {
      text: '♻',
      size: 512,
      bgColor: '#006400',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Recycle Symbol'
  },
  {
    options: {
      text: '♘',
      size: 512,
      bgColor: '#FFFFFF',
      textColor: '#000000',
      fontFamily: 'Times New Roman, serif',
      fontWeight: 'normal',
      radius: 0
    },
    title: 'Chess Knight'
  },
  {
    options: {
      text: '☯',
      size: 512,
      bgColor: '#000000',
      textColor: '#FFFFFF',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Yin Yang'
  },
  {
    options: {
      text: '✎',
      size: 512,
      bgColor: '#FFFACD',
      textColor: '#2F4F4F',
      fontFamily: 'Times New Roman, serif',
      fontWeight: 'normal',
      radius: 64
    },
    title: 'Pencil'
  },
  {
    options: {
      text: '☕',
      size: 512,
      bgColor: '#8B4513',
      textColor: '#FFDAB9',
      fontFamily: 'Courier, monospace',
      fontWeight: 'normal',
      radius: 32
    },
    title: 'Coffee Break'
  },
  {
    options: {
      text: '⚔',
      size: 512,
      bgColor: '#B22222',
      textColor: '#C0C0C0',
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold',
      radius: 0
    },
    title: 'Crossed Swords'
  },
  {
    options: {
      text: '♠',
      size: 512,
      bgColor: '#000000',
      textColor: '#FFFFFF',
      fontFamily: 'Times New Roman, serif',
      fontWeight: 'bold',
      radius: 16
    },
    title: 'Spade Suit'
  },
  {
    options: {
      text: '✈',
      size: 512,
      bgColor: '#87CEEB',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 32
    },
    title: 'Airplane'
  },
  {
    options: {
      text: '☘',
      size: 512,
      bgColor: '#228B22',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      radius: 256
    },
    title: 'Shamrock'
  },
  {
    options: {
      text: '☂',
      size: 512,
      bgColor: '#4682B4',
      textColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 128
    },
    title: 'Umbrella'
  },
  {
    options: {
      text: '⚡',
      size: 512,
      bgColor: '#FFD700',
      textColor: '#000000',
      fontFamily: 'Impact, ImpactFallback, sans-serif',
      fontWeight: 'normal',
      radius: 16
    },
    title: 'High Voltage'
  },
  {
    options: {
      text: '☯',
      size: 512,
      bgColor: '#FFFFFF',
      textColor: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      radius: 256
    },
    title: 'Yin Yang'
  }
];

const exampleContainer = document.querySelector('.gallery-box');

function createLogoGallery() {
  const galleryInner = document.getElementById('logo-gallery-inner');
  const logoCount = 32;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < logoCount; i++) {
    const randomExample = examples[i];
    const logoSvg = generateIconSVG({
      ...randomExample.options
    });
    const logoItem = document.createElement('div');
    logoItem.innerHTML = logoSvg;
    fragment.appendChild(logoItem);
  }

  galleryInner.appendChild(fragment);
}


document.addEventListener('DOMContentLoaded', function() {

  createColorSchemeButtons();
  generateIcon();

  createLogoGallery()

  examples.forEach(example => {
    const svg = generateIconSVG(example.options);
    const exampleDiv = createExampleDiv(svg, example.title, example.options);
    exampleContainer.appendChild(exampleDiv);

  });
})

function applyConfig(config) {
  document.getElementById('text').value = config.text;
  document.getElementById('size').value = config.size === 64 ? config.size * 8 : config.size;
  document.getElementById('bgColor').value = config.bgColor;
  document.getElementById('textColor').value = config.textColor;
  document.getElementById('fontFamily').value = config.fontFamily;
  document.getElementById('fontWeight').value = config.fontWeight;
  document.getElementById('radius').value = config.size === 64 ? config.radius * 8 : config.radius;

  document.getElementById('bgColorPicker').value = config.bgColor;
  document.getElementById('textColorPicker').value = config.textColor;

  document.getElementById('bgColorPreview').style.backgroundColor = config.bgColor;
  document.getElementById('textColorPreview').style.backgroundColor = config.textColor;

  document.getElementById('verticalOffset').value = config.verticalOffset || 0;
  document.getElementById('verticalOffsetValue').textContent = `${config.verticalOffset || 0}%`;

  generateIcon();

  document.querySelector('.bg-white.rounded-lg.border.border-gray-200').scrollIntoView({
    behavior: 'smooth'
  });
}

// FAQ
document.addEventListener('DOMContentLoaded', (event) => {
  const accordion = document.getElementById('faq-accordion');
  
  accordion.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    e.preventDefault(); // Prevent any default button behavior

    const item = button.closest('.bg-white');
    const content = item.querySelector('div:nth-child(2)');
    const icon = button.querySelector('svg');

    // Toggle the clicked item
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');

    // Close other open items
    const allItems = accordion.querySelectorAll('.bg-white');
    allItems.forEach((otherItem) => {
      if (otherItem !== item) {
        const otherContent = otherItem.querySelector('div:nth-child(2)');
        const otherIcon = otherItem.querySelector('button svg');
        otherContent.classList.add('hidden');
        otherIcon.classList.remove('rotate-180');
      }
    });
  });
});