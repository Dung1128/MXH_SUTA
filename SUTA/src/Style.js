import {StyleSheet,Dimensions} from 'react-native';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var Style = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontWeight:'bold'
  },
  input:{
    width:deviceWidth - 30,
  },
  button: {
    marginTop:10,
    width:deviceWidth - 30,
    backgroundColor: '#0057a7',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color:'white',
    fontSize: 20,
    marginLeft:-10
  },
  toolbar: {
    height:45,
    width: null,
    backgroundColor: "#ecf0f1",
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
});

export default Style;
