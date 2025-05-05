document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('text-input');
    const urlInput = document.getElementById('url-input');
    const fetchUrlBtn = document.getElementById('fetch-url-btn');
    const fileInput = document.getElementById('file-input');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const charNoSpaceCount = document.getElementById('char-no-space-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const sentenceCount = document.getElementById('sentence-count');
    const readingTime = document.getElementById('reading-time');
    const longestWord = document.getElementById('longest-word');
    const avgWordLength = document.getElementById('avg-word-length');
    const commonWord = document.getElementById('common-word');
    const keywordDensity = document.getElementById('keyword-density');
    const minWordLength = document.getElementById('min-word-length');
    const excludeCommon = document.getElementById('exclude-common');
    const wordCloud = document.getElementById('word-cloud');
    const frequencyTableBody = document.getElementById('frequency-table-body');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Common words to exclude from frequency analysis
    const commonWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
        'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ];
    
    // Current font size for the text input area
    let currentFontSize = 16; // in pixels
    
    // Initialize
    init();
    
    // Functions
    function init() {
        // Set up event listeners
        textInput.addEventListener('input', analyzeText);
        fetchUrlBtn.addEventListener('click', fetchUrlContent);
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fetchUrlContent();
            }
        });
        fileInput.addEventListener('change', handleFileUpload);
        fileDropArea.addEventListener('dragover', handleDragOver);
        fileDropArea.addEventListener('dragleave', handleDragLeave);
        fileDropArea.addEventListener('drop', handleFileDrop);
        fileDropArea.addEventListener('click', function() {
            fileInput.click();
        });
        removeFileBtn.addEventListener('click', removeFile);
        clearBtn.addEventListener('click', clearText);
        copyBtn.addEventListener('click', copyText);
        increaseFontBtn.addEventListener('click', increaseFontSize);
        decreaseFontBtn.addEventListener('click', decreaseFontSize);
        minWordLength.addEventListener('change', updateWordFrequency);
        excludeCommon.addEventListener('change', updateWordFrequency);
        
        // Set up tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // Setup FAQ accordions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        
        // Theme toggle if it exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.body.classList.add('dark-mode');
            }
        }
        
        // Mobile menu toggle if it exists
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                document.querySelector('.nav-links').classList.toggle('active');
            });
        }
    }
    
    function analyzeText() {
        const text = textInput.value;
        
        // Basic counts
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        const wordCount = words.length;
        const charCount = text.length;
        const charNoSpaceCount = text.replace(/\s+/g, '').length;
        const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0) : [];
        const paragraphCount = paragraphs.length;
        
        // Count sentences (this is simplified and might not be perfect)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;
        
        // Calculate reading time (average 225 words per minute)
        const readingTimeValue = Math.ceil(wordCount / 225);
        
        // Find longest word
        let longestWordValue = '-';
        let totalWordLength = 0;
        
        if (words.length > 0) {
            const cleanWords = words.map(word => word.replace(/[^\w\s]/gi, ''));
            longestWordValue = cleanWords.reduce((a, b) => a.length > b.length ? a : b);
            totalWordLength = cleanWords.reduce((sum, word) => sum + word.length, 0);
        }
        
        // Calculate average word length
        const avgWordLengthValue = words.length ? (totalWordLength / words.length).toFixed(1) : '0';
        
        // Update UI
        document.getElementById('word-count').textContent = wordCount;
        document.getElementById('char-count').textContent = charCount;
        document.getElementById('char-no-space-count').textContent = charNoSpaceCount;
        document.getElementById('paragraph-count').textContent = paragraphCount;
        document.getElementById('sentence-count').textContent = sentenceCount;
        document.getElementById('reading-time').textContent = readingTimeValue;
        document.getElementById('longest-word').textContent = longestWordValue;
        document.getElementById('avg-word-length').textContent = avgWordLengthValue;
        
        // Update word frequency
        updateWordFrequency();
    }
    
    function updateWordFrequency() {
        const text = textInput.value;
        if (!text.trim()) {
            // Show empty message
            frequencyTableBody.innerHTML = '<tr class="empty-table-message"><td colspan="3">Enter text to see word frequency analysis</td></tr>';
            wordCloud.innerHTML = 'Enter text to generate a word cloud';
            document.getElementById('common-word').textContent = '-';
            document.getElementById('keyword-density').textContent = '-';
            return;
        }
        
        // Get words and clean them
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const minLength = parseInt(minWordLength.value);
        const shouldExcludeCommon = excludeCommon.checked;
        
        // Filter words by minimum length and exclude common words if requested
        const filteredWords = words.filter(word => {
            return word.length >= minLength && 
                (!shouldExcludeCommon || !commonWords.includes(word));
        });
        
        // Count word frequency
        const wordFrequency = {};
        filteredWords.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        // Convert to array and sort by frequency
        const wordFrequencyArray = Object.entries(wordFrequency)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count);
        
        // Find most common word
        let mostCommonWord = '-';
        let keywordDensityValue = '-';
        
        if (wordFrequencyArray.length > 0) {
            mostCommonWord = `"${wordFrequencyArray[0].word}" (${wordFrequencyArray[0].count} times)`;
            keywordDensityValue = `${((wordFrequencyArray[0].count / words.length) * 100).toFixed(1)}%`;
        }
        
        document.getElementById('common-word').textContent = mostCommonWord;
        document.getElementById('keyword-density').textContent = keywordDensityValue;
        
        // Generate table
        generateFrequencyTable(wordFrequencyArray, words.length);
        
        // Generate word cloud
        generateWordCloud(wordFrequencyArray);
    }
    
    function generateFrequencyTable(wordFrequencyArray, totalWordCount) {
        // Clear table
        frequencyTableBody.innerHTML = '';
        
        // Use only top 10 words for the table
        const topWords = wordFrequencyArray.slice(0, 10);
        
        if (topWords.length === 0) {
            frequencyTableBody.innerHTML = '<tr class="empty-table-message"><td colspan="3">No words match your filter criteria</td></tr>';
            return;
        }
        
        // Add rows
        topWords.forEach(item => {
            const row = document.createElement('tr');
            
            const wordCell = document.createElement('td');
            wordCell.textContent = item.word;
            
            const countCell = document.createElement('td');
            countCell.textContent = item.count;
            
            const frequencyCell = document.createElement('td');
            const frequency = ((item.count / totalWordCount) * 100).toFixed(1);
            frequencyCell.textContent = `${frequency}%`;
            
            row.appendChild(wordCell);
            row.appendChild(countCell);
            row.appendChild(frequencyCell);
            
            frequencyTableBody.appendChild(row);
        });
    }
    
    function generateWordCloud(wordFrequencyArray) {
        // Simple word cloud representation
        wordCloud.innerHTML = '';
        
        if (wordFrequencyArray.length === 0) {
            wordCloud.innerHTML = 'No words match your filter criteria';
            return;
        }
        
        // Use top 20 words for the cloud
        const topWords = wordFrequencyArray.slice(0, 20);
        const maxFrequency = topWords[0].count;
        
        topWords.forEach(item => {
            const wordSpan = document.createElement('span');
            const size = Math.max(1, Math.min(4, (item.count / maxFrequency) * 4));
            const opacity = 0.6 + ((item.count / maxFrequency) * 0.4);
            
            wordSpan.textContent = item.word;
            wordSpan.style.fontSize = `${size}em`;
            wordSpan.style.opacity = opacity;
            wordSpan.style.margin = '0.25em';
            wordSpan.style.display = 'inline-block';
            
            wordCloud.appendChild(wordSpan);
        });
    }
    
    function fetchUrlContent() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Check if the URL is valid
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL including http:// or https://');
            return;
        }
        
        // Show loading message
        textInput.value = 'Loading content from URL...';
        switchTab('text-tab');
        
        // Normally we would use a server-side proxy to fetch the URL content
        // For this demo, we'll simulate the fetch
        setTimeout(() => {
            textInput.value = 'This is simulated content from a URL fetch.\n\nIn a real implementation, this would use a server-side proxy to fetch the actual content from the provided URL.\n\nThe content would then be analyzed just like text that was directly pasted into the editor.';
            analyzeText();
        }, 1500);
        
        // In a real implementation, we would use something like:
        /*
        fetch('/api/proxy-url?url=' + encodeURIComponent(url))
            .then(response => response.text())
            .then(html => {
                // Extract text content from HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.body.textContent || "";
                
                // Set the text content and analyze
                textInput.value = content;
                analyzeText();
            })
            .catch(error => {
                alert('Error fetching URL: ' + error.message);
                textInput.value = '';
            });
        */
    }
    
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.classList.remove('drag-over');
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function processFile(file) {
        // Check file type (simplified)
        const validFileTypes = ['.txt', '.doc', '.docx', '.rtf', '.md', '.html'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validFileTypes.includes(extension)) {
            alert('Unsupported file type. Please upload a text file.');
            return;
        }
        
        // Show file info
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'flex';
        
        // Read the file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            textInput.value = e.target.result;
            analyzeText();
            switchTab('text-tab');
        };
        
        reader.onerror = function() {
            alert('Error reading file');
        };
        
        reader.readAsText(file);
    }
    
    function removeFile() {
        fileInput.value = '';
        fileInfo.style.display = 'none';
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    function switchTab(tabId) {
        // Remove active class from all tabs
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to the selected tab
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }
    
    function clearText() {
        textInput.value = '';
        analyzeText();
        textInput.focus();
    }
    
    function copyText() {
        textInput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ri-check-line"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function increaseFontSize() {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            textInput.style.fontSize = `${currentFontSize}px`;
        }
    }
    
    function decreaseFontSize() {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            textInput.style.fontSize = `${currentFontSize}px`;
        }
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
});

// Create the word counter icon if it doesn't exist
(function() {
    window.addEventListener('load', function() {
        const img = document.querySelector('.header-image img');
        if (!img.complete || img.naturalHeight === 0) {
            // Create a placeholder SVG icon
            const iconSVG = `
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="12" fill="#F3F4F6"/>
                <rect x="20" y="20" width="80" height="80" rx="8" fill="#EEF2FF"/>
                <rect x="35" y="35" width="50" height="6" rx="3" fill="#C7D2FE"/>
                <rect x="35" y="47" width="35" height="6" rx="3" fill="#C7D2FE"/>
                <rect x="35" y="59" width="45" height="6" rx="3" fill="#C7D2FE"/>
                <rect x="35" y="71" width="25" height="6" rx="3" fill="#C7D2FE"/>
                <path d="M32 30L42 20H78L88 30V38H32V30Z" fill="#4F46E5"/>
                <path d="M40 24H80L86 30H34L40 24Z" fill="#818CF8"/>
                <circle cx="88" cy="80" r="16" fill="#4F46E5"/>
                <path d="M82 80H94" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M88 74V86" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            `;
            
            // Create a blob from the SVG
            const blob = new Blob([iconSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            // Set the image
            img.src = url;
            img.alt = "Word Counter";
        }
    });
})();
