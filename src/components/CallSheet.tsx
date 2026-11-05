import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { config } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { IconBadge } from './IconBadge';
import { Sheet } from './Sheet';
import { clock } from '../utils/format';

type Props = { visible: boolean; onClose: () => void; name: string; number: string; emergency?: boolean };

/**
 * Confirm-then-call sheet. With `config.enableDeviceDialer` off (default) the call stays
 * inside the app as a local call screen, so nothing can dial out while testing.
 */
export function CallSheet({ visible, onClose, name, number, emergency }: Props) {
  const [calling, setCalling] = useState(false);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!visible) { setCalling(false); setSecs(0); }
  }, [visible]);

  useEffect(() => {
    if (!calling) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [calling]);

  const start = () => {
    if (config.enableDeviceDialer) {
      Linking.openURL(`tel:${number.replace(/\s/g, '')}`);
      onClose();
    } else {
      setCalling(true);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.center}>
        <IconBadge name="phone" tone={emergency ? 'sos' : 'navy'} size={68} round />
        <AppText variant="h2" center>{calling ? `Calling ${name}` : name}</AppText>
        <AppText variant="metric" center style={{ fontSize: 30 }}>{number}</AppText>
        {calling ? (
          <AppText variant="bodyStrong" tone="muted" center>{secs === 0 ? 'Connecting…' : clock(secs)}</AppText>
        ) : (
          <AppText variant="body" tone="muted" center>
            {emergency ? 'Connects you with police, fire and ambulance dispatch.' : 'Place a call to this number now?'}
          </AppText>
        )}
      </View>
      {calling ? (
        <Button label="End call" variant="sos" icon="phone-off" onPress={onClose} />
      ) : (
        <>
          <Button label={`Call ${number}`} variant={emergency ? 'sos' : 'primary'} icon="phone" onPress={start} />
          <Button label="Not now" variant="ghost" onPress={onClose} />
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', gap: 8, paddingVertical: 8 } });
