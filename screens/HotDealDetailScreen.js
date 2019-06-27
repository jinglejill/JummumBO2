import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,Picker,ScrollView,ActionSheetIOS,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import ImagePicker from 'react-native-image-picker';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';


const statusOptions = [
  { value: 1, label: 'มีของ' },
  { value: 2, label: 'ของหมด' },
  { value: 3, label: 'ยังไม่เริ่มใช้' },
  { value: 0, label: 'ไม่ใช้แล้ว' }
]


const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export class HotDealDetailScreen extends Component
{
  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
    if(this.props.navigation.state.params.promotionID == 0)//new
    {
      newPromotion = true;
      imageSource = require("./../assets/images/NoImage.jpg");
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newPromotion: newPromotion,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        edit:true,
        showTermsConditions: false,


        menuID: 0,
        titleThai: "",
        price: "",
        recommended: true,
        buffetMenu: false,
        alacarteMenu: true,
        timeToOrder: 0,
        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        menuTypeID: this.props.navigation.state.params.menuTypeID,
        showSpinner: false,
        status: 1,
      };
    }
    else
    {
      newPromotion = false;
      imageUrl = this.props.navigation.state.params.imageUrl;
      if(imageUrl == "")
      {
        imageSource = require("./../assets/images/NoImage.jpg");
      }
      else
      {
        uri = this.props.navigation.state.params.dataUrl + 'JBODownloadImageGet.php?branchID='+branchID+'&imageFileName='+imageUrl+'&type=3';
        imageSource = {uri:uri};
      }

      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newPromotion: newPromotion,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        edit:true,
        showTermsConditions: false,

        promotionID: this.props.navigation.state.params.promotionID,
        header: this.props.navigation.state.params.header,
        subTitle: this.props.navigation.state.params.subTitle,
        imageUrl: this.props.navigation.state.params.imageUrl,
        termsConditions: this.props.navigation.state.params.termsConditions,



        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        showSpinner: false,
        goBack:false,
        status: this.props.navigation.state.params.status,
      };
    }
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ showSaveButton: false });
    this.props.navigation.setParams({ handleSave: this.saveDetails });
    this.props.navigation.setParams({ handleEdit: this.editDetails });
  }

  toggleShowTermsConditions = () =>
  {
    this.setState({showTermsConditions:!this.state.showTermsConditions});
  }

  chooseImage = () =>
  {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else
      {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
          imageBase64: response.data,
          imageChanged: true,
          imageType: response.type.split("/")[1]
        });
      }
    });
  }

  triggerModal = (message, goBack) =>
  {
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  editDetails = () =>
  {
    if(this.state.edit)
    {
      //change button to save
      this.setState({edit:false});//saveDetails
      this.props.navigation.setParams({ showSaveButton: true });
    }
    else
    {
      //change button to edit
      this.setState({edit:true});
      this.props.navigation.setParams({ showSaveButton: false });
    }
  }

  saveDetails = () =>
  {
    if(this.state.titleThai == "")
    {
      this.triggerModal("กรุณาใส่ชื่อเมนู", false);
      return;
    }
    if(this.state.price == "")
    {
      this.triggerModal("กรุณาใส่ราคา", false);
      return;
    }
    console.log("save timeToOrder:"+this.state.timeToOrder);
    if(this.state.buffetMenu && this.state.timeToOrder == 0)
    {
      this.triggerModal("กรุณาใส่เวลาในการสั่งบุฟเฟ่ต์ (นาที)", false);
      return;
    }
    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBOMenuUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menuTypeID:this.state.menuTypeID,
        menuID: this.state.menuID,
        titleThai: this.state.titleThai,
        price: this.state.price,
        status: this.state.status,
        recommended: this.state.recommended,
        buffetMenu: this.state.buffetMenu,
        alacarteMenu: this.state.alacarteMenu,
        timeToOrder: this.state.timeToOrder*60,
        imageBase64:this.state.imageBase64,
        imageChanged:this.state.imageChanged,
        imageType:this.state.imageType,
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

  recommendedClick = () => {
    this.setState({recommended:!this.state.recommended});
  }

  buffetMenuClick = () =>
  {
    if(!this.state.buffetMenu)
    {
      this.setState({timeToOrder:'360'});
    }
    else
    {
      console.log("buffetMenuClick yes");
      this.setState({timeToOrder:'0'});
    }
    this.setState({buffetMenu:!this.state.buffetMenu});
  }

  alacarteMenuClick = () => {
    if(!this.state.alacarteMenu)
    {
      this.setState({buffetMenu:false});
      this.setState({timeToOrder:"0"});
    }
    this.setState({alacarteMenu:!this.state.alacarteMenu});
  }

  priceChanged = (text) =>
  {
    this.setState({ price: text.replace(/[^0-9]/g, ''),})
  }

  timeToOrderChanged = (text) =>
  {
    console.log("timeToOrderChanged");
    this.setState({ timeToOrder: text.replace(/[^0-9]/g, ''),})
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

  confirm = () =>
  {
    this.setState({displayConfirmBox:false});
    this.deleteMenu();
  }

  cancel = () =>
  {
    this.setState({displayConfirmBox:false});
  }

  confirmDelete = () =>
  {
    this.setState({displayConfirmBox:true,messageConfirmBox: '',
    messageTitleConfirmBox: 'ยืนยันลบเมนูนี้'});
  }

  deleteMenu = () =>
  {
    this.setState({showSpinner:true});
    fetch(this.state.dataUrl + 'JBOMenuDelete.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menuID: this.state.menuID,
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
        this.triggerModal("ลบเมนูสำเร็จ", true);
      }
      else
      {
        this.setState({showSpinner:false});
        this.triggerModal("ไม่สามารถลบได้ คุณสามารถเปลี่ยนสถานะเป็น 'ไม่ใช้แล้ว' แทนได้", false);
      }
    }).done();
  }

  setSpecialPrice = () =>
  {
    this.props.navigation.navigate('SpecialPriceSettingScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID':this.state.menuID,
      'avatarSource': this.state.avatarSource,
      'titleThai': this.state.titleThai,
      'price': this.state.price
    });
  }

  viewMenuBelongToBuffet = () =>
  {
    this.props.navigation.navigate('MenuBelongToBuffetScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'category': 0,
      'buffetMenuID': this.state.menuID,
    });
  }

  viewNote = () =>
  {
    this.props.navigation.navigate('NoteViewScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID': this.state.menuID,
    });
  }

  selectNote = () =>
  {
    this.props.navigation.navigate('NoteSelectScreen',
     {'branchID': this.props.navigation.state.params.branchID,
     'username': this.props.navigation.state.params.username,
     'menuID': this.state.menuID
     }
    );
  }

  render()
  {
    if(this.state.imageUrl == "")
    {
      branchImageUrl = this.state.branchImageUrl;
      uri = this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+branchImageUrl+'&type=2';
    }
    else
    {
      uri = this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+this.state.imageUrl+'&type=3';
    }

    {
      viewPromotion = (
        <View>
          <Text></Text>
          <Image
            source={{uri: uri}}
            style={{resizeMode:'contain',width:Dimensions.get('window').width-2*20,height:(Dimensions.get('window').width-2*20)/16*7.5,marginTop:11,marginLeft:20}}
          />
          <Text></Text>
          <Text style={[styles.itemHeader]}>{this.state.header}</Text>
          <Text style={[styles.itemSub]}>{this.state.subTitle}</Text>
          <Text style={styles.label}></Text>
          <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20,marginTop:11}}/>
          <View style={{display:'flex',flexDirection:'row'}}>
            <Text style={[styles.itemHeader]}>Terms and conditions</Text>
            <TouchableOpacity
              onPress={ () => this.toggleShowTermsConditions()}
              style={{position:'absolute',right:20,paddingTop:6}}
            >
              <Image
                source={this.state.showTermsConditions?require("./../assets/images/expand2.png"):require("./../assets/images/collapse2.png")}
                style={{resizeMode:'contain',width:30,height:30}}
              />
            </TouchableOpacity>
          </View>
          {
            this.state.showTermsConditions?<Text style={[styles.itemSub]}>{this.state.termsConditions}</Text>:null
          }
          <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20,marginTop:11}}/>
        </View>
      );
    }


    {
      editPromotion = (
          <View>
            <Text></Text>
            <TouchableOpacity
              onPress={ () => this.chooseImage()}
              style={{alignItems:'center'}}
            >
            <Image
              source={{uri: uri}}
              style={{resizeMode:'contain',width:Dimensions.get('window').width-2*20,height:(Dimensions.get('window').width-2*20)/16*7.5,marginTop:11,marginLeft:20}}
            />
            </TouchableOpacity>

            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <Text style={styles.label}>ชื่อโปรโมชั่น</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
            </View>
            <TextInput
            style={[styles.textInput,{height:55}]}
            placeholder=" ชื่อโปรโมชั่น"
            onChangeText={(text) => this.setState({ header: text})}
            value={this.state.header}
            multiline={true}
            />

            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <Text style={styles.label}>เพิ่มเติม</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
            </View>
            <TextInput
            style={[styles.textInput,{height:55}]}
            placeholder=" เพิ่มเติม"
            onChangeText={(text) => this.setState({ subTitle: text})}
            value={this.state.subTitle}
            multiline={true}
            />

            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <Text style={styles.label}>ข้อกำหนดและเงื่อนไข</Text><Text style={[styles.label,{color:"#FF3C4B"}]}></Text>
            </View>
            <TextInput
            style={[styles.textInput,{height:110}]}
            placeholder=" ข้อกำหนดและเงื่อนไข"
            onChangeText={(text) => this.setState({ termsConditions: text})}
            value={this.state.termsConditions}
            multiline={true}
            />

            <Text style={styles.label}></Text>
            <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.editDetails} title="ยกเลิก"/>
            <Text style={styles.label}></Text>
          </View>
      );
    }

    return (
      <ScrollView>
      <View style={{flex:1}}>
        {
          this.state.edit?viewPromotion:editPromotion
        }
        <MessageBox
          display={this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={this.onClose}
        />
        <MessageBoxConfirm
          display={this.state.displayConfirmBox}
          message={this.state.messageConfirmBox}
          messageTitle={this.state.messageTitleConfirmBox}
          onConfirm={this.confirm}
          onCancel={this.cancel}
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
  itemHeader: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    color: '#FF3C4B',
    paddingLeft: 20,
    paddingTop: 11,
  },
  itemSub: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    textAlign: 'left',
    color: '#464646',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 11,
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
export default HotDealDetailScreen;
