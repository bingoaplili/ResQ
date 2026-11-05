import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon, IconName } from '../../components/Icon';
import { Logo } from '../../components/Logo';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';

const POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'navigation', title: 'Check in on every journey', text: 'Your circle can follow your route once you start a journey.' },
  { icon: 'map-pin', title: 'Help is on the map', text: 'Find police, hospitals and verified safe places around you.' },
  { icon: 'lock', title: 'You stay in control', text: 'Your location is shared only when you choose to share it.' },
];

function Skyline() {
  return (
    <Svg width="100%" height={170} viewBox="0 0 340 170" preserveAspectRatio="xMidYMid slice">
      <Rect width="340" height="170" fill={colors.horizon} />
      <Circle cx="270" cy="46" r="30" fill={colors.ivory} opacity="0.85" />
      <Circle cx="60" cy="150" r="90" fill={colors.pink} opacity="0.5" />
      {[[14, 80, 36], [56, 52, 42], [104, 96, 30], [140, 66, 48], [196, 90, 36], [238, 58, 44], [286, 100, 40]].map(([x, y, w], i) => (
        <Rect key={i} x={x} y={y} width={w} height={170 - y} fill={i % 2 ? colors.navy : colors.navySoft} />
      ))}
      <Path d="M0 150 C 80 130 160 170 340 140 L340 170 L0 170 Z" fill={colors.bordeaux} />
      {[[24, 96], [66, 70], [150, 84], [248, 76], [296, 118]].map(([x, y], i) => (
        <Rect key={i} x={x} y={y} width="8" height="10" fill={colors.ivory} opacity="0.8" />
      ))}
    </Svg>
  );
}

export default function WelcomeScreen({ navigation }: RootProps<'Welcome'>) {
  const { dispatch } = useApp();
  const google = () => {
    dispatch({ type: 'signIn' });
    navigation.navigate('ProfileSetup');
  };
  return (
    <Screen variant="navy">
      <View style={styles.top}>
        <Logo size={46} />
        <View style={{ flex: 1 }}>
          <AppText variant="h2">ResQ</AppText>
          <AppText variant="label" tone="muted" style={{ fontSize: 10 }}>Community & personal safety</AppText>
        </View>
        <Chip label="Online" tone="pink" dot />
      </View>

      <View style={styles.hero}><Skyline /></View>

      <View style={{ gap: 8 }}>
        <AppText variant="display" style={{ fontSize: 36, lineHeight: 42 }}>Welcome to ResQ</AppText>
        <AppText variant="body" tone="muted" style={{ fontSize: 16 }}>
          Your safety companion for everyday commutes, late nights, and moments when you need help fast.
        </AppText>
      </View>

      <Card tone="glass">
        {POINTS.map((p, i) => (
          <View key={p.title} style={[styles.point, i > 0 && { marginTop: 14 }]}>
            <View style={styles.pointIcon}><Icon name={p.icon} size={18} color={colors.navy} /></View>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">{p.title}</AppText>
              <AppText variant="small" tone="muted">{p.text}</AppText>
            </View>
          </View>
        ))}
      </Card>

      <View style={{ gap: 12 }}>
        <Button label="Create an account" iconRight="arrow-right" size="lg" onPress={() => navigation.navigate('CreateAccount')} />
        <Button label="Log in" variant="outline" onPress={() => navigation.navigate('Login')} />
        <View style={styles.or}><View style={styles.rule} /><AppText variant="label" tone="muted">or</AppText><View style={styles.rule} /></View>
        <Button label="Continue with Google" variant="pink" icon="globe" onPress={google} />
      </View>

      <AppText variant="small" tone="muted" center>
        By continuing, you agree to ResQ’s Terms of Service and Privacy Policy.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hero: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(247,242,224,0.3)' },
  point: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  pointIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.horizon, alignItems: 'center', justifyContent: 'center' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rule: { flex: 1, height: 1, backgroundColor: 'rgba(247,242,224,0.25)' },
});
