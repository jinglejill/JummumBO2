import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,TouchableHighlight,Picker,ScrollView,ActionSheetIOS,Platform,ActivityIndicator } from 'react-native';
import { CheckBox, ButtonGroup } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import dateFormat from 'dateformat';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


console.disableYellowBox = true;
const segments = [
  'เต็มจอ',
  'ด้านข้าง'
];


export class LuckyDrawDetailScreen extends Component
{
  menuOptions = [<Text style={styles.actionSheet}>เมนูหลัก</Text>, <Text style={styles.actionSheet}>เมนูอื่นๆ</Text>, <Text style={styles.actionSheet}>เมนูไม่ได้ใช้</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>];
  imageOptions = [<Text style={styles.actionSheet}>Choose from Library...</Text>, <Text style={styles.actionSheet}>Take Photo...</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>];

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  constructor(props)
  {
    super(props);


    branchID = this.props.navigation.state.params.branchID;
    if(this.props.navigation.state.params.rewardRedemptionID == 0)//new
    {
      newLuckyDraw = true;
      displayType = 0;
      if(displayType == 0)
      {
        imageSource = require("./../assets/images/NoImage16_9.jpg");
      }
      else if(displayType == 1)
      {
        imageSource = require("./../assets/images/NoImage4_3.jpg");
      }

      discountTypeOptions = this.props.navigation.state.params.discountTypeOptions;
      discountType = 1;
      discountTypeOptions.map((discountTypeOption)=>
      {
        if(discountTypeOption.value == discountType)
        {
          amountLabel = discountTypeOption.amountLabel;
          minimumSpendActive = discountTypeOption.minimumSpendActive;
          minimumSpendLabel = discountTypeOption.minimumSpendLabel;
          stepActive = discountTypeOption.stepActive;
          twoStepSelected = discountTypeOption.twoStepSelected;
          threeStepSelected = discountTypeOption.threeStepSelected;
          stepSpendLabel = discountTypeOption.stepSpendLabel;
          stepAmountLabel = discountTypeOption.stepAmountLabel;
          stepMaxDiscountActive = discountTypeOption.stepMaxDiscountActive;
          stepMaxDiscountLabel = discountTypeOption.stepMaxDiscountLabel;
        }
      });

      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newLuckyDraw: newLuckyDraw,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,

        rewardRedemptionID:0,
        header: "",
        subTitle: "",
        termsConditions: "",
        showTermsConditions: false,
        displayType:displayType,
        // displayTypeChanging:false,
        isStartDatePickerVisible:false,
        isStartTimePickerVisible:false,
        isEndDatePickerVisible:false,
        isEndTimePickerVisible:false,
        startDate:" วันเริ่มต้น",
        startTime:" 00:00",
        endDate:" วันสิ้นสุด",
        endTime:" 23:59",
        discountType:discountType,
        amountLabel:amountLabel,
        // title:"",
        detail:"",
        discountAmount:"",
        minimumSpending:"",
        minimumSpendActive:minimumSpendActive,
        minimumSpendLabel:minimumSpendLabel,
        stepActive:stepActive,
        twoStepSelected:twoStepSelected,
        threeStepSelected:threeStepSelected,
        stepSpendLabel:stepSpendLabel,
        stepAmountLabel:stepAmountLabel,
        stepMaxDiscountActive:stepMaxDiscountActive,
        stepMaxDiscountLabel:stepMaxDiscountLabel,
        firstStepSpend:"",
        firstStepAmount:"",
        firstStepMaxDiscount:"",
        secondStepSpend:"",
        secondStepAmount:"",
        secondStepMaxDiscount:"",
        thirdStepSpend:"",
        thirdStepAmount:"",
        thirdStepMaxDiscount:"",
        // noOfLimitUse:"",
        // noOfLimitUsePerUser:"",
        // noOfLimitUsePerUserPerDay:"",
        discountGroupMenuID:0,
        discountStepID:-1,
        discountOnTop:false,
        discountTypeOptions:discountTypeOptions,
        discountGroup:true,
        imageUrl:"",


        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",

        // mondaySelected: true,
        // tuesdaySelected: true,
        // wednesdaySelected: true,
        // thursdaySelected: true,
        // fridaySelected: true,
        // saturdaySelected: true,
        // sundaySelected: true,

        asType:1,//1=image,2=menu
        asOptions:this.imageOptions,
        asCancelButtonIndex:2,
        asDestructiveButtonIndex:2,

        rewardRank:1,
        withInPeriodDay:'21',
        withInPeriodHour:'',
        withInPeriodMinute:'',
        numberOfVoucherCode:'100',
        showSpinner: false,
      };
    }
    else
    {
      newLuckyDraw = false;
      displayType = 0;
      imageUrl = this.props.navigation.state.params.imageUrl;
      if(imageUrl == "")
      {
        if(displayType == 0)
        {
          imageSource = require("./../assets/images/NoImage16_9.jpg");
        }
        else if(displayType == 1)
        {
          imageSource = require("./../assets/images/NoImage4_3.jpg");
        }
      }
      else
      {
        uri = this.props.navigation.state.params.dataUrl + 'JBODownloadImageGet.php?branchID='+branchID+'&imageFileName='+imageUrl+'&type=4';
        imageSource = {uri:uri};
      }

      //date
      startDate = this.stringToDate(this.props.navigation.state.params.startDate,"DD/MM/YYYY","/",this.props.navigation.state.params.startTime,":");
      startDate = dateFormat(startDate,'d mmm yyyy');
      endDate = this.stringToDate(this.props.navigation.state.params.endDate,"DD/MM/YYYY","/",this.props.navigation.state.params.endTime,":");
      endDate = dateFormat(endDate,'d mmm yyyy');

      startTime = this.props.navigation.state.params.startTime;
      endTime = this.props.navigation.state.params.endTime;


      //minimumSpend
      minimumSpend = this.props.navigation.state.params.minimumSpending;
      // noOfLimitUse = this.props.navigation.state.params.noOfLimitUse
      // noOfLimitUsePerUser = this.props.navigation.state.params.noOfLimitUsePerUser;
      // noOfLimitUsePerUserPerDay = this.props.navigation.state.params.noOfLimitUsePerUserPerDay;

      minimumSpend = minimumSpend == "0"?"":minimumSpend;
      // noOfLimitUse = noOfLimitUse == "0"?"":noOfLimitUse;
      // noOfLimitUsePerUser = noOfLimitUsePerUser == "0"?"":noOfLimitUsePerUser;
      // noOfLimitUsePerUserPerDay = noOfLimitUsePerUserPerDay == "0"?"":noOfLimitUsePerUserPerDay;

      discountTypeOptions = this.props.navigation.state.params.discountTypeOptions;
      discountType = this.props.navigation.state.params.discountType;
      discountTypeOptions.map((discountTypeOption)=>
      {
        if(discountTypeOption.value == discountType)
        {
          amountLabel = discountTypeOption.amountLabel;
          minimumSpendActive = discountTypeOption.minimumSpendActive;
          minimumSpendLabel = discountTypeOption.minimumSpendLabel;
          stepActive = discountTypeOption.stepActive;
          stepSpendLabel = discountTypeOption.stepSpendLabel;
          stepAmountLabel = discountTypeOption.stepAmountLabel;
          stepMaxDiscountActive = discountTypeOption.stepMaxDiscountActive;
          stepMaxDiscountLabel = discountTypeOption.stepMaxDiscountLabel;
        }
      });

      withInPeriodDay = Math.floor(parseInt(this.props.navigation.state.params.withInPeriod)/(60*60*24));
      withInPeriodHour = Math.floor((parseInt(this.props.navigation.state.params.withInPeriod)%(60*60*24))/(60*60));
      withInPeriodMinute = Math.floor((parseInt(this.props.navigation.state.params.withInPeriod)%(60*60*24)%(60*60))/60);

      withInPeriodDay = withInPeriodDay == 0?"":withInPeriodDay+'';
      withInPeriodHour = withInPeriodHour == 0?"":withInPeriodHour+'';
      withInPeriodMinute = withInPeriodMinute == 0?"":withInPeriodMinute+'';
      console.log('withInPeriod:'+this.props.navigation.state.params.withInPeriod);
      console.log('withInPeriodDay:'+withInPeriodDay);
      console.log('withInPeriodHour:'+withInPeriodHour);
      console.log('withInPeriodMinute:'+withInPeriodMinute);
      this.state = {
        dataUrl: this.props.navigation.state.params.dataUrl,
        newLuckyDraw: newLuckyDraw,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,

        rewardRedemptionID:this.props.navigation.state.params.rewardRedemptionID,
        header: this.props.navigation.state.params.header,
        subTitle: this.props.navigation.state.params.subTitle,
        termsConditions: this.props.navigation.state.params.termsConditions,
        showTermsConditions: false,
        displayType:displayType,
        // displayTypeChanging:false,
        isStartDatePickerVisible:false,
        isStartTimePickerVisible:false,
        isEndDatePickerVisible:false,
        isEndTimePickerVisible:false,
        startDate:startDate,
        startTime:startTime,
        endDate:endDate,
        endTime:endTime,
        discountType:parseInt(discountType),
        amountLabel:amountLabel,
        // title:this.props.navigation.state.params.title,
        detail:this.props.navigation.state.params.detail,
        discountAmount:this.props.navigation.state.params.discountAmount,
        minimumSpending:minimumSpend,
        minimumSpendActive:minimumSpendActive,
        minimumSpendLabel:minimumSpendLabel,
        stepActive:stepActive,
        stepSpendLabel:stepSpendLabel,
        stepAmountLabel:stepAmountLabel,
        stepMaxDiscountActive:stepMaxDiscountActive,
        stepMaxDiscountLabel:stepMaxDiscountLabel,
        // noOfLimitUse:noOfLimitUse,
        // noOfLimitUsePerUser:noOfLimitUsePerUser,
        // noOfLimitUsePerUserPerDay:noOfLimitUsePerUserPerDay,
        discountGroupMenuID:this.props.navigation.state.params.discountGroupMenuID,
        discountStepID:this.props.navigation.state.params.discountStepID,
        discountOnTop:JSON.parse(this.props.navigation.state.params.discountOnTop),
        discountTypeOptions:this.props.navigation.state.params.discountTypeOptions,
        discountGroup:this.props.navigation.state.params.discountGroupMenuID == 0,
        // mondaySelected:this.props.navigation.state.params.mondaySelected,
        // tuesdaySelected:this.props.navigation.state.params.tuesdaySelected,
        // wednesdaySelected:this.props.navigation.state.params.wednesdaySelected,
        // thursdaySelected:this.props.navigation.state.params.thursdaySelected,
        // fridaySelected:this.props.navigation.state.params.fridaySelected,
        // saturdaySelected:this.props.navigation.state.params.saturdaySelected,
        // sundaySelected:this.props.navigation.state.params.sundaySelected,
        imageUrl:this.props.navigation.state.params.imageUrl,

        twoStepSelected:this.props.navigation.state.params.twoStepSelected,
        threeStepSelected:this.props.navigation.state.params.threeStepSelected,
        firstStepSpend:this.props.navigation.state.params.firstStepSpend,
        firstStepAmount:this.props.navigation.state.params.firstStepAmount,
        firstStepMaxDiscount:this.props.navigation.state.params.firstStepMaxDiscount,
        secondStepSpend:this.props.navigation.state.params.secondStepSpend,
        secondStepAmount:this.props.navigation.state.params.secondStepAmount,
        secondStepMaxDiscount:this.props.navigation.state.params.secondStepMaxDiscount,
        thirdStepSpend:this.props.navigation.state.params.thirdStepSpend,
        thirdStepAmount:this.props.navigation.state.params.thirdStepAmount,
        thirdStepMaxDiscount:this.props.navigation.state.params.thirdStepMaxDiscount,

        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",

        asType:1,//1=image,2=menu
        asOptions:this.imageOptions,
        asCancelButtonIndex:2,
        asDestructiveButtonIndex:2,

        rewardRank:parseInt(this.props.navigation.state.params.rewardRank),
        withInPeriodDay:withInPeriodDay,
        withInPeriodHour:withInPeriodHour,
        withInPeriodMinute:withInPeriodMinute,
        numberOfVoucherCode:this.props.navigation.state.params.numberOfVoucherCode,
        showSpinner: false,
        goBack:false,
      };
    }
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  chooseImage = () =>
  {
    this.setState({asType:1});
    this.setState({asCancelButtonIndex:2});
    this.setState({asDestructiveButtonIndex:2});
    this.setState({asOptions:this.imageOptions});

    this.showActionSheet();

  }

  asOnPress = (buttonIndex) =>
  {
    if(this.state.asType == 1)
    {
      if (buttonIndex === 0)
      {
        ImagePicker.openPicker({
          width: this.state.displayType == 0?1920:1080/3*4,
          height: 1080,
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
            imageType: image.mime.split("/")[1],
            imageUrl: image.path,
            displayTypeChanging:true
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
          width: this.state.displayType == 0?1920:1080/3*4,
          height: 1080,
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
            imageUrl: image.path,
            displayTypeChanging:true
          });
        })
        .catch(error =>
        {
          // add this to your code
          if(this.state.displayTypeChanging)
          {
            if(this.state.displayType == 0)
            {
              this.setState({displayType:1});
            }
            else
            {
              this.setState({displayType:0});
            }
            this.setState({displayTypeChanging:false});
          }
        });
      }
      else if (buttonIndex === 2)
      {
        console.log("cancel choosing image");
        if(this.state.displayTypeChanging)
        {
          if(this.state.displayType == 0)
          {
            this.setState({displayType:1});
          }
          else
          {
            this.setState({displayType:0});
          }
          this.setState({displayTypeChanging:false});
        }
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
           'category': 1,
           'menuTopic': 0,
           'discountGroupMenuID': this.state.discountGroupMenuID,
           onGoBack:(discountGroupMenuID)=>this.updateDiscountGroupMenuID(discountGroupMenuID)
         }
       );
      }
      else if (buttonIndex === 1) {
        this.props.navigation.navigate('MenuByTopicScreen',
         {
           'dataUrl': this.props.navigation.state.params.dataUrl,
           'branchID': this.props.navigation.state.params.branchID,
           'username': this.props.navigation.state.params.username,
           'category': 1,
           'menuTopic': 1,
           'discountGroupMenuID': this.state.discountGroupMenuID,
           onGoBack:(discountGroupMenuID)=>this.updateDiscountGroupMenuID(discountGroupMenuID)
         }
       );
      }
      else if (buttonIndex === 2) {
        this.props.navigation.navigate('MenuByTopicScreen',
         {
           'dataUrl': this.props.navigation.state.params.dataUrl,
           'branchID': this.props.navigation.state.params.branchID,
           'username': this.props.navigation.state.params.username,
           'category': 1,
           'menuTopic': 2,
           'discountGroupMenuID': this.state.discountGroupMenuID,
           onGoBack:(discountGroupMenuID)=>this.updateDiscountGroupMenuID(discountGroupMenuID)
         }
       );
      }
      else if(buttonIndex === 3) {
        console.log("cancel choose menu");
      }
    }
  }

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

  saveDetails = () =>
  {
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


    // //เลือกอย่างน้อย 1 dayOfWeek
    // if(!this.state.mondaySelected && !this.state.tuesdaySelected && !this.state.wednesdaySelected && !this.state.thursdaySelected && !this.state.fridaySelected && !this.state.saturdaySelected && !this.state.sundaySelected)
    // {
    //   this.triggerModal("กรุณาเลือกวันที่ร่วมส่วนลด อย่างน้อย 1 วัน", false);
    //   return;
    // }

    if(this.state.header == "")
    {
      this.triggerModal("ชื่อโปรโมชั่น", false);
      return;
    }

    if(this.state.subTitle == "")
    {
      this.triggerModal("เพิ่มเติม", false);
      return;
    }


    if(this.state.stepActive)
    {
      if(this.state.firstStepSpend == "")
      {
        this.triggerModal("กรุณาใส่ "+this.state.stepSpendLabel, false);
        return;
      }
      if(this.state.firstStepAmount == "")
      {
        this.triggerModal("กรุณาใส่ "+this.state.stepAmountLabel, false);
        return;
      }
      if(this.state.secondStepSpend == "")
      {
        this.triggerModal("กรุณาใส่ "+this.state.stepSpendLabel, false);
        return;
      }
      if(this.state.secondStepAmount == "")
      {
        this.triggerModal("กรุณาใส่ "+this.state.stepAmountLabel, false);
        return;
      }

      if(this.state.threeStepSelected)
      {
        if(this.state.thirdStepSpend == "")
        {
          this.triggerModal("กรุณาใส่ "+this.state.stepSpendLabel, false);
          return;
        }
        if(this.state.thirdStepAmount == "")
        {
          this.triggerModal("กรุณาใส่ "+this.state.stepAmountLabel, false);
          return;
        }
      }
    }
    else
    {
      if(this.state.discountAmount == "")
      {
        this.triggerModal("กรุณาใส่ส่วนลด", false);
        return;
      }
    }

    if(this.state.withInPeriodDay == "" && this.state.withInPeriodHour == "" && this.state.withInPeriodMinute == "")
    {
      this.triggerModal("กรุณาใส่อายุของของรางวัลนี้", false);
      return;
    }

    if(this.state.numberOfVoucherCode == "" || this.state.numberOfVoucherCode == 0)
    {
      this.triggerModal("กรุณาใส่จำนวนรางวัล", false);
      return;
    }


    // if(this.state.title == "")
    // {
    //   this.triggerModal("กรุณาใส่ชื่อส่วนลด", false);
    //   return;
    // }
    withInPeriodDay = this.state.withInPeriodDay == ""?0:parseInt(this.state.withInPeriodDay);
    withInPeriodHour = this.state.withInPeriodHour == ""?0:parseInt(this.state.withInPeriodHour);
    withInPeriodMinute = this.state.withInPeriodMinute == ""?0:parseInt(this.state.withInPeriodMinute);
    withInPeriod = withInPeriodDay*60*60*24+withInPeriodHour*60*60+withInPeriodMinute*60;


    this.setState({showSpinner:true});

    fetch(this.state.dataUrl + 'JBOLuckyDrawUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        rewardRedemptionID: this.state.rewardRedemptionID,
        header: this.state.header,
        subTitle: this.state.subTitle,
        termsConditions: this.state.termsConditions,
        // displayType: this.state.displayType,

        startDate: dateFormat(startDate,'yyyy-mm-dd HH:MM:00'),
        endDate: dateFormat(endDate,'yyyy-mm-dd HH:MM:00'),
        // day1: this.state.mondaySelected,
        // day2: this.state.tuesdaySelected,
        // day3: this.state.wednesdaySelected,
        // day4: this.state.thursdaySelected,
        // day5: this.state.fridaySelected,
        // day6: this.state.saturdaySelected,
        // day7: this.state.sundaySelected,

        twoStepSelected: this.state.twoStepSelected,
        threeStepSelected: this.state.threeStepSelected,

        discountType: this.state.discountType,
        // title: this.state.title,
        detail: this.state.detail,
        discountAmount: this.state.discountAmount,
        minimumSpending: this.state.minimumSpending,
        // noOfLimitUse: this.state.noOfLimitUse,
        // noOfLimitUsePerUser: this.state.noOfLimitUsePerUser,
        // noOfLimitUsePerUserPerDay: this.state.noOfLimitUsePerUserPerDay,
        discountGroupMenuID: this.state.discountGroupMenuID,
        discountStepID:0,
        discountOnTop: this.state.discountOnTop,

        stepActive: this.state.stepActive,
        firstStepSpend: this.state.firstStepSpend,
        firstStepAmount: this.state.firstStepAmount,
        firstStepMaxDiscount: this.state.firstStepMaxDiscount,
        secondStepSpend: this.state.secondStepSpend,
        secondStepAmount: this.state.secondStepAmount,
        secondStepMaxDiscount: this.state.secondStepMaxDiscount,
        thirdStepSpend: this.state.thirdStepSpend,
        thirdStepAmount: this.state.thirdStepAmount,
        thirdStepMaxDiscount: this.state.thirdStepMaxDiscount,

        imageBase64:this.state.imageBase64,
        imageChanged:this.state.imageChanged,
        imageType:this.state.imageType,

        type:1,//0=reward,1=luckyDraw
        rewardRank:this.state.rewardRank,
        withInPeriod:withInPeriod,
        numberOfVoucherCode:this.state.numberOfVoucherCode,
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

  discountOnTopClick = () => {
    this.setState({discountOnTop:!this.state.discountOnTop});
  }

  discountGroupClick = () => {
    this.setState({discountGroupMenuID:!this.state.discountGroup?0:-1});//state หลังคลิก
    this.setState({discountGroup:!this.state.discountGroup});
  }

  amountChanged = (text) =>
  {
    amount = text.replace(/[^0-9]/g, '');
    this.setState({ discountAmount: amount})
    // this.state.discountTypeOptions.map((discountTypeOption)=>
    // {
    //   if(discountTypeOption.value == this.state.discountType)
    //   {
    //     title = discountTypeOption.title.replace("?",amount);
    //     title = title.replace("x",this.state.minimumSpending);
    //     title = title.replace("y",this.state.minimumSpending*amount);
    //     this.setState({title:title});
    //   }
    // });
  }

  minimumSpendChanged = (text) =>
  {
    minimumSpend = text.replace(/[^0-9]/g, '');
    this.setState({ minimumSpending: minimumSpend});
    // this.state.discountTypeOptions.map((discountTypeOption)=>
    // {
    //   if(discountTypeOption.value == this.state.discountType)
    //   {
    //     title = discountTypeOption.title.replace("?",this.state.discountAmount);
    //     title = title.replace("x",minimumSpend);
    //     title = title.replace("y",this.state.discountAmount*minimumSpend);
    //     // this.setState({title:title});
    //   }
    // });
  }

  withInPeriodDayChanged = (text) =>
  {
    withInPeriodDay = text.replace(/[^0-9]/g, '');
    this.setState({ withInPeriodDay: withInPeriodDay});
  }

  withInPeriodHourChanged = (text) =>
  {
    withInPeriodHour = text.replace(/[^0-9]/g, '');
    this.setState({ withInPeriodHour: withInPeriodHour});
  }

  withInPeriodMinuteChanged = (text) =>
  {
    withInPeriodMinute = text.replace(/[^0-9]/g, '');
    this.setState({ withInPeriodMinute: withInPeriodMinute});
  }

  numberOfVoucherCodeChanged = (text) =>
  {
    numberOfVoucherCode = text.replace(/[^0-9]/g, '');
    this.setState({ numberOfVoucherCode: numberOfVoucherCode});
  }

  firstStepSpendChanged = (text) =>
  {
    firstStepSpend = text.replace(/[^0-9]/g, '');
    this.setState({ firstStepSpend: firstStepSpend})
  }
  firstStepAmountChanged = (text) =>
  {
    firstStepAmount = text.replace(/[^0-9]/g, '');
    this.setState({ firstStepAmount: firstStepAmount})
  }
  firstStepMaxDiscountChanged = (text) =>
  {
    firstStepMaxDiscount = text.replace(/[^0-9]/g, '');
    this.setState({ firstStepMaxDiscount: firstStepMaxDiscount})
  }

  secondStepSpendChanged = (text) =>
  {
    secondStepSpend = text.replace(/[^0-9]/g, '');
    this.setState({ secondStepSpend: secondStepSpend})
  }
  secondStepAmountChanged = (text) =>
  {
    secondStepAmount = text.replace(/[^0-9]/g, '');
    this.setState({ secondStepAmount: secondStepAmount})
    // if(!this.state.stepMaxDiscountActive)
    // {
    //   this.state.discountTypeOptions.map((discountTypeOption)=>
    //   {
    //     if(discountTypeOption.value == this.state.discountType)
    //     {
    //       title = discountTypeOption.title.replace("?",secondStepAmount);
    //       this.setState({title:title});
    //     }
    //   });
    // }
  }
  secondStepMaxDiscountChanged = (text) =>
  {
    secondStepMaxDiscount = text.replace(/[^0-9]/g, '');
    this.setState({ secondStepMaxDiscount: secondStepMaxDiscount});
    // if(this.state.stepMaxDiscountActive)
    // {
    //   this.state.discountTypeOptions.map((discountTypeOption)=>
    //   {
    //     if(discountTypeOption.value == this.state.discountType)
    //     {
    //       title = discountTypeOption.title.replace("?",parseInt(this.state.firstStepMaxDiscount)+parseInt(secondStepMaxDiscount));
    //       this.setState({title:title});
    //     }
    //   });
    // }
  }

  thirdStepSpendChanged = (text) =>
  {
    thirdStepSpend = text.replace(/[^0-9]/g, '');
    this.setState({ thirdStepSpend: thirdStepSpend})
  }
  thirdStepAmountChanged = (text) =>
  {
    thirdStepAmount = text.replace(/[^0-9]/g, '');
    this.setState({ thirdStepAmount: thirdStepAmount})
    // if(!this.state.stepMaxDiscountActive)
    // {
    //   this.state.discountTypeOptions.map((discountTypeOption)=>
    //   {
    //     if(discountTypeOption.value == this.state.discountType)
    //     {
    //       title = discountTypeOption.title.replace("?",thirdStepAmount);
    //       this.setState({title:title});
    //     }
    //   });
    // }
  }
  thirdStepMaxDiscountChanged = (text) =>
  {
    thirdStepMaxDiscount = text.replace(/[^0-9]/g, '');
    this.setState({ thirdStepMaxDiscount: thirdStepMaxDiscount});
    // if(this.state.stepMaxDiscountActive)
    // {
    //   this.state.discountTypeOptions.map((discountTypeOption)=>
    //   {
    //     if(discountTypeOption.value == this.state.discountType)
    //     {
    //       title = discountTypeOption.title.replace("?",parseInt(this.state.firstStepMaxDiscount)+parseInt(this.state.secondStepMaxDiscount)+parseInt(thirdStepMaxDiscount));
    //       this.setState({title:title});
    //     }
    //   });
    // }
  }

  // noOfLimitUseChanged = (text) =>
  // {
  //   this.setState({ noOfLimitUse: text.replace(/[^0-9]/g, ''),})
  // }
  //
  // noOfLimitUsePerUserChanged = (text) =>
  // {
  //   this.setState({ noOfLimitUsePerUser: text.replace(/[^0-9]/g, ''),})
  // }
  //
  // noOfLimitUsePerUserPerDayChanged = (text) =>
  // {
  //   this.setState({ noOfLimitUsePerUserPerDay: text.replace(/[^0-9]/g, ''),})
  // }

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
    this.deleteLuckyDraw();
  }

  cancel = () =>
  {
    this.setState({displayConfirmBox:false});
  }

  confirmDelete = () =>
  {
    this.setState({displayConfirmBox:true,messageConfirmBox: '',
    messageTitleConfirmBox: 'ยืนยันลบรางวัลนี้'});
  }

  deleteLuckyDraw = () =>
  {
    this.setState({showSpinner:true});
    fetch(this.state.dataUrl + 'JBOLuckyDrawDelete.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        rewardRedemptionID: this.state.rewardRedemptionID,
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
        this.triggerModal("ลบรางวัลสำเร็จ", true);
      }
    }).done();
  }

  viewParticipateMenu = () =>
  {
    this.props.navigation.navigate('MenuBelongToBuffetScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'category': 1,
      'discountGroupMenuID': this.state.discountGroupMenuID,
    });
  }

  selectParticipateMenu = () =>
  {
    this.setState({asType:2});
    this.setState({asCancelButtonIndex:3});
    this.setState({asDestructiveButtonIndex:3});
    this.setState({asOptions:this.menuOptions});

    this.showActionSheet();
  }

  updateDiscountGroupMenuID = (discountGroupMenuID) =>
  {
    this.setState({discountGroupMenuID:discountGroupMenuID});
  }

  // setMonday = () =>
  // {
  //   this.setState({mondaySelected:!this.state.mondaySelected});
  // }
  // setTuesday = () =>
  // {
  //   this.setState({tuesdaySelected:!this.state.tuesdaySelected});
  // }
  // setWednesday = () =>
  // {
  //   this.setState({wednesdaySelected:!this.state.wednesdaySelected});
  // }
  // setThursday = () =>
  // {
  //   this.setState({thursdaySelected:!this.state.thursdaySelected});
  // }
  // setFriday = () =>
  // {
  //   this.setState({fridaySelected:!this.state.fridaySelected});
  // }
  // setSaturday = () =>
  // {
  //   this.setState({saturdaySelected:!this.state.saturdaySelected});
  // }
  // setSunday = () =>
  // {
  //   this.setState({sundaySelected:!this.state.sundaySelected});
  // }

  set2Step = () =>
  {
    if(!this.state.twoStepSelected)
    {
      this.setState({twoStepSelected:!this.state.twoStepSelected});
      this.setState({threeStepSelected:!this.state.threeStepSelected});
      this.setState({title:""});
      this.setState({thirdStepSpend:""});
      this.setState({thirdStepAmount:""});
      this.setState({thirdStepMaxDiscount:""});
    }
  }
  set3Step = () =>
  {
    if(!this.state.threeStepSelected)
    {
      this.setState({threeStepSelected:!this.state.threeStepSelected});
      this.setState({twoStepSelected:!this.state.twoStepSelected});
      this.setState({title:""});
    }
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
    this.setState({ isStartDatePickerVisible: false });
  }

  _hideStartTimePicker = () =>
  {
    this.setState({ isStartTimePickerVisible: false });
  }

  _hideEndDatePicker = () =>
  {
    this.setState({ isEndDatePickerVisible: false });
  }

  _hideEndTimePicker = () =>
  {
    this.setState({ isEndTimePickerVisible: false });
  }

  _handleStartDatePicked = (date) => {
    this.setState({startDate:Moment(date).format('D MMM YYYY')});
    this._hideStartDatePicker();
  };

  _handleStartTimePicked = (date) => {
    this.setState({startTime:Moment(date).format('HH:mm')});
    this._hideStartTimePicker();
  };

  _handleEndDatePicked = (date) => {
    this.setState({endDate:Moment(date).format('D MMM YYYY')});
    this._hideEndDatePicker();
  };

  _handleEndTimePicked = (date) => {
    this.setState({endTime:Moment(date).format('HH:mm')});
    this._hideEndTimePicker();
  };

  discountTypeChanged = (value) =>
  {
    this.setState({discountType:value});
    this.state.discountTypeOptions.map((discountTypeOption)=>
    {
      if(discountTypeOption.value == value)
      {
        // this.setState({title:""});
        this.setState({amountLabel:discountTypeOption.amountLabel});
        this.setState({minimumSpendActive:discountTypeOption.minimumSpendActive});
        this.setState({minimumSpendLabel:discountTypeOption.minimumSpendLabel});
        this.setState({stepActive:discountTypeOption.stepActive});
        this.setState({twoStepSelected:discountTypeOption.twoStepSelected});
        this.setState({threeStepSelected:discountTypeOption.threeStepSelected});
        this.setState({stepSpendLabel:discountTypeOption.stepSpendLabel});
        this.setState({stepAmountLabel:discountTypeOption.stepAmountLabel});
        this.setState({stepMaxDiscountActive:discountTypeOption.stepMaxDiscountActive});
        this.setState({stepMaxDiscountLabel:discountTypeOption.stepMaxDiscountLabel});
        if(!discountTypeOption.minimumSpendActive)
        {
          this.setState({minimumSpending:""});
        }

        if(!discountTypeOption.stepActive)
        {
          this.setState({firstStepSpend:""});
          this.setState({firstStepAmount:""});
          this.setState({firstStepMaxDiscount:""});
          this.setState({secondStepSpend:""});
          this.setState({secondStepAmount:""});
          this.setState({secondStepMaxDiscount:""});
          this.setState({thirdStepSpend:""});
          this.setState({thirdStepAmount:""});
          this.setState({thirdStepMaxDiscount:""});
        }
        else
        {
          this.setState({discountAmount:""});
        }

        if(!discountTypeOption.stepMaxDiscountActive)
        {
          this.setState({firstStepMaxDiscount:""});
          this.setState({secondStepMaxDiscount:""});
          this.setState({thirdStepMaxDiscount:""});
        }
      }
    });
  }

  rewardRankChanged = (value) =>
  {
    this.setState({rewardRank:value});
  }

  // displayTypeChanged = (selectedIndex) =>
  // {
  //   if(this.state.imageUrl == "")
  //   {
  //     if(selectedIndex == 0)
  //     {
  //       imageSource = require("./../assets/images/NoImage16_9.jpg");
  //     }
  //     else if(selectedIndex == 1)
  //     {
  //       imageSource = require("./../assets/images/NoImage4_3.jpg");
  //     }
  //     this.setState({avatarSource:imageSource});
  //     this.setState({displayTypeChanging:false});
  //   }
  //   else
  //   {
  //     this.setState({displayTypeChanging:true});
  //     this.chooseImage();
  //   }
  //   this.setState({displayType:selectedIndex});
  // }

  toggleShowTermsConditions = () =>
  {
    this.setState({showTermsConditions:!this.state.showTermsConditions});
  }

  headerChanged = (text) =>
  {
    this.setState({header: text});
    // this.setState({title: text});
  }

  viewLuckyDrawRedeem = () =>
  {
    this.props.navigation.navigate('LuckyDrawRedeemScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'rewardRedemptionID':this.state.rewardRedemptionID,
      onGoBack:(numberOfVoucherCode) => this.setNumberOfVoucherCode(numberOfVoucherCode)
    });
  }

  setNumberOfVoucherCode = (numberOfVoucherCode) =>
  {
    console.log('numberOfVoucherCode:'+numberOfVoucherCode);
    this.setState({numberOfVoucherCode:numberOfVoucherCode});
  }

  render()
  {
    console.log('render withInPeriodDay:'+this.state.withInPeriodDay);
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text style={styles.label}></Text>
        <TouchableOpacity
          onPress={ () => this.chooseImage()}
          style={{alignItems:'center'}}
        >
        <Image
          source={this.state.avatarSource}
          style={this.state.displayType==0?{width:Dimensions.get('window').width-2*20,height:(Dimensions.get('window').width-2*20)/16*9}:{width:(Dimensions.get('window').width-2*20)/16*9/3*4,height:(Dimensions.get('window').width-2*20)/16*9}}
        />
        </TouchableOpacity>


        <Text style={styles.label}></Text>
        <Text style={styles.label}>รางวัลที่</Text>
        <SelectInput
          style={[styles.selectInput,{borderWidth:1}]}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:28}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular"}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.rewardRankChanged(value)}}
          value={this.state.rewardRank}
          options={[{value:1,label:"1"},{value:2,label:"2"},{value:3,label:"3"},{value:4,label:"4"}]}  />


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
          <Text style={styles.label}>ชื่อโปรโมชั่น</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={[styles.textInput,{height:55}]}
        placeholder=" ชื่อโปรโมชั่น"
        onChangeText={(text) => this.headerChanged(text)}
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
          <Text style={[styles.label,{paddingTop:8}]}>ข้อกำหนดและเงื่อนไข</Text><Text style={[styles.label,{color:"#FF3C4B"}]}></Text>
          <TouchableOpacity
            onPress={ () => this.toggleShowTermsConditions()}
            style={{position:'absolute',right:20,paddingTop:3}}
          >
            <Image
              source={this.state.showTermsConditions?require("./../assets/images/expand2.png"):require("./../assets/images/collapse2.png")}
              style={{resizeMode:'contain',width:30,height:30}}
            />
          </TouchableOpacity>
        </View>
        {
          this.state.showTermsConditions?(<TextInput
          style={[styles.textInput,{height:110}]}
          placeholder=" ข้อกำหนดและเงื่อนไข"
          onChangeText={(text) => this.setState({ termsConditions: text})}
          value={this.state.termsConditions}
          multiline={true}
          />):null
        }


        <Text style={styles.label}></Text>
        <Text style={styles.label}>ประเภทส่วนลด</Text>
        <SelectInput
          style={styles.selectInput}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:28}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular"}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.discountTypeChanged(value)}}
          value={this.state.discountType}
          options={this.state.discountTypeOptions}  />

        {
          this.state.stepActive?(<View>
            <Text style={styles.label}></Text>
            <Text style={styles.label}>จำนวนขั้น</Text>
            <View style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',left:15, width:Dimensions.get('window').width-2*20}}>
              <TouchableHighlight underlayColor='transparent' onPress={this.set2Step} style={[styles.buttonDay,{backgroundColor:this.state.twoStepSelected?"#64DCC8":"#FFFFFF"}]}>
                <Text style={[styles.textDay,{color:this.state.twoStepSelected?"#FFFFFF":"#64DCC8"}]}>2</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='transparent' onPress={this.set3Step} style={[styles.buttonDay,{backgroundColor:this.state.threeStepSelected?"#64DCC8":"#FFFFFF"}]}>
                <Text style={[styles.textDay,{color:this.state.threeStepSelected?"#FFFFFF":"#64DCC8"}]}>3</Text>
              </TouchableHighlight>
            </View>

            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                  <Text style={styles.label}>{this.state.stepSpendLabel}</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
                </View>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepSpendLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.firstStepSpendChanged(text)}
                value={this.state.firstStepSpend}
                />
              </View>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                  <Text style={styles.label}>{this.state.stepAmountLabel}</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
                </View>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepAmountLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.firstStepAmountChanged(text)}
                value={this.state.firstStepAmount}
                />
              </View>
              {this.state.stepMaxDiscountActive?(<View style={{width:(Dimensions.get('window').width-20*4)/3}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                  <Text style={styles.label}>{this.state.stepMaxDiscountLabel}</Text>
                </View>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepMaxDiscountLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.firstStepMaxDiscountChanged(text)}
                value={this.state.firstStepMaxDiscount}
                />
              </View>):null}
            </View>

            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepSpendLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.secondStepSpendChanged(text)}
                value={this.state.secondStepSpend}
                />
              </View>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepAmountLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.secondStepAmountChanged(text)}
                value={this.state.secondStepAmount}
                />
              </View>
              {this.state.stepMaxDiscountActive?(<View style={{width:(Dimensions.get('window').width-20*4)/3}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder=" ลดสูงสุด (บาท)"
                keyboardType="numeric"
                onChangeText={(text) => this.secondStepMaxDiscountChanged(text)}
                value={this.state.secondStepMaxDiscount}
                />
              </View>):null}
            </View>

            {this.state.threeStepSelected?(<Text style={styles.label}></Text>):null}
            {this.state.threeStepSelected?(<View style={{display:'flex',flexDirection:'row'}}>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepSpendLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.thirdStepSpendChanged(text)}
                value={this.state.thirdStepSpend}
                />
              </View>
              <View style={{width:(Dimensions.get('window').width-20*4)/3+20}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder={" "+this.state.stepAmountLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.thirdStepAmountChanged(text)}
                value={this.state.thirdStepAmount}
                />
              </View>
              {this.state.stepMaxDiscountActive?(<View style={{width:(Dimensions.get('window').width-20*4)/3}}>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*4)/3}]}
                placeholder=" ลดสูงสุด (บาท)"
                keyboardType="numeric"
                onChangeText={(text) => this.thirdStepMaxDiscountChanged(text)}
                value={this.state.thirdStepMaxDiscount}
                />
              </View>):null}
            </View>
            ):null}
          </View>):(<View>
            <Text style={styles.label}></Text>
            <View style={{display:'flex',flexDirection:'row'}}>
              <View style={{width:(Dimensions.get('window').width-20*3)/2+20}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                  <Text style={styles.label}>{this.state.amountLabel}</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
                </View>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*3)/2}]}
                placeholder={" "+this.state.amountLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.amountChanged(text)}
                value={this.state.discountAmount}
                />
              </View>
              {this.state.minimumSpendActive?(<View style={{width:(Dimensions.get('window').width-20*3)/2}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                  <Text style={styles.label}>{this.state.minimumSpendLabel}</Text>
                </View>
                <TextInput
                style={[styles.textInput,{width: (Dimensions.get('window').width-20*3)/2}]}
                placeholder={" "+this.state.minimumSpendLabel}
                keyboardType="numeric"
                onChangeText={(text) => this.minimumSpendChanged(text)}
                value={this.state.minimumSpending}
                />
              </View>):null}
            </View>
          </View>)
        }

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>รายละเอียดส่วนลด</Text>
        </View>
        <TextInput
        style={[styles.textInput,{height:55}]}
        placeholder=" รายละเอียดส่วนลด"
        onChangeText={(text) => this.setState({ detail: text})}
        value={this.state.detail}
        multiline={true}
        />

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>อายุของของรางวัล</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <TextInput
          style={[styles.textInput,{width: 60}]}
          placeholder=" วัน"
          keyboardType="numeric"
          onChangeText={(text) => this.withInPeriodDayChanged(text)}
          value={this.state.withInPeriodDay}
          />
          <Text style={styles.label}> วัน   </Text>
          <TextInput
          style={[styles.textInput,{width: 60}]}
          placeholder=" ช.ม."
          keyboardType="numeric"
          onChangeText={(text) => this.withInPeriodHourChanged(text)}
          value={this.state.withInPeriodHour}
          />
          <Text style={styles.label}> ช.ม.   </Text>
          <TextInput
          style={[styles.textInput,{width: 60}]}
          placeholder=" นาที"
          keyboardType="numeric"
          onChangeText={(text) => this.withInPeriodMinuteChanged(text)}
          value={this.state.withInPeriodMinute}
          />
          <Text style={styles.label}> นาที</Text>
        </View>

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
          <Text style={styles.label}>จำนวนรางวัล</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
          <TextInput
          style={[styles.textInput,{width:100}]}
          placeholder=" จำนวนรางวัล"
          keyboardType="numeric"
          onChangeText={(text) => this.numberOfVoucherCodeChanged(text)}
          value={this.state.numberOfVoucherCode}
          editable={this.state.newLuckyDraw}
          />
          {
            this.state.newLuckyDraw?null:(<View style={{marginLeft:20}}>
              <TouchableOpacity
                onPress={ () => this.viewLuckyDrawRedeem()}
                style={{justifyContent:'center', alignItems:'center',marginLeft:11,borderRadius:5,backgroundColor:'#64DCC8',height:30}}
              >
                <Text style={[styles.label,{left:0,paddingLeft:10,paddingRight:10,color:'white',fontFamily:'Prompt-SemiBold'}]}>ดูจำนวนรางวัลที่แลกแล้ว</Text>
              </TouchableOpacity>
            </View>)
          }

        </View>

        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row', width:Dimensions.get('window').width}}>
          <CheckBox
            title='ลด on top รายการที่ลดอยู่แล้ว'
            checked={this.state.discountOnTop == 1}
            checkedColor='#64DCC8'
            containerStyle={[styles.checkBoxContainer]}
            textStyle={styles.checkBoxText}
            onPress={this.discountOnTopClick}
            checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
            uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
          />
        </View>

        <View style={{display:'flex',flexDirection:'row', width:Dimensions.get('window').width}}>
          <CheckBox
            title='ร่วมกับทุกเมนู'
            checked={this.state.discountGroup == 1}
            checkedColor='#64DCC8'
            containerStyle={[styles.checkBoxContainer]}
            textStyle={styles.checkBoxText}
            onPress={this.discountGroupClick}
            checkedIcon={<Image source={require('./../assets/images/checked-24.png')} />}
            uncheckedIcon={<Image source={require('./../assets/images/unchecked-24.png')} />}
          />
        </View>

        {
          this.state.discountGroup?null:(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.viewParticipateMenu} title="ดูเมนูที่ร่วมรายการ"/>)
        }
        {
          this.state.discountGroup?null:(<Text style={styles.label}></Text>)
        }
        {
          this.state.discountGroup?null:(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.selectParticipateMenu} title="เลือกเมนูที่ร่วมรายการ"/>)
        }
        {
          this.state.discountGroup?null:(<Text style={styles.label}></Text>)
        }

        <Button buttonStyle={this.state.newLuckyDraw?styles.hide:styles.button} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.confirmDelete} title="ลบรางวัลนี้"/>
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
  font: {
    fontFamily: "Prompt-Regular",
    color: "#005A50"
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
  actionSheet:
  {
    fontFamily:'Prompt-Regular',
    fontSize:18,
    color:'#005A50'
  }
});
export default LuckyDrawDetailScreen;
