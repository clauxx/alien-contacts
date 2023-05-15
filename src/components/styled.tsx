import {ViewProps} from 'react-native/types';
import {useHeaderHeight} from '@react-navigation/elements';
import styled from 'styled-components/native';
import {colors, getTextColor} from '@/utils/styles';

export const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.primary};
`;

export const ContainerView = styled.View`
  flex: 1;
  background-color: ${colors.primary};
`;
export const Container = (props: ViewProps) => {
  const height = useHeaderHeight();
  return (
    <ContainerView {...props} style={[props.style, {paddingTop: height}]} />
  );
};

const T = styled.Text<{theme?: 'light' | 'dark'}>`
  color: ${({theme = 'dark' as const}) => getTextColor(theme)};
`;

export const H1 = styled(T)`
  font-size: 44px;
  font-weight: 900;
  text-align: left;
`;
export const H2 = styled(T)`
  font-size: 32px;
  font-weight: 900;
  text-align: left;
`;
export const H3 = styled(T)`
  font-size: 24px;
  font-weight: 900;
  text-align: left;
`;
export const H4 = styled(T)`
  font-size: 16px;
  font-weight: 800;
  text-align: left;
`;
export const H5 = styled(T)`
  font-size: 12px;
  font-weight: 800;
  text-align: left;
`;

export const P2 = styled(T)`
  font-size: 20px;
  font-weight: 600;
  text-align: left;
`;
export const P3 = styled(T)`
  font-size: 10px;
  font-weight: 600;
  text-align: left;
`;
export const P4 = styled(T)`
  font-size: 8px;
  font-weight: 500;
  text-align: left;
`;
