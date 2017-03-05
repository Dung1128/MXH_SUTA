import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ListView
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
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentWillUnmount(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(_data)
    });
  }


  _renderRow(data){
    <View style={{flex:1,padding:10,borderLeftColor:'#00BFFF',borderLeftWidth:1,borderStyle:'solid'}}>
      <Text style={{fontWeight:'bold'}}>
        {data._time}
      </Text>
      <Text>
        {data._content}
      </Text>
    </View>

  }

  render(){
    console.log(_data);
    return(
      <View style={{flex:1, padding:5}}>
        <ListView
          style={{flex:1}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
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
});
