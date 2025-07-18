import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from '../App';

// 注册应用
AppRegistry.registerComponent('ElderlyFriendlyApp', () => App);

// 获取根元素
const container = document.getElementById('root');
const root = createRoot(container);

// 渲染应用
const PhoneWrapper = () => {
  return (
    <div style={{
      width: '375px',
      height: '667px',
      background: '#000',
      borderRadius: '25px',
      padding: '10px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <App />
      </div>
    </div>
  );
};

root.render(<PhoneWrapper />);
