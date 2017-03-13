import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ListView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
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
    }
  }

  componentWillMount(){
     this.getData();

  }

  async getData(){
       return fetch('http://suta.esy.es/api/getstatus_id.php')
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             dataSource: this.state.dataSource.cloneWithRows(responseJson.result),
           })
           console.log(responseJson.result);
         })
         .catch((error) => {
           console.error(error);
         });
    }


  _renderRow(data){
    return (
        <View style={{flex:1,borderLeftColor:'#00BFFF',borderLeftWidth:1,borderStyle:'solid', paddingBottom:20}}>
          <View style={{paddingLeft:15}}>
            <Text style={{fontWeight:'bold'}}>
              {data.time}
            </Text>
            <Text>
              {data.content}
            </Text>
          </View>

          <View style={{flexDirection:'row', paddingLeft:15}}>
            <TouchableOpacity style={{flexDirection:'row'}}>
              {
                data.checklike==1?
                <Image style={Style.icon_like} source={this.state.like}/>
                :
                <Image style={Style.icon_like} source={this.state.unlike}/>
              }
              <Text style={{fontSize:11,color:'#DCDCDC',marginTop:5,marginLeft:4}}>
                10
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection:'row',marginLeft:10}}>
              <Image style={{width:15,height:15,marginTop:5}} source={require('../../images/ico_comment_2.png')}/>
              <Text style={{fontSize:11,color:'#DCDCDC',marginTop:5,marginLeft:4}}>
                10
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Icon name="ios-more-outline" size={30} color="#BDBDBD" style={{marginTop:5, marginLeft: deviceWidth/2 + 40}}/>
            </TouchableOpacity>

        </View>

        </View>
    )

  }

  render(){
    return(
      <View style={{flex:1, paddingLeft:15, paddingRight:15, paddingTop:10}}>
        <ListView
        style={{flex:1}}
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
