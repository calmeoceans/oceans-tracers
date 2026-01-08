// OCEANS.JS - Main JavaScript File
class OceanTracersApp {
    constructor() {
        this.init();
    }

    init() {
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize components
        this.initLoadingScreen();
        this.initNavigation();
        this.initScrollAnimations();
        this.initContactForm();
        this.initCookieConsent();
        this.initCounters();
        this.initMobileMenu();
        this.initLegalCompliance();
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            loadingProgress.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        this.animateHeroContent();
                    }, 500);
                }, 500);
            }
        }, 100);
    }

    initNavigation() {
        const header = document.querySelector('.sticky-header');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        // Sticky header on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active navigation link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 200) {
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
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.querySelector('i').classList.toggle('fa-bars');
            menuBtn.querySelector('i').classList.toggle('fa-times');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    }

    animateHeroContent() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Animate counters if it's the impact section
                    if (entry.target.id === 'impact') {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    initCounters() {
        this.counterElements = document.querySelectorAll('[data-count]');
    }

    animateCounters() {
        this.counterElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        });
    }

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic validation
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.email || !data.message) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call - Replace with actual endpoint
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                this.showNotification('Failed to send message. Please try again.', 'error');
                console.error('Contact form error:', error);
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .notification-success {
                    background: linear-gradient(135deg, #4ECDC4, #006994);
                    color: white;
                }
                .notification-error {
                    background: linear-gradient(135deg, #FF6B6B, #FF9E6B);
                    color: white;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.5rem;
                    cursor: pointer;
                    margin-left: auto;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    initCookieConsent() {
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'cookie-banner';
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>
                    We use cookies to enhance your experience. By continuing, you agree to our 
                    <a href="#privacy-policy" onclick="event.preventDefault(); showPrivacyModal()">Privacy Policy</a> and 
                    <a href="#terms" onclick="event.preventDefault(); showTermsModal()">Terms of Service</a>.
                </p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn btn-primary">Accept All</button>
                    <button id="customize-cookies" class="btn btn-secondary">Customize</button>
                    <button id="reject-cookies" class="btn btn-secondary">Reject</button>
                </div>
            </div>
        `;
        
        // Check if consent already given
        if (!localStorage.getItem('cookie-consent')) {
            setTimeout(() => {
                document.body.appendChild(cookieBanner);
                setTimeout(() => cookieBanner.classList.add('show'), 100);
                
                // Handle cookie choices
                document.getElementById('accept-cookies').addEventListener('click', () => {
                    localStorage.setItem('cookie-consent', 'all');
                    cookieBanner.classList.remove('show');
                    setTimeout(() => cookieBanner.remove(), 300);
                });
                
                document.getElementById('reject-cookies').addEventListener('click', () => {
                    localStorage.setItem('cookie-consent', 'none');
                    cookieBanner.classList.remove('show');
                    setTimeout(() => cookieBanner.remove(), 300);
                });
                
                document.getElementById('customize-cookies').addEventListener('click', () => {
                    this.showCookieSettings();
                });
            }, 2000);
        }
    }

    showCookieSettings() {
        // Create cookie settings modal
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Cookie Preferences</h3>
                <p>Choose which cookies you want to accept:</p>
                
                <div class="cookie-option">
                    <input type="checkbox" id="essential-cookies" checked disabled>
                    <label for="essential-cookies">
                        <strong>Essential Cookies</strong>
                        <span>Required for basic site functionality</span>
                    </label>
                </div>
                
                <div class="cookie-option">
                    <input type="checkbox" id="analytics-cookies">
                    <label for="analytics-cookies">
                        <strong>Analytics Cookies</strong>
                        <span>Help us improve our website</span>
                    </label>
                </div>
                
                <div class="cookie-option">
                    <input type="checkbox" id="marketing-cookies">
                    <label for="marketing-cookies">
                        <strong>Marketing Cookies</strong>
                        <span>For personalized content</span>
                    </label>
                </div>
                
                <div class="modal-buttons">
                    <button id="save-preferences" class="btn btn-primary">Save Preferences</button>
                    <button id="cancel-preferences" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1002;
            }
            .cookie-modal .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .cookie-option {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin: 1rem 0;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .cookie-option label {
                flex: 1;
                cursor: pointer;
            }
            .cookie-option label span {
                display: block;
                font-size: 0.9rem;
                color: #666;
                margin-top: 0.25rem;
            }
            .modal-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(styles);
        
        document.body.appendChild(modal);
        
        // Handle modal actions
        document.getElementById('save-preferences').addEventListener('click', () => {
            const analytics = document.getElementById('analytics-cookies').checked;
            const marketing = document.getElementById('marketing-cookies').checked;
            
            localStorage.setItem('cookie-consent', JSON.stringify({
                analytics,
                marketing,
                essential: true
            }));
            
            modal.remove();
            styles.remove();
            
            const cookieBanner = document.getElementById('cookie-banner');
            if (cookieBanner) {
                cookieBanner.classList.remove('show');
                setTimeout(() => cookieBanner.remove(), 300);
            }
            
            this.showNotification('Cookie preferences saved', 'success');
        });
        
        document.getElementById('cancel-preferences').addEventListener('click', () => {
            modal.remove();
            styles.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                styles.remove();
            }
        });
    }

    initLegalCompliance() {
        // Add privacy policy modal
        const privacyModal = document.createElement('div');
        privacyModal.id = 'privacy-modal';
        privacyModal.className = 'legal-modal';
        privacyModal.innerHTML = `
            <div class="modal-content">
                <h2>Privacy Policy</h2>
                <div class="modal-body">
                    <h3>Data Protection Commitment</h3>
                    <p>At Ocean Tracers Net, we are committed to protecting your privacy and personal data in compliance with:</p>
                    <ul>
                        <li>Uganda Data Protection Act, 2019</li>
                        <li>GDPR for European users</li>
                        <li>California Consumer Privacy Act (CCPA)</li>
                    </ul>
                    
                    <h3>Information We Collect</h3>
                    <p>We collect only necessary information for providing our services:</p>
                    <ul>
                        <li>Contact information when you reach out to us</li>
                        <li>Usage data for improving our website</li>
                        <li>Marine conservation data (non-personal)</li>
                    </ul>
                    
                    <h3>Your Rights</h3>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                    </ul>
                    
                    <h3>Contact Our Data Protection Officer</h3>
                    <p>Email: dpo@oceantracers.net</p>
                    <p>Phone: +256 774 380 011</p>
                </div>
                <button class="close-modal btn btn-primary">Close</button>
            </div>
        `;
        
        // Add legal modal styles
        const legalStyles = document.createElement('style');
        legalStyles.textContent = `
            .legal-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1003;
                justify-content: center;
                align-items: center;
                padding: 2rem;
            }
            .legal-modal.active {
                display: flex;
            }
            .legal-modal .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 800px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                padding: 2rem;
            }
            .legal-modal h2 {
                color: var(--deep-blue);
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid var(--ocean-blue);
            }
            .legal-modal h3 {
                color: var(--ocean-blue);
                margin: 1.5rem 0 0.5rem;
            }
            .legal-modal ul {
                padding-left: 1.5rem;
                margin: 1rem 0;
            }
            .legal-modal li {
                margin-bottom: 0.5rem;
            }
            .close-modal {
                margin-top: 2rem;
            }
        `;
        
        document.head.appendChild(legalStyles);
        document.body.appendChild(privacyModal);
        
        // Add legal link handlers
        document.querySelectorAll('a[href="#privacy-policy"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                privacyModal.classList.add('active');
            });
        });
        
        // Close modal
        privacyModal.querySelector('.close-modal').addEventListener('click', () => {
            privacyModal.classList.remove('active');
        });
        
        // Close on outside click
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                privacyModal.classList.remove('active');
            }
        });
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.oceanTracersApp = new OceanTracersApp();
});

// Global functions for legal modals
window.showPrivacyModal = function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.add('active');
};

window.showTermsModal = function() {
    // Similar implementation for terms modal
    alert('Terms of Service modal would open here. Implementation similar to privacy modal.');
};

// Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}