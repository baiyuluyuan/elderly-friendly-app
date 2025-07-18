import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';

// 联系人存储相关
export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(contacts);
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, jsonValue);
  } catch (error) {
    console.error('Error saving contacts:', error);
    throw error;
  }
};

export const loadContacts = async (): Promise<Contact[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
};

export const addContact = async (contact: Contact): Promise<void> => {
  try {
    const contacts = await loadContacts();
    contacts.push(contact);
    await saveContacts(contacts);
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

export const updateContact = async (contactId: string, updatedContact: Partial<Contact>): Promise<void> => {
  try {
    const contacts = await loadContacts();
    const index = contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updatedContact };
      await saveContacts(contacts);
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (contactId: string): Promise<void> => {
  try {
    const contacts = await loadContacts();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    await saveContacts(filteredContacts);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// 设置存储相关
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// 首次启动检查
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return value === null;
  } catch (error) {
    console.error('Error checking first launch:', error);
    return true;
  }
};

export const setFirstLaunchComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
  } catch (error) {
    console.error('Error setting first launch complete:', error);
  }
};

// 清除所有数据
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CONTACTS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.FIRST_LAUNCH,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
