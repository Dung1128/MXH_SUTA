import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Anonymous from './anonymousView.js';
import Public from './publicView.js';
import DefaultTabBar from './tab/DefaultTabBar';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class NewFeed extends Component{
  constructor(props){
    super(props);
    this.state = ({
      modalVisible: false,
      radio1: 'md-radio-button-off',
      radio2: 'md-radio-button-off',
      radio3: 'md-radio-button-off',
      check: 'md-radio-button-on',
      flagConfession:0,
      checkadd: false,
      data: this.props.data
    });

  }
  componentWillMount(){
    this.setState({
      radio1: 'md-radio-button-on'
    })
  }
  async onPostStatus(){
    this.setModalVisible(!this.state.modalVisible);
      let formdata = new FormData();
      formdata.append("id_user", this.props.data.id_user);
      formdata.append("content", this.state.content);
      formdata.append("flagStatus", this.state.flagStatus);
      formdata.append("flagConfession", this.state.flagConfession);
      try {
        let response = await fetch('http://suta.esy.es/api/addstatus.php',{
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
           result: jsonResponse['result']

        });


      }
      catch(error)
      {
      //  console.log(error);
      }



  }

  onChecked(value){
    if(value==1&&this.state.radio1!=this.state.check)
    {
      this.setState({radio1:this.state.check, radio2: this.state.radio1,radio3: this.state.radio1,flagConfession:0,flagStatus:0 })
    }
    if(value==2&&this.state.radio2!=this.state.check)
    {
      this.setState({radio1:this.state.radio2, radio2: this.state.check,radio3: this.state.radio2,flagConfession:1,flagStatus:0})
    }
    if(value==3&&this.state.radio3!=this.state.check)
    {
      this.setState({radio1:this.state.radio3, radio2: this.state.radio3,radio3: this.state.check,flagStatus:1})
    }

  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  render(){
    return(
      <View style={{flex:1}}>
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <View  style={{backgroundColor: 'white',flex:1}}>
          <View style={Style.toolbar}>
            <TouchableOpacity activeOpacity={1} onPress={()=>this.setModalVisible(!this.state.modalVisible)} style={{flex:1,alignItems:'center'}}>
              <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
            </TouchableOpacity>
            <View style={{flex:5,alignItems:'center'}}>
              <Text style={Style.title}>
                CHIA SẺ
              </Text>
            </View>

            <TouchableOpacity onPress={()=> this.onPostStatus()} style={{flex:1,alignItems:'center'}}>
              <Icon name="md-send" size={24} color="#F5F5F5" style={Style.ico}/>
            </TouchableOpacity>
          </View>

            <View style={{flex:1,paddingTop:15,backgroundColor:'white'}}>
              <View style={Style.card}>
                <TextInput
                underlineColorAndroid="#F5F5F5"
                placeholderTextColor= 'gray'
                onChangeText={(val) => this.setState({content: val})}
                style={Style.textInputStyle}
                multiline={true}
                autoCapitalize="none"
                autoCorrect={false}
                editable = {true}
                autoFocus={true}
                textAlignVertical="top"
                numberOfLines = {4}
                returnKeyType="done"
                placeholder='Bạn đang có tâm sự gì?'/>
              </View>
              <View style={Style.authorStatus}>
                <TouchableOpacity  onPress={() => {this.onChecked(1)}} style={{flexDirection:'row',marginRight:20, alignItems:'center'}}>
                  <Icon name={this.state.radio1} color="#3498db" style={Style.ico_radio}/>
                  <Text>
                    Công Khai
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {this.onChecked(2)}} style={{flexDirection:'row',alignItems:'center'}}>
                  <Icon name={this.state.radio2} color="#3498db" style={Style.ico_radio}/>
                  <Text>
                    Ẩn Danh
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {this.onChecked(3)}} style={{flexDirection:'row',alignItems:'center'}}>
                  <Icon name={this.state.radio3} color="#3498db" style={Style.ico_radio}/>
                  <Text>
                    Chỉ Mình Tôi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
      <View style={Style.toolbar}>
        <TouchableOpacity style={{flex:1,alignItems:'center'}}>
          <Icon name="md-notifications" size={24} color="#F5F5F5" style={Style.ico}/>
        </TouchableOpacity>
        <View style={{flex:5,alignItems:'center'}}>
          <Text style={Style.title}>
            NHẬT KÝ
          </Text>
        </View>

        <TouchableOpacity onPress={()=> this.setModalVisible(!this.state.modalVisible)} style={{flex:1,alignItems:'center'}}>
          <Icon name="md-create" size={24} color="#F5F5F5" style={Style.ico}/>
        </TouchableOpacity>
      </View>
      <ScrollableTabView
      initialPage={0}
      renderTabBar={() => <DefaultTabBar />}
      >
        <Anonymous tabLabel="ẨN DANH" data={this.state.checkadd} user ={this.state.data}/>
        <Public tabLabel="CÔNG KHAI" data={this.state.checkadd} user ={this.state.data}/>

      </ScrollableTabView>
      </View>
    );
  }
}
var Style = StyleSheet.create({
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
  card:{
    flex:4,
  },
  authorStatus:{
    flex:1,
    padding:10,
    flexDirection:'row'
  },
  textInputStyle:{
    flex:4,
    paddingBottom:20,
    width:deviceWidth,

  }
});
