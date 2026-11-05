import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Contact } from '../types';
import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Chip } from './Chip';
import { Icon } from './Icon';

type Props = { contact: Contact; index?: number; onEdit?: () => void; onDelete?: () => void };

export function ContactRow({ contact, index = 0, onEdit, onDelete }: Props) {
  return (
    <Card padding={0} edge={contact.role === 'Primary' ? colors.bordeaux : colors.horizonDeep}>
      <View style={styles.top}>
        <Avatar name={contact.name} size={52} index={index} />
        <View style={{ flex: 1, gap: 3 }}>
          <AppText variant="h3" numberOfLines={1}>{contact.name}</AppText>
          <View style={{ flexDirection: 'row' }}>
            <Chip label={contact.role} tone={contact.role === 'Primary' ? 'pink' : 'horizon'} />
          </View>
          <AppText variant="small" tone="muted">{contact.relation}</AppText>
        </View>
        {onEdit ? (
          <Pressable onPress={onEdit} accessibilityRole="button" accessibilityLabel={`Edit ${contact.name}`} style={styles.btn}>
            <Icon name="edit-2" size={18} color={colors.navy} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable onPress={onDelete} accessibilityRole="button" accessibilityLabel={`Remove ${contact.name}`} style={styles.btn}>
            <Icon name="trash-2" size={18} color={colors.bordeaux} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.bottom}>
        <Icon name="phone" size={15} color={colors.inkMuted} />
        <AppText variant="small" style={{ flex: 1, fontVariant: ['tabular-nums'] }}>{contact.phone}</AppText>
        {contact.verified ? <Chip label="Verified" tone="safe" dot /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingLeft: 18 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: 'rgba(128,174,232,0.18)' },
  btn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
