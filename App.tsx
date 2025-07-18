/**
 * 老年助手 - 专为老年人设计的简易通讯应用
 * Elderly Friendly App
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 导入屏幕组件
import {
  HomeScreen,
  ContactsScreen,
  DouyinScreen,
  SettingsScreen,
  AddContactScreen,
  EditContactScreen,
  ContactDetailScreen,
  EmergencyScreen,
} from './src/screens';

// 导入类型
import { RootStackParamList } from './src/types';
import { COLORS } from './src/constants';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    // 应用启动时的初始化
    console.log('老年助手应用启动');

    // Web环境下的欢迎提示
    if (Platform.OS === 'web') {
      setTimeout(() => {
        Alert.alert(
          '欢迎使用老年助手',
          '这是Web演示版本，您可以体验所有界面和基础功能。\n\n在真实设备上，所有功能都将正常工作。',
          [{ text: '开始体验' }]
        );
      }, 1000);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.BACKGROUND}
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // 我们使用自定义标题栏
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Contacts" component={ContactsScreen} />
          <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
          <Stack.Screen name="AddContact" component={AddContactScreen} />
          <Stack.Screen name="EditContact" component={EditContactScreen} />
          <Stack.Screen name="Douyin" component={DouyinScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Emergency" component={EmergencyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
