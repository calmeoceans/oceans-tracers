// =============================================
// OCEAN TRACERS NET - PREMIUM JAVASCRIPT
// Networks of Tomorrow - Market Dominance
// =============================================

class OceanTracersPremium {
    constructor() {
        this.init();
    }

    init() {
        // Set current year in footer
        this.setCurrentYear();
        
        // Initialize all components
        this.initLoadingScreen();
        this.initNavigation();
        this.initAnimations();
        this.initStatsCounting();
        this.initContactForm();
        this.initModals();
        this.initAdminPanel();
        this.initScrollEffects();
        this.initParticleNetwork();
        this.initWeb3();
    }

    // ========== LOADING SCREEN ==========
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading progress
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.triggerInitialAnimations();
            }, 500);
        }, 3000);
    }

    triggerInitialAnimations() {
        // Animate hero content
        gsap.from('.hero-badge', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power3.out"
        });

        gsap.from('.hero-title span', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.3
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            delay: 0.8
        });

        gsap.from('.hero-stats', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            delay: 1.1
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            delay: 1.4
        });

        gsap.from('.trust-badges', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            delay: 1.7
        });
    }

    // ========== NAVIGATION ==========
    initNavigation() {
        const header = document.querySelector('.sticky-header');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinksContainer = document.querySelector('.nav-links');

        // Sticky header
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Scroll to section
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Mobile menu toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ========== ANIMATIONS ==========
    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate sections on scroll
        const sections = document.querySelectorAll('.premium-section');
        
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Animate service cards
        const serviceCards = document.querySelectorAll('.service-card.premium');
        
        serviceCards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power3.out"
            });
        });

        // Animate value cards
        const valueCards = document.querySelectorAll('.value-card');
        
        valueCards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power3.out"
            });
        });

        // Animate tech features
        const techFeatures = document.querySelectorAll('.tech-feature');
        
        techFeatures.forEach((feature, index) => {
            gsap.from(feature, {
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: index * 0.2,
                ease: "power3.out"
            });
        });
    }

    // ========== STATS COUNTING ==========
    initStatsCounting() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    // Check if already animated
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        updateCounter();
                    }
                },
                once: true
            });
        });
    }

    // ========== CONTACT FORM ==========
    initContactForm() {
        const contactForm = document.getElementById('contact-form-elite');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const formObject = Object.fromEntries(formData.entries());
                
                // Validate form
                if (!this.validateForm(formObject)) {
                    return;
                }
                
                // Show loading state
                const submitBtn = contactForm.querySelector('.btn-submit-dominant');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>SUBMITTING...</span>';
                submitBtn.disabled = true;
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Show success message
                    this.showFormSuccess();
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Log to console (in production, send to backend)
                    console.log('Form submitted:', formObject);
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    this.showFormError('Submission failed. Please try again.');
                } finally {
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }

    validateForm(formData) {
        // Basic validation
        if (!formData.name || formData.name.length < 2) {
            this.showFormError('Please enter a valid name');
            return false;
        }
        
        if (!formData.email || !this.validateEmail(formData.email)) {
            this.showFormError('Please enter a valid email address');
            return false;
        }
        
        if (!formData.company || formData.company.length < 2) {
            this.showFormError('Please enter your company name');
            return false;
        }
        
        if (!formData.investment) {
            this.showFormError('Please select an investment band');
            return false;
        }
        
        if (!formData.interest) {
            this.showFormError('Please select your primary interest');
            return false;
        }
        
        if (!formData.message || formData.message.length < 10) {
            this.showFormError('Please provide a detailed message');
            return false;
        }
        
        if (!formData.nda) {
            this.showFormError('You must agree to the NDA terms');
            return false;
        }
        
        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFormSuccess() {
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-message';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Thank You!</h4>
                <p>Your elite inquiry has been submitted. Our executive team will contact you within 24 hours.</p>
            </div>
        `;
        
        // Style the message
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            padding: 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 3000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(successMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 500);
        }, 5000);
    }

    showFormError(message) {
        // Create error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error-message';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Style the message
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(errorMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorMsg.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(errorMsg);
            }, 500);
        }, 5000);
    }

    // ========== MODALS ==========
    initModals() {
        // Wallet Modal
        const walletModal = document.getElementById('wallet-modal');
        const connectWalletBtn = document.getElementById('connect-wallet');
        const closeModalBtn = walletModal?.querySelector('.close-modal');
        const metamaskBtn = document.getElementById('metamask-btn');
        const walletconnectBtn = document.getElementById('walletconnect-btn');

        // Open modal
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', (e) => {
                e.preventDefault();
                walletModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                walletModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (e.target === walletModal) {
                walletModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Wallet connection handlers
        if (metamaskBtn) {
            metamaskBtn.addEventListener('click', () => this.connectMetaMask());
        }

        if (walletconnectBtn) {
            walletconnectBtn.addEventListener('click', () => this.connectWalletConnect());
        }
    }

    async connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                const walletStatus = document.getElementById('wallet-status');
                walletStatus.innerHTML = `
                    <div class="connection-success">
                        <i class="fas fa-check-circle"></i>
                        <span>Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}</span>
                    </div>
                `;
                
                // Update UI
                const connectBtn = document.getElementById('connect-wallet');
                connectBtn.innerHTML = '<i class="fas fa-wallet"></i><span>CONNECTED</span>';
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    document.getElementById('wallet-modal').style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 2000);
                
            } catch (error) {
                console.error('MetaMask connection error:', error);
                this.showWalletError('Failed to connect MetaMask');
            }
        } else {
            this.showWalletError('Please install MetaMask to connect');
        }
    }

    connectWalletConnect() {
        // In a real implementation, integrate WalletConnect
        this.showWalletError('WalletConnect integration coming soon');
    }

    showWalletError(message) {
        const walletStatus = document.getElementById('wallet-status');
        walletStatus.innerHTML = `
            <div class="connection-error">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Clear error after 5 seconds
        setTimeout(() => {
            walletStatus.innerHTML = '';
        }, 5000);
    }

    // ========== ADMIN PANEL ==========
    initAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        const adminToggle = document.getElementById('admin-toggle');
        const closeAdmin = document.getElementById('close-admin');
        const saveContentBtn = document.getElementById('save-content');
        const previewContentBtn = document.getElementById('preview-content');
        const resetContentBtn = document.getElementById('reset-content');
        const tabBtns = document.querySelectorAll('.tab-btn');

        // Toggle admin panel
        if (adminToggle) {
            adminToggle.addEventListener('click', () => {
                adminPanel.classList.toggle('active');
                adminToggle.classList.toggle('active');
            });
        }

        // Close admin panel
        if (closeAdmin) {
            closeAdmin.addEventListener('click', () => {
                adminPanel.classList.remove('active');
                adminToggle.classList.remove('active');
            });
        }

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show corresponding tab content
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });

        // Save content
        if (saveContentBtn) {
            saveContentBtn.addEventListener('click', () => this.saveContent());
        }

        // Preview content
        if (previewContentBtn) {
            previewContentBtn.addEventListener('click', () => this.previewContent());
        }

        // Reset content
        if (resetContentBtn) {
            resetContentBtn.addEventListener('click', () => this.resetContent());
        }

        // Image update handlers
        const updateImageBtns = document.querySelectorAll('[id^="update-"]');
        updateImageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const inputId = e.target.id.replace('update-', 'edit-');
                const urlInput = document.getElementById(inputId);
                this.updateImage(urlInput.value, inputId);
            });
        });
    }

    saveContent() {
        // Collect all editable content
        const editableElements = document.querySelectorAll('[data-editable]');
        const contentData = {};
        
        editableElements.forEach(element => {
            const key = element.getAttribute('data-editable');
            contentData[key] = element.innerHTML;
        });
        
        // Get form values
        const heroTitle = document.getElementById('edit-hero-title')?.value;
        const heroSubtitle = document.getElementById('edit-hero-subtitle')?.value;
        
        // Update content
        if (heroTitle) {
            const heroTitleElement = document.querySelector('[data-editable="hero-title"]');
            if (heroTitleElement) heroTitleElement.textContent = heroTitle;
        }
        
        if (heroSubtitle) {
            const heroSubtitleElement = document.querySelector('[data-editable="hero-subtitle"]');
            if (heroSubtitleElement) heroSubtitleElement.textContent = heroSubtitle;
        }
        
        // Save to localStorage (in production, save to database)
        localStorage.setItem('oceanTracersContent', JSON.stringify(contentData));
        
        // Show success message
        this.showAdminSuccess('All changes have been saved successfully!');
    }

    previewContent() {
        // In a real implementation, this would show a preview modal
        this.showAdminSuccess('Preview mode activated. Refresh page to see changes.');
    }

    resetContent() {
        if (confirm('Are you sure you want to reset all content to defaults?')) {
            localStorage.removeItem('oceanTracersContent');
            location.reload();
        }
    }

    updateImage(url, inputId) {
        if (!url) {
            this.showAdminError('Please enter a valid image URL');
            return;
        }
        
        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            this.showAdminError('Please enter a valid URL');
            return;
        }
        
        // Update image based on input ID
        if (inputId.includes('sanctuary')) {
            const image = document.querySelector('.premium-image');
            if (image) image.src = url;
        } else if (inputId.includes('author')) {
            const image = document.querySelector('.leader-img');
            if (image) image.src = url;
        } else if (inputId.includes('hero-video')) {
            const video = document.querySelector('.hero-video source');
            if (video) video.src = url;
        }
        
        this.showAdminSuccess('Image updated successfully!');
    }

    showAdminSuccess(message) {
        const adminActions = document.querySelector('.admin-actions');
        const successMsg = document.createElement('div');
        successMsg.className = 'admin-success-message';
        successMsg.textContent = message;
        
        successMsg.style.cssText = `
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 0.9rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        adminActions.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                adminActions.removeChild(successMsg);
            }, 300);
        }, 3000);
    }

    showAdminError(message) {
        const adminActions = document.querySelector('.admin-actions');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'admin-error-message';
        errorMsg.textContent = message;
        
        errorMsg.style.cssText = `
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 0.9rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        adminActions.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                adminActions.removeChild(errorMsg);
            }, 300);
        }, 3000);
    }

    // ========== SCROLL EFFECTS ==========
    initScrollEffects() {
        // Back to top button
        const backToTopBtn = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Parallax effect on hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero.premium-hero');
            
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }

    // ========== PARTICLE NETWORK ==========
    initParticleNetwork() {
        const particleNetwork = document.getElementById('particle-network');
        
        if (particleNetwork) {
            // Create particles
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random properties
                const size = Math.random() * 3 + 1;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                
                // Apply styles
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(0, 180, 216, ${Math.random() * 0.5 + 0.1});
                    border-radius: 50%;
                    left: ${posX}%;
                    top: ${posY}%;
                    animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                `;
                
                particleNetwork.appendChild(particle);
            }
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2); }
                    50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(0.8); }
                    75% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.1); }
                }
            `;
            
            document.head.appendChild(style);
        }
    }

    // ========== WEB3 INTEGRATION ==========
    initWeb3() {
        // Check if Web3 is available
        if (typeof window.ethereum !== 'undefined') {
            console.log('Web3 detected');
            
            // Update UI to show Web3 available
            const connectBtn = document.getElementById('connect-wallet');
            if (connectBtn) {
                connectBtn.classList.add('web3-available');
            }
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    // User disconnected
                    this.updateWeb3Status('disconnected');
                } else {
                    // User switched accounts
                    this.updateWeb3Status('connected', accounts[0]);
                }
            });
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }

    updateWeb3Status(status, account = null) {
        const connectBtn = document.getElementById('connect-wallet');
        
        if (status === 'connected' && account) {
            connectBtn.innerHTML = `
                <i class="fas fa-wallet"></i>
                <span>${account.slice(0, 6)}...${account.slice(-4)}</span>
            `;
        } else {
            connectBtn.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>SECURE CONNECT</span>
            `;
        }
    }

    // ========== UTILITIES ==========
    setCurrentYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Load saved content from localStorage
    loadSavedContent() {
        const savedContent = localStorage.getItem('oceanTracersContent');
        if (savedContent) {
            const contentData = JSON.parse(savedContent);
            
            Object.entries(contentData).forEach(([key, value]) => {
                const element = document.querySelector(`[data-editable="${key}"]`);
                if (element) {
                    element.innerHTML = value;
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const oceanTracers = new OceanTracersPremium();
    
    // Add extra animations
    const extraAnimations = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .connection-success, .connection-error {
            padding: 10px 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            animation: fadeIn 0.3s ease-out;
        }
        
        .connection-success {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid #4CAF50;
            color: #4CAF50;
        }
        
        .connection-error {
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid #f44336;
            color: #f44336;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = extraAnimations;
    document.head.appendChild(style);
});