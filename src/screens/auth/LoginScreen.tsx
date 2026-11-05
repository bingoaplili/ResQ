import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Sheet } from '../../components/Sheet';
import { Avatar } from '../../components/Avatar';
import { useToast } from '../../components/Toast';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { phoneBook } from '../../data/sample';
import { isEmail, isPhone } from '../../utils/format';

export default function LoginScreen({ navigation }: RootProps<'Login'>) {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!isEmail(id) && !isPhone(id)) e.id = 'Enter a valid phone number or email.';
    if (pw.length < 8) e.pw = 'Password must be at least 8 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await api.logIn(id, pw);
    if (!state.user.name) {
      const base = isEmail(id) ? id.split('@')[0] : 'Friend';
      dispatch({ type: 'updateUser', patch: { name: base.charAt(0).toUpperCase() + base.slice(1), email: isEmail(id) ? id : '', phone: isPhone(id) ? id : '' } });
    }
    if (state.contacts.length === 0) {
      phoneBook.slice(0, 2).forEach((c, i) =>
        dispatch({ type: 'addContact', contact: { ...c, id: `seed-${i}`, role: i === 0 ? 'Primary' : 'Co-responder', verified: true } })
      );
    }
    dispatch({ type: 'signIn' });
    setBusy(false);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <Screen variant="ivory" header={<FlowHeader title="Log in" />}>
      <View style={{ gap: 6 }}>
        <Chip label="Secure login" icon="shield" tone="pink" />
        <AppText variant="h1" style={{ marginTop: 6 }}>Welcome back</AppText>
        <AppText variant="body" tone="muted">Sign in to see your circle, your journeys and your safety settings.</AppText>
      </View>

      <Card style={{ gap: 16 }}>
        <Input label="Phone number or email" icon="user" placeholder="+880 1712-345678 or you@example.com" value={id} onChangeText={setId} autoCapitalize="none" error={errors.id} />
        <View style={{ gap: 6 }}>
          <Input label="Password" icon="lock" secure placeholder="Your password" value={pw} onChangeText={setPw} error={errors.pw} />
          <Pressable onPress={() => setForgot(true)} accessibilityRole="button" style={styles.forgot}>
            <AppText variant="bodyStrong" tone="link">Forgot password?</AppText>
          </Pressable>
        </View>
        <Button label="Log in" iconRight="arrow-right" loading={busy} onPress={submit} />
        <Button label="Continue with Google" variant="secondary" icon="globe" onPress={() => { dispatch({ type: 'signIn' }); navigation.navigate('ProfileSetup'); }} />
        <Pressable onPress={() => navigation.replace('CreateAccount')} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}>
          <AppText center>New to ResQ? <AppText variant="bodyStrong" tone="link">Create an account</AppText></AppText>
        </Pressable>
      </Card>

      <Card tone="navy" style={{ gap: 10 }}>
        <AppText variant="label" tone="muted">Your circle</AppText>
        <View style={styles.circle}>
          {phoneBook.slice(0, 2).map((c, i) => (
            <View key={c.name} style={styles.person}>
              <Avatar name={c.name} size={40} index={i} />
              <View>
                <AppText variant="bodyStrong" style={{ fontSize: 13 }}>{c.name.split(' ')[0]}</AppText>
                <AppText variant="caption" tone="muted">{c.relation}</AppText>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Sheet visible={forgot} onClose={() => setForgot(false)} title="Reset your password">
        <AppText variant="body" tone="muted">Enter your email and we’ll send you a link to choose a new password.</AppText>
        <Input icon="mail" placeholder="you@example.com" value={resetEmail} onChangeText={setResetEmail} keyboardType="email-address" autoCapitalize="none" />
        <Button label="Send reset link" disabled={!isEmail(resetEmail)} onPress={() => { setForgot(false); toast.show('Reset link sent'); }} />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  circle: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  person: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
