import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Icon, isIconName } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { type Badge, BADGES, type BadgeStats, newBadges } from '@/engine/badges';
import { dayKey } from '@/engine/dates';
import { useHasPremium } from '@/features/premium/store';
import { isMastered } from '@/engine/mastery';
import { streakOf } from '@/engine/streak';
import { levelOf } from '@/engine/xp';
import { curriculum } from '@/features/content/catalog';
import { useExams } from '@/features/exams/store';
import { useOnboarding } from '@/features/onboarding/store';
import { colors, fonts } from '@/theme/tokens';

import { useProgress } from './store';

type ProgressData = ReturnType<typeof useProgress.getState>;
type ExamData = ReturnType<typeof useExams.getState>;

/** Métricas para las reglas de logros, desde el progreso y el historial de ensayos. */
export function badgeStats(p: ProgressData, e: ExamData): BadgeStats {
  const mastered = (unitId: string) => isMastered(p.unitOutcomes[unitId] ?? []);
  return {
    lessons: Object.values(p.lessons).filter((l) => l.status === 'completed').length,
    streak: streakOf(new Set(p.activeDays), dayKey(new Date())).current,
    ahas: p.counters.ahas,
    attempts: p.attempts,
    exams: e.history.length,
    fullExams: e.history.filter((r) => r.spec.kind === 'full').length,
    reviewCorrect: p.counters.reviewCorrect,
    axesPracticed: curriculum.axes.filter((a) => a.units.some((u) => (p.unitOutcomes[u.id]?.length ?? 0) > 0)).length,
    masteredUnits: curriculum.axes.flatMap((a) => a.units).filter((u) => mastered(u.id)).length,
    masteredAxes: curriculum.axes.filter((a) => a.units.every((u) => mastered(u.id))).length,
    level: levelOf(p.xp).level,
    bestExamScore: Math.max(0, ...e.history.map((r) => r.result.score)),
  };
}

/**
 * Vigila los logros: cuando se cumple uno nuevo lo guarda (una sola vez) y lo celebra.
 * Va en el layout raíz para que funcione desde cualquier pantalla (lección, práctica, ensayo).
 */
export function BadgeWatcher() {
  const progress = useProgress();
  const exams = useExams();
  const premium = useHasPremium();
  const completed = useOnboarding((s) => s.completed);

  useEffect(() => {
    if (!completed) return;
    const fresh = newBadges(badgeStats(progress, exams), premium, progress.badges);
    if (fresh.length === 0) return;
    progress.earnBadges(fresh);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [progress, exams, premium, completed]);

  const current = BADGES.find((b) => b.id === progress.unseenBadges[0]);
  if (!current) return null;
  const seen = () => progress.markBadgeSeen(current.id);
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => seen()}>
      <View style={s.scrim}>
        <View style={s.card}>
          <Mascot pose="celebrando" height={110} float={false} />
          <Text style={s.overline}>LOGRO DESBLOQUEADO</Text>
          <Animated.View entering={ZoomIn.springify().damping(9)} style={s.medal}>
            <Icon name={isIconName(current.icon) ? current.icon : 'star'} size={40} color={colors.ink} />
          </Animated.View>
          <Text style={s.title}>{current.title}</Text>
          <Text style={s.body}>{current.description}</Text>
          <View style={{ alignSelf: 'stretch' }}>
            <Button label="Seguir" onPress={() => seen()} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function BadgeMedal({ badge, earned, size = 56 }: { badge: Badge; earned: boolean; size?: number }) {
  return (
    <View
      style={[
        s.medalSmall,
        { width: size, height: size, borderRadius: size / 2 },
        earned ? { backgroundColor: colors.sky100, borderColor: colors.sky } : { backgroundColor: colors.white, borderColor: colors.graphite200 },
      ]}
    >
      <Icon name={isIconName(badge.icon) ? badge.icon : 'star'} size={size * 0.45} color={earned ? colors.ink : colors.graphite300} />
    </View>
  );
}

const s = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(30,42,74,0.36)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.paper, borderRadius: 28, padding: 24, alignItems: 'center', gap: 10, width: '100%', maxWidth: 380 },
  overline: { fontFamily: fonts['poppins-semibold'], fontSize: 12, letterSpacing: 1.7, color: colors.coral700 },
  medal: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.sky100,
    borderWidth: 3,
    borderColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalSmall: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite, textAlign: 'center' },
});
