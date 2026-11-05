import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { useToast } from '../../components/Toast';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { isPhone } from '../../utils/format';
import { Contact } from '../../types';

const ROLES: Contact['role'][] = ['Primary', 'Co-responder', 'Guardian'];

export default function ContactFormScreen({ navigation, route }: RootProps<'ContactForm'>) {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const existing = state.contacts.find((c) => c.id === route.params?.id);
  const [name, setName] = useState(existing?.name ?? '');
  const [relation, setRelation] = useState(existing?.relation ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [role, setRole] = useState<Contact['role']>(existing?.role ?? (state.contacts.length === 0 ? 'Primary' : 'Co-responder'));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter their name.';
    if (!relation.trim()) e.relation = 'Tell us how you know them.';
    if (!isPhone(phone)) e.phone = 'Enter a valid mobile number.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    if (existing) {
      dispatch({ type: 'updateContact', contact: { ...existing, name: name.trim(), relation: relation.trim(), phone: phone.trim(), role } });
    } else {
      const c = await api.saveContact({ name: name.trim(), relation: relation.trim(), phone: phone.trim(), role, verified: false });
      dispatch({ type: 'addContact', contact: c });
    }
    setBusy(false);
    toast.show(existing ? 'Contact updated' : 'Contact added');
    navigation.goBack();
  };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title={existing ? 'Edit contact' : 'New contact'} />}
      footer={<Button label={existing ? 'Save changes' : 'Add to my circle'} icon="check" loading={busy} onPress={save} />}
    >
      <AppText variant="h1">{existing ? 'Edit guardian' : 'Add a guardian'}</AppText>
      <Card style={{ gap: 16 }}>
        <Input label="Full name" icon="user" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} />
        <Input label="Relationship" icon="heart" placeholder="Sister, friend, roommate…" value={relation} onChangeText={setRelation} error={errors.relation} />
        <Input label="Mobile number" icon="phone" placeholder="+880 1712-345678" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <View style={{ gap: 8 }}>
          <AppText variant="bodyStrong">Role in your circle</AppText>
          <View style={styles.roles}>
            {ROLES.map((r) => <Chip key={r} label={r} selected={role === r} tone="horizon" onPress={() => setRole(r)} />)}
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ roles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
