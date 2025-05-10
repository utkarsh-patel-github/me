// Unit conversion factors
const conversionFactors = {
    length: {
        km: { m: 1000, cm: 100000, mm: 1000000, mi: 0.621371, yd: 1093.61, ft: 3280.84, in: 39370.1 },
        m: { km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, ft: 3.28084, in: 39.3701 },
        cm: { km: 0.00001, m: 0.01, mm: 10, mi: 0.00000621371, yd: 0.0109361, ft: 0.0328084, in: 0.393701 },
        mm: { km: 0.000001, m: 0.001, cm: 0.1, mi: 0.000000621371, yd: 0.00109361, ft: 0.00328084, in: 0.0393701 },
        mi: { km: 1.60934, m: 1609.34, cm: 160934, mm: 1609340, yd: 1760, ft: 5280, in: 63360 },
        yd: { km: 0.0009144, m: 0.9144, cm: 91.44, mm: 914.4, mi: 0.000568182, ft: 3, in: 36 },
        ft: { km: 0.0003048, m: 0.3048, cm: 30.48, mm: 304.8, mi: 0.000189394, yd: 0.333333, in: 12 },
        in: { km: 0.0000254, m: 0.0254, cm: 2.54, mm: 25.4, mi: 0.0000157828, yd: 0.0277778, ft: 0.0833333 }
    },
    weight: {
        kg: { g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 },
        g: { kg: 0.001, mg: 1000, lb: 0.00220462, oz: 0.035274 },
        mg: { kg: 0.000001, g: 0.001, lb: 0.00000220462, oz: 0.000035274 },
        lb: { kg: 0.453592, g: 453.592, mg: 453592, oz: 16 },
        oz: { kg: 0.0283495, g: 28.3495, mg: 28349.5, lb: 0.0625 }
    },
    temperature: {
        c: { f: (c) => (c * 9/5) + 32, k: (c) => c + 273.15 },
        f: { c: (f) => (f - 32) * 5/9, k: (f) => (f - 32) * 5/9 + 273.15 },
        k: { c: (k) => k - 273.15, f: (k) => (k - 273.15) * 9/5 + 32 }
    },
    volume: {
        l: { ml: 1000, cl: 100, dl: 10, gal: 0.264172, qt: 1.05669, pt: 2.11338, cup: 4.22675 },
        ml: { l: 0.001, cl: 0.1, dl: 0.01, gal: 0.000264172, qt: 0.00105669, pt: 0.00211338, cup: 0.00422675 },
        cl: { l: 0.01, ml: 10, dl: 0.1, gal: 0.00264172, qt: 0.0105669, pt: 0.0211338, cup: 0.0422675 },
        dl: { l: 0.1, ml: 100, cl: 10, gal: 0.0264172, qt: 0.105669, pt: 0.211338, cup: 0.422675 },
        gal: { l: 3.78541, ml: 3785.41, cl: 378.541, dl: 37.8541, qt: 4, pt: 8, cup: 16 },
        qt: { l: 0.946353, ml: 946.353, cl: 94.6353, dl: 9.46353, gal: 0.25, pt: 2, cup: 4 },
        pt: { l: 0.473176, ml: 473.176, cl: 47.3176, dl: 4.73176, gal: 0.125, qt: 0.5, cup: 2 },
        cup: { l: 0.236588, ml: 236.588, cl: 23.6588, dl: 2.36588, gal: 0.0625, qt: 0.25, pt: 0.5 }
    }
};

// Unit options for each category
const unitOptions = {
    length: {
        km: 'Kilometers',
        m: 'Meters',
        cm: 'Centimeters',
        mm: 'Millimeters',
        mi: 'Miles',
        yd: 'Yards',
        ft: 'Feet',
        in: 'Inches'
    },
    weight: {
        kg: 'Kilograms',
        g: 'Grams',
        mg: 'Milligrams',
        lb: 'Pounds',
        oz: 'Ounces'
    },
    temperature: {
        c: 'Celsius',
        f: 'Fahrenheit',
        k: 'Kelvin'
    },
    volume: {
        l: 'Liters',
        ml: 'Milliliters',
        cl: 'Centiliters',
        dl: 'Deciliters',
        gal: 'Gallons',
        qt: 'Quarts',
        pt: 'Pints',
        cup: 'Cups'
    }
};

let currentCategory = 'length';

// Initialize the converter
function initConverter() {
    updateUnitOptions();
    setupEventListeners();
}

// Update unit options based on selected category
function updateUnitOptions() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const options = unitOptions[currentCategory];
    
    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // Add new options
    for (const [value, label] of Object.entries(options)) {
        fromUnit.add(new Option(label, value));
        toUnit.add(new Option(label, value));
    }
    
    // Set default values
    const defaultUnits = {
        length: { from: 'km', to: 'm' },
        weight: { from: 'kg', to: 'g' },
        temperature: { from: 'c', to: 'f' },
        volume: { from: 'l', to: 'ml' }
    };
    
    fromUnit.value = defaultUnits[currentCategory].from;
    toUnit.value = defaultUnits[currentCategory].to;
}

// Setup event listeners
function setupEventListeners() {
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            updateUnitOptions();
            convert();
        });
    });
}

// Convert units
function convert() {
    const fromValue = document.getElementById('fromValue').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const toValue = document.getElementById('toValue');
    
    if (!fromValue) {
        toValue.value = '';
        return;
    }
    
    let result;
    if (currentCategory === 'temperature') {
        // Special handling for temperature conversion
        const temp = parseFloat(fromValue);
        result = conversionFactors.temperature[fromUnit][toUnit](temp);
    } else {
        // Standard conversion for other units
        const factor = conversionFactors[currentCategory][fromUnit][toUnit];
        result = parseFloat(fromValue) * factor;
    }
    
    // Round to 6 decimal places to avoid floating point issues
    toValue.value = result.toFixed(6);
}

// Swap units
function swapUnits() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');
    
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    const tempValue = fromValue.value;
    fromValue.value = toValue.value;
    toValue.value = tempValue;
    
    convert();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initConverter); 