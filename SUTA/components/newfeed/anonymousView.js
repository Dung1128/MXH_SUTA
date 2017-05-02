import React, {Component} from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import MyStatusBar from '../statusbar.js';
import Hr from 'react-native-hr';
import dateFormat from 'dateformat';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var listnull = [];
export default class Anonymous extends Component{
  constructor(props){
    super(props);
    this.state = ({
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2) => r1!=r2}),
      refreshing: false,
      modalVisible: false,
      spinnerVisible: false,
      modalVisible_setting1: false,
      modalVisible_setting2: false,
      spinnerVisible_modal: false,

      sendColor: '#90949c',
      user: this.props.user,
    });
    flag = true;

    check = 0;
  }
  componentWillUnmount() {
    flag = false;
  }
  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });
      //this.fetchData();
  }
  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        id_status: data.id_status,
        id_user: data.id_user,
        user: this.props.user,
        check: 'anonymous'
      }
    })
  }
  componentDidMount(){
    this.fetchData();
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

  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }

  setModalVisible_Setting1() {
    if(this.state.modalVisible_setting1){
      this.setState({modalVisible_setting1: false});
    }else{
      this.setState({modalVisible_setting1: true});
    }
  }

  setModalVisible_Setting2() {
    if(this.state.modalVisible_setting2){
      this.setState({modalVisible_setting2: false});
    }else{
      this.setState({modalVisible_setting2: true});
    }
  }

  _setting1(data){
    this.setModalVisible_Setting1();
    this.setState({
      ID: data.id_status
    })
  }

  _setting2(data){
    this.setModalVisible_Setting2();
    this.setState({
      ID: data.id_status,
      data_status: data
    })
  }
  _okreport(){
    let formdata = new FormData();
    formdata.append('id_status',this.state.ID);

    fetch('http://suta.esy.es/api/reportstatus.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        console.log('ok, report');
        if (flag == true){
          Alert.alert('Thông báo','Bạn đã report thành công!');
        }
        else {
          return;
        }
      })
      .catch(error=>{
        console.log(error);
      });
  }

   _deleteStatus(){
    let formdata = new FormData();
    formdata.append('id_status',this.state.ID);

    fetch('http://suta.esy.es/api/deletestatus.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        console.log('ok, report');
        if (flag == true){
          Alert.alert('Thông báo','Bạn đã xóa thành công!');
          this.fetchData();
        }
        else {
          return;
        }
      })
      .catch(error=>{
        console.log(error);
      });

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
  }
  chat_anonymous(){
    this.setModalVisible_Setting2();
    this.props.navigator.push({
      name: 'chat_anonymous',
      passProps: {
        data: this.state.data_status,
        user_login: this.props.user,
      }
    })
  }

  _report(){
    Alert.alert(
   'Thông báo',
   'Bạn có muốn report bài viết không?',
   [
     {text: 'No', onPress: () => console.log('no')},
     {text: 'Yes', onPress: () => {this._okreport();}}
   ],
   { cancelable: false }
  );

  this.setModalVisible_Setting2();
  }

  componentWillReceiveProps(){
    this.fetchData();
  }
  stop_spinner(){
    setTimeout(()=>{
      this.setState({
        spinnerVisible: false
      });
    },2000)
  }
  fetchData() {
    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);

      fetch('http://suta.esy.es/api/getstatus_anonymous.php',{
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
            data: responseJson.result,
            dataSource: this.state.dataSource.cloneWithRows(responseJson.result),

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

  getInfoUser(data){
    let formdata = new FormData();
    formdata.append('id_user_login',this.state.user.id_user);
    formdata.append('id_user',data.id_user);
    formdata.append('id_status',data.id_status);

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
            data: responseJson.result['0'],
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

  onLike(data){

    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);
    formdata.append('id_status',data.id_status);

      fetch('http://suta.esy.es/api/checklike.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        if (flag == true){
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
      })
      .catch(error=>{
        console.log(error);
      });

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
      <View style={styles.backgroundAvatar} >
        <Image style={styles.avatar} source={require('../images/logo2.png')}/>
      </View>
      <View style={{justifyContent:'center',marginLeft:10}}>
        <Text style={styles.textbold}>
          Anonymous
        </Text>
        <Text style={[styles.textgray,{fontSize:8}]}>
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
          <Text style={[styles.textgray,{marginLeft:5}]}>
             {
               data.like!='0'?
               data.like + " Thích"
               :
               "Thích"
             }
          </Text>

          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.navigate('comment',data)} style={{flexDirection:'row',marginLeft:20}}>
            <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
            <Text style={[styles.textgray,{marginLeft:5}]}>
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
          {
            this.state.user.username == data.username?
            <TouchableOpacity onPress={()=>this._setting1(data)}>
              <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this._setting2(data)}>
              <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
            </TouchableOpacity>
          }
          </View>
        </View>

        </View>
    </View>
    )
  }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <Spinner visible={this.state.spinnerVisible} textContent={"Vui lòng chờ..."} textStyle={{color: '#FFF'}} />
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
          style={{flex:1}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
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
        <View style={styles._buttonSetting}>
          <TouchableOpacity
          onPress={()=>this._okok()}
          style={{
            overflow: 'hidden',
            alignItems:'center',
            flexDirection:'row',
            padding:10
          }}>
            <Icon name="ios-trash" size={24} color="#BDBDBD" style={{marginRight:10}}/>
            <Text style={styles.textnormal}>Xóa bài viết này</Text>
        </TouchableOpacity>
      </View>
      </TouchableOpacity>

        </Modal>

        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible_setting2}
        onRequestClose={()=>this.setModalVisible_Setting2()}
      >
        <TouchableOpacity activeOpacity={1}
              onPress={() => {
                    this.setModalVisible_Setting2()
                  }}
              style={{backgroundColor: 'rgba(0,0,0,0.1)',flex:1,alignItems:'center',justifyContent:'center',}} >
          <View style={styles._buttonSetting}>
            <TouchableOpacity 
              onPress={()=>this._report()}
              style={{
              overflow: 'hidden',
              alignItems:'center',
              flexDirection:'row',
              padding:10
            }}>
              <Icon name="ios-alert" size={24} color="#BDBDBD" style={{marginRight:10}}/>
              <Text style={styles.textnormal}>Báo cáo bài viết này</Text>
          </TouchableOpacity>
           <Hr lineColor='#BDBDBD'/>
          <TouchableOpacity
          onPress={()=>this.chat_anonymous()}
          style={{
            overflow: 'hidden',
            alignItems:'center',
            flexDirection:'row',
            padding:10
          }}>
            <Icon name="ios-chatbubbles" size={24} color="#BDBDBD" style={{marginRight:10}}/>
            <Text style={styles.textnormal}>Chat ẩn danh với người này</Text>
        </TouchableOpacity>
        </View>
        </TouchableOpacity>

        </Modal>
      </View>
    );
  }


}


const styles = StyleSheet.create({
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
      paddingLeft: 15
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
      zIndex:1,position:'absolute',bottom:49,
    }
  });
