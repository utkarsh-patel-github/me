document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const websiteName = document.getElementById('website-name');
    const websiteUrl = document.getElementById('website-url');
    const contactEmail = document.getElementById('contact-email');
    const additionalInfo = document.getElementById('additional-info');
    const generateButton = document.getElementById('generate-button');
    const previewButton = document.getElementById('preview-button');
    const copyResult = document.getElementById('copy-result');
    const downloadResult = document.getElementById('download-result');
    const policyPreview = document.getElementById('policy-preview');
    const retentionPeriod = document.getElementById('retention-period');

    // Cookie types checkboxes
    const necessaryCookies = document.getElementById('necessary-cookies');
    const preferenceCookies = document.getElementById('preference-cookies');
    const statisticsCookies = document.getElementById('statistics-cookies');
    const marketingCookies = document.getElementById('marketing-cookies');
    const socialCookies = document.getElementById('social-cookies');
    const thirdPartyCookies = document.getElementById('third-party-cookies');

    // Third-party services checkboxes
    const googleAnalytics = document.getElementById('google-analytics');
    const googleAds = document.getElementById('google-ads');
    const facebookPixel = document.getElementById('facebook-pixel');
    const hotjar = document.getElementById('hotjar');
    const intercom = document.getElementById('intercom');
    const stripe = document.getElementById('stripe');

    // Cookie banner options
    const optInConsent = document.getElementById('opt-in-consent');
    const cookiePreferences = document.getElementById('cookie-preferences');
    const rejectAll = document.getElementById('reject-all');

    // Generate cookie policy
    generateButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const policy = generateCookiePolicy();
        policyPreview.innerHTML = policy;
        showNotification('Cookie policy generated successfully!', 'success');
    });

    // Preview cookie policy
    previewButton.addEventListener('click', () => {
        if (!validateInputs()) {
            return;
        }

        const policy = generateCookiePolicy();
        policyPreview.innerHTML = policy;
        showNotification('Cookie policy preview generated!', 'info');
    });

    // Copy result to clipboard
    copyResult.addEventListener('click', () => {
        const policy = policyPreview.innerHTML;

        if (!policy) {
            showNotification('No cookie policy to copy.', 'error');
            return;
        }

        navigator.clipboard.writeText(policy)
            .then(() => {
                showNotification('Cookie policy copied to clipboard!', 'success');
                copyResult.innerHTML = '<i class="ri-check-line"></i>';
                setTimeout(() => {
                    copyResult.innerHTML = '<i class="ri-file-copy-line"></i>';
                }, 2000);
            })
            .catch(() => {
                showNotification('Failed to copy cookie policy.', 'error');
            });
    });

    // Download result as HTML
    downloadResult.addEventListener('click', () => {
        const policy = policyPreview.innerHTML;

        if (!policy) {
            showNotification('No cookie policy to download.', 'error');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cookie Policy - ${websiteName.value}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem;
                        color: #333;
                    }
                    h1 {
                        font-size: 2rem;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 0.5rem;
                    }
                    h2 {
                        font-size: 1.5rem;
                        margin-top: 2rem;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 1rem 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 0.5rem;
                        text-align: left;
                    }
                    th {
                        background-color: #f5f5f5;
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
        a.download = 'cookie-policy.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Cookie policy downloaded successfully!', 'success');
    });

    // Validate inputs
    function validateInputs() {
        if (!websiteName.value.trim()) {
            showNotification('Please enter your website/company name.', 'error');
            return false;
        }

        if (!websiteUrl.value.trim()) {
            showNotification('Please enter your website URL.', 'error');
            return false;
        }

        if (!contactEmail.value.trim()) {
            showNotification('Please enter your contact email.', 'error');
            return false;
        }

        return true;
    }

    // Generate cookie policy content
    function generateCookiePolicy() {
        const cookieTypes = getCookieTypes();
        const thirdPartyServices = getThirdPartyServices();
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <h1>Cookie Policy</h1>
            <p>Last updated: ${currentDate}</p>

            <h2>1. Introduction</h2>
            <p>This Cookie Policy explains how ${websiteName.value} ("we," "us," or "our") uses cookies and similar technologies on our website at ${websiteUrl.value} (the "Website"). This policy provides you with information about how we use cookies, what types of cookies we use, and how you can control them.</p>

            <h2>2. What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide basic functionality (such as remembering your preferences), and to provide site owners with information about how the site is being used.</p>

            <h2>3. Types of Cookies We Use</h2>
            <p>Our website uses the following types of cookies:</p>
            
            <table>
                <tr>
                    <th>Category</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                </tr>
                ${cookieTypes}
            </table>

            ${thirdPartyServices ? `
            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services that may set cookies on your device:</p>
            <table>
                <tr>
                    <th>Service</th>
                    <th>Purpose</th>
                    <th>Privacy Policy</th>
                </tr>
                ${thirdPartyServices}
            </table>
            ` : ''}

            <h2>${thirdPartyServices ? '5' : '4'}. Cookie Management</h2>
            ${optInConsent.checked ? `
            <p>When you first visit our website, we will ask for your consent to use cookies. You can choose to accept all cookies, only certain categories of cookies, or you can decline all non-essential cookies.</p>
            ` : ''}
            
            <p>You can manage cookies through your web browser settings. Most browsers allow you to block or delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can obtain up-to-date information about blocking and deleting cookies via the support pages of your browser:</p>
            <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">Microsoft Edge</a></li>
                <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank">Opera</a></li>
            </ul>
            
            <p>Please note that blocking cookies may impact the functionality of our website and your experience.</p>

            <h2>${thirdPartyServices ? '6' : '5'}. Cookie Retention</h2>
            <p>The cookies we use have varying retention periods. Some cookies, such as session cookies, are deleted when you close your browser. Others, such as persistent cookies, remain valid for a set period, which is typically ${getCookieRetentionPeriod()}.</p>

            ${cookiePreferences.checked ? `
            <h2>${thirdPartyServices ? '7' : '6'}. Your Preferences</h2>
            <p>You can update your cookie preferences at any time by clicking on the "Cookie Preferences" button in the footer of our website.</p>
            ` : ''}

            <h2>${thirdPartyServices ? (cookiePreferences.checked ? '8' : '7') : (cookiePreferences.checked ? '7' : '6')}. Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us at ${contactEmail.value}.</p>

            ${additionalInfo.value ? `
                <h2>${thirdPartyServices ? (cookiePreferences.checked ? '9' : '8') : (cookiePreferences.checked ? '8' : '7')}. Additional Information</h2>
                <p>${additionalInfo.value}</p>
            ` : ''}
        `;
    }

    // Get cookie types table rows
    function getCookieTypes() {
        let types = '';
        const retention = getCookieRetentionPeriod();
        
        if (necessaryCookies.checked) {
            types += `
                <tr>
                    <td>Strictly Necessary Cookies</td>
                    <td>These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.</td>
                    <td>Session to ${retention}</td>
                </tr>
            `;
        }
        
        if (preferenceCookies.checked) {
            types += `
                <tr>
                    <td>Preference/Functionality Cookies</td>
                    <td>These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features.</td>
                    <td>${retention}</td>
                </tr>
            `;
        }
        
        if (statisticsCookies.checked) {
            types += `
                <tr>
                    <td>Statistics/Analytics Cookies</td>
                    <td>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the way our website works.</td>
                    <td>${retention}</td>
                </tr>
            `;
        }
        
        if (marketingCookies.checked) {
            types += `
                <tr>
                    <td>Marketing/Advertising Cookies</td>
                    <td>These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</td>
                    <td>${retention}</td>
                </tr>
            `;
        }
        
        if (socialCookies.checked) {
            types += `
                <tr>
                    <td>Social Media Cookies</td>
                    <td>These cookies are set by social media services that we have added to the site to enable you to share our content with your friends and networks.</td>
                    <td>${retention}</td>
                </tr>
            `;
        }
        
        if (thirdPartyCookies.checked) {
            types += `
                <tr>
                    <td>Third-Party Cookies</td>
                    <td>These cookies are set by third-party services used on our website, such as analytics, advertising, or social media platforms.</td>
                    <td>Varies by service</td>
                </tr>
            `;
        }
        
        return types;
    }

    // Get third-party services table rows
    function getThirdPartyServices() {
        let services = '';
        
        if (googleAnalytics.checked) {
            services += `
                <tr>
                    <td>Google Analytics</td>
                    <td>Web analytics service that tracks and reports website traffic</td>
                    <td><a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        if (googleAds.checked) {
            services += `
                <tr>
                    <td>Google Ads</td>
                    <td>Online advertising platform</td>
                    <td><a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        if (facebookPixel.checked) {
            services += `
                <tr>
                    <td>Facebook Pixel</td>
                    <td>Analytics tool that helps measure the effectiveness of advertising</td>
                    <td><a href="https://www.facebook.com/policy.php" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        if (hotjar.checked) {
            services += `
                <tr>
                    <td>Hotjar</td>
                    <td>Analytics and feedback tool</td>
                    <td><a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        if (intercom.checked) {
            services += `
                <tr>
                    <td>Intercom</td>
                    <td>Customer messaging platform</td>
                    <td><a href="https://www.intercom.com/legal/privacy" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        if (stripe.checked) {
            services += `
                <tr>
                    <td>Stripe</td>
                    <td>Payment processing</td>
                    <td><a href="https://stripe.com/privacy" target="_blank">Privacy Policy</a></td>
                </tr>
            `;
        }
        
        return services;
    }

    // Get cookie retention period text
    function getCookieRetentionPeriod() {
        const value = retentionPeriod.value;
        switch (value) {
            case 'session':
                return 'Session only';
            case '30-days':
                return '30 days';
            case '6-months':
                return '6 months';
            case '1-year':
                return '1 year';
            case '2-years':
                return '2 years';
            case 'custom':
                return 'Variable period';
            default:
                return '1 year';
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'check' : type === 'error' ? 'error-warning' : type === 'warning' ? 'alert' : 'information'}-line"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}); 