import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { ContactRow } from '../../components/ContactRow';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { Avatar } from '../../components/Avatar';
import { Sheet } from '../../components/Sheet';
import { StepBar } from '../../components/Progress';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { phoneBook } from '../../data/sample';

export default function SetupContactsScreen({ navigation }: RootProps<'SetupContacts'>) {
  const { state, dispatch } = useApp();
  const [picker, setPicker] = useState(false);

  const add = (i: number) => {
    const c = phoneBook[i];
    dispatch({
      type: 'addContact',
      contact: { ...c, id: `pb-${i}-${Date.now()}`, role: state.contacts.length === 0 ? 'Primary' : 'Co-responder', verified: true },
    });
  };

  const available = phoneBook.map((c, i) => ({ c, i })).filter(({ c }) => !state.contacts.some((x) => x.phone === c.phone));

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Your circle" step="Step 4 of 4" />}
      footer={
        <>
          <Button label="Save contacts & set permissions" iconRight="arrow-right" onPress={() => navigation.navigate('Permissions')} />
          <Button label="Skip for now" variant="ghost" onPress={() => navigation.navigate('Permissions')} />
        </>
      }
    >
      <StepBar total={4} current={4} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Add trusted emergency contacts</AppText>
        <AppText variant="body" tone="muted">Choose people you trust to be alerted when you send an SOS or start a journey.</AppText>
      </View>

      <Card tone="horizon" onPress={() => setPicker(true)} accessibilityLabel="Add from phone contacts">
        <View style={styles.add}>
          <IconBadge name="book" tone="navy" size={52} />
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Add from phone contacts</AppText>
            <AppText variant="small" tone="muted">Pick someone you already know</AppText>
          </View>
          <Icon name="chevron-right" size={22} color={colors.navy} />
        </View>
      </Card>
      <Pressable onPress={() => navigation.navigate('ContactForm')} accessibilityRole="button" style={styles.manual}>
        <Icon name="edit-3" size={17} color={colors.navy} />
        <AppText variant="bodyStrong">or enter details manually</AppText>
      </Pressable>

      <View style={styles.head}>
        <AppText variant="h2">Selected guardians</AppText>
        <Chip label={`${state.contacts.length} added`} tone="pink" />
      </View>

      {state.contacts.length === 0 ? (
        <Card tone="pink" style={{ alignItems: 'center', gap: 6 }}>
          <IconBadge name="users" tone="bordeaux" size={54} round />
          <AppText variant="h3" center>No one added yet</AppText>
          <AppText variant="small" tone="muted" center>Add at least two people so someone can always respond.</AppText>
        </Card>
      ) : (
        state.contacts.map((c, i) => (
          <ContactRow key={c.id} contact={c} index={i}
            onEdit={() => navigation.navigate('ContactForm', { id: c.id })}
            onDelete={() => dispatch({ type: 'removeContact', id: c.id })} />
        ))
      )}

      <Card tone="navy" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <IconBadge name="shield" tone="bordeaux" />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Recommended</AppText>
          <AppText variant="small" tone="muted">Add at least two guardians who are usually nearby or reachable at night.</AppText>
        </View>
      </Card>

      <Sheet visible={picker} onClose={() => setPicker(false)} title="Phone contacts">
        {available.length === 0 ? <AppText tone="muted">Everyone from your contacts is already in your circle.</AppText> : null}
        {available.map(({ c, i }) => (
          <Pressable key={c.phone} onPress={() => { add(i); setPicker(false); }} accessibilityRole="button" accessibilityLabel={`Add ${c.name}`} style={styles.pick}>
            <Avatar name={c.name} size={46} index={i} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{c.name}</AppText>
              <AppText variant="small" tone="muted">{c.relation} · {c.phone}</AppText>
            </View>
            <Icon name="plus-circle" size={24} color={colors.bordeaux} />
          </Pressable>
        ))}
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  add: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  manual: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60 },
});
