/**
 * Design System - Complete TOON Specification Implementation
 * Single source of truth for all design tokens
 * NOW WITH DARK MODE SUPPORT
 */

// ═══════════════════════════════════════════════════════════════
// COLOR PALETTE - LIGHT THEME
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  // Brand Colors
  primary: '#1565C0',
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',

  // Neutral Colors
  white: '#FFFFFF',
  neutralLight: '#F5F5F5',
  neutralBorder: '#E0E0E0',

  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#616161',
  textDisabled: '#9E9E9E',

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
// COLOR PALETTE - DARK THEME
// ═══════════════════════════════════════════════════════════════

export const COLORS_DARK = {
  // Brand Colors (same)
  primary: '#1565C0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF5350',

  // Neutral Colors
  white: '#1E1E1E', // Dark card background
  neutralLight: '#2C2C2C', // Darker neutral
  neutralBorder: '#3C3C3C', // Borders in dark mode

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textDisabled: '#6E6E6E',

  // Functional Colors
  successLight: '#1B5E20',
  warningLight: '#E65100',
  errorLight: '#B71C1C',
  primaryLight: '#1E3A5F',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
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
  h1: 28,
  h2: 20,
  body: 18,
  bodyInput: 18,
  button: 18,
  caption: 16,
  plateNumber: 24,
  small: 14,
  tiny: 12,
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

// Typography factory - creates typography styles with dynamic colors
const createTypography = (colors) => ({
  h1: {
    fontSize: FONT_SIZES.h1,
    lineHeight: LINE_HEIGHTS.h1,
    fontWeight: FONTS.weight.bold,
    color: colors.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  h2: {
    fontSize: FONT_SIZES.h2,
    lineHeight: LINE_HEIGHTS.h2,
    fontWeight: FONTS.weight.semibold,
    color: colors.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  body: {
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    fontWeight: FONTS.weight.regular,
    color: colors.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  bodyBold: {
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    fontWeight: FONTS.weight.semibold,
    color: colors.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  caption: {
    fontSize: FONT_SIZES.caption,
    lineHeight: LINE_HEIGHTS.caption,
    fontWeight: FONTS.weight.regular,
    color: colors.textSecondary,
    fontFamily: FONTS.family.primary,
  },
  captionBold: {
    fontSize: FONT_SIZES.caption,
    lineHeight: LINE_HEIGHTS.caption,
    fontWeight: FONTS.weight.semibold,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    fontFamily: FONTS.family.primary,
  },
  small: {
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHTS.small,
    fontWeight: FONTS.weight.regular,
    color: colors.textSecondary,
    fontFamily: FONTS.family.primary,
  },
  tiny: {
    fontSize: FONT_SIZES.tiny,
    lineHeight: LINE_HEIGHTS.tiny,
    fontWeight: FONTS.weight.regular,
    color: colors.textSecondary,
    fontFamily: FONTS.family.primary,
  },
});

export const TYPOGRAPHY = createTypography(COLORS); // Default light theme typography

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

export const LAYOUT = {
  screenPadding: SPACING.lg,
  sectionGap: SPACING.xl,
  cardGap: SPACING.base,
  fieldGap: SPACING.lg,
  buttonGap: SPACING.md,
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
    elevation: 2,
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

const createComponents = (colors) => ({
  primaryButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },
  secondaryButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },
  destructiveButton: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: colors.error,
    paddingHorizontal: SPACING.base,
    iconSize: 24,
    iconSpacing: SPACING.md,
  },
  inputField: {
    height: 56,
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    borderColorDefault: colors.neutralBorder,
    borderColorFocused: colors.primary,
    borderColorError: colors.error,
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZES.bodyInput,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.large,
    borderWidth: 1,
    borderColor: colors.neutralBorder,
    padding: SPACING.base,
    ...SHADOWS.card,
  },
  bottomNav: {
    height: 64,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutralBorder,
    iconSize: 28,
    labelSize: 12,
  },
  appBar: {
    height: 64,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutralBorder,
    paddingHorizontal: SPACING.base,
  },
  avatar: {
    small: 40,
    medium: 48,
    large: 80,
    xlarge: 100,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xlarge,
    fontSize: FONT_SIZES.small,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutralBorder,
  },
  iconButton: {
    size: 48,
    iconSize: 28,
  },
});

export const COMPONENTS = createComponents(COLORS); // Default light theme components

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════

export const ANIMATIONS = {
  standard: 200,
  screen: 300,
  modal: 250,
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
  minTouchTarget: 48,
  minFontSize: 16,
  contrastRatios: {
    normalText: 4.5,
    largeText: 3,
    enhanced: 7,
  },
  focusOutlineWidth: 3,
  focusOutlineColor: COLORS.primary,
};

// ═══════════════════════════════════════════════════════════════
// THEME OBJECTS
// ═══════════════════════════════════════════════════════════════

// Light Theme (default)
export const lightTheme = {
  colors: COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  typography: createTypography(COLORS),
  spacing: SPACING,
  layout: LAYOUT,
  radius: RADIUS,
  shadows: SHADOWS,
  components: createComponents(COLORS),
  animations: ANIMATIONS,
  accessibility: ACCESSIBILITY,
};

// Dark Theme
export const darkTheme = {
  colors: COLORS_DARK,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  typography: createTypography(COLORS_DARK),
  spacing: SPACING,
  layout: LAYOUT,
  radius: RADIUS,
  shadows: SHADOWS, // Same shadows
  components: createComponents(COLORS_DARK),
  animations: ANIMATIONS,
  accessibility: {
    ...ACCESSIBILITY,
    focusOutlineColor: COLORS_DARK.primary,
  },
};

// ═══════════════════════════════════════════════════════════════
// DEFAULT EXPORT (Light Theme for backward compatibility)
// ═══════════════════════════════════════════════════════════════

const theme = lightTheme;

export default theme;
