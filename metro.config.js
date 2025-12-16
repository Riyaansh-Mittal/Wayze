const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Remove 'svg' from assetExts (treat it as source code instead)
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    // Add 'svg' to sourceExts
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
