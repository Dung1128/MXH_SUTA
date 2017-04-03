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
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Anonymous from './anonymousView.js';
import Public from './publicView.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var data = [];
var data1 = [];
export default class Friends extends Component{
  constructor(props){
    super(props);
    this.state=({
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSourceUser: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      user:this.props.data,
      modalVisible: false,
      checksearch: false,
      spinnerVisible: false,
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
    this.setState({
        spinnerVisible: true,
      });
    this.getFriends();
    data = [];
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
    this.setState({
        spinnerVisible: true,
      });
    this.getListUser();
    this.setModalVisible();

  }
  async getListUser(){

      let formdata = new FormData();
      formdata.append('id_userFriend',this.state.user.id_user);
      //alert(this.state.userId);
        try {
          let response = await fetch('http://suta.esy.es/api/listuser.php',{
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
              listuser: jsonResponse['result'],
              dataSourceUser: this.state.dataSourceUser.cloneWithRows(jsonResponse['result']),
              spinnerVisible: false,
            });


          }
          else {
            return;
          }
          // else{
          //   console.log(this.state.message);
          // }

        } catch(error) {
          console.error(error);
        }


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
        if(i == this.state.list_array.length-1){
          this.setState({
              spinnerVisible: false,
            });
        }
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

  _renderRow(data){
    return (
      <TouchableOpacity style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={Style.backgroundAvatar} >
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={Style.textbold}>
               {data.username}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{justifyContent:'center',marginRight:5}}>
            <Icon color='rgba(0, 0, 0, 0.2)' name='md-chatbubbles' size={24} />
          </TouchableOpacity>

      </View>
    </TouchableOpacity>
    )
  }
  _renderRowAddFriends(data){
    return (
      <TouchableOpacity style={{padding:10,flex:1,borderBottomWidth:0.5,borderBottomColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={Style.backgroundAvatar} >
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={Style.textbold}>
               {data.username}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{justifyContent:'center',marginRight:5}}>
            <Icon color='rgba(0, 0, 0, 0.2)' name='md-add' size={24} />
          </TouchableOpacity>

      </View>
    </TouchableOpacity>
    )
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
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

      <ListView
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
      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
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
