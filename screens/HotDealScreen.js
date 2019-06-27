import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import { SearchBar } from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';


const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ titleThai: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

titleTextBottom = 0;
numColumns = 1;
export class HotDealScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,

      promotion: [],
      loading: true,
      search: '',
      data:[],
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadHotDeal();
    this.props.navigation.setParams({ handleNewHotDeal: this.newHotDeal });
    // this.props.navigation.setParams({ showNewButton: false });

  }

  newHotDeal = () =>
  {
    this.props.navigation.navigate('HotDealDetailScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'promotionID':0,
      onGoBack:()=>this.loadHotDeal()
    });
  }

  updateHotDealList = (data) =>
  {
    this.setState({showSpinner:true});
    //HotDealList
    fetch('https://jummum.co/app/dev_jor/JORPromotionUpdateList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        promotion: data,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
    }).done();
  }

  updateSearch = search => {
    this.setState({ search: search });
  };

  loadHotDeal = () =>
  {
    this.setState({showSpinner:true});
    // if(this.state.menuTopic == 0)
    {
      fetchUrl = 'https://jummum.co/app/dev_jor/JORPromotionGetList.php';
    }


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
      console.log();
      this.setState({promotion:responseData.data.Promotion,
        branchImageUrl:responseData.data.BranchImageUrl
      })
    }).done();
  };

  actionOnRow(item) {
    this.props.navigation.navigate('HotDealDetailScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'branchImageUrl':this.state.branchImageUrl,
      'promotionID':item.promotionID,
      'mainBranchID':item.mainBranchID,
      'startDate':item.startDate,
      'endDate':item.endDate,
      'usingStartDate':item.usingStartDate,
      'usingEndDate':item.usingEndDate,
      'header':item.header,
      'subTitle':item.subTitle,
      'imageUrl':item.imageUrl,
      'discountType':item.discountType,
      'discountAmount':item.discountAmount,
      'shopDiscount':item.shopDiscount,
      'jummumDiscount':item.jummumDiscount,
      'sharedDiscountType':item.sharedDiscountType,
      'sharedDiscountAmount':item.sharedDiscountAmount,
      'minimumSpending':item.minimumSpending,
      'allowEveryone':item.allowEveryone,
      'discountGroupMenuID':item.discountGroupMenuID,
      'discountStepID':item.discountStepID,
      'discountGroupMenuID':item.discountGroupMenuID,
      'discountOnTop':item.discountOnTop,
      'noOfLimitUse':item.noOfLimitUse,
      'noOfLimitUsePerUser':item.noOfLimitUsePerUser,
      'noOfLimitUsePerUserPerDay':item.noOfLimitUsePerUserPerDay,
      'voucherCode':item.voucherCode,
      'termsConditions':item.termsConditions,
      'type':item.type,
      'orderNo':item.orderNo,
      'status':item.status,
      onGoBack:()=>this.loadHotDeal()
    });
 };

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    console.log("dimension width:"+Dimensions.get('window').width);
    //hotDealItem
    if(item.imageUrl == "")
    {
      branchImageUrl = this.state.branchImageUrl;
      uri = 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+branchImageUrl+'&type=2';
    }
    else
    {
      uri = 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=3';
    }



    hotDealType0 = (
    <View
      style={[styles.item,{backgroundColor: isActive ? '#dff7f3' : '#FFFFFF'}]}
    >
      <Text style={[styles.itemHeader]} ellipsizeMode='tail' numberOfLines={2}>{item.header}</Text>
      <Text style={[styles.itemSub]} ellipsizeMode='tail' numberOfLines={2}>{item.subTitle}</Text>
      <Image
        source={{uri: uri}}
        style={{resizeMode:'contain',width:Dimensions.get('window').width-2*20,height:(Dimensions.get('window').width-2*20)/16*7.5,marginTop:11,marginLeft:20}}
      />
      <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20,marginTop:11}}/>
    </View>);


    hotDealType1 = (
    <View
      style={[styles.item,{backgroundColor: isActive ? '#dff7f3' : '#FFFFFF'}]}
    >
      <View style={{display:'flex',flexDirection:'row'}}>
        <View style={{width:(Dimensions.get('window').width-2*20)-135-20,height:90+2*11,marginLeft:20,marginRight:20}}>
          <Text style={[styles.itemHeader,{paddingLeft:null,paddingRight:null}]} ellipsizeMode='tail' numberOfLines={2}>{item.header}</Text>
          <Text style={[styles.itemSub,{paddingLeft:null,paddingRight:null}]} ellipsizeMode='tail' numberOfLines={2}>{item.subTitle}</Text>
        </View>
        <View style={{width:135,height:90+2*11,marginRight:20}}>
          <Image
            source={{uri: uri}}
            style={{resizeMode:'contain',width:135,height:90,marginTop:11}}
          />
        </View>
      </View>
      <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20,marginTop:11}}/>
    </View>);

    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {item.type == 0?hotDealType0:hotDealType1}
      </TouchableOpacity>);
    }


    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return itemView;
  };

  render()
  {
    {
      data = [];


      this.state.promotion.map((promotion)=>{
        data.push({key:promotion.PromotionID,
          label:promotion.Header,
          promotionID:promotion.PromotionID,
          header:promotion.Header,
          subTitle:promotion.SubTitle,
          imageUrl:promotion.ImageUrl,
          type:promotion.Type,
          orderNo:promotion.OrderNo,
        });
      });


      //sort
      {
        data = data.sort(function (a, b)
        {
          if(a.type === b.type)
          {
            return a.orderNo - b.orderNo;
          }

          return a.type - b.type;
        });
      }

      data = data.filter((promotion) => promotion.header.toLowerCase().includes(this.state.search.toLowerCase()));
    }


    //set numColumns
    {
      numColumns = 1;
    }


    {
      flatListComp = (<DraggableFlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: 0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        scrollPercent={5}
        onMoveEnd={({ data }) =>
          {
            this.updateHotDealList(data);
            this.setState({ data:data});}}
      />);
    }

    return (
        <View style={[styles.container, {paddingTop: 0}]}>
          <View style={styles.container}>
            <SearchBar
            containerStyle={{backgroundColor:"transparent",borderWidth:0,borderColor:"#FFFFFF",borderBottomColor: '#CCCCCC',
       borderTopColor: 'transparent'}}
       inputContainerStyle= {{backgroundColor:"transparent",borderWidth:0,borderRadius:5,borderColor:"#FF3C4B"}}

            inputStyle={{fontFamily:"Prompt-Regular"}}
            placeholder="ค้นหา Hot Deal"
            onChangeText={this.updateSearch}
            value={this.state.search}
          />
          {flatListComp}
          </View>
          <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
          {this.state.showSpinner && Platform.OS === 'android'?(<ActivityIndicator size={30} color="#a2a2a2" />):null}
        </View>
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
});
export default HotDealScreen;
