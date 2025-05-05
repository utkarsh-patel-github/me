document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolsSearchInput = document.getElementById('tools-search-input');
    const toolsSearchBtn = document.getElementById('tools-search-btn');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const toolCards = document.querySelectorAll('.tool-card');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
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
        
        // Loop through all tool cards
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
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Filter tools by category
    function filterTools() {
        // Loop through all tool cards
        toolCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            // Show/hide tool card based on category
            if (activeCategory === 'all' || category === activeCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Clear search input
        toolsSearchInput.value = '';
    }
}); 