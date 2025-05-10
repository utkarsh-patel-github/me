document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Metric calculator elements
    const metricHeight = document.getElementById('metric-height');
    const metricWeight = document.getElementById('metric-weight');
    const metricAge = document.getElementById('metric-age');
    const metricCalculateBtn = document.getElementById('metric-calculate-btn');
    const metricClearBtn = document.getElementById('metric-clear-btn');
    const metricResultSection = document.getElementById('metric-result-section');
    const metricBmiValue = document.getElementById('metric-bmi-value');
    const metricBmiCategory = document.getElementById('metric-bmi-category');
    const metricBmiPointer = document.getElementById('metric-bmi-pointer');
    const metricWeightClassification = document.getElementById('metric-weight-classification');
    const metricIdealWeight = document.getElementById('metric-ideal-weight');
    const metricHealthRisk = document.getElementById('metric-health-risk');
    const metricRecommendation = document.getElementById('metric-recommendation');
    
    // Imperial calculator elements
    const imperialFeet = document.getElementById('imperial-feet');
    const imperialInches = document.getElementById('imperial-inches');
    const imperialWeight = document.getElementById('imperial-weight');
    const imperialAge = document.getElementById('imperial-age');
    const imperialCalculateBtn = document.getElementById('imperial-calculate-btn');
    const imperialClearBtn = document.getElementById('imperial-clear-btn');
    const imperialResultSection = document.getElementById('imperial-result-section');
    const imperialBmiValue = document.getElementById('imperial-bmi-value');
    const imperialBmiCategory = document.getElementById('imperial-bmi-category');
    const imperialBmiPointer = document.getElementById('imperial-bmi-pointer');
    const imperialWeightClassification = document.getElementById('imperial-weight-classification');
    const imperialIdealWeight = document.getElementById('imperial-ideal-weight');
    const imperialHealthRisk = document.getElementById('imperial-health-risk');
    const imperialRecommendation = document.getElementById('imperial-recommendation');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize
    init();
    
    function init() {
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
            });
        });
        
        // Metric calculator
        metricCalculateBtn.addEventListener('click', calculateMetricBMI);
        metricClearBtn.addEventListener('click', clearMetricInputs);
        
        // Imperial calculator
        imperialCalculateBtn.addEventListener('click', calculateImperialBMI);
        imperialClearBtn.addEventListener('click', clearImperialInputs);
        
        // Setup enter key functionality
        setupEnterKeyFunctionality();
        
        // Setup FAQ accordions
        setupFaqAccordions();
    }
    
    // Metric BMI calculation
    function calculateMetricBMI() {
        // Get input values
        const height = parseFloat(metricHeight.value);
        const weight = parseFloat(metricWeight.value);
        const age = parseInt(metricAge.value) || 30; // Default age if not provided
        const gender = document.querySelector('input[name="metric-gender"]:checked').value;
        
        // Validate inputs
        if (!height || !weight) {
            alert('Please enter both height and weight values');
            return;
        }
        
        if (height < 50 || height > 300) {
            alert('Please enter a valid height between 50cm and 300cm');
            return;
        }
        
        if (weight < 10 || weight > 500) {
            alert('Please enter a valid weight between 10kg and 500kg');
            return;
        }
        
        // Calculate BMI: weight (kg) / (height (m))²
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Display results
        showMetricResults(bmi, height, weight, age, gender);
    }
    
    function showMetricResults(bmi, height, weight, age, gender) {
        // Display BMI value (rounded to 1 decimal place)
        const roundedBmi = Math.round(bmi * 10) / 10;
        metricBmiValue.textContent = roundedBmi.toFixed(1);
        
        // Calculate BMI category and set colors
        const bmiCategory = getBmiCategory(bmi);
        metricBmiCategory.textContent = bmiCategory.name;
        metricBmiCategory.style.color = bmiCategory.color;
        
        // Set pointer position on the BMI scale (as percentage)
        const pointerPosition = calculatePointerPosition(bmi);
        metricBmiPointer.style.left = `${pointerPosition}%`;
        
        // Show weight classification
        metricWeightClassification.textContent = bmiCategory.classification;
        
        // Calculate and show ideal weight range
        const idealWeightRange = calculateIdealWeightRange(height);
        metricIdealWeight.textContent = `${idealWeightRange.min.toFixed(1)} - ${idealWeightRange.max.toFixed(1)} kg`;
        
        // Show health risk
        metricHealthRisk.textContent = bmiCategory.risk;
        
        // Show health recommendation
        metricRecommendation.className = 'recommendation ' + bmiCategory.class;
        metricRecommendation.innerHTML = getRecommendation(bmi, age, gender);
        
        // Show results section
        metricResultSection.style.display = 'block';
    }
    
    // Imperial BMI calculation
    function calculateImperialBMI() {
        // Get input values
        const feet = parseFloat(imperialFeet.value) || 0;
        const inches = parseFloat(imperialInches.value) || 0;
        const weight = parseFloat(imperialWeight.value);
        const age = parseInt(imperialAge.value) || 30; // Default age if not provided
        const gender = document.querySelector('input[name="imperial-gender"]:checked').value;
        
        // Validate inputs
        if ((!feet && !inches) || !weight) {
            alert('Please enter both height and weight values');
            return;
        }
        
        if (feet < 1 || feet > 8 || inches < 0 || inches > 11) {
            alert('Please enter a valid height');
            return;
        }
        
        if (weight < 20 || weight > 1000) {
            alert('Please enter a valid weight between 20lbs and 1000lbs');
            return;
        }
        
        // Calculate total height in inches
        const totalInches = (feet * 12) + inches;
        
        // Calculate BMI: (weight (lbs) / (height (in))²) * 703
        const bmi = (weight / (totalInches * totalInches)) * 703;
        
        // Convert to metric for some calculations
        const heightInCm = totalInches * 2.54;
        const weightInKg = weight * 0.453592;
        
        // Display results
        showImperialResults(bmi, heightInCm, weightInKg, totalInches, weight, age, gender);
    }
    
    function showImperialResults(bmi, heightInCm, weightInKg, heightInInches, weightInLbs, age, gender) {
        // Display BMI value (rounded to 1 decimal place)
        const roundedBmi = Math.round(bmi * 10) / 10;
        imperialBmiValue.textContent = roundedBmi.toFixed(1);
        
        // Calculate BMI category and set colors
        const bmiCategory = getBmiCategory(bmi);
        imperialBmiCategory.textContent = bmiCategory.name;
        imperialBmiCategory.style.color = bmiCategory.color;
        
        // Set pointer position on the BMI scale (as percentage)
        const pointerPosition = calculatePointerPosition(bmi);
        imperialBmiPointer.style.left = `${pointerPosition}%`;
        
        // Show weight classification
        imperialWeightClassification.textContent = bmiCategory.classification;
        
        // Calculate and show ideal weight range (in pounds)
        const idealWeightRange = calculateIdealWeightRange(heightInCm);
        const minLbs = Math.round(idealWeightRange.min * 2.20462);
        const maxLbs = Math.round(idealWeightRange.max * 2.20462);
        imperialIdealWeight.textContent = `${minLbs} - ${maxLbs} lbs`;
        
        // Show health risk
        imperialHealthRisk.textContent = bmiCategory.risk;
        
        // Show health recommendation
        imperialRecommendation.className = 'recommendation ' + bmiCategory.class;
        imperialRecommendation.innerHTML = getRecommendation(bmi, age, gender);
        
        // Show results section
        imperialResultSection.style.display = 'block';
    }
    
    // Helper Functions
    function getBmiCategory(bmi) {
        if (bmi < 16) {
            return {
                name: 'Severe Thinness',
                class: 'underweight',
                color: 'var(--underweight-color)',
                classification: 'Severely Underweight',
                risk: 'High risk of nutritional deficiency and health problems'
            };
        } else if (bmi < 17) {
            return {
                name: 'Moderate Thinness',
                class: 'underweight',
                color: 'var(--underweight-color)',
                classification: 'Moderately Underweight',
                risk: 'Moderate risk of nutritional deficiency'
            };
        } else if (bmi < 18.5) {
            return {
                name: 'Mild Thinness',
                class: 'underweight',
                color: 'var(--underweight-color)',
                classification: 'Mildly Underweight',
                risk: 'Mild risk of nutritional deficiency'
            };
        } else if (bmi < 25) {
            return {
                name: 'Normal',
                class: 'normal',
                color: 'var(--normal-color)',
                classification: 'Normal Weight',
                risk: 'Low risk (healthy range)'
            };
        } else if (bmi < 30) {
            return {
                name: 'Overweight',
                class: 'overweight',
                color: 'var(--overweight-color)',
                classification: 'Overweight',
                risk: 'Increased risk of developing health problems'
            };
        } else if (bmi < 35) {
            return {
                name: 'Obese Class I',
                class: 'obese',
                color: 'var(--obese-color)',
                classification: 'Obese Class I',
                risk: 'High risk of developing health problems'
            };
        } else if (bmi < 40) {
            return {
                name: 'Obese Class II',
                class: 'obese',
                color: 'var(--obese-color)',
                classification: 'Obese Class II',
                risk: 'Very high risk of developing health problems'
            };
        } else {
            return {
                name: 'Obese Class III',
                class: 'obese',
                color: 'var(--obese-color)',
                classification: 'Obese Class III',
                risk: 'Extremely high risk of developing health problems'
            };
        }
    }
    
    function calculatePointerPosition(bmi) {
        // Position the pointer along the BMI scale
        // BMI scale is from 0 to 40+ (positioning from 0% to 100%)
        let position;
        
        if (bmi < 10) {
            // Under 10 BMI (0-12.5% of scale)
            position = (bmi / 10) * 12.5;
        } else if (bmi < 18.5) {
            // 10-18.5 BMI (12.5-25% of scale)
            position = 12.5 + ((bmi - 10) / 8.5) * 12.5;
        } else if (bmi < 25) {
            // 18.5-25 BMI (25-50% of scale)
            position = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi < 30) {
            // 25-30 BMI (50-75% of scale)
            position = 50 + ((bmi - 25) / 5) * 25;
        } else if (bmi < 40) {
            // 30-40 BMI (75-100% of scale)
            position = 75 + ((bmi - 30) / 10) * 25;
        } else {
            // Over 40 BMI (100% of scale)
            position = 100;
        }
        
        return Math.min(Math.max(position, 0), 100); // Clamp between 0-100
    }
    
    function calculateIdealWeightRange(heightInCm) {
        // Calculate ideal weight range based on height for BMI 18.5-24.9
        const heightInMeters = heightInCm / 100;
        const minWeight = 18.5 * (heightInMeters * heightInMeters);
        const maxWeight = 24.9 * (heightInMeters * heightInMeters);
        
        return { min: minWeight, max: maxWeight };
    }
    
    function getRecommendation(bmi, age, gender) {
        let title, recommendation;
        
        if (bmi < 18.5) {
            title = 'Weight Gain Recommendation';
            recommendation = `Based on your BMI, you are underweight. Consider increasing your caloric intake with nutrient-dense foods. Focus on protein-rich foods, healthy fats, and complex carbohydrates. Consult with a healthcare provider or nutritionist for a personalized plan.`;
            
            if (age < 18) {
                recommendation += ` Since you're under 18, it's especially important to work with a healthcare provider to ensure proper growth and development.`;
            }
            
        } else if (bmi < 25) {
            title = 'Maintain Healthy Weight';
            recommendation = `Your BMI is within the normal range. Maintain your current weight with a balanced diet and regular physical activity. Aim for at least 150 minutes of moderate exercise per week.`;
            
            if (age > 50) {
                recommendation += ` As you age, focus on maintaining muscle mass through strength training exercises 2-3 times per week.`;
            }
            
        } else if (bmi < 30) {
            title = 'Weight Management Recommendation';
            recommendation = `Your BMI indicates you're overweight. Consider making lifestyle changes to gradually reduce your weight. Aim to reduce caloric intake moderately and increase physical activity. Even a 5-10% weight loss can have significant health benefits.`;
            
            if (gender === 'male') {
                recommendation += ` For men, focusing on reducing waist circumference to below 40 inches is beneficial for health.`;
            } else {
                recommendation += ` For women, focusing on reducing waist circumference to below 35 inches is beneficial for health.`;
            }
            
        } else {
            title = 'Weight Management Recommendation';
            recommendation = `Your BMI indicates obesity, which increases risk for various health conditions. It's advisable to consult with healthcare professionals for a comprehensive weight management plan. Setting realistic goals for gradual weight loss through diet modification and increased physical activity is recommended.`;
            
            if (bmi >= 35) {
                recommendation += ` At this BMI level, medical supervision is strongly recommended for weight loss strategies.`;
            }
        }
        
        return `<h3>${title}</h3><p>${recommendation}</p>`;
    }
    
    // Input handling functions
    function clearMetricInputs() {
        metricHeight.value = '';
        metricWeight.value = '';
        metricAge.value = '';
        document.querySelector('input[name="metric-gender"][value="male"]').checked = true;
        metricResultSection.style.display = 'none';
        metricHeight.focus();
    }
    
    function clearImperialInputs() {
        imperialFeet.value = '';
        imperialInches.value = '';
        imperialWeight.value = '';
        imperialAge.value = '';
        document.querySelector('input[name="imperial-gender"][value="male"]').checked = true;
        imperialResultSection.style.display = 'none';
        imperialFeet.focus();
    }
    
    function setupEnterKeyFunctionality() {
        // Metric inputs
        metricHeight.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') metricWeight.focus();
        });
        
        metricWeight.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') metricAge.focus();
        });
        
        metricAge.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateMetricBMI();
        });
        
        // Imperial inputs
        imperialFeet.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') imperialInches.focus();
        });
        
        imperialInches.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') imperialWeight.focus();
        });
        
        imperialWeight.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') imperialAge.focus();
        });
        
        imperialAge.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateImperialBMI();
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
}); 