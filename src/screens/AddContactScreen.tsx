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
import { addContact, loadSettings, validatePhoneNumber } from '../utils';

interface AddContactScreenProps {
  navigation: any;
}

const AddContactScreen: React.FC<AddContactScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    wechatId: '',
    isEmergency: false,
    isFavorite: false,
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const userSettings = await loadSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
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
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        wechatId: formData.wechatId.trim() || undefined,
        isEmergency: formData.isEmergency,
        isFavorite: formData.isFavorite,
      };

      await addContact(newContact);
      Alert.alert('成功', '联系人已添加', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('错误', '添加联系人失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fontSize = settings?.fontSize || 'large';

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Button
          title="取消"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          fontSize={fontSize}
          style={styles.cancelButton}
        />
        <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
          添加联系人
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
});

export default AddContactScreen;
