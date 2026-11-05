import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Icon } from '../../components/Icon';
import { StepBar } from '../../components/Progress';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { isEmail, isPhone } from '../../utils/format';

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number or symbol', test: (p: string) => /[0-9\W_]/.test(p) },
];

export default function CreateAccountScreen({ navigation }: RootProps<'CreateAccount'>) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const passed = rules.filter((r) => r.test(pw)).length;
  const strength = passed === 3 ? 'Strong' : passed === 2 ? 'Fair' : 'Weak';

  const submit = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter your full name.';
    if (!isPhone(phone)) e.phone = 'Enter a valid mobile number.';
    if (!isEmail(email)) e.email = 'Enter a valid email address.';
    if (passed < 3) e.pw = 'Choose a stronger password.';
    if (pw2 !== pw || !pw2) e.pw2 = 'Passwords do not match.';
    if (!agree) e.agree = 'Please accept the terms to continue.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await api.signUp({ name, phone, email });
    dispatch({ type: 'updateUser', patch: { name: name.trim(), phone: `+880 ${phone.trim()}`, email: email.trim() } });
    setBusy(false);
    navigation.navigate('Otp');
  };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Create account" step="Step 1 of 4" />}
      footer={
        <>
          <Button label="Continue to phone verification" iconRight="arrow-right" loading={busy} onPress={submit} />
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.alt} accessibilityRole="button">
            <AppText variant="body" center>Already have an account? <AppText variant="bodyStrong" tone="link">Log in</AppText></AppText>
          </Pressable>
        </>
      }
    >
      <StepBar total={4} current={1} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Create your ResQ account</AppText>
        <AppText variant="body" tone="muted">Set up your details so your circle can reach you and you can reach them.</AppText>
      </View>

      <Card style={{ gap: 16 }}>
        <Input label="Full name" icon="user" placeholder="Ayesha Siddiqua" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" textContentType="name" />
        <View style={{ gap: 6 }}>
          <AppText variant="bodyStrong" style={{ marginLeft: 2 }}>Mobile number</AppText>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={styles.code}><AppText variant="bodyStrong">BD  +880</AppText></View>
            <View style={{ flex: 1 }}>
              <Input placeholder="01712-345678" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} textContentType="telephoneNumber" />
            </View>
          </View>
        </View>
        <Input label="Email address" icon="mail" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} textContentType="emailAddress" />
        <Input label="Password" icon="lock" secure placeholder="Create a password" value={pw} onChangeText={setPw} error={errors.pw} textContentType="newPassword" />
        {pw.length > 0 ? (
          <View style={styles.rules}>
            <View style={styles.strengthRow}>
              <AppText variant="caption" tone="muted">Password strength: {strength}</AppText>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map((i) => <View key={i} style={[styles.bar, { backgroundColor: i < passed ? (passed === 3 ? colors.safe : colors.warn) : 'rgba(19,39,63,0.18)' }]} />)}
              </View>
            </View>
            {rules.map((r) => {
              const ok = r.test(pw);
              return (
                <View key={r.label} style={styles.rule}>
                  <Icon name={ok ? 'check-circle' : 'circle'} size={16} color={ok ? colors.safeDeep : colors.inkFaint} />
                  <AppText variant="small" tone={ok ? 'safe' : 'muted'}>{r.label}</AppText>
                </View>
              );
            })}
          </View>
        ) : null}
        <Input label="Confirm password" icon="rotate-ccw" secure placeholder="Repeat your password" value={pw2} onChangeText={setPw2} error={errors.pw2}
          right={pw2.length > 0 && pw2 === pw ? <AppText variant="caption" tone="safe">Matched</AppText> : undefined} />
        <View>
          <Checkbox checked={agree} onChange={setAgree} label="Agree to terms">
            <AppText variant="small">I agree to the <AppText variant="small" style={styles.link}>Terms of Service</AppText> and <AppText variant="small" style={styles.link}>Privacy Policy</AppText></AppText>
          </Checkbox>
          {errors.agree ? <AppText variant="small" tone="sos">{errors.agree}</AppText> : null}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  alt: { minHeight: 44, justifyContent: 'center' },
  code: { height: 54, paddingHorizontal: 14, borderRadius: radius.md + 2, backgroundColor: colors.horizonSoft, justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  rules: { backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 12, gap: 8 },
  strengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: { width: 26, height: 5, borderRadius: 3 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  link: { fontFamily: 'Inter_700Bold', textDecorationLine: 'underline' },
});
