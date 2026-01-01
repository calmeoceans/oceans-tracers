// database.js - Mock database and API interactions for Ocean Tracers Net

class OceanTracersDatabase {
    constructor() {
        this.contentData = this.getDefaultContent();
        this.userData = this.getDefaultUserData();
        this.servicesData = this.getServicesData();
        this.initializeLocalStorage();
    }
    
    // Initialize localStorage with default data if empty
    initializeLocalStorage() {
        if (!localStorage.getItem('oceanTracersInitialized')) {
            localStorage.setItem('oceanTracersContent', JSON.stringify(this.contentData));
            localStorage.setItem('oceanTracersUsers', JSON.stringify(this.userData));
            localStorage.setItem('oceanTracersServices', JSON.stringify(this.servicesData));
            localStorage.setItem('oceanTracersInitialized', 'true');
        }
    }
    
    // Default content data
    getDefaultContent() {
        return {
            hero: {
                title: "Smart Sanctuary",
                subtitle: "Where cutting-edge care meets the ocean's ancient rhythm.",
                slogan: "Networks of Tomorrow - Silent tech dances with the tides to protect paradise."
            },
            about: {
                text1: "\"Where Luxury Meets the Ocean's Whisper\" Step into resorts where crystal waters stay forever vibrant—protected by an invisible harmony of innovation and nature. Your escape not only pampers you but preserves paradise.",
                text2: "\"The First Resort That Loves the Ocean Back\" Swim, unwind, and explore knowing every detail—from the coral below to the cocktail in your hand—is designed to cherish, not exploit, the sea's fragile magic.",
                text3: "\"We Built Resorts That Protect, Not Just Impress\" Because paradise isn't a postcard—it's a living, breathing world. Our sanctuaries use unseen care to keep waters wild, so generations after you will sink their toes into the same golden sands.",
                text4: "\"Take Only Photos, Leave Only Bubbles\" Even the most luxurious escapes should vanish without a trace—except in your heart. That's the promise of a stay where technology and tide move as one.",
                whoWeAre1: "We are a group of companies driven by innovative trends in technology to develop solutions with a budget-friendly approach. Our goal is to be the most promising outsourcing company in Uganda.",
                whoWeAre2: "Ocean Trace Net {U} Ltd is nurtured by a group of passionate individuals all of who are tech-experts and experienced for excellence.",
                whoWeAre3: "We thrive to serve brands and businesses with all that they require to progress with respect to information and communication technology. We plan and execute your venture into a huge success."
            },
            values: {
                integrity: "Honors all commitments to our customers, employees and business with unwavering high standards of honesty, trust and professionalism.",
                quality: "Put the interest of our customers first and dedicated to providing an individualized business experience that assures customer satisfaction.",
                teamwork: "Work as one cohesive team from the smallest unit to the Board of directors while developing and retaining leaders who continually raise the bar.",
                growth: "Dedicated to continuous innovation and pursuit of new ideas and opportunities to accelerate profitable growth."
            },
            ceo: {
                belief: "I strongly believe that organizations who invest wisely in technology increase their operational maturity much faster than their competitors.",
                bio: "SSEGUYA SALIM MUKO. CEO | FOUNDER | DEVELOPER. OCEAN TRACERS NET Co LTD."
            },
            company: {
                address: "101 Ocean Drive, Kampala City, K'LA 170410",
                phone: "+256 (774) 380-011",
                email: "oceantracersnet101@gmail.com"
            },
            images: {
                sanctuary: "./img/tech3.jpg",
                author: "./img/tech4.jpg"
            }
        };
    }
    
    // Default user data
    getDefaultUserData() {
        return {
            admin: {
                username: "admin",
                password: "ocean2024", // In production, this should be hashed
                email: "admin@oceantracers.net",
                permissions: ["edit_content", "manage_users", "view_analytics"]
            },
            subscribers: []
        };
    }
    
    // Services data
    getServicesData() {
        return [
            {
                id: 1,
                name: "IT Consulting",
                description: "Strategic technology guidance to transform your business operations and digital capabilities.",
                icon: "fas fa-laptop-code",
                link: "#"
            },
            {
                id: 2,
                name: "Project Outsourcing",
                description: "Access our skilled talent pool for cost-effective project delivery with exceptional quality.",
                icon: "fas fa-handshake",
                link: "#"
            },
            {
                id: 3,
                name: "Travel & Safaris",
                description: "Unforgettable Ugandan adventures showcasing wildlife, culture, and natural beauty.",
                icon: "fas fa-plane",
                link: "#"
            },
            {
                id: 4,
                name: "E-commerce Solutions",
                description: "Complete digital storefront development with integrated marketing strategies.",
                icon: "fas fa-shopping-cart",
                link: "#"
            },
            {
                id: 5,
                name: "Marine Conservation",
                description: "AI-powered solutions to protect and monitor marine ecosystems and biodiversity.",
                icon: "fas fa-water",
                link: "#"
            },
            {
                id: 6,
                name: "Network Solutions",
                description: "Robust connectivity and infrastructure for modern business requirements.",
                icon: "fas fa-network-wired",
                link: "#"
            }
        ];
    }
    
    // Content Management Methods
    async getContent(key = null) {
        try {
            const content = JSON.parse(localStorage.getItem('oceanTracersContent')) || this.contentData;
            if (key) {
                return this.getNestedValue(content, key);
            }
            return content;
        } catch (error) {
            console.error('Error getting content:', error);
            return null;
        }
    }
    
    async updateContent(key, value) {
        try {
            const content = JSON.parse(localStorage.getItem('oceanTracersContent')) || this.contentData;
            this.setNestedValue(content, key, value);
            localStorage.setItem('oceanTracersContent', JSON.stringify(content));
            return { success: true, message: 'Content updated successfully' };
        } catch (error) {
            console.error('Error updating content:', error);
            return { success: false, message: 'Failed to update content' };
        }
    }
    
    async resetContent() {
        try {
            localStorage.setItem('oceanTracersContent', JSON.stringify(this.contentData));
            return { success: true, message: 'Content reset to default' };
        } catch (error) {
            console.error('Error resetting content:', error);
            return { success: false, message: 'Failed to reset content' };
        }
    }
    
    // User Management Methods
    async authenticate(username, password) {
        try {
            const users = JSON.parse(localStorage.getItem('oceanTracersUsers')) || this.userData;
            
            if (users.admin.username === username && users.admin.password === password) {
                const token = this.generateToken(username);
                localStorage.setItem('adminToken', token);
                return { 
                    success: true, 
                    token, 
                    user: { 
                        username: users.admin.username, 
                        email: users.admin.email,
                        permissions: users.admin.permissions 
                    } 
                };
            }
            
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    }
    
    async validateToken(token) {
        try {
            const storedToken = localStorage.getItem('adminToken');
            return { 
                success: storedToken === token, 
                isValid: storedToken === token 
            };
        } catch (error) {
            console.error('Token validation error:', error);
            return { success: false, isValid: false };
        }
    }
    
    async logout() {
        localStorage.removeItem('adminToken');
        return { success: true, message: 'Logged out successfully' };
    }
    
    // Contact Form Submission
    async submitContactForm(formData) {
        try {
            // In a real application, you would send this data to a server
            // For now, we'll store it in localStorage
            
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            const submission = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                ...formData
            };
            
            submissions.push(submission);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // Simulate sending email notification
            this.sendEmailNotification(submission);
            
            return { 
                success: true, 
                message: 'Thank you for your message! We will get back to you soon.',
                submissionId: submission.id
            };
        } catch (error) {
            console.error('Error submitting contact form:', error);
            return { success: false, message: 'Failed to submit form. Please try again.' };
        }
    }
    
    // Newsletter Subscription
    async subscribeToNewsletter(email) {
        try {
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
            
            // Check if email already exists
            if (subscribers.some(sub => sub.email === email)) {
                return { success: false, message: 'This email is already subscribed.' };
            }
            
            const subscriber = {
                email,
                subscribedAt: new Date().toISOString(),
                active: true
            };
            
            subscribers.push(subscriber);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            // Simulate welcome email
            this.sendWelcomeEmail(email);
            
            return { 
                success: true, 
                message: 'Thank you for subscribing to our newsletter!'
            };
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            return { success: false, message: 'Subscription failed. Please try again.' };
        }
    }
    
    // Analytics Methods
    async getAnalytics() {
        try {
            const contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            const newsletterSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
            
            return {
                totalSubmissions: contactSubmissions.length,
                totalSubscribers: newsletterSubscribers.length,
                recentSubmissions: contactSubmissions.slice(-10),
                growthRate: this.calculateGrowthRate(newsletterSubscribers)
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            return null;
        }
    }
    
    // Web3 Integration Methods
    async getWeb3Donations() {
        try {
            const donations = JSON.parse(localStorage.getItem('web3Donations')) || [];
            return {
                totalDonations: donations.reduce((sum, donation) => sum + donation.amount, 0),
                totalDonors: new Set(donations.map(d => d.address)).size,
                recentDonations: donations.slice(-5)
            };
        } catch (error) {
            console.error('Error getting donations:', error);
            return null;
        }
    }
    
    async recordDonation(donationData) {
        try {
            const donations = JSON.parse(localStorage.getItem('web3Donations')) || [];
            donations.push({
                ...donationData,
                timestamp: new Date().toISOString(),
                verified: true
            });
            
            localStorage.setItem('web3Donations', JSON.stringify(donations));
            
            return { 
                success: true, 
                message: 'Donation recorded successfully',
                transactionId: donationData.transactionHash
            };
        } catch (error) {
            console.error('Error recording donation:', error);
            return { success: false, message: 'Failed to record donation' };
        }
    }
    
    // Utility Methods
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
    
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }
    
    generateToken(username) {
        return btoa(`${username}:${Date.now()}:${Math.random().toString(36).substr(2)}`);
    }
    
    calculateGrowthRate(subscribers) {
        if (subscribers.length < 2) return 0;
        
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentSubscribers = subscribers.filter(sub => 
            new Date(sub.subscribedAt) > oneWeekAgo
        );
        
        const previousSubscribers = subscribers.length - recentSubscribers.length;
        
        if (previousSubscribers === 0) return 100;
        
        return ((recentSubscribers.length / previousSubscribers) * 100).toFixed(2);
    }
    
    // Mock email sending methods
    sendEmailNotification(submission) {
        console.log('Email notification would be sent for submission:', submission);
        // In production, integrate with an email service like SendGrid, Mailgun, etc.
    }
    
    sendWelcomeEmail(email) {
        console.log('Welcome email would be sent to:', email);
        // In production, integrate with an email service
    }
}

// Initialize database
const oceanTracersDB = new OceanTracersDatabase();

// Export for use in main script
window.OceanTracersDB = oceanTracersDB;

// Auto-initialize content on page load if admin is logged in
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        const validation = await oceanTracersDB.validateToken(token);
        if (validation.isValid) {
            // Admin is logged in, enable admin features
            console.log('Admin session active');
        }
    }
    
    // Load saved content from database
    const savedContent = await oceanTracersDB.getContent();
    if (savedContent) {
        applyContentToPage(savedContent);
    }
});

// Helper function to apply content to page
function applyContentToPage(content) {
    // Apply hero content
    const heroTitle = document.querySelector('[data-editable="hero-title"]');
    const heroSubtitle = document.querySelector('[data-editable="hero-subtitle"]');
    const heroSlogan = document.querySelector('[data-editable="hero-slogan"]');
    
    if (heroTitle) heroTitle.textContent = content.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = content.hero.subtitle;
    if (heroSlogan) heroSlogan.textContent = content.hero.slogan;
    
    // Apply about content
    const aboutElements = document.querySelectorAll('[data-editable^="about-text-"], [data-editable^="who-we-are-"]');
    aboutElements.forEach(el => {
        const key = el.getAttribute('data-editable');
        const value = oceanTracersDB.getNestedValue(content, key.replace(/-/g, '.'));
        if (value) el.textContent = value;
    });
    
    // Apply values content
    const valueElements = document.querySelectorAll('[data-editable$="-text"]');
    valueElements.forEach(el => {
        const key = el.getAttribute('data-editable');
        const value = oceanTracersDB.getNestedValue(content.values, key.replace('-text', ''));
        if (value) el.textContent = value;
    });
    
    // Apply CEO content
    const ceoBelief = document.querySelector('[data-editable="ceo-belief-1"]');
    const ceoBio = document.querySelector('[data-editable="ceo-bio"]');
    
    if (ceoBelief) ceoBelief.textContent = content.ceo.belief;
    if (ceoBio) ceoBio.textContent = content.ceo.bio;
    
    // Apply company info
    const companyElements = document.querySelectorAll('[data-editable^="company-"]');
    companyElements.forEach(el => {
        const key = el.getAttribute('data-editable');
        const value = oceanTracersDB.getNestedValue(content.company, key.replace('company-', ''));
        if (value) el.textContent = value;
    });
    
    // Apply images
    const sanctuaryImg = document.getElementById('sanctuary-image');
    const authorImg = document.getElementById('author-image');
    
    if (sanctuaryImg && content.images.sanctuary) {
        sanctuaryImg.src = content.images.sanctuary;
    }
    
    if (authorImg && content.images.author) {
        authorImg.src = content.images.author;
    }
}