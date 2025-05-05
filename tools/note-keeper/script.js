document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const notesList = document.getElementById('notes-list');
    const newNoteBtn = document.getElementById('new-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const exportNoteBtn = document.getElementById('export-note-btn');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteCategory = document.getElementById('note-category');
    const searchInput = document.getElementById('search-notes');
    const categoryFilters = document.querySelectorAll('.category');
    const lastSavedTime = document.getElementById('last-saved-time');
    const wordCount = document.getElementById('word-count');
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Modals
    const linkModal = document.getElementById('link-modal');
    const imageModal = document.getElementById('image-modal');
    const linkUrl = document.getElementById('link-url');
    const linkText = document.getElementById('link-text');
    const imageUrl = document.getElementById('image-url');
    const imageAlt = document.getElementById('image-alt');
    const insertLinkBtn = document.getElementById('insert-link-btn');
    const insertImageBtn = document.getElementById('insert-image-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // State
    let notes = [];
    let currentNoteId = null;
    let currentCategory = 'all';
    let autoSaveTimer = null;
    let lastRange = null; // Store selection range for link/image insertion
    let unsavedChanges = false;
    
    // Initialize notes from localStorage
    function initNotes() {
        try {
            const savedNotes = localStorage.getItem('notekeeper_notes');
            if (savedNotes) {
                notes = JSON.parse(savedNotes);
                updateCategoryCounts();
                renderNotesList();
            } else {
                // First time user - create welcome note
                const welcomeNote = {
                    id: generateId(),
                    title: 'Welcome to Note Keeper',
                    content: '<p>Welcome to Note Keeper! This is a simple note-taking app that helps you organize your thoughts and ideas.</p><p>Here are some tips to get started:</p><ul><li>Create a new note using the "New Note" button</li><li>Format your text using the toolbar above</li><li>Organize notes with categories</li><li>Search for notes using the search bar</li><li>Your notes are saved automatically</li></ul><p>Happy note-taking!</p>',
                    category: '',
                    created: new Date().toISOString(),
                    updated: new Date().toISOString()
                };
                notes.push(welcomeNote);
                saveNotesToStorage();
                updateCategoryCounts();
                renderNotesList();
                loadNote(welcomeNote.id);
            }
        } catch (error) {
            console.error('Error initializing notes:', error);
            showToast('Error loading notes. Starting with a clean slate.', 'error');
            notes = [];
            resetNoteEditor();
        }
    }
    
    // Generate unique ID for notes
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Save notes to localStorage
    function saveNotesToStorage() {
        try {
            localStorage.setItem('notekeeper_notes', JSON.stringify(notes));
            updateCategoryCounts();
        } catch (error) {
            console.error('Error saving notes to storage:', error);
            showToast('Error saving notes. Storage might be full.', 'error');
            
            // Check if localStorage is full
            if (error.name === 'QuotaExceededError') {
                showToast('Storage is full. Please export and delete some notes.', 'warning', 6000);
            }
        }
    }
    
    // Reset note editor
    function resetNoteEditor() {
        currentNoteId = null;
        noteTitle.value = '';
        noteContent.innerHTML = '';
        noteCategory.value = '';
        lastSavedTime.textContent = 'Not saved yet';
        updateWordCount();
        unsavedChanges = false;
    }
    
    // Update category counts
    function updateCategoryCounts() {
        // Reset all counts
        document.querySelectorAll('.note-count').forEach(count => {
            count.textContent = '0';
        });
        
        // Count by category
        let allCount = notes.length;
        let personalCount = notes.filter(note => note.category === 'personal').length;
        let workCount = notes.filter(note => note.category === 'work').length;
        let ideasCount = notes.filter(note => note.category === 'ideas').length;
        let todosCount = notes.filter(note => note.category === 'todos').length;
        
        // Update count elements
        document.querySelector('.category[data-category="all"] .note-count').textContent = allCount;
        document.querySelector('.category[data-category="personal"] .note-count').textContent = personalCount;
        document.querySelector('.category[data-category="work"] .note-count').textContent = workCount;
        document.querySelector('.category[data-category="ideas"] .note-count').textContent = ideasCount;
        document.querySelector('.category[data-category="todos"] .note-count').textContent = todosCount;
    }
    
    // Render notes list based on current filter and search
    function renderNotesList() {
        // Clear the list first
        while (notesList.firstChild) {
            notesList.removeChild(notesList.firstChild);
        }
        
        // Get filtered notes
        let filteredNotes = filterNotes();
        
        // Show empty state if no notes
        if (filteredNotes.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-notes';
            emptyState.innerHTML = `
                <i class="ri-sticky-note-line"></i>
                <p>${currentCategory === 'all' && searchInput.value === '' 
                    ? 'No notes yet. Click "New Note" to create one.' 
                    : 'No notes match your search or filter.'}
                </p>
            `;
            notesList.appendChild(emptyState);
            return;
        }
        
        // Sort notes by updated time (newest first)
        filteredNotes.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        
        // Create note items
        filteredNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            if (note.id === currentNoteId) {
                noteItem.classList.add('active');
            }
            
            // Create plain text preview from HTML content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            const preview = textContent.substr(0, 100) + (textContent.length > 100 ? '...' : '');
            
            // Format date to readable format
            const updatedDate = new Date(note.updated);
            const formattedDate = formatDate(updatedDate);
            
            noteItem.innerHTML = `
                <div class="note-item-header">
                    <h4 class="note-item-title">${note.title || 'Untitled Note'}</h4>
                    <span class="note-item-date">${formattedDate}</span>
                </div>
                <div class="note-item-preview">${preview}</div>
                ${note.category ? `
                <div class="note-item-category">
                    <i class="ri-price-tag-3-line"></i>
                    <span>${note.category}</span>
                </div>` : ''}
            `;
            
            // Add click event to open note
            noteItem.addEventListener('click', () => {
                if (currentNoteId !== note.id) {
                    saveCurrentNoteIfNeeded();
                    loadNote(note.id);
                }
            });
            
            notesList.appendChild(noteItem);
        });
    }
    
    // Format date in a user-friendly way
    function formatDate(date) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        if (date.toDateString() === now.toDateString()) {
            return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
                   date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    // Filter notes based on category and search
    function filterNotes() {
        return notes.filter(note => {
            // Filter by category
            const categoryMatch = currentCategory === 'all' || note.category === currentCategory;
            
            // Filter by search text
            const searchText = searchInput.value.toLowerCase();
            const titleMatch = note.title.toLowerCase().includes(searchText);
            
            // Create temporary div to parse HTML content for search
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const contentText = tempDiv.textContent || tempDiv.innerText;
            const contentMatch = contentText.toLowerCase().includes(searchText);
            
            return categoryMatch && (titleMatch || contentMatch || searchText === '');
        });
    }
    
    // Create a new note
    function createNewNote() {
        // Save current note if needed
        saveCurrentNoteIfNeeded();
        
        // Create new note object
        const newNote = {
            id: generateId(),
            title: '',
            content: '',
            category: '',
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Add to notes array
        notes.unshift(newNote);
        
        // Save notes
        saveNotesToStorage();
        
        // Load new note in editor
        loadNote(newNote.id);
        
        // Focus on title input
        noteTitle.focus();
    }
    
    // Save current note if there are unsaved changes
    function saveCurrentNoteIfNeeded() {
        if (currentNoteId && unsavedChanges) {
            saveNote(false); // Save without notification
        }
    }
    
    // Load a note into the editor
    function loadNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        currentNoteId = noteId;
        
        // Fill editor with note data
        noteTitle.value = note.title;
        noteContent.innerHTML = note.content;
        noteCategory.value = note.category;
        
        // Update last saved time
        const updatedDate = new Date(note.updated);
        lastSavedTime.textContent = 'Last saved: ' + formatDate(updatedDate);
        
        // Update word count
        updateWordCount();
        
        // Update active state in notes list
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`.note-item[data-id="${noteId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Reset unsaved changes flag
        unsavedChanges = false;
        
        // Update toolbar state
        updateToolbarState();
    }
    
    // Update toolbar buttons based on current selection
    function updateToolbarState() {
        // Get current selection
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        // Check for various formatting states
        toolbarButtons.forEach(button => {
            const command = button.dataset.command;
            
            // Special case for formatBlock commands
            if (command === 'formatBlock') {
                const blockType = button.dataset.value;
                const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;
                
                if (parentElement && parentElement.tagName && 
                    parentElement.tagName.toLowerCase() === blockType) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } 
            // Standard formatting commands
            else if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
    
    // Save the current note
    function saveNote(showNotification = true) {
        if (!currentNoteId) return;
        
        const noteToUpdate = notes.find(note => note.id === currentNoteId);
        if (!noteToUpdate) return;
        
        // Update note with current editor values
        noteToUpdate.title = noteTitle.value;
        noteToUpdate.content = noteContent.innerHTML;
        noteToUpdate.category = noteCategory.value;
        noteToUpdate.updated = new Date().toISOString();
        
        // Save to localStorage
        saveNotesToStorage();
        
        // Update last saved time
        const updatedDate = new Date(noteToUpdate.updated);
        lastSavedTime.textContent = 'Last saved: ' + formatDate(updatedDate);
        
        // Reset unsaved changes flag
        unsavedChanges = false;
        
        // Re-render notes list to reflect any changes
        renderNotesList();
        
        // Show notification if requested
        if (showNotification) {
            showToast('Note saved successfully!', 'success');
        }
    }
    
    // Delete the current note
    function deleteNote() {
        if (!currentNoteId) return;
        
        if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            // Find index of note to delete
            const noteIndex = notes.findIndex(note => note.id === currentNoteId);
            if (noteIndex === -1) return;
            
            // Remove note from array
            notes.splice(noteIndex, 1);
            
            // Save updated notes array
            saveNotesToStorage();
            
            // Show notification
            showToast('Note deleted successfully!', 'success');
            
            // If there are remaining notes, load the first one
            if (notes.length > 0) {
                loadNote(notes[0].id);
            } else {
                // Otherwise reset the editor
                resetNoteEditor();
            }
            
            // Re-render notes list
            renderNotesList();
        }
    }
    
    // Export the current note as a text file
    function exportNote() {
        if (!currentNoteId) return;
        
        const noteToExport = notes.find(note => note.id === currentNoteId);
        if (!noteToExport) return;
        
        // Create plain text version of the note content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = noteToExport.content;
        const textContent = tempDiv.textContent || tempDiv.innerText;
        
        // Format the text content
        const title = noteToExport.title || 'Untitled Note';
        const category = noteToExport.category ? `Category: ${noteToExport.category}` : '';
        const created = `Created: ${new Date(noteToExport.created).toLocaleString()}`;
        const updated = `Last updated: ${new Date(noteToExport.updated).toLocaleString()}`;
        
        const exportContent = 
            `${title}\n` +
            `${category ? category + '\n' : ''}` +
            `${created}\n` +
            `${updated}\n\n` +
            `${textContent}`;
        
        // Create download link
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('Note exported successfully!', 'success');
    }
    
    // Reset auto-save timer
    function resetAutoSaveTimer() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            if (currentNoteId && unsavedChanges) {
                saveNote(false); // Save without notification
            }
        }, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    // Update word count
    function updateWordCount() {
        const text = noteContent.textContent || noteContent.innerText;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words === 1 ? '1 word' : `${words} words`;
    }
    
    // Execute toolbar commands
    function executeCommand(command, value = null) {
        if (command === 'link') {
            showLinkModal();
            return;
        }
        
        if (command === 'image') {
            showImageModal();
            return;
        }
        
        document.execCommand(command, false, value);
        updateToolbarState();
        unsavedChanges = true;
        resetAutoSaveTimer();
    }
    
    // Show link modal and save current selection
    function showLinkModal() {
        saveSelection();
        
        // Clear previous values
        linkUrl.value = '';
        linkText.value = '';
        
        // Get selected text for link text
        const selection = window.getSelection();
        if (selection.toString()) {
            linkText.value = selection.toString();
        }
        
        // Show modal
        linkModal.classList.add('visible');
        linkUrl.focus();
    }
    
    // Show image modal and save current selection
    function showImageModal() {
        saveSelection();
        
        // Clear previous values
        imageUrl.value = '';
        imageAlt.value = '';
        
        // Show modal
        imageModal.classList.add('visible');
        imageUrl.focus();
    }
    
    // Save current selection range
    function saveSelection() {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                lastRange = sel.getRangeAt(0);
            }
        }
    }
    
    // Restore saved selection range
    function restoreSelection() {
        if (lastRange) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(lastRange);
            }
        }
    }
    
    // Insert link from modal
    function insertLink() {
        const url = linkUrl.value.trim();
        let text = linkText.value.trim();
        
        if (!url) {
            linkUrl.classList.add('input-error');
            setTimeout(() => {
                linkUrl.classList.remove('input-error');
            }, 1000);
            return;
        }
        
        // Default to URL if no text is provided
        if (!text) {
            text = url;
        }
        
        // Restore selection
        restoreSelection();
        
        // Insert link
        let urlToInsert = url;
        
        // Add https:// if missing and not a relative link
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
            urlToInsert = 'https://' + url;
        }
        
        // If there's a selection, overwrite it with the link
        const selection = window.getSelection();
        if (selection.toString()) {
            document.execCommand('insertHTML', false, 
                `<a href="${urlToInsert}" target="_blank">${selection.toString()}</a>`);
        } else {
            document.execCommand('insertHTML', false, 
                `<a href="${urlToInsert}" target="_blank">${text}</a>`);
        }
        
        // Close modal
        linkModal.classList.remove('visible');
        
        // Mark content as changed
        unsavedChanges = true;
        resetAutoSaveTimer();
    }
    
    // Insert image from modal
    function insertImage() {
        const url = imageUrl.value.trim();
        const alt = imageAlt.value.trim();
        
        if (!url) {
            imageUrl.classList.add('input-error');
            setTimeout(() => {
                imageUrl.classList.remove('input-error');
            }, 1000);
            return;
        }
        
        // Restore selection
        restoreSelection();
        
        // Insert image
        document.execCommand('insertHTML', false, 
            `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;">`);
        
        // Close modal
        imageModal.classList.remove('visible');
        
        // Mark content as changed
        unsavedChanges = true;
        resetAutoSaveTimer();
    }
    
    // Show toast notification
    function showToast(message, type = 'info', duration = 3000) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast container styles if not already in CSS
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .toast {
                    background-color: #333;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 4px;
                    margin-top: 10px;
                    max-width: 300px;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    animation: slide-in 0.3s ease-out forwards;
                }
                
                .toast.success {
                    background-color: #2a9d8f;
                }
                
                .toast.error {
                    background-color: #e63946;
                }
                
                .toast.warning {
                    background-color: #f9c74f;
                    color: #333;
                }
                
                .toast i {
                    margin-right: 8px;
                    font-size: 18px;
                }
                
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fade-out {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add icon based on type
        let icon;
        switch (type) {
            case 'success':
                icon = 'ri-check-line';
                break;
            case 'error':
                icon = 'ri-error-warning-line';
                break;
            case 'warning':
                icon = 'ri-alert-line';
                break;
            default:
                icon = 'ri-information-line';
        }
        
        toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'fade-out 0.3s ease-out forwards';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, duration);
    }
    
    // Handle FAQ toggle
    function toggleFAQ(e) {
        const faqItem = e.currentTarget.closest('.faq-item');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle clicked item
        faqItem.classList.toggle('active');
    }
    
    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Check storage limit and warn if getting close
    function checkStorageLimit() {
        try {
            const dataSize = JSON.stringify(notes).length;
            const estimatedUsage = dataSize / (5 * 1024 * 1024); // Assuming 5MB limit
            
            if (estimatedUsage > 0.8) {
                showToast('Warning: You are using 80% of available storage. Consider exporting and deleting older notes.', 'warning', 6000);
            }
        } catch (error) {
            console.error('Error checking storage limit:', error);
        }
    }
    
    // Event Listeners
    
    // New note button
    newNoteBtn.addEventListener('click', createNewNote);
    
    // Save note button
    saveNoteBtn.addEventListener('click', () => saveNote(true));
    
    // Delete note button
    deleteNoteBtn.addEventListener('click', deleteNote);
    
    // Export note button
    exportNoteBtn.addEventListener('click', exportNote);
    
    // Note content changes
    noteContent.addEventListener('input', () => {
        unsavedChanges = true;
        resetAutoSaveTimer();
        updateWordCount();
    });
    
    // Note title changes
    noteTitle.addEventListener('input', () => {
        unsavedChanges = true;
        resetAutoSaveTimer();
    });
    
    // Category changes
    noteCategory.addEventListener('change', () => {
        unsavedChanges = true;
        resetAutoSaveTimer();
    });
    
    // Search input
    searchInput.addEventListener('input', debounce(() => {
        renderNotesList();
    }, 300));
    
    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active category
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            // Set current category
            currentCategory = filter.dataset.category;
            
            // Re-render notes list
            renderNotesList();
        });
    });
    
    // Toolbar buttons
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            const value = button.dataset.value || null;
            executeCommand(command, value);
        });
    });
    
    // Selection change in editor to update toolbar state
    noteContent.addEventListener('mouseup', updateToolbarState);
    noteContent.addEventListener('keyup', updateToolbarState);
    
    // Insert link button
    insertLinkBtn.addEventListener('click', insertLink);
    
    // Insert image button
    insertImageBtn.addEventListener('click', insertImage);
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            linkModal.classList.remove('visible');
            imageModal.classList.remove('visible');
        });
    });
    
    // Enter key in modals
    linkUrl.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            insertLink();
        }
    });
    
    imageUrl.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            insertImage();
        }
    });
    
    // FAQ toggles
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', toggleFAQ);
    });
    
    // Before unload event to warn about unsaved changes
    window.addEventListener('beforeunload', e => {
        if (unsavedChanges) {
            // Save automatically before leaving
            saveCurrentNoteIfNeeded();
            
            // Modern browsers require returnValue to be set
            const message = 'You have unsaved changes. Are you sure you want to leave?';
            e.returnValue = message;
            return message;
        }
    });
    
    // Initialize the app
    initNotes();
    
    // Do a storage limit check after init
    checkStorageLimit();
}); 