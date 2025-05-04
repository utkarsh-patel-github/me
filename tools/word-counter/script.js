// Word Counter JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const countBtn = document.getElementById('count-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleTextBtn = document.getElementById('sample-text-btn');
    const wordCount = document.getElementById('word-count');
    const characterCount = document.getElementById('character-count');
    const characterNoSpaces = document.getElementById('character-no-spaces');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const avgWordLength = document.getElementById('avg-word-length');
    const wordsPerSentence = document.getElementById('words-per-sentence');
    const uniqueWords = document.getElementById('unique-words');
    const uniqueWordsPercent = document.getElementById('unique-words-percent');
    const wordDensityContainer = document.getElementById('word-density-container');
    const resultText = document.getElementById('result-text');
    const copyResultsBtn = document.querySelector('.share-results .copy-btn');
    const shareBtn = document.querySelector('.share-results .share-btn');
    const printBtn = document.querySelector('.share-results .print-btn');
    const reportBugBtn = document.getElementById('report-bug-btn');
    const reportBugModal = document.getElementById('report-bug-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const resultSection = document.getElementById('result-section');
    
    // Common words to exclude from word density
    const commonWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'is', 'are', 'was', 'were', 'am', 'has', 'had', 'been', 'when', 'where',
        'why', 'how', 'your', 'can', 'could', 'should', 'would', 'may', 'might',
        'must', 'shall', 'will', 'them', 'then', 'than', 'these', 'those', 'its',
        'any', 'some', 'many', 'few', 'most', 'our', 'us', 'him', 'himself',
        'herself', 'myself', 'yourself', 'yourselves', 'ourselves', 'themselves'
    ];
    
    // Sample text for demonstration
    const sampleText = `The quick brown fox jumps over the lazy dog. This sentence is often used because it contains all the letters in the English alphabet.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

This is a third paragraph with some different vocabulary to ensure a good mix of word density. The analysis of text provides insights about sentence structure, word frequency, and overall readability of content.`;
    
    // Event listeners
    textInput.addEventListener('input', debounce(analyzeText, 300));
    countBtn.addEventListener('click', function() {
        countBtn.classList.add('calculating');
        setTimeout(() => {
            analyzeText();
            countBtn.classList.remove('calculating');
        }, 300);
    });
    clearBtn.addEventListener('click', function() {
        clearBtn.classList.add('resetting');
        setTimeout(() => {
            clearText();
            clearBtn.classList.remove('resetting');
        }, 300);
    });
    sampleTextBtn.addEventListener('click', loadSampleText);
    
    // Copy, share, and print functionality
    if (copyResultsBtn) {
        copyResultsBtn.addEventListener('click', copyResults);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResults);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printResults);
    }
    
    // Info tabs functionality
    const infoTabs = document.querySelectorAll('.info-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    infoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            infoTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active');
        });
    });
    
    // Rating stars functionality
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingValue = document.getElementById('rating-value');
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            highlightStars(value);
        });
        
        star.addEventListener('mouseout', () => {
            const currentRating = parseInt(ratingValue.value) || 0;
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingValue.value = value;
            highlightStars(value);
        });
    });
    
    // Bug report modal functionality
    if (reportBugBtn && reportBugModal && closeModalBtn) {
        reportBugBtn.addEventListener('click', () => {
            reportBugModal.classList.add('active');
        });
        
        closeModalBtn.addEventListener('click', () => {
            reportBugModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        reportBugModal.addEventListener('click', (e) => {
            if (e.target === reportBugModal) {
                reportBugModal.classList.remove('active');
            }
        });
    }
    
    // Initialize with empty text
    if (textInput.value.trim() === '') {
        textInput.value = '';
        analyzeText();
    } else {
        analyzeText();
    }
    
    // Functions
    function analyzeText() {
        const text = textInput.value;
        
        // Basic counts
        const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
        const wordCountValue = words.length;
        const characterCountValue = text.length;
        const characterNoSpacesValue = text.replace(/\s+/g, '').length;
        const sentenceCountValue = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphCountValue = text.trim() === '' ? 0 : text.split(/\n{2,}/).filter(Boolean).length;
        
        // Reading time (average 225 words per minute)
        const readingTimeValue = Math.ceil(wordCountValue / 225);
        const readingTimeText = readingTimeValue <= 1 ? 'less than 1 min' : `${readingTimeValue} mins`;
        
        // Advanced statistics
        const avgWordLengthValue = wordCountValue === 0 ? 0 : (characterNoSpacesValue / wordCountValue).toFixed(1);
        
        // Word frequency analysis
        const wordFrequency = {};
        
        if (wordCountValue > 0) {
            words.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
                if (cleanWord && !commonWords.includes(cleanWord)) {
                    wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
                }
            });
        }
        
        // Words per sentence
        const wordsPerSentenceValue = sentenceCountValue === 0 ? 0 : (wordCountValue / sentenceCountValue).toFixed(1);
        
        // Unique words
        const uniqueWordsCount = Object.keys(wordFrequency).length;
        const uniqueWordsPercentValue = wordCountValue === 0 ? 0 : Math.round((uniqueWordsCount / wordCountValue) * 100);
        
        // Update the DOM with animation effects
        updateElementWithAnimation(wordCount, wordCountValue);
        updateElementWithAnimation(characterCount, characterCountValue);
        updateElementWithAnimation(characterNoSpaces, characterNoSpacesValue);
        updateElementWithAnimation(sentenceCount, sentenceCountValue);
        updateElementWithAnimation(paragraphCount, paragraphCountValue);
        updateElementWithAnimation(readingTime, readingTimeText);
        updateElementWithAnimation(avgWordLength, avgWordLengthValue);
        updateElementWithAnimation(wordsPerSentence, wordsPerSentenceValue);
        updateElementWithAnimation(uniqueWords, uniqueWordsCount);
        updateElementWithAnimation(uniqueWordsPercent, uniqueWordsPercentValue);
        
        // Update word density display
        updateWordDensity(wordFrequency);
        
        // Show result section with animation
        if (resultSection && !resultSection.classList.contains('results-visible')) {
            resultSection.classList.add('results-visible');
        }
        
        // Prepare result text for copying
        prepareResultTextForCopy(wordCountValue, characterCountValue, characterNoSpacesValue, 
            sentenceCountValue, paragraphCountValue, readingTimeText, avgWordLengthValue,
            wordsPerSentenceValue, uniqueWordsCount, uniqueWordsPercentValue);
    }
    
    function updateElementWithAnimation(element, value) {
        if (!element) return;
        
        // Add animation when value changes
        if (element.textContent !== String(value)) {
            element.classList.add('highlight-value');
            setTimeout(() => {
                element.classList.remove('highlight-value');
            }, 600);
        }
        
        element.textContent = value;
    }
    
    function updateWordDensity(wordFrequency) {
        if (!wordDensityContainer) return;
        
        // Sort words by frequency
        const sortedWords = Object.entries(wordFrequency)
            .filter(([word]) => word.length > 1) // Only include words with 2+ characters
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Show top 10 words
        
        // Find the max frequency for scaling bars
        const maxFrequency = sortedWords.length > 0 ? sortedWords[0][1] : 0;
        
        // Clear container
        wordDensityContainer.innerHTML = '';
        
        if (sortedWords.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Enter text to see word density';
            wordDensityContainer.appendChild(emptyState);
            return;
        }
        
        // Create density items
        sortedWords.forEach(([word, frequency], index) => {
            const densityItem = document.createElement('div');
            densityItem.className = 'density-item';
            
            const wordSpan = document.createElement('span');
            wordSpan.className = 'density-word';
            wordSpan.textContent = word;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'density-count';
            countSpan.textContent = frequency;
            
            const percentageBar = document.createElement('div');
            percentageBar.className = 'density-bar';
            
            // Create inner bar with appropriate width
            const innerBar = document.createElement('div');
            innerBar.style.width = `${(frequency / maxFrequency) * 100}%`;
            innerBar.style.height = '100%';
            innerBar.style.backgroundColor = getBarColor(index);
            percentageBar.appendChild(innerBar);
            
            densityItem.appendChild(wordSpan);
            densityItem.appendChild(countSpan);
            densityItem.appendChild(percentageBar);
            
            // Add delayed appearance animation
            setTimeout(() => {
                densityItem.style.opacity = '1';
                densityItem.style.transform = 'translateX(0)';
            }, index * 50);
            
            wordDensityContainer.appendChild(densityItem);
        });
    }
    
    function getBarColor(index) {
        const colors = [
            'var(--primary-blue)',
            'var(--primary-red)',
            'var(--primary-green)',
            'var(--primary-yellow)',
            'var(--primary-purple)',
            'var(--primary-teal)',
            'var(--primary-blue)',
            'var(--primary-red)',
            'var(--primary-green)',
            'var(--primary-yellow)'
        ];
        return colors[index % colors.length];
    }
    
    function prepareResultTextForCopy(words, chars, charsNoSpaces, sentences, paragraphs, readingTime, avgWordLength, wordsPerSentence, uniqueWordsCount, uniqueWordsPercent) {
        if (!resultText) return;
        
        resultText.value = 
`Word Count Results:
-----------------
Words: ${words}
Characters: ${chars}
Characters (no spaces): ${charsNoSpaces}
Sentences: ${sentences}
Paragraphs: ${paragraphs}
Reading Time: ${readingTime}
Average Word Length: ${avgWordLength} characters
Words per Sentence: ${wordsPerSentence}
Unique Words: ${uniqueWordsCount} (${uniqueWordsPercent}% of total)

Generated by Daily Tools Word Counter
https://dailytools.example.com/tools/word-counter/`;
    }
    
    function clearText() {
        textInput.value = '';
        analyzeText();
        textInput.focus();
    }
    
    function loadSampleText() {
        textInput.value = sampleText;
        analyzeText();
    }
    
    function copyResults() {
        if (!resultText) return;
        
        resultText.select();
        document.execCommand('copy');
        
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalText;
            }, 2000);
        }
    }
    
    function shareResults() {
        const title = 'Word Count Results';
        const text = `My text contains ${wordCount.textContent} words and ${characterCount.textContent} characters.`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(err => {
                console.error('Share failed:', err);
                fallbackShare();
            });
        } else {
            fallbackShare();
        }
        
        function fallbackShare() {
            const shareURL = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            window.open(shareURL, '_blank');
        }
    }
    
    function printResults() {
        const printContent = `
            <html>
            <head>
                <title>Word Count Results</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                    h1 { color: #4285f4; }
                    .section { margin-bottom: 20px; }
                    .result-item { margin-bottom: 10px; }
                    .label { font-weight: bold; }
                    .footer { margin-top: 40px; color: #777; font-size: 12px; text-align: center; }
                </style>
            </head>
            <body>
                <h1>Word Count Results</h1>
                <div class="section">
                    <div class="result-item"><span class="label">Words:</span> ${wordCount.textContent}</div>
                    <div class="result-item"><span class="label">Characters:</span> ${characterCount.textContent}</div>
                    <div class="result-item"><span class="label">Characters (no spaces):</span> ${characterNoSpaces.textContent}</div>
                    <div class="result-item"><span class="label">Sentences:</span> ${sentenceCount.textContent}</div>
                    <div class="result-item"><span class="label">Paragraphs:</span> ${paragraphCount.textContent}</div>
                    <div class="result-item"><span class="label">Reading Time:</span> ${readingTime.textContent}</div>
                    <div class="result-item"><span class="label">Average Word Length:</span> ${avgWordLength.textContent} characters</div>
                    <div class="result-item"><span class="label">Words per Sentence:</span> ${wordsPerSentence.textContent}</div>
                    <div class="result-item"><span class="label">Unique Words:</span> ${uniqueWords.textContent} (${uniqueWordsPercent.textContent}% of total)</div>
                </div>
                <div class="footer">
                    Generated by Daily Tools Word Counter<br>
                    https://dailytools.example.com/tools/word-counter/
                </div>
            </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
    
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            if (value <= rating) {
                star.classList.remove('ri-star-line');
                star.classList.add('ri-star-fill');
            } else {
                star.classList.remove('ri-star-fill');
                star.classList.add('ri-star-line');
            }
        });
    }
    
    function debounce(func, delay) {
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    
    // Initialize tooltips for social links
    const socialLinks = document.querySelectorAll('.social-btn');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const title = link.getAttribute('title');
            if (title) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                document.body.appendChild(tooltip);
                
                const linkRect = link.getBoundingClientRect();
                tooltip.style.left = `${linkRect.left + (linkRect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                tooltip.style.top = `${linkRect.top - tooltip.offsetHeight - 10}px`;
                
                link.addEventListener('mouseleave', () => {
                    tooltip.remove();
                }, { once: true });
            }
        });
    });
}); 