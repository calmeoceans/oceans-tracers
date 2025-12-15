// Main JavaScript for Ocean Tracers Net Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoadingScreen();
    initNavigation();
    initSmoothScrolling();
    initCounters();
    initContactForm();
    initWeb3Integration();
    initAdminPanel();
    initCurrentYear();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 300);
        }
        
        loadingProgress.style.width = `${progress}%`;
    }, 200);
}

// Navigation
function initNavigation() {
    const header = document.querySelector('.sticky-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Active navigation link
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interest = document.getElementById('interest').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !interest || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                successMessage.classList.remove('hidden');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }
}

// Web3 Integration
function initWeb3Integration() {
    const connectWalletBtn = document.getElementById('connect-wallet');
    const walletModal = document.getElementById('wallet-modal');
    const closeModal = document.querySelector('.close-modal');
    const metamaskBtn = document.getElementById('metamask-btn');
    const walletconnectBtn = document.getElementById('walletconnect-btn');
    const walletStatus = document.getElementById('wallet-status');
    const web3Status = document.getElementById('web3-status');
    const statusIndicator = web3Status.querySelector('.status-indicator');
    const statusText = web3Status.querySelector('span');
    
    // Check if Web3 is available
    let web3;
    
    // Open wallet modal
    connectWalletBtn.addEventListener('click', (e) => {
        e.preventDefault();
        walletModal.style.display = 'flex';
    });
    
    // Close wallet modal
    closeModal.addEventListener('click', () => {
        walletModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === walletModal) {
            walletModal.style.display = 'none';
        }
    });
    
    // MetaMask connection
    metamaskBtn.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                web3 = new Web3(window.ethereum);
                
                // Update UI
                statusIndicator.classList.remove('disconnected');
                statusIndicator.classList.add('connected');
                statusText.textContent = `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
                
                walletStatus.innerHTML = `<p style="color: green;">Successfully connected to MetaMask!</p>`;
                
                // Close modal after successful connection
                setTimeout(() => {
                    walletModal.style.display = 'none';
                }, 2000);
                
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
                walletStatus.innerHTML = `<p style="color: red;">Error connecting to MetaMask: ${error.message}</p>`;
            }
        } else {
            walletStatus.innerHTML = `<p style="color: red;">MetaMask is not installed. <a href="https://metamask.io/" target="_blank">Install MetaMask</a></p>`;
        }
    });
    
    // WalletConnect connection (simplified)
    walletconnectBtn.addEventListener('click', () => {
        walletStatus.innerHTML = `<p style="color: orange;">WalletConnect integration coming soon. Please use MetaMask for now.</p>`;
    });
}

// Admin Panel
function initAdminPanel() {
    const adminToggle = document.getElementById('admin-toggle');
    const adminPanel = document.getElementById('admin-panel');
    const closeAdmin = document.getElementById('close-admin');
    const saveContentBtn = document.getElementById('save-content');
    const resetContentBtn = document.getElementById('reset-content');
    const updateSanctuaryImageBtn = document.getElementById('update-sanctuary-image');
    const updateAuthorImageBtn = document.getElementById('update-author-image');
    
    // Toggle admin panel
    adminToggle.addEventListener('click', () => {
        adminPanel.classList.toggle('active');
        loadCurrentContent();
    });
    
    // Close admin panel
    closeAdmin.addEventListener('click', () => {
        adminPanel.classList.remove('active');
    });
    
    // Load current content into admin form
    function loadCurrentContent() {
        const heroTitle = document.querySelector('[data-editable="hero-title"]').textContent;
        const heroSubtitle = document.querySelector('[data-editable="hero-subtitle"]').textContent;
        
        document.getElementById('edit-hero-title').value = heroTitle;
        document.getElementById('edit-hero-subtitle').value = heroSubtitle;
    }
    
    // Save content changes
    saveContentBtn.addEventListener('click', () => {
        const heroTitle = document.getElementById('edit-hero-title').value;
        const heroSubtitle = document.getElementById('edit-hero-subtitle').value;
        
        // Update content on page
        document.querySelector('[data-editable="hero-title"]').textContent = heroTitle;
        document.querySelector('[data-editable="hero-subtitle"]').textContent = heroSubtitle;
        
        // Save to localStorage
        const contentData = {
            heroTitle,
            heroSubtitle
        };
        
        localStorage.setItem('oceanTracersContent', JSON.stringify(contentData));
        
        alert('Content saved successfully!');
    });
    
    // Reset content to default
    resetContentBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all content to default?')) {
            localStorage.removeItem('oceanTracersContent');
            location.reload();
        }
    });
    
    // Update sanctuary image
    updateSanctuaryImageBtn.addEventListener('click', () => {
        const imageUrl = document.getElementById('edit-sanctuary-image').value;
        if (imageUrl) {
            const sanctuaryImage = document.querySelector('#sanctuary-image img');
            sanctuaryImage.src = imageUrl;
            document.getElementById('edit-sanctuary-image').value = '';
            alert('Sanctuary image updated!');
        }
    });
    
    // Update author image
    updateAuthorImageBtn.addEventListener('click', () => {
        const imageUrl = document.getElementById('edit-author-image').value;
        if (imageUrl) {
            const authorImage = document.querySelector('#author-image-container img');
            authorImage.src = imageUrl;
            document.getElementById('edit-author-image').value = '';
            alert('Author image updated!');
        }
    });
    
    // Load saved content on page load
    const savedContent = localStorage.getItem('oceanTracersContent');
    if (savedContent) {
        const contentData = JSON.parse(savedContent);
        
        if (contentData.heroTitle) {
            document.querySelector('[data-editable="hero-title"]').textContent = contentData.heroTitle;
        }
        
        if (contentData.heroSubtitle) {
            document.querySelector('[data-editable="hero-subtitle"]').textContent = contentData.heroSubtitle;
        }
    }
}

// Set current year in footer
function initCurrentYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Add scroll animations
const scrollElements = document.querySelectorAll('.service-card, .stat-item, .tech-item');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

// Initialize scroll animations
window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Initial check on page load
handleScrollAnimation();