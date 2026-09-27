import { StyleSheet } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import { colors, gridCell } from '@/theme/tokens';

/** Cuadrícula de cuaderno (24 dp, tinta al 7 %). Un solo patrón SVG: barato de dibujar. */
export function GridBackground() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <Pattern id="mp-grid" width={gridCell} height={gridCell} patternUnits="userSpaceOnUse">
          <Path d={`M${gridCell} 0H0V${gridCell}`} fill="none" stroke={colors.gridLine} strokeWidth={1} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#mp-grid)" />
    </Svg>
  );
}
