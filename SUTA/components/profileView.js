import React, {Component} from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  DrawerLayoutAndroid

} from 'react-native';
// import Style from 'Style.js';
import Hr from 'react-native-hr';
import Iconn from 'react-native-vector-icons/Ionicons';
import TimeLineView from './tab/timelineView.js';
import ImageView from './tab/imageView.js';
import { Tabs, Tab, Icon } from 'react-native-elements';
var ScrollableTabView = require('react-native-scrollable-tab-view');
import defaultTabBar from './tab/DefaultTabBar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class profileView extends Component {
  constructor(props) {
    super(props);

  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
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

  openDrawer(){
    this.refs['DRAWER_REF'].openDrawer();
  }

  render(){
    var navigationView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View>
        <Text style={{marginTop: 15, margin:10, fontSize: 15, textAlign: 'left',fontWeight:'bold'}}> Thông tin chung </Text>
      </View>
      <TouchableOpacity>
        <View style={{ flexDirection:'row'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}> Thông tin cá nhân </Text>
          <TouchableOpacity>
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
          <TouchableOpacity>
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
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.back} >
              <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
            </TouchableOpacity>
          </View>

          <View style={{left:20,bottom:20,position:'absolute',justifyContent:'center',alignItems:'center'}}>
            <View style={{justifyContent:'center',alignItems:'center',width:70,height:70,borderWidth:0.2,borderColor:'#d1d1d1',borderRadius:200, backgroundColor:'white', alignItems:'center'}} >
              <Image style={{width:70, height:70,borderRadius:200}}/>
            </View>
            <Text style={{alignItems:'center',fontSize:14,fontWeight: 'bold',color:'black'}}>
              Dũngnt
            </Text>
          </View>


          <View style={{paddingLeft: deviceWidth - 68,paddingTop:10}}>
            <TouchableOpacity onPress={()=>this.openDrawer()}>
              <Iconn name="md-menu" size={34} color="#F5F5F5"/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles._content}>
          <ScrollableTabView
    >
              <TimeLineView tabLabel='Nhật Ký'/>
              <ImageView tabLabel='Hình Ảnh'/>
          </ScrollableTabView>
        </View>
      </View>
      </DrawerLayoutAndroid>
    )
  }
}
const styles = StyleSheet.create({
  _cover:{
    flex:1,
    backgroundColor:'yellow',
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
