/**
 * Help & Support Screen
 * FAQs and support options
 * FULLY THEME-AWARE
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { EXTERNAL_URLS } from '../../config/constants';
import AppBar from '../../components/navigation/AppBar';
import Card from '../../components/common/Card/Card';

const FAQ_ITEMS = [
  {
    id: '1',
    questionKey: 'profile.help.faq1.question',
    answerKey: 'profile.help.faq1.answer',
  },
  {
    id: '2',
    questionKey: 'profile.help.faq2.question',
    answerKey: 'profile.help.faq2.answer',
  },
  {
    id: '3',
    questionKey: 'profile.help.faq3.question',
    answerKey: 'profile.help.faq3.answer',
  },
];

const HelpSupportScreen = ({ navigation }) => {
  const { t, theme } = useTheme();
  const { colors, typography, spacing, layout } = theme;
  const [expandedId, setExpandedId] = useState(null);

  const handleContactSupport = () => {
    const email = EXTERNAL_URLS.SUPPORT_EMAIL;
    const subject = 'Support Request';
    const body = 'Hi QR Parking team,\n\n';

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleReportBug = () => {
    Alert.alert(
      t('profile.help.reportBug'),
      `Please email us at ${EXTERNAL_URLS.SUPPORT_EMAIL} with bug details`,
      [{ text: t('common.ok') }]
    );
  };

  const handleRateApp = () => {
    Linking.openURL(EXTERNAL_URLS.PLAY_STORE);
  };

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutralLight }]} edges={['top']}>
      <AppBar
        title={t('profile.help.title')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Help Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.h2, { marginBottom: spacing.sm }]}>
            {t('profile.help.quickHelp')}
          </Text>
          <Card>
            <MenuItem
              icon="❓"
              label={t('profile.help.faqs')}
              onPress={() => {}}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="📧"
              label={t('profile.help.contact')}
              onPress={handleContactSupport}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="🐛"
              label={t('profile.help.reportBug')}
              onPress={handleReportBug}
              theme={theme}
            />
            <Divider color={colors.neutralBorder} />
            <MenuItem
              icon="⭐"
              label={t('profile.help.rateApp')}
              onPress={handleRateApp}
              theme={theme}
            />
          </Card>
        </View>

        {/* Common Issues Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[typography.h2, { marginBottom: spacing.sm }]}>
            {t('profile.help.commonIssues')}
          </Text>
          <Card>
            {FAQ_ITEMS.map((item, index) => (
              <React.Fragment key={item.id}>
                <AccordionItem
                  question={t(item.questionKey)}
                  answer={t(item.answerKey)}
                  expanded={expandedId === item.id}
                  onPress={() => toggleAccordion(item.id)}
                  theme={theme}
                />
                {index < FAQ_ITEMS.length - 1 && <Divider color={colors.neutralBorder} />}
              </React.Fragment>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Menu Item Component
const MenuItem = ({ icon, label, onPress, theme }) => {
  const { colors, typography, spacing } = theme;
  return (
    <TouchableOpacity
      style={[styles.menuItem, { padding: spacing.base }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[typography.body, { flex: 1, marginLeft: spacing.base }]}>{label}</Text>
      <Text style={[styles.menuChevron, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
};

// Accordion Item Component
const AccordionItem = ({ question, answer, expanded, onPress, theme }) => {
  const { colors, typography, spacing } = theme;
  return (
    <View>
      <TouchableOpacity
        style={[styles.accordionHeader, { padding: spacing.base }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[typography.body, { flex: 1 }]}>{question}</Text>
        <Text style={[styles.accordionIcon, { color: colors.textSecondary }]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.accordionBody, {
          backgroundColor: colors.neutralLight,
          padding: spacing.base,
        }]}>
          <Text style={[typography.caption, { lineHeight: 20 }]}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

// Divider Component
const Divider = ({ color }) => <View style={[styles.divider, { backgroundColor: color }]} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuChevron: {
    fontSize: 24,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  accordionBody: {
    // Dynamic styles applied inline
  },
  divider: {
    height: 1,
  },
});

export default HelpSupportScreen;
