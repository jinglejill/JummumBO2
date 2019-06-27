import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, TouchableOpacity, Picker, ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';



export class BranchSettingScreen extends Component
{
  showActionSheet = () => {
    this.ActionSheet.show()
  }

  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
    username = this.props.navigation.state.params.username;

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: branchID,
      username: username,
      wordAdd: "",
      wordNo: "",
      wordAddValue: "",
      wordNoValue: "",
      allowQuantity: false,

      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadNoteSetting();
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  loadNoteSetting = () =>
  {
    fetch(this.state.dataUrl + 'JBONoteSettingGet.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>
    {
      console.log(responseData);

      this.setState({
        wordAdd:responseData.data.WordAdd,
        wordNo:responseData.data.WordNo,
        wordAddValue:responseData.data.WordAddValue,
        wordNoValue:responseData.data.WordNoValue,
        allowQuantity:responseData.data.AllowQuantity==1,

        showSpinner: false,
      })
    }).done();
  };

  triggerModal = (message, goBack) =>
  {
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  saveDetails = () =>
  {

    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBONoteSettingUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        wordAdd: this.state.wordAdd,
        wordNo: this.state.wordNo,
        allowQuantity: this.state.allowQuantity,
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
        this.triggerModal("บันทึกสำเร็จ", true);
      }
    }).done();
  }

  onClose = () =>
  {
    if(this.state.goBack)
    {
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack(null);
    }
    else
    {
      this.setState({display:false});
    }
  }

  allowQuantityClick = () =>
  {
    console.log("allowQuantityClick:"+this.state.allowQuantity);
    this.setState({allowQuantity:!this.state.allowQuantity});
  }

    render() {

    return (
      <ScrollView>
      <View style={{flex:1}}>

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <Text style={styles.label}>{"คำว่า"+this.state.wordNoValue + " ให้ใช้คำว่า "}</Text>
          <TextInput
            style={[styles.textInput,{width:100}]}
            placeholder=" "
            onChangeText={(text) => this.setState({ wordNo: text})}
            value={this.state.wordNo}
          />
        </View>

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <Text style={styles.label}>{"คำว่า"+this.state.wordAddValue + " ให้ใช้คำว่า "}</Text>
          <TextInput
            style={[styles.textInput,{width:100}]}
            placeholder=" "
            onChangeText={(text) => this.setState({ wordAdd: text})}
            value={this.state.wordAdd}
          />
        </View>

        <Text style={styles.label}></Text>
        <CheckBox
          title='ใส่จำนวนของรายการโน้ต'
          checked={this.state.allowQuantity==1}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.allowQuantityClick}
          checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
          uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
        />

        <Text style={styles.label}></Text>
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
  actionSheet:
  {
    fontFamily:'Prompt-Regular',
    fontSize:18,
    color:'#005A50'
  }
});
export default BranchSettingScreen;
