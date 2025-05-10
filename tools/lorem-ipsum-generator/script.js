document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const typeSelect = document.getElementById('type-select');
    const countInput = document.getElementById('count-input');
    const wordsRadio = document.getElementById('words-radio');
    const sentencesRadio = document.getElementById('sentences-radio');
    const paragraphsRadio = document.getElementById('paragraphs-radio');
    const startWithLoremCheckbox = document.getElementById('start-with-lorem');
    const includeHtmlCheckbox = document.getElementById('include-html');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputText = document.getElementById('output-text');
    const downloadTxtBtn = document.getElementById('download-txt-btn');
    const downloadHtmlBtn = document.getElementById('download-html-btn');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');

    // Lorem Ipsum Text Database
    const loremIpsum = {
        lorem: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Nullam tincidunt libero vel nulla accumsan, eu scelerisque justo pellentesque.",
            "Donec quis justo et tellus commodo dictum.",
            "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
            "Fusce at metus ac odio scelerisque fermentum.",
            "Praesent vestibulum erat at justo ullamcorper, quis posuere magna cursus.",
            "Nulla facilisi. Aenean nec risus ac justo molestie tincidunt.",
            "Etiam congue magna eget luctus iaculis.",
            "Cras vitae enim ut mi ultrices lobortis nec nec magna.",
            "Integer eget risus suscipit, faucibus nisi non, varius ante.",
            "Suspendisse potenti. Morbi bibendum tortor eget libero lacinia efficitur.",
            "Curabitur non magna ut sem egestas tincidunt.",
            "Duis ac lorem mollis, facilisis sem vitae, molestie quam.",
            "Maecenas vel turpis vel ex rhoncus sodales.",
            "Phasellus auctor, risus vel efficitur mattis, odio lorem dapibus dui.",
            "Mauris eleifend magna vel nulla scelerisque, in ultricies metus porttitor.",
            "Quisque convallis augue nec magna volutpat, in bibendum arcu feugiat.",
            "Sed imperdiet ligula ac turpis cursus fermentum.",
            "Aenean eget accumsan dui, nec commodo orci.",
            "Aliquam at mauris non nisl semper tempus."
        ],
        cicero: [
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            "Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
            "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
            "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
            "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
            "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
            "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
            "Omnis voluptas assumenda est, omnis dolor repellendus.",
            "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
            "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
        ],
        pangram: [
            "The quick brown fox jumps over the lazy dog.",
            "Pack my box with five dozen liquor jugs.",
            "How vexingly quick daft zebras jump!",
            "Sphinx of black quartz, judge my vow.",
            "Jackdaws love my big sphinx of quartz.",
            "The five boxing wizards jump quickly.",
            "Amazingly few discotheques provide jukeboxes.",
            "Quick zephyrs blow, vexing daft Jim.",
            "Heavy boxes perform quick waltzes and jigs.",
            "Crazy Fredrick bought many very exquisite opal jewels.",
            "Jaded zombies acted quaintly but kept driving their oxen forward.",
            "The job requires extra pluck and zeal from every young wage earner.",
            "Waltz, bad nymph, for quick jigs vex.",
            "Bright vixens jump; dozy fowl quack.",
            "The jay, pig, fox, zebra and my wolves quack!"
        ]
    };

    // Words list for gibberish generation
    const gibberishWords = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", 
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", 
        "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
        "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", 
        "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", 
        "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", 
        "id", "est", "laborum"
    ];

    // Initialize with default values
    let currentFontSize = 16;
    updateFontSize(0);
    
    // Generate Lorem Ipsum text
    generateBtn.addEventListener('click', function() {
        generateLoremIpsum();
    });
    
    // Reset form
    resetBtn.addEventListener('click', function() {
        typeSelect.value = 'lorem';
        countInput.value = '5';
        sentencesRadio.checked = true;
        startWithLoremCheckbox.checked = true;
        includeHtmlCheckbox.checked = false;
        generateLoremIpsum();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        copyToClipboard();
    });

    // Download as TXT
    downloadTxtBtn.addEventListener('click', function() {
        downloadText('txt');
    });

    // Download as HTML
    downloadHtmlBtn.addEventListener('click', function() {
        downloadText('html');
    });

    // Font size controls
    increaseFontBtn.addEventListener('click', function() {
        updateFontSize(1);
    });

    decreaseFontBtn.addEventListener('click', function() {
        updateFontSize(-1);
    });

    // Generate Lorem Ipsum text function
    function generateLoremIpsum() {
        const type = typeSelect.value;
        const count = parseInt(countInput.value) || 5;
        const unit = wordsRadio.checked ? 'words' : 
                     sentencesRadio.checked ? 'sentences' : 'paragraphs';
        const startWithLorem = startWithLoremCheckbox.checked;
        const includeHtml = includeHtmlCheckbox.checked;
        
        let result = '';
        
        switch (unit) {
            case 'words':
                result = generateWords(type, count, startWithLorem);
                break;
            case 'sentences':
                result = generateSentences(type, count, startWithLorem);
                break;
            case 'paragraphs':
                result = generateParagraphs(type, count, startWithLorem);
                break;
        }
        
        if (includeHtml && unit === 'paragraphs') {
            result = result.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
        } else if (includeHtml && unit === 'sentences') {
            result = result.split('. ').map(s => s.endsWith('.') ? s : s + '.').join('<br>\n');
        }
        
        outputText.textContent = result;
    }
    
    // Helper functions for text generation
    function generateWords(type, count, startWithLorem) {
        let words;
        
        if (type === 'gibberish') {
            words = getRandomWords(gibberishWords, count);
        } else {
            // For other types, extract words from sentences
            const sentences = getSentencesForType(type);
            
            // Extract all words from sentences
            let allWords = [];
            sentences.forEach(sentence => {
                // Remove periods, commas, etc. and split into words
                const sentenceWords = sentence.replace(/[.,!?;]/g, '').split(' ');
                allWords = allWords.concat(sentenceWords);
            });
            
            words = getRandomWords(allWords, count);
        }
        
        // Start with "Lorem ipsum" if selected and count is at least 2
        if (startWithLorem && count >= 2 && type !== 'pangram') {
            words[0] = 'Lorem';
            words[1] = 'ipsum';
        }
        
        return words.join(' ');
    }
    
    function generateSentences(type, count, startWithLorem) {
        const sentences = getSentencesForType(type);
        let result = [];
        
        // Start with "Lorem ipsum" sentence if selected
        if (startWithLorem && type !== 'pangram') {
            result.push(sentences[0]);
            count -= 1;
        }
        
        // Add random sentences
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            // Avoid duplicates when possible
            if (result.includes(sentences[randomIndex]) && sentences.length > count) {
                i--;
                continue;
            }
            result.push(sentences[randomIndex]);
        }
        
        return result.join(' ');
    }
    
    function generateParagraphs(type, count, startWithLorem) {
        let paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            // Generate a paragraph with 3-6 random sentences
            const sentenceCount = Math.floor(Math.random() * 4) + 3;
            const startWithLoremForThisParagraph = (i === 0) && startWithLorem;
            
            paragraphs.push(generateSentences(type, sentenceCount, startWithLoremForThisParagraph));
        }
        
        return paragraphs.join('\n\n');
    }
    
    function getSentencesForType(type) {
        if (type === 'gibberish') {
            // Generate random gibberish sentences
            return generateGibberishSentences(20);
        } else {
            return loremIpsum[type];
        }
    }
    
    function generateGibberishSentences(count) {
        let sentences = [];
        
        for (let i = 0; i < count; i++) {
            // Generate a sentence with 5-15 random words
            const wordCount = Math.floor(Math.random() * 11) + 5;
            const words = getRandomWords(gibberishWords, wordCount);
            
            // Capitalize first letter
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            
            sentences.push(words.join(' ') + '.');
        }
        
        return sentences;
    }
    
    function getRandomWords(wordPool, count) {
        let words = [];
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * wordPool.length);
            words.push(wordPool[randomIndex]);
        }
        
        return words;
    }
    
    // Utility functions
    function copyToClipboard() {
        const text = outputText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.classList.add('copy-animation');
            setTimeout(() => copyBtn.classList.remove('copy-animation'), 500);
        });
    }
    
    function downloadText(format) {
        let content = outputText.textContent;
        let filename = 'lorem-ipsum';
        let mimeType = 'text/plain';
        
        if (format === 'html') {
            // Wrap in HTML structure
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lorem Ipsum Text</title>
</head>
<body>
    ${includeHtmlCheckbox.checked ? content : `<p>${content}</p>`}
</body>
</html>`;
            filename += '.html';
            mimeType = 'text/html';
        } else {
            filename += '.txt';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
    function updateFontSize(change) {
        currentFontSize = Math.max(12, Math.min(24, currentFontSize + change));
        outputText.style.fontSize = `${currentFontSize}px`;
    }

    // Initialize with a default generation
    generateLoremIpsum();

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});
