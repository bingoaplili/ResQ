import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { MapCanvas } from '../../components/MapCanvas';
import { useToast } from '../../components/Toast';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { incidentLabel, incidentTypes } from '../../data/sample';
import { timeOfDay } from '../../utils/format';

export default function ReportSubmittedScreen({ navigation, route }: RootProps<'ReportSubmitted'>) {
  const { state } = useApp();
  const toast = useToast();
  const report = state.reports.find((r) => r.ref === route.params?.ref) ?? state.reports[0];
  const icon = incidentTypes.find((t) => t.id === report.type)?.icon ?? 'flag';
  const home = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <Screen
      variant="horizon"
      footer={
        <>
          <Button label="Back to home" icon="home" onPress={home} />
          <Button label="Track report status" variant="outline" icon="activity" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Profile' } }] })} />
        </>
      }
    >
      <View style={styles.hero}>
        <View style={styles.seal}><Icon name="check" size={46} color={colors.ivory} /></View>
        <AppText variant="h1" center>Report submitted</AppText>
        <AppText variant="body" tone="muted" center>Thank you for helping keep your neighbourhood safer.</AppText>
        <Chip label="Sent for moderation" icon="send" tone="pink" />
      </View>

      <Card edge={colors.bordeaux} style={{ gap: 12 }}>
        <View style={styles.between}>
          <AppText variant="h3">Status</AppText>
          <Chip label="Pending review" tone="warn" dot />
        </View>
        <AppText variant="body" tone="muted">
          Report <AppText variant="bodyStrong">#{report.ref}</AppText> was received. A moderator will review it before it appears on the community map.
        </AppText>
        <View style={styles.steps}>
          {['Logged', 'Review', 'Live pin'].map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.dot, i <= 1 && { backgroundColor: i === 0 ? colors.safe : colors.horizon }]}>
                {i === 0 ? <Icon name="check" size={14} color="#FFFFFF" /> : <AppText variant="caption" style={{ color: colors.navy }}>{i + 1}</AppText>}
              </View>
              <AppText variant="caption" tone={i <= 1 ? 'primary' : 'muted'}>{s}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.eta}><Icon name="clock" size={16} color={colors.navy} /><AppText variant="bodyStrong" style={{ flex: 1 }}>Estimated review time</AppText><AppText variant="bodyStrong">10–15 min</AppText></View>
      </Card>

      <Card style={{ gap: 12 }}>
        <View style={styles.between}>
          <View style={styles.row}><Icon name="file-text" size={18} color={colors.bordeaux} /><AppText variant="h3">Report overview</AppText></View>
          <AppText variant="caption" tone="muted">{report.ref}</AppText>
        </View>
        <MapCanvas height={100} halo={{ x: 48, y: 50, radius: 34, color: colors.bordeaux }} pins={[{ id: 'p', x: 48, y: 50, kind: 'incident' }]} />
        {[
          { icon, k: 'Category', v: incidentLabel(report.type) },
          { icon: 'map-pin' as const, k: 'Location', v: `${report.landmark} (about 50 m)` },
          { icon: 'clock' as const, k: 'Logged', v: `Today, ${timeOfDay(report.createdAt)}` },
        ].map((r) => (
          <View key={r.k} style={styles.info}>
            <IconBadge name={r.icon} tone="horizon" size={38} />
            <View style={{ flex: 1 }}><AppText variant="caption" tone="muted">{r.k}</AppText><AppText variant="bodyStrong">{r.v}</AppText></View>
          </View>
        ))}
      </Card>

      <Card tone="pink" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="lock" tone="bordeaux" size={42} round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Anonymous report</AppText>
          <AppText variant="small" tone="muted">Your name and number aren’t attached. Neighbours only see the area and description.</AppText>
        </View>
      </Card>

      <Button label="Share privately with my circle" variant="ghost" icon="share-2" onPress={() => toast.show('Link copied')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 10, paddingTop: 12 },
  seal: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: colors.ivoryLight },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  steps: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', gap: 4, flex: 1 },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.ivoryDeep, alignItems: 'center', justifyContent: 'center' },
  eta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 12 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 8 },
});
