// API endpoint for currency conversion
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// Cache for exchange rates
let exchangeRates = {};
let lastUpdateTime = null;

// Initialize the converter
async function initConverter() {
    await updateExchangeRates();
    setupEventListeners();
    updateLastUpdated();
}

// Fetch exchange rates from API
async function updateExchangeRates() {
    try {
        const response = await fetch(API_URL + 'USD');
        const data = await response.json();
        exchangeRates = data.rates;
        lastUpdateTime = new Date();
        updateLastUpdated();
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to some default rates if API fails
        exchangeRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.0,
            AUD: 1.35,
            CAD: 1.25,
            CHF: 0.92,
            CNY: 6.45,
            INR: 75.0
        };
    }
}

// Update last updated time display
function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdateTime) {
        lastUpdatedElement.textContent = lastUpdateTime.toLocaleString();
    } else {
        lastUpdatedElement.textContent = 'Not available';
    }
}

// Setup event listeners
function setupEventListeners() {
    const fromAmount = document.getElementById('fromAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    
    fromAmount.addEventListener('input', convert);
    fromCurrency.addEventListener('change', convert);
    toCurrency.addEventListener('change', convert);
}

// Convert currency
function convert() {
    const fromAmount = document.getElementById('fromAmount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const toAmount = document.getElementById('toAmount');
    const exchangeRateElement = document.getElementById('exchangeRate');
    
    if (!fromAmount) {
        toAmount.value = '';
        return;
    }
    
    // Convert to USD first (base currency)
    const amountInUSD = fromAmount / exchangeRates[fromCurrency];
    // Convert from USD to target currency
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];
    
    // Update the result
    toAmount.value = convertedAmount.toFixed(2);
    
    // Update exchange rate display
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    exchangeRateElement.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

// Swap currencies
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    
    const tempCurrency = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCurrency;
    
    const tempAmount = fromAmount.value;
    fromAmount.value = toAmount.value;
    toAmount.value = tempAmount;
    
    convert();
}

// Update exchange rates every hour
setInterval(updateExchangeRates, 3600000);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initConverter); 