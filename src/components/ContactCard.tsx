import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Contact } from '../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onPhonePress?: () => void;
  onWechatPress?: () => void;
  fontSize?: keyof typeof FONT_SIZES;
  style?: ViewStyle;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onPress,
  onPhonePress,
  onWechatPress,
  fontSize = 'large',
  style,
}) => {
  const renderAvatar = () => {
    if (contact.avatar) {
      return (
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      );
    }
    
    // 默认头像，显示姓名首字母
    const initial = contact.name.charAt(0).toUpperCase();
    return (
      <View style={[styles.avatar, styles.defaultAvatar]}>
        <Text style={[styles.avatarText, { fontSize: FONT_SIZES[fontSize].title }]}>
          {initial}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* 头像 */}
        <View style={styles.avatarContainer}>
          {renderAvatar()}
          {contact.isEmergency && (
            <View style={styles.emergencyBadge}>
              <Text style={styles.emergencyText}>急</Text>
            </View>
          )}
        </View>

        {/* 联系人信息 */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.name, { fontSize: FONT_SIZES[fontSize].subtitle }]}
            numberOfLines={1}
          >
            {contact.name}
          </Text>
          
          {contact.phoneNumber && (
            <Text
              style={[styles.phone, { fontSize: FONT_SIZES[fontSize].caption }]}
              numberOfLines={1}
            >
              {contact.phoneNumber}
            </Text>
          )}
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionsContainer}>
          {contact.phoneNumber && onPhonePress && (
            <TouchableOpacity
              style={[styles.actionButton, styles.phoneButton]}
              onPress={onPhonePress}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, { fontSize: FONT_SIZES[fontSize].caption }]}>
                电话
              </Text>
            </TouchableOpacity>
          )}
          
          {contact.wechatId && onWechatPress && (
            <TouchableOpacity
              style={[styles.actionButton, styles.wechatButton]}
              onPress={onWechatPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, { fontSize: FONT_SIZES[fontSize].caption }]}>
                微信
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  name: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  phone: {
    color: COLORS.TEXT_SECONDARY,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 60,
    alignItems: 'center',
  },
  phoneButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  wechatButton: {
    backgroundColor: COLORS.INFO,
  },
  actionText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
});

export default ContactCard;
