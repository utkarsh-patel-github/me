document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const romanInput = document.getElementById('roman-input');
    const numberInput = document.getElementById('number-input');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const conversionResult = document.getElementById('conversion-result');
    const breakdown = document.getElementById('breakdown');
    const resultText = document.getElementById('result-text');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const inputGroups = document.querySelectorAll('.input-group');
    const romanExampleButtons = document.querySelectorAll('.roman-examples .example-btn');
    const numberExampleButtons = document.querySelectorAll('.number-examples .example-btn');
    
    // Current conversion mode
    let currentMode = 'to-number'; // or 'to-roman'
    
    // Roman numeral mapping
    const romanMap = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    // Map for converting numbers to roman numerals
    const numberToRomanMap = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];
    
    // Info tabs functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Deactivate all tabs
            tabHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Activate clicked tab
            header.classList.add('active');
            const tabId = header.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-content`);
            tabContent.style.display = 'block';
        });
    });
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.className = 'ri-add-line';
            } else {
                answer.style.display = 'block';
                icon.className = 'ri-subtract-line';
            }
        });
    });
    
    // Mode toggle buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            
            // Only switch if different mode selected
            if (mode !== currentMode) {
                // Update active states
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update input groups
                inputGroups.forEach(group => {
                    if (group.classList.contains(mode)) {
                        group.classList.add('active');
                    } else {
                        group.classList.remove('active');
                    }
                });
                
                // Update current mode
                currentMode = mode;
                
                // Reset results
                resetResults();
            }
        });
    });
    
    // Example buttons
    romanExampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            romanInput.value = button.getAttribute('data-value');
            if (currentMode === 'to-number') {
                performConversion();
            }
        });
    });
    
    numberExampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            numberInput.value = button.getAttribute('data-value');
            if (currentMode === 'to-roman') {
                performConversion();
            }
        });
    });
    
    // Convert button
    convertBtn.addEventListener('click', performConversion);
    
    // Clear button
    clearBtn.addEventListener('click', () => {
        romanInput.value = '';
        numberInput.value = '';
        resetResults();
    });
    
    // Enter key press
    romanInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performConversion();
        }
    });
    
    numberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performConversion();
        }
    });
    
    // Copy button
    document.querySelector('.copy-btn').addEventListener('click', () => {
        copyToClipboard(resultText.value);
    });
    
    // Main conversion function
    function performConversion() {
        // Reset previous results
        resetResults();
        
        if (currentMode === 'to-number') {
            const roman = romanInput.value.trim().toUpperCase();
            
            // Validate input
            if (!roman) {
                showError('Please enter a Roman numeral.');
                return;
            }
            
            if (!isValidRoman(roman)) {
                showError('Invalid Roman numeral. Please check your input.');
                return;
            }
            
            // Convert roman to number
            const number = romanToNumber(roman);
            displayRomanToNumberResult(roman, number);
            
            // Generate breakdown of conversion
            generateRomanToNumberBreakdown(roman);
        } else {
            const number = parseInt(numberInput.value);
            
            // Validate input
            if (!number || isNaN(number)) {
                showError('Please enter a valid number.');
                return;
            }
            
            if (number < 1 || number > 3999) {
                showError('Number must be between 1 and 3999.');
                return;
            }
            
            // Convert number to roman
            const roman = numberToRoman(number);
            displayNumberToRomanResult(number, roman);
            
            // Generate breakdown of conversion
            generateNumberToRomanBreakdown(number, roman);
        }
    }
    
    // Roman to number conversion
    function romanToNumber(roman) {
        let result = 0;
        
        for (let i = 0; i < roman.length; i++) {
            // Get current and next values
            const current = romanMap[roman[i]];
            const next = i + 1 < roman.length ? romanMap[roman[i + 1]] : 0;
            
            // If current is less than next, subtract current
            if (current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        
        return result;
    }
    
    // Number to Roman conversion
    function numberToRoman(num) {
        let result = '';
        
        for (const mapping of numberToRomanMap) {
            // Continue adding the symbol while we can subtract its value
            while (num >= mapping.value) {
                result += mapping.symbol;
                num -= mapping.value;
            }
        }
        
        return result;
    }
    
    // Check if a string is a valid Roman numeral
    function isValidRoman(str) {
        // Regex for basic Roman numeral validation
        const validRomanRegex = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
        return validRomanRegex.test(str);
    }
    
    // Display Roman to Number conversion result
    function displayRomanToNumberResult(roman, number) {
        conversionResult.innerHTML = '';
        conversionResult.classList.add('has-result');
        
        // Create input value
        const inputValueDiv = document.createElement('div');
        inputValueDiv.className = 'input-value';
        inputValueDiv.innerHTML = `Roman Numeral: <strong>${roman}</strong>`;
        conversionResult.appendChild(inputValueDiv);
        
        // Create equals sign
        const equalsDiv = document.createElement('div');
        equalsDiv.className = 'equals';
        equalsDiv.textContent = '=';
        conversionResult.appendChild(equalsDiv);
        
        // Create result value
        const resultValueDiv = document.createElement('div');
        resultValueDiv.className = 'result-value';
        resultValueDiv.textContent = number;
        conversionResult.appendChild(resultValueDiv);
        
        // Set copy text value
        resultText.value = `${roman} = ${number}`;
    }
    
    // Display Number to Roman conversion result
    function displayNumberToRomanResult(number, roman) {
        conversionResult.innerHTML = '';
        conversionResult.classList.add('has-result');
        
        // Create input value
        const inputValueDiv = document.createElement('div');
        inputValueDiv.className = 'input-value';
        inputValueDiv.innerHTML = `Number: <strong>${number}</strong>`;
        conversionResult.appendChild(inputValueDiv);
        
        // Create equals sign
        const equalsDiv = document.createElement('div');
        equalsDiv.className = 'equals';
        equalsDiv.textContent = '=';
        conversionResult.appendChild(equalsDiv);
        
        // Create result value
        const resultValueDiv = document.createElement('div');
        resultValueDiv.className = 'result-value';
        resultValueDiv.textContent = roman;
        conversionResult.appendChild(resultValueDiv);
        
        // Set copy text value
        resultText.value = `${number} = ${roman}`;
    }
    
    // Generate breakdown for Roman to Number conversion
    function generateRomanToNumberBreakdown(roman) {
        breakdown.innerHTML = '';
        breakdown.classList.add('active');
        
        // Create header
        const header = document.createElement('h3');
        header.textContent = 'Conversion Breakdown';
        breakdown.appendChild(header);
        
        // Create explanation
        const explanation = document.createElement('p');
        explanation.textContent = 'Roman numerals are read from left to right. When a smaller value precedes a larger one, we subtract; otherwise, we add.';
        breakdown.appendChild(explanation);
        
        // Create steps container
        const stepsDiv = document.createElement('div');
        stepsDiv.className = 'steps';
        
        let runningTotal = 0;
        let stepNum = 1;
        
        for (let i = 0; i < roman.length; i++) {
            const current = romanMap[roman[i]];
            const next = i + 1 < roman.length ? romanMap[roman[i + 1]] : 0;
            
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = stepNum;
            stepDiv.appendChild(stepNumber);
            
            const stepText = document.createElement('div');
            stepText.className = 'step-text';
            
            if (current < next) {
                // Subtraction case
                runningTotal -= current;
                stepText.innerHTML = `Read <span class="highlight">${roman[i]}</span> (${current}). Next symbol is <span class="highlight">${roman[i+1]}</span> (${next}), which is larger, so we subtract: Running total = ${runningTotal}`;
            } else {
                // Addition case
                runningTotal += current;
                if (i + 1 < roman.length) {
                    stepText.innerHTML = `Read <span class="highlight">${roman[i]}</span> (${current}). Next symbol is <span class="highlight">${roman[i+1]}</span> (${next}), which is not larger, so we add: Running total = ${runningTotal}`;
                } else {
                    stepText.innerHTML = `Read <span class="highlight">${roman[i]}</span> (${current}). This is the last symbol, so we add: Running total = ${runningTotal}`;
                }
            }
            
            stepDiv.appendChild(stepText);
            stepsDiv.appendChild(stepDiv);
            stepNum++;
        }
        
        breakdown.appendChild(stepsDiv);
        
        // Add final result
        const resultP = document.createElement('p');
        resultP.innerHTML = `Therefore, <span class="highlight">${roman}</span> = <span class="highlight">${runningTotal}</span>`;
        breakdown.appendChild(resultP);
    }
    
    // Generate breakdown for Number to Roman conversion
    function generateNumberToRomanBreakdown(number, roman) {
        breakdown.innerHTML = '';
        breakdown.classList.add('active');
        
        // Create header
        const header = document.createElement('h3');
        header.textContent = 'Conversion Breakdown';
        breakdown.appendChild(header);
        
        // Create explanation
        const explanation = document.createElement('p');
        explanation.textContent = 'To convert a number to Roman numerals, we find the largest Roman numeral value less than or equal to our number, add that symbol to our result, and subtract its value from our number. We repeat until our number becomes zero.';
        breakdown.appendChild(explanation);
        
        // Create steps container
        const stepsDiv = document.createElement('div');
        stepsDiv.className = 'steps';
        
        let remainingNumber = number;
        let result = '';
        let stepNum = 1;
        
        while (remainingNumber > 0) {
            // Find largest value less than or equal to remaining number
            const mapping = numberToRomanMap.find(m => m.value <= remainingNumber);
            
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';
            
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = stepNum;
            stepDiv.appendChild(stepNumber);
            
            const stepText = document.createElement('div');
            stepText.className = 'step-text';
            
            result += mapping.symbol;
            remainingNumber -= mapping.value;
            
            stepText.innerHTML = `Largest value ≤ ${remainingNumber + mapping.value} is <span class="highlight">${mapping.value}</span> (<span class="highlight">${mapping.symbol}</span>).<br>
                                 Add <span class="highlight">${mapping.symbol}</span> to result, giving <span class="highlight">${result}</span>.<br>
                                 Subtract ${mapping.value} from ${remainingNumber + mapping.value}, leaving ${remainingNumber}.`;
            
            stepDiv.appendChild(stepText);
            stepsDiv.appendChild(stepDiv);
            stepNum++;
        }
        
        breakdown.appendChild(stepsDiv);
        
        // Add final result
        const resultP = document.createElement('p');
        resultP.innerHTML = `Therefore, <span class="highlight">${number}</span> = <span class="highlight">${roman}</span>`;
        breakdown.appendChild(resultP);
    }
    
    // Show error message
    function showError(message) {
        conversionResult.innerHTML = '';
        conversionResult.classList.remove('has-result');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'empty-state error';
        
        const icon = document.createElement('i');
        icon.className = 'ri-error-warning-fill';
        errorDiv.appendChild(icon);
        
        const text = document.createElement('p');
        text.textContent = message;
        errorDiv.appendChild(text);
        
        conversionResult.appendChild(errorDiv);
    }
    
    // Reset all results
    function resetResults() {
        conversionResult.innerHTML = `
            <div class="empty-state">
                <i class="ri-roman-s-fill"></i>
                <p>Enter a ${currentMode === 'to-number' ? 'Roman numeral' : 'number'} to convert</p>
            </div>
        `;
        conversionResult.classList.remove('has-result');
        breakdown.innerHTML = '';
        breakdown.classList.remove('active');
        resultText.value = '';
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        if (!text) return;
        
        // Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast('Result copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy. Please try again.');
        }
        
        document.body.removeChild(textarea);
    }
    
    // Show toast message
    function showToast(message) {
        // Check if toast container exists, create if not
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide and remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Share button functionality
    document.querySelector('.share-btn').addEventListener('click', () => {
        if (navigator.share && resultText.value) {
            navigator.share({
                title: 'Roman Numeral Conversion',
                text: resultText.value
            })
            .then(() => showToast('Shared successfully!'))
            .catch((error) => console.error('Error sharing:', error));
        } else {
            showToast('Your browser does not support sharing, or there\'s no result to share.');
        }
    });
    
    // Print button functionality
    document.querySelector('.print-btn').addEventListener('click', () => {
        if (!resultText.value) {
            showToast('Please convert a value first.');
            return;
        }
        
        const [input, result] = resultText.value.split('=').map(part => part.trim());
        const isRomanToNumber = isNaN(parseInt(input));
        
        const printContent = `
            <html>
            <head>
                <title>Roman Numeral Conversion Result</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    h1 {
                        color: #FF5722;
                        border-bottom: 2px solid #FF5722;
                        padding-bottom: 10px;
                    }
                    .conversion {
                        font-size: 24px;
                        margin: 20px 0;
                        padding: 15px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background: #f9f9f9;
                        text-align: center;
                    }
                    .label {
                        font-weight: bold;
                        color: #555;
                    }
                    .value {
                        font-size: 28px;
                        color: #FF5722;
                        margin: 10px 0;
                    }
                    .equals {
                        margin: 10px 0;
                        font-size: 20px;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <h1>Roman Numeral Conversion</h1>
                <div class="conversion">
                    <div class="label">${isRomanToNumber ? 'Roman Numeral' : 'Number'}</div>
                    <div class="value">${input}</div>
                    <div class="equals">=</div>
                    <div class="label">${isRomanToNumber ? 'Number' : 'Roman Numeral'}</div>
                    <div class="value">${result}</div>
                </div>
                <div class="footer">Generated by Daily Tools - Roman Numeral Converter</div>
            </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Print after a small delay to ensure content is loaded
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    });
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save user preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuToggle.classList.toggle('active');
        
        // Toggle between menu and close icons
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('show')) {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        }
    });
}); 