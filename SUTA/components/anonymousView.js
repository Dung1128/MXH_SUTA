import React, {Component} from 'react';
import {
  View,
  Text
} from 'react-native';

export default class Anonymous extends Component{
  constructor(props){
    super(props);
    this.state = ({

    });
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'rgb(39, 191, 165)'}}>
        <Text>
        Anonymous
        </Text>
      </View>
    );
  }
}