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
import { FacilityArt } from '../../components/FacilityArt';
import { CallSheet } from '../../components/CallSheet';
import { useToast } from '../../components/Toast';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { zones } from '../../data/sample';

export default function ZoneDetailScreen({ route, navigation }: RootProps<'ZoneDetail'>) {
  const zone = zones.find((z) => z.id === route.params.id) ?? zones[0];
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [call, setCall] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const saved = state.savedZones.includes(zone.id);

  const route_ = [{ x: 46, y: 52 }, { x: 44, y: 44 }, { x: (46 + zone.x) / 2, y: (52 + zone.y) / 2 - 4 }, { x: zone.x, y: zone.y }];

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Help Zone" right={<Chip label={zone.label} tone="pink" />} />}
      footer={
        <>
          <Button label={navigating ? 'End navigation' : `Navigate · ${zone.distanceKm.toFixed(1)} km`} icon={navigating ? 'x' : 'corner-up-right'} variant={navigating ? 'outline' : 'primary'}
            onPress={() => { setNavigating((n) => !n); if (!navigating) toast.show('Route started'); }} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Button label={`Call`} icon="phone" variant="secondary" onPress={() => setCall(true)} /></View>
            <View style={{ flex: 1 }}><Button label={saved ? 'Saved' : 'Save'} icon={saved ? 'check' : 'bookmark'} variant="outline" onPress={() => dispatch({ type: 'toggleZone', id: zone.id })} /></View>
          </View>
        </>
      }
    >
      <MapCanvas height={200} route={route_} routeColor={navigating ? colors.sos : colors.bordeaux}
        pins={[{ id: 'you', x: 46, y: 52, kind: 'you' }, { id: zone.id, x: zone.x, y: zone.y, kind: zone.kind }]}>
        <View style={styles.eta}>
          <View style={styles.etaItem}><Icon name="user" size={16} color={colors.navy} /><AppText variant="bodyStrong" style={{ fontSize: 13 }}>{zone.walkMins} min walk</AppText></View>
          <View style={styles.sep} />
          <View style={styles.etaItem}><Icon name="navigation-2" size={16} color={colors.navy} /><AppText variant="bodyStrong" style={{ fontSize: 13 }}>{zone.driveMins} min drive</AppText></View>
        </View>
      </MapCanvas>

      <Card tone="horizon" style={{ gap: 8 }}>
        <Chip label={zone.label} tone="navy" />
        <AppText variant="h1" style={{ fontSize: 25, lineHeight: 31 }}>{zone.name}</AppText>
        <View style={styles.row}><Icon name="map-pin" size={15} color={colors.inkMuted} /><AppText variant="small" tone="muted" style={{ flex: 1 }}>{zone.distanceKm.toFixed(1)} km from you</AppText></View>
        <View style={styles.verified}><Icon name="check-circle" size={18} color={colors.safeDeep} /><AppText variant="bodyStrong" tone="safe" style={{ flex: 1 }}>Verified emergency zone</AppText></View>
      </Card>

      <Card style={{ gap: 14 }}>
        <View style={styles.row}>
          <Chip label={zone.open} tone="safe" dot />
          <AppText variant="small" tone="muted" style={{ flex: 1 }}>Staff on duty</AppText>
        </View>
        <View style={styles.addr}>
          <IconBadge name="map-pin" tone="navy" size={40} />
          <View style={{ flex: 1 }}><AppText variant="label" tone="muted">Address</AppText><AppText variant="bodyStrong">{zone.address}</AppText></View>
        </View>
        <View>
          <AppText variant="label" tone="muted" style={{ marginBottom: 8 }}>Entrance and reception</AppText>
          <View style={styles.photos}>
            <View style={styles.art}><FacilityArt variant="gate" /><View style={styles.cap}><AppText variant="caption" tone="onColor">Main gate</AppText></View></View>
            <View style={styles.art}><FacilityArt variant="lobby" /><View style={styles.cap}><AppText variant="caption" tone="onColor">Public lobby</AppText></View></View>
          </View>
        </View>
        <AppText variant="h2">Available services</AppText>
        {zone.services.map((s) => (
          <View key={s.title} style={styles.service}>
            <IconBadge name={s.icon as any} tone="horizon" size={38} />
            <View style={{ flex: 1 }}><AppText variant="bodyStrong">{s.title}</AppText><AppText variant="small" tone="muted">{s.text}</AppText></View>
          </View>
        ))}
        <AppText variant="h2">Safeguards</AppText>
        <View style={styles.chips}>{zone.safeguards.map((s) => <Chip key={s} label={s} icon="check" tone="safe" />)}</View>
      </Card>

      <Card tone="pink" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="alert-circle" tone="bordeaux" size={42} round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">In immediate danger?</AppText>
          <AppText variant="small" tone="muted">Always call <AppText variant="bodyStrong" tone="sos">999</AppText> first if there is an active threat.</AppText>
        </View>
      </Card>
      <Button label="Share with my circle" variant="ghost" icon="share-2" onPress={() => toast.show('Link copied')} />

      <CallSheet visible={call} onClose={() => setCall(false)} name={zone.name} number={zone.phone} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eta: { position: 'absolute', left: 10, right: 10, bottom: 10, flexDirection: 'row', backgroundColor: colors.ivoryLight, borderRadius: radius.md, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'space-around' },
  etaItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  sep: { width: 1, height: 20, backgroundColor: colors.line },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.safeSoft, padding: 10, borderRadius: radius.md },
  addr: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 10 },
  photos: { flexDirection: 'row', gap: 10 },
  art: { flex: 1, height: 100, borderRadius: radius.md, overflow: 'hidden' },
  cap: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(11,26,44,0.75)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  service: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
