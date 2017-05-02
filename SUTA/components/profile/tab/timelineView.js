import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ListView,
  AsyncStorage,
  Image,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import dateFormat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var flag = true;
var listnull = [];

export default class timeLineView extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSource_cmt: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      id: this.props.user.id_user,
      user: this.props.user,
      check_user: false,
      modalVisible: false,
      spinnerVisible: false,
      modalVisible_setting1: false,
      refreshing: false,
    }
    flag = true;
    console.disableYellowBox = true;
  }

  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });

  }

  componentDidMount(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value !=null)
      {
        this.setState({user_login:JSON.parse(value)});
        if (this.state.user.id_user==this.state.user_login.id_user) {
          this.setState({
            check_user: true
          });
        }
      }
    }).done();

    this.fetchData();
  }

  setModalVisible_Setting1() {
    if(this.state.modalVisible_setting1){
      this.setState({modalVisible_setting1: false});
    }else{
      this.setState({modalVisible_setting1: true});
    }
  }
  _setting1(data){
    this.setModalVisible_Setting1();
    this.setState({
      ID: data.id_status
    })
  }
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      // prepend 10 items
      this.setState({
        refreshing: false,

      });
      this.fetchData();
    }, 1000);
  }
  async _deleteStatus(){
    let formdata = new FormData();
    formdata.append('id_status',this.state.ID);

    try {
      let response = await fetch('http://suta.esy.es/api/deletestatus.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });
      this.fetchData();

    } catch (error) {
     console.log(error);
    }
  }
  _okok(){
    Alert.alert(
   'Thông báo',
   'Bạn có muốn xóa cảm nghĩ không?',
   [
     {text: 'No', onPress: () => console.log('no')},
     {text: 'Yes', onPress: () => {this._deleteStatus();}}
   ],
   { cancelable: false }
  );

  this.setModalVisible_Setting1();

  }

  componentWillUnmount() {
    flag = false;
  }
  stop_spinner(){
    setTimeout(()=>{
      this.setState({
        spinnerVisible: false
      });
    },2000)
  }
  fetchData(){
    let formdata = new FormData();
    formdata.append('id_user',this.state.id);
    fetch('http://suta.esy.es/api/getstatus_id.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata

      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        if (flag == true){
          this.setState({
            check: responseJson.result,
            dataSource: this.state.dataSource.cloneWithRows(responseJson['result']),
          });
          this.stop_spinner();
        }
        else {
          return;
        }
      })
      .catch(error=>{
        console.log(error);
        this.setState({
          spinnerVisible: false,
        });
      });

  }

  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }

  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        id_status: data.id_status,
        id_user: data.id_user,
        user: this.props.user,
        check: 'public'
      }
    })
  }
  onClickComment(data)
  {
    this.navigate('comment',data)
  }
  async getInfoUser(data){
    let formdata = new FormData();
    formdata.append('id_user_login',this.state.id);
    formdata.append('id_user',data.id_user);
    formdata.append('id_status',data.id_status);

    try {
      let response = await fetch('http://suta.esy.es/api/getuserstatus_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
        this.setState({
          data: jsonResponse.result['0'],
        });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }
  }

  async onLike(data){

    let formdata = new FormData();
    formdata.append('id_user',this.state.id);
    formdata.append('id_status',data.id_status);

    try {
      let response = await fetch('http://suta.esy.es/api/checklike.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
        if(this.state.modalVisible)
        {
          this.getInfoUser(data);
        }else {
          this.fetchData();
        }

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }

  }

  _renderRow(data){
    return(
      <View style={{flex:1,
        marginLeft:5,
        marginRight: 5,
        marginTop: 5,
        borderTopWidth:0.5,
        borderTopColor:'rgba(143, 143, 143, 0.2)',
        backgroundColor:'#fff',
        borderRadius: 5
      }}>
      <View style={{padding: 10}}>

      <View style={{flex:1,flexDirection:'row'}}>
        <View style={Style.backgroundAvatar} >
          <Image style={Platform.OS=='ios'?Style.avatar:Style.avatar_android} source={{uri: data.avatar}}/>
        </View>
        <View style={{justifyContent:'center',marginLeft:10}}>
          <Text style={Style.textbold}>
            {data.username}
          </Text>
          <Text style={Style.textgray}>
            {data.time}
          </Text>
        </View>
      </View>
        <Text style={{paddingTop:10,paddingBottom:10,fontSize:13,color:'#1d2129'}}>
         {data.content}
        </Text>
        <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center'}}>
          <View style={{flex:3,flexDirection:'row'}}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.onLike(data)}>
          {
            data.checklike!='0'?
            <Icon name='md-heart' color="rgb(254, 6, 6)" size={20} />
            :
            <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
          }
          <Text style={[Style.textgray,{marginLeft:5}]}>
             {
               data.like!='0'?
               data.like + " Thích"
               :
               "Thích"
             }
          </Text>

          </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.onClickComment(data)} style={{flexDirection:'row',marginLeft:20}}>
              <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
              <Text style={[Style.textgray,{marginLeft:5}]}>
              {
                data.comment!=null?
                data.comment + "Bình Luận"
                :
                "Bình Luận"
              }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={()=>this._setting1(data)}>
              <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </View>
    )
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#F5F5F5'}}>
      <Spinner visible={this.state.spinnerVisible} textContent={"Vui lòng chờ..."} textStyle={{color: '#FFF'}} />
        {
          this.state.check==null?
          <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <Text style={Style.textgray}>
          Người dùng chưa có bài đăng nào.!
          </Text>
          </View>
          :
          <View>
          <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections
          />

          <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible_setting1}
          onRequestClose={()=>this.setModalVisible_Setting1()}
        >
        <TouchableOpacity activeOpacity={1}
              onPress={() => {
                    this.setModalVisible_Setting1()
                  }}
              style={{backgroundColor: 'rgba(0,0,0,0.1)',flex:1,justifyContent:'center',alignItems:'center'}} >

            {
              this.state.check_user?
              <View style={Style._buttonSetting}>
                <TouchableOpacity onPress={()=>this._okok()}
                style={{
                  overflow: 'hidden',
                  alignItems:'center',
                  flexDirection:'row',
                  padding:10
                }}>
                    <Icon name="ios-trash" size={24} color="#BDBDBD" style={{marginRight:10}}/>
                    <Text style={Style.textnormal}>Xóa bài viết này</Text>
                </TouchableOpacity>
              </View>
              :
              <View style={Style._buttonSetting}>
                <TouchableOpacity
                style={{
                  overflow: 'hidden',
                  alignItems:'center',
                  flexDirection:'row',
                  padding:10
                }}>
                <Icon name="ios-alert" size={24} color="#BDBDBD" style={{marginRight:10}}/>
                <Text style={Style.textnormal}>Báo cáo bài viết này</Text>
                </TouchableOpacity>
              </View>
            }
          </TouchableOpacity>

          </Modal>
          </View>
        }
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
  input: {
    height:40,
    flex:1,
    backgroundColor:'rgba(255,255,255,0.8)',
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
  _buttonSetting:{
    width:deviceWidth,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'white',
    borderTopWidth: 2,
    borderTopColor:'#dedbdb',
    shadowColor:'#2E272B',
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.2,
    zIndex:1,position:'absolute',bottom:0,
  }
});
