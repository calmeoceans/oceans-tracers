// =============================================
// OCEAN TRACERS NET - DATABASE MANAGEMENT
// Premium Content & Data Storage
// =============================================

class OceanTracersDatabase {
    constructor() {
        this.dbName = 'OceanTracersDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        // Initialize IndexedDB
        await this.initDatabase();
        
        // Load initial data
        await this.loadInitialData();
    }

    initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database initialized');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('content')) {
                    const contentStore = db.createObjectStore('content', { keyPath: 'id' });
                    contentStore.createIndex('type', 'type', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('images')) {
                    const imagesStore = db.createObjectStore('images', { keyPath: 'id' });
                    imagesStore.createIndex('category', 'category', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('partners')) {
                    const partnersStore = db.createObjectStore('partners', { keyPath: 'id' });
                    partnersStore.createIndex('status', 'status', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('submissions')) {
                    const submissionsStore = db.createObjectStore('submissions', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    submissionsStore.createIndex('date', 'date', { unique: false });
                    submissionsStore.createIndex('status', 'status', { unique: false });
                }
            };
        });
    }

    async loadInitialData() {
        // Load default content if database is empty
        const contentCount = await this.countRecords('content');
        
        if (contentCount === 0) {
            await this.initializeDefaultContent();
        }
    }

    // ========== CONTENT MANAGEMENT ==========
    async saveContent(key, content, type = 'text') {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['content'], 'readwrite');
            const store = transaction.objectStore('content');
            
            const contentItem = {
                id: key,
                content: content,
                type: type,
                updatedAt: new Date().toISOString(),
                version: 1
            };
            
            const request = store.put(contentItem);
            
            request.onsuccess = () => {
                console.log(`Content saved: ${key}`);
                
                // Also save to localStorage for immediate access
                localStorage.setItem(`oceanTracers_${key}`, content);
                
                // Update the DOM
                this.updateDOMContent(key, content);
                
                resolve(contentItem);
            };
            
            request.onerror = (event) => {
                console.error('Error saving content:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getContent(key) {
        // First check localStorage for faster access
        const cachedContent = localStorage.getItem(`oceanTracers_${key}`);
        if (cachedContent) {
            return cachedContent;
        }
        
        // Fall back to IndexedDB
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['content'], 'readonly');
            const store = transaction.objectStore('content');
            
            const request = store.get(key);
            
            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    // Cache in localStorage
                    localStorage.setItem(`oceanTracers_${key}`, result.content);
                    resolve(result.content);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = (event) => {
                console.error('Error getting content:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getAllContent() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['content'], 'readonly');
            const store = transaction.objectStore('content');
            const index = store.index('type');
            
            const request = index.getAll();
            
            request.onsuccess = () => {
                const contentMap = {};
                request.result.forEach(item => {
                    contentMap[item.id] = item.content;
                });
                resolve(contentMap);
            };
            
            request.onerror = (event) => {
                console.error('Error getting all content:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // ========== IMAGE MANAGEMENT ==========
    async saveImage(id, imageData, category = 'general') {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            
            const imageItem = {
                id: id,
                data: imageData,
                category: category,
                uploadedAt: new Date().toISOString(),
                size: imageData.length,
                format: this.getImageFormat(imageData)
            };
            
            const request = store.put(imageItem);
            
            request.onsuccess = () => {
                console.log(`Image saved: ${id}`);
                
                // Cache as data URL
                if (imageData.startsWith('data:')) {
                    localStorage.setItem(`oceanTracers_image_${id}`, imageData);
                }
                
                resolve(imageItem);
            };
            
            request.onerror = (event) => {
                console.error('Error saving image:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getImage(id) {
        // Check localStorage cache first
        const cachedImage = localStorage.getItem(`oceanTracers_image_${id}`);
        if (cachedImage) {
            return cachedImage;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            
            const request = store.get(id);
            
            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = (event) => {
                console.error('Error getting image:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    getImageFormat(imageData) {
        if (imageData.startsWith('data:image/')) {
            const match = imageData.match(/data:image\/(\w+);/);
            return match ? match[1] : 'unknown';
        }
        return 'url'; // External URL
    }

    // ========== FORM SUBMISSIONS ==========
    async saveSubmission(formData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['submissions'], 'readwrite');
            const store = transaction.objectStore('submissions');
            
            const submission = {
                id: Date.now(), // Use timestamp as ID
                ...formData,
                date: new Date().toISOString(),
                status: 'pending',
                read: false
            };
            
            const request = store.add(submission);
            
            request.onsuccess = () => {
                console.log('Form submission saved:', submission.id);
                
                // Send email notification (simulated)
                this.sendEmailNotification(submission);
                
                resolve(submission);
            };
            
            request.onerror = (event) => {
                console.error('Error saving submission:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getSubmissions(status = 'all', limit = 50) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['submissions'], 'readonly');
            const store = transaction.objectStore('submissions');
            const index = store.index('date');
            
            let request;
            if (status === 'all') {
                request = index.getAll();
            } else {
                const statusIndex = store.index('status');
                request = statusIndex.getAll(status);
            }
            
            request.onsuccess = () => {
                let results = request.result;
                
                // Sort by date (newest first)
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Apply limit
                if (limit) {
                    results = results.slice(0, limit);
                }
                
                resolve(results);
            };
            
            request.onerror = (event) => {
                console.error('Error getting submissions:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async updateSubmissionStatus(id, status) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['submissions'], 'readwrite');
            const store = transaction.objectStore('submissions');
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const submission = getRequest.result;
                if (submission) {
                    submission.status = status;
                    submission.updatedAt = new Date().toISOString();
                    
                    const updateRequest = store.put(submission);
                    
                    updateRequest.onsuccess = () => {
                        console.log(`Submission ${id} updated to status: ${status}`);
                        resolve(submission);
                    };
                    
                    updateRequest.onerror = (event) => {
                        console.error('Error updating submission:', event.target.error);
                        reject(event.target.error);
                    };
                } else {
                    reject(new Error('Submission not found'));
                }
            };
            
            getRequest.onerror = (event) => {
                console.error('Error getting submission:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // ========== PARTNER MANAGEMENT ==========
    async savePartner(partnerData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['partners'], 'readwrite');
            const store = transaction.objectStore('partners');
            
            const partner = {
                id: partnerData.id || `partner_${Date.now()}`,
                ...partnerData,
                joinedAt: new Date().toISOString(),
                status: 'active'
            };
            
            const request = store.put(partner);
            
            request.onsuccess = () => {
                console.log('Partner saved:', partner.id);
                resolve(partner);
            };
            
            request.onerror = (event) => {
                console.error('Error saving partner:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getPartners(status = 'active') {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['partners'], 'readonly');
            const store = transaction.objectStore('partners');
            const index = store.index('status');
            
            const request = index.getAll(status);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                console.error('Error getting partners:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // ========== STATISTICS ==========
    async getStatistics() {
        return new Promise(async (resolve, reject) => {
            try {
                const stats = {
                    totalSubmissions: await this.countRecords('submissions'),
                    pendingSubmissions: await this.countRecordsByIndex('submissions', 'status', 'pending'),
                    activePartners: await this.countRecordsByIndex('partners', 'status', 'active'),
                    contentItems: await this.countRecords('content'),
                    images: await this.countRecords('images'),
                    lastUpdated: new Date().toISOString()
                };
                
                resolve(stats);
            } catch (error) {
                reject(error);
            }
        });
    }

    async countRecords(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            const request = store.count();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async countRecordsByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            
            const keyRange = IDBKeyRange.only(value);
            const request = index.count(keyRange);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // ========== UTILITIES ==========
    updateDOMContent(key, content) {
        // Find elements with data-editable attribute matching the key
        const elements = document.querySelectorAll(`[data-editable="${key}"]`);
        elements.forEach(element => {
            element.innerHTML = content;
        });
        
        // Also update input fields if they exist
        const input = document.getElementById(`edit-${key}`);
        if (input) {
            input.value = content;
        }
        
        // Trigger a custom event for other components to react
        const event = new CustomEvent('contentUpdated', {
            detail: { key, content }
        });
        document.dispatchEvent(event);
    }

    async initializeDefaultContent() {
        const defaultContent = {
            'hero-title': 'REDEFINING<br><span class="title-line highlight">MARINE PRESERVATION</span><br>WITH INTELLIGENT SANCTUARIES',
            'hero-subtitle': 'Where cutting-edge artificial intelligence harmonizes with ancient oceanic rhythms. We don\'t just observe the ocean—we protect it with precision.',
            'mission-text': 'To dominate marine conservation through intelligent technology that doesn\'t just observe, but actively protects, predicts, and preserves. We\'re creating a new standard where luxury resorts become guardians of marine ecosystems.',
            'company-address': '101 Ocean Drive, Innovation District<br>Kampala City, Uganda 170410',
            'company-phone': '+256 (774) 380-011',
            'company-email': 'partnerships@oceantracers.net'
        };

        for (const [key, content] of Object.entries(defaultContent)) {
            await this.saveContent(key, content);
        }
    }

    sendEmailNotification(submission) {
        // Simulate email sending
        console.log('Email notification would be sent for submission:', submission.id);
        
        // In a real implementation, this would call your email API
        // Example: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(submission) });
        
        // For demo purposes, log to console
        const emailContent = `
            New Elite Partnership Inquiry
            
            Name: ${submission.name}
            Company: ${submission.company}
            Email: ${submission.email}
            Investment Band: ${submission.investment}
            Primary Interest: ${submission.interest}
            
            Message:
            ${submission.message}
            
            Submitted: ${new Date(submission.date).toLocaleString()}
        `;
        
        console.log(emailContent);
    }

    // ========== BACKUP & RESTORE ==========
    async backupDatabase() {
        return new Promise(async (resolve, reject) => {
            try {
                const backup = {
                    content: await this.getAllContent(),
                    images: await this.getAllImages(),
                    partners: await this.getPartners('all'),
                    submissions: await this.getSubmissions('all'),
                    metadata: {
                        version: this.dbVersion,
                        backedUpAt: new Date().toISOString(),
                        recordCounts: await this.getStatistics()
                    }
                };
                
                resolve(backup);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getAllImages() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            
            const request = store.getAll();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async exportToJSON() {
        const backup = await this.backupDatabase();
        const jsonString = JSON.stringify(backup, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ocean-tracers-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return backup;
    }

    async importFromJSON(jsonData) {
        if (!confirm('This will replace all existing data. Are you sure?')) {
            return;
        }
        
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Clear existing data
            await this.clearDatabase();
            
            // Import content
            if (data.content) {
                for (const [key, content] of Object.entries(data.content)) {
                    await this.saveContent(key, content);
                }
            }
            
            // Import images
            if (data.images && Array.isArray(data.images)) {
                for (const image of data.images) {
                    await this.saveImage(image.id, image.data, image.category);
                }
            }
            
            console.log('Database imported successfully');
            alert('Database imported successfully!');
            
            // Refresh page to show new data
            location.reload();
            
        } catch (error) {
            console.error('Error importing database:', error);
            alert('Error importing database. Please check the file format.');
        }
    }

    async clearDatabase() {
        const storeNames = ['content', 'images', 'partners', 'submissions'];
        
        for (const storeName of storeNames) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                
                const request = store.clear();
                
                request.onsuccess = () => {
                    console.log(`Cleared store: ${storeName}`);
                    resolve();
                };
                
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }
        
        // Clear localStorage cache
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('oceanTracers_')) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Create global instance
let oceanTracersDB;

// Initialize database when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        oceanTracersDB = new OceanTracersDatabase();
        
        // Make database available globally for debugging
        window.oceanTracersDB = oceanTracersDB;
        
        console.log('Ocean Tracers Database initialized');
        
        // Load saved content into DOM
        const savedContent = await oceanTracersDB.getAllContent();
        Object.entries(savedContent).forEach(([key, content]) => {
            oceanTracersDB.updateDOMContent(key, content);
        });
        
    } catch (error) {
        console.error('Failed to initialize database:', error);
        
        // Fallback to localStorage only
        console.log('Falling back to localStorage only mode');
        
        // Load from localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('oceanTracers_')) {
                const contentKey = key.replace('oceanTracers_', '');
                const content = localStorage.getItem(key);
                
                const elements = document.querySelectorAll(`[data-editable="${contentKey}"]`);
                elements.forEach(element => {
                    element.innerHTML = content;
                });
            }
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OceanTracersDatabase;
}