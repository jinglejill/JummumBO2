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


export class LuckyDrawScreen extends Component
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
    this.loadLuckyDraw();
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  loadLuckyDraw = () =>
  {
    fetch(this.state.dataUrl + 'JBOLuckyDrawGet.php',
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
        luckyDrawSpend:responseData.data.LuckyDraw.LuckyDrawSpend,
        rewardWeightFirst:responseData.data.LuckyDraw.RewardWeightFirst,
        rewardWeightSecond:responseData.data.LuckyDraw.RewardWeightSecond,
        rewardWeightThird:responseData.data.LuckyDraw.RewardWeightThird,
        rewardWeightFourth:responseData.data.LuckyDraw.RewardWeightFourth,

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
    if(this.state.luckyDrawSpend == "")
    {
      this.triggerModal("กรุณาใส่ราคารวมเพื่อลุ้นรางวัล", false);
      return;
    }
    if(this.state.rewardWeightFirst == "")
    {
      this.triggerModal("กรุณาใส่สัดส่วนของรางวัลที่ 1", false);
      return;
    }
    if(this.state.rewardWeightSecond == "")
    {
      this.triggerModal("กรุณาใส่สัดส่วนของรางวัลที่ 2", false);
      return;
    }
    if(this.state.rewardWeightThird == "")
    {
      this.triggerModal("กรุณาใส่สัดส่วนของรางวัลที่ 3", false);
      return;
    }
    if(this.state.rewardWeightFourth == "")
    {
      this.triggerModal("กรุณาใส่สัดส่วนของรางวัลที่ 4", false);
      return;
    }
    if(parseInt(this.state.rewardWeightFirst)+parseInt(this.state.rewardWeightSecond)+parseInt(this.state.rewardWeightThird)+parseInt(this.state.rewardWeightFourth) != 100)
    {
      this.triggerModal("สัดส่วนของรางวัลไม่เท่ากับ 100%", false);
      return;
    }

    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBOLuckyDrawSettingUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        luckyDrawSpend: this.state.luckyDrawSpend,
        rewardWeightFirst: this.state.rewardWeightFirst,
        rewardWeightSecond: this.state.rewardWeightSecond,
        rewardWeightThird: this.state.rewardWeightThird,
        rewardWeightFourth: this.state.rewardWeightFourth,
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
      this.props.navigation.goBack(null);
    }
    else
    {
      this.setState({display:false});
    }
  }

  luckyDrawSpendChanged = (text) =>
  {
    this.setState({ luckyDrawSpend: text.replace(/[^0-9]/g, ''),})
  }

  rewardWeightFirstChanged = (text) =>
  {
    this.setState({ rewardWeightFirst: text.replace(/[^0-9]/g, ''),})
  }

  rewardWeightSecondChanged = (text) =>
  {
    this.setState({ rewardWeightSecond: text.replace(/[^0-9]/g, ''),})
  }

  rewardWeightThirdChanged = (text) =>
  {
    this.setState({ rewardWeightThird: text.replace(/[^0-9]/g, ''),})
  }

  rewardWeightFourthChanged = (text) =>
  {
    this.setState({ rewardWeightFourth: text.replace(/[^0-9]/g, ''),})
  }

  viewLuckyDrawList = () =>
  {
    this.props.navigation.navigate('LuckyDrawListScreen',
     {
       'dataUrl': this.props.navigation.state.params.dataUrl,
       'branchID': this.props.navigation.state.params.branchID,
       'username': this.props.navigation.state.params.username
    });
  }

  render() {
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>ราคารวมเพื่อลุ้นรางวัล</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder=" ราคารวมเพื่อลุ้นรางวัล"
          onChangeText={(text) => this.luckyDrawSpendChanged(text)}
          value={this.state.luckyDrawSpend}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={[styles.label,{fontFamily:'Prompt-SemiBold'}]}>สัดส่วนในการจับได้ของรางวัล (เต็ม 100%)</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
          <Text style={styles.label}>รางวัลที่ 1</Text>
          <TextInput
            style={[styles.textInput,{position:'absolute',left:90,width:250}]}
            placeholder=" คิดเป็น %"
            onChangeText={(text) => this.rewardWeightFirstChanged(text)}
            value={this.state.rewardWeightFirst}
          />
        </View>

        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
          <Text style={styles.label}>รางวัลที่ 2</Text>
          <TextInput
            style={[styles.textInput,{position:'absolute',left:90,width:250}]}
            placeholder=" คิดเป็น %"
            onChangeText={(text) => this.rewardWeightSecondChanged(text)}
            value={this.state.rewardWeightSecond}
          />
        </View>

        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
          <Text style={styles.label}>รางวัลที่ 3</Text>
          <TextInput
            style={[styles.textInput,{position:'absolute',left:90,width:250}]}
            placeholder=" คิดเป็น %"
            onChangeText={(text) => this.rewardWeightThirdChanged(text)}
            value={this.state.rewardWeightThird}
          />
        </View>

        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
          <Text style={styles.label}>รางวัลที่ 4</Text>
          <TextInput
            style={[styles.textInput,{position:'absolute',left:90,width:250}]}
            placeholder=" คิดเป็น %"
            onChangeText={(text) => this.rewardWeightFourthChanged(text)}
            value={this.state.rewardWeightFourth}
          />
        </View>

        <Text style={styles.label}></Text>
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.viewLuckyDrawList} title="ตั้งค่ารางวัลใน Lucky Draw"/>
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
          options={['Choose from Library...', 'Take Photo...','ยกเลิก']}
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
export default LuckyDrawScreen;
