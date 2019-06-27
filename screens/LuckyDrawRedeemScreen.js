import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, Alert, TouchableOpacity, Picker, ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';



export class LuckyDrawRedeemScreen extends Component
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
      luckyDrawRedeem: null,
      voucherCodeAll:null,
      voucherCodeRedeem:null,
      voucherCodeLeft:null,
      rewardRedemptionID:this.props.navigation.state.params.rewardRedemptionID,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadLuckyDrawRedeem();
    // this.props.navigation.setParams({ numberOfVoucherCode: this.state.voucherCodeAll });
    // this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  loadLuckyDrawRedeem = () =>
  {
    fetch(this.state.dataUrl + 'JBOLuckyDrawRedeemGet.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        rewardRedemptionID: this.state.rewardRedemptionID,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>
    {
      console.log(responseData);

      this.setState({
        luckyDrawRedeem:responseData.data.LuckyDrawRedeem,
        voucherCodeAll:responseData.data.LuckyDrawRedeem.VoucherCodeAll,
        voucherCodeRedeem:responseData.data.LuckyDrawRedeem.VoucherCodeRedeem,
        voucherCodeLeft:responseData.data.LuckyDrawRedeem.VoucherCodeLeft,
        showSpinner: false,
      })

      this.props.navigation.setParams({ numberOfVoucherCode: responseData.data.LuckyDrawRedeem.VoucherCodeAll });
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

  numberOfVoucherCodeChanged = (text) =>
  {
    numberOfVoucherCode = text.replace(/[^0-9]/g, '');
    this.setState({ numberOfVoucherCode: numberOfVoucherCode});
  }

  addVoucherCode = () =>
  {
    if(this.state.numberOfVoucherCode == "" || this.state.numberOfVoucherCode == 0)
    {
      this.triggerModal("กรุณาใส่จำนวนรางวัล", false);
      return;
    }

    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBOPromoCodeInsert.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        rewardRedemptionID: this.state.rewardRedemptionID,
        numberOfVoucherCode: this.state.numberOfVoucherCode,

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
        this.triggerModal("บันทึกสำเร็จ", false);
        this.loadLuckyDrawRedeem();
        this.setState({numberOfVoucherCode:""});

      }
    }).done();
  }

  render() {

    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text style={styles.label}></Text>
        <Text style={styles.label}>จำนวนรางวัลทั้งหมด</Text>
        <Text style={styles.label}>{this.state.voucherCodeAll}</Text>

        <Text style={styles.label}></Text>
        <Text style={styles.label}>แลกไปแล้ว</Text>
        <Text style={styles.label}>{this.state.voucherCodeRedeem}</Text>

        <Text style={styles.label}></Text>
        <Text style={styles.label}>คงเหลือ</Text>
        <Text style={styles.label}>{this.state.voucherCodeLeft}</Text>

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>เพิ่มจำนวนรางวัล</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row'}}>
          <TextInput
          style={[styles.textInput,{width: 100}]}
          placeholder=" จำนวนรางวัล"
          keyboardType="numeric"
          onChangeText={(text) => this.numberOfVoucherCodeChanged(text)}
          value={this.state.numberOfVoucherCode}
          />
          <View style={{marginLeft:20}}>
            <TouchableOpacity
              onPress={ () => this.addVoucherCode()}
              style={{justifyContent:'center', alignItems:'center',marginLeft:11,borderRadius:5,backgroundColor:'#64DCC8',height:30}}
            >
              <Text style={[styles.label,{left:0,paddingLeft:10,paddingRight:10,color:'white',fontFamily:'Prompt-SemiBold'}]}>เพิ่ม</Text>
            </TouchableOpacity>
          </View>
        </View>

        <MessageBox
          display={ this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={this.onClose}
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
});
export default LuckyDrawRedeemScreen;
