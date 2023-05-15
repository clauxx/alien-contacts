import {AuthorAvatar} from '@/components/AuthorAvatar';
import {PaperBackground} from '@/components/PaperBackground';
import {Pill} from '@/components/Pill';
import {PrettyCanvas} from '@/components/PrettyCanvas';
import {Container, H2} from '@/components/styled';
import {RootRouteProps} from '@/Navigation';
import {selectCanvasProps, useAppSelector} from '@/store';
import {useContact} from '@/utils/contacts';
import {debugStyle} from '@/utils/styles';
import {useRoute} from '@react-navigation/native';
import {lighten} from 'polished';
import {Suspense, useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';

const StyledContainer = styled(Container)`
  padding-left: 20px;
  flex: 1;
`;

const HeaderContainer = styled.View`
  padding-top: 36px;
  width: 100%;
  align-items: flex-start;
  ${debugStyle()};
`;
const NameContainer = styled.View`
  margin-top: 20px;
`;
const Name = styled(H2)``;
const Card = styled.View`
  margin-bottom: 20px;
  margin-top: 100px;
  flex: 1;
  align-items: flex-start;
  padding-bottom: 100px;
`;
const Space = styled.View`
  height: 12px;
`;
const CanvasContainer = styled.View`
  position: absolute;
  right: 0px;
  left: 100px;
  top: 50px;
  bottom: 0px;
  z-index: -1;
  overflow: hidden;
  transform: scale(1.5);
`;

export interface ContactProps {
  id: number;
  queryKey: string;
}

const ContactScreen = () => {
  const {
    params: {id, queryKey},
  } = useRoute<RootRouteProps<'Contact'>>();
  const {contact, error} = useContact(queryKey, id);
  if (error) {
    throw error;
  }
  const canvasProps = useAppSelector(selectCanvasProps(id));
  const {width, height} = useWindowDimensions();

  const backgroundColor = useMemo(
    () => lighten(0.7, canvasProps.colors[0]),

    [canvasProps],
  );

  return (
    <StyledContainer style={{backgroundColor}}>
      <HeaderContainer>
        <AuthorAvatar url={contact.avatar} size={100} />
        <NameContainer>
          <Name>{contact.first_name}</Name>
          <Name>{contact.last_name}</Name>
        </NameContainer>
      </HeaderContainer>
      <Card>
        <CanvasContainer>
          <PrettyCanvas {...canvasProps} animated />
        </CanvasContainer>
        <Pill type="email" field={contact.email} />
        <Space />
        <Pill type="phone_number" field={contact.phone_number} />
        <Space />
        <Pill type="address" field={contact.address.street_address} />
        <Space />
        <Pill type="job" field={contact.employment.title} />
        <Space />
        <Pill type="gender" field={contact.gender} />
        <Space />
        <Pill type="date_of_birth" field={contact.date_of_birth} />
      </Card>
      <PaperBackground width={width} height={height} />
    </StyledContainer>
  );
};

export const Contact = () => (
  <Suspense fallback={null}>
    <ContactScreen />
  </Suspense>
);
