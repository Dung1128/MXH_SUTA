import React, {Component} from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dateFormat from 'dateformat';
export default class Public extends Component{
  constructor(props){
    super(props);
    this.state = ({
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2) => r1!=r2}),
      refreshing: false,
      checkadd: this.props.checkadd
    });
    flag = true;
  }
  componentWillUnmount() {
    flag = false;
  }
  componentWillMount(){
    this.fetchData();

  }
  componentDidMount(){
    if(this.props.checkadd == true){
      this._onRefresh();
    }
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
  async fetchData() {
    try {
      let response = await fetch('http://suta.esy.es/api/getstatus_public.php');
      let responseJson = await response.json();
      if(flag == true){
      this.setState({
        data: responseJson.result,
        dataSource: this.state.dataSource.cloneWithRows(responseJson.result)
      });
      }
      else {
        return;
      }
    } catch(error) {
      console.error(error);
    }
  }
  _renderRow(data){
    var time = dateFormat(data.time, "h:MM TT dd/mm/yyyy ");
    return(
      <View style={{flex:1,padding:10,borderLeftColor:'#00BFFF',borderLeftWidth:1,borderStyle:'solid',}}>
      <View style={{flex:1,flexDirection:'row'}}>
        <View style={styles.backgroundAvatar} >
          <Image style={styles.avatar} source={{uri: data.avatar}}/>
        </View>
        <View style={{justifyContent:'center',marginLeft:10}}>
          <Text style={styles.textbold}>
            {data.username}
          </Text>
          <Text style={styles.textgray}>
            {time}
          </Text>
        </View>
      </View>
        <Text style={{paddingTop:10,paddingBottom:10,fontSize:13,color:'#1d2129'}}>
         {data.content}
        </Text>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={{flexDirection:'row'}}>
            <Icon name='md-heart-outline' color="rgba(0, 0, 0, 0.2)" size={20} />
            <Text style={[styles.textgray,{marginLeft:5}]}>
               {
                 data.likes!=null?
                 data.likes + "Thích"
                 :
                 "Thích"
               }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity  style={{flexDirection:'row',marginLeft:20}}>
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
      </View>
    )
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#fff'}}>
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
      </View>
    );
  }


}
const styles = StyleSheet.create({
    avatar:{
      width:40,
      height:40,
      borderRadius:200
    },
    backgroundAvatar:{

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
    }
  });
