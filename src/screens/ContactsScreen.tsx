import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Contact, AppSettings } from '../types';
import { Button, ContactCard } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { loadContacts, loadSettings, makePhoneCall, deleteContact } from '../utils';

interface ContactsScreenProps {
  navigation: any;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const [contactsData, settingsData] = await Promise.all([
        loadContacts(),
        loadSettings(),
      ]);
      setContacts(contactsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('错误', '加载数据失败，请稍后重试');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePhoneCall = (phoneNumber: string) => {
    makePhoneCall(phoneNumber);
  };

  const handleWechatCall = (contact: Contact) => {
    Alert.alert('提示', `即将通过微信联系 ${contact.name}`);
  };

  const handleDeleteContact = (contactId: string, contactName: string) => {
    Alert.alert(
      '删除联系人',
      `确定要删除联系人 ${contactName} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(contactId);
              await loadData();
              Alert.alert('成功', '联系人已删除');
            } catch (error) {
              Alert.alert('错误', '删除联系人失败');
            }
          },
        },
      ]
    );
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  const handleContactPress = (contactId: string) => {
    navigation.navigate('ContactDetail', { contactId });
  };

  // 过滤联系人
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (contact.phoneNumber && contact.phoneNumber.includes(searchText))
  );

  const fontSize = settings?.fontSize || 'large';

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
          联系人
        </Text>
        <Button
          title="添加"
          onPress={handleAddContact}
          size="medium"
          fontSize={fontSize}
          style={styles.addButton}
        />
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { fontSize: FONT_SIZES[fontSize].body }
          ]}
          placeholder="搜索联系人..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 联系人列表 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              fontSize={fontSize}
              onPress={() => handleContactPress(contact.id)}
              onPhonePress={() => contact.phoneNumber && handlePhoneCall(contact.phoneNumber)}
              onWechatPress={() => handleWechatCall(contact)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { fontSize: FONT_SIZES[fontSize].body }]}>
              {searchText ? '未找到匹配的联系人' : '暂无联系人'}
            </Text>
            {!searchText && (
              <Button
                title="添加第一个联系人"
                onPress={handleAddContact}
                fontSize={fontSize}
                style={styles.emptyButton}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  addButton: {
    minWidth: 80,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    color: COLORS.TEXT_PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default ContactsScreen;
