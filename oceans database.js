// DATABASE.JS - Data Management & Local Storage
class OceanTracersDatabase {
    constructor() {
        this.dbName = 'OceanTracersDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        // Initialize IndexedDB
        if ('indexedDB' in window) {
            await this.initIndexedDB();
        } else {
            console.warn('IndexedDB not supported, using localStorage');
            this.initLocalStorage();
        }
    }

    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB initialized successfully');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                }
                
                if (!db.objectStoreNames.contains('messages')) {
                    const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                    messageStore.createIndex('email', 'email');
                    messageStore.createIndex('date', 'date');
                }
                
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    initLocalStorage() {
        // Initialize localStorage structure
        if (!localStorage.getItem('OceanTracers')) {
            localStorage.setItem('OceanTracers', JSON.stringify({
                users: [],
                messages: [],
                settings: {},
                lastUpdated: new Date().toISOString()
            }));
        }
    }

    // User Management
    async saveUser(userData) {
        if (this.db) {
            return this.saveToIndexedDB('users', userData);
        } else {
            return this.saveToLocalStorage('users', userData);
        }
    }

    async getUser(email) {
        if (this.db) {
            return this.getFromIndexedDB('users', 'email', email);
        } else {
            return this.getFromLocalStorage('users', 'email', email);
        }
    }

    // Message Management
    async saveMessage(messageData) {
        const message = {
            ...messageData,
            date: new Date().toISOString(),
            status: 'unread',
            id: Date.now()
        };
        
        if (this.db) {
            return this.saveToIndexedDB('messages', message);
        } else {
            return this.saveToLocalStorage('messages', message);
        }
    }

    async getMessages(options = {}) {
        if (this.db) {
            return this.getAllFromIndexedDB('messages', options);
        } else {
            return this.getAllFromLocalStorage('messages', options);
        }
    }

    // Settings Management
    async saveSetting(key, value) {
        const setting = { key, value, updated: new Date().toISOString() };
        
        if (this.db) {
            return this.saveToIndexedDB('settings', setting);
        } else {
            return this.saveToLocalStorage('settings', setting, 'key', key);
        }
    }

    async getSetting(key) {
        if (this.db) {
            return this.getFromIndexedDB('settings', 'key', key);
        } else {
            return this.getFromLocalStorage('settings', 'key', key);
        }
    }

    // IndexedDB Methods
    saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    getFromIndexedDB(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.get(value);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    getAllFromIndexedDB(storeName, options = {}) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            let request;
            
            if (options.index) {
                const index = store.index(options.index);
                request = index.getAll(options.query);
            } else {
                request = store.getAll();
            }
            
            request.onsuccess = () => {
                let results = request.result;
                
                // Apply filters
                if (options.filter) {
                    results = results.filter(options.filter);
                }
                
                // Apply sorting
                if (options.sort) {
                    results.sort(options.sort);
                }
                
                // Apply limit
                if (options.limit) {
                    results = results.slice(0, options.limit);
                }
                
                resolve(results);
            };
            
            request.onerror = () => reject(request.error);
        });
    }

    // LocalStorage Methods
    saveToLocalStorage(collection, data, keyField = 'id', keyValue = null) {
        try {
            const storage = JSON.parse(localStorage.getItem('OceanTracers')) || {};
            if (!storage[collection]) storage[collection] = [];
            
            if (keyValue !== null) {
                // Update existing if key matches
                const index = storage[collection].findIndex(item => item[keyField] === keyValue);
                if (index !== -1) {
                    storage[collection][index] = { ...storage[collection][index], ...data };
                } else {
                    storage[collection].push(data);
                }
            } else {
                storage[collection].push(data);
            }
            
            storage.lastUpdated = new Date().toISOString();
            localStorage.setItem('OceanTracers', JSON.stringify(storage));
            return true;
        } catch (error) {
            console.error('LocalStorage save error:', error);
            return false;
        }
    }

    getFromLocalStorage(collection, keyField, keyValue) {
        try {
            const storage = JSON.parse(localStorage.getItem('OceanTracers')) || {};
            if (!storage[collection]) return null;
            
            return storage[collection].find(item => item[keyField] === keyValue) || null;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return null;
        }
    }

    getAllFromLocalStorage(collection, options = {}) {
        try {
            const storage = JSON.parse(localStorage.getItem('OceanTracers')) || {};
            let results = storage[collection] || [];
            
            // Apply filters
            if (options.filter) {
                results = results.filter(options.filter);
            }
            
            // Apply sorting
            if (options.sort) {
                results.sort(options.sort);
            }
            
            // Apply limit
            if (options.limit) {
                results = results.slice(0, options.limit);
            }
            
            return results;
        } catch (error) {
            console.error('LocalStorage getAll error:', error);
            return [];
        }
    }

    // Data Export/Import
    async exportData() {
        const exportData = {
            users: await this.getAllFromIndexedDB('users'),
            messages: await this.getAllFromIndexedDB('messages'),
            settings: await this.getAllFromIndexedDB('settings'),
            exportDate: new Date().toISOString(),
            version: this.version
        };
        
        // Create download link
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `OceanTracers_Backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return exportData;
    }

    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const importData = JSON.parse(event.target.result);
                    
                    // Validate import data
                    if (!importData.version || importData.version !== this.version) {
                        throw new Error('Invalid data version');
                    }
                    
                    // Import each collection
                    if (importData.users) {
                        for (const user of importData.users) {
                            await this.saveUser(user);
                        }
                    }
                    
                    if (importData.messages) {
                        for (const message of importData.messages) {
                            await this.saveMessage(message);
                        }
                    }
                    
                    if (importData.settings) {
                        for (const setting of importData.settings) {
                            await this.saveSetting(setting.key, setting.value);
                        }
                    }
                    
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Analytics & Statistics
    async getStatistics() {
        const messages = await this.getMessages();
        const users = await this.getAllFromIndexedDB('users');
        
        const today = new Date().toISOString().split('T')[0];
        const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const todayMessages = messages.filter(msg => 
            msg.date.startsWith(today)
        ).length;
        
        const lastWeekMessages = messages.filter(msg => 
            msg.date >= lastWeek
        ).length;
        
        return {
            totalMessages: messages.length,
            totalUsers: users.length,
            todayMessages,
            lastWeekMessages,
            unreadMessages: messages.filter(msg => msg.status === 'unread').length,
            byMonth: this.groupByMonth(messages)
        };
    }

    groupByMonth(messages) {
        const months = {};
        messages.forEach(msg => {
            const month = msg.date.substring(0, 7); // YYYY-MM
            if (!months[month]) months[month] = 0;
            months[month]++;
        });
        return months;
    }

    // Backup & Maintenance
    async cleanupOldData(days = 365) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        
        if (this.db) {
            // IndexedDB cleanup
            const transaction = this.db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const index = store.index('date');
            const range = IDBKeyRange.upperBound(cutoffDate);
            
            const messages = await new Promise((resolve, reject) => {
                const request = index.getAll(range);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            for (const message of messages) {
                store.delete(message.id);
            }
        } else {
            // LocalStorage cleanup
            const storage = JSON.parse(localStorage.getItem('OceanTracers')) || {};
            if (storage.messages) {
                storage.messages = storage.messages.filter(msg => msg.date >= cutoffDate);
                storage.lastUpdated = new Date().toISOString();
                localStorage.setItem('OceanTracers', JSON.stringify(storage));
            }
        }
    }

    // GDPR Compliance Methods
    async deleteUserData(email) {
        // Delete user
        if (this.db) {
            const transaction = this.db.transaction(['users', 'messages'], 'readwrite');
            const userStore = transaction.objectStore('users');
            const messageStore = transaction.objectStore('messages');
            
            // Delete from users
            const userIndex = userStore.index('email');
            const userRequest = userIndex.getKey(email);
            
            userRequest.onsuccess = () => {
                if (userRequest.result) {
                    userStore.delete(userRequest.result);
                }
            };
            
            // Delete related messages
            const messageIndex = messageStore.index('email');
            const messageRequest = messageIndex.getAllKeys(email);
            
            messageRequest.onsuccess = () => {
                messageRequest.result.forEach(key => {
                    messageStore.delete(key);
                });
            };
            
            return new Promise((resolve) => {
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => resolve(false);
            });
        } else {
            // LocalStorage implementation
            const storage = JSON.parse(localStorage.getItem('OceanTracers')) || {};
            
            if (storage.users) {
                storage.users = storage.users.filter(user => user.email !== email);
            }
            
            if (storage.messages) {
                storage.messages = storage.messages.filter(msg => msg.email !== email);
            }
            
            localStorage.setItem('OceanTracers', JSON.stringify(storage));
            return true;
        }
    }

    async exportUserData(email) {
        const user = await this.getUser(email);
        const messages = await this.getMessages({
            filter: msg => msg.email === email
        });
        
        return {
            user,
            messages,
            exportDate: new Date().toISOString(),
            requestId: `GDPR-${Date.now()}`
        };
    }
}

// Initialize database
const oceanDB = new OceanTracersDatabase();

// Export for use in other modules
window.OceanTracersDB = oceanDB;