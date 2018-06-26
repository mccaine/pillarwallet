// @flow
import * as React from 'react';
import styled from 'styled-components/native';
import { UIColors, baseColors } from 'utils/variables';
import { TouchableWithoutFeedback, View } from 'react-native';
import { Header as NBHeader, Left as NBLeft, Right as NBRight } from 'native-base';
import { Label } from 'components/Typography';
import ButtonIcon from 'components/ButtonIcon';
import Title from 'components/Title';


type Props = {
  onBack: Function,
  dismiss: Function,
  isFirstScreen?: boolean,
  rightLabelText: string,
}

const Header = styled(NBHeader)`
  background-color: #fff;
  border-bottom-width: 0;
  height: auto;
  padding: 20px 20px 0;
  display: flex;
`;

const Left = styled(NBLeft)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const Right = styled(NBRight)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BackIcon = styled(ButtonIcon)`
  margin-right: 5px;
`;

const CloseButton = styled(ButtonIcon)`
  position: relative;
  bottom: 3px;
`;

const SendTokenAmountHeader = (props: Props) => {
  const {
    onBack,
    dismiss,
    rightLabelText,
    isFirstScreen,
  } = props;

  return (
    <Header>
      <Left>
        <TouchableWithoutFeedback onPress={() => onBack(null)}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {!isFirstScreen
              && <BackIcon icon="arrow-back" onPress={() => onBack(null)} color={UIColors.primary} fontSize={28} />
            }
            <Title title="send" />
          </View>
        </TouchableWithoutFeedback>
      </Left>
      <Right>
        <Label>{rightLabelText.toUpperCase()}</Label>
        <CloseButton
          icon="close"
          onPress={dismiss}
          fontSize={36}
          color={baseColors.darkGray}
        />
      </Right>
    </Header>
  );
};

export default SendTokenAmountHeader;
