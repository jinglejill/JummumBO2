import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList,SectionList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, Image, ScrollView, Platform,ActivityIndicator, ActionSheetIOS } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';
// import InfiniteScroll from 'react-infinite-scroller';


titleTextBottom = 0;
// numColumns = 1;
export class DiscountProgramScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      discountProgramPeriod: [],

      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadDiscountProgram();
    this.props.navigation.setParams({ handleNewDiscountProgram: this.newDiscountProgram });
  }

  loadDiscountProgram = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBODiscountProgramGetList.php';

    fetch(fetchUrl,
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
    .then((responseData) =>{
      this.setState({showSpinner:false});
      this.setState({discountProgramPeriod:responseData.data.DiscountProgramPeriod});
      this.setState({discountTypeOptions:responseData.data.DiscountTypeOptions});
    }).done();
  };

  newDiscountProgram = (item) =>
  {
    this.props.navigation.navigate('DiscountProgramDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'discountTypeOptions':this.state.discountTypeOptions,
      'discountProgramID':0,
      onGoBack:()=>this.loadDiscountProgram()
    });
  }

  editDiscountProgram = (item) =>
  {
    i = 0;
    firstStepSpend  = "";
    firstStepAmount = "";
    firstStepMaxDiscount = "";
    secondStepSpend  = "";
    secondStepAmount = "";
    secondStepMaxDiscount = "";
    thirdStepSpend  = "";
    thirdStepAmount = "";
    thirdStepMaxDiscount = "";
    item.discountStep.map((discountStep)=>
    {
      if(i == 0)
      {
        firstStepSpend = discountStep.StepSpend;
        firstStepAmount = discountStep.Amount;
        firstStepMaxDiscount = discountStep.MaxDiscount;
      }
      else if(i == 1)
      {
        secondStepSpend = discountStep.StepSpend;
        secondStepAmount = discountStep.Amount;
        secondStepMaxDiscount = discountStep.MaxDiscount;
      }
      else if(i == 2)
      {
        thirdStepSpend = discountStep.StepSpend;
        thirdStepAmount = discountStep.Amount;
        thirdStepMaxDiscount = discountStep.MaxDiscount;
      }
      i++;
    });
    this.props.navigation.navigate('DiscountProgramDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'discountTypeOptions':this.state.discountTypeOptions,
      'discountProgramID':item.discountProgramID,
      'header':item.header,
      'subTitle':item.subTitle,
      'termsConditions':item.termsConditions,
      'displayType':item.displayType,
      'startDate':item.startDate,
      'startTime':item.startTime,
      'endDate':item.endDate,
      'endTime':item.endTime,
      'discountType':item.discountType,
      'title':item.title,
      'detail':item.detail,
      'amount':item.amount,
      'minimumSpend':item.minimumSpend,
      'noOfLimitUse':item.noOfLimitUse,
      'noOfLimitUsePerUser':item.noOfLimitUsePerUser,
      'noOfLimitUsePerUserPerDay':item.noOfLimitUsePerUserPerDay,
      'discountGroupMenuID':item.discountGroupMenuID,
      'discountStepID':item.discountStepID,
      'discountOnTop':item.discountOnTop,

      'mondaySelected':item.mondaySelected,
      'tuesdaySelected':item.tuesdaySelected,
      'wednesdaySelected':item.wednesdaySelected,
      'thursdaySelected':item.thursdaySelected,
      'fridaySelected':item.fridaySelected,
      'saturdaySelected':item.saturdaySelected,
      'sundaySelected':item.sundaySelected,
      'imageUrl':item.imageUrl,


      'firstStepSpend':firstStepSpend,
      'firstStepAmount':firstStepAmount,
      'firstStepMaxDiscount':firstStepMaxDiscount,
      'secondStepSpend':secondStepSpend,
      'secondStepAmount':secondStepAmount,
      'secondStepMaxDiscount':secondStepMaxDiscount,
      'thirdStepSpend':thirdStepSpend,
      'thirdStepAmount':thirdStepAmount,
      'thirdStepMaxDiscount':thirdStepMaxDiscount,
      'twoStepSelected':item.twoStepSelected,
      'threeStepSelected':item.threeStepSelected,

      onGoBack:()=>this.loadDiscountProgram()
    });
  }

  formatData = (item, numColumns) =>
  {
    if(this.state.discountProgramPeriod)
    {
      data = [];
      selectedDiscountProgramPeriod = this.state.discountProgramPeriod.filter((discountProgramPeriod) => discountProgramPeriod.PeriodActive == item.periodActive);
      selectedDiscountProgramPeriod.map((discountProgramPeriod)=>{
        discountProgram = discountProgramPeriod.DiscountProgram;
        discountProgram.map((discountProgram)=>{
          // var parts = (+discountProgram.Amount).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+discountProgram.MinimumSpend).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+discountProgram.NoOfLimitUse).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+discountProgram.NoOfLimitUsePerUser).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+discountProgram.NoOfLimitUsePerUserPerDay).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];

          data.push({key:discountProgram.DiscountProgramID,
            discountProgramID:discountProgram.DiscountProgramID,
            header:discountProgram.Header,
            subTitle:discountProgram.SubTitle,
            termsConditions:discountProgram.TermsConditions,
            displayType:discountProgram.DisplayType,
            periodActive:discountProgram.PeriodActive,
            startDate:discountProgram.StartDate,
            endDate:discountProgram.EndDate,
            startTime:discountProgram.StartTime,
            endTime:discountProgram.EndTime,
            discountType:discountProgram.DiscountType,
            title:discountProgram.Title,
            detail:discountProgram.Detail,

            amount:discountProgram.Amount,
            minimumSpend:discountProgram.MinimumSpend,
            noOfLimitUse:discountProgram.NoOfLimitUse,
            noOfLimitUsePerUser:discountProgram.NoOfLimitUsePerUser,
            noOfLimitUsePerUserPerDay:discountProgram.NoOfLimitUsePerUserPerDay,
            discountGroupMenuID:discountProgram.DiscountGroupMenuID,
            discountStepID:discountProgram.DiscountStepID,
            discountOnTop:discountProgram.DiscountOnTop,
            dayJoin:discountProgram.DayJoin,
            mondaySelected:discountProgram.MondaySelected,
            tuesdaySelected:discountProgram.TuesdaySelected,
            wednesdaySelected:discountProgram.WednesdaySelected,
            thursdaySelected:discountProgram.ThursdaySelected,
            fridaySelected:discountProgram.FridaySelected,
            saturdaySelected:discountProgram.SaturdaySelected,
            sundaySelected:discountProgram.SundaySelected,
            imageUrl:discountProgram.ImageUrl,

            discountStep:discountProgram.DiscountStep,
            twoStepSelected:discountProgram.TwoStepSelected,
            threeStepSelected:discountProgram.ThreeStepSelected,
          });
        });
      });
    }
    // data = data.sort(function (a, b)
    // {
    //   return a.status - b.status;
    // });

    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
     data.push({ titleThai: `blank-${numberOfElementsLastRow}`, empty: true });
     numberOfElementsLastRow++;
    }
    return data;
  };

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    discountProgramItem = (
      <View key={index} style={[styles.item]}>
        <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginTop:10,alignItems:'center'}}>
          <Text style={[styles.label,{paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>เริ่ม</Text>
          <Text style={[styles.label,{paddingLeft:2,textAlign:'center',width:85}]}>{item.startDate}</Text>
          <View style={{borderRadius:5,backgroundColor:'#64DCC8'}}>
            <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.startTime}</Text>
          </View>
          <Text style={[styles.label,{paddingRight:20,textAlign:'right',color:"#FF3C4B",position:'absolute',width:Dimensions.get('window').width}]}>{item.title}</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginBottom:10,alignItems:'center'}}>
          <Text style={[styles.label,{paddingTop:10,paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>สิ้นสุด</Text>
          <Text style={[styles.label,{paddingTop:10,paddingLeft:2,textAlign:'center',width:85}]}>{item.endDate}</Text>
          <View style={{marginTop:10,borderRadius:5,backgroundColor:'#64DCC8'}}>
            <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.endTime}</Text>
          </View>
          <Text style={[styles.label,{paddingRight:20,paddingTop:10,fontSize:12,lineHeight:24,textAlign:'right',position:'absolute',width:Dimensions.get('window').width}]}>{item.dayJoin}</Text>
        </View>
        <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
      </View>);

    {
      itemView = (<TouchableOpacity
        onPress={ () => this.editDiscountProgram(item)}
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {discountProgramItem}
      </TouchableOpacity>);
    }


    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return itemView;
  };

  render()
  {
    numColumns = 1;
    if(this.state.discountProgramPeriod)
    {
      data = [];
      this.state.discountProgramPeriod.map((discountProgramPeriod)=>{
        data.push({title:discountProgramPeriod.Name, periodActive:discountProgramPeriod.PeriodActive});
      });
    }
    else
    {
      data = [];
    }

    return (
        <ScrollView><View style={[styles.container, {paddingTop: 0}]}>
        {
          data.map((item)=>
          {
            return (<View key={item.title} style={{flex:1}}>
              <View style={{backgroundColor: '#ECECEC',height:25}}>
                <Text style={{fontFamily: 'Prompt-SemiBold',color: '#FF3C4B',paddingLeft:20}} >{item.title}</Text>
              </View>
              <FlatList
                data={this.formatData(item, numColumns)}
                style={styles.container}
                contentContainerStyle={{
              padding:0}}
                renderItem={this.renderItem}
                numColumns={numColumns}
                keyExtractor={(item, index) => `draggable-item-${item.key}`}
              />
            </View>
            );
          })
        }
        <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
        {this.state.showSpinner && Platform.OS === 'android'?(<ActivityIndicator size={30} color="#a2a2a2" />):null}
        </View></ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    color: '#005A50',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 20,
    width: Dimensions.get('window').width - 2*20 - 10,
  },
  itemSub: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
    paddingLeft: 10,
    paddingTop: 5,
  },
  itemTextRecommended: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: '#005A50',
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden',
  },
  itemSubRecommended: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
    paddingLeft: 10,
  },
  foodRunOutLabel:{width:35,height:35,position:'absolute',top:0,right:0},
  buttonEdit:
  {
    height:25,
    width:50,
    backgroundColor:"#FF3C4B",
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
    lineHeight:24,
    color: '#FFFFFF'
  },
  label: {
    paddingLeft:20,
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
  },
});
export default DiscountProgramScreen;
