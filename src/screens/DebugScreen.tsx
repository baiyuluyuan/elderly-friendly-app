import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Button } from '../components';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';
import {
  initializeTestData,
  PerformanceMonitor,
  getMemoryUsage,
  ErrorLogger,
  UserAnalytics,
  performHealthCheck,
} from '../utils';

interface DebugScreenProps {
  navigation: any;
}

const DebugScreen: React.FC<DebugScreenProps> = ({ navigation }) => {
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0, percentage: 0 });
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateMemoryUsage = () => {
    setMemoryUsage(getMemoryUsage());
  };

  const handleInitTestData = async () => {
    try {
      await initializeTestData();
      Alert.alert('成功', '测试数据已初始化');
    } catch (error) {
      Alert.alert('错误', '初始化测试数据失败');
    }
  };

  const handlePerformanceTest = async () => {
    Alert.alert('性能测试', '开始性能测试...');
    
    // 测试存储性能
    await PerformanceMonitor.measureAsync('storage_test', async () => {
      await initializeTestData();
    });
    
    // 测试渲染性能
    PerformanceMonitor.startTimer('render_test');
    setTimeout(() => {
      PerformanceMonitor.endTimer('render_test');
      Alert.alert('性能测试', '性能测试完成，请查看控制台日志');
    }, 1000);
  };

  const handleHealthCheck = async () => {
    try {
      const health = await performHealthCheck();
      setHealthStatus(health);
      
      const statusText = health.checks
        .map(check => `${check.name}: ${check.status === 'pass' ? '✅' : '❌'} ${check.message}`)
        .join('\n');
      
      Alert.alert(
        `健康检查 - ${health.status.toUpperCase()}`,
        statusText
      );
    } catch (error) {
      Alert.alert('错误', '健康检查失败');
    }
  };

  const handleShowErrors = () => {
    const errorSummary = ErrorLogger.getErrorSummary();
    const errorText = `总错误数: ${errorSummary.totalErrors}\n最近错误: ${errorSummary.recentErrors}\n\n常见错误:\n${errorSummary.commonErrors.map(e => `${e.message} (${e.count}次)`).join('\n')}`;
    
    Alert.alert('错误统计', errorText);
  };

  const handleShowAnalytics = () => {
    const analytics = UserAnalytics.getActionSummary();
    const analyticsText = `总操作数: ${analytics.totalActions}\n唯一操作: ${analytics.uniqueActions}\n\n常用操作:\n${analytics.mostCommonActions.slice(0, 5).map(a => `${a.action} (${a.count}次)`).join('\n')}`;
    
    Alert.alert('用户分析', analyticsText);
  };

  const handleClearData = () => {
    Alert.alert(
      '清除调试数据',
      '确定要清除所有调试数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            ErrorLogger.clearErrors();
            UserAnalytics.clearActions();
            Alert.alert('成功', '调试数据已清除');
          },
        },
      ]
    );
  };

  const handleTestError = () => {
    try {
      throw new Error('这是一个测试错误');
    } catch (error) {
      ErrorLogger.logError(error as Error, 'Debug Screen Test');
      Alert.alert('测试错误', '已记录一个测试错误');
    }
  };

  const handleTrackAction = () => {
    UserAnalytics.trackAction('debug_action_test', { timestamp: Date.now() });
    Alert.alert('操作追踪', '已记录一个测试操作');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Button
          title="← 返回"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          style={styles.backButton}
        />
        <Text style={styles.title}>调试工具</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 系统状态 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>系统状态</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>
              内存使用: {memoryUsage.used}MB / {memoryUsage.total}MB ({memoryUsage.percentage}%)
            </Text>
            {healthStatus && (
              <Text style={[styles.statusText, { color: healthStatus.status === 'healthy' ? COLORS.SUCCESS : COLORS.ERROR }]}>
                健康状态: {healthStatus.status.toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        {/* 测试数据 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>测试数据</Text>
          <Button
            title="初始化测试数据"
            onPress={handleInitTestData}
            style={styles.actionButton}
          />
          <Button
            title="清除调试数据"
            onPress={handleClearData}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        {/* 性能测试 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性能测试</Text>
          <Button
            title="运行性能测试"
            onPress={handlePerformanceTest}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="健康检查"
            onPress={handleHealthCheck}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        {/* 错误和分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>监控和分析</Text>
          <Button
            title="查看错误统计"
            onPress={handleShowErrors}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="查看用户分析"
            onPress={handleShowAnalytics}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="测试错误记录"
            onPress={handleTestError}
            variant="emergency"
            style={styles.actionButton}
          />
          <Button
            title="测试操作追踪"
            onPress={handleTrackAction}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        {/* 应用信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>应用信息</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>版本: 1.0.0</Text>
            <Text style={styles.infoText}>构建: Debug</Text>
            <Text style={styles.infoText}>平台: React Native</Text>
            <Text style={styles.infoText}>启动时间: {new Date().toLocaleString()}</Text>
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
    fontSize: FONT_SIZES.large.title,
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
    fontSize: FONT_SIZES.large.subtitle,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  statusCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZES.large.body,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  infoText: {
    fontSize: FONT_SIZES.large.caption,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
});

export default DebugScreen;
