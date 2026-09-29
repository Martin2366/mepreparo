import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import limits from '@/content/limits.json';
import { dayKey } from '@/engine/dates';
import { PRICES } from '@/engine/entitlements';
import { endOfTrialOffer, passUntil } from '@/engine/premium';
import { track } from '@/features/cloud/auth';
import { useOnboarding } from '@/features/onboarding/store';
import { FullScreen } from '@/features/shell/FullScreen';
import { clp, dateTime, lastMinute, longDate } from '@/lib/format';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { buy, loadPlans, type Plans, purchasesAvailable, restore } from './purchases';
import { premiumUntil, SESSIONS, TRIAL_DAYS, usePlan, usePremiumStore } from './store';

type Choice = 'monthly' | 'pass';

const COMPARE: [string, string, string][] = [
  ['Lecciones y mini-clases', 'Todas', 'Todas'],
  ['Explicación de cada error', 'Siempre', 'Siempre'],
  ['Práctica por tema', '20 al día', 'Sin límite'],
  ['Resoluciones paso a paso', '3 al día', 'Sin límite'],
  ['Ensayo completo M1', '1 al mes', 'Sin límite'],
  ['Mini-ensayos', '1 a la semana', 'Sin límite'],
  ['Ensayos temáticos y a tu medida', '—', 'Sin límite'],
  ['Intensivos', 'Día 1', 'Completos'],
  ['Cuaderno de errores', '7 días', 'Todo'],
  ['Ensayos en PDF con clavijero', '—', 'Sí'],
  ['Reto relámpago', '1 al día', 'Sin límite'],
];

export const PLAY_SUBSCRIPTIONS = 'https://play.google.com/store/account/subscriptions?package=cl.mepreparo.app';

/**
 * Planes y boleta (PRD §4, prompt de diseño parte 7): comparación honesta, dos opciones y una boleta con el precio
 * final, la vigencia y si se renueva, antes de tocar «Pagar». La hoja de Google Play vuelve a mostrar el total.
 */
export function PlansScreen() {
  const params = useLocalSearchParams<{ plan?: Choice }>();
  const trialStartedAt = useOnboarding((s) => s.answers.trialStartedAt);
  const offerUsed = usePremiumStore((s) => s.offerUsed);
  const markOfferUsed = usePremiumStore((s) => s.markOfferUsed);
  const sub = usePremiumStore((s) => s.subscriptionUntil);
  const pass = usePremiumStore((s) => s.pass);
  const plan = usePlan();
  const now = new Date();
  const offer = endOfTrialOffer(trialStartedAt, now, { trialDays: TRIAL_DAYS, offerHours: PRICES.offerHours, used: offerUsed });
  const offerOn = !!offer?.active;

  const [choice, setChoice] = useState<Choice>(params.plan === 'monthly' ? 'monthly' : 'pass');
  const [plans, setPlans] = useState<Plans | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable' | 'offline' | 'buying' | 'done'>(
    purchasesAvailable() ? 'loading' : 'unavailable',
  );
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!purchasesAvailable()) return;
    loadPlans()
      .then((p) => {
        setPlans(p);
        setState(p && (p.monthly || p.pass) ? 'ready' : 'offline');
      })
      .catch(() => setState('offline'));
  }, []);

  const half = (n: number) => Math.round((n * (100 - PRICES.offerPct)) / 100);
  const monthlyPrice = offerOn ? (plans?.monthly?.offerPrice ?? clp(half(PRICES.monthly))) : (plans?.monthly?.price ?? clp(PRICES.monthly));
  const passPrice = offerOn ? (plans?.passOffer?.price ?? clp(half(PRICES.pass))) : (plans?.pass?.price ?? clp(PRICES.pass));
  const passEnds = passUntil(dayKey(now), SESSIONS);
  const price = choice === 'monthly' ? monthlyPrice : passPrice;

  const pay = async () => {
    if (!plans) return;
    setState('buying');
    setNote(null);
    const target =
      choice === 'monthly'
        ? offerOn && plans.monthly?.offer
          ? { option: plans.monthly.offer }
          : plans.monthly
            ? { pkg: plans.monthly.pkg }
            : null
        : offerOn && plans.passOffer
          ? { pkg: plans.passOffer.pkg }
          : plans.pass
            ? { pkg: plans.pass.pkg }
            : null;
    if (!target) {
      setState('ready');
      setNote('Esta opción no está disponible ahora. Prueba con la otra o más tarde.');
      return;
    }
    const r = await buy(target);
    track('purchase', { plan: choice, offer: offerOn, result: r });
    if (r === 'ok') {
      if (offerOn) markOfferUsed();
      setState('done');
    } else {
      setState('ready');
      if (r === 'error') setNote('No se pudo completar la compra. No se cobró nada. Revisa tu conexión e inténtalo de nuevo.');
    }
  };

  const onRestore = async () => {
    setNote(null);
    const r = await restore();
    setNote(
      r === 'ok'
        ? premiumUntil(usePremiumStore.getState())
          ? 'Listo: recuperamos tu Premium.'
          : 'No encontramos compras con esta cuenta de Google Play.'
        : r === 'unavailable'
          ? 'Las compras llegan con la próxima actualización de la app.'
          : 'No pudimos conectarnos. Inténtalo de nuevo con internet.',
    );
  };

  if (state === 'done') {
    const until = premiumUntil(usePremiumStore.getState());
    return (
      <FullScreen title="Premium" footer={<Button label="Seguir" onPress={() => goBack()} />}>
        <View style={s.center}>
          <Mascot pose="celebrando" height={150} pop />
          <Text style={s.h1}>¡Listo! Ya tienes Premium</Text>
          <Text style={s.body}>Gracias por apoyar MePreparo. Todo tu progreso sigue aquí.</Text>
        </View>
        <Receipt
          item={choice === 'monthly' ? 'Premium mensual' : 'Pase PAES'}
          price={price}
          until={until ? longDate(until) : '—'}
          renews={choice === 'monthly' ? 'Cada mes, hasta que canceles' : 'No se renueva'}
        />
      </FullScreen>
    );
  }

  if (plan.kind === 'premium') {
    const isPass = !!pass && (!sub || pass.until >= sub.slice(0, 10));
    return (
      <FullScreen title="Tu Premium">
        <View style={s.center}>
          <Mascot pose="celebrando" height={120} float={false} />
          <Text style={s.h1}>{isPass ? 'Tienes el Pase PAES' : 'Tienes Premium mensual'}</Text>
          <Text style={s.body}>
            {isPass
              ? `Premium hasta el ${longDate(pass!.until)}. Un solo pago: no se renueva.`
              : `Se renueva el ${longDate(plan.until ?? '')}. Puedes cancelar cuando quieras desde Google Play.`}
          </Text>
        </View>
        {!isPass ? <Button label="Gestionar o cancelar en Google Play" variant="secondary" onPress={() => Linking.openURL(PLAY_SUBSCRIPTIONS)} /> : null}
        <Button label="Restaurar compras" variant="ghost" onPress={onRestore} />
        {note ? <Text style={s.note}>{note}</Text> : null}
      </FullScreen>
    );
  }

  const busy = state === 'buying' || state === 'loading';
  const footer = (
    <View style={{ gap: 6 }}>
      <Button
        label={state === 'unavailable' ? 'Compra disponible pronto' : state === 'offline' ? 'Sin conexión con Google Play' : `Pagar ${price}`}
        disabled={state !== 'ready'}
        onPress={pay}
      />
      <Text style={s.caption}>Nunca cobramos sin que toques «Pagar». Google Play te mostrará el total antes de confirmar.</Text>
    </View>
  );

  return (
    <FullScreen title="Premium" footer={footer}>
      <View style={s.hero}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={s.h1}>Prepárate como en un preu</Text>
          <Text style={s.body}>Aprender siempre es gratis. Premium suma ensayos, práctica y resoluciones sin límite.</Text>
        </View>
        <Mascot pose="senalando" height={96} float={false} />
      </View>

      {offerOn && offer ? (
        <Card tone="coral" padding={14} style={{ gap: 4 }}>
          <Text style={s.strong}>{PRICES.offerPct} % de descuento por terminar tu prueba</Text>
          <Text style={s.small}>
            En el primer mes o en el Pase PAES. Vale hasta el {dateTime(lastMinute(offer.endsAt))}. Es una sola vez y no se reinicia.
          </Text>
        </Card>
      ) : null}

      <View style={{ gap: 10 }}>
        <PlanOption
          on={choice === 'pass'}
          onPress={() => setChoice('pass')}
          title="Pase PAES"
          price={passPrice}
          was={offerOn ? clp(PRICES.pass) : null}
          detail={`Un solo pago. Premium hasta el ${longDate(passEnds)}. Sin renovación.`}
          tag="Recomendado"
        />
        <PlanOption
          on={choice === 'monthly'}
          onPress={() => setChoice('monthly')}
          title="Mensual"
          price={`${monthlyPrice}${offerOn ? ' el 1.er mes' : ' al mes'}`}
          was={offerOn ? clp(PRICES.monthly) : null}
          detail={`Se renueva cada mes${offerOn ? ` a ${clp(PRICES.monthly)}` : ''}. Cancela cuando quieras desde Google Play.`}
        />
      </View>

      <Receipt
        item={choice === 'monthly' ? 'Premium mensual' : 'Pase PAES'}
        price={price}
        until={choice === 'monthly' ? 'Un mes desde hoy' : longDate(passEnds)}
        renews={choice === 'monthly' ? `Cada mes a ${clp(PRICES.monthly)}, hasta que canceles` : 'No se renueva'}
      />

      {busy ? <ActivityIndicator color={colors.sky700} /> : null}
      {state === 'unavailable' ? (
        <Text style={s.note}>La compra se habilita con la próxima actualización de la app. Mientras, todo lo gratis sigue disponible.</Text>
      ) : null}
      {note ? <Text style={s.note}>{note}</Text> : null}

      <Card padding={14} style={{ gap: 8 }}>
        <View style={s.tr}>
          <Text style={[s.th, { flex: 1.4 }]}>Qué incluye</Text>
          <Text style={s.th}>Gratis</Text>
          <Text style={s.th}>Premium</Text>
        </View>
        {COMPARE.map(([what, free, prem]) => (
          <View key={what} style={s.tr}>
            <Text style={[s.td, { flex: 1.4 }]}>{what}</Text>
            <Text style={[s.td, { color: colors.graphite }]}>{free}</Text>
            <Text style={[s.td, s.tdStrong]}>{prem}</Text>
          </View>
        ))}
      </Card>

      <Button label="Restaurar compras" variant="ghost" onPress={onRestore} />
      <Text style={s.caption}>
        Tu prueba de {limits.trialDays} días nunca se convierte en cobro. Pagos con Google Play; precios en pesos chilenos con IVA incluido.
      </Text>
      <Button label="Seguir gratis" variant="ghost" onPress={() => goBack()} />
    </FullScreen>
  );
}

function PlanOption(p: { on: boolean; onPress: () => void; title: string; price: string; was: string | null; detail: string; tag?: string }) {
  return (
    <Tappable accessibilityRole="radio" accessibilityState={{ selected: p.on }} onPress={p.onPress} style={[s.option, p.on && s.optionOn]}>
      <View style={[s.radio, p.on && s.radioOn]}>{p.on ? <Icon name="check" size={14} color={colors.ink} /> : null}</View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={s.row}>
          <Text style={s.strong}>{p.title}</Text>
          {p.tag ? <Chip label={p.tag} tone="premium" /> : null}
        </View>
        <View style={s.row}>
          <Text style={s.price}>{p.price}</Text>
          {p.was ? <Text style={s.was}>{p.was}</Text> : null}
        </View>
        <Text style={s.small}>{p.detail}</Text>
      </View>
    </Tappable>
  );
}

/** Boleta de papel: ítem, total, vigencia y renovación (el asset de marca). */
export function Receipt({ item, price, until, renews }: { item: string; price: string; until: string; renews: string }) {
  return (
    <View style={s.receipt} accessibilityLabel={`Boleta: ${item}, total ${price}, vigencia ${until}, ${renews}`}>
      <Text style={s.receiptTitle}>BOLETA · MePreparo</Text>
      <View style={s.dash} />
      <Line label={item} value={price} />
      <Line label="Vigencia" value={until} />
      <Line label="Renovación" value={renews} />
      <View style={s.dash} />
      <Line label="Total a pagar hoy" value={price} strong />
    </View>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={s.line}>
      <Text style={[s.lineLabel, strong && s.lineStrong]}>{label}</Text>
      <Text style={[s.lineValue, strong && s.lineStrong]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  center: { alignItems: 'center', gap: 10, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  h1: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink, textAlign: 'left' },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite, textAlign: 'center' },
  note: { fontFamily: fonts['poppins-medium'], fontSize: 14, lineHeight: 20, color: colors.ink, textAlign: 'center' },
  price: { fontFamily: fonts['poppins-bold'], fontSize: 20, lineHeight: 26, color: colors.ink },
  was: { fontFamily: fonts.poppins, fontSize: 14, color: colors.graphite, textDecorationLine: 'line-through' },
  option: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  optionOn: { borderColor: colors.sky, backgroundColor: colors.sky50 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.graphite300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOn: { borderColor: colors.sky, backgroundColor: colors.sky },
  receipt: {
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 8,
  },
  receiptTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 13, letterSpacing: 1.5, color: colors.graphite, textAlign: 'center' },
  dash: { borderBottomWidth: 1, borderStyle: 'dashed', borderColor: colors.graphite300, marginVertical: 2 },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  lineLabel: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite, flexShrink: 1 },
  lineValue: { fontFamily: fonts['poppins-medium'], fontSize: 14, lineHeight: 20, color: colors.ink, textAlign: 'right', flexShrink: 1 },
  lineStrong: { fontFamily: fonts['poppins-bold'], fontSize: 16, color: colors.ink },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  th: { flex: 1, fontFamily: fonts['poppins-semibold'], fontSize: 13, color: colors.ink },
  td: { flex: 1, fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.ink },
  tdStrong: { fontFamily: fonts['poppins-semibold'] },
});
