document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordOutput = document.getElementById('password-output');
    const copyButton = document.getElementById('copy-password');
    const refreshButton = document.getElementById('refresh-password');
    const generateButton = document.getElementById('generate-password');
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const checkboxes = {
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols')
    };

    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // Initialize
    updateLengthValue();
    generatePassword();

    // Event Listeners
    lengthSlider.addEventListener('input', updateLengthValue);
    copyButton.addEventListener('click', copyPassword);
    refreshButton.addEventListener('click', generatePassword);
    generateButton.addEventListener('click', generatePassword);
    Object.values(checkboxes).forEach(checkbox => {
        checkbox.addEventListener('change', validateOptions);
    });

    // Functions
    function updateLengthValue() {
        lengthValue.textContent = lengthSlider.value;
    }

    function validateOptions() {
        const hasSelectedOption = Object.values(checkboxes).some(checkbox => checkbox.checked);
        if (!hasSelectedOption) {
            checkboxes.lowercase.checked = true;
        }
    }

    function generatePassword() {
        validateOptions();
        
        // Get selected character sets
        let selectedChars = '';
        Object.entries(checkboxes).forEach(([key, checkbox]) => {
            if (checkbox.checked) {
                selectedChars += charSets[key];
            }
        });

        // Generate password
        const length = parseInt(lengthSlider.value);
        let password = '';
        
        // Ensure at least one character from each selected set
        Object.entries(checkboxes).forEach(([key, checkbox]) => {
            if (checkbox.checked) {
                const randomIndex = Math.floor(Math.random() * charSets[key].length);
                password += charSets[key][randomIndex];
            }
        });

        // Fill the rest of the password
        while (password.length < length) {
            const randomIndex = Math.floor(Math.random() * selectedChars.length);
            password += selectedChars[randomIndex];
        }

        // Shuffle the password
        password = shuffleString(password);

        // Update UI
        passwordOutput.value = password;
        updatePasswordStrength(password);
    }

    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    function updatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 12) strength += 1;
        if (password.length >= 16) strength += 1;
        
        // Character type checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength meter
        const strengthPercentage = (strength / 6) * 100;
        strengthBar.style.width = `${strengthPercentage}%`;
        
        // Update strength text and color
        let strengthLabel, strengthColor;
        if (strengthPercentage >= 83) {
            strengthLabel = 'Very Strong';
            strengthColor = '#059669';
        } else if (strengthPercentage >= 66) {
            strengthLabel = 'Strong';
            strengthColor = '#10B981';
        } else if (strengthPercentage >= 50) {
            strengthLabel = 'Good';
            strengthColor = '#F59E0B';
        } else if (strengthPercentage >= 33) {
            strengthLabel = 'Fair';
            strengthColor = '#F97316';
        } else {
            strengthLabel = 'Weak';
            strengthColor = '#EF4444';
        }
        
        strengthBar.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    }

    function copyPassword() {
        passwordOutput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="ri-check-line"></i>';
        copyButton.style.color = '#059669';
        
        setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.style.color = '';
        }, 2000);
    }
}); 