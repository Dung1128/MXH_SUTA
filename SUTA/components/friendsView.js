import React, {Component} from 'react';
import{
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
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Anonymous from './anonymousView.js';
import Public from './publicView.js';
import MyStatusBar from './statusbar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var data = [];
var data1 = [];
var listnull = [];
export default class Friends extends Component{
  constructor(props){
    super(props);
    this.state=({
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSourceUser: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSource_noti: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      user:this.props.data,
      modalVisible: false,
      modalVisible_noti: false,
      checksearch: false,
      spinnerVisible: false,
      refreshing: false,
    })
    console.disableYellowBox = true;
    flag = true;
  }
  handleExit(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
       Alert.alert(
             'Thông báo',
             'Thoát ứng dụng!',
             [
               {text: 'No', onPress: () => console.log('no')},
               {text: 'Yes', onPress: () =>  {BackAndroid.exitApp();}}
             ],
             { cancelable: false }
            );

       return true;
    });
  }
  componentWillUnmount() {
    flag = false;
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
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      // prepend 10 items
      this.setState({
        refreshing: false,

      });
      data = [];
      this.getListUser();
      this.get_noti();
      this.getFriends();
    }, 1000);
  }
  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });
  }

  componentDidMount(){
    this.getFriends();
    data = [];
    this.getListUser();
    this.get_noti();
  }

  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }
  setCheckSearch(value){
    this.setState({checksearch: value});
  }
  setSearchText(event) {
   let searchText = event.nativeEvent.text;
  var array = this.state.listuser
  var arrayFilter = array.filter(function (el) {
      if (searchText!='') {
        return (el.username.toLowerCase().indexOf(searchText.toLowerCase()) >=0);
      }else {
        return array;
      }

  });
  this.setState({
    dataSourceUser: this.state.dataSourceUser.cloneWithRows(arrayFilter),

  });

  }

  setSearchFriends(event){
    let searchText = event.nativeEvent.text;
   var array = data;
   var arrayFilter = array.filter(function (el) {
       if (searchText!='') {
         return (el.username.toLowerCase().indexOf(searchText.toLowerCase()) >=0);
       }else {
         return array;
       }

   });
   this.setState({
     dataSource: this.state.dataSource.cloneWithRows(arrayFilter),

   });
  }


  onAddFriends(){

    this.setModalVisible();

  }

  add_noti_addfr(data){

      let formdata = new FormData();
      formdata.append('id_user',this.state.user.id_user);
      formdata.append('username',this.state.user.username);
      formdata.append('id_userFriend',data.id_user);

          fetch('http://suta.esy.es/api/noti_add_friends.php',{
            method: 'post',
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            body: formdata
          })
          .then((response)=>response.json())
          .then((responseJson)=>{
            if (flag == true){
              this.getListUser();
            }
            else {
              return;
            }
          })
          .catch(error=>{
            console.log(error);
          });



  }

   getListUser(){

      let formdata = new FormData();
      formdata.append('id_userFriend',this.state.user.id_user);
          fetch('http://suta.esy.es/api/listuser.php',{
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
                listuser: responseJson['result'],
                dataSourceUser: this.state.dataSourceUser.cloneWithRows(responseJson['result']!=null?responseJson['result']:listnull),

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
  async getFriends(){

      let formdata = new FormData();
      formdata.append('id_user',this.state.user.id_user);

      try {
        let response = await fetch('http://suta.esy.es/api/getfriends_id.php',{
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
            list: jsonResponse['result'].listFriends,

          });
            if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {
               this.state.list = this.state.list.split(",");
              this.setState({
                list_array:  this.state.list,
              })
              this.getfriends_id();
            }
          }
          else {
            return;
          }
      } catch (error) {
        console.log(error);
      }


  }
  getfriends_id(){
    var j = 0;
    for (var i = 0; i <= this.state.list_array.length; i++) {
      if(typeof this.state.list_array[i]!='undefined')
      {
        this.friends(this.state.list_array[i]);
      }
    }

  }
  async friends(id_user){

      let formdata = new FormData();
      formdata.append('id_user',id_user);
      try {
        let response = await fetch('http://suta.esy.es/api/getuser_id.php',{
          method: 'post',
          header: {
            'Content-Type': 'multipart/formdata'
          },
          body: formdata
        });


        if(flag == true){
        let res = await response.text();
        var jsonResponse = JSON.parse(res);
        this.setState({
          fr_result: jsonResponse['result'],
        });
          if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {

              data.push(this.state.fr_result);
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data)
              });

          }
        }
        else {
          return;
        }
      } catch (error) {
       console.log(error);
      }
  }
  showTimeline(data){
    this.props.navigator.push({
      name: 'profile',
      passProps: {
        data: data
      }
    })
    if(this.state.modalVisible){
      this.setModalVisible();

    }

  }
  _renderRow(data){
    return (
      <View style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=>this.showTimeline(data)} style={{flex:1,flexDirection:'row'}}>
            <View style={Style.backgroundAvatar}>
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <TouchableOpacity  onPress={()=>this.showTimeline(data)} style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={Style.textbold}>
               {data.username}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.navigate('chat',data)} style={{justifyContent:'center',marginRight:5}}>
            <Icon color='rgba(0, 0, 0, 0.2)' name='md-chatbubbles' size={24} />
          </TouchableOpacity>

      </View>

    </View>
    )
  }
  _renderRowAddFriends(data){
    return (
      <View style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=>this.showTimeline(data)} style={{flex:1,flexDirection:'row'}}>
            <View>
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={Style.textbold}>
               {data.username}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.add_noti_addfr(data)} style={{justifyContent:'center',marginRight:5}}>
            <Icon color='rgba(0, 0, 0, 0.2)' name='md-add' size={24} />
          </TouchableOpacity>

      </View>
    </View>
    )
  }
  async onRead(data){
    let formdata = new FormData();
    formdata.append("id_notificationAddFriends",data.id_notificationAddFriends);
    try {
      let response = await fetch('http://suta.esy.es/api/onread_noti.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
      if(jsonResponse['code']==0)
      {
        this.get_noti();
      }
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
  async onOk(data){
    let formdata = new FormData();
    formdata.append("userid1",this.state.user.id_user);
    formdata.append("userid2",data.id_user);
    formdata.append("id_notificationAddFriends",data.id_notificationAddFriends);
    try {
      let response = await fetch('http://suta.esy.es/api/confirmFriend.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      if(flag == true){
      var jsonResponse = JSON.parse(res);
      if(jsonResponse['code']==0)
      {
        this.get_noti();
      }
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

  async onDelete(data){
    let formdata = new FormData();
    formdata.append("id_notificationAddFriends",data.id_notificationAddFriends);
    try {
      let response = await fetch('http://suta.esy.es/api/ondelete_noti.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
      if(jsonResponse['code']==0)
      {
        this.get_noti();
      }
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
  showNoti(){

    this.setModalVisible_noti(!this.state.modalVisible_noti);
  }
  stop_spinner(){
    setTimeout(()=>{
      this.setState({
        spinnerVisible: false
      });
    },2000)
  }
  async get_noti(){
      let formdata = new FormData();
      formdata.append('id_userFriend',this.state.user.id_user);
        try {
          let response = await fetch('http://suta.esy.es/api/get_noti_addfr.php',{
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
              notification: jsonResponse['notification'],
              dataSource_noti: this.state.dataSource_noti.cloneWithRows(jsonResponse['result']!=null?jsonResponse['result']:listnull),
            });
            this.stop_spinner();
          }
          else {
            return;
          }
        } catch(error) {
          console.error(error);
        }
  }
  setModalVisible_noti(visible) {
    this.setState({modalVisible_noti: visible});
  }
  _renderRow_noti(data){
    return(
      <TouchableOpacity onPress={()=>this.onRead(data)} style={{borderBottomWidth:0.5,borderBottomColor:'#e6dfdf',paddingBottom:10,flex:1,justifyContent:'space-between', flexDirection:'row',padding:10}}>
          <View style={{alignItems:'center',justifyContent:'center'}}>
              {
                data.new==0?
                <Icon name="md-mail-open" size={24} color="rgba(0, 0, 0, 0.2)"/>
                :
                <Icon name="md-mail" size={24} color="#3498db"/>
              }
          </View>
          <View style={{flex:4,marginLeft:15}}>
            <Text style={{color: 'black',fontSize:12}}>
             {data.content}
            </Text>
          </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>this.onOk(data)} style={{justifyContent:'center',marginRight:10}}>
                <Icon name="md-checkmark" size={24} color="#2ecc71"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onDelete(data)} style={{justifyContent:'center'}}>
                <Icon name="md-close" size={24} color="#e74c3c"/>
              </TouchableOpacity>
            </View>
      </TouchableOpacity>
    )
  }

  render(){
    return(

      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <MyStatusBar backgroundColor="#8e178f"/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible_noti}
        onRequestClose={()=>this.setModalVisible_noti(!this.state.modalVisible_noti)}
      >

      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={Style.toolbar}>
          <TouchableOpacity onPress={()=>this.setModalVisible_noti(!this.state.modalVisible_noti)} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={Style.title}>
              THÔNG BÁO
            </Text>
          </View>


        </View>

        <View style={{flex:1}}>
          <ListView
          style={{flex:1,zIndex:0,}}
          dataSource={this.state.dataSource_noti}
          renderRow={this._renderRow_noti.bind(this)}
          enableEmptySections={true}
          />
        </View>
     </View>
      </Modal>
      <Spinner visible={this.state.spinnerVisible} textContent={"Vui lòng chờ..."} textStyle={{color: '#FFF'}} />
      {
        this.state.checksearch?
        <View style={Style.toolbar}>
          <TouchableOpacity style={{flex:1,alignItems:'center'}}>
            <Icon name="md-search" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:5,alignItems:'center'}}>
          <TextInput
            placeholder="Tìm Kiếm"
            placeholderTextColor='white'
            underlineColorAndroid = 'transparent'
            autoCapitalize="none"
            autoCorrect={false}
            style={{width:deviceWidth-100,margin:5,
                paddingTop:0,
                paddingBottom:0,
                fontStyle: 'italic',
              color:'white'}}
            multiline={true}
            onChange={this.setSearchFriends.bind(this)}
          />
          </View>
          <TouchableOpacity onPress={()=> this.setCheckSearch(!this.state.checksearch)} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
        </View>
        :
        <View style={Style.toolbar}>
          <TouchableOpacity onPress={()=> this.setCheckSearch(!this.state.checksearch)} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-search" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:5,alignItems:'center'}}>
            <Text style={Style.title}>
              BẠN BÈ
            </Text>
          </View>

          <TouchableOpacity onPress={()=>this.onAddFriends()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-person-add" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
        </View>
      }
      <View style={{padding:10,width:deviceWidth,height:deviceHeight/11,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flex:1,flexDirection:'row'}}>
          <TouchableOpacity onPress={()=> this.showNoti()} style={[Style.backgroundAvatar,{justifyContent:'center',alignItems:'center',backgroundColor:'#3498db'}]}>
            <Icon color='#f5f5f5' name='md-contacts' size={24} />
          </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.showNoti()} style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={[Style.textbold,{color:'#3498db'}]}>
               Yêu cầu kết bạn
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=> this.showNoti()} style={{justifyContent:'center',marginRight:5,padding:5}}>
            <Icon color='rgba(0, 0, 0, 0.2)' name='md-notifications' size={24} />
            {
              this.state.notification== 0?
              <View></View>
              :
              <View style={{zIndex:1,borderRadius:100,
                borderWidth:1,borderColor:'white',
                width:15,height:15,position:'absolute',
                backgroundColor:'#3498db',
                top:0,right:0,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:8,color:'#f5f5f5'}}>{this.state.notification}</Text>
              </View>
            }
          </TouchableOpacity>

      </View>

    </View>
      <ListView
      style={{flex:1}}
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
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=>this.setModalVisible()}
      >

      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={Style.toolbar}>
          <TouchableOpacity onPress={()=>this.setModalVisible()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={Style.title}>
              THÊM BẠN
            </Text>
          </View>


        </View>

        <View style={{flex:1}}>
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
          style={{flex:1,zIndex:0,}}
          dataSource={this.state.dataSourceUser}
          renderRow={this._renderRowAddFriends.bind(this)}
          enableEmptySections={true}
          />
          <View style={Style.bottom}>
            <View style={Style.border}>
              <TextInput
                placeholder="Tìm Kiếm"
                placeholderTextColor='white'
                style={Style.input}
                multiline={true}
                underlineColorAndroid = 'transparent'
                autoCapitalize="none"
                autoCorrect={false}
                onChange={this.setSearchText.bind(this)}
              />
              <TouchableOpacity>
                <Icon name="md-search" size={24} color="#F5F5F5" style={Style.ico}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
     </View>
      </Modal>

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
    height:40
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
    justifyContent: 'space-between',
  },
});
