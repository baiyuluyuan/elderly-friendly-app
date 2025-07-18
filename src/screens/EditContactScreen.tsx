import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Contact, AppSettings } from '../types';
import { Button } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import { loadContacts, loadSettings, updateContact, validatePhoneNumber } from '../utils';

interface EditContactScreenProps {
  navigation: any;
  route: {
    params: {
      contactId: string;
    };
  };
}

const EditContactScreen: React.FC<EditContactScreenProps> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalContact, setOriginalContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    wechatId: '',
    isEmergency: false,
    isFavorite: false,
  });

  useEffect(() => {
    loadData();
  }, [contactId]);

  const loadData = async () => {
    try {
      const [contactsData, settingsData] = await Promise.all([
        loadContacts(),
        loadSettings(),
      ]);
      
      const contact = contactsData.find(c => c.id === contactId);
      if (contact) {
        setOriginalContact(contact);
        setFormData({
          name: contact.name,
          phoneNumber: contact.phoneNumber || '',
          wechatId: contact.wechatId || '',
          isEmergency: contact.isEmergency || false,
          isFavorite: contact.isFavorite || false,
        });
      } else {
        Alert.alert('错误', '联系人不存在', [
          { text: '确定', onPress: () => navigation.goBack() },
        ]);
      }
      
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('错误', '加载联系人信息失败');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('错误', '请输入联系人姓名');
      return false;
    }

    if (!formData.phoneNumber.trim() && !formData.wechatId.trim()) {
      Alert.alert('错误', '请至少输入手机号码或微信号');
      return false;
    }

    if (formData.phoneNumber.trim() && !validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('错误', '请输入有效的手机号码');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !originalContact) {
      return;
    }

    setLoading(true);
    try {
      const updatedData: Partial<Contact> = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        wechatId: formData.wechatId.trim() || undefined,
        isEmergency: formData.isEmergency,
        isFavorite: formData.isFavorite,
      };

      await updateContact(contactId, updatedData);
      Alert.alert('成功', '联系人已更新', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('错误', '更新联系人失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // 检查是否有未保存的更改
    const hasChanges = 
      formData.name !== originalContact?.name ||
      formData.phoneNumber !== (originalContact?.phoneNumber || '') ||
      formData.wechatId !== (originalContact?.wechatId || '') ||
      formData.isEmergency !== (originalContact?.isEmergency || false) ||
      formData.isFavorite !== (originalContact?.isFavorite || false);

    if (hasChanges) {
      Alert.alert(
        '放弃更改',
        '您有未保存的更改，确定要放弃吗？',
        [
          { text: '继续编辑', style: 'cancel' },
          { text: '放弃', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (!originalContact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontSize: FONT_SIZES['large'].body }]}>
            加载中...
          </Text>
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
          title="取消"
          onPress={handleCancel}
          variant="outline"
          size="medium"
          fontSize={fontSize}
          style={styles.cancelButton}
        />
        <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
          编辑联系人
        </Text>
        <Button
          title="保存"
          onPress={handleSave}
          size="medium"
          fontSize={fontSize}
          loading={loading}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 基本信息 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            基本信息
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { fontSize: FONT_SIZES[fontSize].body }]}>
              姓名 *
            </Text>
            <TextInput
              style={[styles.input, { fontSize: FONT_SIZES[fontSize].body }]}
              placeholder="请输入联系人姓名"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              maxLength={20}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { fontSize: FONT_SIZES[fontSize].body }]}>
              手机号码
            </Text>
            <TextInput
              style={[styles.input, { fontSize: FONT_SIZES[fontSize].body }]}
              placeholder="请输入手机号码"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { fontSize: FONT_SIZES[fontSize].body }]}>
              微信号
            </Text>
            <TextInput
              style={[styles.input, { fontSize: FONT_SIZES[fontSize].body }]}
              placeholder="请输入微信号"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={formData.wechatId}
              onChangeText={(text) => handleInputChange('wechatId', text)}
              maxLength={30}
            />
          </View>
        </View>

        {/* 设置选项 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            设置选项
          </Text>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { fontSize: FONT_SIZES[fontSize].body }]}>
                设为常用联系人
              </Text>
              <Text style={[styles.switchDescription, { fontSize: FONT_SIZES[fontSize].caption }]}>
                常用联系人将显示在首页
              </Text>
            </View>
            <Switch
              value={formData.isFavorite}
              onValueChange={(value) => handleInputChange('isFavorite', value)}
              trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY_LIGHT }}
              thumbColor={formData.isFavorite ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { fontSize: FONT_SIZES[fontSize].body }]}>
                设为紧急联系人
              </Text>
              <Text style={[styles.switchDescription, { fontSize: FONT_SIZES[fontSize].caption }]}>
                紧急联系人将标记为红色
              </Text>
            </View>
            <Switch
              value={formData.isEmergency}
              onValueChange={(value) => handleInputChange('isEmergency', value)}
              trackColor={{ false: COLORS.BORDER, true: COLORS.EMERGENCY }}
              thumbColor={formData.isEmergency ? COLORS.EMERGENCY : COLORS.TEXT_SECONDARY}
            />
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.section}>
          <Text style={[styles.tipText, { fontSize: FONT_SIZES[fontSize].caption }]}>
            * 必填项目
          </Text>
          <Text style={[styles.tipText, { fontSize: FONT_SIZES[fontSize].caption }]}>
            请至少填写手机号码或微信号中的一项
          </Text>
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
  cancelButton: {
    minWidth: 60,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  saveButton: {
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
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 56,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  switchInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchLabel: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  switchDescription: {
    color: COLORS.TEXT_SECONDARY,
  },
  tipText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
  },
});

export default EditContactScreen;
