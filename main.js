// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Initialize filter functionality
    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
            button.addEventListener('keydown', handleFilterKeydown);
        });
    }

    // Handle filter button clicks
    function handleFilterClick(event) {
        const clickedButton = event.target;
        const filterTag = clickedButton.getAttribute('data-tag');
        
        // Update button states
        updateButtonStates(clickedButton);
        
        // Filter projects
        filterProjects(filterTag);
    }

    // Handle keyboard navigation for filter buttons
    function handleFilterKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleFilterClick(event);
        }
    }

    // Update button active states and ARIA attributes
    function updateButtonStates(activeButton) {
        filterButtons.forEach(button => {
            if (button === activeButton) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // Filter project cards based on selected tag
    function filterProjects(filterTag) {
        projectCards.forEach(card => {
            const cardTags = card.getAttribute('data-tags');
            
            if (filterTag === 'all' || cardTags.includes(filterTag)) {
                showProject(card);
            } else {
                hideProject(card);
            }
        });

        // Announce filter change to screen readers
        announceFilterChange(filterTag);
    }

    // Show project card with animation
    function showProject(card) {
        card.classList.remove('hidden');
        card.style.display = 'block';
        card.removeAttribute('aria-hidden');
        
        // Re-enable focusable elements
        const focusableElements = card.querySelectorAll('a, button');
        focusableElements.forEach(el => el.removeAttribute('tabindex'));
        
        // Remove inert if it was set
        if ('inert' in HTMLElement.prototype) {
            card.inert = false;
        }
        
        // Trigger reflow for animation
        card.offsetHeight;
        
        // Fade in animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 10);
    }

    // Hide project card with animation
    function hideProject(card) {
        // Immediately remove from accessibility tree and tab order
        card.setAttribute('aria-hidden', 'true');
        const focusableElements = card.querySelectorAll('a, button');
        focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
        
        // Check if any element inside the card currently has focus
        if (card.contains(document.activeElement)) {
            // Move focus to the active filter button
            const activeFilterButton = document.querySelector('.filter-btn.active');
            if (activeFilterButton) {
                activeFilterButton.focus();
            }
        }
        
        // Use inert for robust accessibility removal if supported
        if ('inert' in HTMLElement.prototype) {
            card.inert = true;
        }
        
        // Start visual transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            card.style.display = 'none';
            card.classList.add('hidden');
        }, 300);
    }

    // Announce filter changes to screen readers
    function announceFilterChange(filterTag) {
        const visibleProjects = document.querySelectorAll('.project-card:not(.hidden)').length;
        const announcement = filterTag === 'all' 
            ? `Showing all ${visibleProjects} projects`
            : `Showing ${visibleProjects} ${filterTag} projects`;
        
        // Create or update the announcement element
        let announcer = document.getElementById('filter-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'filter-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = announcement;
    }

    // Smooth scrolling for navigation links
    function initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Contact form basic handling (placeholder)
    function initializeContactForm() {
        const contactForm = document.querySelector('#contact form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Basic form validation
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                
                if (!name || !email || !message) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Placeholder success message
                alert('Thank you for your message! This is a demo form - form submission functionality needs to be implemented.');
                
                // Reset form
                contactForm.reset();
            });
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Add focus management for better keyboard navigation
    function initializeFocusManagement() {
        // Skip to content link functionality
        const skipLink = document.querySelector('a[href="#main-content"]');
        if (skipLink) {
            skipLink.addEventListener('click', function(event) {
                event.preventDefault();
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    mainContent.addEventListener('blur', function() {
                        mainContent.removeAttribute('tabindex');
                    }, { once: true });
                }
            });
        }
    }

    // Initialize all functionality
    initializeFilters();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeFocusManagement();

    // Set initial filter state (All projects visible)
    filterProjects('all');
});

// Add some basic performance optimizations
window.addEventListener('load', function() {
    // Lazy load project images if any real images are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observe placeholder images for future enhancement
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});