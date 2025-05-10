document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Basic Calculator elements
    const basicValue = document.getElementById('basic-value');
    const basicPercentage = document.getElementById('basic-percentage');
    const basicCalculateBtn = document.getElementById('basic-calculate-btn');
    const basicClearBtn = document.getElementById('basic-clear-btn');
    const basicResult = document.getElementById('basic-result');
    const basicCalculation = document.getElementById('basic-calculation');
    
    // Percentage of a Number elements
    const percentageValue = document.getElementById('percentage-value');
    const percentageOfValue = document.getElementById('percentage-of-value');
    const percentageOfCalculateBtn = document.getElementById('percentage-of-calculate-btn');
    const percentageOfClearBtn = document.getElementById('percentage-of-clear-btn');
    const percentageOfResult = document.getElementById('percentage-of-result');
    const percentageOfCalculation = document.getElementById('percentage-of-calculation');
    
    // Percentage Change elements
    const originalValue = document.getElementById('original-value');
    const newValue = document.getElementById('new-value');
    const percentageChangeCalculateBtn = document.getElementById('percentage-change-calculate-btn');
    const percentageChangeClearBtn = document.getElementById('percentage-change-clear-btn');
    const percentageChangeResult = document.getElementById('percentage-change-result');
    const percentageChangeCalculation = document.getElementById('percentage-change-calculation');
    
    // Tip Calculator elements
    const billAmount = document.getElementById('bill-amount');
    const tipPercentage = document.getElementById('tip-percentage');
    const tipPresets = document.querySelectorAll('.tip-preset');
    const splitCount = document.getElementById('split-count');
    const decreaseSplit = document.getElementById('decrease-split');
    const increaseSplit = document.getElementById('increase-split');
    const splitText = document.getElementById('split-text');
    const tipCalculateBtn = document.getElementById('tip-calculate-btn');
    const tipClearBtn = document.getElementById('tip-clear-btn');
    const tipAmount = document.getElementById('tip-amount');
    const totalAmount = document.getElementById('total-amount');
    const perPersonAmount = document.getElementById('per-person-amount');
    const perPersonContainer = document.getElementById('per-person-container');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize the page
    init();
    
    function init() {
        // Tab navigation
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to selected tab
                btn.classList.add('active');
                document.getElementById(`${tab}-tab`).classList.add('active');
            });
        });
        
        // Basic Calculator
        basicCalculateBtn.addEventListener('click', calculateBasicPercentage);
        basicClearBtn.addEventListener('click', clearBasicCalculator);
        
        // Percentage of a Number
        percentageOfCalculateBtn.addEventListener('click', calculatePercentageOf);
        percentageOfClearBtn.addEventListener('click', clearPercentageOf);
        
        // Percentage Change
        percentageChangeCalculateBtn.addEventListener('click', calculatePercentageChange);
        percentageChangeClearBtn.addEventListener('click', clearPercentageChange);
        
        // Tip Calculator
        tipPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                // Remove active class from all presets
                tipPresets.forEach(p => p.classList.remove('active'));
                
                // Add active class to selected preset
                preset.classList.add('active');
                
                // Set tip percentage value
                tipPercentage.value = preset.getAttribute('data-tip');
            });
        });
        
        decreaseSplit.addEventListener('click', () => {
            const count = parseInt(splitCount.value);
            if (count > 1) {
                splitCount.value = count - 1;
                updateSplitText();
            }
        });
        
        increaseSplit.addEventListener('click', () => {
            const count = parseInt(splitCount.value);
            splitCount.value = count + 1;
            updateSplitText();
        });
        
        splitCount.addEventListener('change', updateSplitText);
        
        tipCalculateBtn.addEventListener('click', calculateTip);
        tipClearBtn.addEventListener('click', clearTipCalculator);
        
        // FAQ accordions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other FAQs
                faqItems.forEach(faq => {
                    if (faq !== item && faq.classList.contains('active')) {
                        faq.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        });
        
        // Enter key functionality for inputs
        setupEnterKeyFunctionality();
    }
    
    // Basic Percentage Calculator
    function calculateBasicPercentage() {
        const value = parseFloat(basicValue.value);
        const total = parseFloat(basicPercentage.value);
        
        if (isNaN(value) || isNaN(total)) {
            alert('Please enter valid numbers');
            return;
        }
        
        if (total === 0) {
            alert('The second number cannot be zero');
            return;
        }
        
        const percentage = (value / total) * 100;
        basicResult.textContent = `${percentage.toFixed(2)}%`;
        basicCalculation.textContent = `${value} is ${percentage.toFixed(2)}% of ${total}`;
    }
    
    function clearBasicCalculator() {
        basicValue.value = '';
        basicPercentage.value = '';
        basicResult.textContent = '0%';
        basicCalculation.textContent = '';
        basicValue.focus();
    }
    
    // Percentage of a Number Calculator
    function calculatePercentageOf() {
        const percentage = parseFloat(percentageValue.value);
        const value = parseFloat(percentageOfValue.value);
        
        if (isNaN(percentage) || isNaN(value)) {
            alert('Please enter valid numbers');
            return;
        }
        
        const result = (percentage / 100) * value;
        percentageOfResult.textContent = result.toFixed(2);
        percentageOfCalculation.textContent = `${percentage}% of ${value} = ${result.toFixed(2)}`;
    }
    
    function clearPercentageOf() {
        percentageValue.value = '';
        percentageOfValue.value = '';
        percentageOfResult.textContent = '0';
        percentageOfCalculation.textContent = '';
        percentageValue.focus();
    }
    
    // Percentage Change Calculator
    function calculatePercentageChange() {
        const original = parseFloat(originalValue.value);
        const newVal = parseFloat(newValue.value);
        
        if (isNaN(original) || isNaN(newVal)) {
            alert('Please enter valid numbers');
            return;
        }
        
        if (original === 0) {
            alert('Original value cannot be zero');
            return;
        }
        
        const change = ((newVal - original) / original) * 100;
        const isIncrease = change >= 0;
        
        percentageChangeResult.textContent = `${Math.abs(change).toFixed(2)}%`;
        percentageChangeCalculation.textContent = `${isIncrease ? 'Increase' : 'Decrease'} from ${original} to ${newVal} = ${Math.abs(change).toFixed(2)}%`;
        
        // Update result color based on increase or decrease
        percentageChangeResult.style.color = isIncrease ? 'var(--primary-green)' : 'var(--primary-red)';
    }
    
    function clearPercentageChange() {
        originalValue.value = '';
        newValue.value = '';
        percentageChangeResult.textContent = '0%';
        percentageChangeCalculation.textContent = '';
        percentageChangeResult.style.color = 'var(--primary-blue)';
        originalValue.focus();
    }
    
    // Tip Calculator
    function calculateTip() {
        const bill = parseFloat(billAmount.value);
        const tip = parseFloat(tipPercentage.value);
        const split = parseInt(splitCount.value);
        
        if (isNaN(bill) || isNaN(tip)) {
            alert('Please enter valid numbers for bill amount and tip percentage');
            return;
        }
        
        if (bill <= 0) {
            alert('Bill amount must be greater than zero');
            return;
        }
        
        if (tip < 0) {
            alert('Tip percentage cannot be negative');
            return;
        }
        
        if (split < 1) {
            alert('Split count must be at least 1');
            return;
        }
        
        const tipValue = (bill * tip) / 100;
        const total = bill + tipValue;
        const perPerson = total / split;
        
        tipAmount.textContent = `$${tipValue.toFixed(2)}`;
        totalAmount.textContent = `$${total.toFixed(2)}`;
        perPersonAmount.textContent = `$${perPerson.toFixed(2)}`;
        
        // Show/hide per person amount based on split count
        perPersonContainer.style.display = split > 1 ? 'flex' : 'none';
    }
    
    function clearTipCalculator() {
        billAmount.value = '';
        tipPercentage.value = '';
        splitCount.value = '1';
        tipPresets.forEach(p => p.classList.remove('active'));
        tipAmount.textContent = '$0.00';
        totalAmount.textContent = '$0.00';
        perPersonAmount.textContent = '$0.00';
        updateSplitText();
        perPersonContainer.style.display = 'none';
        billAmount.focus();
    }
    
    function updateSplitText() {
        const count = parseInt(splitCount.value);
        splitText.textContent = count === 1 ? 'person' : 'people';
    }
    
    // Input functionality
    function setupEnterKeyFunctionality() {
        // Basic Calculator
        basicValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') basicPercentage.focus();
        });
        
        basicPercentage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateBasicPercentage();
        });
        
        // Percentage of a Number
        percentageValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') percentageOfValue.focus();
        });
        
        percentageOfValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculatePercentageOf();
        });
        
        // Percentage Change
        originalValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') newValue.focus();
        });
        
        newValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculatePercentageChange();
        });
        
        // Tip Calculator
        billAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') tipPercentage.focus();
        });
        
        tipPercentage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateTip();
        });
        
        splitCount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateTip();
        });
    }
}); 