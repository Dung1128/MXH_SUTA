'use strict'
import React, {Component} from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage,
  KeyboardAvoidingView,
  Modal
}from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TextField from 'react-native-md-textinput';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class loginView extends Component{
  constructor(props){
    super(props);
    this.state=({
      warning_user: '',
      warning_phone:'',
      warning_pass: '',
      warning_repass: '',
      modalVisible: false,
      checkBox:require('../images/box.png')
    });
    console.disableYellowBox = true;
  }
  onBack(routeName,data){
    this.props.navigator.pop({
      name: routeName,
      passProps: {
      }
    })
  }
  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
     }

  redirect(routeName,data){
    this.props.navigator.replace({
      name: routeName,
      passProps: {
        data:data
      }
    })
  }

  async checkvalue(value){
    let formdata = new FormData();
    formdata.append("username", this.state.username);
    formdata.append("phone", this.state.phone);
    formdata.append("value", value);
    try {
      let response = await fetch('http://suta.esy.es/api/checkvalue.php',{
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

      });


      if (response.status >= 200
        && response.status < 300
        && jsonResponse['code']==0) {
          // show alert & moving screen
          //alert(this.state.message);
          if(value=='username')
          {
            if(this.state.username!=null){
              this.setState({warning_user: this.state.message});
            }else {
              this.setState({warning_user: "Bạn cần nhập tài khoản"});
            }

          } if(value=='phone'){
            if(this.state.username!=null){
              this.setState({warning_phone: this.state.message});
            }else {
              this.setState({warning_phone: "Bạn cần nhập số điện thoại"});
            }
          }

        //  console.log(this.state.message);
      } else {
          //Handle error

            if(value=='username')
            {
              if(this.state.username!=null){
                this.setState({warning_user: this.state.message});
              }else {
                this.setState({warning_user: "Bạn cần nhập tài khoản"});
              }

            } if(value=='phone'){
              if(this.state.username!=null){
                this.setState({warning_phone: this.state.message});
              }else {
                this.setState({warning_phone: "Bạn cần nhập số điện thoại"});
              }
            }


          let error = res;
          throw error;
      }
    }
    catch(error)
    {
      //console.log(error);
    }
  }
  checkpass(value){
    var password = this.state.password;
    if(value == 'password')
    {
      if(password!=null){
        if(password.length < 6)
        {
          this.setState({warning_pass: 'Mật khẩu cần lớn hơn 6 ký tự'});
        }else {
          this.setState({warning_pass: ''});
        }
      }else {
        this.setState({warning_pass: 'Bạn cần nhập mật khẩu'});
      }

    }else {
      if(this.state.repassword != this.state.password)
      {
        this.setState({warning_repass: 'Bạn cần nhập lại đúng mật khẩu'});
      }else {
        this.setState({warning_repass: ''});
      }
    }

  }
  async onRegisterPressed(){

    if(this.state.warning_user=='' && this.state.warning_phone==''
      && this.state.warning_pass=='' && this.state.warning_repass==''
      && this.state.username != '' && this.state.password != ''
      && this.state.phone != ''  )
    {
      this.setModalVisible();
      if(this.state.checkBox == require('../images/ico_tick.png'))
      {
        let formdata = new FormData();
        formdata.append("username", this.state.username);
        formdata.append("password", this.state.password);
        formdata.append("phone", this.state.phone);
        try {
          let response = await fetch('http://suta.esy.es/api/register.php',{
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
          // alert(this.state.message);
          if (this.state.code==0) {
              // show alert & moving screen

              this.redirect('login','OK');
          } else {
              //Handle error
              Alert.alert('Thông báo',this.state.message);
              let error = res;
              throw error;
          }
        }
        catch(error)
        {
        //  console.log(error);
        }
      }



    }else {
      Alert.alert('Thông báo',"Bạn cần điền đúng thông tin.!");
    }
  }
  componentWillMount(){

  }

  _cancle(){
    this.setModalVisible();
    this.onBack('login');
  }

  _next(){
    if(this.state.checkBox == require('../images/ico_tick.png')){
      this.setModalVisible();
    }
  }

  checkOk(){
    if(this.state.checkBox == require('../images/box.png')){
      this.setState({ checkBox: require('../images/ico_tick.png')})
    }
    else{
      this.setState({ checkBox: require('../images/box.png')})
    }
  }

  render(){
    return(
      <Image source={require('../images/bgr2.png')} style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.back} onPress={this.onBack.bind(this)} >
          <Icon name="md-arrow-back" size={34} color="#F5F5F5"/>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
      <View style={styles.logo}>
        <Image
          style={{width: 145, height: 86}}
          source={require('../images/logo3.png')}
          />
      </View>

        <View style={styles.contentLogin}>
          <View style={{flex:5, flexDirection:'column'}}>
            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
                <TextField
                labelColor={'#F5F5F5'}
                label={'Tên tài khoản'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.username = text;
                }}
                onSubmitEditing={()=>this.phoneInput.focus()}
                dense={true}/>


                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_user}
                </Text>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-call" size={24} color="#F5F5F5" style={{marginTop:35}}/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
                <TextField
                labelColor={'#F5F5F5'}
                label={'Số Điện Thoại'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                keyboardType="phone-pad"
                onChangeText={(text) => {
                  this.state.phone = text;
                }}


                ref={(input)=>this.phoneInput = input}
                onSubmitEditing={()=>this.passwordInput.focus()}
                dense={true}/>


              <Text style={{color:'#F5F5F5', fontSize:10}}>
                {this.state.warning_phone}
              </Text>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>

                <TextField
                secureTextEntry
                labelColor={'#F5F5F5'}
                label={'Mật Khẩu'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.password = text;
                }}
                ref={(input)=>this.passwordInput = input}
                onSubmitEditing={()=>this.repasswordInput.focus()}
                dense={true}/>

                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_pass}
                </Text>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>

                <TextField
                secureTextEntry
                labelColor={'#F5F5F5'}
                label={'Nhập Lại Mật Khẩu'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.repassword = text;
                }}
                ref={(input)=>this.repasswordInput = input}
                dense={true}/>


                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_repass}
                </Text>
              </View>

            </View>

          </View>



        </View>
        </KeyboardAvoidingView>
        <View style={{flex:0.3,alignItems:'center'}}>
          <TouchableOpacity onPress={()=>this.onRegisterPressed()} style={styles.button}>
            <Text style={{color:'#F5F5F5'}}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>
        <Modal
          onRequestClose={()=>this.setModalVisible()}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <TouchableOpacity activeOpacity={1}

                style={{backgroundColor: 'rgba(0,0,0,.8)',
                flex:1,justifyContent:'center',
                alignItems:'center',
                width: deviceWidth,
                height: deviceHeight}} >
            <TouchableOpacity activeOpacity={1} style={{
              width:300,
              height: deviceHeight - 200,
              backgroundColor:'white',
            }}>
            <ScrollView>

            <View style={{padding: 10}}>
              <View style={{alignItems:'center'}}>
                <Text style ={{ fontWeight: 'bold'}}> ĐIỀU KHOẢN MẠNG XÃ HỘI SUTA
                </Text>
              </View>
              <View style={{marginTop: 10}}>

                <Text>Vui lòng đọc kĩ điều khoản trước khi tiến hành tải, cài đặt và sử dụng mạng xã hội tâm sự SUTA.
                Bạn chấp thuận và đồng ý bị ràng buộc bởi các quy định và điều kiện trong Điều khoản này khi thực hiện các thao tác trên đây.
                Trường hợp bạn không đồng ý với bất kỳ điều khoản sử dụng nào của Ứng dụng (phiên bản này và các phiên bản cập nhật),
                bạn vui lòng không tải, cài đặt, sử dụng Ứng dụng hoặc tháo gỡ Ứng Dụng ra khỏi thiết bị di động của bạn.
                </Text>
                <Text>1.Cập nhật
                </Text>
                <Text>Điều khoản này có thể được cập nhật thường xuyên bởi chúng tôi.
                Phiên bản cập nhật sẽ thay thế cho các quy định và điều kiện trong Điều khoản ban đầu.
                Bạn có thể truy cập vào Ứng Dụng để xem nội dung chi tiết của phiên bản cập nhật.
                </Text>
                <Text>2.Giới Thiệu Về Ứng Dụng
                </Text>
                <Text>Mạng xã hội tâm sự SUTA là ứng dụng mạng xã hội giành riêng cho thị trường Việt Nam
                Mọi người sử dụng ứng dụng có thể kết bạn, nhắn tin hay cập nhật các cảm xúc, cảm nghĩ của mình.
                </Text>
                <Text>3.Quyền sở hữu ứng dụng
                </Text>
                <Text>
                Ứng dụng mạng xã hội tâm sự SUTA được phát triển bởi chúng tôi, tất cả các quyền sở hữu trí tuệ liên quan đến Ứng Dụng
                và các tài liệu hướng dẫn liên quan sẽ thuộc quyền sở hữu duy nhất bởi chúng tôi và không cá nhân,
                tổ chức nào được phép sao chép, tái tạo, phân phối, hoặc hình thức khác xâm phạm tới quyền của chủ sở hữu nếu không có sự đồng ý
                và cho phép bằng văn bản của chúng tôi.
                </Text>
                <Text>4.Tài khoản
                </Text>
                <Text>Để sử dụng Ứng Dụng bạn phải tạo một tài khoản theo yêu cầu của Ứng dụng,
                bạn cam kết rằng việc sử dụng tài khoản phải tuân thủ các quy định của Ứng dụng,
                đồng thời tất cả các thông tin bạn cung cấp cho Ứng dụng là đúng,
                chính xác, đầy đủ với tại thời điểm được yêu cầu. Mọi quyền lợi và nghĩa vụ của bạn
                sẽ căn cứ trên thông tin tài khoản bạn đã đăng ký, do đó nếu có bất kỳ thông tin sai lệch nào
                chúng tôi sẽ không chịu trách nhiệm trong trường hợp thông tin đó làm ảnh hưởng hoặc hạn chế quyền lợi của bạn.
                </Text>
                <Text>5.Xử lý vi phạm
                </Text>
                <Text>Trường hợp bạn vi phạm bất kỳ quy định nào trong Điều khoản này,
                chúng tôi có quyền ngay lập tức khóa tài khoản của bạn và/hoặc xóa bỏ toàn bộ các thông tin,
                nội dung vi phạm, đồng thời tùy thuộc vào tính chất,
                mức độ vi phạm bạn sẽ phải chịu trách nhiệm trước cơ quan có thẩm quyền,
                chúng tôi và bên thứ ba về mọi thiệt hại gây ra bởi hoặc xuất phát từ hành vi vi phạm của bạn.
                </Text>
                <Text>6.Quyền truy cập thông tin
                </Text>
                <Text>Khi sử dụng Ứng Dụng, bạn thừa nhận rằng chúng tôi có quyền sử dụng những API hệ thống sau để truy cập vào dữ liệu trên điện thoại của bạn.
                Chúng tôi cam kết không sử dụng bất kỳ biện pháp nào để theo dõi nội dung tin nhắn, trao đổi hoặc hình thức khác nhằm theo dõi người dùng khi sử dụng Ứng Dụng này.
                </Text>
                <Text>7.Cam Kết Bảo Mật Thông Tin
                </Text>
                <Text>Chúng tôi sử dụng các phương thức truyền tin an toàn https và mã hóa để truyền tải và lưu trữ các dữ liệu cá nhân
                 và giao tiếp của bạn. Chúng tôi cam kết giữ bí mật tất cả thông tin mà bạn cung cấp cho Ứng dụng hoặc thông tin thu thập từ bạn và không tiết lộ với bất kỳ bên thứ ba nào trừ khi có yêu cầu từ Cơ quan Nhà nước có thẩm quyền.
                </Text>
                <Text>9.Phí và các khoản thu
                </Text>
                <Text>Chúng tôi cam kết không thu bất cứ khoản phí nào từ người dùng cho các dịch vụ cơ bản mà hiện tại ứng dụng đang cung cấp.
                </Text>

              </View>


                <TouchableOpacity style={{marginTop: 10, flexDirection:'row'}} onPress={()=>this.checkOk()} >
                  <Image
                    style={{width: 15, height: 15, marginTop: 2}}
                    source={this.state.checkBox}
                    />
                  <Text style={{paddingLeft: 5}}>Tôi đồng ý
                  </Text>
                </TouchableOpacity>

              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=> this._cancle()}>
                  <Text style={{fontWeight: 'bold'}}> HỦY
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{paddingLeft: 20}} onPress={()=> this._next()}>
                  <Text style={{color:'#8e44ad', fontWeight: 'bold'}}> TIẾP TỤC
                  </Text>
                </TouchableOpacity>
              </View>


            </View>
            </ScrollView>

            </TouchableOpacity>


          </TouchableOpacity>
        </Modal>

      </Image>



    );
  }

}
// loginView.propType = {
//   data: React.PropTypes.arrayOf(React.PropTypes.object)
// }
const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:10,
    width:deviceWidth
  },
  logo:{
    flex:2,
    alignItems:'center',
    justifyContent:'center'
  },
  contentLogin:{
    flex:5,
  },
  button: {
      marginTop:10,
      width:deviceWidth/2,
      borderColor: '#F5F5F5',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:20,
      borderWidth:1
    },
  input: {
    height:40,
    backgroundColor:'rgba(255,255,255,0.2)',
    color:'#FFF',
    paddingHorizontal:10,
    marginTop:25,
  }
});
module.exports = loginView;
