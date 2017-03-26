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
  Modal

} from 'react-native';
// import Style from 'Style.js';
import Hr from 'react-native-hr';
import Iconn from 'react-native-vector-icons/Ionicons';
import TimeLineView from './tab/timelineView.js';
import ImageView from './tab/imageView.js';
import { Tabs, Tab, Icon } from 'react-native-elements';
var ScrollableTabView = require('react-native-scrollable-tab-view');
import DefaultTabBar from './tab/DefaultTabBar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class profileView extends Component {
  constructor(props) {
    super(props);
    this.state= ({
      user: '',
      name:'dung111',
      modalVisible: false,
      user:JSON.parse(this.props.data),
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
  componentWillMount(){

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


  openDrawer(){
    this.refs['DRAWER_REF'].openDrawer();
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
      <TouchableOpacity>
        <View>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Cập nhật ảnh đại điện </Text>
        </View>
      </TouchableOpacity>

      <Hr lineColor='#BDBDBD'/>
      <TouchableOpacity>
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
        <Image style={{flex:1, flexDirection:'row'}} source={{uri: 'http://suta.esy.es/images/dung.jpg'}}>
          <View style={styles.toolbar}>
            <TouchableOpacity onPress={this.onBack.bind(this)} style={styles.back} >
              <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
            </TouchableOpacity>
          </View>

          <View style={{left:20,bottom:20,position:'absolute',justifyContent:'center',alignItems:'center'}}>
            <View style={{justifyContent:'center',alignItems:'center',width:70,height:70,borderWidth:0.2,borderColor:'#d1d1d1',borderRadius:200, backgroundColor:'white', alignItems:'center'}} >
              <Image style={{width:70, height:70,borderRadius:200}} source={{uri: this.state.user.avatar}}/>
            </View>
            <Text style={{alignItems:'center',fontSize:14,fontWeight: 'bold',color:'white'}}>
              {this.state.user.username}
            </Text>
          </View>


          <View style={{paddingLeft: deviceWidth - 68,paddingTop:10}}>
            <TouchableOpacity onPress={()=>this.openDrawer()}>
              <Iconn name="md-menu" size={34} color="#F5F5F5"/>
            </TouchableOpacity>
          </View>
          </Image>
        </View>
        <View style={styles._content}>
          <ScrollableTabView
            initialPage={0}
            renderTabBar={() => <DefaultTabBar/>}
          >
              <TimeLineView tabLabel='Nhật Ký' id = {this.state.user.id_user} />
              <ImageView tabLabel='Hình Ảnh' />
          </ScrollableTabView>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=>{alert("Modal has been closed.")}}
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

            <Image style={{width:deviceWidth, height:deviceHeight/4}}
            source={{uri: 'http://suta.esy.es/images/dung.jpg'}}>

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
                <Image style={{width:60, height:60,borderRadius:180}} source={{uri: this.state.user.avatar}}/>
              </View>
              <Text style={{alignItems:'center',fontSize:14,
              fontWeight: 'bold',color:'white', paddingLeft: 10}}>
                {this.state.user.username}
              </Text>
            </View>

            </Image>
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

                <TouchableOpacity>
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
