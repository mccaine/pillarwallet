// @flow
import * as React from 'react';
import { Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { LightText, BoldText } from 'components/Typography';
import { Shadow } from 'components/Shadow';
import { CachedImage } from 'react-native-cached-image';
import { getCurrencySymbol } from 'utils/common';
import { fontSizes, fontTrackings, baseColors } from 'utils/variables';

type Props = {
  id: string,
  name: string,
  token: string,
  amount: string,
  onPress: Function,
  address: string,
  wallpaper: string,
  children?: React.Node,
  isListed: boolean,
  disclaimer?: string,
  balanceInFiat: {
    amount: string | number,
    currency: string,
  },
  icon: string,
  horizontalPadding?: boolean,
}

const AssetOutter = styled.View`
  width: 100%;
  padding-bottom: 6px;
  padding: ${Platform.select({
    ios: '10px 20px',
    android: 0,
  })}
`;

const defaultCardColor = '#ACBCCD';

const AssetWrapper = styled.View`
  height: 140px;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${props => props.isListed ? defaultCardColor : baseColors.white}
`;

const TouchableWithoutFeedback = styled.TouchableWithoutFeedback`
  z-index: 10;
`;

const BackgroundImage = styled(CachedImage)`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 20px;
`;

const UpperRow = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`;

const AmountWrapper = styled.View`
  height: 30px;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: flex-end;
`;

const Amount = styled(LightText)`
  font-size: ${fontSizes.extraLarge};
  line-height: ${fontSizes.extraLarge};
  color: ${props => props.isListed ? baseColors.white : baseColors.mediumGray};
`;

const FiatAmount = styled(LightText)`
  font-size: ${fontSizes.extraSmall};
  line-height: 14px;
  color: #fff;
  margin-left: -2px;
`;

const Disclaimer = styled(LightText)`
  font-size: ${fontSizes.extraSmall};
  line-height: 14px;
  color: ${baseColors.burningFire};
`;

const AmountToken = styled(BoldText)`
  font-size: ${fontSizes.medium};
  line-height: ${fontSizes.extraLarge};
  color: ${props => props.isListed ? baseColors.white : baseColors.mediumGray};
`;


const DetailsWrapper = styled.View`
  justify-content: flex-start;
  flex-direction: column;
  padding: 20px;
  flex: 1;
`;


const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${props => props.isListed ? 'rgba(255,255,255,0.1)' : 'rgba(198,202,205,0.6)'};
  position: relative;
  margin-right: ${Platform.select({
    ios: 0,
    android: '16px',
  })};
  align-items: center;
  justify-content: center;
`;

const Name = styled(BoldText)`
  font-size: ${fontSizes.mediumLarge};
  letter-spacing: ${fontTrackings.medium};
  line-height: ${fontSizes.mediumLarge};
  color: ${props => props.isListed ? baseColors.white : baseColors.mediumGray};
`;

const AssetCard = (props: Props) => {
  const {
    name,
    amount,
    token,
    balanceInFiat,
    onPress,
    wallpaper,
    isListed = true,
    disclaimer,
    icon = '',
  } = props;

  const currencySymbol = getCurrencySymbol(balanceInFiat.currency);
  const wallpaperUri = isListed ? wallpaper : undefined;
  return (
    <AssetOutter>
      <Shadow heightAndroid={140}>
        <TouchableWithoutFeedback onPress={onPress}>
          <AssetWrapper isListed={isListed}>
            <BackgroundImage source={{ uri: wallpaperUri }} />
            <DetailsWrapper>
              <UpperRow>
                <Name isListed={isListed}>{name}</Name>
                {!!icon &&
                  <IconCircle isListed={isListed}>
                    <CachedImage
                      key={token}
                      style={{
                        height: 40,
                        width: 40,
                      }}
                      source={{ uri: icon }}
                      resizeMode="contain"
                    />
                  </IconCircle>}
              </UpperRow>
              <View style={{ flexDirection: 'column' }}>
                <AmountWrapper>
                  <Amount isListed={isListed}>{amount}</Amount>
                  <AmountToken isListed={isListed}> {token}</AmountToken>
                </AmountWrapper>
                <View style={{ marginTop: 8 }}>
                  {disclaimer
                    ? <Disclaimer>{disclaimer}</Disclaimer>
                    : <FiatAmount>{currencySymbol}{balanceInFiat.amount}</FiatAmount>
                  }
                </View>
              </View>
            </DetailsWrapper>
          </AssetWrapper>
        </TouchableWithoutFeedback>
      </Shadow>
    </AssetOutter>
  );
};

export default AssetCard;
