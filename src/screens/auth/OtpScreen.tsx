import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { StepBar } from '../../components/Progress';
import { useToast } from '../../components/Toast';
import { colors, fonts, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { clock } from '../../utils/format';

export default function OtpScreen({ navigation }: RootProps<'Otp'>) {
  const { state } = useApp();
  const toast = useToast();
  const input = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const verify = async () => {
    setBusy(true);
    const ok = await api.verifyCode(code);
    setBusy(false);
    if (!ok) { setError('Enter the 6-digit code we sent you.'); return; }
    setError('');
    navigation.navigate('ProfileSetup');
  };

  const resend = (via: string) => {
    setLeft(30);
    setCode('');
    toast.show(`New code requested by ${via}`);
  };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Verify phone" step="Step 2 of 4" />}
      footer={<Button label="Verify & continue" iconRight="arrow-right" loading={busy} disabled={code.length < 6} onPress={verify} />}
    >
      <StepBar total={4} current={2} />
      <IconBadge name="smartphone" tone="navy" size={60} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Verify your phone number</AppText>
        <AppText variant="body" tone="muted">
          We sent a 6-digit code to <AppText variant="bodyStrong">{state.user.phone || 'your phone'}</AppText>. Enter it below to confirm this is your number.
        </AppText>
      </View>
      <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={styles.edit}>
        <Icon name="edit-2" size={16} color={colors.link} />
        <AppText variant="bodyStrong" tone="link">Edit phone number</AppText>
      </Pressable>

      <Card style={{ alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => input.current?.focus()} accessibilityRole="button" accessibilityLabel="Enter verification code" style={styles.boxes}>
          {Array.from({ length: 6 }, (_, i) => {
            const active = i === code.length;
            return (
              <View key={i} style={[styles.box, active && styles.boxActive, !!error && { borderColor: colors.sos }]}>
                <AppText variant="h1" style={{ fontVariant: ['tabular-nums'] }}>{code[i] ?? ''}</AppText>
              </View>
            );
          })}
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={(t) => { setCode(t.replace(/\D/g, '').slice(0, 6)); setError(''); }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          textContentType="oneTimeCode"
          style={styles.hidden}
          accessibilityLabel="Verification code"
        />
        {error ? <AppText variant="small" tone="sos">{error}</AppText> : <AppText variant="small" tone="muted">Tap the boxes to open the keypad</AppText>}
        {left > 0 ? <Chip label={`Resend code in ${clock(left)}`} icon="clock" tone="horizon" /> : null}
        <View style={styles.resend}>
          <View style={{ flex: 1 }}><Button label="Resend SMS" variant="outline" icon="message-square" disabled={left > 0} onPress={() => resend('SMS')} /></View>
          <View style={{ flex: 1 }}><Button label="Call me" variant="outline" icon="phone" disabled={left > 0} onPress={() => resend('call')} /></View>
        </View>
      </Card>

      <Card tone="horizon" style={styles.why}>
        <IconBadge name="shield" tone="navy" size={42} />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Why verify?</AppText>
          <AppText variant="small" tone="muted">A confirmed number lets your trusted circle recognise alerts that come from you.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  edit: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  boxes: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  box: { width: 46, height: 58, borderRadius: radius.md, backgroundColor: colors.horizonMist, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  boxActive: { borderColor: colors.horizonDeep, backgroundColor: colors.horizonSoft },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1, fontFamily: fonts.body },
  resend: { flexDirection: 'row', gap: 10, width: '100%' },
  why: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});
