import React, {memo, useMemo} from 'react';
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
  useLoop,
  useComputedValue,
  Blur,
} from '@shopify/react-native-skia';
import styled from 'styled-components';

const ContainerCanvas = styled(Canvas)`
  flex: 1;
`;

export interface PrettyCanvasProps {
  colors: string[];
  size: number;
  animated?: boolean;
}

const distortion = {
  gradient: {
    freqX: 0.4,
    freqY: 0.9,
  },
  displacement: {
    freqX: 0.01,
    freqY: 0.04,
  },
  scale: 40,
} as const;
const duration = 80000;

export const PrettyCanvas = memo(
  ({colors, size, animated = false}: PrettyCanvasProps) => {
    const xCoeff = useLoop({duration});
    const displacementScale = useLoop({duration});

    const scale = useComputedValue(() => {
      return Math.min(displacementScale.current + 0.2, 1) * 250;
    }, [displacementScale]);

    const freqX = useComputedValue(() => {
      return Math.min(xCoeff.current * 0.01, 0.01);
    }, [xCoeff]);

    const displacementTurbulenceProps = useMemo(() => {
      return animated
        ? {
            freqX,
            freqY: distortion.displacement.freqY,
          }
        : distortion.displacement;
    }, [animated, freqX]);

    const displacementProps = useMemo(
      () => (animated ? {scale} : {scale: distortion.scale}),
      [animated, scale],
    );

    return (
      <ContainerCanvas>
        <Mask
          mode="luminance"
          mask={<Circle cx={size} cy={size} r={size} color="white" />}>
          <Rect x={0} y={0} width={250} height={250}>
            <Blend mode="difference">
              <RadialGradient r={125} c={vec(125, 125)} colors={colors} />
              <Turbulence {...distortion.gradient} octaves={7} />
            </Blend>
            <DisplacementMap channelX="r" channelY="a" {...displacementProps}>
              <Turbulence
                {...displacementTurbulenceProps}
                octaves={8}
                seed={size / 5}
              />
            </DisplacementMap>
            {animated ? <Blur blur={0.3} /> : null}
          </Rect>
        </Mask>
        {animated ? <Blur blur={0.7} /> : null}
      </ContainerCanvas>
    );
  },
);
