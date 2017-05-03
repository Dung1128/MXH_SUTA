import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Hr from 'react-native-hr';
import MyStatusBar from '../statusbar.js';
export default class feedbackView extends Component{
  constructor(props){
    super(props);
    this.state={
      data: this.props.data
    }
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }

   addfeedback(){
    let formdata = new FormData();
    formdata.append('id_user',this.state.data.id_user);
    formdata.append('title',this.state.title);
    formdata.append('content',this.state.content);

    fetch('http://suta.esy.es/api/feedback.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      })
      .then((response)=>response.json())
      .then((responseJson)=>{
        console.log('success');
        Alert.alert('Thông báo','Gửi phản hồi thành công!');
        this.clearText('tit');
        this.clearText('cont');
      })
      .catch(error=>{
        console.log(error);
      });


  }

  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }

  render(){
    return(
      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop:3, color:'#fff'}}> Ý kiến đóng góp
          </Text>
        </View>

        <View style={styles._content}>
          <View style={{flex:1, padding:20}}>
            <View style={{height:34,width:deviceWidth-40}}>
              <TextInput
              underlineColorAndroid="#ffffff"
              placeholderTextColor= "#BDBDBD"
              placeholder="Tiêu đề"
              style={styles.input}
              multiline={false}
              onChangeText={(val) => this.setState({title: val})}
              ref={'tit'}/>

            </View>

            <View style={{paddingTop:30}}>
              <Text>
                Nội dung
              </Text>
            </View>

            <View style={{height:deviceHeight/5,width:deviceWidth-40, paddingTop:5}}>
              <TextInput
              underlineColorAndroid="#ffffff"
              placeholderTextColor= "#BDBDBD"
              placeholder="content"
              editable = {true}
              maxLength = {40}
              numberOfLines = {4}
              style={styles.content}
              multiline={true}
              ref={'cont'}
              onChangeText={(val) => this.setState({content: val})}/>

            </View>

            <View style={{height:deviceHeight/9,width:deviceWidth-40, paddingTop:30, flexDirection:'row'}}>

              <TouchableOpacity onPress={()=>{this.clearText('tit'); this.clearText('cont');}}
              style={{flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#cf4332',
                marginRight:10}}>
                <Text style={{color:'rgb(255, 255, 255)'}}> Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{this.addfeedback();}}
              style={{flex:1,
                backgroundColor:'#8e44ad',
                marginLeft:10,
                justifyContent:'center',
                alignItems:'center'}}>
                <Text style={{color:'rgb(255, 255, 255)'}}> Gửi
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  _toolbar:{
    flex:1,
    backgroundColor:'#8e44ad',
    paddingLeft:10,
    paddingTop: (deviceHeight/14)/4,
    flexDirection:'row'
  },
  _content:{
    flex:13,
    backgroundColor:'#F5F5F5'
  },
  _inputChange:{
    backgroundColor:'#ffffff'
  },
  _button:{
    backgroundColor:'#8e44ad',
    width:deviceWidth/2,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20
  },
  input:{
        flex:1,
        paddingTop:0,
        paddingBottom:0,
        fontStyle: 'italic',
        borderBottomWidth:1,
        borderBottomColor:'#BDBDBD',
        paddingLeft:5,
        paddingRight:5
    },
    content:{
      flex:1,
      paddingTop:0,
      paddingBottom:0,
      fontStyle: 'italic',
      borderWidth:1,
      borderColor:'#BDBDBD',
      paddingLeft:5, paddingRight:5,
      borderRadius:5
    },
})
