import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';

export default function SplashScreen({ navigation }: RootProps<'Splash'>) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPct((p) => Math.min(100, p + 4)), 90);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(() => navigation.replace('Carousel'), 450);
      return () => clearTimeout(t);
    }
  }, [pct, navigation]);

  return (
    <Screen
      variant="navy"
      scroll={false}
      contentStyle={styles.content}
      footer={<Button label="Get started" iconRight="arrow-right" onPress={() => navigation.replace('Carousel')} />}
    >
      <Chip label="Personal & community safety" tone="pink" dot />
      <View style={styles.hero}>
        <View style={styles.logoGlow}><Logo size={112} radiusRatio={0.3} /></View>
        <AppText variant="display" style={{ fontSize: 52, lineHeight: 58 }}>ResQ</AppText>
        <AppText variant="body" tone="muted" center style={{ fontSize: 17 }}>Stay aware. Stay connected. Get help.</AppText>
        <View style={styles.chips}>
          <Chip label="Safe routes" icon="navigation" tone="horizon" />
          <Chip label="Help Zones" icon="map-pin" tone="pink" />
        </View>
      </View>
      <Card tone="glass">
        <View style={styles.row}>
          <Icon name="shield" size={18} color={colors.horizon} />
          <AppText variant="h3" style={{ flex: 1 }}>{pct < 100 ? 'Getting ready' : 'All set'}</AppText>
          <AppText variant="bodyStrong" tone="link" style={{ fontVariant: ['tabular-nums'] }}>{pct}%</AppText>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${pct}%` }]} /></View>
        <AppText variant="small" tone="muted">Ready when you need it</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'space-between', paddingTop: 24 },
  hero: { alignItems: 'center', gap: 14 },
  logoGlow: { padding: 14, borderRadius: 48, backgroundColor: 'rgba(128,174,232,0.2)', borderWidth: 1, borderColor: 'rgba(128,174,232,0.4)' },
  chips: { flexDirection: 'row', gap: 10, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(247,242,224,0.22)', overflow: 'hidden', marginBottom: 10 },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.pink },
});
