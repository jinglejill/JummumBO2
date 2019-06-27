import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Image, Dimensions, Platform, ActivityIndicator} from 'react-native';
import { Button } from 'react-native-elements';
import DefaultPreference from 'react-native-default-preference';
import MessageBox from './../screens/MessageBox.js';
import Spinner from 'react-native-spinkit';
var SharedPreferences = require('react-native-shared-preferences');

export class LogInScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      username: '',
      password: '',
      rememberMe: '◻︎ จำฉันไว้ในระบบ',
      display: false,
      message: '',
      messageTitle: '',
      showSpinner: false,
    };
    if(Platform.OS === 'android')
    {
      SharedPreferences.getItem("username", function(value)
      {
        if (value !== null) {
          // We have data!!
          console.log(value);
          this.setState({username: value});
        }
        else
        {
          console.log("get username value is null");
        }
      }.bind(this));


      SharedPreferences.getItem("password", function(value){
        console.log(value);
        if (value !== null) {
          // We have data!!
          console.log(value);
          this.setState({password: value});
        }
      }.bind(this));


      SharedPreferences.getItem("rememberMe", function(value){
        console.log(value);
        if (value !== null) {
          // We have data!!
          console.log(value);
          if(!value)
          {
          }
          else if(value == "◼︎ จำฉันไว้ในระบบ")
          {
            this.setState({rememberMe: value});
            this.logIn();
          }
        }
      }.bind(this));
    }
    else
    {
      DefaultPreference.get('username').then(function(value)
      {
        if(!value)
        {
          console.log('username is null');
        }
        else if(value != "")
        {
          console.log('username:' + value);
          this.setState({username: value});
        }
      }.bind(this));

      DefaultPreference.get('password').then(function(value)
      {
        if(!value)
        {
          console.log('password is null');
        }
        else if(value != "")
        {
          console.log('password:' + value);
          this.setState({password: value});
        }
      }.bind(this));

      DefaultPreference.get('rememberMe').then(function(value)
      {
        if(!value)
        {
        }
        else if(value == "◼︎ จำฉันไว้ในระบบ")
        {
          this.setState({rememberMe: value});
          this.logIn();
        }
      }.bind(this));
    }

  }

  logIn = () =>
  {
    this.setState({showSpinner:true});
    //เรียก api LogIn
    fetch(this.state.dataUrl + 'JBOLogIn.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        password: this.state.password,
        username:this.state.username,
        model:'',
      })
    })
    .then((response) => response.json())
    .then((responseData) =>
    {
      this.setState({showSpinner:false});
       if(responseData.success == false)
       {
         console.log("log in fail");
         this.triggerModal(responseData.error);
       }
       else
       {
         console.log(responseData);

         if (Platform.OS === 'android')
         {
           console.log("android save username");
           if(this.state.rememberMe === "◻︎ จำฉันไว้ในระบบ")
           {
             SharedPreferences.setItem("username","");
             SharedPreferences.setItem("password","");
             SharedPreferences.setItem("rememberMe","◻︎ จำฉันไว้ในระบบ");
           }
           else
           {
             SharedPreferences.setItem("username",this.state.username);
             SharedPreferences.setItem("password",this.state.password);
             SharedPreferences.setItem("rememberMe",this.state.rememberMe);
           }
         }
         else
         {
           if(this.state.rememberMe === "◻︎ จำฉันไว้ในระบบ")
           {
             DefaultPreference.set('username', "");
             DefaultPreference.set('password', "");
             DefaultPreference.set('rememberMe', "◻︎ จำฉันไว้ในระบบ");
           }
           else
           {
             DefaultPreference.set('username', this.state.username);
             DefaultPreference.set('password', this.state.password);

             DefaultPreference.set('rememberMe', this.state.rememberMe).then(
               function()
               {
                 console.log('remember me default reference done')
               }
             );
           }
         }


          console.log("log in success");
          this.props.navigation.setParams({ username: responseData.data.UserAccount.Username });

          //go to MenuScreen
          this.props.navigation.navigate('MenuScreen',
            {
              'dataUrl': this.props.navigation.state.params.dataUrl,
              'branchID': responseData.data.UserAccount.BranchID,
              'username': responseData.data.UserAccount.Username,
              'fullName': responseData.data.UserAccount.FullName,
              onGoBack:()=>this.clearPassword()
          })
       }
     }).done();
  }

  clearPassword = () =>
  {
    if (Platform.OS === 'android')
    {
      SharedPreferences.getItem("rememberMe", function(value){
        if (value !== null) {
          // We have data!!
          console.log(value);
          if(value == '◻︎ จำฉันไว้ในระบบ')
          {
            this.setState({username:''});
            this.setState({password:''});
            this.setState({rememberMe:value});
          }
          else
          {
            this.setState({password:''});
          }
        }
      }.bind(this));
    }
    else
    {
      DefaultPreference.get('rememberMe').then(function(value)
      {
        if(value != "")
        {
          if(value == '◻︎ จำฉันไว้ในระบบ')
          {
            this.setState({username:''});
            this.setState({password:''});
            this.setState({rememberMe:value});
          }
          else
          {
            this.setState({password:''});
          }
        }
      }.bind(this));
    }
  }

  rememberMe = () => {
    let consRememberMe = '◼︎ จำฉันไว้ในระบบ';
    if(this.state.rememberMe === "◻︎ จำฉันไว้ในระบบ")
    {
      consRememberMe = "◼︎ จำฉันไว้ในระบบ";
    }
    else
    {
      consRememberMe = "◻︎ จำฉันไว้ในระบบ";
    }
    this.setState({
      rememberMe: consRememberMe
    })
  }

  forgotPassword = () =>
  {
    this.props.navigation.navigate('ForgotPasswordScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'email': this.state.email,
        onGoBack:()=>this.clearPassword()
    })
    // console.log("forgotPassword");
  }

  triggerModal = (message) =>
  {
    this.setState({
      display: true,
      message: message
    })
  }

  onClose = () =>
  {
    this.setState({
      display: false,
    })
  }

  render() {
    const win = Dimensions.get('window');
    const imageHeight = 246/299*win.width;
    const tenPercentHeight = win.height*0.1;
    const twentyPercentHeight = win.height*0.2;

    return (
      <View style={[logInStyles.greenBackgroundLogIn]}>
        <View style={{alignItems:'center'}} >
          <Image
            source={require("./../assets/images/jummumTypeWhiteBO.png")}
            style={{width:220,height:207/835*220,position:'absolute',top:tenPercentHeight}}
          />
        </View>
        <View style={{position: 'absolute',bottom:0}}>
          <Image
            source={require("./../assets/images/jummumLogoCrop2.png")}
            style={{width:win.width,height:imageHeight}}
          />
        </View>
        <View style={{position: 'absolute',top:twentyPercentHeight,width:Dimensions.get('window').width}}>
          <View style={{justifyContent:'center', alignItems:'center'}} >
            <Text style={logInStyles.welcome}>Log in</Text>
            <TextInput
            style={logInStyles.loginTextInput}
            placeholder=" Email"
            onChangeText={(text) => this.setState({ username: text, display: false})}
            value={this.state.username}
            />

            <TextInput
            secureTextEntry={true}
            style={logInStyles.loginTextInput}
            placeholder=" Password"
            onChangeText={(text) => this.setState({ password: text, display: false})}
            value={this.state.password}
            />
            <Button buttonStyle={logInStyles.logInButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.logIn} title="Log in"/>
            <View style={{display:'flex',flexDirection:'row',width:260,justifyContent:'space-between'}}>
            <Button buttonStyle={[logInStyles.rememberMeButton]} titleStyle={{fontFamily: "Prompt-SemiBold",color:"#005A50",fontSize:14}} onPress={this.rememberMe} title={this.state.rememberMe}/>
            <Button buttonStyle={[logInStyles.rememberMeButton]} titleStyle={{fontFamily: "Prompt-SemiBold",color:"#005A50",fontSize:14}} onPress={this.forgotPassword} title="ลืมรหัสผ่าน"/>
            </View>
            <MessageBox display={ this.state.display } message={this.state.message} messageTitle={this.state.messageTitle} onClose={this.onClose}/>
          </View>
        </View>
        <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
        {this.state.showSpinner && Platform.OS === 'android'?(<ActivityIndicator size={30} color="#a2a2a2" />):null}
      </View>
    );
  }
}

const logInStyles = StyleSheet.create({
  welcome: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  greenBackgroundLogIn: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignSelf: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(99,219,199,1)",
    opacity: 1,
  },
  loginTextInput:
  {
    fontFamily: "Prompt-Regular",
    width: 260,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 0,
    paddingBottom: 0,
    margin:5
  },
  logInButton: {
    // color: "#000000",
    backgroundColor: "rgba(255, 59,74, 1)",
    width: 260,
    height: 30,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 0,
    margin:5
  },
  rememberMeButton: {
    backgroundColor: "transparent",
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
  },
});

export default LogInScreen;
