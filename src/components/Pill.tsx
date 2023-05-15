import { P3 } from '@/components/styled';
import { colors } from '@/utils/styles';
import styled from 'styled-components/native';

const PillContainer = styled.View`
  height: 24px;
  padding-right: 4px;
  border: 1px ${colors.pill} solid;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${colors.card};
`;

const PillContainerFallback = styled(PillContainer)`
  background-color: ${colors.placeholder};
  width: 150px;
  border: 0px;
`;

const PillPrefix = styled.View`
  height: 100%;
  width: 24px;
  border: 1px ${colors.pill} solid;
  background-color: ${colors.pill};
  opacity: 0.8;
  margin-right: 4px;
  align-items: center;
  justify-content: center;
`;
const TextContainer = styled.View`
  padding-horizontal: 8px;
`;

const Emoji = styled.Text`
  font-size: 8px;
  text-align: center;
`;

const fieldToEmoji = {
  email: '✉️',
  phone_number: '🤙',
  address: '🏠',
  job: '⚙️',
  gender: '🐯',
  date_of_birth: '🎂',
};

type PillField = keyof typeof fieldToEmoji;

interface PillProps {
  type: PillField;
  field: string;
}

export const Pill = ({ type, field }: PillProps) => {
  return (
    <PillContainer>
      <PillPrefix>
        <Emoji>{fieldToEmoji[type]}</Emoji>
      </PillPrefix>
      <TextContainer>
        <P3>{field}</P3>
      </TextContainer>
    </PillContainer>
  );
};

export const PillFallback = () => <PillContainerFallback />;
