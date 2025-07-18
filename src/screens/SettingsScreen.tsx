import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { AppSettings } from '../types';
import { Button } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, DEFAULT_SETTINGS } from '../constants';
import { loadSettings, saveSettings, clearAllData } from '../utils';
import { VoiceAssistantService } from '../services';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const userSettings = await loadSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('错误', '加载设置失败');
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('错误', '保存设置失败');
    }
  };

  const handleFontSizeChange = (fontSize: AppSettings['fontSize']) => {
    updateSettings({ fontSize });
  };

  const handleThemeChange = (theme: AppSettings['theme']) => {
    updateSettings({ theme });
  };

  const handleVoiceAssistantToggle = (enabled: boolean) => {
    updateSettings({ voiceAssistantEnabled: enabled });
    VoiceAssistantService.setEnabled(enabled);
  };

  const handleTestVoiceAssistant = () => {
    if (!settings.voiceAssistantEnabled) {
      Alert.alert('提示', '请先启用语音助手功能');
      return;
    }
    VoiceAssistantService.startListening();
  };

  const showVoiceCommands = () => {
    const commands = VoiceAssistantService.getSupportedCommands();
    const commandText = commands.map(category =>
      `${category.category}:\n${category.examples.map(example => `• ${example}`).join('\n')}`
    ).join('\n\n');

    Alert.alert(
      '支持的语音指令',
      commandText,
      [{ text: '知道了' }],
      { cancelable: true }
    );
  };

  const handleClearData = () => {
    Alert.alert(
      '清除数据',
      '确定要清除所有数据吗？这将删除所有联系人和设置，且无法恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await clearAllData();
              setSettings(DEFAULT_SETTINGS);
              Alert.alert('成功', '数据已清除');
            } catch (error) {
              Alert.alert('错误', '清除数据失败');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderFontSizeOption = (size: AppSettings['fontSize'], label: string) => (
    <TouchableOpacity
      key={size}
      style={[
        styles.optionButton,
        settings.fontSize === size && styles.selectedOption,
      ]}
      onPress={() => handleFontSizeChange(size)}
    >
      <Text
        style={[
          styles.optionText,
          { fontSize: FONT_SIZES[size].body },
          settings.fontSize === size && styles.selectedOptionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderThemeOption = (theme: AppSettings['theme'], label: string) => (
    <TouchableOpacity
      key={theme}
      style={[
        styles.optionButton,
        settings.theme === theme && styles.selectedOption,
      ]}
      onPress={() => handleThemeChange(theme)}
    >
      <Text
        style={[
          styles.optionText,
          { fontSize: FONT_SIZES[settings.fontSize].body },
          settings.theme === theme && styles.selectedOptionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Button
          title="← 返回"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          fontSize={settings.fontSize}
          style={styles.backButton}
        />
        <Text style={[styles.title, { fontSize: FONT_SIZES[settings.fontSize].title }]}>
          设置
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 字体大小设置 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[settings.fontSize].subtitle }]}>
            字体大小
          </Text>
          <View style={styles.optionsContainer}>
            {renderFontSizeOption('small', '小')}
            {renderFontSizeOption('medium', '中')}
            {renderFontSizeOption('large', '大')}
            {renderFontSizeOption('extra-large', '特大')}
          </View>
        </View>

        {/* 主题设置 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[settings.fontSize].subtitle }]}>
            主题
          </Text>
          <View style={styles.optionsContainer}>
            {renderThemeOption('light', '浅色')}
            {renderThemeOption('dark', '深色')}
            {renderThemeOption('high-contrast', '高对比度')}
          </View>
        </View>

        {/* 语音助手设置 */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[settings.fontSize].subtitle }]}>
              语音助手
            </Text>
            <Switch
              value={settings.voiceAssistantEnabled}
              onValueChange={handleVoiceAssistantToggle}
              trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY_LIGHT }}
              thumbColor={settings.voiceAssistantEnabled ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
            />
          </View>
          <Text style={[styles.sectionDescription, { fontSize: FONT_SIZES[settings.fontSize].caption }]}>
            启用后可以使用语音指令操作应用
          </Text>

          {settings.voiceAssistantEnabled && (
            <View style={styles.voiceAssistantActions}>
              <Button
                title="测试语音助手"
                onPress={handleTestVoiceAssistant}
                variant="secondary"
                size="small"
                fontSize={settings.fontSize}
                style={styles.voiceButton}
              />
              <Button
                title="查看指令"
                onPress={showVoiceCommands}
                variant="outline"
                size="small"
                fontSize={settings.fontSize}
                style={styles.voiceButton}
              />
            </View>
          )}
        </View>

        {/* 数据管理 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[settings.fontSize].subtitle }]}>
            数据管理
          </Text>
          <Button
            title="清除所有数据"
            onPress={handleClearData}
            variant="emergency"
            fontSize={settings.fontSize}
            loading={loading}
            style={styles.clearButton}
          />
          <Text style={[styles.warningText, { fontSize: FONT_SIZES[settings.fontSize].caption }]}>
            注意：此操作将删除所有联系人和设置，且无法恢复
          </Text>
        </View>

        {/* 应用信息 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: FONT_SIZES[settings.fontSize].subtitle }]}>
            应用信息
          </Text>
          <Text style={[styles.infoText, { fontSize: FONT_SIZES[settings.fontSize].body }]}>
            老年助手 v1.0.0
          </Text>
          <Text style={[styles.infoText, { fontSize: FONT_SIZES[settings.fontSize].caption }]}>
            专为老年人设计的简易通讯助手
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
  backButton: {
    minWidth: 80,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 80,
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
  sectionDescription: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE,
  },
  selectedOption: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  optionText: {
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    marginBottom: SPACING.sm,
  },
  warningText: {
    color: COLORS.ERROR,
    textAlign: 'center',
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  voiceAssistantActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  voiceButton: {
    flex: 1,
  },
});

export default SettingsScreen;
