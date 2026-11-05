import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { StepBar } from '../../components/Progress';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { incidentTypes } from '../../data/sample';

export default function ReportTypeScreen({ navigation }: RootProps<'ReportType'>) {
  const { state, dispatch } = useApp();
  const sel = state.draft.type;
  const cancel = () => { dispatch({ type: 'resetDraft' }); navigation.navigate('Main'); };

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Report an incident" step="Step 1 of 4" onBack={cancel} />}
      footer={
        <>
          <Button label="Continue to location" iconRight="arrow-right" disabled={!sel} onPress={() => navigation.navigate('ReportLocation')} />
          <Button label="Cancel" variant="ghost" onPress={cancel} />
        </>
      }
    >
      <StepBar total={4} current={1} />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">What happened?</AppText>
        <AppText variant="body" tone="muted">Help your community understand a risk with clear, factual details.</AppText>
      </View>

      <Card tone="horizon" style={{ flexDirection: 'row', gap: 12 }}>
        <IconBadge name="shield" tone="navy" size={42} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <AppText variant="h3">Before you report</AppText><Chip label="Anonymous" tone="pink" />
          </View>
          <AppText variant="small" tone="muted">Share only what you’re comfortable with and avoid personal details about others. A moderator reviews every report before it appears.</AppText>
        </View>
      </Card>

      <View style={styles.head}>
        <AppText variant="h2">Incident type</AppText>
        {sel ? <AppText variant="label" tone="accent">1 selected</AppText> : null}
      </View>

      {incidentTypes.map((t) => {
        const on = sel === t.id;
        return (
          <Pressable key={t.id} onPress={() => dispatch({ type: 'patchDraft', patch: { type: t.id } })}
            accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={t.title}>
            <Card tone={on ? 'horizon' : 'ivory'} edge={on ? colors.bordeaux : undefined} style={on && { borderColor: colors.horizonDeep, borderWidth: 2 }}>
              <View style={styles.row}>
                <IconBadge name={t.icon} tone={on ? 'bordeaux' : 'horizon'} />
                <View style={{ flex: 1 }}>
                  <AppText variant="h3">{t.title}</AppText>
                  <AppText variant="small" tone="muted" numberOfLines={2}>{t.text}</AppText>
                </View>
                <View style={[styles.radio, on && styles.radioOn]}>{on ? <Icon name="check" size={14} color={colors.ivory} /> : null}</View>
              </View>
            </Card>
          </Pressable>
        );
      })}
      <View style={styles.anon}><Icon name="lock" size={15} color={colors.inkMuted} /><AppText variant="small" tone="muted">Your identity stays anonymous to other commuters.</AppText></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.bordeaux, borderColor: colors.bordeaux },
  anon: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
});
