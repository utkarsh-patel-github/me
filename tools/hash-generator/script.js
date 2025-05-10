document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const hashAlgorithm = document.getElementById('hash-algorithm');
    const generateButton = document.getElementById('generate-hash');
    const hashOutput = document.getElementById('hash-output');
    const copyButton = document.getElementById('copy-hash');
    const hashLength = document.getElementById('hash-length');
    const hashType = document.getElementById('hash-type');

    // Generate hash when button is clicked
    generateButton.addEventListener('click', generateHash);

    // Generate hash when Enter key is pressed in textarea
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateHash();
        }
    });

    // Copy hash to clipboard
    copyButton.addEventListener('click', copyHashToClipboard);

    // Generate hash function
    function generateHash() {
        const text = inputText.value.trim();
        const algorithm = hashAlgorithm.value;

        if (!text) {
            showNotification('Please enter some text to hash.', 'error');
            return;
        }

        let hash;
        switch (algorithm) {
            case 'md5':
                hash = CryptoJS.MD5(text).toString();
                break;
            case 'sha1':
                hash = CryptoJS.SHA1(text).toString();
                break;
            case 'sha256':
                hash = CryptoJS.SHA256(text).toString();
                break;
            case 'sha384':
                hash = CryptoJS.SHA384(text).toString();
                break;
            case 'sha512':
                hash = CryptoJS.SHA512(text).toString();
                break;
            case 'ripemd160':
                hash = CryptoJS.RIPEMD160(text).toString();
                break;
            default:
                hash = CryptoJS.SHA256(text).toString();
        }

        // Update UI
        hashOutput.value = hash;
        hashLength.textContent = `${hash.length} characters`;
        hashType.textContent = algorithm.toUpperCase();

        // Show success notification
        showNotification('Hash generated successfully!', 'success');
    }

    // Copy hash to clipboard
    function copyHashToClipboard() {
        const hash = hashOutput.value;

        if (!hash) {
            showNotification('No hash to copy.', 'error');
            return;
        }

        navigator.clipboard.writeText(hash)
            .then(() => {
                showNotification('Hash copied to clipboard!', 'success');
                copyButton.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="ri-file-copy-line"></i>';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy hash.', 'error');
            });
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'check' : type === 'error' ? 'close' : 'information'}-line"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            background-color: var(--bg-primary);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            transform: translateY(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            border-left: 4px solid #10b981;
        }

        .notification.error {
            border-left: 4px solid #ef4444;
        }

        .notification.info {
            border-left: 4px solid #3b82f6;
        }

        .notification i {
            font-size: 1.25rem;
        }

        .notification.success i {
            color: #10b981;
        }

        .notification.error i {
            color: #ef4444;
        }

        .notification.info i {
            color: #3b82f6;
        }

        @media (max-width: 480px) {
            .notification {
                left: 20px;
                right: 20px;
                bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}); 