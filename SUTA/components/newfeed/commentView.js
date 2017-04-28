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
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import MyStatusBar from '../statusbar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var listnull = [];
export default class Comment extends Component {
  constructor(props){
    super(props);
    this.state = {
      id_user: this.props.id_user,
      id_status: this.props.id_status,
      user: this.props.user,
      check: this.props.check,
      dataSource_cmt: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      spinnerVisible:true,
    }
  }
  componentDidMount(){
    this.getComment();
    this.getInfoUser();
  }
  stop_spinner(){
    setTimeout(()=>{
      this.setState({
        spinnerVisible: false
      });
    },2000)
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  async getInfoUser(){
    let formdata = new FormData();
    formdata.append('id_user_login',this.state.user.id_user);
    formdata.append('id_user',this.state.id_user);
    formdata.append('id_status',this.state.id_status);

    fetch('http://suta.esy.es/api/getuserstatus_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        if (flag == true){
          this.setState({
            data_cmt: responseJson.result['0'],
          });
        }
        else {
          return;
        }
      })
      .catch(error=>{
        console.log(error);
      });

  }
  getComment(){
    let formdata = new FormData();
    formdata.append('id_status',this.state.id_status);
      fetch('http://suta.esy.es/api/getcmtstatus_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        if (flag == true){
          this.setState({
            dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(responseJson['result']!=null?responseJson['result']:listnull)
          });
          this.stop_spinner();
        }
        else {
          return;
        }
      })
      .catch(error=>{
        console.log(error);
      });

    }
    clearText(fieldName) {
      this.refs[fieldName].setNativeProps({text: ''});
      this.setState({
        sendColor: '#90949c',
      })
    }
    async _add_noti(){
      let formdata = new FormData();
      formdata.append("id_user", this.state.user.id_user);
      formdata.append("username", this.state.user.username);
      formdata.append("id_userFriend", this.state.id_user);
      formdata.append("id_status", this.state.id_status);

      fetch('http://suta.esy.es/api/noti_status.php',{
          method: 'post',
          headers: {
          'Content-Type': 'multipart/form-data',
          },
          body: formdata
        })
        .then((response)=>response.json())
        .then((jsonResponse)=>{
          if (flag == true){
            this.setState({
              dataSource_cmt: jsonResponse['result']!=null?this.state.dataSource_cmt.cloneWithRows(jsonResponse['result']):this.state.dataSource_cmt.cloneWithRows(listnull)
            });
          }
          else {
            return;
          }
        })
        .catch(error=>{
          console.log(error);
        });

    }
    async _addComment(){

      if(this.state.sendColor!= '#90949c')
      {
        if (this.state.user.id_user!=this.state.id_user) {
          this._add_noti();
        }

        this.clearText('contentComment')
        let formdata = new FormData();
        formdata.append("id_user", this.state.user.id_user);
        formdata.append("content", this.state.contentComment);
        formdata.append("id_status", this.state.id_status);
        fetch('http://suta.esy.es/api/addcomment.php',{
            method: 'post',
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            body: formdata
          })
          .then((response)=>response.json())
          .then((jsonResponse)=>{
            if (flag == true){
              this.setState({
                dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(jsonResponse['result'])
              });
            }
            else {
              return;
            }
          })
          .catch(error=>{
          console.log(error);
        });

      }
  }
  _renderRow_cmt(data){
    return(
      <View style={{borderTopWidth:0.5,borderTopColor:'rgba(143, 143, 143, 0.2)'}}>
        <View style={{flexDirection:'row',padding:10}}>
        <TouchableOpacity onPress={()=>this.showTimeline(data)} style={styles.backgroundAvatar} >
          <Image style={Platform.OS=='ios'?styles.avatar:styles.avatar_android} source={{uri: data.avatar}}/>
        </TouchableOpacity>
        <View style={{justifyContent:'center',marginLeft:10}}>
          <TouchableOpacity onPress={()=>this.showTimeline(data)}>
            <Text style={styles.textbold}>
              {data.username}
            </Text>
          </TouchableOpacity>
            <Text style={styles.textnormal}>
             {data.content}
            </Text>
            <Text style={[styles.textgray,{fontSize:8}]}>
              {data.time}
            </Text>
          </View>
        </View>
    </View>
    )
  }
  render() {
    return (

      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <MyStatusBar backgroundColor="#8e178f"/>
      <Spinner visible={this.state.spinnerVisible} textContent={"Vui lòng chờ..."} textStyle={{color: '#FFF'}} />
      <View style={styles.toolbar}>
      <TouchableOpacity onPress={()=>this.onBack()} style={{flex:1,alignItems:'center'}}>
        <Icon name="md-arrow-back" size={34} color="#F5F5F5" style={styles.ico}/>
      </TouchableOpacity>
        <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
          <Text style={styles.title}>
            BÌNH LUẬN
          </Text>
        </View>

      </View>
          <View style={{ flex:1}}>
          {
            this.state.data_cmt!=null?
            <View style={{ flex:1}}>
            <View style={{flexDirection:'row',padding:10}}>
              <View style={styles.backgroundAvatar} >
                {
                  this.state.check == 'anonymous'?
                  <Image style={styles.avatar} source={require('../images/logo2.png')}/>
                  :
                  <Image style={Platform.OS=='ios'?styles.avatar:styles.avatar_android} source={{uri: this.state.data_cmt.avatar}}/>
                }

              </View>
              <View style={{justifyContent:'center',marginLeft:10}}>

                <Text style={styles.textbold}>
                  {
                    this.state.check == 'anonymous'?
                    'Anonymous'
                    :
                    this.state.data_cmt.username
                  }
                </Text>
                <Text style={[styles.textgray,{fontSize:8}]}>
                  {this.state.data_cmt.time}
                </Text>
              </View>
            </View>
              <Text style={{padding:10,fontSize:13,color:'#1d2129'}}>
               {this.state.data_cmt.content}
              </Text>
              <View style={{flexDirection:'row',padding:10}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.onLike(this.state.data)}>
              {
                this.state.data_cmt.checklike!='0'?
                <Icon name='md-heart' color="rgb(254, 6, 6)" size={20} />
                :
                <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
              }
              <Text style={[styles.textgray,{marginLeft:5}]}>
                 {
                   this.state.data_cmt.like!='0'?
                   this.state.data_cmt.like + " Thích"
                   :
                   "Thích"
                 }
              </Text>

              </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}>
                  <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
                  <Text style={[styles.textgray,{marginLeft:5}]}>
                  {
                    this.state.data_cmt.comment!=null?
                    this.state.data_cmt.comment + "Bình Luận"
                    :
                    "Bình Luận"
                  }
                  </Text>
                </TouchableOpacity>
              </View>
              <ListView
              style={{flex:1}}
              dataSource={this.state.dataSource_cmt}
              renderRow={this._renderRow_cmt.bind(this)}
              enableEmptySections
              />
                </View>
          :
          <View></View>
          }

        </View>
        <View style={styles.bottomInput}>
          <TextInput
          underlineColorAndroid='transparent'
          style={styles.input}
          placeholder="Viết bình luận"
          onChangeText={(val) => this.setState({contentComment: val, sendColor:val!=''?'#8e44ad':'#90949c'})}
          multiline={true}
          placeholderTextColor= '#90949c'
          autoCapitalize="none"
          autoCorrect={false}
          ref={'contentComment'}/>
          <TouchableOpacity onPress={()=>this._addComment()}>
            <Icon name="md-send" size={28} color={this.state.sendColor} style={{paddingLeft:10,paddingRight:10}}/>
          </TouchableOpacity>
        </View>


      </View>

    );
  }
}
var styles = StyleSheet.create({
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
  },
});
