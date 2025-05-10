document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');
    const strengthProgress = document.querySelector('.strength-progress');
    const strengthValue = document.getElementById('strength-value');
    const criteria = document.querySelectorAll('.criterion');
    const lengthValue = document.getElementById('length-value');
    const charTypes = document.getElementById('char-types');
    const crackTime = document.getElementById('crack-time');
    const recommendationsList = document.getElementById('recommendations-list');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-off-line"></i>';
    });

    // Check password strength
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthMeter(strength);
        updateCriteria(password);
        updateAnalysis(password);
        updateRecommendations(password);
    });

    function calculatePasswordStrength(password) {
        if (!password) return 0;

        let strength = 0;
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasRepeating = /(.)\1{2,}/.test(password);
        const hasSequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);

        // Length contribution
        strength += Math.min(length * 4, 40);

        // Character type contribution
        if (hasUppercase) strength += 10;
        if (hasLowercase) strength += 10;
        if (hasNumbers) strength += 10;
        if (hasSpecial) strength += 15;

        // Complexity penalties
        if (hasRepeating) strength -= 10;
        if (hasSequential) strength -= 10;

        // Normalize to 0-100
        return Math.max(0, Math.min(100, strength));
    }

    function updateStrengthMeter(strength) {
        strengthProgress.style.width = `${strength}%`;

        if (strength < 30) {
            strengthProgress.style.backgroundColor = 'var(--danger-color)';
            strengthValue.textContent = 'Weak';
            strengthValue.style.color = 'var(--danger-color)';
        } else if (strength < 70) {
            strengthProgress.style.backgroundColor = 'var(--warning-color)';
            strengthValue.textContent = 'Moderate';
            strengthValue.style.color = 'var(--warning-color)';
        } else {
            strengthProgress.style.backgroundColor = 'var(--success-color)';
            strengthValue.textContent = 'Strong';
            strengthValue.style.color = 'var(--success-color)';
        }
    }

    function updateCriteria(password) {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.entries(criteria).forEach(([key, value]) => {
            const criterion = document.querySelector(`[data-criterion="${key}"]`);
            if (criterion) {
                criterion.classList.toggle('valid', value);
                criterion.querySelector('i').className = value ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line';
            }
        });
    }

    function updateAnalysis(password) {
        // Update length
        lengthValue.textContent = password.length;

        // Update character types
        const types = [
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        ].filter(Boolean).length;
        charTypes.textContent = types;

        // Update crack time
        const crackTimeEstimate = estimateCrackTime(password);
        crackTime.textContent = crackTimeEstimate;
    }

    function estimateCrackTime(password) {
        if (!password) return '-';

        const length = password.length;
        const charset = [
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        ].filter(Boolean).length;

        let combinations = Math.pow(charset === 1 ? 26 : charset === 2 ? 52 : charset === 3 ? 62 : 94, length);
        let attemptsPerSecond = 1e9; // Assuming 1 billion attempts per second
        let seconds = combinations / attemptsPerSecond;

        if (seconds < 1) return 'Instantly';
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        return `${Math.round(seconds / 31536000)} years`;
    }

    function updateRecommendations(password) {
        const recommendations = [];

        if (!password) {
            recommendationsList.innerHTML = '<li>Enter a password to get recommendations</li>';
            return;
        }

        if (password.length < 12) {
            recommendations.push('Increase password length to at least 12 characters');
        }

        if (!/[A-Z]/.test(password)) {
            recommendations.push('Add uppercase letters');
        }

        if (!/[a-z]/.test(password)) {
            recommendations.push('Add lowercase letters');
        }

        if (!/\d/.test(password)) {
            recommendations.push('Add numbers');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            recommendations.push('Add special characters');
        }

        if (/(.)\1{2,}/.test(password)) {
            recommendations.push('Avoid repeating characters');
        }

        if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
            recommendations.push('Avoid sequential characters');
        }

        if (recommendations.length === 0) {
            recommendations.push('Your password meets all security requirements');
        }

        recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    }
}); 