import styled from 'styled-components/native';
import {headerHeight, debugStyle} from '@/utils/styles';
import {H1} from '@/components/styled';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

const HeaderContainer = styled.View`
  flex: 1;
  height: ${headerHeight}px;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 8px 16px;
  flex-direction: row;
  ${debugStyle()}
`;
const BackBtn = styled.TouchableOpacity`
  width: 44px;
  height: 56px;
  padding-right: 16px;
  ${debugStyle()}
`;
const BackIcon = styled.Image`
  width: 100%;
  height: 100%;
`;

interface HeaderProps {
  title: string;
  showBack: boolean;
}

export const Header = ({title, showBack}: HeaderProps) => {
  const {goBack} = useNavigation();

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <HeaderContainer>
      {showBack && (
        <BackBtn activeOpacity={0.8} onPress={handleBack}>
          <BackIcon source={require('@/assets/back.png')} />
        </BackBtn>
      )}
      <H1 theme="light">{title}</H1>
    </HeaderContainer>
  );
};
