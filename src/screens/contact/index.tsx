import { AuthorAvatar } from '@/components/AuthorAvatar';
import { Pill } from '@/components/Pill';
import { PrettyCanvas } from '@/components/PrettyCanvas';
import { Container, H2 } from '@/components/styled';
import { RootRouteProps } from '@/Navigation';
import { selectCanvasProps, useAppSelector } from '@/store';
import { useContact } from '@/utils/contacts';
import { debugStyle } from '@/utils/styles';
import { useRoute } from '@react-navigation/native';
import { Suspense } from 'react';
import styled from 'styled-components/native';

const HeaderContainer = styled.View`
  padding-top: 36px;
  width: 100%;
  align-items: flex-start;
  ${debugStyle()};
`;
const Content = styled.View`
  padding-left: 20px;
`;
const StyledScroll = styled.ScrollView`
  flex: 1
  padding: 0 16px;
`;
const NameContainer = styled.View`
  margin-top: 20px;
`;
const Name = styled(H2)``;
const Card = styled.View`
  margin-bottom: 20px;
  margin-top: 40px;
  border-radius: 8px;
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
    params: { id, queryKey },
  } = useRoute<RootRouteProps<'Contact'>>();
  const contact = useContact(queryKey, id);
  const canvasProps = useAppSelector(selectCanvasProps(id));

  return (
    <Container>
      <StyledScroll>
        <Content>
          <HeaderContainer>
            <AuthorAvatar url={contact.avatar} size={100} />
            <NameContainer>
              <Name theme={'light'}>{contact.first_name}</Name>
              <Name theme={'light'}>{contact.last_name}</Name>
            </NameContainer>
          </HeaderContainer>
          <Card>
            <CanvasContainer>
              <PrettyCanvas {...canvasProps} />
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
        </Content>
      </StyledScroll>
    </Container>
  );
};

export const Contact = () => (
  <Suspense fallback={null}>
    <ContactScreen />
  </Suspense>
);
