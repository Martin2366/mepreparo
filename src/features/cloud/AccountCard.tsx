import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { confirm } from '@/lib/confirm';
import { supabase } from '@/lib/supabase';
import { colors, fonts } from '@/theme/tokens';

import { deleteAccount, type GoogleResult, linkGoogle, signInWithGoogle, track } from './auth';
import { useCloud } from './store';

export const maskEmail = (e: string) => e.replace(/^(.{2})[^@]*(@.*)$/, '$1…$2');

/** Texto del indicador de respaldo (plan §5.3): «Guardado en tu teléfono» o «Respaldado». */
export function useBackupLabel(): { label: string; backedUp: boolean } {
  const status = useCloud((s) => s.status);
  const isAnonymous = useCloud((s) => s.isAnonymous);
  const lastSyncAt = useCloud((s) => s.lastSyncAt);
  if (status === 'off' || !lastSyncAt) return { label: 'Guardado en tu teléfono', backedUp: false };
  if (!isAnonymous) return { label: 'Respaldado con Google', backedUp: true };
  return { label: 'Guardado en tu teléfono y en la nube', backedUp: false };
}

function explain(r: GoogleResult) {
  if (r === 'offline') Alert.alert('Sin conexión', 'Para respaldar con Google necesitas internet. Tu progreso sigue guardado en este teléfono.');
  if (r === 'error') Alert.alert('No se pudo conectar con Google', 'Inténtalo de nuevo en un rato. Tu progreso sigue guardado en este teléfono.');
}

/** Resultado de entrar a una cuenta de Google con progreso: lo de este teléfono se mezcla con lo respaldado. */
export async function enterGoogle(): Promise<boolean> {
  const r = await signInWithGoogle();
  track('signin_google', { result: r });
  if (r === 'ok') return true;
  explain(r);
  return false;
}

/** Cuenta y respaldo (PRD §12). */
export function AccountCard() {
  const isAnonymous = useCloud((s) => s.isAnonymous);
  const email = useCloud((s) => s.email);
  const { label, backedUp } = useBackupLabel();
  const [busy, setBusy] = useState(false);

  const onLink = async () => {
    setBusy(true);
    const r = await linkGoogle();
    setBusy(false);
    if (r === 'ok') Alert.alert('Listo', 'Tu progreso quedó respaldado con Google. Si cambias de teléfono, entra con la misma cuenta.');
    else if (r === 'conflict') {
      const ok = await confirm(
        'Esa cuenta de Google ya tiene progreso',
        'Puedes entrar a esa cuenta: juntamos lo de este teléfono con lo que ya tenías respaldado, sin perder nada.',
        'Usar mi cuenta de Google',
      );
      if (!ok) return;
      setBusy(true);
      await enterGoogle();
      setBusy(false);
    } else explain(r);
  };

  return (
    <Card style={{ gap: 10 }}>
      <View style={s.row}>
        <Icon name={backedUp ? 'cloud-check' : 'smartphone'} size={20} color={backedUp ? colors.success700 : colors.graphite} />
        <View style={{ flex: 1 }}>
          <Text style={s.body}>{label}</Text>
          {!isAnonymous && email ? <Text style={s.caption}>{maskEmail(email)}</Text> : null}
        </View>
      </View>
      {isAnonymous ? (
        <>
          <Text style={s.small}>Respalda con Google para no perder tu progreso si cambias o reinstalas el teléfono. Solo guardamos tu correo.</Text>
          <Button label={busy ? 'Conectando…' : 'Respaldar con Google'} variant="secondary" disabled={busy || !supabase} onPress={onLink} />
        </>
      ) : null}
    </Card>
  );
}

/** Borrar mi cuenta y datos (Play lo exige): confirmación clara y sin vuelta atrás. */
export function DeleteAccountButton() {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const r = await deleteAccount();
    setBusy(false);
    if (r === 'ok') {
      Alert.alert('Cuenta borrada', 'Borramos tu cuenta y tus datos de la nube y de este teléfono.');
      router.replace('/onboarding');
    } else if (r === 'offline') Alert.alert('Sin conexión', 'Para borrar tu cuenta necesitas internet. No se borró nada.');
    else Alert.alert('No se pudo borrar', 'Inténtalo de nuevo en un rato. No se borró nada.');
  };
  return (
    <Button
      label={busy ? 'Borrando…' : 'Borrar mi cuenta y datos'}
      variant="ghost"
      disabled={busy}
      onPress={async () => {
        const ok = await confirm(
          '¿Borrar tu cuenta y tus datos?',
          'Se borra tu progreso, tu racha, tus ensayos y tu respaldo con Google, en este teléfono y en la nube. No se puede deshacer. Si tienes una suscripción, cancélala en Google Play.',
          'Borrar todo',
        );
        if (ok) await run();
      }}
    />
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
});
