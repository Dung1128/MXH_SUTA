import React, {Component} from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
// import Style from 'Style.js';
import Iconn from 'react-native-vector-icons/Ionicons';
import NewFeed from './newFeedView.js';
import Friends from './friendsView.js';
import Message from './messageView.js';
import firebase from './api.js';
import MyStatusBar from './statusbar.js';
import { Tabs, Tab, Icon } from 'react-native-elements';
var items_rooms = [];
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'feed',
      data: JSON.parse(this.props.data),
    }
  }

  changeTab (selectedTab) {
    this.setState({selectedTab})
  }

  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  componentWillMount(){
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
               "online": 1
            });
          }
          if(items_rooms[i].data.user_2.id_user === this.state.data.id_user)
          {
            database.ref("rooms/" + items_rooms[i].key + "/user_2").update({
               "online": 1
            });
          }
        }

    });
  }

  navigate(routeName, data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }

  render(){
    //console.log(this.state.data.id_user);
    const { selectedTab } = this.state
    return(
      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <Tabs>

        <Tab
          titleStyle={{fontWeight: 'bold', fontSize: 10}}
          selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
          selected={selectedTab === 'feed'}
          renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={28} />}
          renderSelectedIcon={() => <Icon color={'#6296f9'} name='whatshot' size={30} />}
          onPress={() => this.changeTab('feed')}>
          <NewFeed navigator = {this.props.navigator} data = {this.state.data} />
        </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'banbe'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='people' size={30} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='people' size={30} />}
            onPress={() => this.changeTab('banbe')}>
            <Friends navigator = {this.props.navigator} data = {this.state.data} />
          </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'tinnhan'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='chat' size={25} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='chat' size={30} />}
            onPress={() => this.changeTab('tinnhan')}>
            <Message navigator = {this.props.navigator} data = {this.state.data} />
          </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'menu'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='menu' size={30} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='menu' size={30} />}
            onPress={()=>this.navigate('profile', this.state.data)}>

          </Tab>
        </Tabs>
      </View>
    )
  }
}
