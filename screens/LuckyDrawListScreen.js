import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList,SectionList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, Image, ScrollView, Platform,ActivityIndicator, ActionSheetIOS } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';


titleTextBottom = 0;
// numColumns = 1;
export class LuckyDrawListScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      luckyDrawPeriod: [],

      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadLuckyDraw();
    this.props.navigation.setParams({ handleNewLuckyDraw: this.newLuckyDraw });
  }

  loadLuckyDraw = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBOLuckyDrawGetList.php';

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
      this.setState({luckyDrawPeriod:responseData.data.LuckyDrawPeriod});
      this.setState({discountTypeOptions:responseData.data.DiscountTypeOptions});
    }).done();
  };

  newLuckyDraw = (item) =>
  {
    this.props.navigation.navigate('LuckyDrawDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'discountTypeOptions':this.state.discountTypeOptions,
      'rewardRedemptionID':0,
      onGoBack:()=>this.loadLuckyDraw()
    });
  }

  editLuckyDraw = (item) =>
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

    this.props.navigation.navigate('LuckyDrawDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'discountTypeOptions':this.state.discountTypeOptions,
      'rewardRedemptionID':item.rewardRedemptionID,
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
      'discountAmount':item.discountAmount,
      'minimumSpending':item.minimumSpending,
      'noOfLimitUse':item.noOfLimitUse,
      'noOfLimitUsePerUser':item.noOfLimitUsePerUser,
      'noOfLimitUsePerUserPerDay':item.noOfLimitUsePerUserPerDay,
      'discountGroupMenuID':item.discountGroupMenuID,
      'discountStepID':item.discountStepID,
      'discountOnTop':item.discountOnTop,
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

      'rewardRank':item.rewardRank,
      'withInPeriod':item.withInPeriod,
      'numberOfVoucherCode':item.numberOfVoucherCode,
      onGoBack:()=>this.loadLuckyDraw()
    });
  }

  formatData = (item, numColumns) =>
  {
    if(this.state.luckyDrawPeriod)
    {
      data = [];
      selectedluckyDrawPeriod = this.state.luckyDrawPeriod.filter((luckyDrawPeriod) => luckyDrawPeriod.PeriodActive == item.periodActive);
      selectedluckyDrawPeriod.map((luckyDrawPeriod)=>{
        luckyDraw = luckyDrawPeriod.LuckyDraw;
        luckyDraw.map((luckyDraw)=>{
          // var parts = (+luckyDraw.DiscountAmount).toFixed(2).split(".");
          // discountAmount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+luckyDraw.MinimumSpending).toFixed(2).split(".");
          // minimumSpending = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];

          // var parts = (+luckyDraw.NoOfLimitUse).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+luckyDraw.NoOfLimitUsePerUser).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          //
          // var parts = (+luckyDraw.NoOfLimitUsePerUserPerDay).toFixed(2).split(".");
          // amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];

          data.push({key:luckyDraw.RewardRedemptionID,
            rewardRedemptionID:luckyDraw.RewardRedemptionID,
            header:luckyDraw.Header,
            subTitle:luckyDraw.SubTitle,
            termsConditions:luckyDraw.TermsConditions,
            // displayType:luckyDraw.DisplayType,
            periodActive:luckyDraw.PeriodActive,
            startDate:luckyDraw.StartDate,
            endDate:luckyDraw.EndDate,
            startTime:luckyDraw.StartTime,
            endTime:luckyDraw.EndTime,
            discountType:luckyDraw.DiscountType,
            // title:luckyDraw.Title,
            detail:luckyDraw.Detail,

            discountAmount:luckyDraw.DiscountAmount,
            minimumSpending:luckyDraw.MinimumSpending,
            noOfLimitUse:luckyDraw.NoOfLimitUse,
            noOfLimitUsePerUser:luckyDraw.NoOfLimitUsePerUser,
            noOfLimitUsePerUserPerDay:luckyDraw.NoOfLimitUsePerUserPerDay,
            discountGroupMenuID:luckyDraw.DiscountGroupMenuID,
            discountStepID:luckyDraw.DiscountStepID,
            discountOnTop:luckyDraw.DiscountOnTop,
            imageUrl:luckyDraw.ImageUrl,

            discountStep:luckyDraw.DiscountStep,
            twoStepSelected:luckyDraw.TwoStepSelected,
            threeStepSelected:luckyDraw.ThreeStepSelected,

            rewardRank:luckyDraw.RewardRank,
            withInPeriod:luckyDraw.WithInPeriod,
            numberOfVoucherCode:luckyDraw.NumberOfVoucherCode
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
    luckyDrawItem = (
      <View key={index} style={[styles.item]}>
        <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginTop:10,alignItems:'center'}}>
          <Text style={[styles.label,{paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>เริ่ม</Text>
          <Text style={[styles.label,{paddingLeft:2,textAlign:'center',width:85}]}>{item.startDate}</Text>
          <View style={{borderRadius:5,backgroundColor:'#64DCC8'}}>
            <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.startTime}</Text>
          </View>
          <Text style={[styles.label,{paddingRight:20,paddingLeft:0,textAlign:'right',color:"#FF3C4B",position:'absolute',right:0,width:Dimensions.get('window').width-50-85-55-2-5-5}]} ellipsizeMode='tail' numberOfLines={2} >{item.header}</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginBottom:10,alignItems:'center'}}>
          <Text style={[styles.label,{paddingTop:10,paddingLeft:20,fontSize:11,lineHeight:22,textAlign:'right',width:50}]}>สิ้นสุด</Text>
          <Text style={[styles.label,{paddingTop:10,paddingLeft:2,textAlign:'center',width:85}]}>{item.endDate}</Text>
          <View style={{marginTop:10,borderRadius:5,backgroundColor:'#64DCC8'}}>
            <Text style={[styles.label,{paddingLeft:5,paddingRight:5,textAlign:'center',width:55,color:"#FFFFFF",fontFamily:"Prompt-SemiBold",lineHeight:28}]}>{item.endTime}</Text>
          </View>
          <Text style={[styles.label,{paddingRight:20,paddingTop:10,fontSize:12,lineHeight:24,textAlign:'right',position:'absolute',width:Dimensions.get('window').width}]}>รางวัลที่ {item.rewardRank}</Text>
        </View>
        <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
      </View>);

    {
      itemView = (<TouchableOpacity
        onPress={ () => this.editLuckyDraw(item)}
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {luckyDrawItem}
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
    if(this.state.luckyDrawPeriod)
    {
      data = [];
      this.state.luckyDrawPeriod.map((luckyDrawPeriod)=>{
        data.push({title:luckyDrawPeriod.Name, periodActive:luckyDrawPeriod.PeriodActive});
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
export default LuckyDrawListScreen;
