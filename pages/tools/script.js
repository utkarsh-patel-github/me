document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolsSearchInput = document.getElementById('tools-search-input');
    const toolsSearchBtn = document.getElementById('tools-search-btn');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const toolCards = document.querySelectorAll('.tool-card');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const comingSoonSection = document.querySelector('.coming-soon-section');
    
    // Current active category
    let activeCategory = 'all';
    
    // Add event listener to search button
    toolsSearchBtn.addEventListener('click', searchTools);
    
    // Add event listener to search input (search on Enter key)
    toolsSearchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchTools();
        }
    });
    
    // Add event listeners to category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update active category
            activeCategory = this.getAttribute('data-category');
            
            // Filter tools by category
            filterTools();
        });
    });
    
    // Add event listeners to pagination buttons
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active') && !this.classList.contains('next')) {
                // Remove active class from all pagination buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real application, this would load the next page of tools
                // For demo purposes, we'll just scroll to the top of the tools section
                document.querySelector('.tools-list').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Search tools function
    function searchTools() {
        const searchTerm = toolsSearchInput.value.toLowerCase().trim();
        
        // If search term is empty, just filter by category
        if (searchTerm === '') {
            filterTools();
            return;
        }
        
        // Hide the coming soon section during search
        if (comingSoonSection) {
            comingSoonSection.style.display = 'none';
        }
        
        // Loop through all tool cards
        let visibleCount = 0;
        toolCards.forEach(card => {
            // Get tool title and description
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            // Check if tool matches search term and category filter
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            // Show/hide tool card based on search and category
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        if (visibleCount === 0) {
            showNoResultsMessage();
        } else {
            hideNoResultsMessage();
        }
    }
    
    // Filter tools by category
    function filterTools() {
        // Loop through all tool cards
        let visibleCount = 0;
        toolCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            // Show/hide tool card based on category
            if (activeCategory === 'all' || category === activeCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide coming soon section based on active category
        if (comingSoonSection) {
            if (activeCategory === 'all') {
                comingSoonSection.style.display = 'block';
            } else {
                comingSoonSection.style.display = 'none';
            }
        }
        
        // Clear search input
        toolsSearchInput.value = '';
        
        // Hide no results message
        hideNoResultsMessage();
    }
    
    // Show no results message
    function showNoResultsMessage() {
        // Check if message already exists
        if (!document.querySelector('.no-results-message')) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <i class="ri-search-line"></i>
                <h3>No tools found</h3>
                <p>Try a different search term or category.</p>
            `;
            document.querySelector('.tools-list').appendChild(noResultsMessage);
        } else {
            document.querySelector('.no-results-message').style.display = 'flex';
        }
    }
    
    // Hide no results message
    function hideNoResultsMessage() {
        const noResultsMessage = document.querySelector('.no-results-message');
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
    
    // Initialize by calling filterTools to set up the initial view
    filterTools();
}); 