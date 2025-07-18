import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Contact, AppSettings } from '../types';
import { Button, EmergencyButton } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { loadSettings } from '../utils';
import { EmergencyService } from '../services';

interface EmergencyScreenProps {
  navigation: any;
}

const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, contactsData] = await Promise.all([
        loadSettings(),
        EmergencyService.getEmergencyContacts(),
      ]);
      setSettings(settingsData);
      setEmergencyContacts(contactsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('错误', '加载数据失败');
    }
  };

  const handleEmergencyCall = async (type: 'police' | 'fire' | 'ambulance' | 'traffic') => {
    setLoading(true);
    try {
      await EmergencyService.makeEmergencyCall(type);
    } catch (error) {
      console.error('Error making emergency call:', error);
      Alert.alert('错误', '拨打紧急电话失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyContactCall = async (contactId: string) => {
    setLoading(true);
    try {
      await EmergencyService.callEmergencyContact(contactId);
    } catch (error) {
      console.error('Error calling emergency contact:', error);
      Alert.alert('错误', '拨打紧急联系人失败');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCall = async () => {
    setLoading(true);
    try {
      await EmergencyService.quickEmergencyCall();
    } catch (error) {
      console.error('Error in quick call:', error);
      Alert.alert('错误', '快速呼叫失败');
    } finally {
      setLoading(false);
    }
  };

  const showEmergencyGuide = () => {
    const guide = EmergencyService.getEmergencyGuide();
    const guideText = guide.map(item => 
      `${item.situation}:\n${item.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n紧急电话: ${item.phoneNumber}\n`
    ).join('\n');

    Alert.alert(
      '紧急情况处理指南',
      guideText,
      [{ text: '知道了' }],
      { cancelable: true }
    );
  };

  const fontSize = settings?.fontSize || 'large';
  const emergencyServices = EmergencyService.getEmergencyServices();

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Button
          title="← 返回"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          fontSize={fontSize}
          style={styles.backButton}
        />
        <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
          紧急呼叫
        </Text>
        <Button
          title="指南"
          onPress={showEmergencyGuide}
          variant="outline"
          size="medium"
          fontSize={fontSize}
          style={styles.guideButton}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 快速呼叫 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            一键求助
          </Text>
          <View style={styles.quickCallContainer}>
            <EmergencyButton
              title="🆘 求助"
              onPress={handleQuickCall}
              fontSize={fontSize}
              disabled={loading}
            />
            <Text style={[styles.quickCallDescription, { fontSize: FONT_SIZES[fontSize].caption }]}>
              快速拨打紧急联系人或急救电话
            </Text>
          </View>
        </View>

        {/* 紧急服务 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            紧急服务
          </Text>
          <View style={styles.emergencyServicesGrid}>
            {emergencyServices.map((service) => (
              <TouchableOpacity
                key={service.type}
                style={styles.serviceCard}
                onPress={() => handleEmergencyCall(service.type)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={[styles.serviceIcon, { fontSize: FONT_SIZES[fontSize].title }]}>
                  {service.icon}
                </Text>
                <Text style={[styles.serviceName, { fontSize: FONT_SIZES[fontSize].body }]}>
                  {service.name}
                </Text>
                <Text style={[styles.serviceNumber, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
                  {service.number}
                </Text>
                <Text style={[styles.serviceDescription, { fontSize: FONT_SIZES[fontSize].caption }]}>
                  {service.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 紧急联系人 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
              紧急联系人
            </Text>
            <Button
              title="管理"
              onPress={() => navigation.navigate('Contacts')}
              variant="outline"
              size="small"
              fontSize={fontSize}
              style={styles.manageButton}
            />
          </View>
          
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleEmergencyContactCall(contact.id)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { fontSize: FONT_SIZES[fontSize].body }]}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactPhone, { fontSize: FONT_SIZES[fontSize].caption }]}>
                    {contact.phoneNumber}
                  </Text>
                </View>
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyBadgeText}>急</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { fontSize: FONT_SIZES[fontSize].body }]}>
                暂无紧急联系人
              </Text>
              <Button
                title="添加紧急联系人"
                onPress={() => navigation.navigate('AddContact')}
                fontSize={fontSize}
                style={styles.addButton}
              />
            </View>
          )}
        </View>

        {/* 重要提醒 */}
        <View style={styles.section}>
          <View style={styles.warningCard}>
            <Text style={[styles.warningTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
              ⚠️ 重要提醒
            </Text>
            <Text style={[styles.warningText, { fontSize: FONT_SIZES[fontSize].caption }]}>
              • 紧急电话仅在真正紧急情况下使用{'\n'}
              • 虚假报警可能承担法律责任{'\n'}
              • 保持冷静，清楚描述情况和位置{'\n'}
              • 按照接线员指示进行操作
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    minWidth: 80,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  guideButton: {
    minWidth: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  section: {
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  manageButton: {
    minWidth: 60,
  },
  quickCallContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  quickCallDescription: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  emergencyServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  serviceCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    width: '48%',
    minHeight: 140,
    ...SHADOWS.medium,
  },
  serviceIcon: {
    marginBottom: SPACING.sm,
  },
  serviceName: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  serviceNumber: {
    color: COLORS.EMERGENCY,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  serviceDescription: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  contactPhone: {
    color: COLORS.TEXT_SECONDARY,
  },
  emergencyBadge: {
    backgroundColor: COLORS.EMERGENCY,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyBadgeText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
  },
  addButton: {
    minWidth: 200,
  },
  warningCard: {
    backgroundColor: COLORS.EMERGENCY_LIGHT,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.EMERGENCY,
  },
  warningTitle: {
    color: COLORS.EMERGENCY,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  warningText: {
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
});

export default EmergencyScreen;
