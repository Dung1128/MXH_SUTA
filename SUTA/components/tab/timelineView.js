import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ListView,
  AsyncStorage,
  Image
} from 'react-native';
import dateFormat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var flag = true;
var _data = [{
          _time : "03/05/2017",
          _content : "Dũng đẹp trai!."
        },
        {
          _time : "03/04/2017",
          _content : "Hello mọi người!."
        }];

export default class timeLineView extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      like: require('../../images/ico_like_2.png'),
      unlike: require('../../images/ico_unlike.png'),
      check: require('../../images/ico_like_2.png'),
      user: '',
      id: this.props.id
    }
    // this._getUser();
    flag = true;
    console.disableYellowBox = true;
  }

  componentWillMount(){

  }

  componentDidMount(){
    //console.log(this.state.id);
    this.getData(this.state.id);
  }

  componentWillUnmount() {
    flag = false;
  }
  _getUser(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value != null){
        this.setState({
          user:JSON.parse(value),
        //  name: this.state.user.username
        })
        // console.log(this.state.user.username);
        //console.log(this.state.user.id_user);

      }
    }).done();
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


  _renderRow(data){
    var time = dateFormat(data.time, "H:M dd/mm/yyyy ");
    return (
        <View style={{flex:1,
          marginLeft:5,
          marginRight: 5,
          marginTop: 5,
          backgroundColor:'#fff',
          borderRadius: 5
        }}>
          <View style={{paddingTop: 10, paddingLeft: 15, paddingRight: 15}} >
            <View>
              <Text style={{fontWeight:'bold'}}>
                {time}
              </Text>
                <Text>
                  {data.content}
                </Text>
            </View>

            <View style={{flexDirection:'row', paddingTop: 10}}>
              <TouchableOpacity style={{flexDirection:'row'}}>
                {
                  data.checklike==1?
                  <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
                  :
                  <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
                }
                <Text style={{fontSize:11,color:'#DCDCDC',marginTop:5,marginLeft:4}}>
                  10
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{flexDirection:'row',marginLeft:10}}>
                <Icon name='md-text' color="rgba(0, 0, 0, 0.2)" size={20} />
                <Text style={{fontSize:11,color:'#DCDCDC',marginTop:5,marginLeft:4}}>
                  10
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginLeft: deviceWidth/2 + 40}}/>
              </TouchableOpacity>

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
      </View>
    );
  }
}
var Style = StyleSheet.create({
  title: {
    color:'white',
    fontSize: 16,
  },
  toolbar: {
    height:45,
    width: null,
    backgroundColor: "#8e44ad",
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
  icon_like:{
    width:16,
    height:15,
    marginTop:5
  },
});
