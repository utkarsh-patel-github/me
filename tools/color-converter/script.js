// DOM Elements
const colorPicker = document.getElementById('color-picker');
const colorInput = document.getElementById('color-input');
const colorPreview = document.getElementById('color-preview');
const colorName = document.getElementById('color-name');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');

// Color Format Values
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const rgbaValue = document.getElementById('rgba-value');
const hslValue = document.getElementById('hsl-value');
const hslaValue = document.getElementById('hsla-value');
const cmykValue = document.getElementById('cmyk-value');

// Copy Buttons
const copyButtons = document.querySelectorAll('.copy-button');

// Color Tools
const opacitySlider = document.getElementById('opacity-slider');
const opacityValue = document.getElementById('opacity-value');
const shadesContainer = document.getElementById('shades-container');
const tintsContainer = document.getElementById('tints-container');
const harmonyButtons = document.querySelectorAll('.harmony-type');
const harmonyColors = document.getElementById('harmony-colors');

// FAQ items
const faqItems = document.querySelectorAll('.faq-item');

// Global variables
let currentColor = '#4361ee';
let currentOpacity = 1;

// Named Colors (Basic)
const namedColors = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370db',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#db7093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
};

// Color Conversion Utilities
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Handle shorthand hex (e.g. #ABC)
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function rgbToHex({ r, g, b }) {
    return '#' + [r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb({ h, s, l }) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function rgbToCmyk({ r, g, b }) {
    // Convert RGB to 0-1 range
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Find the maximum value among r, g, b
    const k = 1 - Math.max(r, g, b);
    
    // Calculate CMY
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

// Main Color Conversion Function
function convertColor(color) {
    // Parse and normalize color input
    let hexColor;
    
    // Check if it's already a hex color
    if (color.startsWith('#')) {
        hexColor = color;
    }
    // Check if it's a named color
    else if (namedColors[color.toLowerCase()]) {
        hexColor = namedColors[color.toLowerCase()];
        colorName.textContent = color.toLowerCase();
    }
    // Check if it's an RGB/RGBA color
    else if (color.toLowerCase().startsWith('rgb')) {
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            hexColor = rgbToHex({ r, g, b });
            if (rgbMatch[4]) {
                currentOpacity = parseFloat(rgbMatch[4]);
                opacitySlider.value = Math.round(currentOpacity * 100);
                opacityValue.textContent = `${Math.round(currentOpacity * 100)}%`;
            }
        }
    }
    // Check if it's an HSL/HSLA color
    else if (color.toLowerCase().startsWith('hsl')) {
        const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([0-9.]+))?\)/i);
        if (hslMatch) {
            const h = parseInt(hslMatch[1]);
            const s = parseInt(hslMatch[2]);
            const l = parseInt(hslMatch[3]);
            const rgb = hslToRgb({ h, s, l });
            hexColor = rgbToHex(rgb);
            if (hslMatch[4]) {
                currentOpacity = parseFloat(hslMatch[4]);
                opacitySlider.value = Math.round(currentOpacity * 100);
                opacityValue.textContent = `${Math.round(currentOpacity * 100)}%`;
            }
        }
    }
    
    // If we couldn't parse the color, return false
    if (!hexColor) {
        return false;
    }
    
    // Store current color
    currentColor = hexColor;
    
    // Get RGB values
    const rgb = hexToRgb(hexColor);
    
    // Get HSL values
    const hsl = rgbToHsl(rgb);
    
    // Get CMYK values
    const cmyk = rgbToCmyk(rgb);
    
    // Update color preview
    colorPreview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    
    // Find color name (if not already set)
    if (colorName.textContent === "Select a color") {
        for (const [name, hex] of Object.entries(namedColors)) {
            if (hex.toLowerCase() === hexColor.toLowerCase()) {
                colorName.textContent = name;
                break;
            }
        }
        
        if (colorName.textContent === "Select a color") {
            colorName.textContent = hexColor;
        }
    }
    
    // Update color values
    hexValue.textContent = hexColor;
    rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    rgbaValue.textContent = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    hslaValue.textContent = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${currentOpacity})`;
    cmykValue.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    
    // Update color picker
    colorPicker.value = hexColor;
    
    // Generate shades and tints
    generateShades(rgb);
    generateTints(rgb);
    
    // Update color harmony
    updateColorHarmony();
    
    return true;
}

// Generate Shades (darker variations)
function generateShades(rgb) {
    shadesContainer.innerHTML = '';
    
    // Convert to HSL for more accurate shade generation
    const hsl = rgbToHsl(rgb);
    
    // Generate 7 shades from darkest to original
    for (let i = 0; i < 7; i++) {
        // Adjust lightness (darker to original)
        const lightness = Math.max(5, Math.round(hsl.l * (i + 1) / 7));
        
        // Convert back to RGB
        const shadeRgb = hslToRgb({ h: hsl.h, s: hsl.s, l: lightness });
        const shadeHex = rgbToHex(shadeRgb);
        
        // Create shade element
        const shadeElement = document.createElement('div');
        shadeElement.className = 'shade-item';
        shadeElement.style.backgroundColor = shadeHex;
        shadeElement.setAttribute('data-color', shadeHex);
        shadeElement.title = shadeHex;
        
        // Add click event to select this shade
        shadeElement.addEventListener('click', () => {
            colorInput.value = shadeHex;
            convertColor(shadeHex);
        });
        
        shadesContainer.appendChild(shadeElement);
    }
}

// Generate Tints (lighter variations)
function generateTints(rgb) {
    tintsContainer.innerHTML = '';
    
    // Convert to HSL for more accurate tint generation
    const hsl = rgbToHsl(rgb);
    
    // Generate 7 tints from lightest to original
    for (let i = 6; i >= 0; i--) {
        // Adjust lightness (lightest to original)
        const lightness = Math.min(95, hsl.l + (100 - hsl.l) * i / 6);
        
        // Convert back to RGB
        const tintRgb = hslToRgb({ h: hsl.h, s: hsl.s, l: lightness });
        const tintHex = rgbToHex(tintRgb);
        
        // Create tint element
        const tintElement = document.createElement('div');
        tintElement.className = 'tint-item';
        tintElement.style.backgroundColor = tintHex;
        tintElement.setAttribute('data-color', tintHex);
        tintElement.title = tintHex;
        
        // Add click event to select this tint
        tintElement.addEventListener('click', () => {
            colorInput.value = tintHex;
            convertColor(tintHex);
        });
        
        tintsContainer.appendChild(tintElement);
    }
}

// Update Color Harmony
function updateColorHarmony() {
    // Clear existing colors
    harmonyColors.innerHTML = '';
    
    // Find active harmony type
    const activeHarmony = document.querySelector('.harmony-type.active').dataset.type;
    
    // Convert current color to HSL
    const rgb = hexToRgb(currentColor);
    const hsl = rgbToHsl(rgb);
    
    // Create base color element
    const baseColorElement = document.createElement('div');
    baseColorElement.className = 'harmony-color';
    baseColorElement.style.backgroundColor = currentColor;
    baseColorElement.setAttribute('data-color', currentColor);
    baseColorElement.title = currentColor;
    
    // Add click event to select this color
    baseColorElement.addEventListener('click', () => {
        colorInput.value = currentColor;
        convertColor(currentColor);
    });
    
    harmonyColors.appendChild(baseColorElement);
    
    // Generate harmony colors
    let harmonyHues = [];
    
    switch (activeHarmony) {
        case 'complementary':
            // Complementary color (opposite on the color wheel)
            harmonyHues = [(hsl.h + 180) % 360];
            break;
        
        case 'analogous':
            // Analogous colors (30 degrees apart on the color wheel)
            harmonyHues = [
                (hsl.h + 330) % 360, // -30 degrees
                (hsl.h + 30) % 360   // +30 degrees
            ];
            break;
        
        case 'triadic':
            // Triadic colors (120 degrees apart on the color wheel)
            harmonyHues = [
                (hsl.h + 120) % 360,
                (hsl.h + 240) % 360
            ];
            break;
    }
    
    // Create harmony color elements
    harmonyHues.forEach(h => {
        const harmonyRgb = hslToRgb({ h, s: hsl.s, l: hsl.l });
        const harmonyHex = rgbToHex(harmonyRgb);
        
        const harmonyElement = document.createElement('div');
        harmonyElement.className = 'harmony-color';
        harmonyElement.style.backgroundColor = harmonyHex;
        harmonyElement.setAttribute('data-color', harmonyHex);
        harmonyElement.title = harmonyHex;
        
        // Add click event to select this color
        harmonyElement.addEventListener('click', () => {
            colorInput.value = harmonyHex;
            convertColor(harmonyHex);
        });
        
        harmonyColors.appendChild(harmonyElement);
    });
}

// Generate Random Color
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    const hexColor = rgbToHex({ r, g, b });
    colorInput.value = hexColor;
    colorName.textContent = "Random Color";
    convertColor(hexColor);
}

// Event Handlers
function handleColorPickerChange() {
    const hexColor = colorPicker.value;
    colorInput.value = hexColor;
    colorName.textContent = "Custom Color";
    convertColor(hexColor);
}

function handleColorInputChange() {
    const color = colorInput.value.trim();
    
    if (color) {
        const success = convertColor(color);
        
        if (!success) {
            // If failed to parse color, show error
            colorInput.classList.add('input-error');
            setTimeout(() => {
                colorInput.classList.remove('input-error');
            }, 1000);
        }
    }
}

function handleOpacityChange() {
    currentOpacity = opacitySlider.value / 100;
    opacityValue.textContent = `${opacitySlider.value}%`;
    
    // Update preview with new opacity
    const rgb = hexToRgb(currentColor);
    colorPreview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    
    // Update RGBA and HSLA values
    const hsl = rgbToHsl(rgb);
    rgbaValue.textContent = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    hslaValue.textContent = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${currentOpacity})`;
}

function handleHarmonyChange(e) {
    // Remove active class from all harmony buttons
    harmonyButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    // Update harmony colors
    updateColorHarmony();
}

function handleClearInput() {
    colorInput.value = '';
    colorInput.focus();
}

function handleCopyValue(e) {
    const formatButton = e.target.closest('.copy-button');
    if (!formatButton) return;
    
    const format = formatButton.dataset.format;
    const valueElement = document.getElementById(`${format}-value`);
    
    if (!valueElement) return;
    
    // Copy to clipboard
    navigator.clipboard.writeText(valueElement.textContent)
        .then(() => {
            // Show success state
            formatButton.classList.add('copy-success');
            formatButton.innerHTML = '<i class="ri-check-line"></i> Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                formatButton.classList.remove('copy-success');
                formatButton.innerHTML = '<i class="ri-clipboard-line"></i> Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy. Please try again.');
        });
}

function toggleFaq(e) {
    const faqItem = e.target.closest('.faq-item');
    
    // Toggle active class on clicked item
    faqItem.classList.toggle('active');
}

// Initialize
function init() {
    // Set initial color
    convertColor(currentColor);
    
    // Event listeners
    colorPicker.addEventListener('input', handleColorPickerChange);
    
    colorInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleColorInputChange();
        }
    });
    
    colorInput.addEventListener('blur', handleColorInputChange);
    
    opacitySlider.addEventListener('input', handleOpacityChange);
    
    clearBtn.addEventListener('click', handleClearInput);
    randomBtn.addEventListener('click', generateRandomColor);
    
    copyButtons.forEach(button => {
        button.addEventListener('click', handleCopyValue);
    });
    
    harmonyButtons.forEach(button => {
        button.addEventListener('click', handleHarmonyChange);
    });
    
    // FAQ interactivity
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', toggleFaq);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 