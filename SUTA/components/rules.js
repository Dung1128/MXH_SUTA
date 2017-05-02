import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import MyStatusBar from './statusbar.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var listnull = [];
export default class Rules extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  onBack(routeName,data){
    this.props.navigator.pop({
      name: routeName,
      passProps: {
      }
    })
  }
  render() {
    return (

      <View style={{flex:1,backgroundColor:'#fff'}}>
      <MyStatusBar backgroundColor="#8e178f"/>

      <View style={styles.toolbar}>
      <TouchableOpacity onPress={()=>this.onBack()} style={{flex:1,alignItems:'center'}}>
        <Icon name="md-arrow-back" size={34} color="#F5F5F5" style={styles.ico}/>
      </TouchableOpacity>
        <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
          <Text style={styles.title}>
            ĐIỀU KHOẢN MẠNG XÃ HỘI SUTA
          </Text>
        </View>
      </View>
        <ScrollView>
        <View style={{marginTop: 10,padding:10}}>

          <Text>Vui lòng đọc kĩ điều khoản trước khi tiến hành tải, cài đặt và sử dụng mạng xã hội tâm sự SUTA.
          Bạn chấp thuận và đồng ý bị ràng buộc bởi các quy định và điều kiện trong Điều khoản này khi thực hiện các thao tác trên đây.
          Trường hợp bạn không đồng ý với bất kỳ điều khoản sử dụng nào của Ứng dụng (phiên bản này và các phiên bản cập nhật),
          bạn vui lòng không tải, cài đặt, sử dụng Ứng dụng hoặc tháo gỡ Ứng Dụng ra khỏi thiết bị di động của bạn.
          </Text>
          <Text style={styles.textbold}>1.Cập nhật
          </Text>
          <Text>Điều khoản này có thể được cập nhật thường xuyên bởi chúng tôi.
          Phiên bản cập nhật sẽ thay thế cho các quy định và điều kiện trong Điều khoản ban đầu.
          Bạn có thể truy cập vào Ứng Dụng để xem nội dung chi tiết của phiên bản cập nhật.
          </Text>
          <Text style={styles.textbold}>2.Giới Thiệu Về Ứng Dụng
          </Text>
          <Text>Mạng xã hội tâm sự SUTA là ứng dụng mạng xã hội giành riêng cho thị trường Việt Nam
          Mọi người sử dụng ứng dụng có thể kết bạn, nhắn tin hay cập nhật các cảm xúc, cảm nghĩ của mình.
          </Text>
          <Text style={styles.textbold}>3.Quyền sở hữu ứng dụng
          </Text>
          <Text>
          Ứng dụng mạng xã hội tâm sự SUTA được phát triển bởi chúng tôi, tất cả các quyền sở hữu trí tuệ liên quan đến Ứng Dụng
          và các tài liệu hướng dẫn liên quan sẽ thuộc quyền sở hữu duy nhất bởi chúng tôi và không cá nhân,
          tổ chức nào được phép sao chép, tái tạo, phân phối, hoặc hình thức khác xâm phạm tới quyền của chủ sở hữu nếu không có sự đồng ý
          và cho phép bằng văn bản của chúng tôi.
          </Text>
          <Text style={styles.textbold}>4.Tài khoản
          </Text>
          <Text>Để sử dụng Ứng Dụng bạn phải tạo một tài khoản theo yêu cầu của Ứng dụng,
          bạn cam kết rằng việc sử dụng tài khoản phải tuân thủ các quy định của Ứng dụng,
          đồng thời tất cả các thông tin bạn cung cấp cho Ứng dụng là đúng,
          chính xác, đầy đủ với tại thời điểm được yêu cầu. Mọi quyền lợi và nghĩa vụ của bạn
          sẽ căn cứ trên thông tin tài khoản bạn đã đăng ký, do đó nếu có bất kỳ thông tin sai lệch nào
          chúng tôi sẽ không chịu trách nhiệm trong trường hợp thông tin đó làm ảnh hưởng hoặc hạn chế quyền lợi của bạn.
          </Text>
          <Text style={styles.textbold}>5.Xử lý vi phạm
          </Text>
          <Text>Trường hợp bạn vi phạm bất kỳ quy định nào trong Điều khoản này,
          chúng tôi có quyền ngay lập tức khóa tài khoản của bạn và/hoặc xóa bỏ toàn bộ các thông tin,
          nội dung vi phạm, đồng thời tùy thuộc vào tính chất,
          mức độ vi phạm bạn sẽ phải chịu trách nhiệm trước cơ quan có thẩm quyền,
          chúng tôi và bên thứ ba về mọi thiệt hại gây ra bởi hoặc xuất phát từ hành vi vi phạm của bạn.
          </Text>
          <Text style={styles.textbold}>6.Quyền truy cập thông tin
          </Text>
          <Text>Khi sử dụng Ứng Dụng, bạn thừa nhận rằng chúng tôi có quyền sử dụng những API hệ thống sau để truy cập vào dữ liệu trên điện thoại của bạn.
          Chúng tôi cam kết không sử dụng bất kỳ biện pháp nào để theo dõi nội dung tin nhắn, trao đổi hoặc hình thức khác nhằm theo dõi người dùng khi sử dụng Ứng Dụng này.
          </Text>
          <Text style={styles.textbold}>7.Cam Kết Bảo Mật Thông Tin
          </Text>
          <Text>Chúng tôi sử dụng các phương thức truyền tin an toàn https và mã hóa để truyền tải và lưu trữ các dữ liệu cá nhân
           và giao tiếp của bạn. Chúng tôi cam kết giữ bí mật tất cả thông tin mà bạn cung cấp cho Ứng dụng hoặc thông tin thu thập từ bạn và không tiết lộ với bất kỳ bên thứ ba nào trừ khi có yêu cầu từ Cơ quan Nhà nước có thẩm quyền.
          </Text>
          <Text style={styles.textbold}>8.Cam Kết Người Dùng Về Nội Dung
          </Text>
          <Text>Việc sử dụng ứng dụng đồng nghĩa với việc bạn cam kết với chúng tôi về nội dung trong các dòng trạng thái: Không mang hướng chính trị, kích động, phản động..,
          không nói xấu, chửi bới, không đăng các hình ảnh trạng thái nhạy cảm làm ảnh hưởng đến danh dự nhân phẩm người khác. Mọi nội dung người dùng đều phải tự chịu trách nhiệm trước pháp luật và sẽ bị khóa tài khoản vĩnh viễn trên Mạng xã hội tâm sự SUTA.

          </Text>
          <Text style={styles.textbold}>9.Phí và các khoản thu
          </Text>
          <Text>Chúng tôi cam kết không thu bất cứ khoản phí nào từ người dùng cho các dịch vụ cơ bản mà hiện tại ứng dụng đang cung cấp.
          </Text>
          <Text style={styles.textbold}>10.Thông tin người tạo ứng dụng
          </Text>
          <Text> - Đường Minh Chiến
          </Text>
          <Text> - Nguyễn Trần Dũng
          </Text>
          <Text> Nhóm sinh viên thuộc khoa Công nghệ thông tin - Viện Đại học Mở Hà Nội (FITHOU)
          </Text>

        </View>
        </ScrollView>


      </View>

    );
  }
}
var styles = StyleSheet.create({
  backgroundAvatar:{
    overflow: 'hidden',
    borderRadius:200,
    width:30,
    height:30,
  },
  avatar:{
    width:30,
    height:30
  },
  avatar_android:{
    width:30,
    height:30,
    borderRadius:200,
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
    color:'black'
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
    fontWeight:'bold',
    marginTop:10,
    marginBottom:10
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
  },
});
