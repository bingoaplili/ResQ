import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { StepBar } from '../../components/Progress';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { firstName } from '../../utils/format';

export default function ProfileSetupScreen({ navigation }: RootProps<'ProfileSetup'>) {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user.name);
  const [tone, setTone] = useState(0);
  const mode = state.user.identityMode;
  const setMode = (m: 'firstName' | 'anonymous') => dispatch({ type: 'updateUser', patch: { identityMode: m } });

  const next = () => {
    dispatch({ type: 'updateUser', patch: { name: name.trim() } });
    navigation.navigate('SetupContacts');
  };

  const options = [
    { id: 'firstName' as const, title: 'Show my first name', tag: `“${firstName(name) || 'Your name'}”`, text: 'Verified responders see only your first name and approximate distance.', icon: 'users' as const },
    { id: 'anonymous' as const, title: 'Use an anonymous ID', tag: `“${state.user.anonymousId}”`, text: 'No name is shown to nearby volunteers until you choose to confirm.', icon: 'lock' as const },
  ];

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Profile" step="Step 3 of 4" />}
      footer={
        <>
          <Button label="Continue to emergency contacts" iconRight="arrow-right" disabled={name.trim().length < 2} onPress={next} />
          <Button label="Skip for now" variant="ghost" onPress={() => navigation.navigate('SetupContacts')} />
        </>
      }
    >
      <StepBar total={4} current={3} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Set up your profile</AppText>
        <AppText variant="body" tone="muted">This decides how you appear to your circle and to people who respond to you.</AppText>
      </View>

      <Card style={styles.photo}>
        <Avatar name={name || 'You'} size={76} index={tone} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <AppText variant="h3">Profile colour</AppText><Chip label="Optional" tone="ivory" />
          </View>
          <AppText variant="small" tone="muted">Helps your circle spot you quickly.</AppText>
          <Pressable onPress={() => setTone((t) => (t + 1) % 4)} accessibilityRole="button" accessibilityLabel="Change profile colour" style={styles.change}>
            <AppText variant="bodyStrong" tone="link">Change colour</AppText>
            <Icon name="refresh-cw" size={15} color={colors.link} />
          </Pressable>
        </View>
      </Card>

      <Card>
        <Input label="Display name" icon="user" value={name} onChangeText={setName} autoCapitalize="words" hint="Shown in your account and safety history." />
      </Card>

      <View style={styles.head}>
        <AppText variant="h2" style={{ flex: 1 }}>How you appear in emergencies</AppText>
        <Chip label="Privacy" icon="shield" tone="pink" />
      </View>

      {options.map((o) => {
        const on = mode === o.id;
        return (
          <Pressable key={o.id} onPress={() => setMode(o.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={o.title}>
            <Card tone={on ? 'horizon' : 'ivory'} style={on && { borderColor: colors.horizonDeep, borderWidth: 2 }}>
              <View style={styles.opt}>
                <View style={[styles.radio, on && styles.radioOn]}>{on ? <Icon name="check" size={14} color={colors.ivory} /> : null}</View>
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="h3">{o.title}</AppText>
                  <Chip label={o.tag} tone={on ? 'navy' : 'horizon'} />
                  <AppText variant="small" tone="muted">{o.text}</AppText>
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}

      <Card tone="navy" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <IconBadge name="eye-off" tone="bordeaux" />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Your details stay private</AppText>
          <AppText variant="small" tone="muted">Your phone number and address are never shown in public lists.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  change: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  opt: { flexDirection: 'row', gap: 12 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: colors.bordeaux, borderColor: colors.bordeaux },
});
