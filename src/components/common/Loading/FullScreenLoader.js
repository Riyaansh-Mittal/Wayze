/**
 * Full Screen Loader Component
 * Covers entire screen with loading indicator
 */

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../config/theme';

const FullScreenLoader = ({
  visible,
  message = 'Loading...',
  testID,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      testID={testID}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Spinner size="large" color={COLORS.primary} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginTop: SPACING.base,
    textAlign: 'center',
  },
});

FullScreenLoader.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string,
  testID: PropTypes.string,
};

export default FullScreenLoader;
