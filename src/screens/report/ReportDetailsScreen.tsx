import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { StepBar } from '../../components/Progress';
import { useToast } from '../../components/Toast';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { incidentLabel, timeOptions } from '../../data/sample';
import { Urgency } from '../../types';

const URGENCY: { id: Urgency; radius: string; icon: 'minus-circle' | 'alert-triangle' | 'alert-octagon' }[] = [
  { id: 'Low', radius: '~200 m', icon: 'minus-circle' },
  { id: 'Moderate', radius: '~500 m', icon: 'alert-triangle' },
  { id: 'High', radius: '~1 km', icon: 'alert-octagon' },
];
const MAX = 500;

export default function ReportDetailsScreen({ navigation }: RootProps<'ReportDetails'>) {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const d = state.draft;
  const patch = (p: Partial<typeof d>) => dispatch({ type: 'patchDraft', patch: p });
  const radiusText = URGENCY.find((u) => u.id === d.urgency)?.radius;

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Report an incident" step="Step 3 of 4" />}
      footer={
        <>
          <Button label="Review report" iconRight="arrow-right" disabled={d.description.trim().length < 10} onPress={() => navigation.navigate('ReportReview')} />
          <Button label="Save draft" variant="ghost" icon="bookmark" onPress={() => { toast.show('Draft saved'); navigation.navigate('Main'); }} />
        </>
      }
    >
      <StepBar total={4} current={3} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Tell us what happened</AppText>
        <AppText variant="body" tone="muted">Clear context helps moderators and neighbours act safely.</AppText>
      </View>

      <Card tone="horizon" style={styles.anchor}>
        <IconBadge name="map-pin" tone="navy" size={42} />
        <View style={{ flex: 1 }}>
          <AppText variant="label" tone="muted">Report anchor</AppText>
          <AppText variant="bodyStrong" numberOfLines={1}>{incidentLabel(d.type)} · {d.landmark}</AppText>
        </View>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}><AppText variant="bodyStrong" tone="link">Edit</AppText></Pressable>
      </Card>

      <View style={{ gap: 8 }}>
        <AppText variant="h3">When did it happen?</AppText>
        <View style={styles.chips}>{timeOptions.map((t) => <Chip key={t} label={t} selected={d.timeOption === t} onPress={() => patch({ timeOption: t })} />)}</View>
      </View>

      <Card>
        <View style={styles.between}>
          <AppText variant="h3">Description</AppText>
          <AppText variant="caption" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>{d.description.length} / {MAX}</AppText>
        </View>
        <View style={{ marginTop: 10 }}>
          <Input multiline placeholder="Describe what you saw, where, and anything that could help others stay safe." value={d.description}
            onChangeText={(t) => patch({ description: t.slice(0, MAX) })} maxLength={MAX} />
        </View>
      </Card>

      <View style={{ gap: 8 }}>
        <View style={styles.between}>
          <AppText variant="h3">Photos <AppText variant="small" tone="muted">(optional)</AppText></AppText>
          <AppText variant="caption" tone="muted">{d.photoCount} of 2 attached</AppText>
        </View>
        <AppText variant="small" tone="muted">Please don’t photograph faces of people who aren’t involved.</AppText>
        <View style={styles.photos}>
          {Array.from({ length: d.photoCount }, (_, i) => (
            <View key={i} style={[styles.photo, { backgroundColor: i % 2 ? colors.bordeaux : colors.navy }]}>
              <Icon name="image" size={28} color={colors.horizon} />
              <AppText variant="caption" tone="onColor">Photo {i + 1}</AppText>
              <Pressable onPress={() => patch({ photoCount: d.photoCount - 1 })} accessibilityRole="button" accessibilityLabel={`Remove photo ${i + 1}`} style={styles.x}><Icon name="x" size={16} color="#FFFFFF" /></Pressable>
            </View>
          ))}
          {d.photoCount < 2 ? (
            <Pressable onPress={() => patch({ photoCount: d.photoCount + 1 })} accessibilityRole="button" accessibilityLabel="Add photo" style={[styles.photo, styles.add]}>
              <Icon name="camera" size={26} color={colors.navy} />
              <AppText variant="bodyStrong">Add photo</AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={styles.between}>
          <AppText variant="h3">Urgency</AppText>
          <AppText variant="caption" tone="accent">Alert radius {radiusText}</AppText>
        </View>
        <View style={styles.seg}>
          {URGENCY.map((u) => {
            const on = d.urgency === u.id;
            return (
              <Pressable key={u.id} onPress={() => patch({ urgency: u.id })} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.segItem, on && styles.segOn]}>
                <Icon name={u.icon} size={16} color={on ? colors.ivory : colors.navy} />
                <AppText variant="bodyStrong" style={{ color: on ? colors.ivory : colors.navy, fontSize: 14 }}>{u.id}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Card tone="pink" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="shield" tone="bordeaux" size={42} round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Keep it factual</AppText>
          <AppText variant="small" tone="muted">Leave out private details, vehicle plates, and unverified claims about specific people.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  anchor: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photos: { flexDirection: 'row', gap: 12 },
  photo: { flex: 1, height: 112, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', gap: 6 },
  add: { backgroundColor: colors.horizonSoft, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.horizonDeep },
  x: { position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(11,26,44,0.7)', alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', backgroundColor: colors.horizonSoft, borderRadius: radius.lg, padding: 4, gap: 4 },
  segItem: { flex: 1, minHeight: 48, borderRadius: radius.md + 2, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.navy },
});
