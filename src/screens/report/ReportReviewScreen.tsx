import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { MapCanvas } from '../../components/MapCanvas';
import { StepBar } from '../../components/Progress';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { incidentLabel, incidentTypes } from '../../data/sample';

export default function ReportReviewScreen({ navigation }: RootProps<'ReportReview'>) {
  const { state, dispatch } = useApp();
  const [busy, setBusy] = useState(false);
  const d = state.draft;
  const icon = incidentTypes.find((t) => t.id === d.type)?.icon ?? 'flag';

  const submit = async () => {
    setBusy(true);
    const report = await api.submitReport(d);
    dispatch({ type: 'addReport', report });
    dispatch({ type: 'resetDraft' });
    setBusy(false);
    navigation.replace('ReportSubmitted', { ref: report.ref });
  };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Review report" step="Step 4 of 4" />}
      footer={
        <>
          <Button label="Submit for review" icon="send" loading={busy} onPress={submit} />
          <Button label="Edit details" variant="outline" icon="edit-2" onPress={() => navigation.goBack()} />
          <Button label="Discard report" variant="ghost" onPress={() => { dispatch({ type: 'resetDraft' }); navigation.navigate('Main'); }} />
        </>
      }
    >
      <StepBar total={4} current={4} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Check your report</AppText>
        <AppText variant="body" tone="muted">Make sure everything looks right before it goes to moderation.</AppText>
      </View>

      <Card tone="horizon" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="clock" tone="navy" size={42} />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Reviewed before publishing</AppText>
          <AppText variant="small" tone="muted">Moderators check each report so false alarms don’t spread.</AppText>
        </View>
      </Card>

      <Card padding={0}>
        <View style={styles.head}>
          <IconBadge name={icon} tone="bordeaux" size={44} />
          <View style={{ flex: 1 }}>
            <AppText variant="label" tone="muted">Incident type</AppText>
            <AppText variant="h3" numberOfLines={1}>{incidentLabel(d.type)}</AppText>
          </View>
          <Chip label={`${d.urgency} urgency`} tone={d.urgency === 'High' ? 'sos' : d.urgency === 'Moderate' ? 'warn' : 'horizon'} />
        </View>
        <View style={styles.body}>
          <View style={styles.two}>
            <View style={styles.tile}><AppText variant="label" tone="muted">When</AppText><AppText variant="bodyStrong">{d.timeOption}</AppText></View>
            <View style={styles.tile}><AppText variant="label" tone="muted">Reporter</AppText><AppText variant="bodyStrong">Anonymous</AppText></View>
          </View>
          <View>
            <AppText variant="label" tone="muted" style={{ marginBottom: 6 }}>Your description</AppText>
            <View style={styles.quote}><AppText variant="body">“{d.description.trim()}”</AppText></View>
          </View>
          <View>
            <View style={styles.between}>
              <AppText variant="label" tone="muted">Location</AppText>
              <Chip label="About 50 m area" tone="horizon" />
            </View>
            <View style={{ marginTop: 8, gap: 8 }}>
              <MapCanvas height={110} halo={{ x: 48, y: 50, radius: 36, color: colors.bordeaux }} pins={[{ id: 's', x: 48, y: 50, kind: 'incident' }]} />
              <View style={styles.loc}><Icon name="map-pin" size={16} color={colors.bordeaux} /><AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={2}>{d.landmark}</AppText></View>
            </View>
          </View>
          {d.photoCount > 0 ? (
            <View style={styles.loc}><Icon name="image" size={16} color={colors.navy} /><AppText variant="bodyStrong">{d.photoCount} photo{d.photoCount > 1 ? 's' : ''} attached</AppText></View>
          ) : null}
        </View>
      </Card>

      <Card tone="pink" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="lock" tone="bordeaux" size={42} round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Your details stay private</AppText>
          <AppText variant="small" tone="muted">Only the area and description are shared. Your name and number are not.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.horizonSoft },
  body: { padding: 14, gap: 14 },
  two: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 12, gap: 2 },
  quote: { backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
