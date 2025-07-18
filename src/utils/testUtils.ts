import { Contact, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { saveContacts, saveSettings } from './storage';

// 生成测试联系人数据
export const generateTestContacts = (): Contact[] => {
  return [
    {
      id: '1',
      name: '妈妈',
      phoneNumber: '13800138001',
      wechatId: 'mama_wechat',
      isEmergency: true,
      isFavorite: true,
    },
    {
      id: '2',
      name: '儿子',
      phoneNumber: '13800138002',
      wechatId: 'son_wechat',
      isEmergency: false,
      isFavorite: true,
    },
    {
      id: '3',
      name: '女儿',
      phoneNumber: '13800138003',
      wechatId: 'daughter_wechat',
      isEmergency: false,
      isFavorite: true,
    },
    {
      id: '4',
      name: '老王',
      phoneNumber: '13800138004',
      wechatId: 'laowang_wechat',
      isEmergency: false,
      isFavorite: false,
    },
    {
      id: '5',
      name: '李医生',
      phoneNumber: '13800138005',
      isEmergency: true,
      isFavorite: false,
    },
    {
      id: '6',
      name: '张阿姨',
      phoneNumber: '13800138006',
      wechatId: 'zhangayi_wechat',
      isEmergency: false,
      isFavorite: true,
    },
  ];
};

// 生成测试设置数据
export const generateTestSettings = (): AppSettings => {
  return {
    ...DEFAULT_SETTINGS,
    fontSize: 'large',
    theme: 'light',
    voiceAssistantEnabled: true,
    emergencyContacts: ['1', '5'], // 妈妈和李医生
    language: 'zh-CN',
  };
};

// 初始化测试数据
export const initializeTestData = async (): Promise<void> => {
  try {
    const testContacts = generateTestContacts();
    const testSettings = generateTestSettings();
    
    await Promise.all([
      saveContacts(testContacts),
      saveSettings(testSettings),
    ]);
    
    console.log('测试数据初始化完成');
  } catch (error) {
    console.error('初始化测试数据失败:', error);
    throw error;
  }
};

// 性能测试工具
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();
  
  static startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }
  
  static endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer ${name} not found`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    this.timers.delete(name);
    console.log(`${name} took ${duration}ms`);
    return duration;
  }
  
  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(name);
      try {
        const result = await fn();
        this.endTimer(name);
        resolve(result);
      } catch (error) {
        this.endTimer(name);
        reject(error);
      }
    });
  }
}

// 内存使用监控
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  // React Native 中获取内存使用情况的简化版本
  // 实际项目中可能需要使用原生模块
  const used = (performance as any).memory?.usedJSHeapSize || 0;
  const total = (performance as any).memory?.totalJSHeapSize || 0;
  
  return {
    used: Math.round(used / 1024 / 1024), // MB
    total: Math.round(total / 1024 / 1024), // MB
    percentage: total > 0 ? Math.round((used / total) * 100) : 0,
  };
};

// 错误日志收集
export class ErrorLogger {
  private static errors: Array<{
    timestamp: Date;
    error: Error;
    context?: string;
  }> = [];
  
  static logError(error: Error, context?: string): void {
    this.errors.push({
      timestamp: new Date(),
      error,
      context,
    });
    
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
  
  static getErrors(): Array<{
    timestamp: Date;
    error: Error;
    context?: string;
  }> {
    return [...this.errors];
  }
  
  static clearErrors(): void {
    this.errors = [];
  }
  
  static getErrorSummary(): {
    totalErrors: number;
    recentErrors: number;
    commonErrors: Array<{ message: string; count: number }>;
  } {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const recentErrors = this.errors.filter(
      e => e.timestamp.getTime() > oneHourAgo
    );
    
    const errorCounts = new Map<string, number>();
    this.errors.forEach(e => {
      const message = e.error.message;
      errorCounts.set(message, (errorCounts.get(message) || 0) + 1);
    });
    
    const commonErrors = Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      commonErrors,
    };
  }
}

// 用户行为分析
export class UserAnalytics {
  private static actions: Array<{
    action: string;
    timestamp: Date;
    data?: any;
  }> = [];
  
  static trackAction(action: string, data?: any): void {
    this.actions.push({
      action,
      timestamp: new Date(),
      data,
    });
    
    console.log('Action tracked:', { action, data, timestamp: new Date().toISOString() });
  }
  
  static getActionSummary(): {
    totalActions: number;
    uniqueActions: number;
    mostCommonActions: Array<{ action: string; count: number }>;
    recentActions: Array<{ action: string; timestamp: Date }>;
  } {
    const actionCounts = new Map<string, number>();
    this.actions.forEach(a => {
      actionCounts.set(a.action, (actionCounts.get(a.action) || 0) + 1);
    });
    
    const mostCommonActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const recentActions = this.actions
      .slice(-20)
      .map(a => ({ action: a.action, timestamp: a.timestamp }));
    
    return {
      totalActions: this.actions.length,
      uniqueActions: actionCounts.size,
      mostCommonActions,
      recentActions,
    };
  }
  
  static clearActions(): void {
    this.actions = [];
  }
}

// 应用健康检查
export const performHealthCheck = async (): Promise<{
  status: 'healthy' | 'warning' | 'error';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail';
    message: string;
  }>;
}> => {
  const checks = [];
  let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy';
  
  // 检查存储功能
  try {
    await saveSettings(DEFAULT_SETTINGS);
    checks.push({
      name: 'Storage',
      status: 'pass' as const,
      message: '存储功能正常',
    });
  } catch (error) {
    checks.push({
      name: 'Storage',
      status: 'fail' as const,
      message: '存储功能异常',
    });
    overallStatus = 'error';
  }
  
  // 检查内存使用
  const memory = getMemoryUsage();
  if (memory.percentage > 80) {
    checks.push({
      name: 'Memory',
      status: 'fail' as const,
      message: `内存使用过高: ${memory.percentage}%`,
    });
    overallStatus = overallStatus === 'healthy' ? 'warning' : 'error';
  } else {
    checks.push({
      name: 'Memory',
      status: 'pass' as const,
      message: `内存使用正常: ${memory.percentage}%`,
    });
  }
  
  // 检查错误率
  const errorSummary = ErrorLogger.getErrorSummary();
  if (errorSummary.recentErrors > 5) {
    checks.push({
      name: 'Error Rate',
      status: 'fail' as const,
      message: `最近错误过多: ${errorSummary.recentErrors}`,
    });
    overallStatus = overallStatus === 'healthy' ? 'warning' : 'error';
  } else {
    checks.push({
      name: 'Error Rate',
      status: 'pass' as const,
      message: '错误率正常',
    });
  }
  
  return {
    status: overallStatus,
    checks,
  };
};
