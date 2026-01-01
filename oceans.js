// Main JavaScript for Ocean Tracers Net

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoadingScreen();
    initializeNavigation();
    initializeCounters();
    initializeContactForm();
    initializeWeb3();
    initializeAdminPanel();
    initializeModal();
    initializeScrollAnimations();
    setCurrentYear();
});

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        loadingProgress.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 500);
        }
    }, 200);
}

// Navigation
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });
    
    // Smooth scrolling for navigation links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    
                    // Scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav item
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                }
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to your server
            // For now, we'll simulate a successful submission
            
            // Show success message
            successMessage.classList.remove('hidden');
            successMessage.classList.add('fade-in');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('fade-in');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 300);
            }, 5000);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to your newsletter service
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
}

// Web3 Integration
function initializeWeb3() {
    const connectWalletBtn = document.getElementById('connect-wallet');
    const metamaskBtn = document.getElementById('metamask-btn');
    const walletConnectBtn = document.getElementById('walletconnect-btn');
    const walletModal = document.getElementById('wallet-modal');
    const closeModal = document.querySelector('.close-modal');
    const web3Status = document.getElementById('web3-status');
    
    let web3;
    
    // Check if Web3 is available
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        updateWeb3Status('detected');
    } else {
        updateWeb3Status('not-detected');
    }
    
    // Modal handlers
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            walletModal.style.display = 'flex';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            walletModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === walletModal) {
            walletModal.style.display = 'none';
        }
    });
    
    // Wallet connection handlers
    if (metamaskBtn) {
        metamaskBtn.addEventListener('click', async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    // Request account access
                    const accounts = await window.ethereum.request({ 
                        method: 'eth_requestAccounts' 
                    });
                    
                    // Update UI
                    updateWeb3Status('connected', accounts[0]);
                    walletModal.style.display = 'none';
                    
                    // Store connection in localStorage
                    localStorage.setItem('web3Connected', 'true');
                    localStorage.setItem('web3Account', accounts[0]);
                    
                } catch (error) {
                    console.error('Error connecting to MetaMask:', error);
                    updateWeb3Status('error', error.message);
                }
            } else {
                updateWeb3Status('not-detected');
            }
        });
    }
    
    if (walletConnectBtn) {
        walletConnectBtn.addEventListener('click', () => {
            // Implement WalletConnect integration here
            alert('WalletConnect integration would be implemented here');
        });
    }
    
    // Update Web3 status display
    function updateWeb3Status(status, account = null) {
        if (!web3Status) return;
        
        let html = '';
        
        switch(status) {
            case 'connected':
                html = `
                    <div class="status-indicator connected"></div>
                    <span>Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}</span>
                `;
                break;
            case 'detected':
                html = `
                    <div class="status-indicator disconnected"></div>
                    <span>Web3 Detected - Connect Wallet</span>
                `;
                break;
            case 'not-detected':
                html = `
                    <div class="status-indicator disconnected"></div>
                    <span>Web3 Not Detected</span>
                `;
                break;
            case 'error':
                html = `
                    <div class="status-indicator disconnected"></div>
                    <span>Connection Error</span>
                `;
                break;
        }
        
        web3Status.innerHTML = html;
    }
    
    // Check for existing connection on page load
    if (localStorage.getItem('web3Connected') === 'true') {
        const storedAccount = localStorage.getItem('web3Account');
        updateWeb3Status('connected', storedAccount);
    }
}

// Admin Panel
function initializeAdminPanel() {
    const adminToggle = document.getElementById('admin-toggle');
    const adminPanel = document.getElementById('admin-panel');
    const closeAdmin = document.getElementById('close-admin');
    const saveContentBtn = document.getElementById('save-content');
    const resetContentBtn = document.getElementById('reset-content');
    const updateSanctuaryImageBtn = document.getElementById('update-sanctuary-image');
    const updateAuthorImageBtn = document.getElementById('update-author-image');
    
    // Toggle admin panel
    if (adminToggle) {
        adminToggle.addEventListener('click', () => {
            adminPanel.classList.toggle('active');
            loadCurrentContent();
        });
    }
    
    if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    // Load current content into admin panel
    function loadCurrentContent() {
        // Load editable text content
        document.querySelectorAll('[data-editable]').forEach(element => {
            const target = element.getAttribute('data-editable');
            const input = document.querySelector(`[data-target="${target}"]`);
            if (input) {
                if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                    input.value = element.textContent;
                }
            }
        });
        
        // Load current image URLs
        const sanctuaryImg = document.getElementById('sanctuary-image');
        const authorImg = document.getElementById('author-image');
        
        if (sanctuaryImg) {
            document.getElementById('edit-sanctuary-image').value = sanctuaryImg.src;
        }
        
        if (authorImg) {
            document.getElementById('edit-author-image').value = authorImg.src;
        }
    }
    
    // Save content
    if (saveContentBtn) {
        saveContentBtn.addEventListener('click', () => {
            // Save text content
            document.querySelectorAll('[data-editable]').forEach(element => {
                const target = element.getAttribute('data-editable');
                const input = document.querySelector(`[data-target="${target}"]`);
                if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
                    element.textContent = input.value;
                    
                    // Save to localStorage
                    localStorage.setItem(`content_${target}`, input.value);
                }
            });
            
            // Save images
            const sanctuaryImageUrl = document.getElementById('edit-sanctuary-image').value;
            const authorImageUrl = document.getElementById('edit-author-image').value;
            
            const sanctuaryImg = document.getElementById('sanctuary-image');
            const authorImg = document.getElementById('author-image');
            
            if (sanctuaryImg && sanctuaryImageUrl) {
                sanctuaryImg.src = sanctuaryImageUrl;
                localStorage.setItem('image_sanctuary', sanctuaryImageUrl);
            }
            
            if (authorImg && authorImageUrl) {
                authorImg.src = authorImageUrl;
                localStorage.setItem('image_author', authorImageUrl);
            }
            
            // Show success message
            alert('Content saved successfully!');
        });
    }
    
    // Reset content
    if (resetContentBtn) {
        resetContentBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all content to default?')) {
                // Clear localStorage
                localStorage.clear();
                
                // Reload page to show default content
                location.reload();
            }
        });
    }
    
    // Update images
    if (updateSanctuaryImageBtn) {
        updateSanctuaryImageBtn.addEventListener('click', () => {
            const url = document.getElementById('edit-sanctuary-image').value;
            const img = document.getElementById('sanctuary-image');
            if (img && url) {
                img.src = url;
                localStorage.setItem('image_sanctuary', url);
            }
        });
    }
    
    if (updateAuthorImageBtn) {
        updateAuthorImageBtn.addEventListener('click', () => {
            const url = document.getElementById('edit-author-image').value;
            const img = document.getElementById('author-image');
            if (img && url) {
                img.src = url;
                localStorage.setItem('image_author', url);
            }
        });
    }
    
    // Load saved content on page load
    window.addEventListener('load', () => {
        // Load saved text content
        document.querySelectorAll('[data-editable]').forEach(element => {
            const key = element.getAttribute('data-editable');
            const saved = localStorage.getItem(`content_${key}`);
            if (saved) {
                element.textContent = saved;
            }
        });
        
        // Load saved images
        const savedSanctuaryImg = localStorage.getItem('image_sanctuary');
        const savedAuthorImg = localStorage.getItem('image_author');
        
        if (savedSanctuaryImg) {
            const img = document.getElementById('sanctuary-image');
            if (img) img.src = savedSanctuaryImg;
        }
        
        if (savedAuthorImg) {
            const img = document.getElementById('author-image');
            if (img) img.src = savedAuthorImg;
        }
    });
}

// Modal System
function initializeModal() {
    const modals = document.querySelectorAll('.modal');
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .tech-item, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize animations on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});