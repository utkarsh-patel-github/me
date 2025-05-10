document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('text-input');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const lowercaseBtn = document.getElementById('lowercase-btn');
    const uppercaseBtn = document.getElementById('uppercase-btn');
    const capitalizeBtn = document.getElementById('capitalize-btn');
    const sentenceCaseBtn = document.getElementById('sentence-case-btn');
    const toggleCaseBtn = document.getElementById('toggle-case-btn');
    const camelCaseBtn = document.getElementById('camel-case-btn');
    const pascalCaseBtn = document.getElementById('pascal-case-btn');
    const snakeCaseBtn = document.getElementById('snake-case-btn');
    const kebabCaseBtn = document.getElementById('kebab-case-btn');
    const randomCaseBtn = document.getElementById('random-case-btn');
    const charCount = document.getElementById('char-count');
    const charNoSpaceCount = document.getElementById('char-no-space-count');
    const wordCount = document.getElementById('word-count');
    const lineCount = document.getElementById('line-count');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Current font size for the text input area
    let currentFontSize = 16; // in pixels
    
    // Initialize
    init();
    
    // Functions
    function init() {
        // Set up event listeners
        textInput.addEventListener('input', updateStats);
        clearBtn.addEventListener('click', clearText);
        copyBtn.addEventListener('click', copyText);
        increaseFontBtn.addEventListener('click', increaseFontSize);
        decreaseFontBtn.addEventListener('click', decreaseFontSize);
        
        // Case conversion button listeners
        lowercaseBtn.addEventListener('click', () => convertCase('lowercase'));
        uppercaseBtn.addEventListener('click', () => convertCase('uppercase'));
        capitalizeBtn.addEventListener('click', () => convertCase('capitalize'));
        sentenceCaseBtn.addEventListener('click', () => convertCase('sentence'));
        toggleCaseBtn.addEventListener('click', () => convertCase('toggle'));
        camelCaseBtn.addEventListener('click', () => convertCase('camel'));
        pascalCaseBtn.addEventListener('click', () => convertCase('pascal'));
        snakeCaseBtn.addEventListener('click', () => convertCase('snake'));
        kebabCaseBtn.addEventListener('click', () => convertCase('kebab'));
        randomCaseBtn.addEventListener('click', () => convertCase('random'));
        
        // Setup FAQ accordions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        
        // Mobile menu toggle if it exists
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                document.querySelector('.nav-links').classList.toggle('active');
            });
        }
        
        // Initial stats update
        updateStats();
    }
    
    function updateStats() {
        const text = textInput.value;
        
        // Basic counts
        const charCountValue = text.length;
        const charNoSpaceCountValue = text.replace(/\s+/g, '').length;
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        const wordCountValue = words.length;
        const lines = text.split('\n');
        const lineCountValue = lines.length;
        
        // Update UI
        charCount.textContent = charCountValue;
        charNoSpaceCount.textContent = charNoSpaceCountValue;
        wordCount.textContent = wordCountValue;
        lineCount.textContent = lineCountValue;
    }
    
    function convertCase(caseType) {
        const text = textInput.value;
        
        if (!text.trim()) {
            return;
        }
        
        let convertedText = '';
        
        switch (caseType) {
            case 'lowercase':
                convertedText = text.toLowerCase();
                break;
                
            case 'uppercase':
                convertedText = text.toUpperCase();
                break;
                
            case 'capitalize':
                // Title Case (capitalize each word)
                convertedText = text.replace(/\w\S*/g, function(word) {
                    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
                });
                break;
                
            case 'sentence':
                // Sentence case (capitalize first letter of each sentence)
                convertedText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(match) {
                    return match.toUpperCase();
                });
                break;
                
            case 'toggle':
                // Toggle case (invert each character's case)
                convertedText = text.split('').map(char => {
                    return char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase();
                }).join('');
                break;
                
            case 'camel':
                // camelCase
                convertedText = text.trim()
                    .replace(/\s+/g, ' ') // Normalize spacing
                    .replace(/[^\w\s]/g, '') // Remove special characters
                    .toLowerCase()
                    .replace(/\s(.)/g, function(match, char) {
                        return char.toUpperCase();
                    })
                    .replace(/\s/g, '');
                break;
                
            case 'pascal':
                // PascalCase
                convertedText = text.trim()
                    .replace(/\s+/g, ' ') // Normalize spacing
                    .replace(/[^\w\s]/g, '') // Remove special characters
                    .toLowerCase()
                    .replace(/(?:^|\s)(.)/g, function(match, char) {
                        return char.toUpperCase();
                    })
                    .replace(/\s/g, '');
                break;
                
            case 'snake':
                // snake_case
                convertedText = text.trim()
                    .replace(/\s+/g, ' ') // Normalize spacing
                    .replace(/[^\w\s]/g, '') // Remove special characters
                    .toLowerCase()
                    .replace(/\s/g, '_');
                break;
                
            case 'kebab':
                // kebab-case
                convertedText = text.trim()
                    .replace(/\s+/g, ' ') // Normalize spacing
                    .replace(/[^\w\s]/g, '') // Remove special characters
                    .toLowerCase()
                    .replace(/\s/g, '-');
                break;
                
            case 'random':
                // Random case
                convertedText = text.split('').map(char => {
                    return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
                }).join('');
                break;
        }
        
        // Update the text input
        textInput.value = convertedText;
        
        // Update stats
        updateStats();
        
        // Show visual feedback
        showCaseConversionFeedback(caseType);
    }
    
    function showCaseConversionFeedback(caseType) {
        // Find the button for the case type
        let button;
        switch (caseType) {
            case 'lowercase': button = lowercaseBtn; break;
            case 'uppercase': button = uppercaseBtn; break;
            case 'capitalize': button = capitalizeBtn; break;
            case 'sentence': button = sentenceCaseBtn; break;
            case 'toggle': button = toggleCaseBtn; break;
            case 'camel': button = camelCaseBtn; break;
            case 'pascal': button = pascalCaseBtn; break;
            case 'snake': button = snakeCaseBtn; break;
            case 'kebab': button = kebabCaseBtn; break;
            case 'random': button = randomCaseBtn; break;
        }
        
        // Add and remove a class to show feedback
        if (button) {
            button.classList.add('active-case');
            setTimeout(() => {
                button.classList.remove('active-case');
            }, 300);
        }
    }
    
    function clearText() {
        textInput.value = '';
        updateStats();
    }
    
    function copyText() {
        if (!textInput.value.trim()) {
            return;
        }
        
        // Select the text
        textInput.select();
        textInput.setSelectionRange(0, 99999); // For mobile devices
        
        // Copy the text
        navigator.clipboard.writeText(textInput.value).then(() => {
            // Visual feedback for copy success
            copyBtn.classList.add('copy-animation');
            setTimeout(() => {
                copyBtn.classList.remove('copy-animation');
            }, 300);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    
    function increaseFontSize() {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            textInput.style.fontSize = currentFontSize + 'px';
        }
    }
    
    function decreaseFontSize() {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            textInput.style.fontSize = currentFontSize + 'px';
        }
    }
    
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
}); 