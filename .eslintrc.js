module.exports = {
  root: true,
  extends: '@react-native',
  globals: {
    Buffer: 'readonly', // ✅ Tell ESLint that Buffer is available
  },
};
