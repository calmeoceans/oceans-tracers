// Database simulation for Ocean Tracers Net website
// In a real implementation, this would connect to a backend API

// Simulated database for content management
const OceanTracersDB = {
    // Default content
    defaultContent: {
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
        services: {
            itConsulting: "Get advice from specialists on how to scale your business in IT aspects. Right from formulating blueprints to setting it in action to driving remarkable results.",
            outsourcing: "We are trying to make outsourcing easier than ever. With affordable pricing, skilled talent pool, adept knowledge, and sharp experiences.",
            tours: "An unforgettable experience, offering a heady mix of adventure, thrilling wildlife sightings, cultural encounter and spectacular sceneries.",
            ecommerce: "Our marketing specialists and engineers work together to make every digital marketing venture a huge success."
        },
        impact: {
            ceoBelief: "I strongly believe that organizations who invest wisely in technology increase their operational maturity much faster than their competitors.",
            ceoSignature: "SSEGUYA SALIM MUKO.<br>CEO | FOUNDER | DEVELOPER.<br>OCEAN TRACERS NET Co LTD."
        },
        contact: {
            address: "101 Ocean Drive, Kampala City, K'LA 170410",
            phone: "+256 (774) 380-011",
            email: "oceantracersnet101@gmail.com"
        },
        images: {
            sanctuary: "assets/tech2.jpg",
            author: "assets/ceo.jpg"
        }
    },
    
    // Current content (initially set to default)
    currentContent: {},
    
    // Initialize database
    init: function() {
        // Try to load saved content from localStorage
        const savedContent = localStorage.getItem('oceanTracersContent');
        
        if (savedContent) {
            this.currentContent = JSON.parse(savedContent);
        } else {
            // Use default content
            this.currentContent = JSON.parse(JSON.stringify(this.defaultContent));
        }
        
        // Apply content to the page
        this.applyContentToPage();
        
        console.log('Ocean Tracers DB initialized');
    },
    
    // Apply content to the page
    applyContentToPage: function() {
        // Hero section
        this.setElementContent('[data-editable="hero-title"]', this.currentContent.hero.title);
        this.setElementContent('[data-editable="hero-subtitle"]', this.currentContent.hero.subtitle);
        this.setElementContent('[data-editable="hero-slogan"]', this.currentContent.hero.slogan);
        
        // About section
        this.setElementContent('[data-editable="about-text-1"]', this.currentContent.about.text1);
        this.setElementContent('[data-editable="about-text-2"]', this.currentContent.about.text2);
        this.setElementContent('[data-editable="about-text-3"]', this.currentContent.about.text3);
        this.setElementContent('[data-editable="about-text-4"]', this.currentContent.about.text4);
        this.setElementContent('[data-editable="who-we-are-1"]', this.currentContent.about.whoWeAre1);
        this.setElementContent('[data-editable="who-we-are-2"]', this.currentContent.about.whoWeAre2);
        this.setElementContent('[data-editable="who-we-are-3"]', this.currentContent.about.whoWeAre3);
        
        // Values section
        this.setElementContent('[data-editable="integrity-text"]', this.currentContent.values.integrity);
        this.setElementContent('[data-editable="quality-text"]', this.currentContent.values.quality);
        this.setElementContent('[data-editable="teamwork-text"]', this.currentContent.values.teamwork);
        this.setElementContent('[data-editable="growth-text"]', this.currentContent.values.growth);
        
        // Services section
        this.setElementContent('[data-editable="it-consulting-text"]', this.currentContent.services.itConsulting);
        this.setElementContent('[data-editable="outsourcing-text"]', this.currentContent.services.outsourcing);
        this.setElementContent('[data-editable="tours-text"]', this.currentContent.services.tours);
        this.setElementContent('[data-editable="ecommerce-text"]', this.currentContent.services.ecommerce);
        
        // Impact section
        this.setElementContent('[data-editable="ceo-belief-1"]', this.currentContent.impact.ceoBelief);
        this.setElementContent('[data-editable="ceo-signature"]', this.currentContent.impact.ceoSignature);
        
        // Contact section
        this.setElementContent('[data-editable="company-address"]', this.currentContent.contact.address);
        this.setElementContent('[data-editable="company-phone"]', this.currentContent.contact.phone);
        this.setElementContent('[data-editable="company-email"]', this.currentContent.contact.email);
        
        // Images
        this.setImageSource('#sanctuary-image img', this.currentContent.images.sanctuary);
        this.setImageSource('#author-image-container img', this.currentContent.images.author);
    },
    
    // Helper function to set element content
    setElementContent: function(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    },
    
    // Helper function to set image source
    setImageSource: function(selector, src) {
        const element = document.querySelector(selector);
        if (element) {
            element.src = src;
        }
    },
    
    // Update content
    updateContent: function(section, field, value) {
        if (this.currentContent[section] && this.currentContent[section][field] !== undefined) {
            this.currentContent[section][field] = value;
            
            // Save to localStorage
            localStorage.setItem('oceanTracersContent', JSON.stringify(this.currentContent));
            
            // Apply changes to page
            this.applyContentToPage();
            
            return true;
        }
        return false;
    },
    
    // Update image
    updateImage: function(imageType, src) {
        if (this.currentContent.images[imageType] !== undefined) {
            this.currentContent.images[imageType] = src;
            
            // Save to localStorage
            localStorage.setItem('oceanTracersContent', JSON.stringify(this.currentContent));
            
            // Apply changes to page
            this.applyContentToPage();
            
            return true;
        }
        return false;
    },
    
    // Reset to default content
    resetToDefault: function() {
        this.currentContent = JSON.parse(JSON.stringify(this.defaultContent));
        localStorage.removeItem('oceanTracersContent');
        this.applyContentToPage();
    },
    
    // Get all content (for admin panel)
    getAllContent: function() {
        return this.currentContent;
    },
    
    // Save all content (for admin panel)
    saveAllContent: function(newContent) {
        this.currentContent = newContent;
        localStorage.setItem('oceanTracersContent', JSON.stringify(this.currentContent));
        this.applyContentToPage();
    }
};

// Contact form submissions simulation
const ContactFormDB = {
    submissions: [],
    
    // Initialize from localStorage
    init: function() {
        const savedSubmissions = localStorage.getItem('oceanTracersSubmissions');
        if (savedSubmissions) {
            this.submissions = JSON.parse(savedSubmissions);
        }
    },
    
    // Save a new submission
    saveSubmission: function(submission) {
        // Add timestamp
        submission.timestamp = new Date().toISOString();
        submission.id = this.generateId();
        
        this.submissions.push(submission);
        
        // Save to localStorage
        localStorage.setItem('oceanTracersSubmissions', JSON.stringify(this.submissions));
        
        // In a real implementation, this would send to a server
        console.log('Form submission saved:', submission);
        
        return submission.id;
    },
    
    // Generate a unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Get all submissions
    getSubmissions: function() {
        return this.submissions;
    },
    
    // Get submission by ID
    getSubmission: function(id) {
        return this.submissions.find(submission => submission.id === id);
    }
};

// Web3 integration data
const Web3Integration = {
    connected: false,
    account: null,
    network: null,
    
    // Check if Web3 is available
    isWeb3Available: function() {
        return typeof window.ethereum !== 'undefined';
    },
    
    // Connect to Web3
    connect: async function() {
        if (!this.isWeb3Available()) {
            throw new Error('Web3 provider not found. Please install MetaMask.');
        }
        
        try {
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            this.connected = true;
            this.account = accounts[0];
            
            // Get network ID
            const chainId = await window.ethereum.request({ 
                method: 'eth_chainId' 
            });
            
            this.network = this.getNetworkName(chainId);
            
            // Set up event listeners
            this.setupEventListeners();
            
            return {
                account: this.account,
                network: this.network
            };
            
        } catch (error) {
            throw new Error(`Failed to connect: ${error.message}`);
        }
    },
    
    // Get network name from chain ID
    getNetworkName: function(chainId) {
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0x3': 'Ropsten Testnet',
            '0x4': 'Rinkeby Testnet',
            '0x5': 'Goerli Testnet',
            '0x2a': 'Kovan Testnet',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Polygon Mumbai Testnet'
        };
        
        return networks[chainId] || `Unknown Network (${chainId})`;
    },
    
    // Set up event listeners for account and network changes
    setupEventListeners: function() {
        if (!this.isWeb3Available()) return;
        
        // Account change
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // User disconnected their account
                this.connected = false;
                this.account = null;
            } else {
                this.account = accounts[0];
            }
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('web3AccountChanged', {
                detail: { account: this.account }
            }));
        });
        
        // Network change
        window.ethereum.on('chainChanged', (chainId) => {
            this.network = this.getNetworkName(chainId);
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('web3NetworkChanged', {
                detail: { network: this.network }
            }));
        });
    },
    
    // Get current status
    getStatus: function() {
        return {
            connected: this.connected,
            account: this.account,
            network: this.network
        };
    },
    
    // Disconnect
    disconnect: function() {
        this.connected = false;
        this.account = null;
        this.network = null;
    }
};

// Initialize databases when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    OceanTracersDB.init();
    ContactFormDB.init();
});

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OceanTracersDB,
        ContactFormDB,
        Web3Integration
    };
}