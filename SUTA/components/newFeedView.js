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
      radiochecked: 'md-radio-button-on',
      radio: 'md-radio-button-off',
      check: 'md-radio-button-on',
    });
  }
async onPostStatus(){
      let formdata = new FormData();
      formdata.append("id_user", this.state.id_user);
      formdata.append("content", this.state.content);
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
        console.log(this.state.message);
        this.setModalVisible(!this.state.modalVisible);
        // alert(this.state.message);
        // if (this.state.code==0) {
        //     // show alert & moving screen
        //   //  console.log(this.state.message);
        //     // this.redirect('login','OK');
        // } else {
        //     //Handle error
        //     alert(this.state.message);
        //     let error = res;
        //     throw error;
        // }
      }
      catch(error)
      {
      //  console.log(error);
      }



  }
  onChecked(value){
    if(value==0&&this.state.radiochecked==this.state.check)
    {
      this.setState({radiochecked:this.state.radiochecked, radio: this.state.radio,flagConfession:0 })
    }
    if(value==1&&this.state.radio==this.state.check)
    {
      this.setState({radiochecked:this.state.radiochecked, radio: this.state.radio,flagConfession:1})
    }
    else{
      this.setState({radiochecked:this.state.radio, radio: this.state.radiochecked,flagConfession:1})
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
                <TouchableOpacity  onPress={() => {this.onChecked(0)}} style={{flexDirection:'row',marginRight:20, alignItems:'center'}}>
                  <Icon name={this.state.radiochecked} color="#3498db" style={Style.ico_radio}/>
                  <Text>
                    Công Khai
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {this.onChecked(1)}} style={{flexDirection:'row',alignItems:'center'}}>
                  <Icon name={this.state.radio} color="#3498db" style={Style.ico_radio}/>
                  <Text>
                    Ẩn Danh
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
        <Anonymous tabLabel="ẨN DANH"/>
        <Public tabLabel="CÔNG KHAI"/>

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
