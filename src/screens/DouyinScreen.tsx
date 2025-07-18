import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from '../components';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { loadSettings } from '../utils';

interface DouyinScreenProps {
  navigation: any;
}

const DouyinScreen: React.FC<DouyinScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fontSize, setFontSize] = useState<keyof typeof FONT_SIZES>('large');

  React.useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const settings = await loadSettings();
      setFontSize(settings.fontSize);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button
            title="← 返回"
            onPress={handleGoBack}
            variant="outline"
            size="medium"
            fontSize={fontSize}
            style={styles.backButton}
          />
          <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
            抖音
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { fontSize: FONT_SIZES[fontSize].subtitle }]}>
            加载失败
          </Text>
          <Text style={[styles.errorMessage, { fontSize: FONT_SIZES[fontSize].body }]}>
            无法连接到抖音，请检查网络连接
          </Text>
          <Button
            title="重试"
            onPress={handleRetry}
            fontSize={fontSize}
            style={styles.retryButton}
          />
          <Button
            title="返回首页"
            onPress={handleGoBack}
            variant="outline"
            fontSize={fontSize}
            style={styles.homeButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Button
          title="← 返回"
          onPress={handleGoBack}
          variant="outline"
          size="medium"
          fontSize={fontSize}
          style={styles.backButton}
        />
        <Text style={[styles.title, { fontSize: FONT_SIZES[fontSize].title }]}>
          抖音
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* 加载指示器 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={[styles.loadingText, { fontSize: FONT_SIZES[fontSize].body }]}>
            正在加载抖音...
          </Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        source={{ uri: 'https://www.douyin.com' }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      />
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
    backgroundColor: COLORS.BACKGROUND,
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
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    zIndex: 1,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorTitle: {
    color: COLORS.ERROR,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  errorMessage: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    minWidth: 120,
    marginBottom: SPACING.md,
  },
  homeButton: {
    minWidth: 120,
  },
});

export default DouyinScreen;
