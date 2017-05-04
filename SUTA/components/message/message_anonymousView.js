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
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var items_rooms = [];
export default class MessageAnonymous extends Component{
  constructor(props){
    super(props);
    this.state = ({
      user:this.props.user,
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
  setCheckSearch(value){
    this.setState({checksearch: value});
  }
  setSearchFriends(event){
    var array = [];
    var arrayFilter = [];
    let searchText = event.nativeEvent.text;
    array = items_rooms;
    arrayFilter = array.filter(function (el) {
        if (searchText!='') {
          return (el.key.toLowerCase().indexOf(searchText.toLowerCase()) >=0);
        }else {
          return array;
        }

    });
   this.setState({
     dataSource: this.state.dataSource.cloneWithRows(arrayFilter),

   });
  }

  componentDidMount(){
    var check = false;
    database.ref("rooms").on("value", (snap)=>{
      items_rooms = [];
        snap.forEach((data)=>{
          var value = data.val();
          if(value.user_1.id_user!=this.state.user.id_user && value.user_2.id_user === this.state.user.id_user
          || value.user_1.id_user===this.state.user.id_user && value.user_2.id_user != this.state.user.id_user)
          {
            if (value.anonymous) {
              items_rooms.push({
                key: data.key,
                data: data.val(),
              });
            }

          }


        })
        this.setState({dataSource: this.state.dataSource.cloneWithRows(items_rooms)});
    });
  }
  showTimeline(data){
    this.props.navigator.push({
      name: 'profile',
      passProps: {
        data: data
      }
    })

  }
  _renderRow(data){
    if(data.data.user_1.id_user != this.state.user.id_user && data.data.user_2.id_user === this.state.user.id_user)
    {
      return(
        <View style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
        <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={Style.backgroundAvatar}>
                <Image style={Platform.OS=='ios'?Style.avatar:Style.avatar_android} source={require('../images/logo2.png')}/>


              </View>
              {
                data.data.user_1.online === 1?
                <View style={{zIndex:1,borderRadius:100,borderWidth:1,borderColor:'white',width:10,height:10,position:'absolute',backgroundColor:'rgb(66, 183, 42)',bottom:0,left:3}}>
                </View>
                :
                <View></View>
              }
              <View style={{marginLeft:10,justifyContent:'center'}}>
                <Text style={Style.textbold}>
                 Anonymous
                </Text>
                <Text style={Style.textgray}>
                {data.key}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>this.navigate('chat_anonymous',data.data.user_1)} style={{justifyContent:'center',marginRight:5}}>
              <Icon color='rgba(0, 0, 0, 0.2)' name='md-chatbubbles' size={24} />
            </TouchableOpacity>
        </View>
        </View>
      )
    }else {
      return(
        <View style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
        <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
            <View  style={{flex:1,flexDirection:'row'}}>
              <View style={Style.backgroundAvatar}>
                <Image style={Platform.OS=='ios'?Style.avatar:Style.avatar_android} source={require('../images/logo2.png')}/>

              </View>
              {
                data.data.user_2.online === 1?
                <View style={{zIndex:1,borderRadius:100,borderWidth:1,borderColor:'white',width:10,height:10,position:'absolute',backgroundColor:'rgb(66, 183, 42)',bottom:0,left:3}}>
                </View>
                :
                <View></View>
              }
              <View style={{marginLeft:10,justifyContent:'center'}}>
                <Text style={Style.textbold}>
                 Anonymous
                </Text>
                <Text style={Style.textgray}>
                {data.key}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>this.navigate('chat_anonymous',data.data.user_2)} style={{justifyContent:'center',marginRight:5}}>
              <Icon color='rgba(0, 0, 0, 0.2)' name='md-chatbubbles' size={24} />
            </TouchableOpacity>
        </View>
        </View>
      )
    }

  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#fff'}}>


      <ListView
      style={{flex:1,zIndex:0,}}
      dataSource={this.state.dataSource}
      renderRow={this._renderRow.bind(this)}
      enableEmptySections={true}
      />
      <View style={{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        bottom:0,
        left:0,
        zIndex:0,
        height:deviceHeight/18,
        backgroundColor: "#bdc3c7",
      }}>
        <Icon name="md-search" size={24} color="white" style={[Style.ico,{marginLeft:20}]}/>
        <TextInput
          placeholder="Tìm Kiếm mã ẩn danh"
          placeholderTextColor='white'
          underlineColorAndroid = 'transparent'
          autoCapitalize="none"
          autoCorrect={false}
          style={{width:deviceWidth-30,
            margin:5,
              paddingTop:0,
              paddingBottom:0,
              fontStyle: 'italic',
            color:'white'}}
          multiline={true}
          onChange={this.setSearchFriends.bind(this)}
        />
      </View>
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
    backgroundColor:  "rgba(101, 101, 101, 0.2)",
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
});
