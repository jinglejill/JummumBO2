import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,TouchableHighlight,Picker,ScrollView,Platform,ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import dateFormat from 'dateformat';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export class SpecialPriceSettingScreen extends Component
{
  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;

    {
      imageUrl = this.props.navigation.state.params.imageUrl;
      console.log("new date: "+new Date());
      console.log("branchID:"+branchID+", imageUrl:"+imageUrl);

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
        specialPrice: "",
        avatarSource: this.props.navigation.state.params.avatarSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        date: new Date(),
        showSpinner: false,
        goBack:false,
        specialPriceProgramID:0,
        isStartDatePickerVisible:false,
        isStartTimePickerVisible:false,
        isEndDatePickerVisible:false,
        isEndTimePickerVisible:false,
        startDate:" วันเริ่มต้น",
        startTime:" 00:00",
        endDate:" วันสิ้นสุด",
        endTime:" 23:59",
        mondaySelected: true,
        tuesdaySelected: true,
        wednesdaySelected: true,
        thursdaySelected: true,
        fridaySelected: true,
        saturdaySelected: true,
        sundaySelected: true,
        specialPriceProgram: [],
        showEditButton:false,
      };
    }
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
    this.loadSpecialPriceProgram();
  }

  loadSpecialPriceProgram = () =>
  {
    this.setState({showSpinner:true});
    fetch(this.state.dataUrl + 'JBOSpecialPriceProgramGetList.php',
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
    .then((responseData) => {
      this.setState({showSpinner:false});
      if(responseData.success == true)
      {
        console.log(responseData);
        this.setState({specialPriceProgram:responseData.data.SpecialPriceProgram});
        showEditButton = responseData.data.SpecialPriceProgram.length > 0;
        this.setState({showEditButton:showEditButton});
      }

    }).done();
  }
  _showStartDatePicker = () =>
  {
    this.setState({ isStartDatePickerVisible: true });
  }

  _showStartTimePicker = () =>
  {
    this.setState({ isStartTimePickerVisible: true });
  }

  _showEndDatePicker = () =>
  {
    this.setState({ isEndDatePickerVisible: true });
  }

  _showEndTimePicker = () =>
  {
    this.setState({ isEndTimePickerVisible: true });
  }

  _hideStartDatePicker = () =>
  {
    console.log("cancel date");
    this.setState({ isStartDatePickerVisible: false });
  }

  _hideStartTimePicker = () =>
  {
    console.log("cancel time");
    this.setState({ isStartTimePickerVisible: false });
  }

  _hideEndDatePicker = () =>
  {
    console.log("cancel date");
    this.setState({ isEndDatePickerVisible: false });
  }

  _hideEndTimePicker = () =>
  {
    console.log("cancel time");
    this.setState({ isEndTimePickerVisible: false });
  }

  _handleStartDatePicked = (date) => {
    console.log('A start date has been picked: ', date);
    this.setState({startDate:Moment(date).format('D MMM YYYY')});
    this._hideStartDatePicker();
  };

  _handleStartTimePicked = (date) => {
    console.log('A start time has been picked: ', date);
    this.setState({startTime:Moment(date).format('HH:mm')});
    this._hideStartTimePicker();
  };

  _handleEndDatePicked = (date) => {
    console.log('A end date has been picked: ', date);
    this.setState({endDate:Moment(date).format('D MMM YYYY')});
    this._hideEndDatePicker();
  };

  _handleEndTimePicked = (date) => {
    console.log('A end time has been picked: ', date);
    this.setState({endTime:Moment(date).format('HH:mm')});
    this._hideEndTimePicker();
  };

  triggerModal = (message, goBack) =>
  {
    this.setState({
      display: true,
      message: message,
      goBack: goBack,
    })
  }

  stringToDate = (_date,_format,_delimiter,_time,_timeDelimiter) =>
  {
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf(formatItems[1]);
    var dayIndex=formatItems.indexOf(formatItems[0]);
    var yearIndex=formatItems.indexOf(formatItems[2]);
    var month=dateItems[monthIndex];

    if(formatItems[1] == 'mmm')
    {
      if(month == 'Jan')
      {
        month = 1;
      }
      else if(month == 'Feb')
      {
        month = 2;
      }
      else if(month == 'Mar')
      {
        month = 3;
      }
      else if(month == 'Apr')
      {
        month = 4;
      }
      else if(month == 'May')
      {
        month = 5;
      }
      else if(month == 'Jun')
      {
        month = 6;
      }
      else if(month == 'Jul')
      {
        month = 7;
      }
      else if(month == 'Aug')
      {
        month = 8;
      }
      else if(month == 'Sep')
      {
        month = 9;
      }
      else if(month == 'Oct')
      {
        month = 10;
      }
      else if(month == 'Nov')
      {
        month = 11;
      }
      else if(month == 'Dec')
      {
        month = 12;
      }
    }
    else
    {
      month = parseInt(month);
    }
    month -= 1;

    var hour=parseInt(_time.split(_timeDelimiter)[0]);
    var minute=parseInt(_time.split(_timeDelimiter)[1]);
    var second=0;
    var millisecond=0;

    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex],hour,minute,second,millisecond);
    return formatedDate;
  }

    saveDetails = () => {
      if(this.state.specialPrice == "")
      {
        this.triggerModal("กรุณาใส่ราคาพิเศษ", false);
        return;
      }
      if(this.state.startDate == " วันเริ่มต้น")
      {
        this.triggerModal("กรุณาใส่วันเริ่มต้น", false);
        return;
      }
      if(this.state.endDate == " วันสิ้นสุด")
      {
        this.triggerModal("กรุณาใส่วันสิ้นสุด", false);
        return;
      }
      startDate = this.stringToDate(this.state.startDate,"D MMM YYYY"," ",this.state.startTime,":");
      endDate = this.stringToDate(this.state.endDate,"D MMM YYYY"," ",this.state.endTime,":");
      if(startDate >= endDate)
      {
        this.triggerModal("วัน-เวลาสิ้นสุด ต้องมากกว่าวัน-เวลาเริ่มต้น", false);
        return;
      }


      //เลือกอย่างน้อย 1 dayOfWeek
      if(!this.state.mondaySelected && !this.state.tuesdaySelected && !this.state.wednesdaySelected && !this.state.thursdaySelected && !this.state.fridaySelected && !this.state.saturdaySelected && !this.state.sundaySelected)
      {
        this.triggerModal("กรุณาเลือกวันที่ร่วมส่วนลด อย่างน้อย 1 วัน", false);
        return;
      }

      this.setState({showSpinner:true});
      fetch(this.state.dataUrl + 'JBOSpecialPriceProgramUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          menuID: this.state.menuID,
          specialPriceProgramID:this.state.specialPriceProgramID,
          specialPrice: this.state.specialPrice,
          startDate: dateFormat(startDate,'yyyy-mm-dd HH:MM:00'),
          endDate: dateFormat(endDate,'yyyy-mm-dd HH:MM:00'),
          day1: this.state.mondaySelected,
          day2: this.state.tuesdaySelected,
          day3: this.state.wednesdaySelected,
          day4: this.state.thursdaySelected,
          day5: this.state.fridaySelected,
          day6: this.state.saturdaySelected,
          day7: this.state.sundaySelected,
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
          this.setState({specialPriceProgram:responseData.data.SpecialPriceProgram});
          this.setState({specialPriceProgramID:0,specialPrice:"",startDate:"",startTime:"00:00",endDate:"",endTime:"23:59",mondaySelected:true,tuesdaySelected:true,wednesdaySelected:true,thursdaySelected:true,fridaySelected:true,saturdaySelected:true,sundaySelected:true});

          //show data
          this.triggerModal("บันทึกสำเร็จ", false);
        }
      }).done();
    }

    priceChanged = (text) =>
    {
      this.setState({ price: text.replace(/[^0-9]/g, ''),})
    }

    specialPriceChanged = (text) =>
    {
      this.setState({ specialPrice: text.replace(/[^0-9]/g, ''),})
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

    confirm = () =>
    {
      this.setState({displayConfirmBox:false});
      this.deleteSpecialPriceProgram();
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

    onChange = date => this.setState({ date })

    setMonday = () =>
    {
      this.setState({mondaySelected:!this.state.mondaySelected});
    }
    setTuesday = () =>
    {
      this.setState({tuesdaySelected:!this.state.tuesdaySelected});
    }
    setWednesday = () =>
    {
      this.setState({wednesdaySelected:!this.state.wednesdaySelected});
    }
    setThursday = () =>
    {
      this.setState({thursdaySelected:!this.state.thursdaySelected});
    }
    setFriday = () =>
    {
      this.setState({fridaySelected:!this.state.fridaySelected});
    }
    setSaturday = () =>
    {
      this.setState({saturdaySelected:!this.state.saturdaySelected});
    }
    setSunday = () =>
    {
      this.setState({sundaySelected:!this.state.sundaySelected});
    }

    editSpecialPriceProgram = (item) =>
    {
      startDate = this.stringToDate(item.StartDate,"DD/MM/YYYY","/",item.StartTime,":");
      endDate = this.stringToDate(item.EndDate,"DD/MM/YYYY","/",item.EndTime,":");

      this.setState({specialPriceProgramID:item.SpecialPriceProgramID,
        specialPrice:item.SpecialPrice,
        startDate:dateFormat(startDate,'d mmm yyyy'),
        startTime:item.StartTime,
        endDate:dateFormat(endDate,'d mmm yyyy'),
        endTime:item.EndTime,
        mondaySelected:item.MondaySelected,
        tuesdaySelected:item.TuesdaySelected,
        wednesdaySelected:item.WednesdaySelected,
        thursdaySelected:item.ThursdaySelected,
        fridaySelected:item.FridaySelected,
        saturdaySelected:item.SaturdaySelected,
        sundaySelected:item.SundaySelected});
    }

    confirmDeleteSpecialPriceProgram = (item) =>
    {
      this.setState({specialPriceProgramID:item.SpecialPriceProgramID});
      this.setState({displayConfirmBox:true,messageConfirmBox: '',
      messageTitleConfirmBox: 'ยืนยันลบส่วนลดนี้'});
    }

    deleteSpecialPriceProgram = () =>
    {
      this.setState({showSpinner:true});
      fetch(this.state.dataUrl + 'JBOSpecialPriceProgramDelete.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          menuID: this.state.menuID,
          specialPriceProgramID:this.state.specialPriceProgramID,
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
          this.setState({specialPriceProgram:responseData.data.SpecialPriceProgram});
          this.setState({specialPriceProgramID:0,specialPrice:"",startDate:"",startTime:"00:00",endDate:"",endTime:"23:59",mondaySelected:true,tuesdaySelected:true,wednesdaySelected:true,thursdaySelected:true,fridaySelected:true,saturdaySelected:true,sundaySelected:true});

          //show data
          this.triggerModal("บันทึกสำเร็จ", false);
        }
      }).done();
    }

    toggleEditButton = () =>
    {
      this.setState({showEditButton:!this.state.showEditButton});
    }

    render()
    {
      if(this.state.specialPriceProgram.length == 0)
      {
        specialPriceItem = (<View><Text style={[styles.label]}>-</Text></View>);
      }
      else
      {
        specialPriceItem = this.state.specialPriceProgram.map((item,index)=>(
          <View key={index}>
            <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginTop:10,alignItems:'center'}}>
              <Text style={[styles.label,{paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>เริ่ม</Text>
              <Text style={[styles.label,{paddingLeft:2,textAlign:'center',width:85}]}>{item.StartDate}</Text>
              <View style={{borderRadius:5,backgroundColor:'#64DCC8'}}>
                <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.StartTime}</Text>
              </View>
              <Text style={[styles.label,{paddingRight:20,textAlign:'right',color:"#FF3C4B",position:'absolute',width:Dimensions.get('window').width}]}>{item.SpecialPrice}</Text>
              {
                this.state.showEditButton?null:(<View style={{marginLeft:10}}>
                  <TouchableHighlight onPress={()=>this.editSpecialPriceProgram(item)} style={{borderRadius:5,backgroundColor:'#FF3C4B',width:40,height:25,justifyContent:'center',alignItems:'center'}}>
                    <View>
                      <Image
                        source={require("./../assets/images/pencil-edit-button-white.png")}
                        style={{width:15,height:15}}
                      />
                    </View>
                  </TouchableHighlight>
                </View>)
              }
            </View>
            <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginBottom:10,alignItems:'center'}}>
              <Text style={[styles.label,{paddingTop:10,paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>สิ้นสุด</Text>
              <Text style={[styles.label,{paddingTop:10,paddingLeft:2,textAlign:'center',width:85}]}>{item.EndDate}</Text>
              <View style={{marginTop:10,borderRadius:5,backgroundColor:'#64DCC8'}}>
                <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.EndTime}</Text>
              </View>
              <Text style={[styles.label,{paddingRight:20,paddingTop:10,fontSize:12,lineHeight:24,textAlign:'right',position:'absolute',width:Dimensions.get('window').width}]}>{item.DayJoin}</Text>
              {
                this.state.showEditButton?null:(<View style={{marginLeft:10,marginTop:10}}>
                  <TouchableHighlight onPress={()=>this.confirmDeleteSpecialPriceProgram(item)} style={{borderRadius:5,backgroundColor:'#FF3C4B',width:40,height:25,justifyContent:'center',alignItems:'center'}}>
                    <View>
                      <Image
                        source={require("./../assets/images/delete.png")}
                        style={{width:15,height:15}}
                      />
                    </View>
                  </TouchableHighlight>
                </View>)
              }
            </View>
            <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
          </View>));
      }
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
        <Text style={styles.label}>ชื่อเมนู</Text>
        <TextInput
          style={styles.textInput}
          placeholder=" ชื่อเมนู"
          editable={false} selectTextOnFocus={false}
          onChangeText={(text) => this.setState({ titleThai: text})}
          value={this.state.titleThai}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>ราคา</Text>
        <TextInput
          style={styles.textInput}
          placeholder=" ราคา"
          keyboardType="numeric"
          editable={false} selectTextOnFocus={false}
          onChangeText={(text) => this.priceChanged(text)}
          value={this.state.price}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ราคาพิเศษ</Text><Text style={[styles.label,{paddingLeft:0,color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
          style={[styles.textInput,{color:"#FF3C4B"}]}
          placeholder=" ราคาพิเศษ"
          keyboardType="numeric"
          onChangeText={(text) => this.specialPriceChanged(text)}
          value={this.state.specialPrice}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>วัน-เวลาเริ่มต้น</Text><Text style={[styles.label,{paddingLeft:0,color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',left:20, width:Dimensions.get('window').width-2*20}}>
          <TouchableOpacity onPress={this._showStartDatePicker} style={{width:(Dimensions.get('window').width-2*20-10)/2}}>
            <Text
              style={[styles.textInput,{lineHeight:28,left:0,width:(Dimensions.get('window').width-2*20-10)/2,
              color:this.state.startDate==" วันเริ่มต้น"?'#CCCCCC':'black'}]}>
              {this.state.startDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._showStartTimePicker}>
            <Text
              style={[styles.textInput,{lineHeight:28,left:0,width:(Dimensions.get('window').width-2*20-10)/2,
              color:this.state.startTime==" เวลาเริ่มต้น"?'#CCCCCC':'black'}]}>
              {this.state.startTime}</Text>
          </TouchableOpacity>
          <DateTimePicker
            mode='date'
            titleIOS='เลือกวันเริ่มต้น'
            titleStyle={styles.font}
            confirmTextStyle={styles.font}
            cancelTextStyle={styles.font}
            isVisible={this.state.isStartDatePickerVisible}
            onConfirm={this._handleStartDatePicked}
            onCancel={this._hideStartDatePicker}
          />
          <DateTimePicker
            mode='time'
            titleIOS='เลือกเวลาเริ่มต้น'
            titleStyle={styles.font}
            confirmTextStyle={styles.font}
            cancelTextStyle={styles.font}
            isVisible={this.state.isStartTimePickerVisible}
            onConfirm={this._handleStartTimePicked}
            onCancel={this._hideStartTimePicker}
          />
        </View>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>วัน-เวลาสิ้นสุด</Text><Text style={[styles.label,{paddingLeft:0,color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',left:20, width:Dimensions.get('window').width-2*20}}>
          <TouchableOpacity onPress={this._showEndDatePicker} style={{width:(Dimensions.get('window').width-2*20-10)/2}}>
            <Text
              style={[styles.textInput,{lineHeight:28,left:0,width:(Dimensions.get('window').width-2*20-10)/2,
              color:this.state.endDate==" วันสิ้นสุด"?'#CCCCCC':'black'}]}>
              {this.state.endDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._showEndTimePicker}>
            <Text
              style={[styles.textInput,{lineHeight:28,left:0,width:(Dimensions.get('window').width-2*20-10)/2,
              color:this.state.endTime==" เวลาสิ้นสุด"?'#CCCCCC':'black'}]}>
              {this.state.endTime}</Text>
          </TouchableOpacity>
          <DateTimePicker
            mode='date'
            titleIOS='เลือกวันสิ้นสุด'
            titleStyle={styles.font}
            confirmTextStyle={styles.font}
            cancelTextStyle={styles.font}
            isVisible={this.state.isEndDatePickerVisible}
            onConfirm={this._handleEndDatePicked}
            onCancel={this._hideEndDatePicker}
          />
          <DateTimePicker
            mode='time'
            titleIOS='เลือกเวลาสิ้นสุด'
            titleStyle={styles.font}
            confirmTextStyle={styles.font}
            cancelTextStyle={styles.font}
            isVisible={this.state.isEndTimePickerVisible}
            onConfirm={this._handleEndTimePicked}
            onCancel={this._hideEndTimePicker}
          />
        </View>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>วันที่ร่วมส่วนลด</Text><Text style={[styles.label,{paddingLeft:0,color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',left:15, width:Dimensions.get('window').width-2*20}}>
          <TouchableHighlight underlayColor='transparent' onPress={this.setMonday} style={[styles.buttonDay,{backgroundColor:this.state.mondaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.mondaySelected?"#FFFFFF":"#64DCC8"}]}>จันทร์</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setTuesday} style={[styles.buttonDay,{backgroundColor:this.state.tuesdaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.tuesdaySelected?"#FFFFFF":"#64DCC8"}]}>อังคาร</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setWednesday} style={[styles.buttonDay,{backgroundColor:this.state.wednesdaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.wednesdaySelected?"#FFFFFF":"#64DCC8"}]}>พุธ</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setThursday} style={[styles.buttonDay,{backgroundColor:this.state.thursdaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.thursdaySelected?"#FFFFFF":"#64DCC8"}]}>พฤหัส</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setFriday} style={[styles.buttonDay,{backgroundColor:this.state.fridaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.fridaySelected?"#FFFFFF":"#64DCC8"}]}>ศุกร์</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setSaturday} style={[styles.buttonDay,{backgroundColor:this.state.saturdaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.saturdaySelected?"#FFFFFF":"#64DCC8"}]}>เสาร์</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='transparent' onPress={this.setSunday} style={[styles.buttonDay,{backgroundColor:this.state.sundaySelected?"#64DCC8":"#FFFFFF"}]}>
            <Text style={[styles.textDay,{color:this.state.sundaySelected?"#FFFFFF":"#64DCC8"}]}>อาทิตย์</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.label}></Text>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <Text style={[styles.label,{fontFamily:'Prompt-SemiBold',color:"#222222"}]}>รายการตั้งค่าส่วนลด</Text>
          <TouchableHighlight underlayColor='transparent' onPress={this.toggleEditButton} style={[styles.buttonEdit,{backgroundColor:this.state.showEditButton?"#FF3C4B":"#FFFFFF"}]}>
            <Text style={[styles.textEdit,{color:this.state.showEditButton?"#FFFFFF":"#FF3C4B"}]}>แก้ไข</Text>
          </TouchableHighlight>
        </View>
        {specialPriceItem}
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
    paddingLeft:20,
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
  },
  font: {
    fontFamily: "Prompt-Regular",
    color: "#005A50"
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
  buttonDay:
  {
    width:70,
    height:30,
    borderWidth:1,
    borderColor:"#64DCC8",
    borderRadius:20,
    marginLeft:5,
    marginRight:5,
    marginBottom:5,
  },
  textDay:
  {
    textAlign:'center',fontFamily:'Prompt-SemiBold',lineHeight:28,color:"#FFFFFF"
  },
  buttonEdit:
  {
    height:25,
    width:50,
    borderColor:"#FF3C4B",
    borderWidth:1,
    borderRadius:5,
    position:'absolute',
    right:20
  },
  textEdit:
  {
    textAlign:'center',
    fontFamily:'Prompt-SemiBold',
    lineHeight:24
  },

});
export default SpecialPriceSettingScreen;
