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

      rewardRedemptionID: this.props.navigation.state.params.rewardRedemptionID,
      voucherCode: [],

      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadVoucherCode();
    // this.props.navigation.setParams({ handleNewLuckyDraw: this.newLuckyDraw });
  }

  loadVoucherCode = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBOVoucherCodeGetList.php';

    fetch(fetchUrl,
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        rewardRedemptionID: this.state.rewardRedemptionID,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
      this.setState({voucherCode:responseData.data.VoucherCode});
    }).done();
  };

  formatData = (item, numColumns) =>
  {
    // if(this.state.luckyDrawPeriod)
    {
      data = [];
      selectedVoucherCode = this.state.voucherCode.filter((voucherCode) => voucherCode.PromoCodeID == item.PromoCodeID);
      selectedVoucherCode.map((voucherCode)=>{
        data.push({key:voucherCode.PromoCodeID,promoCodeID:voucherCode.PromoCodeID,code:voucherCode.Code,status:voucherCode.Status});
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
    console.log('data detail:'+JSON.stringify(data));
    console.log('length:'+data.length);
    return data;
  };

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    luckyDrawItem = (
      <View key={index} style={[styles.item,{height:44}]}>
        <View style={{width:Dimensions.get('window').width,flex:1,alignItems:'center',justifyContent:'center',backgroundColor:item.status==0?'white':(item.status==1?'#e0f8f4':'#ffd8db')}}>
          <Text style={[styles.label,{position:'absolute',top:5,paddingLeft:null,left:10,fontSize:10}]}>{item.status==0?'':(item.status==1?'รับสิทธิ์':'ใช้แล้ว')} </Text>
          <Text style={[styles.label,{paddingLeft:null,textAlign:'center',width:Dimensions.get('window').width}]}>{item.code}</Text>
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
    data = [];
    this.state.voucherCode.map((voucherCode)=>{
      data.push({PromoCodeID:voucherCode.PromoCodeID,Code:voucherCode.Code});
    });
    // data.push({PromoCodeID:1,Code:'aa'});
    // data.push({PromoCodeID:2,Code:'bb'});
    // data.push({PromoCodeID:3,Code:'cc'});
    console.log("render voucherCode data:" + JSON.stringify(data));
    return (
        <ScrollView><View style={[styles.container, {paddingTop: 0}]}>
        {
          data.map((item)=>
          {
            return (
              <FlatList
                key = {item.promoCodeID}
                data={this.formatData(item, numColumns)}
                style={styles.container}
                contentContainerStyle={{
              padding:0}}
                renderItem={this.renderItem}
                numColumns={numColumns}
                keyExtractor={(item, index) => {console.log("key:"+`draggable-item-${item.promoCodeID}`); return
                  `draggable-item-${item.PromoCodeID}`;}}
              />
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
