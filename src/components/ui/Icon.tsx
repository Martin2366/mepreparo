import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  ChartColumn,
  Check,
  CircleDashed,
  Clock,
  Coins,
  EyeOff,
  Feather,
  FlaskConical,
  Gem,
  Globe,
  Landmark,
  Leaf,
  Lightbulb,
  ListChecks,
  Lock,
  type LucideIcon,
  Map as MapIcon,
  Minus,
  Newspaper,
  Percent,
  Plus,
  Scale,
  Search,
  Sigma,
  Sparkle,
  Timer,
  Users,
  X,
  Zap,
} from 'lucide-react-native';

import { colors } from '@/theme/tokens';

/** Íconos de interfaz: Lucide, trazo de 2 px y puntas redondas (design system → Icon). */
const ICONS = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  bell: Bell,
  book: BookOpen,
  'calendar-check': CalendarCheck,
  chart: ChartColumn,
  check: Check,
  'circle-dashed': CircleDashed,
  clock: Clock,
  coins: Coins,
  'eye-off': EyeOff,
  feather: Feather,
  flask: FlaskConical,
  gem: Gem,
  globe: Globe,
  landmark: Landmark,
  leaf: Leaf,
  lightbulb: Lightbulb,
  'list-checks': ListChecks,
  lock: Lock,
  map: MapIcon,
  minus: Minus,
  newspaper: Newspaper,
  percent: Percent,
  plus: Plus,
  scale: Scale,
  search: Search,
  sigma: Sigma,
  sparkle: Sparkle,
  timer: Timer,
  users: Users,
  x: X,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const isIconName = (n: string): n is IconName => n in ICONS;

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 22, color = colors.ink, strokeWidth = 2 }: Props) {
  const C = ICONS[name];
  return <C size={size} color={color} strokeWidth={strokeWidth} />;
}
