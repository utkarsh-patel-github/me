document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const companyName = document.getElementById('company-name');
    const websiteUrl = document.getElementById('website-url');
    const companyEmail = document.getElementById('company-email');
    const companyAddress = document.getElementById('company-address');
    const additionalInfo = document.getElementById('additional-info');
    const generateButton = document.getElementById('generate-button');
    const previewButton = document.getElementById('preview-button');
    const copyResult = document.getElementById('copy-result');
    const downloadResult = document.getElementById('download-result');
    const policyPreview = document.getElementById('policy-preview');

    // Data collection checkboxes
    const collectName = document.getElementById('collect-name');
    const collectEmail = document.getElementById('collect-email');
    const collectPhone = document.getElementById('collect-phone');
    const collectAddress = document.getElementById('collect-address');
    const collectCookies = document.getElementById('collect-cookies');
    const collectAnalytics = document.getElementById('collect-analytics');

    // Data usage checkboxes
    const useMarketing = document.getElementById('use-marketing');
    const useImprovement = document.getElementById('use-improvement');
    const usePersonalization = document.getElementById('use-personalization');
    const useThirdParty = document.getElementById('use-third-party');

    // Generate privacy policy
    generateButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const policy = generatePrivacyPolicy();
        policyPreview.innerHTML = policy;
        showNotification('Privacy policy generated successfully!', 'success');
    });

    // Preview privacy policy
    previewButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const policy = generatePrivacyPolicy();
        policyPreview.innerHTML = policy;
        showNotification('Privacy policy preview generated!', 'info');
    });

    // Copy result to clipboard
    copyResult.addEventListener('click', () => {
        const policy = policyPreview.innerHTML;

        if (!policy) {
            showNotification('No privacy policy to copy.', 'error');
            return;
        }

        navigator.clipboard.writeText(policy)
            .then(() => {
                showNotification('Privacy policy copied to clipboard!', 'success');
                copyResult.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => {
                    copyResult.innerHTML = '<i class="ri-file-copy-line"></i>';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy privacy policy.', 'error');
            });
    });

    // Download result as HTML
    downloadResult.addEventListener('click', () => {
        const policy = policyPreview.innerHTML;

        if (!policy) {
            showNotification('No privacy policy to download.', 'error');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Privacy Policy - ${companyName.value}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem;
                    }
                    h1, h2, h3 {
                        color: #333;
                    }
                    p, ul, ol {
                        color: #666;
                    }
                </style>
            </head>
            <body>
                ${policy}
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'privacy-policy.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Privacy policy downloaded successfully!', 'success');
    });

    // Validate inputs
    function validateInputs() {
        if (!companyName.value.trim()) {
            showNotification('Please enter your company/website name.', 'error');
            return false;
        }

        if (!websiteUrl.value.trim()) {
            showNotification('Please enter your website URL.', 'error');
            return false;
        }

        if (!companyEmail.value.trim()) {
            showNotification('Please enter your contact email.', 'error');
            return false;
        }

        if (!companyAddress.value.trim()) {
            showNotification('Please enter your company address.', 'error');
            return false;
        }

        return true;
    }

    // Generate privacy policy content
    function generatePrivacyPolicy() {
        const collectedData = [];
        if (collectName.checked) collectedData.push('name');
        if (collectEmail.checked) collectedData.push('email address');
        if (collectPhone.checked) collectedData.push('phone number');
        if (collectAddress.checked) collectedData.push('physical address');
        if (collectCookies.checked) collectedData.push('cookies');
        if (collectAnalytics.checked) collectedData.push('analytics data');

        const dataUsage = [];
        if (useMarketing.checked) dataUsage.push('sending marketing communications');
        if (useImprovement.checked) dataUsage.push('improving our services');
        if (usePersonalization.checked) dataUsage.push('personalizing your experience');
        if (useThirdParty.checked) dataUsage.push('sharing with third-party services');

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <h1>Privacy Policy</h1>
            <p>Last updated: ${currentDate}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to ${companyName.value} ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at ${websiteUrl.value}.</p>

            <h2>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
                ${collectedData.map(data => `<li>${data}</li>`).join('')}
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
                ${dataUsage.map(usage => `<li>${usage}</li>`).join('')}
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent at any time</li>
            </ul>

            <h2>6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
                ${companyName.value}<br>
                ${companyAddress.value}<br>
                Email: ${companyEmail.value}
            </p>

            ${additionalInfo.value ? `
                <h2>7. Additional Information</h2>
                <p>${additionalInfo.value}</p>
            ` : ''}
        `;
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