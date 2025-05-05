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
            window.showToast('Error loading notes. Starting with a clean slate.', 'error');
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
            window.showToast('Error saving notes. Storage might be full.', 'error');
            
            // Check if localStorage is full
            if (error.name === 'QuotaExceededError') {
                window.showToast('Storage is full. Please export and delete some notes.', 'warning', 6000);
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
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    // Filter notes based on category and search
    function filterNotes() {
        let filtered = [...notes];
        
        // Apply category filter
        if (currentCategory !== 'all') {
            filtered = filtered.filter(note => note.category === currentCategory);
        }
        
        // Apply search filter if search input has value
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(note => {
                // Create plain text from HTML for search
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = note.content;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                
                return (
                    note.title.toLowerCase().includes(searchTerm) ||
                    textContent.toLowerCase().includes(searchTerm) ||
                    (note.category && note.category.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        return filtered;
    }
    
    // Create a new note
    function createNewNote() {
        // Save current note first if needed
        saveCurrentNoteIfNeeded();
        
        // Create new note
        const newNote = {
            id: generateId(),
            title: 'Untitled Note',
            content: '',
            category: '',
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        notes.unshift(newNote);
        saveNotesToStorage();
        renderNotesList();
        loadNote(newNote.id);
        
        // Focus on title input
        noteTitle.focus();
        
        // Show toast notification
        window.showToast('New note created', 'success');
    }
    
    // Save current note if it exists
    function saveCurrentNoteIfNeeded() {
        if (currentNoteId && unsavedChanges) {
            saveNote(false); // silent save
        }
    }
    
    // Load a note into the editor
    function loadNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        // Set current note ID
        currentNoteId = noteId;
        
        // Update fields
        noteTitle.value = note.title;
        noteContent.innerHTML = note.content;
        noteCategory.value = note.category || '';
        
        // Update UI
        renderNotesList(); // Re-render to show active state
        updateWordCount();
        
        // Update last saved time
        const updatedDate = new Date(note.updated);
        lastSavedTime.textContent = 'Last saved: ' + formatDate(updatedDate);
        
        // Set auto-save timer
        resetAutoSaveTimer();
        
        // Reset unsavedChanges flag
        unsavedChanges = false;
        
        // Clear selection (fixes issues with text formatting)
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        
        // Highlight active toolbar buttons based on current selection/state
        updateToolbarState();
    }
    
    // Update toolbar buttons state based on current selection/format
    function updateToolbarState() {
        const commands = ['bold', 'italic', 'underline', 'strikeThrough', 
                         'justifyLeft', 'justifyCenter', 'justifyRight',
                         'insertUnorderedList', 'insertOrderedList'];
        
        commands.forEach(command => {
            const button = document.querySelector(`.toolbar-btn[data-command="${command}"]`);
            if (button) {
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
        
        const note = notes.find(n => n.id === currentNoteId);
        if (!note) return;
        
        try {
            // Update note data
            note.title = noteTitle.value || 'Untitled Note';
            note.content = noteContent.innerHTML;
            note.category = noteCategory.value;
            note.updated = new Date().toISOString();
            
            // Save to storage
            saveNotesToStorage();
            
            // Update UI
            renderNotesList();
            
            // Update last saved time
            const updatedDate = new Date(note.updated);
            lastSavedTime.textContent = 'Last saved: ' + formatDate(updatedDate);
            
            // Show toast notification if not silent save
            if (showNotification) {
                window.showToast('Note saved successfully', 'success');
            }
            
            // Reset unsavedChanges flag
            unsavedChanges = false;
            
            return true;
        } catch (error) {
            console.error('Error saving note:', error);
            if (showNotification) {
                window.showToast('Error saving note. Please try again.', 'error');
            }
            return false;
        }
    }
    
    // Delete the current note
    function deleteNote() {
        if (!currentNoteId) return;
        
        if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            try {
                // Find note index
                const noteIndex = notes.findIndex(n => n.id === currentNoteId);
                if (noteIndex === -1) return;
                
                // Store note for potential undo
                const deletedNote = notes[noteIndex];
                
                // Remove note
                notes.splice(noteIndex, 1);
                saveNotesToStorage();
                
                // Reset current note
                resetNoteEditor();
                
                // Update UI
                renderNotesList();
                
                // Show toast notification with undo option
                const toastMsg = document.createElement('div');
                toastMsg.innerHTML = `Note deleted <span id="undo-delete" style="text-decoration: underline; cursor: pointer; margin-left: 8px;">Undo</span>`;
                window.showToast(toastMsg, 'success', 6000);
                
                // Add undo functionality
                setTimeout(() => {
                    const undoBtn = document.getElementById('undo-delete');
                    if (undoBtn) {
                        undoBtn.addEventListener('click', () => {
                            // Restore the deleted note
                            notes.push(deletedNote);
                            saveNotesToStorage();
                            renderNotesList();
                            loadNote(deletedNote.id);
                            window.showToast('Note restored', 'success');
                        });
                    }
                }, 100);
                
                // Load another note if available
                if (notes.length > 0) {
                    loadNote(notes[0].id);
                }
                
                return true;
            } catch (error) {
                console.error('Error deleting note:', error);
                window.showToast('Error deleting note. Please try again.', 'error');
                return false;
            }
        }
    }
    
    // Export the current note as a text file
    function exportNote() {
        if (!currentNoteId) return;
        
        const note = notes.find(n => n.id === currentNoteId);
        if (!note) return;
        
        try {
            // Create plain text from HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            
            // Create file content
            const fileContent = `# ${note.title}\n${note.category ? 'Category: ' + note.category + '\n' : ''}Updated: ${new Date(note.updated).toLocaleString()}\n\n${textContent}`;
            
            // Create blob
            const blob = new Blob([fileContent], { type: 'text/plain' });
            
            // Create download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Show toast notification
            window.showToast('Note exported successfully', 'success');
            return true;
        } catch (error) {
            console.error('Error exporting note:', error);
            window.showToast('Error exporting note. Please try again.', 'error');
            return false;
        }
    }
    
    // Reset auto-save timer
    function resetAutoSaveTimer() {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        
        autoSaveTimer = setTimeout(() => {
            if (unsavedChanges) {
                saveNote(false); // silent save
            }
        }, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    // Update word count
    function updateWordCount() {
        if (!noteContent) return;
        
        // Get text content from HTML
        const text = noteContent.textContent || noteContent.innerText || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        const chars = text.length;
        
        wordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'} (${chars} chars)`;
    }
    
    // Rich text editor functions
    function executeCommand(command, value = null) {
        document.execCommand(command, false, value);
        noteContent.focus();
        resetAutoSaveTimer();
        updateToolbarState();
        unsavedChanges = true;
    }
    
    // Show modal for link insertion
    function showLinkModal() {
        // Save current selection
        saveSelection();
        
        // Reset form
        linkUrl.value = '';
        linkText.value = '';
        
        // Get selected text for link text
        const sel = window.getSelection();
        if (sel.toString()) {
            linkText.value = sel.toString();
        }
        
        // Show modal
        linkModal.classList.add('visible');
        linkUrl.focus();
    }
    
    // Show modal for image insertion
    function showImageModal() {
        // Save current selection
        saveSelection();
        
        // Reset form
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
    
    // Insert link
    function insertLink() {
        const url = linkUrl.value.trim();
        let text = linkText.value.trim();
        
        if (!url) {
            window.showToast('Please enter a URL', 'error');
            return;
        }
        
        // Restore selection
        restoreSelection();
        
        // Use selected text if no text provided
        if (!text) {
            const sel = window.getSelection();
            if (sel.toString()) {
                text = sel.toString();
            } else {
                text = url;
            }
        }
        
        // Format URL if needed
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = 'https://' + url;
        }
        
        // Insert link
        executeCommand('insertHTML', `<a href="${formattedUrl}" target="_blank">${text}</a>`);
        
        // Close modal
        linkModal.classList.remove('visible');
        
        // Set unsaved changes flag
        unsavedChanges = true;
    }
    
    // Insert image
    function insertImage() {
        const url = imageUrl.value.trim();
        const alt = imageAlt.value.trim();
        
        if (!url) {
            window.showToast('Please enter an image URL', 'error');
            return;
        }
        
        // Restore selection
        restoreSelection();
        
        // Insert image
        executeCommand('insertHTML', `<img src="${url}" alt="${alt}" />`);
        
        // Close modal
        imageModal.classList.remove('visible');
        
        // Set unsaved changes flag
        unsavedChanges = true;
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
        resetAutoSaveTimer();
        updateWordCount();
        updateToolbarState();
        unsavedChanges = true;
    });
    
    // Note content selection change
    noteContent.addEventListener('mouseup', updateToolbarState);
    noteContent.addEventListener('keyup', (e) => {
        // Only update on navigation keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
            updateToolbarState();
        }
    });
    
    // Note title changes
    noteTitle.addEventListener('input', () => {
        resetAutoSaveTimer();
        unsavedChanges = true;
    });
    
    // Note category changes
    noteCategory.addEventListener('change', () => {
        resetAutoSaveTimer();
        unsavedChanges = true;
    });
    
    // Search input
    searchInput.addEventListener('input', debounce(() => {
        renderNotesList();
    }, 300));
    
    // Category filters
    categoryFilters.forEach(category => {
        category.addEventListener('click', () => {
            // Save current note before switching category
            saveCurrentNoteIfNeeded();
            
            // Update active state
            categoryFilters.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            // Update current category
            currentCategory = category.getAttribute('data-category');
            
            // Update notes list
            renderNotesList();
        });
    });
    
    // Toolbar buttons
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            
            // Special commands
            if (command === 'createLink') {
                showLinkModal();
                return;
            }
            
            if (command === 'insertImage') {
                showImageModal();
                return;
            }
            
            // Execute regular command
            executeCommand(command);
            
            // Set unsaved changes flag
            unsavedChanges = true;
        });
    });
    
    // Link modal events
    insertLinkBtn.addEventListener('click', insertLink);
    
    // Image modal events
    insertImageBtn.addEventListener('click', insertImage);
    
    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            linkModal.classList.remove('visible');
            imageModal.classList.remove('visible');
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === linkModal) {
            linkModal.classList.remove('visible');
        }
        if (e.target === imageModal) {
            imageModal.classList.remove('visible');
        }
    });
    
    // Key events for modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            linkModal.classList.remove('visible');
            imageModal.classList.remove('visible');
        }
        
        if (e.key === 'Enter') {
            if (linkModal.classList.contains('visible') && 
                (document.activeElement === linkUrl || 
                 document.activeElement === linkText)) {
                e.preventDefault();
                insertLink();
            }
            
            if (imageModal.classList.contains('visible') && 
                (document.activeElement === imageUrl || 
                 document.activeElement === imageAlt)) {
                e.preventDefault();
                insertImage();
            }
        }
    });
    
    // Confirm before leaving if unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (unsavedChanges) {
            // Save changes automatically before leaving
            saveCurrentNoteIfNeeded();
            
            // Most browsers will ignore this message and show their own standard message
            const message = 'You have unsaved changes. Do you want to leave without saving?';
            e.returnValue = message;
            return message;
        }
    });
    
    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Check storage limit
    function checkStorageLimit() {
        try {
            const storageUsed = localStorage.getItem('notekeeper_notes')?.length || 0;
            const storageLimit = 5 * 1024 * 1024; // 5MB (typical localStorage limit)
            const usagePercentage = (storageUsed / storageLimit) * 100;
            
            if (usagePercentage > 80) {
                window.showToast(`Storage usage: ${usagePercentage.toFixed(1)}%. Consider exporting some notes.`, 'warning', 5000);
            }
            return usagePercentage;
        } catch (error) {
            console.error('Error checking storage limit:', error);
            return 0;
        }
    }
    
    // Initialize the app
    initNotes();
    updateWordCount();
    
    // Check storage limit on init
    checkStorageLimit();
    
    // Check storage limit periodically
    setInterval(checkStorageLimit, 30 * 60 * 1000); // Every 30 minutes
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveNote(true);
        }
        
        // Ctrl/Cmd + N for new note
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewNote();
        }
    });
}); 