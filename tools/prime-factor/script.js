document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const numberInput = document.getElementById('number-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exampleBtn = document.getElementById('example-btn');
    const resultSection = document.getElementById('result-section');
    const resultsContainer = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');
    const stepsList = document.getElementById('steps-list');
    const primeFactorization = document.getElementById('prime-factorization');
    const factorTree = document.getElementById('factor-tree');
    const numFactors = document.getElementById('num-factors');
    const sumFactors = document.getElementById('sum-factors');
    const isPrime = document.getElementById('is-prime');
    const isPerfect = document.getElementById('is-perfect');
    const allFactors = document.getElementById('all-factors');
    const copyBtn = document.getElementById('copy-btn');
    const printBtn = document.getElementById('print-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    // Initialize
    init();
    
    // Functions
    function init() {
        // Set up event listeners
        calculateBtn.addEventListener('click', calculatePrimeFactors);
        clearBtn.addEventListener('click', clearInput);
        exampleBtn.addEventListener('click', showExample);
        copyBtn.addEventListener('click', copyResults);
        printBtn.addEventListener('click', printResults);
        numberInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePrimeFactors();
            }
        });
        
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
    }
    
    function calculatePrimeFactors() {
        // Get and validate input
        let number = numberInput.value.trim();
        
        // Check if input is empty
        if (!number) {
            alert('Please enter a positive integer');
            return;
        }
        
        // Convert to number and validate
        number = BigInt(number);
        
        if (number <= 0n) {
            alert('Please enter a positive integer');
            return;
        }
        
        // Clear previous results
        stepsList.innerHTML = '';
        factorTree.innerHTML = '';
        
        // Calculate prime factors
        const { factors, steps } = findPrimeFactors(number);
        
        // Display calculation steps
        steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.textContent = step;
            stepsList.appendChild(stepElement);
        });
        
        // Create prime factorization display
        const primeFactorizationText = formatPrimeFactorization(factors);
        primeFactorization.textContent = primeFactorizationText;
        
        // Create factor tree
        createFactorTree(number, factorTree);
        
        // Calculate additional information
        const allFactorsList = findAllFactors(number, factors);
        const totalFactors = allFactorsList.length;
        const factorsSum = allFactorsList.reduce((sum, factor) => sum + factor, 0n);
        const isPrimeNumber = totalFactors === 2;
        const isPerfectNumber = factorsSum - number === number;
        
        // Display additional information
        numFactors.textContent = totalFactors;
        sumFactors.textContent = factorsSum.toString();
        isPrime.textContent = isPrimeNumber ? 'Yes' : 'No';
        isPerfect.textContent = isPerfectNumber ? 'Yes' : 'No';
        
        // Display all factors
        allFactors.textContent = allFactorsList.join(', ');
        
        // Show results
        emptyState.style.display = 'none';
        resultsContainer.style.display = 'block';
    }
    
    function findPrimeFactors(number) {
        const factors = {};
        const steps = [];
        let n = number;
        
        steps.push(`Starting with number: ${number}`);
        
        // Handle edge case for 1
        if (n === 1n) {
            steps.push(`${n} has no prime factors (1 is neither prime nor composite)`);
            return { factors: {}, steps };
        }
        
        // Check for factor 2
        while (n % 2n === 0n) {
            factors[2] = (factors[2] || 0) + 1;
            n = n / 2n;
            steps.push(`${number} ÷ 2 = ${n} (remainder 0) - 2 is a factor`);
        }
        
        // Check for odd prime factors
        for (let i = 3n; i * i <= n; i += 2n) {
            while (n % i === 0n) {
                factors[i] = (factors[i] || 0) + 1;
                n = n / i;
                steps.push(`${number} ÷ ${i} = ${n} (remainder 0) - ${i} is a factor`);
            }
        }
        
        // If n is a prime number greater than 2
        if (n > 2n) {
            factors[n] = (factors[n] || 0) + 1;
            steps.push(`${n} is a prime factor`);
        }
        
        if (Object.keys(factors).length === 0) {
            steps.push(`${number} is 1, which has no prime factors`);
        }
        
        return { factors, steps };
    }
    
    function formatPrimeFactorization(factors) {
        if (Object.keys(factors).length === 0) {
            return "1 (no prime factors)";
        }
        
        return Object.entries(factors)
            .map(([factor, exponent]) => {
                if (exponent === 1) {
                    return `${factor}`;
                } else {
                    return `${factor}<sup>${exponent}</sup>`;
                }
            })
            .join(' × ');
    }
    
    function createFactorTree(number, container) {
        // For large numbers, don't attempt to draw the tree as it gets too complex
        if (number > 1000000n) {
            container.innerHTML = '<div class="tree-note">Factor tree visualization is available for numbers up to 1,000,000.</div>';
            return;
        }
        
        function createNode(value, isRoot = false) {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'tree-node';
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'node-value';
            valueDiv.textContent = value;
            
            nodeDiv.appendChild(valueDiv);
            
            if (isRoot) {
                container.appendChild(nodeDiv);
            }
            
            return { node: nodeDiv, value };
        }
        
        function buildTree(num, parentNode = null, isRoot = false) {
            // Base case for 1
            if (num === 1n) {
                return createNode(1);
            }
            
            const node = createNode(num, isRoot);
            
            // If prime, return the node
            if (isPrimeNumber(num)) {
                return node;
            }
            
            // Find factors
            let factor1 = 0n, factor2 = 0n;
            for (let i = 2n; i * i <= num; i++) {
                if (num % i === 0n) {
                    factor1 = i;
                    factor2 = num / i;
                    break;
                }
            }
            
            // If no factors found, number is prime
            if (factor1 === 0n) {
                return node;
            }
            
            // Create children container
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'tree-children';
            
            // Build left child (smaller factor)
            const leftChild = buildTree(factor1);
            childrenDiv.appendChild(leftChild.node);
            
            // Build right child (larger factor)
            const rightChild = buildTree(factor2);
            childrenDiv.appendChild(rightChild.node);
            
            // Add children to parent
            node.node.appendChild(childrenDiv);
            
            return node;
        }
        
        // Clear container and build tree
        container.innerHTML = '';
        buildTree(BigInt(number), null, true);
    }
    
    function isPrimeNumber(num) {
        if (num <= 1n) return false;
        if (num <= 3n) return true;
        if (num % 2n === 0n || num % 3n === 0n) return false;
        
        for (let i = 5n; i * i <= num; i += 6n) {
            if (num % i === 0n || num % (i + 2n) === 0n) {
                return false;
            }
        }
        
        return true;
    }
    
    function findAllFactors(number, primeFactors) {
        // Handle special case for 1
        if (number === 1n) {
            return [1n];
        }
        
        // Convert prime factors object to expanded array
        let expandedFactors = [];
        for (const [factor, exponent] of Object.entries(primeFactors)) {
            for (let i = 0; i < exponent; i++) {
                expandedFactors.push(BigInt(factor));
            }
        }
        
        // Use recursion to find all combinations of factors
        function generateFactors(index, currentProduct) {
            if (index === expandedFactors.length) {
                return [currentProduct];
            }
            
            // Include the current prime factor
            const includeFactors = generateFactors(index + 1, currentProduct * expandedFactors[index]);
            
            // Exclude the current prime factor
            const excludeFactors = generateFactors(index + 1, currentProduct);
            
            return [...includeFactors, ...excludeFactors];
        }
        
        // Generate all factors and filter duplicates
        const allFactors = [...new Set(generateFactors(0, 1n))].sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        
        return allFactors;
    }
    
    function clearInput() {
        numberInput.value = '';
        emptyState.style.display = 'flex';
        resultsContainer.style.display = 'none';
        numberInput.focus();
    }
    
    function showExample() {
        numberInput.value = '60';
        calculatePrimeFactors();
    }
    
    function copyResults() {
        // Prepare text to copy
        const textToCopy = `
Number: ${numberInput.value}
Prime Factorization: ${primeFactorization.textContent.replace(/<[^>]*>/g, '^')}
Number of Factors: ${numFactors.textContent}
Sum of Factors: ${sumFactors.textContent}
Is Prime: ${isPrime.textContent}
Is Perfect: ${isPerfect.textContent}
All Factors: ${allFactors.textContent}
        `.trim();
        
        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Show feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }
    
    function printResults() {
        const printWindow = window.open('', '_blank');
        const number = numberInput.value;
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Prime Factorization of ${number}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #4f46e5; }
                    .result-section { margin-bottom: 20px; }
                    .result-title { font-weight: bold; margin-bottom: 5px; }
                    .factors { font-size: 1.2em; }
                    .all-factors { word-break: break-all; }
                </style>
            </head>
            <body>
                <h1>Prime Factorization Results</h1>
                <div class="result-section">
                    <div class="result-title">Number:</div>
                    <div>${number}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">Prime Factorization:</div>
                    <div class="factors">${primeFactorization.innerHTML}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">Number of Factors:</div>
                    <div>${numFactors.textContent}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">Sum of Factors:</div>
                    <div>${sumFactors.textContent}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">Is Prime:</div>
                    <div>${isPrime.textContent}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">Is Perfect:</div>
                    <div>${isPerfect.textContent}</div>
                </div>
                <div class="result-section">
                    <div class="result-title">All Factors:</div>
                    <div class="all-factors">${allFactors.textContent}</div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
    
    function toggleTheme() {
        // Use the global theme toggle function
        if (typeof window.toggleTheme === 'function') {
            window.toggleTheme();
        }
    }
});

// Create the prime factor icon if it doesn't exist
(function() {
    window.addEventListener('load', function() {
        const img = document.querySelector('.header-image img');
        if (!img.complete || img.naturalHeight === 0) {
            // Create a placeholder SVG icon
            const iconSVG = `
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="12" fill="#F3F4F6"/>
                <rect x="20" y="20" width="80" height="80" rx="8" fill="#EEF2FF"/>
                <circle cx="60" cy="42" r="16" fill="#4F46E5"/>
                <text x="60" y="48" text-anchor="middle" font-size="18" font-weight="bold" fill="white">60</text>
                <line x1="50" y1="62" x2="40" y2="72" stroke="#4F46E5" stroke-width="2"/>
                <line x1="70" y1="62" x2="80" y2="72" stroke="#4F46E5" stroke-width="2"/>
                <circle cx="40" cy="82" r="10" fill="#818CF8"/>
                <text x="40" y="86" text-anchor="middle" font-size="12" font-weight="bold" fill="white">2</text>
                <circle cx="80" cy="82" r="10" fill="#818CF8"/>
                <text x="80" y="86" text-anchor="middle" font-size="12" font-weight="bold" fill="white">30</text>
                <line x1="73" y1="88" x2="65" y2="95" stroke="#818CF8" stroke-width="2"/>
                <line x1="86" y1="88" x2="95" y2="95" stroke="#818CF8" stroke-width="2"/>
                <circle cx="60" cy="100" r="8" fill="#A5B4FC"/>
                <text x="60" y="104" text-anchor="middle" font-size="10" font-weight="bold" fill="white">3</text>
                <circle cx="95" cy="100" r="8" fill="#A5B4FC"/>
                <text x="95" y="104" text-anchor="middle" font-size="10" font-weight="bold" fill="white">10</text>
                <line x1="95" y1="92" x2="95" y2="85" stroke="#A5B4FC" stroke-width="2"/>
                <circle cx="95" cy="78" r="6" fill="#C7D2FE"/>
                <text x="95" y="81" text-anchor="middle" font-size="8" font-weight="bold" fill="white">5</text>
                <rect x="30" y="25" width="60" height="7" rx="3.5" fill="#C7D2FE"/>
            </svg>
            `;
            
            // Create a blob from the SVG
            const blob = new Blob([iconSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            // Set the image
            img.src = url;
            img.alt = "Prime Factor Calculator";
        }
    });
})(); 