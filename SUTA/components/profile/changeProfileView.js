import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Image,
  TextInput
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Iconn from 'react-native-vector-icons/Ionicons';
import MyStatusBar from '../statusbar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Hr from 'react-native-hr';
export default class changeProfileView extends Component{
  constructor(props){
    super(props);
    this.state={
      user: this.props.data,
      phone: this.props.data.phone,
      email: this.props.data.email,
      address: this.props.data.address,
      gender: this.props.data.gender,
      dob: this.props.data.dob,
    }
  }

  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
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
    if(this.state.gender == 0){
      this.setState({
        checkBoxNam: require('../images/ico_tick.png'),
        checkBoxNu: require('../images/box.png')
      })
    }
    else {
      this.setState({
        checkBoxNu: require('../images/ico_tick.png'),
        checkBoxNam: require('../images/box.png')
      })
    }
  }
  _changegender(val){
    if(val == 0){
      this.setState({
        checkBoxNam: require('../images/ico_tick.png'),
        checkBoxNu: require('../images/box.png')
      })
    }
    else {
      this.setState({
        checkBoxNu: require('../images/ico_tick.png'),
        checkBoxNam: require('../images/box.png')
      })
    }
  }


  async _changeprofile(){
    let formdata = new FormData();
    formdata.append("id_user", this.state.user.id_user);
    formdata.append("phone", this.state.phone);
    formdata.append("email", this.state.email);
    formdata.append("address", this.state.address);
    formdata.append("dob", this.state.dob);
    if(this.state.checkBoxNam == require('../images/box.png')){
      formdata.append("gender", 1);
    }
    else{
      formdata.append("gender", 0);
    }

    fetch('http://suta.esy.es/api/updateprofile.php',{
      method: 'post',
      header: {
        'Content-Type': 'multipart/formdata'
      },
      body: formdata
    })
    .then((response)=>{response.json();})
    .then((responseJson)=>{
      // if (flag == true){
      //   this.setState({
      //     data: responseJson.result,
      //   });
      //
      // }
      // else {
      //   return;
      // }
      alert('Đổi thông tin thành công, thông tin của bạn sẽ được cập nhật sau.');

    })
    .catch(error=>{
      console.log(error);
    });
  }

  render(){
    return(

      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18,
            fontWeight:'bold',
            paddingLeft:15,
            paddingTop:3,
            color:'#fff'}}> Chỉnh sửa thông tin
          </Text>
        </View>

        <View style={styles._content}>
          <View style={{padding:10, flexDirection:'row', flex: 1}}>
            <View style={{flex: 1.3, alignItems:'center'}}>
              <Image style={{width:80, height:80,borderRadius:200}} source={{uri: this.state.user.avatar}}/>
            </View>

            <View style={{flex:2.5, paddingLeft: 10}}>
              <View style={styles._inputProfile}>
                <TextInput style={styles._input} value = {this.state.email.toString()}
                onChangeText={(val) => this.setState({email: val})}
                underlineColorAndroid='transparent'
                placeholder="Email"
                />
              </View>

              <View style={styles._inputProfile}>
                <TextInput style={styles._input} value = {this.state.phone.toString()}
                onChangeText={(val) => this.setState({phone: val})}
                keyboardType="phone-pad"
                underlineColorAndroid='transparent'
                placeholder="Điện thoại"
                />
              </View>

              <View style={styles._inputProfile}>
                <TextInput style={styles._input} value = {this.state.address.toString()}
                onChangeText={(val) => this.setState({address: val})}
                underlineColorAndroid='transparent'
                placeholder="Địa chỉ"
                />
              </View>

              <View style={styles._inputProfile}>
              <DatePicker
                style={{width: 200,marginLeft: -60 }}
                date={this.state.dob}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon= {false}
                customStyles={{
                  dateInput: { borderWidth:0}
            }}
            onDateChange={(date) => {this.setState({dob: date})}}
          />
              </View>

              <View style={styles._inputProfile}>
                <View style={{flexDirection:'row', height: 40, alignItems:'center', padding: 10}}>

                  <View style={{flex:1, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>this._changegender(0)}>
                      <Image
                        style={{width: 15, height: 15, marginTop: 2, marginRight: 10}}
                        source={this.state.checkBoxNam}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this._changegender(0)}>
                      <Text>Nam
                      </Text>
                    </TouchableOpacity>

                  </View>

                  <View style={{flex:1, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>this._changegender(1)}>
                      <Image
                        style={{width: 15, height: 15, marginTop: 2, marginRight: 10}}
                        source={this.state.checkBoxNu}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this._changegender(1)}>
                      <Text>Nữ
                      </Text>
                    </TouchableOpacity>

                  </View>

                </View>
              </View>

            </View>


          </View>
        </View>
        <View style={styles._footer}>
          <View style={{justifyContent:'center', paddingTop:20, alignItems:'center'}}>
            <TouchableOpacity style={styles._button} onPress={()=>this._changeprofile()}>
              <Text style={{color:'white'}}> CẬP NHẬT
              </Text>
            </TouchableOpacity>
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
    flex:6,
    backgroundColor:'rgb(255, 255, 255)'
  },
  _input:{
    height: 40,
    width: null
  },
  _inputProfile:{
    borderBottomWidth: 1,
    borderBottomColor:'#F5F5F5'
  },
  _footer:{
    backgroundColor:'#F5F5F5',
    flex: 10
  },
  _button:{
    backgroundColor:'#8e44ad',
    width:deviceWidth/2,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20
  }
})
