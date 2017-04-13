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
  Alert
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
import dateFormat from 'dateformat';
import firebase from './api.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var listnull = [];
export default class Public extends Component{
  constructor(props){
    super(props);
    this.state = ({
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2) => r1!=r2}),
      dataSource_cmt: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      refreshing: false,
      modalVisible: false,
      modalVisible_setting1: false,
      modalVisible_setting2: false,
      sendColor: '#90949c',
      user: this.props.user,
      spinnerVisible: false,
    });
    flag = true;

    check = 0;

    database = firebase.database();
    _rp = database.ref('Report')
  }
  componentWillUnmount() {
    flag = false;
  }
  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });

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

  componentWillReceiveProps(){
    this.fetchData();
  }

  async fetchData() {
    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);

    try {
      let response = await fetch('http://suta.esy.es/api/getstatus_public.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var responseJson = JSON.parse(res);
      this.setState({
        data: responseJson.result,
        dataSource: this.state.dataSource.cloneWithRows(responseJson.result),
        spinnerVisible: false,
      });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }

  }

  onClose(){
    this.fetchData();
    this.setModalVisible();
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
      ID: data.id_status
    })
  }

  _report(){
  //  alert(this.state.ID);
    _rp.push(this.state.ID)
    this.setModalVisible_Setting2();
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

  onClickComment(data)
  {

    this.setState({
      spinnerVisible: true,
      data: data,
      dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(listnull)
    });
   this.getComment(data);
   this.setModalVisible();
  }
  async getInfoUser(data){
    let formdata = new FormData();
    formdata.append('id_user_login',this.state.user.id_user);
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

  async onLike(data){

    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);
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

  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
    this.setState({
      sendColor: '#90949c',
    })
  }
  async _addComment(value){
    if(this.state.sendColor!= '#90949c')
    {
      this.clearText('contentComment')
      let formdata = new FormData();
      formdata.append("id_user", this.state.user.id_user);
      formdata.append("content", this.state.contentComment);
      formdata.append("id_status", value.id_status);
      try {
        let response = await fetch('http://suta.esy.es/api/addcomment.php',{
          method: 'post',
          headers: {
          'Content-Type': 'multipart/form-data',
          },
          body: formdata
        });
        let res = await response.text();
        if(flag == true){
        var jsonResponse = JSON.parse(res);
        this.setState({
          dataSource_cmt: jsonResponse['result']!=null?this.state.dataSource_cmt.cloneWithRows(jsonResponse['result']):this.state.dataSource_cmt.cloneWithRows(listnull)
        });

        }
        else {
          return;
        }



      }
      catch(error)
      {
       console.log(error);
      }
    }
  }
  // Get data to list Comment
  async getComment(value){
    let formdata = new FormData();
    formdata.append('id_status',value.id_status);
    try {
      let response = await fetch('http://suta.esy.es/api/getcmtstatus_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if(flag == true){
      var jsonResponse = JSON.parse(res);
      this.setState({
        spinnerVisible: false,
        dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(jsonResponse['result'])
      });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }
  }
  _renderRow_cmt(data){
    return(
      <View style={{borderTopWidth:0.5,borderTopColor:'rgba(143, 143, 143, 0.2)'}}>
        <View style={{flexDirection:'row',padding:10}}>
          <View style={styles.backgroundAvatar} >
            <Image style={styles.avatar} source={{uri: data.avatar}}/>
          </View>
          <View style={{justifyContent:'center',marginLeft:10}}>
            <Text style={styles.textbold}>
              {data.username}
            </Text>
            <Text style={styles.textnormal}>
             {data.content}
            </Text>
            <Text style={styles.textgray}>
              {data.time}
            </Text>
          </View>
        </View>
    </View>
    )
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
        <Image style={styles.avatar} source={{uri: data.avatar}}/>
      </View>
      <View style={{justifyContent:'center',marginLeft:10}}>
        <Text style={styles.textbold}>
          {data.username}
        </Text>
        <Text style={styles.textgray}>
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
          <TouchableOpacity onPress={()=>this.onClickComment(data)} style={{flexDirection:'row',marginLeft:20}}>
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
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={()=>this.setModalVisible()}
        >

        <View style={{flex:1,backgroundColor:'white'}} >

        <View style={styles.toolbar}>
          <TouchableOpacity activeOpacity={1} onPress={()=>this.onClose()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={styles.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={styles.title}>
              BÌNH LUẬN
            </Text>
          </View>

        </View>
            <View style={{ flex:1}}>
            {
              this.state.data!=null?
              <View style={{ flex:1}}>
              <View style={{flexDirection:'row',padding:10}}>
                <View style={styles.backgroundAvatar} >
                  <Image style={styles.avatar} source={{uri: this.state.data.avatar}}/>
                </View>
                <View style={{justifyContent:'center',marginLeft:10}}>
                  <Text style={styles.textbold}>
                    {this.state.data.username}
                  </Text>
                  <Text style={styles.textgray}>
                    {this.state.data.time}
                  </Text>
                </View>
              </View>
                <Text style={{padding:10,fontSize:13,color:'#1d2129'}}>
                 {this.state.data.content}
                </Text>
                <View style={{flexDirection:'row',padding:10}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.onLike(this.state.data)}>
                {
                  this.state.data.checklike!='0'?
                  <Icon name='md-heart' color="rgb(254, 6, 6)" size={20} />
                  :
                  <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
                }
                <Text style={[styles.textgray,{marginLeft:5}]}>
                   {
                     this.state.data.like!='0'?
                     this.state.data.like + " Thích"
                     :
                     "Thích"
                   }
                </Text>

                </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}>
                    <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
                    <Text style={[styles.textgray,{marginLeft:5}]}>
                    {
                      this.state.data.comment!=null?
                      this.state.data.comment + "Bình Luận"
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
            onChangeText={(val) => this.setState({contentComment: val, sendColor:'#8e44ad'})}
            multiline={true}
            placeholderTextColor= '#90949c'
            autoCapitalize="none"
            autoCorrect={false}
            ref={'contentComment'}/>
            <TouchableOpacity onPress={()=>this._addComment(this.state.data)}>
              <Icon name="md-send" size={28} color={this.state.sendColor} style={{paddingLeft:10,paddingRight:10}}/>
            </TouchableOpacity>
          </View>

        </View>

        </Modal>

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
              style={{backgroundColor: 'rgba(0,0,0,.8)',flex:1,justifyContent:'center',alignItems:'center'}} >
          <TouchableOpacity activeOpacity={1} style={{
            width:300,
            backgroundColor:'white',
          }}>

              <TouchableOpacity onPress={()=>this._okok()}>
                <View style={styles._buttonSetting}>
                    <Text>Xóa bài
                    </Text>
                </View>
              </TouchableOpacity>


        </TouchableOpacity>
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
              style={{backgroundColor: 'rgba(0,0,0,.8)',flex:1,justifyContent:'center',alignItems:'center'}} >
          <TouchableOpacity activeOpacity={1} style={{
            width:300,
            backgroundColor:'white',
          }}>

              <TouchableOpacity onPress={()=>this._report()}>
                <View style={styles._buttonSetting}>
                    <Text>Report
                    </Text>
                </View>
              </TouchableOpacity>


        </TouchableOpacity>
        </TouchableOpacity>

        </Modal>
      </View>
    );
  }


}



class YourComponent extends React.Component{
  render(){
    return(
      <MenuContext>
      <Menu>
      <MenuTrigger>
        <TouchableOpacity>
          <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
        </TouchableOpacity>
      </MenuTrigger>

      <MenuOptions>
        <MenuOption >
        <Text>logout</Text>
        </MenuOption>

        <MenuOption>
        <Text>logout</Text>
        </MenuOption>

      </MenuOptions>
  </Menu>
  </MenuContext>
    )
  }
}

const styles = StyleSheet.create({
    avatar:{
      width:40,
      height:40,
      borderRadius:200
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
      alignItems:'center',
      justifyContent:'center',
      borderBottomWidth: 1,
      borderBottomColor:'#F5F5F5',
      paddingTop: 10,
      paddingBottom: 10
    }
  });
