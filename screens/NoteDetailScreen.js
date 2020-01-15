import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,TouchableHighlight,Picker,ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';


export class NoteDetailScreen extends Component
{
  constructor(props)
  {
    super(props);

    wordAdd = this.props.navigation.state.params.wordAdd;
    wordNo = this.props.navigation.state.params.wordNo;
    wordAddValue = this.props.navigation.state.params.wordAddValue;
    wordNoValue = this.props.navigation.state.params.wordNoValue;
    statusOptions = [];
    statusOptions.push({value:-1, label:(wordNoValue +" ("+ wordNo+")")});
    statusOptions.push({value:1, label:(wordAddValue +" ("+ wordAdd+")")});

    branchID = this.props.navigation.state.params.branchID;
    if(this.props.navigation.state.params.noteID == 0)//new
    {
      newNote = true;
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newNote: newNote,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        noteID: 0,
        name: "",
        nameEn: "",
        price: "",
        type: 1,
        noteTypeID: this.props.navigation.state.params.noteTypeID,
        showSpinner: false,
        status: 1,
        statusOptions: statusOptions
      };
    }
    else
    {
      newNote = false;

      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newNote: newNote,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        noteTypeID: this.props.navigation.state.params.noteTypeID,
        noteID: this.props.navigation.state.params.noteID,
        name: this.props.navigation.state.params.name,
        nameEn: this.props.navigation.state.params.nameEn,
        price: this.props.navigation.state.params.price,
        type: parseInt(this.props.navigation.state.params.type),
        showSpinner: false,
        goBack:false,
        status: this.props.navigation.state.params.status,
        statusOptions: statusOptions
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
      this.triggerModal("กรุณาใส่ชื่อโน้ต", false);
      return;
    }
    if(this.state.nameEn == "")
    {
      this.triggerModal("กรุณาใส่ชื่อโน้ต(อังกฤษ)", false);
      return;
    }


    this.setState({showSpinner:true});
    fetch(this.state.dataUrl + 'JBONoteUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        noteTypeID:this.state.noteTypeID,
        noteID: this.state.noteID,
        name: this.state.name,
        nameEn: this.state.nameEn,
        price: this.state.price,
        type: this.state.type,
        status: this.state.status,
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

  priceChanged = (text) =>
  {
    this.setState({ price: text.replace(/[^0-9]/g, ''),})
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

  copy = () =>
  {
    this.setState({"nameEn":this.state.name});
  }

  getItems = () => {
    var items = [];
    this.state.statusOptions.map((statusOption)=>
    {
      items.push(<Picker.Item label={statusOption.label} value={statusOption.value} />);
    })
    return items;
  }

  render()
  {
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>ชื่อโน้ต</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <TextInput
          style={[styles.textInput,{width:Dimensions.get('window').width-2*20 - 10 - 50}]}
          placeholder=" ชื่อโน้ต"
          onChangeText={(text) => this.setState({ name: text})}
          value={this.state.name}
          />
          <TouchableHighlight onPress={()=>this.copy()}
            style={{
              flex:1,
              borderRadius:5,
              backgroundColor:'#64DCC8',
              width:50,
              height:30,
              justifyContent:'center',
              alignItems:'center',
              position:'absolute',
              right:20
            }}>
            <View>
              <Image
                source={require("./../assets/images/copy.png")}
                style={{width:20,height:20}}
              />
            </View>
          </TouchableHighlight>
        </View>
        <Text></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>ชื่อโน้ต(อังกฤษ)</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={[styles.textInput]}
        placeholder=" ชื่อโน้ต(อังกฤษ)"
        onChangeText={(text) => this.setState({ nameEn: text})}
        value={this.state.nameEn}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ราคา</Text>
        </View>
        <TextInput
        style={styles.textInput}
        placeholder=" ราคา"
        keyboardType="numeric"
        onChangeText={(text) => this.priceChanged(text)}
        value={this.state.price}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>ประเภท</Text>
        {Platform.OS === 'android'?(<View style={styles.textInput}><Picker
          selectedValue={this.state.type}
          style={{
          width: Dimensions.get('window').width-2*20,
          height: 20}}
          onValueChange={(value)=>{this.setState({type:value})}}
          >
          {this.getItems()}
        </Picker></View>):(
        <SelectInput
          style={styles.selectInput}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:28}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular"}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.setState({type:value})}}
          value={this.state.type}
          options={this.state.statusOptions}  />)}
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
export default NoteDetailScreen;
