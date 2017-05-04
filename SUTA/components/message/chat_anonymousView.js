import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import firebase from '../api.js';
import Icon from 'react-native-vector-icons/Ionicons';
var dateFormat = require('dateformat');
import MyStatusBar from '../statusbar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var items_rooms = [];
export default class ChatAnonymous extends Component {
  constructor(props){
    super(props);
    items=[];
    this.state = {
      username: '',
      password: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
      data: this.props.data,
      user_login: this.props.user_login,
      message: '',
      sendColor: '#90949c',
      check_rooms: false,
    }
    database = firebase.database();

  }

  showMess(key){
    database.ref('message').child(key).on('value',(snap)=>{
      items=[];
      snap.forEach((data)=>{
        items.push({
          key: data.key,
          data: data.val(),
        });

      });
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
    })
  }
  componentDidMount(){
    var check = false;
    database.ref("rooms").on("value", (snap)=>{
      items_rooms = [];
        snap.forEach((data)=>{
          items_rooms.push({
            key: data.key,
            data: data.val(),
          });

        })
        for (var i = 0; i < items_rooms.length; i++) {
          if(items_rooms[i].data.user_1.id_user === this.state.data.id_user && items_rooms[i].data.user_2.id_user === this.state.user_login.id_user
          || items_rooms[i].data.user_2.id_user === this.state.data.id_user && items_rooms[i].data.user_1.id_user === this.state.user_login.id_user)
          {
            if (items_rooms[i].data.anonymous) {
            this.showMess(items_rooms[i].key);
            this.setState({
              check_rooms:true,
              info_rooms: items_rooms[i],
            });
            this.checkStatus(items_rooms[i].key);
          }
          }

        }

    });

  }
  checkStatus(key){

      var items_message = [];
      database.ref('message').child(key).once("value", (snap)=>{
        items_message = [];
        snap.forEach((data)=>{
          items_message.push({
            key: data.key,
            data: data.val(),
          });

        });
        for (var i = 0; i < items_message.length; i++) {
          if(items_message[i].data.user.id_user === this.state.data.id_user
           && items_message[i].data.user.id_user != this.state.user_login.id_user)
          {
            database.ref('message').child(key).child(items_message[i].key).update({
               "status":1
            });
          }

        }
      });

  }

  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  checkicon(username){
    if (username==this.state.user_login.username) {
      return '#0084ff'
    }else {
      return '#f5f5f5'
    }
  }
  checktext(username){
    if (username==this.state.user_login.username) {
      return{
        color:'white',
      }
    }
  }
  checkstyle(username){
    if(username==this.state.user_login.username){
      return {
        marginRight:5,
        padding:10,
        paddingRight:10,
        borderRadius:deviceHeight*0.02,
        height:null,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#0084ff',

      }
    }
    else{
      return{
        marginLeft:5,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:deviceHeight*0.02,
        height:null,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#f1f0f0',

      }
    }
  }
  checkstylechat(username){
    if(username==this.state.user_login.username){
      return{
        padding:10,
        alignItems:'flex-end',
        flexDirection:'row-reverse',
        height:null,
        marginTop:10,
      }
    }
    else {
      return{
        padding:10,
        alignItems:'flex-end',
        flexDirection:'row',
        height:null,
        marginTop:10,
      }
    }
  }
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
    this.setState({
      sendColor: '#90949c',
    })
  }
  onSend(){
    var items = [];
    var now = new Date();
    var datetime = new Date().toLocaleString('en-US');
    this.clearText('content')
    if(this.state.sendColor!= '#90949c')
    {
      if(this.state.check_rooms)
      {
        database.ref('message').child(this.state.info_rooms.key).push({
          user: this.state.user_login,
          content: this.state.message,
          time: datetime,
          status: 0
        });

      }else {
        this.addRooms();
      }
    }
  }
  addRooms(){
    var items_rooms = [];
    var key = '';
    var now = new Date();
    var datetime = new Date().toLocaleString('en-US');
    database.ref('rooms').push({
      user_1: this.state.data,
      user_2: this.state.user_login,
      anonymous:true,
    });
    database.ref("rooms").once("value", (snap)=>{
        snap.forEach((data)=>{
          var value = data.val();
          if(value.user_1.id_user===this.state.data.id_user && value.user_2.id_user === this.state.user_login.id_user
          || value.user_1.id_user===this.state.user_login.id_user && value.user_2.id_user === this.state.data.id_user)
          {
            items_rooms.push({
              key: data.key,
              data: data.val(),
            });
            key = data.key;
          }

        })
      database.ref("message/"+key).push({
        user: this.state.user_login,
        content: this.state.message,
        time: datetime,
        status: 0
      });
      this.showMess(key);
    });
  }
  _renderRow(data){
    var time = dateFormat(data.data.time,"h:MM TT");
    return(
      <View style={this.checkstylechat(data.data.user.username)}>
        <View style={this.checkstyle(data.data.user.username)}>
          <Text style={this.checktext(data.data.user.username)}>
           {data.data.content}
          </Text>
          <Text style={[Style.text_mini,{fontSize:8},this.checktext(data.data.user.username)]}>
            {time}
          </Text>
        </View>
        {
          data.data.status == 0 && data.data.user.id_user === this.state.user_login.id_user?
          <Icon name="md-checkmark-circle-outline" size={10} color={this.checkicon(data.data.user.username)}/>
          :
          <Icon name="md-checkmark-circle" size={10} color={this.checkicon(data.data.user.username)}/>
        }

      </View>

    )
  }
  render() {
    return (

      <TouchableOpacity activeOpacity={1} onPress={()=>this.checkStatus(this.state.info_rooms.key)}  style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={Style.toolbar}>
          <TouchableOpacity onPress={()=>this.onBack('home')} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-arrow-back" size={34} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={Style.title}>
              Anonymous
            </Text>
          </View>


        </View>
        <ListView
        style={{flex:1,backgroundColor:'#fff'}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
        <View style={Style.bottomInput}>
          <TextInput style={Style.input}
          placeholder="Nhập tin nhắn"
          onChangeText={(val)=>this.setState({message:val, sendColor:'#8e44ad'})}
          multiline={true}
          placeholderTextColor= '#90949c'
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          ref={'content'}/>
          <TouchableOpacity onPress={()=>this.onSend()} style={{alignItems:'center',paddingRight:10}}>
            <Icon name="md-send" size={24} color={this.state.sendColor} style={Style.ico}/>
          </TouchableOpacity>
        </View>

      </TouchableOpacity>

    );
  }
}
var Style = StyleSheet.create({
  backgroundAvatar:{
    overflow: 'hidden',
    borderRadius:200,
    width:30,
    height:30,
  },
  avatar:{
    width:30,
    height:30
  },
  avatar_android:{
    width:30,
    height:30,
    borderRadius:200,
  },
  bottomInput:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:0.5,
    borderTopColor:'rgba(0,0,0,0.5)',
    height:deviceHeight/16,
  },
  input:{
    flex:1,
    margin:5,
    paddingTop:0,
    paddingBottom:0,
    color:'black',
    marginLeft:10,
    fontSize:13
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
  },
});
