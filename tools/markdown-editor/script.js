// Check if required libraries are loaded
if (typeof marked === 'undefined') {
    console.error('Marked library is not loaded!');
    alert('Error: Marked library is not loaded. Please check your internet connection and refresh the page.');
}

if (typeof hljs === 'undefined') {
    console.error('Highlight.js library is not loaded!');
    alert('Error: Highlight.js library is not loaded. Please check your internet connection and refresh the page.');
}

// DOM Elements
const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('markdown-preview');
const toolbar = document.querySelector('.editor-toolbar');
const editorContainer = document.querySelector('.editor-container');

// Check if all required elements are found
if (!editor) {
    console.error('Markdown editor textarea not found!');
    alert('Error: Editor element not found. Please refresh the page.');
}

if (!preview) {
    console.error('Markdown preview element not found!');
    alert('Error: Preview element not found. Please refresh the page.');
}

if (!toolbar) {
    console.error('Editor toolbar not found!');
    alert('Error: Toolbar element not found. Please refresh the page.');
}

if (!editorContainer) {
    console.error('Editor container not found!');
    alert('Error: Editor container not found. Please refresh the page.');
}

// Initialize marked with highlight.js for code blocks
try {
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.warn('Error highlighting code:', err);
                    return code;
                }
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true,
        headerIds: false, // Disable header IDs for security
        mangle: false,    // Disable mangling for security
        sanitize: false   // We'll handle sanitization manually
    });
} catch (err) {
    console.error('Error initializing marked:', err);
    alert('Error initializing markdown parser. Please refresh the page.');
}

// Auto-resize textarea
function autoResizeTextarea() {
    try {
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
    } catch (err) {
        console.error('Error resizing textarea:', err);
    }
}

// Update preview
function updatePreview() {
    try {
        const markdown = editor.value;
        const html = marked.parse(markdown);
        preview.innerHTML = html; // Render HTML directly
        // Apply syntax highlighting to code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            try {
                hljs.highlightElement(block);
            } catch (err) {
                console.warn('Error highlighting code block:', err);
            }
        });
    } catch (err) {
        console.error('Error updating preview:', err);
        preview.innerHTML = '<div class="error">Error rendering preview. Please check your markdown syntax.</div>';
    }
}

// Save content to localStorage
function saveContent() {
    try {
        localStorage.setItem('markdown-content', editor.value);
    } catch (err) {
        console.error('Error saving content:', err);
        // If localStorage is full or disabled, show a warning
        alert('Warning: Could not save your content. Your browser\'s storage might be full or disabled.');
    }
}

// Load content from localStorage
function loadContent() {
    try {
        const savedContent = localStorage.getItem('markdown-content');
        if (savedContent) {
            editor.value = savedContent;
            updatePreview();
            autoResizeTextarea();
        }
    } catch (err) {
        console.error('Error loading content:', err);
    }
}

// Toolbar actions
const toolbarActions = {
    bold: () => insertText('**', '**'),
    italic: () => insertText('*', '*'),
    heading: () => insertText('# '),
    link: () => {
        const url = prompt('Enter URL:');
        if (url) {
            const text = getSelectedText() || 'link text';
            insertText(`[${text}](${url})`);
        }
    },
    image: () => {
        const url = prompt('Enter image URL:');
        if (url) {
            const alt = prompt('Enter alt text:') || '';
            insertText(`![${alt}](${url})`);
        }
    },
    'list-ul': () => insertText('- '),
    'list-ol': () => insertText('1. '),
    code: () => insertText('```\n', '\n```'),
    quote: () => insertText('> '),
    table: () => {
        const table = `| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |`;
        insertText(table);
    },
    'horizontal-rule': () => insertText('\n---\n'),
    'clear-format': () => {
        const text = getSelectedText();
        if (text) {
            const plainText = text.replace(/[*_`#>-]/g, '');
            insertText(plainText);
        }
    },
    download: () => {
        const content = editor.value;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    copy: () => {
        navigator.clipboard.writeText(editor.value)
            .then(() => {
                const btn = toolbar.querySelector('[data-action="copy"]');
                const originalTitle = btn.title;
                btn.title = 'Copied!';
                setTimeout(() => {
                    btn.title = originalTitle;
                }, 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    },
    fullscreen: () => {
        editorContainer.classList.toggle('fullscreen');
        const btn = toolbar.querySelector('[data-action="fullscreen"]');
        const icon = btn.querySelector('i');
        if (editorContainer.classList.contains('fullscreen')) {
            icon.classList.replace('ri-fullscreen-line', 'ri-fullscreen-exit-line');
        } else {
            icon.classList.replace('ri-fullscreen-exit-line', 'ri-fullscreen-line');
        }
    }
};

// Helper functions
function getSelectedText() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    return editor.value.substring(start, end);
}

function insertText(before, after = '') {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    const newText = before + selectedText + after;
    
    editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);
    editor.focus();
    
    // Set cursor position after inserted text
    const newCursorPos = start + before.length + selectedText.length + after.length;
    editor.setSelectionRange(newCursorPos, newCursorPos);
    
    updatePreview();
    saveContent();
}

// Event Listeners
editor.addEventListener('input', () => {
    try {
        updatePreview();
        autoResizeTextarea();
        saveContent();
    } catch (err) {
        console.error('Error handling input:', err);
    }
});

editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updatePreview();
        saveContent();
    }
});

toolbar.addEventListener('click', (e) => {
    const button = e.target.closest('.toolbar-btn');
    if (button) {
        const action = button.dataset.action;
        if (toolbarActions[action]) {
            toolbarActions[action]();
        }
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'b':
                e.preventDefault();
                toolbarActions.bold();
                break;
            case 'i':
                e.preventDefault();
                toolbarActions.italic();
                break;
            case 's':
                e.preventDefault();
                toolbarActions.download();
                break;
        }
    }
});

// Initialize with error handling
try {
    // Add a default welcome message if no content exists
    if (!localStorage.getItem('markdown-content')) {
        editor.value = `# Welcome to Markdown Editor!

This is a simple markdown editor with live preview. Try it out:

## Features
- **Bold** and *italic* text
- \`Code blocks\` with syntax highlighting
- [Links](https://example.com)
- And more!

\`\`\`javascript
// Try some code
function hello() {
    console.log("Hello, world!");
}
\`\`\`

> This is a blockquote

1. Numbered lists
2. Work too

- Bullet points
- Are supported

| Tables | Are | Cool |
|--------|-----|------|
| col 1  | col 2 | col 3 |
| row 2  | data | data |
`;
        updatePreview();
        saveContent();
    } else {
        loadContent();
    }
    autoResizeTextarea();
} catch (err) {
    console.error('Error during initialization:', err);
    alert('Error initializing editor. Please refresh the page.');
}

// Handle window resize
window.addEventListener('resize', autoResizeTextarea);

// Handle theme changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            // Update code block theme
            const theme = document.documentElement.getAttribute('data-theme');
            const link = document.querySelector('link[href*="highlight.js"]');
            const newTheme = theme === 'dark' ? 'github-dark' : 'github';
            link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${newTheme}.min.css`;
            
            // Re-highlight code blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

// Add a global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't show alert for every error, just log it
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't show alert for every rejection, just log it
});
