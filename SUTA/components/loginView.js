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
  Keyboard,
  Modal
}from 'react-native';
import TextField from 'react-native-md-textinput';
import Hr from 'react-native-hr';
import SplashScreen from './splashScreen.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';
import FBSDK, {LoginManager} from 'react-native-fbsdk'
const {
  LoginButton,
  AccessToken
} = FBSDK;
var datafb = '';
class loginView extends Component{
  constructor(props){
    super(props);
    this.state=({
      warning_user: '',
      warning_pass: '',
      username:'',
      password:'',
      modalVisible: false,
      checkBox:require('../images/box.png')
    });
    console.disableYellowBox = true;
  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }

  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
      }
    })
  }
  check_box(){
    Alert.alert(
   'Thông báo',
   'Đăng nhập bằng Facebook đồng nghĩa với việc bạn đồng ý với các điều khoản của ứng dụng, bạn có đồng ý không?',
   [
     {text: 'Không', onPress: () => console.log('no')},
     {text: 'Có', onPress: () => {this._fbAuth();}}
   ],
   { cancelable: false }
  );

  }
  componentWillMount(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value !=null)
      {
        this.setState({user:value});
        this.redirect('home',value);
      }

    }).done();
  }
  async _fbAuth(){
     let that = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(function(result) {
      if(result.isCancelled){
        console.log('Login was cancelled');
      }else {
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            // console.log(data.accessToken.toString());
            fetch('https://graph.facebook.com/v2.8/me?fields=id,name,gender,birthday,email,link,locale,picture,cover&access_token=' + data.accessToken.toString())
            .then((response) => response.json())
            .then((json) => that.loginFB(json))
            .catch(() => {
              console.log('ERROR GETTING DATA FROM FACEBOOK');
            })
          }
        )

      }
    },function(error) {
      console.log('An error occured' + error);
    })
  }

  async loginFB(json){
    let formdata = new FormData();
    formdata.append("id", json.id);
    formdata.append("name", json.name);
    formdata.append("email", json.email);
    formdata.append("gender", json.gender);
    formdata.append("dob", json.birthday);
    formdata.append("avatar", json.picture.data.url);
    formdata.append("background", json.cover.source);

    try {
      let response = await fetch('http://suta.esy.es/api/login_fb.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.redirect('home',JSON.stringify(jsonResponse['result']));
      AsyncStorage.setItem("user",JSON.stringify(jsonResponse['result']));
    }
    catch(error)
    {
     console.log(error);
    }
  }
  async onLoginPressed(){

    Keyboard.dismiss();
    let formdata = new FormData();
    formdata.append("username", this.state.username);
    formdata.append("password", this.state.password);
    try {
      let response = await fetch('http://suta.esy.es/api/login.php', {
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata

      });
      let res = await response.text(); //tra lai json
       var jsonResponse = JSON.parse(res);
      this.setState({
        code: jsonResponse['code'],
        message: jsonResponse['message'],
        result: jsonResponse['result'],
        id: jsonResponse['result'].id_user
      });

      if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {
          //Handle success
          //On success we will store the access_token in the AsyncStorage
          this.redirect('home',JSON.stringify(jsonResponse['result']));
          AsyncStorage.setItem("user",JSON.stringify(jsonResponse['result']));

      }else {
          alert('Đăng nhập không thành công!');
      }
    } catch(error) {
        //console.log("error " + error);
      alert('Đăng nhập không thành công!');

    }
  }
  test(){
    alert(this.state.username +"-"+ this.state.password);
  }

  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
     }

  _cancle(){
    this.setModalVisible();
  }

  _next(){
    if(this.state.checkBox == require('../images/ico_tick.png')){
      this.setModalVisible();
      this._fbAuth();
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
      <SplashScreen duration={3000} backgroundColor={'blue'}>


      <Image source={require('../images/bgr2.png')} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
        <View style={styles.logo}>
          <Image
            style={{width: 145, height: 86}}
            source={require('../images/logo3.png')}
            />
        </View>
        <View style={styles.contentLogin}>
        <View>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
            </View>
            <View style={{flex:6,marginLeft:5}}>
              <TextField
              labelColor={'#F5F5F5'}
              label={'Tên tài khoản'}
              textColor={'#F5F5F5'}
              autoCapitalize="none"
              autoCorrect={false}
              highlightColor={'#BDBDBD'}
              returnKeyType="next"
              onChangeText={(text) => {
                this.state.username = text;
              }}
              onSubmitEditing={()=>this.passwordInput.focus()}
              dense={true}/>
            </View>
          </View>

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
            </View>
            <View style={{flex:6, marginLeft:5}}>
            <TextField
            label={'Mật khẩu'}
            labelColor={'#F5F5F5'}
            textColor={'#F5F5F5'}
            autoCapitalize="none"
            autoCorrect={false}
            highlightColor={'#BDBDBD'}
            onChangeText={(text) => {
            this.state.password = text;
          }}
          dense={true}
            ref={(input)=>this.passwordInput = input}
            secureTextEntry= {true}/>
            </View>
          </View>

        </View>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.onLoginPressed()} style={styles.button}>
              <Text style={{color:'#F5F5F5'}}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>

          <View style={{padding:15}}>
            <Hr lineColor='#BDBDBD' text='OR' textColor='#F5F5F5'/>
          </View>

          <TouchableOpacity onPress={()=>this.check_box()}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Icon name="logo-facebook" size={22} color="#F5F5F5" style={{marginTop:-1}} />
                <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
                  Đăng nhập bằng Facebook
                </Text>
            </View>
          </TouchableOpacity>


        </View>


        </KeyboardAvoidingView>
        <View style={{alignItems:'center'}}>
        <TouchableOpacity>
          <View style={{justifyContent:'center', alignItems:'center', paddingTop: 20}}>
              <Text style={{color:'#F5F5F5', paddingLeft:5,paddingBottom:10}} >
                Quên mật khẩu?
              </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigate.bind(this,'register')}>
          <View style={{flexDirection:'row',
            justifyContent:'center',
            width: deviceWidth,
        }}>
            <Text style={{color:'#F5F5F5'}}>
                  Bạn chưa có tài khoản?
            </Text>
            <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
              Đăng ký.
            </Text>
          </View>

          </TouchableOpacity>
        </View>
        <Modal
          onRequestClose={()=>this.setModalVisible()}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>

          <View style={{flex: 1,padding:20}}>
          <ScrollView style={{flex:1, backgroundColor:'white'}}>

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
          </View>

        </Modal>

      </Image>

      </SplashScreen>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:10,
    width:deviceWidth
  },
  logo:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  contentLogin:{
    flex:2,
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
