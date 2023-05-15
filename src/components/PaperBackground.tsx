import {Canvas, Turbulence, Rect} from '@shopify/react-native-skia';
import styled from 'styled-components/native';

const StyledCanvas = styled(Canvas)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  opacity: 0.3;
`;

interface PaperBackgroundProps {
  width: number;
  height: number;
}

export const PaperBackground = ({width, height}: PaperBackgroundProps) => {
  return (
    <StyledCanvas>
      <Rect x={0} y={0} width={width} height={height}>
        <Turbulence freqX={0.9} freqY={0.9} octaves={7} />
      </Rect>
    </StyledCanvas>
  );
};
