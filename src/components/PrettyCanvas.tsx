import React, { memo } from 'react';
import {
  Canvas,
  vec,
  Circle,
  Mask,
  Turbulence,
  Blend,
  RadialGradient,
  Rect,
  DisplacementMap,
} from '@shopify/react-native-skia';
import styled from 'styled-components';

const ContainerCanvas = styled(Canvas)`
  flex: 1;
`;

export interface PrettyCanvasProps {
  colors: string[];
  size: number;
}

export const PrettyCanvas = memo(({ colors, size }: PrettyCanvasProps) => {
  return (
    <ContainerCanvas>
      <Mask
        mode="luminance"
        mask={<Circle cx={size} cy={size} r={size} color="white" />}
      >
        <Rect x={0} y={0} width={250} height={250}>
          <Blend mode="difference">
            <RadialGradient r={125} c={vec(125, 125)} colors={colors} />
            <Turbulence freqX={0.4} freqY={0.9} octaves={7} />
          </Blend>
          <DisplacementMap channelX="r" channelY="a" scale={30}>
            <Turbulence freqX={0.01} freqY={0.05} octaves={2} seed={size / 5} />
          </DisplacementMap>
        </Rect>
      </Mask>
    </ContainerCanvas>
  );
});
