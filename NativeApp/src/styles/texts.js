import { StyleSheet } from 'react-native';

const texts = StyleSheet.create({
  title: {
    fontFamily: 'GreatVibes',
    fontSize: 35,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat'
  },
  text: {
    color: 'black',
    fontFamily: 'GreatVibes',
    fontSize: 60,
    width: 165
  },
  priceAddToBasket: {
    fontWeight: 'bold',
    color: 'green'
  },
  sliderText: {
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  textCustomAlert: {
    fontFamily: 'MontserratBold',
    textAlign: 'center',
    fontSize: 14
  },
  underButton: {
    fontFamily: 'MontserratBold',
    fontSize: 12,
    marginTop: 2
  },
  buttonText: {
    fontFamily: 'Montserrat',
    textAlign: 'center',
    fontSize: 12
  },
  weSendEmail: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    marginBottom: 25,
  },
  contentText: {
    height: 21, 
    paddingLeft: 4,
    paddingRight: 4
  },
  navigateAddBasket: {
    flex: 1, flexDirection: 'row', 
    fontWeight: 'bold', 
    fontFamily: 'Montserrat', 
    color: 'green' 
  }
});

export default texts;