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
import GridView from "react-native-easy-grid-view";
import Spinner from 'react-native-loading-spinner-overlay';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var flag = true;
var listnull = [];

export default class timeLineView extends Component{
  constructor(props){
    super(props);
    this.state={
      user: this.props.user,
      dataSource_gidview : new GridView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      spinnerVisible: false,
      refreshing: false,
      modalVisible: false,
      modalVisible_show: false,
    }
    flag = true;
    console.disableYellowBox = true;
  }

  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data,
        user: this.state.user,
        id_user: data.id_user,
      }
    })
  }

  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });

  }

  componentDidMount(){
    this.fetchData_gidview();
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
      this.fetchData_gidview();
    }, 1000);
  }
  async _deleteStatus(){
    let formdata = new FormData();
    formdata.append('id_status',this.props.id_user);

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


  onShow(data){
    Image.getSize(data.img, (width, height) => {
      this.setState({width, height});
    });
    this.navigate('commentimg', data)
    // this.setModalVisible_show();
    this.setState({
      data_link: data.img,
    });

  }

  setModalVisible_show() {
    if(this.state.modalVisible_show){
      this.setState({modalVisible_show: false});
    }else{
      this.setState({modalVisible_show: true});
    }
  }

  async fetchData_gidview() {
    let formdata = new FormData();
    formdata.append('id_user',this.props.user.id_user);

    try {
      let response = await fetch('http://suta.esy.es/api/get_images_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      console.log(res);
      if (flag == true){
      var jsonResponse = JSON.parse(res);
      this.setState({
        check: jsonResponse.result,
        dataSource_gidview: this.state.dataSource_gidview.cloneWithCells(jsonResponse.result,3),
      });
      this.stop_spinner();
      console.log(jsonResponse.result);

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


  _renderCell(data) {
     return (
       <TouchableOpacity onPress={() => {this.onShow(data)}}>
         <View>
           <Image
            style={{height:200, height: 100}}
             source={{uri: data.img} }>
           </Image>
         </View>
       </TouchableOpacity>
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
          <GridView dataSource={this.state.dataSource_gidview}
                      spacing={8}
                      style={{padding:5}}
                      renderCell={this._renderCell.bind(this)}/>

          </View>
        }
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible_show}
            onRequestClose={()=>{alert("Modal has been closed.")}}
          >
          <TouchableOpacity activeOpacity={1}
                onPress={() => {
                      this.setModalVisible_show()
                    }}
                style={{flex:1,justifyContent:'center',alignItems:'center'}} >
                <TouchableOpacity activeOpacity={1}
                      onPress={() => {
                            this.setModalVisible_show()
                          }}
                      style={{  width: deviceWidth, height: deviceHeight }} >

          <Image style={{
            width: deviceWidth,
            height: deviceWidth * this.state.height / this.state.width}}
            source={{uri: this.state.data_link}}>
          </Image>
          </TouchableOpacity>
          </TouchableOpacity>
      </Modal>
      </View>
    );
  }
}
var Style = StyleSheet.create({

});
