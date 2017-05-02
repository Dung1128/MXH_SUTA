import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  ListView,
  BackAndroid,
  Alert,
  Modal,
  Platform
} from 'react-native';
import firebase from '../api.js';
import MyStatusBar from '../statusbar.js';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from '../tab/DefaultTabBar';
import MessageAnonymous from './message_anonymousView.js';
import MessagePublic from './message_publicView.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var items_rooms = [];
export default class Message extends Component{
  constructor(props){
    super(props);
    this.state = ({
      user:this.props.data,
      checksearch: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
    });
    database = firebase.database();
  }
  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data,
        user_login: this.state.user,
      }
    })
  }

  render(){
    return(
      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
      <View style={Style.toolbar}>
        <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
          <Text style={Style.title}>
            TIN NHẮN
          </Text>
        </View>

      </View>
      <ScrollableTabView
      initialPage={0}
      renderTabBar={() => <DefaultTabBar />}
      >

        <MessagePublic tabLabel="CÔNG KHAI" navigator = {this.props.navigator} user ={this.state.user}/>
        <MessageAnonymous tabLabel="ẨN DANH" navigator = {this.props.navigator} user ={this.state.user}/>
      </ScrollableTabView>
      </View>
    );
  }
}

var Style = StyleSheet.create({
  backgroundAvatar:{
    overflow: 'hidden',
    borderRadius:200,
    width:40,
    height:40,
  },
  avatar:{
    width:40,
    height:40,
  },
  avatar_android:{
    width:40,
    height:40,
    borderRadius:200,
  },
  bottomInput:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:0.5,
    borderTopColor:'rgba(0,0,0,0.5)',
  },
  input:{
    flex:1,
    margin:5,
    paddingTop:0,
    paddingBottom:0,
    fontStyle: 'italic',
    color:'white'
  },
  border: {
    margin:5,
    borderWidth:0.5,
    borderColor:'white',
    width: null,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
  bottom: {

    zIndex:1,
    height:45,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  textuser:{
    fontSize:13,
    color: '#0074bd',
  },
  textnormal:{
    fontSize:13,
    color:'#1d2129'
  },
  textgray:{
    fontSize:11,
    color:'#90949c',

  },
  textbold:{
    fontSize:13,
    color:'#1d2129',
    fontWeight:'bold'
  },
  title: {
    color:'white',
    fontSize: 16,
  },
  ico_radio:{
    fontSize:16,
    margin:10,

  },
  toolbar: {
    height:45,
    width: null,
    backgroundColor: "#8e44ad",
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
});
