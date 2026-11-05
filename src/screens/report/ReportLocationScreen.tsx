import React, { useState } from 'react';
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
import { MapCanvas } from '../../components/MapCanvas';
import { StepBar } from '../../components/Progress';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { vicinityPoints } from '../../data/sample';

export default function ReportLocationScreen({ navigation }: RootProps<'ReportLocation'>) {
  const { state, dispatch } = useApp();
  const { locationMode, landmark } = state.draft;
  const [pin, setPin] = useState({ x: 48, y: 50 });
  const [size, setSize] = useState({ w: 1, h: 1 });

  const mode = (m: 'current' | 'map') => {
    dispatch({ type: 'patchDraft', patch: { locationMode: m } });
    if (m === 'current') setPin({ x: 48, y: 50 });
  };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Report an incident" step="Step 2 of 4" />}
      footer={
        <>
          <Button label="Continue to details" iconRight="arrow-right" disabled={landmark.trim().length < 3} onPress={() => navigation.navigate('ReportDetails')} />
          <Button label="Back to incident type" variant="ghost" icon="arrow-left" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepBar total={4} current={2} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Where did it happen?</AppText>
        <AppText variant="body" tone="muted">Set the spot. We blur it slightly to protect privacy.</AppText>
      </View>

      <View style={styles.seg}>
        {([['current', 'Current location', 'crosshair'], ['map', 'Choose on map', 'map-pin']] as const).map(([id, label, icon]) => {
          const on = locationMode === id;
          return (
            <Pressable key={id} onPress={() => mode(id)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.segItem, on && styles.segOn]}>
              <Icon name={icon} size={17} color={on ? colors.ivory : colors.navy} />
              <AppText variant="bodyStrong" style={{ color: on ? colors.ivory : colors.navy, fontSize: 14 }}>{label}</AppText>
            </Pressable>
          );
        })}
      </View>

      <View onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        <MapCanvas
          height={250}
          halo={{ x: pin.x, y: pin.y, radius: 46, color: colors.bordeaux }}
          pins={[{ id: 'spot', x: pin.x, y: pin.y, kind: 'incident', label: 'Incident spot (approx.)' }]}
        >
          {locationMode === 'map' ? (
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityLabel="Tap the map to move the incident spot"
              onPress={(e) => setPin({ x: (e.nativeEvent.locationX / size.w) * 100, y: (e.nativeEvent.locationY / size.h) * 100 })}
            />
          ) : null}
          <View style={styles.badge}><Icon name="target" size={14} color={colors.navy} /><AppText variant="caption">{locationMode === 'current' ? 'Using your location' : 'Tap the map to move the pin'}</AppText></View>
          {locationMode === 'map' ? (
            <Pressable onPress={() => setPin({ x: 48, y: 50 })} accessibilityRole="button" style={styles.reset}><AppText variant="caption" tone="onColor">Reset</AppText></Pressable>
          ) : null}
        </MapCanvas>
      </View>

      <Card>
        <View style={styles.between}>
          <AppText variant="h3">Street or landmark</AppText>
          <Chip label="Required" tone="pink" />
        </View>
        <View style={{ marginTop: 10 }}>
          <Input icon="map-pin" placeholder="Dhanmondi Lake Walkway, near Bridge 2" value={landmark} onChangeText={(t) => dispatch({ type: 'patchDraft', patch: { landmark: t } })}
            hint="Add something recognisable, like a tea stall or gate number." />
        </View>
      </Card>

      <Card tone="pink" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="shield" tone="bordeaux" size={42} round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Location privacy</AppText>
          <AppText variant="small" tone="muted">Reports show a general area (about 50 m) instead of your exact position.</AppText>
        </View>
      </Card>

      <View style={{ gap: 6 }}>
        <AppText variant="label" tone="muted">Common points nearby</AppText>
        <View style={styles.chips}>
          {vicinityPoints.map((v) => <Chip key={v} label={v} icon="map-pin" tone="horizon" onPress={() => dispatch({ type: 'patchDraft', patch: { landmark: v } })} />)}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', backgroundColor: colors.horizonSoft, borderRadius: radius.lg, padding: 4, gap: 4 },
  segItem: { flex: 1, minHeight: 48, borderRadius: radius.md + 2, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.navy },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { position: 'absolute', left: 10, top: 10, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.ivoryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  reset: { position: 'absolute', right: 10, bottom: 10, backgroundColor: colors.navy, paddingHorizontal: 14, minHeight: 36, justifyContent: 'center', borderRadius: radius.pill },
});
