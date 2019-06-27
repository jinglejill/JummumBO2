import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView, Platform,ActivityIndicator } from 'react-native';
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
numColumns = 2;
export class MenuOnOffScreen extends Component
{
  constructor(props)
  {
    super(props);

    console.log("menu on off");
    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      menuTopic: this.props.navigation.state.params.menuTopic,
      menuType: [],
      selectedMenuType: 0,
      loading: true,
      search: '',
      data:[],
      menuTypeID:-1,
      selectedIndex:0,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadMenu();
    this.props.navigation.setParams({ handleNewMenu: this.newMenu });
    this.props.navigation.setParams({ showNewButton: false });

  }

  newMenu = () =>
  {
    this.props.navigation.navigate('MenuDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID':0,
      'menuTypeID': this.state.menuType[this.state.selectedIndex].MenuTypeID,
      onGoBack:()=>this.loadMenu()
    });
  }

  updateMenuList = (data) =>
  {
    this.setState({showSpinner:true});
    //MenuList
    fetch(this.state.dataUrl + 'JBOMenuUpdateList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menu: data,
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

  loadMenu = () =>
  {
    this.setState({showSpinner:true});
    if(this.state.menuTopic == 0)
    {
      fetchUrl = this.state.dataUrl + 'JBOMenuGetList.php';
    }
    else if(this.state.menuTopic == 1)
    {
      fetchUrl = this.state.dataUrl + 'JBOMenuOtherGetList.php';
    }
    else if(this.state.menuTopic == 2)
    {
      fetchUrl = this.state.dataUrl + 'JBOMenuNotActiveGetList.php';
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
      this.setState({menuType:responseData.data.MenuType,
        branchImageUrl:responseData.data.BranchImageUrl
      })
    }).done();
  };

  updateRecommendedOrderNo = (itemOrder) =>
  {
    data = [];
    itemOrderList = itemOrder.itemOrder;
    itemOrderList.map((itemOrder)=>
    {
      data.push({"menuID":itemOrder.key,"orderNo":itemOrder.orderNo});
    });

    this.setState({showSpinner:true});
    //MenuList
    fetch(this.state.dataUrl + 'JBOMenuRecommendedOrderNoUpdateList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menu: data,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
    }).done();
  }

  actionOnRow(item)
  {
    console.log('actionOnRow');
    this.props.navigation.navigate('MenuDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID':item.menuID,
      'titleThai':item.titleThai,
      'price':item.price,
      'recommended':item.recommended,
      'buffetMenu':item.buffetMenu,
      'alacarteMenu':item.alacarteMenu,
      'timeToOrder':item.timeToOrder,
      'imageUrl':item.imageUrl,
      'status':item.status,
      onGoBack:()=>this.loadMenu()
    });
 };

 onChangeTab = (item) =>
 {
   this.setState({selectedIndex:item.i});
   if(item.i == 0 || item.i == this.state.menuType.length-1)
   {
     this.props.navigation.setParams({ showNewButton: false });
   }
   else
   {
     this.props.navigation.setParams({ showNewButton: true });
   }
 }

  Page = ({label,menuTypeID}) =>
  {
    if(menuTypeID != this.state.menuTypeID )
    {
      data = [];
      selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == menuTypeID);
      selectedMenuType.map((menuType)=>{
        menu = menuType.Menu;
        menu.map((menu)=>{
          var parts = (+menu.Price).toFixed(2).split(".");
          price = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];

          parts = (+menu.SpecialPrice).toFixed(2).split(".");
          specialPrice = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          hasFood = menu.Status == 1?true:false;
          recommended = menu.Recommended == 1;
          buffetMenu = menu.BuffetMenu == 1;
          alacarteMenu = menu.AlacarteMenu == 1;
          timeToOrder = menu.TimeToOrder/60;
          data.push({key:menu.MenuID,label:menu.TitleThai,backgroundColor:'#FF3C4B',menuTypeID:menu.MenuTypeID,menuID:menu.MenuID,titleThai:menu.TitleThai, price:price, specialPrice:specialPrice, imageUrl:menu.ImageUrl, status:menu.Status, orderNo:menu.OrderNo, hasFood:hasFood, recommended:recommended, recommendedOrderNo:menu.RecommendedOrderNo, buffetMenu:buffetMenu, alacarteMenu:alacarteMenu, timeToOrder:timeToOrder, imageUrl:menu.ImageUrl, status:parseInt(menu.Status),menuTypeOrderNo:menu.MenuTypeOrderNo});
        });
        if(menuTypeID == 0)
        {
          data = data.sort(function (a, b)
          {
            return a.recommendedOrderNo - b.recommendedOrderNo;
          });
        }
        else
        {
          data = data.sort(function (a, b)
          {
            if(a.menuTypeOrderNo === b.menuTypeOrderNo)
            {
              return a.orderNo - b.orderNo;
            }
            return a.menuTypeOrderNo - b.menuTypeOrderNo;
          });
        }
      });

      data = data.filter((menu) => menu.titleThai.toLowerCase().includes(this.state.search.toLowerCase()));
    }
    else
    {
      data = this.state.data;
    }


    //set numColumns
    if(menuTypeID == 0)
    {
      numColumns = 2;
    }
    else
    {
      numColumns = 1;
    }

    if(menuTypeID == 0)
    {
      flatListComp = (<ScrollView>
      <SortableGrid
        blockHeight = {(Dimensions.get('window').width-4*7)/2+80+2*7}
         blockTransitionDuration      = { 400 }
         activeBlockCenteringDuration = { 200 }
         itemsPerRow                  = { 2 }
         dragActivationTreshold       = { 200 }
         onDragRelease                = { (itemOrder) => {this.updateRecommendedOrderNo(itemOrder)} }
         onDragStart                  = { ()          => console.log("Some block is being dragged now!") }
         >

         {
           data.map( (item, index) =>
             <View
               key={item.menuID}
               onTap={() => this.actionOnRow(item) }
               style={styles.itemRecommendedGrid}
             >
               <View style={styles.itemRecommended}>
                 <Image
                   source={item.status == 2?require("./../assets/images/foodRunOutLabel.png"):require("./../assets/images/foodRunOutLabel_blank.png")}
                   style={styles.foodRunOutLabel}
                 />
                 <Image
                   source={{uri: (item.imageUrl == ""?this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+this.state.branchImageUrl+'&type=2':this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=1')}}
                   style={{width: (Dimensions.get('window').width-4*7)/2,
                   height: (Dimensions.get('window').width-4*7)/2}}
                 />
                 <View style={{justifyContent:'center',height:48}}>
                   <Text style={styles.itemTextRecommended} ellipsizeMode='tail' numberOfLines={2}>
                     {item.titleThai}
                   </Text>
                 </View>
                 <View style={{display:'flex',flexDirection:'row'}}>
                   <Text style={[styles.itemSubRecommended,(item.price == item.specialPrice)?null:{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]}>฿ {item.price}</Text>
                   {item.price == item.specialPrice?null:(<Text style={[styles.itemSubRecommended,{color:"#FF3C4B"}]}>฿ {item.specialPrice}</Text>)}
                 </View>
               </View>
             </View>
           )
         }
        </SortableGrid>
        </ScrollView>);
    }
    else if(menuTypeID == 100)
    {
      flatListComp = (<FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
      />);
    }
    else
    {
      flatListComp = (<DraggableFlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        scrollPercent={5}
        onMoveEnd={({ data }) =>
          {
            this.updateMenuList(data);
            this.setState({ data:data,menuTypeID:menuTypeID });}}
      />);
    }

    return (<View style={styles.container}>
      <SearchBar
      containerStyle={{backgroundColor:"transparent",borderWidth:0,borderColor:"#FFFFFF",borderBottomColor: '#CCCCCC',
 borderTopColor: 'transparent'}}
 inputContainerStyle= {{backgroundColor:"transparent",borderWidth:0,borderRadius:5,borderColor:"#FF3C4B"}}

      inputStyle={{fontFamily:"Prompt-Regular"}}
      icon = {{type: 'material-community', color: '#86939e', name: 'share' }}
      clearIcon = {{type: 'material-community', color: '#86939e', name: 'share' }}
      placeholder="ค้นหาเมนู"
      onChangeText={this.updateSearch}
      value={this.state.search}
    />
    {flatListComp}
    </View>);
  };

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    //generalMenu
    if(item.imageUrl == "")
    {
      branchImageUrl = this.state.branchImageUrl;
      uri = this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+branchImageUrl+'&type=2';
    }
    else
    {
      uri = this.state.dataUrl + 'JBODownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=1';
    }

    runOutImageSource = item.status == 2?require("./../assets/images/foodRunOutLabel.png"):require("./../assets/images/foodRunOutLabel_blank.png");

    generalMenu = (
    <View
      style={[styles.item,{backgroundColor: isActive ? '#dff7f3' : '#FFFFFF'}]}
    >
      <View style={{display:'flex',flexDirection:'row'}}>
        <Image
          source={runOutImageSource}
          style={styles.foodRunOutLabel}
        />
        <Image
          source={{uri: uri}}
          style={{width:70,height:70,marginTop:10,marginLeft:20,borderRadius:10}}
        />
        <View>
          <Text style={styles.itemText}>{item.titleThai}</Text>
          <View style={{display:'flex',flexDirection:'row'}}>
            <Text style={[styles.itemSub,(item.price == item.specialPrice)?null:{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]}>฿ {item.price}</Text>
            {item.price == item.specialPrice?null:(<Text style={[styles.itemSub,{color:"#FF3C4B",paddingLeft:10}]}>฿ {item.specialPrice}</Text>)}
          </View>
        </View>
      </View>
      <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20,marginTop:10}}/>
    </View>);

    {
      menuItem = generalMenu;
    }

    //menutype == 100 -> cannot sort
    if(item.menuTypeID == 100)
    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{
        borderColor:'transparent'
      }}
      >
      {menuItem}
      </TouchableOpacity>);
    }
    else
    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {menuItem}
      </TouchableOpacity>);
    }


    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return itemView;
  };

  render() {
    return (
        <View style={[styles.container, {paddingTop: 0}]}>
        <ScrollableTabView
          onChangeTab = {(item) => {this.onChangeTab(item)}}
          tabBarActiveTextColor = "#FF3C4B"
          renderTabBar={() => <TabBar underlineColor="#FF3C4B"
            tabBarTextStyle={{fontFamily: "Prompt-SemiBold",color: "#464646"}}
            activeTabTextStyle={{fontFamily: "Prompt-SemiBold",color: "#FF3C4B"}}
            />}
        >
          {this.state.menuType.map((item, i) => <this.Page key={i} menuTypeID={item.MenuTypeID} tabLabel={{label: item.NameEn}} label={item.NameEn}/>)}
        </ScrollableTabView>
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
  itemRecommended:
  {
    backgroundColor: '#ffffff',
    width: (Dimensions.get('window').width-4*7)/2,
    height: (Dimensions.get('window').width-4*7)/2+2*40,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0
    },
    elevation: 5,
  },
  itemRecommendedGrid:
  {
    width: (Dimensions.get('window').width)/2,
    height: (Dimensions.get('window').width-4*7)/2+2*40+2*7,
    padding: 7,
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
});
export default MenuOnOffScreen;
