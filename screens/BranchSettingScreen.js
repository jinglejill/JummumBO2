import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, TouchableOpacity, Picker, ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


const statusOptions = [
  { value: 1, label: 'เปิดใช้แอพ' },
  { value: 2, label: 'เตรียมเปิดใช้แอพ' },
  { value: 0, label: 'ปิดการใช้แอพ' }
]


export class BranchSettingScreen extends Component
{
  showActionSheet = () => {
    this.ActionSheet.show()
  }
  //test comment git
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
      branch: null,
      imageBase64: "",
      imageChanged: false,
      imageType: "",
      name: "",
      percentServiceCharge: 0,
      percentVat: 0,
      priceIncludeVat: false,
      takeAwayFee: 0,
      status: 0,
      avatarSource:imageSource,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadBranch();
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  loadBranch = () =>
  {
    fetch(this.state.dataUrl + 'JBOBranchGet.php',
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
      imageUrl = responseData.data.Branch.ImageUrl;
      uri = this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+imageUrl+'&type=2';
      imageSource = {uri:uri};
      {
        var parts = (+responseData.data.Branch.ServiceChargePercent).toFixed(2).split(".");
        percentServiceCharge = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
      }
      {
        var parts = (+responseData.data.Branch.PercentVat).toFixed(2).split(".");
        percentVat = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
      }
      {
        var parts = (+responseData.data.Branch.TakeAwayFee).toFixed(2).split(".");
        takeAwayFee = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
      }
      this.setState({
        branch:responseData.data.Branch,
        name:responseData.data.Branch.Name,
        percentServiceCharge: percentServiceCharge,
        percentVat: percentVat,
        priceIncludeVat: responseData.data.Branch.PriceIncludeVat,
        takeAwayFee: takeAwayFee,
        status: parseInt(responseData.data.Branch.Status),
        avatarSource: imageSource,
        showSpinner: false,
      })
    }).done();
  };

  chooseImage = (buttonIndex) =>
  {
    if (buttonIndex === 0)
    {
      ImagePicker.openPicker({
        width: 150,
        height: 150,
        cropping: true,
        freeStyleCropEnabled: true,
        includeBase64: true
      }).then(image =>
      {
        console.log(image);

        const source = { uri: image.path };
        //
        // // You can also display the image using data:
        // // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
          imageBase64: image.data,
          imageChanged: true,
          imageType: image.mime.split("/")[1]
        });
      })
      .catch(error =>
      {
        console.log("cancel openPicker error"+error);
      })
      ;
    }
    else if (buttonIndex === 1)
    {
      ImagePicker.openCamera({
        width: 150,
        height: 150,
        cropping: true,
        freeStyleCropEnabled: true,
        avoidEmptySpaceAroundImage: true,
        includeBase64: true
      }).then(image =>
      {
        const source = { uri: image.path };
        //
        // // You can also display the image using data:
        // // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
          imageBase64: image.data,
          imageChanged: true,
          imageType: image.mime.split("/")[1]
        });
      })
      .catch(error =>
      {
        // add this to your code
      });
    }
    else if (buttonIndex === 2)
    {
      console.log("cancel choosing image");
    }
  }

  serviceChargeChanged = (text) =>
  {
    this.setState({ percentServiceCharge: text.replace(/[^0-9]/g, ''),})
  }

  vatChanged = (text) =>
  {
    this.setState({ percentVat: text.replace(/[^0-9]/g, ''),})
  }

  takeAwayFeeChanged = (text) =>
  {
    this.setState({ takeAwayFee: text.replace(/[^0-9]/g, ''),})
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
        this.triggerModal("กรุณาใส่ชื่อร้านอาหาร", false);
        return;
      }
      if(this.state.percentServiceCharge == "")
      {
        this.setState({percentServiceCharge:0});
      }
      if(this.state.percentVat == "")
      {
        this.setState({percentVat:0});
      }
      if(this.state.takeAwayFee == "")
      {
        this.setState({takeAwayFee:0});
      }
      this.setState({showSpinner:true});

      fetch(this.state.dataUrl + 'JBOBranchUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          imageBase64:this.state.imageBase64,
          imageChanged:this.state.imageChanged,
          imageType:this.state.imageType,
          name: this.state.name,
          status: this.state.status,
          serviceChargePercent: this.state.percentServiceCharge,
          percentVat: this.state.percentVat,
          priceIncludeVat: this.state.priceIncludeVat,
          takeAwayFee: this.state.takeAwayFee,
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

    priceIncludeVatClick = () => {
      this.setState({priceIncludeVat:!this.state.priceIncludeVat});
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
        <Text style={styles.labelCenter}>Logo</Text>
        <TouchableOpacity
          onPress={this.showActionSheet}
          style={{alignItems:'center'}}
        >
          <Image
            source={this.state.avatarSource}
            style={{width:150,height:150,borderRadius:10}}
          />
        </TouchableOpacity>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ชื่อร้าน</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder=" ชื่อร้าน"
          onChangeText={(text) => this.setState({ name: text})}
          value={this.state.name}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>สถานะ</Text>
        <SelectInput
          style={styles.selectInput}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:28,fontWeight:'normal'}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular",fontWeight:'normal'}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.setState({status:value})}}
          value={this.state.status}
          options={statusOptions}  />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>% Service charge</Text>
        <TextInput
          style={styles.textInput}
          placeholder=" % Service charge"
          keyboardType="numeric"
          onChangeText={(text) => this.serviceChargeChanged(text)}
          value={this.state.percentServiceCharge}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>% Vat</Text>
        <TextInput
          style={styles.textInput}
          placeholder=" % Vat"
          keyboardType="numeric"
          onChangeText={(text) => this.vatChanged(text)}
          value={this.state.percentVat}
        />
        <Text style={styles.label}></Text>
        <CheckBox
          title='ราคารวม Vat'
          checked={this.state.priceIncludeVat}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.priceIncludeVatClick}
          checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
          uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>ค่า takeaway (บาท)</Text>
        <TextInput
          style={styles.textInput}
          placeholder=" ค่า takeaway"
          keyboardType="numeric"
          onChangeText={(text) => this.takeAwayFeeChanged(text)}
          value={this.state.takeAwayFee}
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
    color: '#005A50',
    fontWeight:'normal'
  },
  actionSheet:
  {
    fontFamily:'Prompt-Regular',
    fontSize:18,
    color:'#005A50'
  }
});
export default BranchSettingScreen;
