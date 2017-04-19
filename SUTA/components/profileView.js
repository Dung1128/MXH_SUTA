import React, {Component} from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  DrawerLayoutAndroid,
  AsyncStorage,
  Modal,
  Platform
} from 'react-native';
// import Style from 'Style.js';
import Hr from 'react-native-hr';
import Iconn from 'react-native-vector-icons/Ionicons';
import TimeLineView from './tab/timelineView.js';
import { Tabs, Tab, Icon } from 'react-native-elements';
var ImagePicker = require('react-native-image-picker');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class profileView extends Component {
  constructor(props) {
    super(props);
    this.state= ({
      user: '',
      name:'dung111',
      modalVisible: false,
      user:this.props.data,
      check_user:false,
    });
    console.disableYellowBox = true;
  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: this.props.data
      }
    })
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  componentDidMount(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value !=null)
      {
        this.setState({user_login:JSON.parse(value)});
      }
    }).done();
    this.get_set_info();
  }
  onProfile(data){
     this.setModalVisible();
   }

  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
     }

   changeprofile(){
     this.setModalVisible()
     this.redirect('changeprofile');
   }

  openDrawer(){
    this.refs['DRAWER_REF'].openDrawer();
  }

  save_user(data){
    if (this.state.user.id_user==this.state.user_login.id_user) {
      AsyncStorage.setItem("user",JSON.stringify(data));
      this.setState({
        check_user: true
      });
    }
  }

  async get_set_info(){
    let formdata = new FormData();
    formdata.append("id_user",this.state.user.id_user);
    try {
      let response = await fetch('http://suta.esy.es/api/getuser_id.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.setState({
        user: jsonResponse['result']
      });
      this.save_user(jsonResponse['result']);

    }
    catch(error)
    {
      console.log(error);
    }
  }
  selectPhotoTapped(key) {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source, temp;
        temp = response.data;

        this.setState({
          avatarSource: source,
          imgBase64: temp,
        });
        if (key==0) {
          this.upload_avatar();
        }else if (key==1) {
          this.upload_background();
        }

      }
    });
  }
  async upload_avatar(){
    let formdata = new FormData();
    formdata.append("img",this.state.imgBase64);
    formdata.append("id_user",this.state.user.id_user);
    try {
      let response = await fetch('http://suta.esy.es/api/upload_avatar.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.setState({
        user: jsonResponse['result']
      });
      this.save_user(jsonResponse['result']);
    }
    catch(error)
    {
      console.log(error);
    }
  }
  async upload_background(){
    let formdata = new FormData();
    formdata.append("img_background",this.state.imgBase64);
    formdata.append("id_user",this.state.user.id_user);
    try {
      let response = await fetch('http://suta.esy.es/api/upload_background.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.setState({
        user: jsonResponse['result']
      });
      this.save_user(jsonResponse['result']);
    }
    catch(error)
    {
      console.log(error);
    }
  }
  render(){
    var navigationView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View>
        <Text style={{marginTop: 15, margin:10, fontSize: 15, textAlign: 'left',fontWeight:'bold'}}> Thông tin chung </Text>
      </View>
      <TouchableOpacity onPress={() => {this.onProfile(this.props.data) }}>
        <View style={{ flexDirection:'row'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Thông tin cá nhân </Text>
          <TouchableOpacity onPress={() => {this.onProfile(this.props.data) }}>
            <Iconn name="ios-arrow-forward" size={30} color="#BDBDBD" style={{marginTop:5, marginLeft: 100}}/>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Hr lineColor='#BDBDBD'/>
      <TouchableOpacity onPress={()=>this.selectPhotoTapped(0)}>
        <View>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Cập nhật ảnh đại điện </Text>
        </View>
      </TouchableOpacity>

      <Hr lineColor='#BDBDBD'/>
      <TouchableOpacity onPress={()=>this.selectPhotoTapped(1)}>
        <View>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Cập nhật hình nền </Text>
        </View>
      </TouchableOpacity>

      <View>
        <Text style={{marginTop: 25, margin:10, fontSize: 15, textAlign: 'left',fontWeight:'bold'}}> Cài đặt </Text>
      </View>

      <Hr lineColor='#BDBDBD'/>

      <TouchableOpacity onPress={this.redirect.bind(this,'accountManager')}>
        <View style={{flexDirection:'row'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Quản lý tài khoản </Text>
          <TouchableOpacity onPress={this.redirect.bind(this,'accountManager')}>
            <Iconn name="ios-arrow-forward" size={30} color="#BDBDBD" style={{marginTop:5, marginLeft: 100}}/>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Hr lineColor='#BDBDBD'/>


        <View>
          <Text style={{margin: 10, marginTop:25, fontSize: 15, textAlign: 'left', fontWeight:'bold'}}> Hỗ trợ </Text>
        </View>

      <Hr lineColor='#BDBDBD'/>

      <TouchableOpacity>
        <View>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Phản hồi </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

    return(
      <DrawerLayoutAndroid
      drawerWidth={270}
      drawerPosition={DrawerLayoutAndroid.positions.Right}
      ref={'DRAWER_REF'}
      renderNavigationView={() => navigationView}>
      <View style={{flex:1}}>
        <View style={styles._cover}>
        <Image style={{flex:1, flexDirection:'row'}}
        source={{uri: this.state.user.background}}
        >
          <View style={styles.toolbar}>
            <TouchableOpacity onPress={this.onBack.bind(this)} style={styles.back} >
              <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
            </TouchableOpacity>
          </View>

          <View style={{left:20,bottom:20,position:'absolute',justifyContent:'center',alignItems:'center'}}>
            <View style={{justifyContent:'center',
            alignItems:'center',
            width:70,height:70,
            borderWidth:2,
            borderColor:'#f5f5f5',
            borderRadius:200,
            backgroundColor:'white',
            alignItems:'center'}} >
              <Image style={{width:70, height:70,borderRadius:200}} source={{uri: this.state.user.avatar}}/>
            </View>
            <Text style={{alignItems:'center',fontSize:14,fontWeight: 'bold',color:'white'}}>
              {this.state.user.username}
            </Text>
          </View>
          {
            this.state.check_user?
            <View style={{paddingLeft: deviceWidth - 68,paddingTop:10}}>
              <TouchableOpacity onPress={()=>this.openDrawer()}>
                <Iconn name="md-menu" size={34} color="#F5F5F5"/>
              </TouchableOpacity>
            </View>
            :
            <View style={{position:'absolute',right:10,paddingTop:10}}>
            <TouchableOpacity style={{justifyContent:'center',
            alignItems:'center',
            width:40,height:40,
            borderRadius:200,
            backgroundColor:'rgba(255, 255, 255, 0.2)',
            alignItems:'center'}}>
              <Iconn name="md-person-add" size={24} color="#F5F5F5"/>
            </TouchableOpacity>
            </View>
          }
          </Image>
        </View>
        <View style={styles._content}>
          <TimeLineView tabLabel='Nhật Ký' user = {this.state.user} />
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=>this.setModalVisible()}
      >
        <TouchableOpacity activeOpacity={1}
              onPress={() => {
                    this.setModalVisible()
                  }}
              style={{backgroundColor: 'rgba(0,0,0,.8)',flex:1,justifyContent:'center',alignItems:'center'}} >
          <TouchableOpacity activeOpacity={1} style={{
            width:300,

            backgroundColor:'white',
          }}>

            <View>
            <View style={{width:deviceWidth, height:deviceHeight/4, backgroundColor:'rgb(117, 54, 96)'}}>
            <Image style={{width:deviceWidth, height:deviceHeight/4}}
              source={{uri: this.state.user.background}}
            >

            <View style={{left:15,
              bottom:15,position:'absolute',justifyContent:'center',
              alignItems:'center',
              flexDirection:'row'}}>
              <View style={{justifyContent:'center',
              alignItems:'center',width:60,height:60,
              borderWidth:0.2,
              borderColor:'#d1d1d1',
              borderRadius:200,
              backgroundColor:'white',
              alignItems:'center',
              }} >
                <Image style={{width:60, height:60,borderRadius:180}}
                source={{uri: this.state.user.avatar}}/>
              </View>
              <Text style={{alignItems:'center',fontSize:14,
              fontWeight: 'bold',color:'white', paddingLeft: 10}}>
                {this.state.user.username}
              </Text>
            </View>

            </Image>
            </View>
            <View>
              <View style={{ marginLeft: 15, marginRight:15, borderBottomWidth: 0.3, borderBottomColor:'#F5F5F5'}}>
                <View style={{paddingTop: 15, paddingBottom: 15, flexDirection: 'row' }}>
                  <View sytle={{flex: 1}}>
                    <Text> Ngày sinh
                    </Text>
                  </View>
                  <View sytle={{flex: 2}}>
                    <Text style={{paddingLeft: 30}}> {this.state.user.dob}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ marginLeft: 15, marginRight:15, borderBottomWidth: 0.3, borderBottomColor:'#F5F5F5'}}>
                <View style={{paddingTop: 15, paddingBottom: 15, flexDirection: 'row'}}>
                  <View sytle={{flex: 1}}>
                    <Text> Quê quán
                    </Text>
                  </View>
                  <View sytle={{flex: 2}}>
                    <Text style={{paddingLeft: 30}}>{this.state.user.address}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ marginLeft: 15, marginRight:15, borderBottomWidth: 0.3, borderBottomColor:'#F5F5F5'}}>
                <View style={{paddingTop: 15, paddingBottom: 15, flexDirection: 'row'}}>
                  <View sytle={{flex: 1}}>
                    <Text> Điện thoại
                    </Text>
                  </View>
                  <View sytle={{flex: 2}}>
                    <Text style={{paddingLeft: 30}}> {this.state.user.phone}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ marginLeft: 15, marginRight:15, borderBottomWidth: 0.3, borderBottomColor:'#F5F5F5'}}>
                <View style={{paddingTop: 15, paddingBottom: 15, flexDirection: 'row'}}>
                  <View sytle={{flex: 1}}>
                    <Text> Email
                    </Text>
                  </View>
                  <View sytle={{flex: 2}}>
                    <Text style={{paddingLeft: 30}}> {this.state.user.email}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', paddingTop: 15}}>
                <TouchableOpacity activeOpacity={1}
                  onPress={() => {
                        this.setModalVisible()
                      }}>
                  <Text style={{marginLeft: 15, marginBottom: 15, fontWeight: 'bold'}}> Đóng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.changeprofile()}>
                  <Text style={{marginLeft: 15, marginBottom: 15, fontWeight: 'bold', color:'#8e44ad'}}> Đổi thông tin
                  </Text>
                </TouchableOpacity>

              </View>

            </View>




            </View>

          </TouchableOpacity>


        </TouchableOpacity>
      </Modal>

      </DrawerLayoutAndroid>
    )
  }
}
const styles = StyleSheet.create({
  _cover:{
    flex:1,
    backgroundColor:'rgb(117, 54, 96)',
    flexDirection:'row'
  },
  _content:{
    flex:2,
    backgroundColor: '#f8f8f8'
  },
  toolbar:{
    paddingLeft:10,
    paddingTop:10
  }
})
