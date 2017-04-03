import React, {Component} from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Dimensions
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Spinner from 'react-native-loading-spinner-overlay';
import dateFormat from 'dateformat';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var listnull = [];
export default class Public extends Component{
  constructor(props){
    super(props);
    this.state = ({
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2) => r1!=r2}),
      dataSource_cmt: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      refreshing: false,
      modalVisible: false,
      sendColor: '#90949c',
      user: this.props.user,
      spinnerVisible: false,
    });
    flag = true;

    check = 0;
  }
  componentWillUnmount() {
    flag = false;
  }
  componentWillMount(){
    this.setState({
        spinnerVisible: true,
      });
    this.fetchData();
  }
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      // prepend 10 items
      this.setState({
        refreshing: false,

      });
      this.fetchData();
    }, 1000);
  }

  setModalVisible() {
    if(this.state.modalVisible){
      this.setState({modalVisible: false});
    }else{
      this.setState({modalVisible: true});
    }
  }
  componentWillReceiveProps(){
    this.fetchData();
  }

  async fetchData() {
    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);

    try {
      let response = await fetch('http://suta.esy.es/api/getstatus_public.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var responseJson = JSON.parse(res);
      this.setState({
        data: responseJson.result,
        dataSource: this.state.dataSource.cloneWithRows(responseJson.result),
        spinnerVisible: false,
      });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }

  }

  onClose(){
    this.fetchData();
    this.setModalVisible();
  }

  onClickComment(data)
  {

    this.setState({
      spinnerVisible: true,
      data: data,
      dataSource_cmt: this.state.dataSource_cmt.cloneWithRows(listnull)
    });
   this.getComment(data);
   this.setModalVisible();
  }
  async getInfoUser(data){
    let formdata = new FormData();
    formdata.append('id_user_login',this.state.user.id_user);
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
          data: jsonResponse.result['0'],
        });

      }
      else {
        return;
      }
    } catch (error) {
     console.log(error);
    }
  }

  async onLike(data){

    let formdata = new FormData();
    formdata.append('id_user',this.state.user.id_user);
    formdata.append('id_status',data.id_status);

    try {
      let response = await fetch('http://suta.esy.es/api/checklike.php',{
        method: 'post',
        header: {
          'Content-Type': 'multipart/formdata'
        },
        body: formdata
      });

      let res = await response.text();
      if (flag == true){
      var jsonResponse = JSON.parse(res);
        if(this.state.modalVisible)
        {
          this.getInfoUser(data);
        }else {
          this.fetchData();
        }

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
      formdata.append("id_user", this.state.user.id_user);
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
        if(flag == true){
        var jsonResponse = JSON.parse(res);
        this.setState({
          dataSource_cmt: jsonResponse['result']!=null?this.state.dataSource_cmt.cloneWithRows(jsonResponse['result']):this.state.dataSource_cmt.cloneWithRows(listnull)
        });

        }
        else {
          return;
        }



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
        spinnerVisible: false,
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
    return(
      <View style={{borderTopWidth:0.5,borderTopColor:'rgba(143, 143, 143, 0.2)'}}>
        <View style={{flexDirection:'row',padding:10}}>
          <View style={styles.backgroundAvatar} >
            <Image style={styles.avatar} source={{uri: data.avatar}}/>
          </View>
          <View style={{justifyContent:'center',marginLeft:10}}>
            <Text style={styles.textbold}>
              {data.username}
            </Text>
            <Text style={styles.textnormal}>
             {data.content}
            </Text>
            <Text style={styles.textgray}>
              {data.time}
            </Text>
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
      <View style={styles.backgroundAvatar} >
        <Image style={styles.avatar} source={{uri: data.avatar}}/>
      </View>
      <View style={{justifyContent:'center',marginLeft:10}}>
        <Text style={styles.textbold}>
          {data.username}
        </Text>
        <Text style={styles.textgray}>
          {data.time}
        </Text>
      </View>
    </View>
      <Text style={{paddingTop:10,paddingBottom:10,fontSize:13,color:'#1d2129'}}>
       {data.content}
      </Text>
      <View style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center'}}>
        <View style={{flex:3,flexDirection:'row'}}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.onLike(data)}>
          {
            data.checklike!='0'?
            <Icon name='md-heart' color="rgb(254, 6, 6)" size={20} />
            :
            <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
          }
          <Text style={[styles.textgray,{marginLeft:5}]}>
             {
               data.like!='0'?
               data.like + " Thích"
               :
               "Thích"
             }
          </Text>

          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.onClickComment(data)} style={{flexDirection:'row',marginLeft:20}}>
            <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
            <Text style={[styles.textgray,{marginLeft:5}]}>
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
            <YourComponent/>
          </View>
        </View>

        </View>
    </View>
    )
  }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
      <Spinner visible={this.state.spinnerVisible} textContent={"Vui lòng chờ..."} textStyle={{color: '#FFF'}} />
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
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

        <View style={{flex:1,backgroundColor:'white'}} >

        <View style={styles.toolbar}>
          <TouchableOpacity activeOpacity={1} onPress={()=>this.onClose()} style={{flex:1,alignItems:'center'}}>
            <Icon name="md-close" size={24} color="#F5F5F5" style={styles.ico}/>
          </TouchableOpacity>
          <View style={{flex:8,marginLeft:-20,alignItems:'center'}}>
            <Text style={styles.title}>
              BÌNH LUẬN
            </Text>
          </View>

        </View>
            <View style={{ flex:1}}>
            {
              this.state.data!=null?
              <View style={{ flex:1}}>
              <View style={{flexDirection:'row',padding:10}}>
                <View style={styles.backgroundAvatar} >
                  <Image style={styles.avatar} source={{uri: this.state.data.avatar}}/>
                </View>
                <View style={{justifyContent:'center',marginLeft:10}}>
                  <Text style={styles.textbold}>
                    {this.state.data.username}
                  </Text>
                  <Text style={styles.textgray}>
                    {this.state.data.time}
                  </Text>
                </View>
              </View>
                <Text style={{padding:10,fontSize:13,color:'#1d2129'}}>
                 {this.state.data.content}
                </Text>
                <View style={{flexDirection:'row',padding:10}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.onLike(this.state.data)}>
                {
                  this.state.data.checklike!='0'?
                  <Icon name='md-heart' color="rgb(254, 6, 6)" size={20} />
                  :
                  <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
                }
                <Text style={[styles.textgray,{marginLeft:5}]}>
                   {
                     this.state.data.like!='0'?
                     this.state.data.like + " Thích"
                     :
                     "Thích"
                   }
                </Text>

                </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}>
                    <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
                    <Text style={[styles.textgray,{marginLeft:5}]}>
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

          <View style={styles.bottomInput}>
            <TextInput
            underlineColorAndroid='transparent'
            style={styles.input}
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



class YourComponent extends React.Component{
  render(){
    return(
      <MenuContext>
      <Menu>
      <MenuTrigger>
        <TouchableOpacity>
          <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft:deviceWidth/6}}/>
        </TouchableOpacity>
      </MenuTrigger>

      <MenuOptions>
        <MenuOption >
        <Text>logout</Text>
        </MenuOption>

        <MenuOption>
        <Text>logout</Text>
        </MenuOption>

      </MenuOptions>
  </Menu>
  </MenuContext>
    )
  }
}

const styles = StyleSheet.create({
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
      paddingLeft: 15
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
