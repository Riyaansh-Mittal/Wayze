/**
 * Design System - Complete TOON Specification Implementation
 * Single source of truth for all design tokens
 */

// ═══════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  // Brand Colors
  primary: '#1565C0', // Buttons, Active States, Links
  success: '#2E7D32', // Verification Badges, Success Messages
  warning: '#F57C00', // Alerts, Important Notices
  error: '#C62828', // Errors, Destructive Actions, Validation

  // Neutral Colors
  white: '#FFFFFF', // App Background
  neutralLight: '#F5F5F5', // Card Surfaces, Input Backgrounds
  neutralBorder: '#E0E0E0', // Dividers, Borders

  // Text Colors
  textPrimary: '#212121', // Headings, Body (16:1 contrast)
  textSecondary: '#616161', // Captions, Meta Info (7:1 contrast)
  textDisabled: '#9E9E9E', // Placeholders, Disabled States

  // Functional Colors
  successLight: '#E8F5E9',
  warningLight: '#FFF3E0',
  errorLight: '#FFEBEE',
  primaryLight: '#E3F2FD',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════

export const FONTS = {
  family: {
    primary: 'Inter',
    fallbackIOS: 'SF Pro Text',
    fallbackAndroid: 'Roboto',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const FONT_SIZES = {
  h1: 28, // Screen Title
  h2: 20, // Section Header
  body: 18, // Default Body Text
  bodyInput: 18, // Input Text
  button: 18, // Button Label
  caption: 16, // Small Text
  plateNumber: 24, // Special - Plate Number Display
  small: 14, // Helper text
  tiny: 12, // Timestamp, metadata
};

export const LINE_HEIGHTS = {
  h1: 36,
  h2: 28,
  body: 26,
  bodyInput: 24,
  button: 24,
  caption: 22,
  plateNumber: 32,
  small: 20,
  tiny: 18,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: FONT_SIZES.h1,
    lineHeight: LINE_HEIGHTS.h1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  h2: {
    fontSize: FONT_SIZES.h2,
    lineHeight: LINE_HEIGHTS.h2,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  body: {
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  bodyBold: {
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  caption: {
    fontSize: FONT_SIZES.caption,
    lineHeight: LINE_HEIGHTS.caption,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textSecondary,
    fontFamily: FONTS.family.primary,
  },
  captionBold: {
    fontSize: FONT_SIZES.caption,
    lineHeight: LINE_HEIGHTS.caption,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  button: {
    fontSize: FONT_SIZES.button,
    lineHeight: LINE_HEIGHTS.button,
    fontWeight: FONTS.weight.medium,
    fontFamily: FONTS.family.primary,
  },
  plateNumber: {
    fontSize: FONT_SIZES.plateNumber,
    lineHeight: LINE_HEIGHTS.plateNumber,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  small: {
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHTS.small,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textSecondary,
    fontFamily: FONTS.family.primary,
  },
  tiny: {
    fontSize: FONT_SIZES.tiny,
    lineHeight: LINE_HEIGHTS.tiny,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textSecondary,
    fontFamily: FONTS.family.primary,
  },
};

// ═══════════════════════════════════════════════════════════════
// SPACING SYSTEM
// ═══════════════════════════════════════════════════════════════

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Common spacing patterns
export const LAYOUT = {
  screenPadding: SPACING.lg, // 24dp
  sectionGap: SPACING.xl, // 32dp
  cardGap: SPACING.base, // 16dp
  fieldGap: SPACING.lg, // 24dp
  buttonGap: SPACING.md, // 12dp
};

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════

export const RADIUS = {
  small: 6,
  medium: 8,
  large: 12,
  xlarge: 20,
  round: 999,
};

// ═══════════════════════════════════════════════════════════════
// SHADOWS / ELEVATION
// ═══════════════════════════════════════════════════════════════

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 16,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT STYLES
// ═══════════════════════════════════════════════════════════════

export const COMPONENTS = {
  // Primary Button
  primaryButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },

  // Secondary Button
  secondaryButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },

  // Destructive Button
  destructiveButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },

  // Input Field
  inputField: {
    height: 56,
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    borderColorDefault: COLORS.neutralBorder,
    borderColorFocused: COLORS.primary,
    borderColorError: COLORS.error,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZES.bodyInput,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.neutralBorder,
    padding: SPACING.base,
    ...SHADOWS.card,
  },

  // Bottom Navigation
  bottomNav: {
    height: 64,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralBorder,
    iconSize: 28,
    labelSize: 12,
  },

  // App Bar
  appBar: {
    height: 64,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutralBorder,
    paddingHorizontal: SPACING.base,
  },

  // Avatar
  avatar: {
    small: 40,
    medium: 48,
    large: 80,
    xlarge: 100,
  },

  // Badge
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xlarge,
    fontSize: FONT_SIZES.small,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.neutralBorder,
  },

  // Icon Button
  iconButton: {
    size: 48,
    iconSize: 28,
  },
};

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const ANIMATIONS = {
  standard: 200, // ms - Standard transition
  screen: 300, // ms - Screen push
  modal: 250, // ms - Modal slide
  easing: {
    default: 'ease-in-out',
    spring: {
      damping: 15,
      stiffness: 150,
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════

export const ACCESSIBILITY = {
  minTouchTarget: 48, // dp - WCAG AA minimum
  minFontSize: 16, // pt - Minimum readable size
  contrastRatios: {
    normalText: 4.5, // WCAG AA
    largeText: 3, // WCAG AA
    enhanced: 7, // WCAG AAA
  },
  focusOutlineWidth: 3,
  focusOutlineColor: COLORS.primary,
};

// ═══════════════════════════════════════════════════════════════
// EXPORT COMPLETE THEME
// ═══════════════════════════════════════════════════════════════

const theme = {
  colors: COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  layout: LAYOUT,
  radius: RADIUS,
  shadows: SHADOWS,
  components: COMPONENTS,
  animations: ANIMATIONS,
  accessibility: ACCESSIBILITY,
};

export default theme;
