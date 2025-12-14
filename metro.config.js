const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

