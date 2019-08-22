/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Image, Dimensions, Platform} from 'react-native';
import {createStackNavigator,createAppContainer,HeaderBackButton} from 'react-navigation';
import { Button } from 'react-native-elements';
import LogInScreen from './screens/LogInScreen.js';
import MessageBox from './screens/MessageBox.js';
import MenuScreen from './screens/MenuScreen.js';
import MenuOnOffScreen from './screens/MenuOnOffScreen.js';
import MenuDetailScreen from './screens/MenuDetailScreen.js';
import SpecialPriceSettingScreen from './screens/SpecialPriceSettingScreen.js';
import BranchSettingScreen from './screens/BranchSettingScreen.js';
import MenuBelongToBuffetScreen from './screens/MenuBelongToBuffetScreen.js';
import MenuBelongToBuffetDetailScreen from './screens/MenuBelongToBuffetDetailScreen.js';
import MenuByTopicScreen from './screens/MenuByTopicScreen.js';
import NoteScreen from './screens/NoteScreen.js';
import NoteDetailScreen from './screens/NoteDetailScreen.js';
import NoteViewScreen from './screens/NoteViewScreen.js';
import NoteSelectScreen from './screens/NoteSelectScreen.js';
import DiscountProgramScreen from './screens/DiscountProgramScreen.js';
import DiscountProgramDetailScreen from './screens/DiscountProgramDetailScreen.js';
import PrinterScreen from './screens/PrinterScreen.js';
import PrinterDetailScreen from './screens/PrinterDetailScreen.js';
import HotDealScreen from './screens/HotDealScreen.js';
import HotDealDetailScreen from './screens/HotDealDetailScreen.js';
import LuckyDrawScreen from './screens/LuckyDrawScreen.js';
import LuckyDrawListScreen from './screens/LuckyDrawListScreen.js';
import LuckyDrawDetailScreen from './screens/LuckyDrawDetailScreen.js';
import LuckyDrawRedeemScreen from './screens/LuckyDrawRedeemScreen.js';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.js';
import NoteSettingScreen from './screens/NoteSettingScreen.js';
import TestScreen from './screens/TestScreen.js';


class LaunchScreen extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      dataUrl: "https://jummum.co/app/PRD_JUMMUM_BO_1.3/",
    }
  }


  saveDetails = () => {
      console.log('aaaa');
  }

  componentDidMount()
  {
    return fetch(this.state.dataUrl + 'JBOMasterGet.php')
      .then((response) => response.json())
      .then(
        this.props.navigation.navigate('LogInScreenKey',
          {
            'dataUrl': this.state.dataUrl,
          }
        )
      )
      .catch((error) =>{
        console.error(error);
      });
  }
  render() {
    console.log("app render");
    return (
      // <View style={styles.root}>
      <View style={styles.greenBackground} >
        <View style={styles.centerInContainer} >
         <Image
           source={require("./assets/images/jummumLogoWithType.png")}
           style={styles.jummumImage}
         />
       </View>
       <View style={{alignContent: 'center'}}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.welcome}></Text>
        <Text style={styles.welcomeDetail}>
          Customize menu, promotion and reward to let your customers get the
          most impressive experience
        </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  greenBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignSelf: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(99,219,199,1)",
    opacity: 1,
  },
  centerInContainer: {
    alignItems: 'center',
  },
  jummumImage: {
    height:300,
    width:246,
  },
  welcome: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  welcomeDetail: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  headerRightButton: {
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // marginVertical: 20,
  },
  label: {
    left:20,
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
  },
  labelCenter: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'center',
    color: '#464646',
  },
  checkBoxContainer: {backgroundColor:"#ffffff",borderWidth:0},
  checkBoxText: {fontFamily:"Prompt-Regular",color: '#464646',},
  textInput:
  {
    fontFamily:"Prompt-Regular",
    left:20,
    width: Dimensions.get('window').width-2*20,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 0,
    paddingBottom: 0
  },
  selectInput:
  {
    left:20,
    width: Dimensions.get('window').width-2*20,
    height: Platform.OS === 'android'?50:30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5
  },
  button: {
    // color: "#000000",
    backgroundColor: "rgba(255, 59,74, 1)",
    left: 20,
    width: Dimensions.get('window').width-2*20,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
  },
  hide:
  {
    display:'none'
  },
});

const navigationOptions = ({ navigation }) => ({
    headerRight: navigation.state.params.showNewButton?<Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"New"} onPress={navigation.state.params.handleNewMenu} />:"",
    headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
    title: navigation.state.params.menuTopic==0?'เมนูหลัก':(navigation.state.params.menuTopic==1?'เมนูอื่นๆ':'เมนูไม่ได้ใช้'),
    headerTintColor: '#ffffff',
    headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
    headerTitleStyle: {
          fontFamily: "Prompt-SemiBold",
          fontSize: 18,
          fontWeight: 'normal'
        },
    swipeEnabled: false,
    animationEnabled:false,
});


const AppNavigator = createStackNavigator({

  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  },
  LogInScreenKey: {
    screen: LogInScreen,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  },
  MenuScreen: {
    screen: MenuScreen,
    navigationOptions: {
      headerStyle: {display:"none"},
      headerLeft: null
    }
  },
  MenuOnOffScreen: {
    screen: MenuOnOffScreen,
    navigationOptions
  },
  MenuBelongToBuffetScreen: {
    screen: MenuBelongToBuffetScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: "",
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'เมนูที่เลือกไว้',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  MenuDetailScreen: {
    screen: MenuDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดเมนู',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  MenuBelongToBuffetDetailScreen: {
    screen: MenuBelongToBuffetDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดเมนู',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: ""
      })
  },
  SpecialPriceSettingScreen: {
    screen: SpecialPriceSettingScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าส่วนลด',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  BranchSettingScreen: {
    screen: BranchSettingScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าร้านอาหาร',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: <Button buttonStyle={styles.headerRightButton}
          titleStyle={{fontFamily: "Prompt-SemiBold"}}
          title={"Save"}
          onPress={navigation.state.params.handleSave} />
      })
  },
  MenuByTopicScreen: {
    screen: MenuByTopicScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={navigation.state.params.selectAllLabel} onPress={navigation.state.params.handleSelectAll} />,
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack(navigation.state.params.discountGroupMenuID);
            navigation.goBack(null);}} />,
        title: navigation.state.params.menuTopic==0?'เมนูหลัก':(navigation.state.params.menuTopic==1?'เมนูอื่นๆ':'เมนูไม่ได้ใช้'),
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  NoteScreen: {
    screen: NoteScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title="ตั้งค่า" onPress={navigation.state.params.handleSetting} />,
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'รายการโน้ต',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  NoteDetailScreen: {
    screen: NoteDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดโน้ต',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  NoteViewScreen: {
    screen: NoteViewScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: "",
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'รายการโน้ต',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  NoteSelectScreen: {
    screen: NoteSelectScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: "",
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'รายการโน้ต',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  DiscountProgramScreen: {
    screen: DiscountProgramScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"New"} onPress={navigation.state.params.handleNewDiscountProgram} />,
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'โปรโมชั่น',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  DiscountProgramDetailScreen: {
    screen: DiscountProgramDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าโปรโมชั่น',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  PrinterScreen: {
    screen: PrinterScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: "",
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'เครื่องพิมพ์',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  PrinterDetailScreen: {
    screen: PrinterDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดเครื่องพิมพ์',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  HotDealScreen: {
    screen: HotDealScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"New"} onPress={navigation.state.params.handleNewHotDeal} />,
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'Hot Deal',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  HotDealDetailScreen: {
    screen: HotDealDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียด Hot Deal',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={navigation.state.params.showSaveButton?"Save":"Edit"} onPress={navigation.state.params.handleEdit} />
      })
  },
  LuckyDrawScreen: {
    screen: LuckyDrawScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'Lucky Draw',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: <Button buttonStyle={styles.headerRightButton}
          titleStyle={{fontFamily: "Prompt-SemiBold"}}
          title={"Save"}
          onPress={navigation.state.params.handleSave} />
      })
  },
  LuckyDrawListScreen: {
    screen: LuckyDrawListScreen,
    navigationOptions: ({ navigation }) => ({
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"New"} onPress={navigation.state.params.handleNewLuckyDraw} />,
        headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
        title: 'รางวัล Lucky Draw',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        swipeEnabled: false,
        animationEnabled:false,
    })
  },
  LuckyDrawDetailScreen: {
    screen: LuckyDrawDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดรางวัล',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  LuckyDrawRedeemScreen: {
    screen: LuckyDrawRedeemScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รางวัลที่แลกแล้ว',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack(navigation.state.params.numberOfVoucherCode);
            navigation.goBack(null);}} />,
        headerRight: null
      })
  },
  NoteSettingScreen: {
    screen: NoteSettingScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่า',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: <Button buttonStyle={styles.headerRightButton}
          titleStyle={{fontFamily: "Prompt-SemiBold"}}
          title={"Save"}
          onPress={navigation.state.params.handleSave} />
      })
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ลืมรหัสผ่าน',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
              fontWeight: 'normal'
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: null
      })
  },
  MessageBox: {
    screen: MessageBox,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  },
});

export default createAppContainer(AppNavigator)
{

};
