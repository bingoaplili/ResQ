import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { Logo } from '../../components/Logo';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';

type Slide = {
  eyebrow: string; title: string; text: string; icon: IconName; next: string;
  chips: { label: string; icon: IconName }[];
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'Navigation shield', title: 'Stay safer wherever you go',
    text: 'Pick safety-aware routes, see Help Zones nearby, and let your circle follow along on every journey.',
    icon: 'navigation', next: 'Next: Emergency response',
    chips: [{ label: 'Lit corridors', icon: 'sun' }, { label: 'Help Zones', icon: 'map-pin' }, { label: 'Journey check-ins', icon: 'clock' }],
  },
  {
    eyebrow: 'Emergency response', title: 'Get help when you need it',
    text: 'Hold the SOS button for three seconds, or shake your phone, to alert the people you trust.',
    icon: 'alert-triangle', next: 'Next: Community help',
    chips: [{ label: 'Hold to send', icon: 'target' }, { label: 'Shake to SOS', icon: 'smartphone' }, { label: 'Quiet mode', icon: 'eye-off' }],
  },
  {
    eyebrow: 'Community help', title: 'Help is closer than you think',
    text: 'Report hazards, see what neighbours have flagged, and find verified safe places in seconds.',
    icon: 'users', next: 'Create my account',
    chips: [{ label: 'Hazard reports', icon: 'flag' }, { label: 'Safe places', icon: 'home' }, { label: 'Stay anonymous', icon: 'lock' }],
  },
];

function Art({ index }: { index: number }) {
  return (
    <Svg width="100%" height={150} viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <Rect width="320" height="150" fill={colors.navy} />
      <Circle cx="280" cy="20" r="70" fill={colors.horizon} opacity="0.28" />
      <Circle cx="30" cy="140" r="80" fill={colors.bordeaux} opacity="0.7" />
      {index === 0 && (
        <>
          <Path d="M20 110 C 80 30 140 140 200 70 S 280 40 300 36" stroke={colors.pink} strokeWidth="5" fill="none" strokeLinecap="round" />
          <Path d="M20 110 L 160 130 L 300 36" stroke={colors.horizon} strokeWidth="2" strokeDasharray="5 6" fill="none" opacity="0.7" />
          <Circle cx="20" cy="110" r="8" fill={colors.ivory} />
          <Circle cx="300" cy="36" r="10" fill={colors.pink} />
        </>
      )}
      {index === 1 && (
        <>
          {[70, 52, 34].map((r, i) => (
            <Circle key={r} cx="160" cy="75" r={r} fill="none" stroke={colors.pink} strokeWidth="2" opacity={0.25 + i * 0.25} />
          ))}
          <Circle cx="160" cy="75" r="22" fill={colors.sos} />
          <Path d="M152 75 H168 M160 67 V83" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {index === 2 && (
        <>
          {[[70, 90], [130, 50], [200, 95], [250, 55]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r="16" fill={i % 2 ? colors.pink : colors.horizon} />
          ))}
          <Path d="M70 90 L130 50 L200 95 L250 55" stroke={colors.ivory} strokeWidth="2" strokeDasharray="4 5" fill="none" opacity="0.6" />
        </>
      )}
    </Svg>
  );
}

export default function FeatureCarouselScreen({ navigation }: RootProps<'Carousel'>) {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  const last = i === SLIDES.length - 1;
  const next = () => (last ? navigation.navigate('Welcome') : setI(i + 1));

  return (
    <Screen
      variant="ivory"
      header={
        <View style={styles.header}>
          <View style={styles.brand}><Logo size={34} /><AppText variant="h3">How ResQ protects you</AppText></View>
          <Pressable onPress={() => navigation.navigate('Welcome')} accessibilityRole="button" style={styles.skip}>
            <AppText variant="bodyStrong">Skip</AppText>
          </Pressable>
        </View>
      }
      footer={
        <>
          <Button label={s.next} iconRight="arrow-right" onPress={next} />
          <Button label="Skip to sign up" variant="ghost" onPress={() => navigation.navigate('Welcome')} />
        </>
      }
    >
      <Card padding={14}>
        <View style={styles.art}><Art index={i} /></View>
        <View style={styles.eyebrow}>
          <Icon name={s.icon} size={15} color={colors.bordeaux} />
          <AppText variant="label" tone="accent">{s.eyebrow}</AppText>
        </View>
        <AppText variant="h1" style={{ marginTop: 6 }}>{s.title}</AppText>
        <AppText variant="body" tone="muted" style={{ marginTop: 8 }}>{s.text}</AppText>
        <View style={styles.chips}>{s.chips.map((c) => <Chip key={c.label} label={c.label} icon={c.icon} tone="horizon" />)}</View>
      </Card>

      <View style={styles.dots} accessibilityLabel={`Page ${i + 1} of ${SLIDES.length}`}>
        {SLIDES.map((_, k) => <View key={k} style={[styles.dot, k === i && styles.dotOn]} />)}
      </View>

      <View style={styles.rowHead}>
        <AppText variant="h3">More to explore</AppText>
        <AppText variant="caption" tone="muted">Step {i + 1} of {SLIDES.length}</AppText>
      </View>
      {SLIDES.map((o, k) => k === i ? null : (
        <Card key={o.title} tone={k === 1 ? 'pink' : 'horizon'} onPress={() => setI(k)} accessibilityLabel={o.title}>
          <View style={styles.more}>
            <IconBadge name={o.icon} tone={k === 1 ? 'bordeaux' : 'navy'} />
            <View style={{ flex: 1 }}>
              <AppText variant="h3">{o.title}</AppText>
              <AppText variant="small" tone="muted" numberOfLines={2}>{o.text}</AppText>
            </View>
            <Icon name="chevron-right" size={20} color={colors.navy} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  skip: { minHeight: 44, minWidth: 64, borderRadius: 22, backgroundColor: colors.horizonSoft, alignItems: 'center', justifyContent: 'center' },
  art: { borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(19,39,63,0.25)' },
  dotOn: { width: 34, backgroundColor: colors.bordeaux },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
