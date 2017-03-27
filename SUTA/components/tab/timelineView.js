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
  TextInput
} from 'react-native';
import dateFormat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var flag = true;
var listnull = [];

export default class timeLineView extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSource_cmt: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      user: '',
      id: this.props.id,
      modalVisible: false
    }
    flag = true;
    console.disableYellowBox = true;
  }

  componentWillMount(){
    this.getData(this.props.id);
  }

  componentDidMount(){

  }

  componentWillUnmount() {
    flag = false;
  }

  async getData(id){
    let formdata = new FormData();
    formdata.append('id_user',id);
    try {
      let response = await fetch('http://suta.esy.es/api/getstatus_id.php',{
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
        dataSource: this.state.dataSource.cloneWithRows(jsonResponse['result'])
      });
    }
    else {
      return;
    }
    } catch (error) {
      console.log(error);
    }
  }
  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }
  _onClose(){
    this.setState({
      checkclose:true
    });
    this.setModalVisible(!this.state.modalVisible)
  }
  onClickComment(data)
  {

    this.setState({
      checkclose:false,
      data: data,
      dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(listnull),
    });
   this.getInfoUser(data);
   this.getComment(data);
   this.setModalVisible();
  }
  async getInfoUser(data){
    let formdata = new FormData();
    formdata.append('id_user',data.id_user);
    formdata.append('id_status',data.id_status);

    try {
      let response = await fetch('http://suta.esy.es/api/getuserstatus_id.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
      this.setState({
        // fr_code: jsonResponse['code'],
        // fr_message: jsonResponse['message'],
        fr_result: jsonResponse['result'],
      });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }
  }
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
    this.setState({
      sendColor: '#90949c',
    })
  }
  async _addComment(value){
    if(this.state.sendColor!= '#90949c')
    {
      this.clearText('contentComment')
      let formdata = new FormData();
      formdata.append("id_user", '1489243825');
      formdata.append("content", this.state.contentComment);
      formdata.append("id_status", value.id_status);
      try {
        let response = await fetch('http://suta.esy.es/api/addcomment.php',{
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
           result: jsonResponse['result'],
           dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(jsonResponse['result'])
        });


      }
      catch(error)
      {
       console.log(error);
      }
    }
  }
  // Get data to list Comment
  async getComment(value){
    let formdata = new FormData();
    formdata.append('id_status',value.id_status);
    try {
      let response = await fetch('http://suta.esy.es/api/getcmtstatus_id.php',{
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
        dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(jsonResponse['result'])
      });
      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }
  }
  _renderRow_cmt(data){
    return (
      <View style={{borderTopWidth:0.5,borderTopColor:'rgba(143, 143, 143, 0.2)'}}>
      <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flexDirection:'row',padding:10}}>
            <View style={Style.backgroundAvatar} >
              <Image style={Style.avatar} source={{uri: data.avatar}}/>
            </View>
            <View style={{justifyContent:'center',marginLeft:10}}>
              <Text style={Style.textbold}>
                {data.username}
              </Text>
              <Text style={Style.textnormal}>
               {data.content}
              </Text>
              <Text style={Style.textgray}>
                {data.time}
              </Text>
            </View>
          </View>
      </View>
    </View>
    )
  }
  _renderRow(data){
    return(
      <View style={{flex:1,
        marginLeft:5,
        marginRight: 5,
        marginTop: 5,
        borderTopWidth:0.5,
        borderTopColor:'rgba(143, 143, 143, 0.2)',
        backgroundColor:'#fff',
        borderRadius: 5
      }}>
      <View style={{padding: 10}}>

      <View style={{flex:1,flexDirection:'row'}}>
        <View style={Style.backgroundAvatar} >
          <Image style={Style.avatar} source={{uri: data.avatar}}/>
        </View>
        <View style={{justifyContent:'center',marginLeft:10}}>
          <Text style={Style.textbold}>
            {data.username}
          </Text>
          <Text style={Style.textgray}>
            {data.time}
          </Text>
        </View>
      </View>
        <Text style={{paddingTop:10,paddingBottom:10,fontSize:13,color:'#1d2129'}}>
         {data.content}
        </Text>
        <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center'}}>
          <View style={{flex:3,flexDirection:'row'}}>
            <TouchableOpacity style={{flexDirection:'row'}}>
              <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
              <Text style={[Style.textgray,{marginLeft:5}]}>
                 {
                   data.likes!=null?
                   data.likes + "Thích"
                   :
                   "Thích"
                 }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.onClickComment(data)} style={{flexDirection:'row',marginLeft:20}}>
              <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
              <Text style={[Style.textgray,{marginLeft:5}]}>
              {
                data.comment!=null?
                data.comment + "Bình Luận"
                :
                "Bình Luận"
              }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}>
            <TouchableOpacity>
              <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </View>
    )
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:'#F5F5F5'}}>
      <Text>{this.state.user.username}
      </Text>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        enableEmptySections
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={()=>{alert("Modal has been closed.")}}
        >

        <View style={{flex:1,backgroundColor:'white'}} >

        <View style={Style.toolbar}>
          <TouchableOpacity activeOpacity={1} onPress={()=>this._onClose()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={Style.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={Style.title}>
              BÌNH LUẬN
            </Text>
          </View>

        </View>
            <View style={{ flex:1}}>
            {
              this.state.data!=null?
              <View style={{ flex:1}}>
              <View style={{flexDirection:'row',padding:10}}>
                <View style={Style.backgroundAvatar} >
                  <Image style={Style.avatar} source={{uri: this.state.data.avatar}}/>
                </View>
                <View style={{justifyContent:'center',marginLeft:10}}>
                  <Text style={Style.textbold}>
                    {this.state.data.username}
                  </Text>
                  <Text style={Style.textgray}>
                    {this.state.data.time}
                  </Text>
                </View>
              </View>
                <Text style={{padding:10,fontSize:13,color:'#1d2129'}}>
                 {this.state.data.content}
                </Text>
                <View style={{flexDirection:'row',padding:10}}>
                  <TouchableOpacity style={{flexDirection:'row'}}>
                    <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
                    <Text style={[Style.textgray,{marginLeft:5}]}>
                       {
                         this.state.data.likes!=null?
                         this.state.data.likes + "Thích"
                         :
                         "Thích"
                       }
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}>
                    <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
                    <Text style={[Style.textgray,{marginLeft:5}]}>
                    {
                      this.state.data.comment!=null?
                      this.state.data.comment + "Bình Luận"
                      :
                      "Bình Luận"
                    }
                    </Text>
                  </TouchableOpacity>
                </View>
                <ListView
                style={{flex:1}}
                dataSource={this.state.dataSource_cmt}
                renderRow={this._renderRow_cmt.bind(this)}
                enableEmptySections
                />
                  </View>
            :
            <View></View>
            }

          </View>

          <View style={Style.bottomInput}>

            <TextInput
            style={Style.input}
            placeholder="Viết bình luận"
            onChangeText={(val) => this.setState({contentComment: val, sendColor:'#8e44ad'})}
            multiline={true}
            placeholderTextColor= '#90949c'
            autoCapitalize="none"
            autoCorrect={false}
            ref={'contentComment'}/>
            <TouchableOpacity onPress={()=>this._addComment(this.state.data)}>
              <Icon name="md-send" size={28} color={this.state.sendColor} style={{paddingLeft:10,paddingRight:10}}/>
            </TouchableOpacity>
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
  input: {
    height:40,
    flex:1,
    backgroundColor:'rgba(255,255,255,0.8)',
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
