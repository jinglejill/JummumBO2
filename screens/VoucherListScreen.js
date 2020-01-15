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
export class VoucherListScreen extends Component
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
    this.loadVoucher();
    this.props.navigation.setParams({ handleNewLuckyDraw: this.newLuckyDraw });
  }

  loadVoucher = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBOVoucherGetList.php';

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

  // newLuckyDraw = (item) =>
  // {
  //   this.props.navigation.navigate('LuckyDrawDetailScreen',
  //   {
  //     'dataUrl': this.props.navigation.state.params.dataUrl,
  //     'branchID': this.props.navigation.state.params.branchID,
  //     'username': this.props.navigation.state.params.username,
  //
  //     'discountTypeOptions':this.state.discountTypeOptions,
  //     'rewardRedemptionID':0,
  //     onGoBack:()=>this.loadLuckyDraw()
  //   });
  // }

  viewVoucherCode = (item) =>
  {
    this.props.navigation.navigate('VoucherCodeScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'rewardRedemptionID':item.rewardRedemptionID
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
          data.push({key:luckyDraw.RewardRedemptionID,
            rewardRedemptionID:luckyDraw.RewardRedemptionID,
            header:luckyDraw.Header,
            subTitle:luckyDraw.SubTitle,
            termsConditions:luckyDraw.TermsConditions,
            periodActive:luckyDraw.PeriodActive,
            startDate:luckyDraw.StartDate,
            endDate:luckyDraw.EndDate,
            startTime:luckyDraw.StartTime,
            endTime:luckyDraw.EndTime,
            discountType:luckyDraw.DiscountType,
            detail:luckyDraw.Detail,
            imageWidth:luckyDraw.ImageWidth,
            imageHeight:luckyDraw.ImageHeight,

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
            numberOfVoucherCode:luckyDraw.NumberOfVoucherCode,
            numberOfVoucherCodeTake:luckyDraw.NumberOfVoucherCodeTake,
            numberOfVoucherCodeRedeem:luckyDraw.NumberOfVoucherCodeRedeem
          });
        });
      });
    }

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
          <Text style={[styles.label,{paddingTop:10,paddingLeft:20,fontSize:12,textAlign:'center'}]}>{item.startDate} - {item.endDate}</Text>
          <Text style={[styles.label,{fontFamily:'Prompt-SemiBold',paddingRight:20,paddingTop:10,lineHeight:24,textAlign:'right',position:'absolute',width:Dimensions.get('window').width}]}>ทั้งหมด / รับสิทธิ์ / ใช้แล้ว</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',width:Dimensions.get('window').width,marginBottom:10,alignItems:'center'}}>
          <Text style={[styles.label,{paddingTop:10,paddingLeft:20,lineHeight:22,color:"#FF3C4B",width:Dimensions.get('window').width-20-20-10-80}]} ellipsizeMode='tail' numberOfLines={2} >{item.header}</Text>
          <Text style={[styles.label,{fontFamily:'Prompt-SemiBold',paddingRight:20,paddingTop:10,lineHeight:24,textAlign:'right',position:'absolute',width:Dimensions.get('window').width}]}>{item.numberOfVoucherCode} / {item.numberOfVoucherCodeTake} / {item.numberOfVoucherCodeRedeem}</Text>
        </View>
        <View style={{flex:1,alignItems:'center',marginBottom:item.imageWidth == 0?0:20}} >
        {
          item.imageWidth == 0?null:(
            <Image
            source={{uri: this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=4'}}
            style={{width: item.imageWidth*1.0/item.imageHeight>=16.0/9?(Dimensions.get('window').width-2*20):9.0/16*(Dimensions.get('window').width-2*20)*item.imageWidth/item.imageHeight,
            height: item.imageWidth*1.0/item.imageHeight>=16.0/9?(Dimensions.get('window').width-2*20)*1.0*item.imageHeight/item.imageWidth:9.0/16*(Dimensions.get('window').width-2*20)}}
          />)
        }
        </View>
        <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
      </View>);

    {
      itemView = (<TouchableOpacity
        onPress={ () => this.viewVoucherCode(item)}
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
export default VoucherListScreen;
