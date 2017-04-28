import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

export default class SplashScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      done: false
    }
  }

  timer(){
    setTimeout(()=>{
      this.setState({
        done: true
      });
    },5000)
  }

  componentDidMount(){
    this.timer();
  }
  render(){
    return(
      this.state.done ?
        ({...this.props.children} )
        :
        (<Image style={styles.container} source={require('./images/splash.png')} />)
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex:1,
    width: null,
    height: null
  }
})
