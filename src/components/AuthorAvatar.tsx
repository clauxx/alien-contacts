import { colors } from '@/utils/styles';
import { useMemo } from 'react';
import styled from 'styled-components/native';

interface AuthorAvatarProps {
  url: string;
  size: number;
}

const ContainerBtn = styled.TouchableOpacity<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 2px;
  border-radius: ${({ size }) => size / 2}px;
`;
const PlaceholderBtn = styled(ContainerBtn)`
  background-color: ${colors.placeholder};
`;

const StyledImage = styled.Image<{ size: number }>`
  width: 100%;
  height: 100%;
  border-radius: ${({ size }) => size / 2}px;
`;

const sanitizeUrl = (url: string) => {
  const split = url.split('&');
  return split[0];
};

export const AuthorAvatar = ({ url, size }: AuthorAvatarProps) => {
  const avatarUrl = useMemo(() => (url ? sanitizeUrl(url) : null), [url]);

  return avatarUrl ? (
    <ContainerBtn activeOpacity={0.8} size={size}>
      <StyledImage size={size} source={{ uri: avatarUrl }} />
    </ContainerBtn>
  ) : (
    <PlaceholderBtn activeOpacity={1} size={size} />
  );
};

export const AuthorAvatarFallback = ({
  size,
}: Pick<AuthorAvatarProps, 'size'>) => (
  <PlaceholderBtn activeOpacity={1} size={size} />
);
