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
  RefreshControl
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

  async fetchData(){
    let formdata = new FormData();
    formdata.append('id_user',this.state.id);
    try {
      let response = await fetch('http://suta.esy.es/api/getstatus_id.php',{
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
        dataSource: this.state.dataSource.cloneWithRows(jsonResponse['result']),
        spinnerVisible: false,
      });
    }
    else {
      return;
    }
    } catch (error) {
      console.log(error);
      this.setState({
        spinnerVisible: false,
      });
    }
  }

  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }

  onClose(){
    this.fetchData();
    this.setModalVisible();
  }
  onClickComment(data)
  {

    this.setState({
      data: data,
      dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(listnull),
    });
   this.getComment(data);
   this.setModalVisible();
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
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
    this.setState({
      sendColor: '#90949c',
    })
  }
  async _add_noti(value){
    let formdata = new FormData();
    formdata.append("id_user", this.state.user.id_user);
    formdata.append("username", this.state.user.username);
    formdata.append("id_userFriend", value.id_user);
    formdata.append("id_status", value.id_status);
    try {
      let response = await fetch('http://suta.esy.es/api/noti_status.php',{
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
  async _addComment(value){
    if(this.state.sendColor!= '#90949c')
    {
      this._add_noti(value);
      this.clearText('contentComment');
      let formdata = new FormData();
      formdata.append("id_user", this.state.id);
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
        var jsonResponse = JSON.parse(res);
        this.setState({
          code: jsonResponse['code'],
           message: jsonResponse['message'],
           result: jsonResponse['result'],
           dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(jsonResponse['result'])
        });


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
    return (
      <View style={{borderTopWidth:0.5,borderTopColor:'rgba(143, 143, 143, 0.2)'}}>
          <View style={{flexDirection:'row',padding:10}}>
            <View style={Style.backgroundAvatar} >
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <View style={{justifyContent:'center',marginLeft:10}}>
              <Text style={Style.textbold}>
                {data.username}
              </Text>
              <Text style={Style.textnormal}>
               {data.content}
              </Text>
              <Text style={Style.textgray}>
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
        <View style={Style.backgroundAvatar} >
          <Image style={Style.avatar} source={{uri: data.avatar}}/>
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
      <Text>{this.state.user.username}
      </Text>
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
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={()=>this.setModalVisible()}
        >

        <View style={{flex:1,backgroundColor:'white'}} >

        <View style={Style.toolbar}>
          <TouchableOpacity activeOpacity={1} onPress={()=>this.onClose()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={Style.title}>
              BÌNH LUẬN
            </Text>
          </View>

        </View>
            <View style={{ flex:1}}>
            {
              this.state.data!=null?
              <View style={{ flex:1}}>
              <View style={{flexDirection:'row',padding:10}}>
                <View style={Style.backgroundAvatar} >
                  <Image style={Style.avatar} source={{uri: this.state.data.avatar}}/>
                </View>
                <View style={{justifyContent:'center',marginLeft:10}}>
                  <Text style={Style.textbold}>
                    {this.state.data.username}
                  </Text>
                  <Text style={Style.textgray}>
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
                <Text style={[Style.textgray,{marginLeft:5}]}>
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
                    <Text style={[Style.textgray,{marginLeft:5}]}>
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

          <View style={Style.bottomInput}>

            <TextInput
            style={Style.input}
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
                <View style={Style._buttonSetting}>
                    <Text>Xóa bài
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
var Style = StyleSheet.create({
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
