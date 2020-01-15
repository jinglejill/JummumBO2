import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,Picker,ScrollView,ActionSheetIOS,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


export class PrinterDetailScreen extends Component
{
  showActionSheet = () => {
    this.ActionSheet.show()
  }

  constructor(props)
  {
    super(props);
    branchID = this.props.navigation.state.params.branchID;
    {
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,

        printerID: this.props.navigation.state.params.printerID,
        name: this.props.navigation.state.params.name,

        showSpinner: false,
        goBack:false,
      };
    }
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  triggerModal = (message, goBack) =>
  {
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  saveDetails = () => {
    if(this.state.name == "")
    {
      this.triggerModal("กรุณาใส่ชื่อเครื่องพิมพ์", false);
      return;
    }


    this.setState({showSpinner:true});
    fetch(this.state.dataUrl + 'JBOPrinterUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,

        printerID: this.state.printerID,
        name: this.state.name,

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

  viewPrinterMenu = () =>
  {
    this.props.navigation.navigate('MenuBelongToBuffetScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'category': 2,
      'printerID': this.state.printerID,
    });
  }

  selectPrinterMenu = (buttonIndex) =>
  {
    if (buttonIndex === 0) {
      this.props.navigation.navigate('MenuByTopicScreen',
       {
         'dataUrl': this.props.navigation.state.params.dataUrl,
         'branchID': this.props.navigation.state.params.branchID,
         'username': this.props.navigation.state.params.username,
         'category': 2,
         'menuTopic': 0,
         'printerID': this.state.printerID,
         onGoBack:(printerID)=>this.props.navigation.state.params.onGoBack(),
       }
     );
    }
    else if (buttonIndex === 1) {
      this.props.navigation.navigate('MenuByTopicScreen',
       {
         'dataUrl': this.props.navigation.state.params.dataUrl,
         'branchID': this.props.navigation.state.params.branchID,
       'username': this.props.navigation.state.params.username,
       'category': 2,
       'menuTopic': 1,
       'printerID': this.state.printerID,
       onGoBack:(printerID)=>this.props.navigation.state.params.onGoBack(),
       }
     );
    }
    else if (buttonIndex === 2) {
      this.props.navigation.navigate('MenuByTopicScreen',
       {
         'dataUrl': this.props.navigation.state.params.dataUrl,
         'branchID': this.props.navigation.state.params.branchID,
       'username': this.props.navigation.state.params.username,
       'category': 2,
       'menuTopic': 2,
       'printerID': this.state.printerID,
       onGoBack:(printerID)=>this.props.navigation.state.params.onGoBack(),
       }
     );
    }
  }

  render()
  {
    console.log("type render:"+this.state.type);
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>ชื่อเครื่องพิมพ์</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={[styles.textInput]}
        placeholder=" ชื่อเครื่องพิมพ์"
        onChangeText={(text) => this.setState({ name: text})}
        value={this.state.name}
        />
        <Text style={styles.label}></Text>
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.viewPrinterMenu} title="ดูเมนูที่ออกเครื่องพิมพ์"/>
        <Text style={styles.label}></Text>
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.showActionSheet} title="เลือกเมนูที่ออกเครื่องพิมพ์"/>
        <Text style={styles.label}></Text>
        <MessageBox
          display={this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={this.onClose}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={[<Text style={styles.actionSheet}>เมนูหลัก</Text>, <Text style={styles.actionSheet}>เมนูย่อย</Text>, <Text style={styles.actionSheet}>เมนูไม่ได้ใช้</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>]}
          cancelButtonIndex={3}
          destructiveButtonIndex={3}
          onPress={(index) => {  this.selectPrinterMenu(index) }}
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
  checkBoxContainer:
  {
    backgroundColor:"#ffffff",
    borderWidth:0
  },
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
    backgroundColor: "rgba(255, 59,74, 1)",
    left: 20,
    width: Dimensions.get('window').width-2*20,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
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
export default PrinterDetailScreen;
