document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const encryptionKey = document.getElementById('encryption-key');
    const encryptionAlgorithm = document.getElementById('encryption-algorithm');
    const encryptButton = document.getElementById('encrypt-button');
    const decryptButton = document.getElementById('decrypt-button');
    const resultOutput = document.getElementById('result-output');
    const copyResult = document.getElementById('copy-result');
    const resultStatus = document.getElementById('result-status');
    const toggleKey = document.getElementById('toggle-key');

    // Toggle key visibility
    toggleKey.addEventListener('click', () => {
        const type = encryptionKey.type === 'password' ? 'text' : 'password';
        encryptionKey.type = type;
        toggleKey.innerHTML = type === 'password' ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-off-line"></i>';
    });

    // Encrypt text
    encryptButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        const key = encryptionKey.value.trim();
        const algorithm = encryptionAlgorithm.value;

        if (!text) {
            showNotification('Please enter text to encrypt.', 'error');
            return;
        }

        if (!key) {
            showNotification('Please enter an encryption key.', 'error');
            return;
        }

        try {
            let encrypted;
            switch (algorithm) {
                case 'aes':
                    encrypted = CryptoJS.AES.encrypt(text, key).toString();
                    break;
                case 'des':
                    encrypted = CryptoJS.DES.encrypt(text, key).toString();
                    break;
                case 'tripledes':
                    encrypted = CryptoJS.TripleDES.encrypt(text, key).toString();
                    break;
                case 'rabbit':
                    encrypted = CryptoJS.Rabbit.encrypt(text, key).toString();
                    break;
                case 'rc4':
                    encrypted = CryptoJS.RC4.encrypt(text, key).toString();
                    break;
                default:
                    encrypted = CryptoJS.AES.encrypt(text, key).toString();
            }

            resultOutput.value = encrypted;
            resultStatus.textContent = 'Text encrypted successfully';
            showNotification('Text encrypted successfully!', 'success');
        } catch (error) {
            resultStatus.textContent = 'Encryption failed';
            showNotification('Encryption failed. Please try again.', 'error');
            console.error('Encryption error:', error);
        }
    });

    // Decrypt text
    decryptButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        const key = encryptionKey.value.trim();
        const algorithm = encryptionAlgorithm.value;

        if (!text) {
            showNotification('Please enter text to decrypt.', 'error');
            return;
        }

        if (!key) {
            showNotification('Please enter an encryption key.', 'error');
            return;
        }

        try {
            let decrypted;
            switch (algorithm) {
                case 'aes':
                    decrypted = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'des':
                    decrypted = CryptoJS.DES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'tripledes':
                    decrypted = CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'rabbit':
                    decrypted = CryptoJS.Rabbit.decrypt(text, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'rc4':
                    decrypted = CryptoJS.RC4.decrypt(text, key).toString(CryptoJS.enc.Utf8);
                    break;
                default:
                    decrypted = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
            }

            if (!decrypted) {
                throw new Error('Decryption failed - invalid key or text');
            }

            resultOutput.value = decrypted;
            resultStatus.textContent = 'Text decrypted successfully';
            showNotification('Text decrypted successfully!', 'success');
        } catch (error) {
            resultStatus.textContent = 'Decryption failed';
            showNotification('Decryption failed. Please check your key and try again.', 'error');
            console.error('Decryption error:', error);
        }
    });

    // Copy result to clipboard
    copyResult.addEventListener('click', () => {
        const result = resultOutput.value;

        if (!result) {
            showNotification('No result to copy.', 'error');
            return;
        }

        navigator.clipboard.writeText(result)
            .then(() => {
                showNotification('Result copied to clipboard!', 'success');
                copyResult.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => {
                    copyResult.innerHTML = '<i class="ri-file-copy-line"></i>';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy result.', 'error');
            });
    });

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