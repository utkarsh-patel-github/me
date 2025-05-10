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
    const termsPreview = document.getElementById('terms-preview');

    // Service features checkboxes
    const featureAccounts = document.getElementById('feature-accounts');
    const featurePayments = document.getElementById('feature-payments');
    const featureContent = document.getElementById('feature-content');
    const featureSubscription = document.getElementById('feature-subscription');
    const featureApi = document.getElementById('feature-api');
    const featureMobile = document.getElementById('feature-mobile');

    // Additional clauses checkboxes
    const clauseDisclaimer = document.getElementById('clause-disclaimer');
    const clauseLimitation = document.getElementById('clause-limitation');
    const clauseIndemnification = document.getElementById('clause-indemnification');
    const clauseTermination = document.getElementById('clause-termination');
    const clauseGoverning = document.getElementById('clause-governing');
    const clauseDisputes = document.getElementById('clause-disputes');

    // Generate terms of service
    generateButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const terms = generateTermsOfService();
        termsPreview.innerHTML = terms;
        showNotification('Terms of service generated successfully!', 'success');
    });

    // Preview terms of service
    previewButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const terms = generateTermsOfService();
        termsPreview.innerHTML = terms;
        showNotification('Terms of service preview generated!', 'info');
    });

    // Copy result to clipboard
    copyResult.addEventListener('click', () => {
        const terms = termsPreview.innerHTML;

        if (!terms) {
            showNotification('No terms of service to copy.', 'error');
            return;
        }

        navigator.clipboard.writeText(terms)
            .then(() => {
                showNotification('Terms of service copied to clipboard!', 'success');
                copyResult.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => {
                    copyResult.innerHTML = '<i class="ri-file-copy-line"></i>';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy terms of service.', 'error');
            });
    });

    // Download result as HTML
    downloadResult.addEventListener('click', () => {
        const terms = termsPreview.innerHTML;

        if (!terms) {
            showNotification('No terms of service to download.', 'error');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Terms of Service - ${companyName.value}</title>
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
                ${terms}
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'terms-of-service.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Terms of service downloaded successfully!', 'success');
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

    // Generate terms of service content
    function generateTermsOfService() {
        const features = [];
        if (featureAccounts.checked) features.push('user accounts');
        if (featurePayments.checked) features.push('payment processing');
        if (featureContent.checked) features.push('user-generated content');
        if (featureSubscription.checked) features.push('subscription services');
        if (featureApi.checked) features.push('API access');
        if (featureMobile.checked) features.push('mobile application');

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <h1>Terms of Service</h1>
            <p>Last updated: ${currentDate}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to ${companyName.value} ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website at ${websiteUrl.value} and any related services.</p>

            <h2>2. Acceptance of Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.</p>

            <h2>3. Description of Services</h2>
            <p>We provide the following services:</p>
            <ul>
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>

            <h2>4. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.</p>

            <h2>5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Interfere with the proper functioning of our services</li>
                <li>Attempt to gain unauthorized access</li>
            </ul>

            ${clauseDisclaimer.checked ? `
                <h2>6. Disclaimer of Warranties</h2>
                <p>Our services are provided "as is" without any warranties, express or implied. We do not guarantee that our services will be uninterrupted or error-free.</p>
            ` : ''}

            ${clauseLimitation.checked ? `
                <h2>7. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
            ` : ''}

            ${clauseIndemnification.checked ? `
                <h2>8. Indemnification</h2>
                <p>You agree to indemnify and hold us harmless from any claims, losses, damages, liabilities, including legal fees and expenses, arising out of your use of our services.</p>
            ` : ''}

            ${clauseTermination.checked ? `
                <h2>9. Termination</h2>
                <p>We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including if you breach these Terms.</p>
            ` : ''}

            ${clauseGoverning.checked ? `
                <h2>10. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.</p>
            ` : ''}

            ${clauseDisputes.checked ? `
                <h2>11. Dispute Resolution</h2>
                <p>Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration association.</p>
            ` : ''}

            <h2>12. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.</p>

            <h2>13. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
                ${companyName.value}<br>
                ${companyAddress.value}<br>
                Email: ${companyEmail.value}
            </p>

            ${additionalInfo.value ? `
                <h2>14. Additional Information</h2>
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