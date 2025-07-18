import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Contact, AppSettings } from '../types';
import { Button, ContactCard, EmergencyButton } from '../components';
import { COLORS, FONT_SIZES, SPACING, EMERGENCY_NUMBERS } from '../constants';
import { loadContacts, loadSettings, makePhoneCall, confirmEmergencyCall } from '../utils';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
    // 这里需要集成微信SDK
    Alert.alert('提示', `即将通过微信联系 ${contact.name}`);
  };

  const handleEmergencyCall = (phoneNumber: string) => {
    confirmEmergencyCall(phoneNumber, () => {
      makePhoneCall(phoneNumber);
    });
  };

  const handleDouyinPress = () => {
    navigation.navigate('Douyin');
  };

  const handleContactsPress = () => {
    navigation.navigate('Contacts');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  // 获取常用联系人（前6个）
  const favoriteContacts = contacts
    .filter(contact => contact.isFavorite)
    .slice(0, 6);

  // 获取紧急联系人
  const emergencyContacts = contacts.filter(contact => contact.isEmergency);

  const fontSize = settings?.fontSize || 'large';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
            老年助手
          </Text>
          <Text style={[styles.subtitle, { fontSize: FONT_SIZES[fontSize].body }]}>
            简单易用的通讯助手
          </Text>
        </View>

        {/* 常用联系人 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            常用联系人
          </Text>
          {favoriteContacts.length > 0 ? (
            favoriteContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                fontSize={fontSize}
                onPress={() => navigation.navigate('ContactDetail', { contactId: contact.id })}
                onPhonePress={() => contact.phoneNumber && handlePhoneCall(contact.phoneNumber)}
                onWechatPress={() => handleWechatCall(contact)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { fontSize: FONT_SIZES[fontSize].body }]}>
                暂无常用联系人
              </Text>
              <Button
                title="添加联系人"
                onPress={() => navigation.navigate('AddContact')}
                fontSize={fontSize}
                style={styles.addButton}
              />
            </View>
          )}
        </View>

        {/* 快捷功能 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            快捷功能
          </Text>
          <View style={styles.quickActions}>
            <Button
              title="📱 联系人"
              onPress={handleContactsPress}
              variant="secondary"
              fontSize={fontSize}
              style={styles.quickButton}
            />
            <Button
              title="🎵 抖音"
              onPress={handleDouyinPress}
              variant="secondary"
              fontSize={fontSize}
              style={styles.quickButton}
            />
            <Button
              title="⚙️ 设置"
              onPress={handleSettingsPress}
              variant="outline"
              fontSize={fontSize}
              style={styles.quickButton}
            />
          </View>
        </View>

        {/* 紧急呼叫 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            紧急呼叫
          </Text>
          <View style={styles.emergencyContainer}>
            <EmergencyButton
              title="🚨 急救"
              onPress={() => handleEmergencyCall(EMERGENCY_NUMBERS.AMBULANCE)}
              fontSize={fontSize}
            />
            <EmergencyButton
              title="🚔 报警"
              onPress={() => handleEmergencyCall(EMERGENCY_NUMBERS.POLICE)}
              fontSize={fontSize}
            />
            <EmergencyButton
              title="🚒 火警"
              onPress={() => handleEmergencyCall(EMERGENCY_NUMBERS.FIRE)}
              fontSize={fontSize}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  section: {
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
  },
  addButton: {
    minWidth: 200,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  quickButton: {
    flex: 1,
    minWidth: 100,
    marginHorizontal: SPACING.xs,
  },
  emergencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
});

export default HomeScreen;
