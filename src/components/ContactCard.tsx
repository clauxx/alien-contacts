import { AuthorAvatar, AuthorAvatarFallback } from '@/components/AuthorAvatar';
import { H3, P3 } from '@/components/styled';
import { useContact } from '@/utils/contacts';
import { colors, debugStyle } from '@/utils/styles';
import { memo, Suspense, useCallback } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Pill, PillFallback } from './Pill';
import { ErrorBoundary } from 'react-error-boundary';
import { PrettyCanvas } from './PrettyCanvas';
import { selectCanvasProps, useAppSelector } from '@/store';
import { Canvas, Turbulence, Rect } from '@shopify/react-native-skia';

const cardDimensions = {
  width: 250,
  height: 350,
} as const;

const Btn = styled.TouchableOpacity`
  width: ${cardDimensions.width}px;
  height: ${cardDimensions.height}px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  background-color: ${colors.card};
  border-radius: 8px;
  padding: 20px;
`;
const Content = styled.View`
  flex: 1;
  flex-direction: row;
  height: 200px;
  ${debugStyle()};
`;
const Header = styled.View`
  height: 160px;
  width: 100%;
  flex-direction: row;
  ${debugStyle()}
`;
const FallbackHeader = styled(Header)`
  background-color: ${colors.placeholder};
  border-radius: 4px;
`;
const AvatarContainer = styled.View`
  flex: 0.3;
  align-items: center;
  justify-content: flex-end;
  ${debugStyle()}
`;
const NameContainer = styled.View`
  flex: 0.7;
  align-items: flex-end;
  justify-content: flex-end;
  ${debugStyle()}
`;
const NameContainerFallback = styled(NameContainer)`
  margin-top: 24px;
  border-radius: 4px;
  background-color: ${colors.placeholder};
`;
const Name = styled(H3)`
  text-align: right;
`;
const Footer = styled.View`
  width: 100%;
  height: 80px;
  align-items: flex-start;
  justify-content: flex-end;
  ${debugStyle()}
`;
const Job = styled(P3)`
  margin-top: 4px;
  margin-bottom: -24px;
`;
const StyledCanvas = styled(Canvas)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  opacity: 0.3;
`;

interface ContactCardProps {
  id: number;
  queryKey: string;
  hideAuthor?: boolean;
  visible?: boolean;
}

const ContactCardUnmemoized = ({ id, queryKey, visible }: ContactCardProps) => {
  const contact = useContact(queryKey, id);
  const navigation = useNavigation();
  const canvasProps = useAppSelector(selectCanvasProps(id));

  const handlePress = useCallback(() => {
    navigation.navigate('Contact', { queryKey, id });
  }, [queryKey, id, navigation]);

  if (!visible) {
    return <Fallback />;
  }

  return (
    <Btn activeOpacity={0.8} onLongPress={handlePress}>
      <Header>
        <PrettyCanvas {...canvasProps} />
      </Header>
      <Content>
        <NameContainer>
          <Name numberOfLines={1}>{contact.first_name}</Name>
          <Name numberOfLines={1}>{contact.last_name}</Name>
          <Job numberOfLines={1}>{contact.employment.title}</Job>
        </NameContainer>
        <AvatarContainer>
          <AuthorAvatar url={contact.avatar} size={50} />
        </AvatarContainer>
      </Content>
      <Footer>
        <Pill type={'email'} field={contact.email} />
      </Footer>
      <StyledCanvas>
        <Rect
          x={0}
          y={0}
          width={cardDimensions.width}
          height={cardDimensions.height}
        >
          <Turbulence freqX={0.9} freqY={0.9} octaves={7} />
        </Rect>
      </StyledCanvas>
    </Btn>
  );
};

const Fallback = () => (
  <Btn>
    <FallbackHeader />
    <Content>
      <NameContainerFallback />
      <AvatarContainer>
        <AuthorAvatarFallback size={50} />
      </AvatarContainer>
    </Content>
    <Footer>
      <PillFallback />
    </Footer>
  </Btn>
);

export const ContactCard = memo((props: ContactCardProps) => (
  <Suspense fallback={<Fallback />}>
    <ErrorBoundary fallback={<Fallback />}>
      <ContactCardUnmemoized {...props} />
    </ErrorBoundary>
  </Suspense>
));
