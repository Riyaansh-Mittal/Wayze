import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

const ActionCard = ({ title, subtitle, icon, backgroundColor, onPress }) => {
  const { theme } = useTheme();
  const { spacing, typography } = theme;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        {icon}
      </View>

      <Text style={[typography.h2, styles.title]}>{title}</Text>

      {subtitle ? (
        <Text style={[typography.body, styles.subtitle]}>{subtitle}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
});

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ActionCard;