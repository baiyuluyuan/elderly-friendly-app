import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Contact, AppSettings } from '../types';
import { Button } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { loadContacts, loadSettings, makePhoneCall, deleteContact } from '../utils';

interface ContactDetailScreenProps {
  navigation: any;
  route: {
    params: {
      contactId: string;
    };
  };
}

const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const [contact, setContact] = useState<Contact | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [contactId]);

  const loadData = async () => {
    try {
      const [contactsData, settingsData] = await Promise.all([
        loadContacts(),
        loadSettings(),
      ]);
      
      const foundContact = contactsData.find(c => c.id === contactId);
      setContact(foundContact || null);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('错误', '加载联系人信息失败');
    }
  };

  const handlePhoneCall = () => {
    if (contact?.phoneNumber) {
      makePhoneCall(contact.phoneNumber);
    }
  };

  const handleWechatCall = () => {
    if (contact?.wechatId) {
      Alert.alert('提示', `即将通过微信联系 ${contact.name}`);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditContact', { contactId });
  };

  const handleDelete = () => {
    if (!contact) return;

    Alert.alert(
      '删除联系人',
      `确定要删除联系人 ${contact.name} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteContact(contactId);
              Alert.alert('成功', '联系人已删除', [
                {
                  text: '确定',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('错误', '删除联系人失败');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderAvatar = () => {
    if (contact?.avatar) {
      return (
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      );
    }
    
    const initial = contact?.name.charAt(0).toUpperCase() || '?';
    return (
      <View style={[styles.avatar, styles.defaultAvatar]}>
        <Text style={[styles.avatarText, { fontSize: FONT_SIZES[fontSize].title }]}>
          {initial}
        </Text>
      </View>
    );
  };

  if (!contact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { fontSize: FONT_SIZES['large'].body }]}>
            联系人不存在
          </Text>
          <Button
            title="返回"
            onPress={() => navigation.goBack()}
            fontSize="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  const fontSize = settings?.fontSize || 'large';

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
          联系人详情
        </Text>
        <Button
          title="编辑"
          onPress={handleEdit}
          size="medium"
          fontSize={fontSize}
          style={styles.editButton}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 头像和基本信息 */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {renderAvatar()}
            {contact.isEmergency && (
              <View style={styles.emergencyBadge}>
                <Text style={styles.emergencyText}>急</Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.name, { fontSize: FONT_SIZES[fontSize].title }]}>
            {contact.name}
          </Text>
          
          <View style={styles.badges}>
            {contact.isFavorite && (
              <View style={styles.favoriteBadge}>
                <Text style={[styles.badgeText, { fontSize: FONT_SIZES[fontSize].caption }]}>
                  常用
                </Text>
              </View>
            )}
            {contact.isEmergency && (
              <View style={styles.emergencyContactBadge}>
                <Text style={[styles.badgeText, { fontSize: FONT_SIZES[fontSize].caption }]}>
                  紧急联系人
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 联系方式 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            联系方式
          </Text>
          
          {contact.phoneNumber && (
            <View style={styles.contactItem}>
              <Text style={[styles.contactLabel, { fontSize: FONT_SIZES[fontSize].body }]}>
                手机号码
              </Text>
              <Text style={[styles.contactValue, { fontSize: FONT_SIZES[fontSize].body }]}>
                {contact.phoneNumber}
              </Text>
              <Button
                title="拨打电话"
                onPress={handlePhoneCall}
                variant="secondary"
                size="small"
                fontSize={fontSize}
                style={styles.contactButton}
              />
            </View>
          )}
          
          {contact.wechatId && (
            <View style={styles.contactItem}>
              <Text style={[styles.contactLabel, { fontSize: FONT_SIZES[fontSize].body }]}>
                微信号
              </Text>
              <Text style={[styles.contactValue, { fontSize: FONT_SIZES[fontSize].body }]}>
                {contact.wechatId}
              </Text>
              <Button
                title="微信通话"
                onPress={handleWechatCall}
                variant="secondary"
                size="small"
                fontSize={fontSize}
                style={styles.contactButton}
              />
            </View>
          )}
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionsSection}>
          <Button
            title="编辑联系人"
            onPress={handleEdit}
            fontSize={fontSize}
            style={styles.actionButton}
          />
          <Button
            title="删除联系人"
            onPress={handleDelete}
            variant="emergency"
            fontSize={fontSize}
            loading={loading}
            style={styles.actionButton}
          />
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
  editButton: {
    minWidth: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  defaultAvatar: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
  emergencyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.EMERGENCY,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  favoriteBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  emergencyContactBadge: {
    backgroundColor: COLORS.EMERGENCY,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  badgeText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
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
  contactItem: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  contactLabel: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  contactValue: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
  actionsSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  errorText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});

export default ContactDetailScreen;
