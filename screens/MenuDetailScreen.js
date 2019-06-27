import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,Picker,ScrollView,ActionSheetIOS,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import ImagePicker from 'react-native-image-crop-picker';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


const statusOptions = [
  { value: 1, label: 'ใช้งานอยู่' },
  { value: 2, label: 'ของหมด' },
  { value: 3, label: 'ยังไม่เริ่มใช้' },
  { value: 0, label: 'ยกเลิกการใช้งาน' }
]


export class MenuDetailScreen extends Component
{
  menuOptions = [<Text style={styles.actionSheet}>เมนูหลัก</Text>, <Text style={styles.actionSheet}>เมนูอื่นๆ</Text>, <Text style={styles.actionSheet}>เมนูไม่ได้ใช้</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>];
  imageOptions = [<Text style={styles.actionSheet}>Choose from Library...</Text>, <Text style={styles.actionSheet}>Take Photo...</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>];

  showActionSheet = () =>
  {
    console.log("show actionSheet");
    this.ActionSheet.show()
  }

  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
    if(this.props.navigation.state.params.menuID == 0)//new
    {
      newMenu = true;
      imageSource = require("./../assets/images/NoImage.jpg");
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newMenu: newMenu,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
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
        asType:1,//1=image,2=menu
        asOptions:this.imageOptions,
        asCancelButtonIndex:2,
        asDestructiveButtonIndex:2,
        showSpinner: false,
        status: 1,
      };
    }
    else
    {
      newMenu = false;
      imageUrl = this.props.navigation.state.params.imageUrl;
      if(imageUrl == "")
      {
        imageSource = require("./../assets/images/NoImage.jpg");
      }
      else
      {
        uri = this.props.navigation.state.params.dataUrl + 'JBODownloadImageGet.php?branchID='+branchID+'&imageFileName='+imageUrl+'&type=1';
        imageSource = {uri:uri};
      }
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newMenu: newMenu,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        menuID: this.props.navigation.state.params.menuID,
        titleThai: this.props.navigation.state.params.titleThai,
        price: this.props.navigation.state.params.price,
        recommended: this.props.navigation.state.params.recommended,
        buffetMenu: this.props.navigation.state.params.buffetMenu,
        alacarteMenu: this.props.navigation.state.params.alacarteMenu,
        timeToOrder: this.props.navigation.state.params.timeToOrder,
        imageUrl: imageUrl,
        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        asType:1,//1=image,2=menu
        asOptions:this.imageOptions,
        asCancelButtonIndex:2,
        asDestructiveButtonIndex:2,
        showSpinner: false,
        goBack:false,
        status: this.props.navigation.state.params.status,
      };
    }
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  asOnPress = (buttonIndex) =>
  {
    console.log("asOnPress");
    if(this.state.asType == 1)
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

          const source = { uri: image.path };
          //
          // // You can also display the image using data:
          // // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            avatarSource: source,
            imageBase64: image.data,
            imageChanged: true,
            imageType: image.mime.split("/")[1],
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
            imageType: image.mime.split("/")[1],
          });
        })
        .catch(error =>
        {
          // add this to your code
          if(this.state.displayTypeChanging)
          {
            this.setState({displayTypeChanging:false});
          }
        });
      }
      else if (buttonIndex === 2)
      {
        console.log("cancel choosing image");
      }
    }
    else if(this.state.asType == 2)
    {
      if (buttonIndex === 0) {
        this.props.navigation.navigate('MenuByTopicScreen',
         {
           'dataUrl': this.props.navigation.state.params.dataUrl,
           'branchID': this.props.navigation.state.params.branchID,
           'username': this.props.navigation.state.params.username,
           'category': 0,
           'menuTopic': 0,
           'buffetMenuID': this.state.menuID,
           onGoBack:(buffetMenuID)=>this.props.navigation.state.params.onGoBack(),
         }
       );
      }
      else if (buttonIndex === 1) {
        this.props.navigation.navigate('MenuByTopicScreen',
         {
           'dataUrl': this.props.navigation.state.params.dataUrl,
           'branchID': this.props.navigation.state.params.branchID,
           'username': this.props.navigation.state.params.username,
           'category': 0,
           'menuTopic': 1,
           'buffetMenuID': this.state.menuID,
           onGoBack:(buffetMenuID)=>this.props.navigation.state.params.onGoBack(),
         }
       );
      }
      else if (buttonIndex === 2) {
        this.props.navigation.navigate('MenuByTopicScreen',
         {
           'dataUrl': this.props.navigation.state.params.dataUrl,
           'branchID': this.props.navigation.state.params.branchID,
           'username': this.props.navigation.state.params.username,
           'category': 0,
           'menuTopic': 2,
           'buffetMenuID': this.state.menuID,
           onGoBack:(buffetMenuID)=>this.props.navigation.state.params.onGoBack(),
         }
       );
      }
      else if(buttonIndex === 2) {
        console.log("cancel choose menu");
      }
    }
  }

  chooseImage = () =>
  {
    this.setState({asType:1});
    this.setState({asCancelButtonIndex:2});
    this.setState({asDestructiveButtonIndex:2});
    this.setState({asOptions:this.imageOptions});

    this.showActionSheet();

  }

  triggerModal = (message, goBack) =>
  {
    console.log("triggerModal:"+message);
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  saveDetails = () => {
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
    this.setState({ timeToOrder: text.replace(/[^0-9]/g, ''),})
  }

  onClose = () =>
  {
    console.log("on close click");
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
        console.log("delete menu success 0 display:"+this.state.display);
        this.triggerModal("ลบเมนูสำเร็จ", true);
        console.log("delete menu success 1 display:"+this.state.display);
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
      'dataUrl': this.props.navigation.state.params.dataUrl,
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
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'category': 0,
      'buffetMenuID': this.state.menuID,
    });
  }

  selectMenuTopic = () =>
  {
    this.setState({asType:2});
    this.setState({asCancelButtonIndex:3});
    this.setState({asDestructiveButtonIndex:3});
    this.setState({asOptions:this.menuOptions});

    console.log("selectMenuTopic");
    this.showActionSheet();
  }

  viewNote = () =>
  {
    this.props.navigation.navigate('NoteViewScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID': this.state.menuID,
    });
  }

  selectNote = () =>
  {
    this.props.navigation.navigate('NoteSelectScreen',
     {
       'dataUrl': this.props.navigation.state.params.dataUrl,
       'branchID': this.props.navigation.state.params.branchID,
       'username': this.props.navigation.state.params.username,
       'menuID': this.state.menuID
     }
    );
  }

  copyMenu = () =>
  {
    fetch(this.state.dataUrl + 'JBOMenuCopyInsert.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        // menuTypeID:this.state.menuTypeID,
        menuID: this.state.menuID,
        titleThai: this.state.titleThai,
        imageUrl: this.state.imageUrl,
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
        this.triggerModal("คัดลอกสำเร็จ", false);

        imageUrl = responseData.data.Menu.ImageUrl;
        if(imageUrl == "")
        {
          imageSource = require("./../assets/images/NoImage.jpg");
        }
        else
        {
          uri = this.props.navigation.state.params.dataUrl + 'JBODownloadImageGet.php?branchID='+branchID+'&imageFileName='+imageUrl+'&type=1';
          imageSource = {uri:uri};
        }

        this.setState(
          {
            dataUrl: this.props.navigation.state.params.dataUrl,
            newMenu: this.state.newMenu,
            // display: false,
            // displayConfirmBox: false,
            // message: '',
            // messageTitle: '',
            // messageConfirmBox: '',
            // messageTitleConfirmBox: '',
            username: this.props.navigation.state.params.username,
            branchID: this.props.navigation.state.params.branchID,
            menuID: responseData.data.Menu.MenuID,
            titleThai: responseData.data.Menu.TitleThai,
            price: responseData.data.Menu.Price,
            recommended: responseData.data.Menu.Recommended,
            buffetMenu: responseData.data.Menu.BuffetMenu,
            alacarteMenu: responseData.data.Menu.AlacarteMenu,
            timeToOrder: responseData.data.Menu.TimeToOrder,
            avatarSource: imageSource,
            imageBase64: "",
            imageChanged: false,
            imageType: "",
            // asType:1,//1=image,2=menu
            // asOptions:this.imageOptions,
            // asCancelButtonIndex:2,
            // asDestructiveButtonIndex:2,
            // showSpinner: false,
            // goBack:false,
            status: responseData.data.Menu.Status,
          });
      }
    }).done();
  }

  render()
  {
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text></Text>
        <TouchableOpacity
          onPress={ () => this.chooseImage()}
          style={{alignItems:'center'}}
        >
        <Image
          source={this.state.avatarSource}
          style={{width:150,height:150,borderRadius:10}}
        />
        </TouchableOpacity>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ชื่อเมนู</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={[styles.textInput,{height:55}]}
        placeholder=" ชื่ออาหาร"
        onChangeText={(text) => this.setState({ titleThai: text})}
        value={this.state.titleThai}
        multiline={true}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ราคา</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={styles.textInput}
        placeholder=" ราคา"
        keyboardType="numeric"
        onChangeText={(text) => this.priceChanged(text)}
        value={this.state.price}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>สถานะ</Text>
        <SelectInput
          style={[styles.selectInput]}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:Platform.OS === 'android'?null:28}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular"}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.setState({status:value})}}
          value={this.state.status}
          options={statusOptions}  />

        <Text style={styles.label}></Text>
        <CheckBox
          title='เมนูหลัก'
          checked={this.state.alacarteMenu}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.alacarteMenuClick}
          checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
          uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
        />

        {this.state.alacarteMenu?(
        <View style={{display:'flex',flexDirection:'row', width:Dimensions.get('window').width}}>
          <View>
            <CheckBox
              title='เมนูบุฟเฟ่ต์'
              checked={this.state.buffetMenu}
              checkedColor='#64DCC8'
              containerStyle={[styles.checkBoxContainer]}
              textStyle={styles.checkBoxText}
              onPress={this.buffetMenuClick}
              checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
              uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
            />
          </View>
          {
            this.state.buffetMenu?(<View style={{flex:1,justifyContent:'center'}}>
              <Text style={[styles.label,{left:null}]}>เวลาในการสั่งบุฟเฟ่ต์​ (นาที)</Text>
              <TextInput
              style={[styles.textInput,{left:null,width:100}]}
              keyboardType="numeric"
              editable={this.state.buffetMenu}
              onChangeText={(text) => this.timeToOrderChanged(text)}
              value={this.state.timeToOrder+""}
              />
            </View>):null
          }
        </View>):null}

        <CheckBox
          title='แนะนำ'
          checked={this.state.recommended}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.recommendedClick}
          checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
          uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
        />
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.viewNote} title="ดูโน้ต"/>
        <Text style={styles.label}></Text>
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.selectNote} title="ตั้งค่าโน้ต"/>
        <Text style={styles.label}></Text>
        {
          this.state.buffetMenu?(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.viewMenuBelongToBuffet} title="ดูเมนูของบุฟเฟ่ต์"/>):null
        }
        {
          this.state.buffetMenu?(<Text style={styles.label}></Text>):null
        }
        {
          this.state.buffetMenu?(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.selectMenuTopic} title="ตั้งค่าเมนูของบุฟเฟ่ต์"/>):null
        }
        {
          this.state.buffetMenu?(<Text style={styles.label}></Text>):null
        }
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.setSpecialPrice} title="ตั้งค่าส่วนลด"/>
        <Text style={styles.label}></Text>
        <Button buttonStyle={this.state.newMenu?styles.hide:styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.copyMenu} title="คัดลอกเมนูนี้"/>
        <Text style={styles.label}></Text>
        <Button buttonStyle={this.state.newMenu?styles.hide:styles.button} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.confirmDelete} title="ลบเมนูนี้"/>
        <Text style={styles.label}></Text>
        <MessageBox
          display={this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={()=>this.onClose()}
        />
        <MessageBoxConfirm
          display={this.state.displayConfirmBox}
          message={this.state.messageConfirmBox}
          messageTitle={this.state.messageTitleConfirmBox}
          onConfirm={this.confirm}
          onCancel={this.cancel}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={this.state.asOptions}
          cancelButtonIndex={this.state.asCancelButtonIndex}
          destructiveButtonIndex={this.state.asDestructiveButtonIndex}
          onPress={(index) => {  this.asOnPress(index) }}
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
    height: 30,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 0
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
  buttonText:{fontFamily: 'Prompt-SemiBold',color: '#64DCC8'},
  actionSheet:
  {
    fontFamily:'Prompt-Regular',
    fontSize:18,
    color:'#005A50'
  }
});
export default MenuDetailScreen;
