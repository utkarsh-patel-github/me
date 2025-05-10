document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const chartTabButtons = document.querySelectorAll('.chart-tab');
    
    // Loan calculator elements
    const loanAmount = document.getElementById('loan-amount');
    const interestRate = document.getElementById('interest-rate');
    const loanTerm = document.getElementById('loan-term');
    const termUnit = document.getElementById('term-unit');
    const paymentFrequency = document.getElementById('payment-frequency');
    const extraPayment = document.getElementById('extra-payment');
    const startDate = document.getElementById('start-date');
    const calculateLoanBtn = document.getElementById('calculate-loan-btn');
    const clearLoanBtn = document.getElementById('clear-loan-btn');
    const loanResultsSection = document.getElementById('loan-results-section');
    
    // Results elements
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalPayments = document.getElementById('total-payments');
    const totalInterest = document.getElementById('total-interest');
    const payoffDate = document.getElementById('payoff-date');
    const principalAmount = document.getElementById('principal-amount');
    const interestAmount = document.getElementById('interest-amount');
    const totalCost = document.getElementById('total-cost');
    const viewAmortizationBtn = document.getElementById('view-amortization-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    
    // Amortization table elements
    const amortizationTableBody = document.getElementById('amortization-table-body');
    const amortizationSearch = document.getElementById('amortization-search');
    const searchBtn = document.getElementById('search-btn');
    const displayFrequency = document.getElementById('display-frequency');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');
    
    // Loan comparison elements
    const addLoanBtn = document.getElementById('add-loan-btn');
    const comparisonGrid = document.getElementById('comparison-grid');
    const comparisonChartContainer = document.querySelector('.comparison-chart-container');
    
    // Advanced options toggle
    const advancedToggle = document.querySelector('.advanced-toggle');
    const advancedInputs = document.querySelector('.advanced-inputs');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Charts
    let paymentChart;
    let comparisonChart;
    
    // Global loan data
    let currentLoanData = null;
    let amortizationSchedule = [];
    let comparisonLoans = [];
    
    // Pagination settings
    const rowsPerPage = 12;
    let currentPage = 1;
    let filteredSchedule = [];
    
    // Initialize
    init();
    
    function init() {
        // Set default date to today
        const today = new Date();
        startDate.valueAsDate = today;
        
        // Tab navigation
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current tab
                button.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Update chart if it exists and is visible
                if (tabId === 'calculator' && paymentChart) {
                    setTimeout(() => paymentChart.update(), 100);
                } else if (tabId === 'comparison' && comparisonChart) {
                    setTimeout(() => comparisonChart.update(), 100);
                }
            });
        });
        
        // Chart tabs
        chartTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const chartType = button.getAttribute('data-chart');
                
                // Remove active class from all tabs
                chartTabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to current tab
                button.classList.add('active');
                
                // Update comparison chart
                updateComparisonChart(chartType);
            });
        });
        
        // Calculator functions
        calculateLoanBtn.addEventListener('click', calculateLoan);
        clearLoanBtn.addEventListener('click', clearInputs);
        viewAmortizationBtn.addEventListener('click', () => {
            // Switch to amortization tab
            tabButtons[1].click();
        });
        
        // Advanced options toggle
        advancedToggle.addEventListener('click', () => {
            advancedToggle.classList.toggle('active');
            advancedInputs.style.display = advancedInputs.style.display === 'none' ? 'block' : 'none';
        });
        
        // Amortization table functions
        searchBtn.addEventListener('click', searchAmortizationTable);
        amortizationSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchAmortizationTable();
        });
        displayFrequency.addEventListener('change', () => {
            createAmortizationTable(amortizationSchedule);
        });
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayAmortizationPage();
            }
        });
        nextPageBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(filteredSchedule.length / rowsPerPage);
            if (currentPage < maxPages) {
                currentPage++;
                displayAmortizationPage();
            }
        });
        
        // Loan comparison functions
        addLoanBtn.addEventListener('click', addLoanComparison);
        
        // Enter key functionality
        setupEnterKeyFunctionality();
        
        // FAQ accordions
        setupFaqAccordions();
    }
    
    // Loan calculation functions
    function calculateLoan() {
        // Get input values
        const amount = parseFloat(loanAmount.value);
        const rate = parseFloat(interestRate.value);
        const term = parseInt(loanTerm.value);
        const unit = termUnit.value;
        const frequency = paymentFrequency.value;
        const extra = parseFloat(extraPayment.value) || 0;
        const date = new Date(startDate.value) || new Date();
        
        // Validate inputs
        if (!amount || !rate || !term) {
            alert('Please enter loan amount, interest rate, and loan term');
            return;
        }
        
        if (amount <= 0 || rate <= 0 || term <= 0) {
            alert('Please enter positive values for loan amount, interest rate, and loan term');
            return;
        }
        
        // Convert term to months if in years
        const termInMonths = unit === 'years' ? term * 12 : term;
        
        // Calculate number of payments based on frequency
        let numPayments, paymentFrequencyFactor;
        switch (frequency) {
            case 'bi-weekly':
                paymentFrequencyFactor = 26 / 12;
                numPayments = Math.ceil(termInMonths * (26 / 12));
                break;
            case 'weekly':
                paymentFrequencyFactor = 52 / 12;
                numPayments = Math.ceil(termInMonths * (52 / 12));
                break;
            default: // monthly
                paymentFrequencyFactor = 1;
                numPayments = termInMonths;
                break;
        }
        
        // Convert annual interest rate to per-payment rate
        const periodicRate = (rate / 100) / (12 * paymentFrequencyFactor);
        
        // Calculate regular payment amount using formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        const regularPayment = amount * (periodicRate * Math.pow(1 + periodicRate, numPayments)) / (Math.pow(1 + periodicRate, numPayments) - 1);
        
        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(amount, regularPayment, periodicRate, numPayments, extra, date, frequency);
        
        // Store loan data
        currentLoanData = {
            loanAmount: amount,
            interestRate: rate,
            loanTerm: term,
            termUnit: unit,
            paymentFrequency: frequency,
            extraPayment: extra,
            startDate: date,
            regularPayment: regularPayment,
            totalPayments: schedule.totalPayments,
            totalInterest: schedule.totalInterest,
            finalPaymentDate: schedule.finalPaymentDate,
            actualNumPayments: schedule.payments.length
        };
        
        // Store amortization schedule
        amortizationSchedule = schedule.payments;
        
        // Display results
        displayLoanResults(currentLoanData);
        
        // Create amortization table
        createAmortizationTable(amortizationSchedule);
        
        // Show results section
        loanResultsSection.style.display = 'block';
    }
    
    function generateAmortizationSchedule(principal, regularPayment, periodicRate, numPayments, extraPayment, startDate, frequency) {
        let balance = principal;
        let paymentNumber = 1;
        let totalPayments = 0;
        let totalInterest = 0;
        let currentDate = new Date(startDate);
        const payments = [];
        
        while (balance > 0 && paymentNumber <= numPayments * 2) { // Safety limit to prevent infinite loops
            // Calculate interest for this period
            const interestPayment = balance * periodicRate;
            
            // Regular payment plus extra payment
            let paymentAmount = regularPayment + extraPayment;
            
            // Adjust final payment if it would overpay
            if (balance + interestPayment < paymentAmount) {
                paymentAmount = balance + interestPayment;
            }
            
            // Calculate principal portion of payment
            const principalPayment = paymentAmount - interestPayment;
            
            // Update balance
            balance -= principalPayment;
            
            // Update totals
            totalPayments += paymentAmount;
            totalInterest += interestPayment;
            
            // Add payment to schedule
            payments.push({
                paymentNumber: paymentNumber,
                paymentDate: new Date(currentDate),
                paymentAmount: paymentAmount,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                extraPayment: paymentAmount > regularPayment ? extraPayment : 0,
                remainingBalance: balance > 0 ? balance : 0
            });
            
            // Advance to next payment date based on frequency
            switch (frequency) {
                case 'bi-weekly':
                    currentDate.setDate(currentDate.getDate() + 14);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                default: // monthly
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
            
            // Next payment
            paymentNumber++;
            
            // Break if balance is effectively zero (floating point issues)
            if (balance < 0.01) {
                balance = 0;
            }
        }
        
        return {
            payments: payments,
            totalPayments: totalPayments,
            totalInterest: totalInterest,
            finalPaymentDate: payments[payments.length - 1].paymentDate
        };
    }
    
    function displayLoanResults(loanData) {
        // Format the payment details
        const paymentFrequencyText = loanData.paymentFrequency === 'monthly' ? 'Monthly' :
                                 loanData.paymentFrequency === 'bi-weekly' ? 'Bi-weekly' : 'Weekly';
        
        // Display summary values
        monthlyPayment.textContent = `$${loanData.regularPayment.toFixed(2)}`;
        totalPayments.textContent = `$${loanData.totalPayments.toFixed(2)}`;
        totalInterest.textContent = `$${loanData.totalInterest.toFixed(2)}`;
        payoffDate.textContent = formatDate(loanData.finalPaymentDate);
        
        // Display breakdown values
        principalAmount.textContent = `$${loanData.loanAmount.toFixed(2)}`;
        interestAmount.textContent = `$${loanData.totalInterest.toFixed(2)}`;
        totalCost.textContent = `$${(loanData.loanAmount + loanData.totalInterest).toFixed(2)}`;
        
        // Create/update the payment chart
        createPaymentChart(loanData);
    }
    
    function createPaymentChart(loanData) {
        const ctx = document.getElementById('payment-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (paymentChart) {
            paymentChart.destroy();
        }
        
        // Create new chart
        paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [loanData.loanAmount, loanData.totalInterest],
                    backgroundColor: [
                        'rgba(66, 133, 244, 0.7)',
                        'rgba(234, 67, 53, 0.7)'
                    ],
                    borderColor: [
                        'rgba(66, 133, 244, 1)',
                        'rgba(234, 67, 53, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function createAmortizationTable(schedule) {
        // Filter based on display frequency
        const display = displayFrequency.value;
        
        if (display === 'yearly' && schedule.length > 0) {
            filteredSchedule = getYearlySummary(schedule);
        } else {
            filteredSchedule = [...schedule];
        }
        
        // Reset pagination
        currentPage = 1;
        
        // Display first page
        displayAmortizationPage();
    }
    
    function getYearlySummary(schedule) {
        const yearlyData = {};
        
        schedule.forEach(payment => {
            const year = payment.paymentDate.getFullYear();
            
            if (!yearlyData[year]) {
                yearlyData[year] = {
                    year: year,
                    firstPaymentNumber: payment.paymentNumber,
                    firstPaymentDate: new Date(payment.paymentDate),
                    totalPaymentAmount: 0,
                    totalPrincipalPayment: 0,
                    totalInterestPayment: 0,
                    totalExtraPayment: 0,
                    finalRemainingBalance: payment.remainingBalance
                };
            }
            
            yearlyData[year].totalPaymentAmount += payment.paymentAmount;
            yearlyData[year].totalPrincipalPayment += payment.principalPayment;
            yearlyData[year].totalInterestPayment += payment.interestPayment;
            yearlyData[year].totalExtraPayment += payment.extraPayment;
            yearlyData[year].finalRemainingBalance = payment.remainingBalance;
        });
        
        return Object.values(yearlyData);
    }
    
    function displayAmortizationPage() {
        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredSchedule.length);
        const displayData = filteredSchedule.slice(startIndex, endIndex);
        const maxPages = Math.ceil(filteredSchedule.length / rowsPerPage);
        
        // Update page indicator
        pageIndicator.textContent = `Page ${currentPage} of ${maxPages || 1}`;
        
        // Enable/disable pagination buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === maxPages || maxPages === 0;
        
        // Clear table
        amortizationTableBody.innerHTML = '';
        
        // Check if we have data
        if (displayData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-state';
            emptyRow.innerHTML = '<td colspan="7">No data available</td>';
            amortizationTableBody.appendChild(emptyRow);
            return;
        }
        
        // Determine if we're showing yearly summary
        const isYearlySummary = displayFrequency.value === 'yearly';
        
        // Add rows
        displayData.forEach(payment => {
            const row = document.createElement('tr');
            
            if (isYearlySummary) {
                // Yearly summary display
                row.innerHTML = `
                    <td>${payment.year}</td>
                    <td>${formatDate(payment.firstPaymentDate)}</td>
                    <td>$${payment.totalPaymentAmount.toFixed(2)}</td>
                    <td>$${payment.totalPrincipalPayment.toFixed(2)}</td>
                    <td>$${payment.totalInterestPayment.toFixed(2)}</td>
                    <td>$${payment.totalExtraPayment.toFixed(2)}</td>
                    <td>$${payment.finalRemainingBalance.toFixed(2)}</td>
                `;
            } else {
                // Regular payment display
                row.innerHTML = `
                    <td>${payment.paymentNumber}</td>
                    <td>${formatDate(payment.paymentDate)}</td>
                    <td>$${payment.paymentAmount.toFixed(2)}</td>
                    <td>$${payment.principalPayment.toFixed(2)}</td>
                    <td>$${payment.interestPayment.toFixed(2)}</td>
                    <td>$${payment.extraPayment.toFixed(2)}</td>
                    <td>$${payment.remainingBalance.toFixed(2)}</td>
                `;
            }
            
            amortizationTableBody.appendChild(row);
        });
    }
    
    function searchAmortizationTable() {
        const searchTerm = amortizationSearch.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // Reset filter if search is empty
            createAmortizationTable(amortizationSchedule);
            return;
        }
        
        // Determine if we're showing yearly summary
        const isYearlySummary = displayFrequency.value === 'yearly';
        
        if (isYearlySummary) {
            // Filter yearly data
            filteredSchedule = getYearlySummary(amortizationSchedule).filter(payment => {
                return payment.year.toString().includes(searchTerm);
            });
        } else {
            // Filter regular payments
            filteredSchedule = amortizationSchedule.filter(payment => {
                return payment.paymentNumber.toString().includes(searchTerm) ||
                       formatDate(payment.paymentDate).toLowerCase().includes(searchTerm);
            });
        }
        
        // Reset pagination and display
        currentPage = 1;
        displayAmortizationPage();
    }
    
    // Loan comparison functions
    function addLoanComparison() {
        // Maximum of 3 loans to compare
        if (comparisonLoans.length >= 3) {
            alert('You can compare up to 3 loans at a time. Please remove one to add another.');
            return;
        }
        
        // Check if we have loan data
        if (!currentLoanData) {
            alert('Please calculate a loan first to add it to comparison.');
            tabButtons[0].click(); // Switch to calculator tab
            return;
        }
        
        // Check if this loan is already in comparison
        const loanExists = comparisonLoans.some(loan => 
            loan.loanAmount === currentLoanData.loanAmount && 
            loan.interestRate === currentLoanData.interestRate && 
            loan.loanTerm === currentLoanData.loanTerm &&
            loan.termUnit === currentLoanData.termUnit
        );
        
        if (loanExists) {
            alert('This loan is already in the comparison.');
            return;
        }
        
        // Add loan to comparison
        comparisonLoans.push({...currentLoanData, id: Date.now()});
        
        // Update comparison UI
        updateComparisonUI();
    }
    
    function removeLoanComparison(loanId) {
        comparisonLoans = comparisonLoans.filter(loan => loan.id !== loanId);
        updateComparisonUI();
    }
    
    function updateComparisonUI() {
        // Clear comparison grid
        comparisonGrid.innerHTML = '';
        
        // Check if we have loans to compare
        if (comparisonLoans.length === 0) {
            comparisonGrid.innerHTML = `
                <div class="empty-comparison">
                    <i class="ri-bank-line"></i>
                    <p>Add a loan using the button above to start comparing options</p>
                </div>
            `;
            comparisonChartContainer.style.display = 'none';
            return;
        }
        
        // Add loan comparison cards
        comparisonLoans.forEach(loan => {
            const card = document.createElement('div');
            card.className = 'comparison-card';
            
            // Format term display
            const termDisplay = loan.termUnit === 'years' ? 
                `${loan.loanTerm} year${loan.loanTerm !== 1 ? 's' : ''}` : 
                `${loan.loanTerm} month${loan.loanTerm !== 1 ? 's' : ''}`;
            
            card.innerHTML = `
                <div class="comparison-card-header">
                    <div class="comparison-card-title">Loan ${formatCurrency(loan.loanAmount)}</div>
                    <div class="comparison-card-actions">
                        <button class="remove-loan" data-id="${loan.id}" title="Remove loan">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Interest Rate:</div>
                    <div class="comparison-detail-value">${loan.interestRate}%</div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Term:</div>
                    <div class="comparison-detail-value">${termDisplay}</div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Payment:</div>
                    <div class="comparison-detail-value">${formatCurrency(loan.regularPayment)}</div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Total Interest:</div>
                    <div class="comparison-detail-value">${formatCurrency(loan.totalInterest)}</div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Total Cost:</div>
                    <div class="comparison-detail-value">${formatCurrency(loan.loanAmount + loan.totalInterest)}</div>
                </div>
                <div class="comparison-detail">
                    <div class="comparison-detail-label">Payoff Date:</div>
                    <div class="comparison-detail-value">${formatDate(loan.finalPaymentDate)}</div>
                </div>
            `;
            
            comparisonGrid.appendChild(card);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-loan').forEach(button => {
            button.addEventListener('click', function() {
                const loanId = parseInt(this.getAttribute('data-id'));
                removeLoanComparison(loanId);
            });
        });
        
        // Show chart container
        comparisonChartContainer.style.display = 'block';
        
        // Update comparison chart
        const activeChartTab = document.querySelector('.chart-tab.active');
        const chartType = activeChartTab ? activeChartTab.getAttribute('data-chart') : 'monthly';
        updateComparisonChart(chartType);
    }
    
    function updateComparisonChart(chartType) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (comparisonChart) {
            comparisonChart.destroy();
        }
        
        // Prepare data based on chart type
        const labels = comparisonLoans.map(loan => `$${Math.round(loan.loanAmount).toLocaleString()}`);
        let data, title;
        
        switch (chartType) {
            case 'interest':
                data = comparisonLoans.map(loan => loan.totalInterest);
                title = 'Total Interest';
                break;
            case 'total':
                data = comparisonLoans.map(loan => loan.loanAmount + loan.totalInterest);
                title = 'Total Cost';
                break;
            default: // monthly
                data = comparisonLoans.map(loan => loan.regularPayment);
                title = 'Monthly Payment';
                break;
        }
        
        // Create new chart
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: [
                        'rgba(66, 133, 244, 0.7)',
                        'rgba(52, 168, 83, 0.7)',
                        'rgba(251, 188, 5, 0.7)'
                    ],
                    borderColor: [
                        'rgba(66, 133, 244, 1)',
                        'rgba(52, 168, 83, 1)',
                        'rgba(251, 188, 5, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            },
                            afterLabel: function(context) {
                                if (chartType === 'interest' || chartType === 'total') {
                                    const loan = comparisonLoans[context.dataIndex];
                                    return `Interest Rate: ${loan.interestRate}%`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Input handling functions
    function clearInputs() {
        loanAmount.value = '';
        interestRate.value = '';
        loanTerm.value = '';
        termUnit.value = 'years';
        paymentFrequency.value = 'monthly';
        extraPayment.value = '';
        startDate.valueAsDate = new Date();
        loanResultsSection.style.display = 'none';
        currentLoanData = null;
        amortizationSchedule = [];
    }
    
    function setupEnterKeyFunctionality() {
        loanAmount.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') interestRate.focus();
        });
        
        interestRate.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') loanTerm.focus();
        });
        
        loanTerm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateLoan();
        });
    }
    
    function setupFaqAccordions() {
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
    }
    
    // Helper functions
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
}); 