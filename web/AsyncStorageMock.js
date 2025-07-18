// Mock AsyncStorage for web
const AsyncStorage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage getItem error:', error);
      return null;
    }
  },
  
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem error:', error);
    }
  },
  
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem error:', error);
    }
  },
  
  multiRemove: async (keys) => {
    try {
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('AsyncStorage multiRemove error:', error);
    }
  },
  
  clear: async () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('AsyncStorage clear error:', error);
    }
  },
};

export default AsyncStorage;
