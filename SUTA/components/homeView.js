import React, {Component} from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
// import Style from 'Style.js';

import NewFeed from './newFeedView.js';
import Friends from './friendsView.js';
import Message from './messageView.js';
import Menu from './menuView.js';
import { Tabs, Tab, Icon } from 'react-native-elements';
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'feed',
    }
  }

  changeTab (selectedTab) {
    this.setState({selectedTab})
  }

  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }

  navigate(routeName, data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }

  render(){
    const { selectedTab } = this.state
    return(
      <View style={{flex:1}}>
        <Tabs>

        <Tab
          titleStyle={{fontWeight: 'bold', fontSize: 10}}
          selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
          selected={selectedTab === 'feed'}
          renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='whatshot' size={28} />}
          renderSelectedIcon={() => <Icon color={'#6296f9'} name='whatshot' size={30} />}
          onPress={() => this.changeTab('feed')}>
          <NewFeed />
        </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'banbe'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='people' size={30} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='people' size={30} />}
            onPress={() => this.changeTab('banbe')}>
            <Friends />
          </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'tinnhan'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='chat' size={25} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='chat' size={30} />}
            onPress={() => this.changeTab('tinnhan')}>
            <Message />
          </Tab>
          <Tab
            titleStyle={{fontWeight: 'bold', fontSize: 10}}
            selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
            selected={selectedTab === 'menu'}
            renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='menu' size={30} />}
            renderSelectedIcon={() => <Icon color={'#6296f9'} name='menu' size={30} />}
            onPress={() => this.changeTab('menu')}>
            <Menu />
          </Tab>
        </Tabs>
      </View>
    )
  }
}
