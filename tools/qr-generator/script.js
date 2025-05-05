document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const errorCorrection = document.getElementById('error-correction');
    const foregroundColor = document.getElementById('foreground-color');
    const foregroundColorText = document.getElementById('foreground-color-text');
    const backgroundColor = document.getElementById('background-color');
    const backgroundColorText = document.getElementById('background-color-text');
    const refreshQrBtn = document.getElementById('refresh-qr');
    const downloadQrBtn = document.getElementById('download-qr');
    const shareQrBtn = document.getElementById('share-qr');
    const addLogo = document.getElementById('add-logo');
    const logoInput = document.querySelector('.logo-input');
    const logoFile = document.getElementById('logo-file');
    const qrCodeContainer = document.getElementById('qr-code');
    
    // QR Code Input Elements (for different tab contents)
    const urlInput = document.getElementById('url-input');
    const textInput = document.getElementById('text-input');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const contactCompany = document.getElementById('contact-company');
    const contactAddress = document.getElementById('contact-address');
    const emailAddress = document.getElementById('email-address');
    const emailSubject = document.getElementById('email-subject');
    const emailBody = document.getElementById('email-body');
    const smsNumber = document.getElementById('sms-number');
    const smsMessage = document.getElementById('sms-message');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiEncryption = document.getElementById('wifi-encryption');
    const wifiHidden = document.getElementById('wifi-hidden');
    
    // State Variables
    let currentTab = 'url';
    let qrTypeVersion = 8; // Default QR code version
    let logoImage = null;
    
    // Initialize the app
    init();
    
    function init() {
        // Generate initial QR code
        generateQrCode();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update color text inputs with initial values
        foregroundColorText.value = foregroundColor.value;
        backgroundColorText.value = backgroundColor.value;
        
        // Show logo input if checkbox is checked initially
        logoInput.style.display = addLogo.checked ? 'block' : 'none';
    }
    
    function setupEventListeners() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                switchTab(tab);
            });
        });
        
        // QR Code options
        qrSizeSlider.addEventListener('input', () => {
            sizeValue.textContent = qrSizeSlider.value;
            qrTypeVersion = parseInt(qrSizeSlider.value);
        });
        
        qrSizeSlider.addEventListener('change', generateQrCode);
        errorCorrection.addEventListener('change', generateQrCode);
        
        // Color pickers
        foregroundColor.addEventListener('input', () => {
            foregroundColorText.value = foregroundColor.value;
            generateQrCode();
        });
        
        backgroundColor.addEventListener('input', () => {
            backgroundColorText.value = backgroundColor.value;
            generateQrCode();
        });
        
        // Manual color text inputs
        foregroundColorText.addEventListener('input', () => {
            const validColor = formatHexColor(foregroundColorText.value);
            if (validColor) {
                foregroundColor.value = validColor;
                generateQrCode();
            }
        });
        
        backgroundColorText.addEventListener('input', () => {
            const validColor = formatHexColor(backgroundColorText.value);
            if (validColor) {
                backgroundColor.value = validColor;
                generateQrCode();
            }
        });
        
        // Form inputs for all tabs
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.id !== 'logo-file') { // Exclude logo file input
                input.addEventListener('input', debounce(generateQrCode, 500));
            }
        });
        
        // Logo options
        addLogo.addEventListener('change', () => {
            logoInput.style.display = addLogo.checked ? 'block' : 'none';
            generateQrCode();
        });
        
        logoFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    logoImage = new Image();
                    logoImage.onload = () => generateQrCode();
                    logoImage.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                logoImage = null;
                generateQrCode();
            }
        });
        
        // Button actions
        refreshQrBtn.addEventListener('click', generateQrCode);
        downloadQrBtn.addEventListener('click', () => {
            const canvas = document.querySelector('#qr-code canvas');
            if (canvas) {
                downloadImage(canvas);
            } else {
                window.showToast('Please generate a QR code first', 'error');
            }
        });
        
        shareQrBtn.addEventListener('click', shareQrCode);
    }
    
    function switchTab(tab) {
        // Update active tab button
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tab) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Show active tab content
        tabContents.forEach(content => {
            if (content.id === `${tab}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update current tab
        currentTab = tab;
        
        // Generate QR code for the new tab
        generateQrCode();
    }
    
    function generateQrCode() {
        // Get QR code data based on current tab
        const qrData = getQrDataString();
        
        if (!qrData) {
            qrCodeContainer.innerHTML = '<div class="empty-qr">Enter data to generate QR code</div>';
            return;
        }
        
        try {
            // Create QR code
            const qr = qrcode(qrTypeVersion, errorCorrection.value);
            qr.addData(qrData);
            qr.make();
            
            // Get QR as HTML
            let qrHtml = qr.createImgTag(4);
            
            // Insert QR code into container
            qrCodeContainer.innerHTML = qrHtml;
            
            // Convert to canvas for customization
            const qrImg = qrCodeContainer.querySelector('img');
            
            // Apply custom colors and logo once image is loaded
            qrImg.onload = () => {
                replaceImgWithCanvas(qrImg);
            };
        } catch (error) {
            console.error('Error generating QR code:', error);
            qrCodeContainer.innerHTML = `<div class="error-qr">Error: ${error.message}</div>`;
            window.showToast('Error generating QR code. Try with simpler data or larger size.', 'error');
        }
    }
    
    function replaceImgWithCanvas(qrImg) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const size = qrImg.width;
        canvas.width = size;
        canvas.height = size;
        
        // Get canvas context
        const ctx = canvas.getContext('2d');
        
        // Set background color
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, size, size);
        
        // Draw QR code
        ctx.drawImage(qrImg, 0, 0);
        
        // Apply color customization
        enhanceQrCode(canvas, foregroundColor.value, backgroundColor.value);
        
        // Add logo if enabled
        if (addLogo.checked && logoImage) {
            // Calculate logo size (25% of QR code)
            const logoSize = Math.floor(size * 0.25);
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            
            // Draw logo
            ctx.save();
            ctx.globalAlpha = 0.8;
            
            // Create circular clipping path for logo
            ctx.beginPath();
            ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            
            // Draw white background for logo
            ctx.fillStyle = 'white';
            ctx.fillRect(logoX, logoY, logoSize, logoSize);
            
            // Draw logo
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            ctx.restore();
        }
        
        // Replace image with canvas
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.appendChild(canvas);
    }
    
    function getQrDataString() {
        switch (currentTab) {
            case 'url':
                return urlInput.value.trim();
                
            case 'text':
                return textInput.value.trim();
                
            case 'contact':
                if (!contactName.value.trim() && !contactPhone.value.trim() && !contactEmail.value.trim()) {
                    return '';
                }
                
                // Format as vCard
                let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
                if (contactName.value.trim()) {
                    vcard += `FN:${contactName.value.trim()}\n`;
                    vcard += `N:${contactName.value.trim()};;;\n`;
                }
                if (contactPhone.value.trim()) {
                    vcard += `TEL;TYPE=CELL:${contactPhone.value.trim()}\n`;
                }
                if (contactEmail.value.trim()) {
                    vcard += `EMAIL:${contactEmail.value.trim()}\n`;
                }
                if (contactCompany.value.trim()) {
                    vcard += `ORG:${contactCompany.value.trim()}\n`;
                }
                if (contactAddress.value.trim()) {
                    vcard += `ADR:;;${contactAddress.value.trim()};;;\n`;
                }
                vcard += 'END:VCARD';
                return vcard;
                
            case 'email':
                if (!emailAddress.value.trim()) {
                    return '';
                }
                
                let emailStr = `mailto:${emailAddress.value.trim()}`;
                const params = [];
                
                if (emailSubject.value.trim()) {
                    params.push(`subject=${encodeURIComponent(emailSubject.value.trim())}`);
                }
                
                if (emailBody.value.trim()) {
                    params.push(`body=${encodeURIComponent(emailBody.value.trim())}`);
                }
                
                if (params.length > 0) {
                    emailStr += `?${params.join('&')}`;
                }
                
                return emailStr;
                
            case 'sms':
                if (!smsNumber.value.trim()) {
                    return '';
                }
                
                let smsStr = `smsto:${smsNumber.value.trim()}`;
                
                if (smsMessage.value.trim()) {
                    smsStr += `:${smsMessage.value.trim()}`;
                }
                
                return smsStr;
                
            case 'wifi':
                if (!wifiSsid.value.trim()) {
                    return '';
                }
                
                let wifiStr = 'WIFI:';
                wifiStr += `S:${wifiSsid.value.trim()};`;
                wifiStr += `T:${wifiEncryption.value};`;
                
                if (wifiEncryption.value !== 'nopass' && wifiPassword.value.trim()) {
                    wifiStr += `P:${wifiPassword.value.trim()};`;
                }
                
                if (wifiHidden.checked) {
                    wifiStr += 'H:true;';
                }
                
                wifiStr += ';';
                return wifiStr;
                
            default:
                return '';
        }
    }
    
    function formatHexColor(input) {
        // Add # if missing
        let color = input.trim();
        if (color.charAt(0) !== '#') {
            color = '#' + color;
        }
        
        // Check if valid hex color
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            // Expand short form (#fff) to full form (#ffffff)
            if (color.length === 4) {
                color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            return color;
        }
        
        return null;
    }
    
    function hexToRgb(hex) {
        // Remove the hash at the front if present
        hex = hex.replace(/^#/, '');
        
        // Parse as R, G, B values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    
    function downloadImage(canvas) {
        // Create a temporary link
        const link = document.createElement('a');
        
        // Set attributes for download
        link.download = `qrcode_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        
        // Append, click, and remove the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.showToast('QR code downloaded successfully', 'success');
    }
    
    function enhanceQrCode(canvas, fgColor, bgColor) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert hex colors to RGB
        const fgRgb = hexToRgb(fgColor);
        const bgRgb = hexToRgb(bgColor);
        
        // Loop through image pixels
        for (let i = 0; i < data.length; i += 4) {
            // Check if pixel is black (QR code foreground)
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                // Replace with custom foreground color
                data[i] = fgRgb.r;
                data[i + 1] = fgRgb.g;
                data[i + 2] = fgRgb.b;
            }
            // Check if pixel is white (QR code background)
            else if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                // Replace with custom background color
                data[i] = bgRgb.r;
                data[i + 1] = bgRgb.g;
                data[i + 2] = bgRgb.b;
            }
        }
        
        // Put the modified image data back to the canvas
        ctx.putImageData(imageData, 0, 0);
    }
    
    function shareQrCode() {
        const canvas = document.querySelector('#qr-code canvas');
        if (!canvas) {
            window.showToast('Please generate a QR code first', 'error');
            return;
        }
        
        canvas.toBlob(async (blob) => {
            // Check if Web Share API is available
            if (navigator.share) {
                try {
                    const file = new File([blob], 'qrcode.png', { type: 'image/png' });
                    
                    await navigator.share({
                        title: 'QR Code',
                        text: 'Generated with Daily Tools QR Generator',
                        files: [file]
                    });
                    
                    window.showToast('QR code shared successfully', 'success');
                } catch (error) {
                    console.error('Error sharing QR code:', error);
                    
                    // Fallback to download if sharing was cancelled or failed
                    if (error.name !== 'AbortError') {
                        downloadImage(canvas);
                    }
                }
            } else {
                // Fallback if Web Share API is not supported
                downloadImage(canvas);
                window.showToast('Sharing not supported on this browser, downloaded instead', 'info');
            }
        });
    }
    
    // Utility debounce function
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
}); 