import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,Picker,ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';


export class MenuBelongToBuffetDetailScreen extends Component
{
  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
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
        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        showSpinner: false,
        goBack:false,
      };
    }
  }

  componentDidMount()
  {
    // this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

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
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack(null);
      }
      else
      {
        this.setState({display:false});
      }
    }

    render()
    {
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text></Text>
        <TouchableOpacity
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
        editable = {false}
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
        editable = {false}
        />
        <Text style={styles.label}></Text>
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
export default MenuBelongToBuffetDetailScreen;
