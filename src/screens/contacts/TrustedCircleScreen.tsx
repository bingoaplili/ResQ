import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ContactRow } from '../../components/ContactRow';
import { IconBadge } from '../../components/IconBadge';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';

export default function TrustedCircleScreen({ navigation }: RootProps<'TrustedCircle'>) {
  const { state, dispatch } = useApp();
  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Trusted circle" />}
      footer={<Button label="Add a guardian" icon="user-plus" onPress={() => navigation.navigate('ContactForm')} />}
    >
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Your trusted circle</AppText>
        <AppText variant="body" tone="muted">These people are alerted when you send an SOS or miss a journey check-in.</AppText>
      </View>
      {state.contacts.length === 0 ? (
        <Card tone="pink" style={{ alignItems: 'center', gap: 6 }}>
          <IconBadge name="users" tone="bordeaux" size={56} round />
          <AppText variant="h3" center>Your circle is empty</AppText>
          <AppText variant="small" tone="muted" center>Add someone you trust so help can reach you faster.</AppText>
        </Card>
      ) : state.contacts.map((c, i) => (
        <ContactRow key={c.id} contact={c} index={i}
          onEdit={() => navigation.navigate('ContactForm', { id: c.id })}
          onDelete={() => dispatch({ type: 'removeContact', id: c.id })} />
      ))}
    </Screen>
  );
}
