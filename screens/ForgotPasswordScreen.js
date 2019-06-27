import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, TouchableOpacity, Picker, ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


export class ForgotPasswordScreen extends Component
{
  showActionSheet = () => {
    this.ActionSheet.show()
  }

  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
    username = this.props.navigation.state.params.username;
    imageSource = require("./../assets/images/NoImage.jpg");
    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: branchID,
      username: username,
      email: '',

      showSpinner:false,
    };
  }

  componentDidMount()
  {
  }

  triggerModal = (message, goBack) =>
  {
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  submit = () => {
    if(this.state.email == "")
    {
      this.triggerModal("กรุณาใส่อีเมล", false);
      return;
    }

    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBOForgotPasswordUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        email: this.state.email,

        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      console.log(responseData);
      if(responseData.success == true)
      {
        this.setState({showSpinner:false});
        this.triggerModal("เราได้ส่งอีเมลให้คุณแล้ว กรุณาเช็คอีเมลของคุณค่ะ (ถ้าไม่พบ กรุณาตรวจสอบใน Junk mail ค่ะ)", true);
      }
    }).done();
  }

  onClose = () =>
  {
    if(this.state.goBack)
    {
      this.props.navigation.goBack(null);
    }
    else
    {
      this.setState({display:false});
    }
  }

  render() {

    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={[styles.label,{left:null,paddingLeft:20,paddingRight:20}]}>กรุณาใส่อีเมลที่คุณได้ลงทะเบียนไว้ เราจะส่งอีเมล เพื่อรีเซตรหัสผ่านไปให้คุณ</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder=" อีเมล"
          onChangeText={(text) => this.setState({ email: text})}
          value={this.state.email}
        />
        <Text style={styles.label}></Text>
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.submit} title="Submit"/>

        <MessageBox
          display={ this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={this.onClose}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={[<Text style={styles.actionSheet}>Choose from Library...</Text>, <Text style={styles.actionSheet}>Take Photo...</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {  this.chooseImage(index) }}
        />
        <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
        {this.state.showSpinner && Platform.OS === 'android'?(<ActivityIndicator size={30} color="#a2a2a2" />):null}
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  checkBoxText: {fontFamily:"Prompt-Regular",color: '#464646',fontWeight:"normal"},
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
  buttonText:
  {
    fontFamily: 'Prompt-SemiBold',
    color: '#005A50'
  },
  buttonAction: {
    backgroundColor: "#64DCC8",
    left: 20,
    width: Dimensions.get('window').width-2*20,
    height: 30,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 0
  },
});
export default ForgotPasswordScreen;
