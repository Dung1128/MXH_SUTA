import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  AsyncStorage
} from 'react-native';
import Style from './src/Style.js';

import Home from './components/homeView.js';
import Login from './components/loginView.js';
import Register from './components/registerView.js';
import Profile from './components/profile/profileView.js';
import AccountManagerView from './components/profile/accountManagerView.js';
import ChangePass from './components/profile/changePassView.js';
import ChangeProfile from './components/profile/changeProfileView.js';
import Chat from './components/message/chatView.js';
import ChatAnonymous from './components/message/chat_anonymousView.js';
import MessageAnonymous from './components/message/message_anonymousView.js';
import Feedback from './components/profile/feedbackView.js';
import Comment from './components/newfeed/commentView.js';
import firebase from './components/api.js';
class SUTA extends Component {
  constructor(props){
    super(props);
    this.state=({
      data: '',
    })
  }
  componentWillMount(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value !=null)
      {
        this.setState({data:JSON.parse(value)});
      }

    }).done();
  }
  componentWillUnmount(){
    var items_rooms = [];
    database = firebase.database();
    database.ref("rooms").once("value", (snap)=>{
        snap.forEach((data)=>{
          items_rooms.push({
            key: data.key,
            data: data.val(),
          });

        })
        for (var i = 0; i < items_rooms.length; i++) {
          if(items_rooms[i].data.user_1.id_user === this.state.data.id_user )
          {
            database.ref("rooms/" + items_rooms[i].key + "/user_1").update({
               "online": 0
            });
          }
          if(items_rooms[i].data.user_2.id_user === this.state.data.id_user)
          {
            database.ref("rooms/" + items_rooms[i].key + "/user_2").update({
               "online": 0
            });
          }
        }

    });
  }
  renderScene(route, navigator){
    if(route.name == 'home'){
      return <Home navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'login'){
      return <Login navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'register'){
      return <Register navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'profile'){
      return <Profile navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'accountManager'){
      return <AccountManagerView navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'changepass'){
      return <ChangePass navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'changeprofile'){
      return <ChangeProfile navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'chat'){
      return <Chat navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'feedback'){
      return <Feedback navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'comment'){
      return <Comment navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'chat_anonymous'){
      return <ChatAnonymous navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'message_anonymous'){
      return <MessageAnonymous navigator = {navigator} {...route.passProps}/>
    }
  }

  render() {
    return (
      <View style={Style.container}>
        <Navigator
          initialRoute={{name:'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>

    );
  }
}

module.exports = SUTA;
