import React from 'react';

const WebView = ({ source, style, onLoadStart, onLoadEnd, onError, ...props }) => {
  React.useEffect(() => {
    if (onLoadStart) onLoadStart();
    
    // 模拟加载完成
    const timer = setTimeout(() => {
      if (onLoadEnd) onLoadEnd();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      ...style,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#666',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎵</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
          抖音短视频
        </div>
        <div style={{ fontSize: '14px' }}>
          Web版本演示
        </div>
        <div style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
          {source?.uri || '正在加载...'}
        </div>
      </div>
    </div>
  );
};

export default WebView;
