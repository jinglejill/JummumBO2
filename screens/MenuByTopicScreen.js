import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView, Platform,ActivityIndicator,Alert } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import { SearchBar } from 'react-native-elements';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';

//cat = 1 come from DiscountProgramDetailScreen send discountGroupMenuID as param
//menuTopic for select menu belong to buffet
//0=> alacarteMenu = 1 and status in (1,2),
//1=> alacarteMenu = 0 and status in (1,2),
//2=> status not in (1,2)
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
export class MenuByTopicScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      category: this.props.navigation.state.params.category,
      menuTopic: this.props.navigation.state.params.menuTopic,
      buffetMenuID: this.props.navigation.state.params.buffetMenuID,
      discountGroupMenuID: this.props.navigation.state.params.discountGroupMenuID,
      printerID: this.props.navigation.state.params.printerID,
      reRender: 0,
      selectAll:true,

      menuType: [],
      loading: true,
      search: '',
      data:[],
      selectedIndex:0,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadMenu();
    this.props.navigation.setParams({ handleSelectAll: this.selectAll });
    this.props.navigation.setParams({ selectAllLabel: "Select all" });
    this.props.navigation.setParams({ discountGroupMenuID: this.state.discountGroupMenuID });
  }

  selectAll = () =>
  {
    if(this.state.selectAll)
    {
      this.props.navigation.setParams({ selectAllLabel: "Unselect all" });
    }
    else
    {
      this.props.navigation.setParams({ selectAllLabel: "Select all" });
    }


    //select all process
    index = 0;
    this.state.menuType.map((menuType)=>
    {
      if(index == this.state.selectedIndex)
      {
        menu = menuType.Menu;
        menu.map((menu)=>
        {
          if(this.state.category == 1 && !this.state.selectAll)
          {
            menu.Quantity = 0;
          }
          menu.Selected = this.state.selectAll;
        });
        this.updateBuffetMenuMapList(menu,this.state.selectAll);
      }
      index++;
    });

    this.setState({selectAll:!this.state.selectAll});
    this.setState({reRender:!this.state.reRender});
  }

  updateSearch = search => {
    this.setState({ search: search });
  };

  loadMenu = () =>
  {
    this.setState({showSpinner:true});
    if(this.state.category == 0)
    {
      if(this.state.menuTopic == 0)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuWithBuffetMenuIDGetList.php';
      }
      else if(this.state.menuTopic == 1)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuOtherWithBuffetMenuIDGetList.php';
      }
      else if(this.state.menuTopic == 2)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuNotActiveWithBuffetMenuIDGetList.php';
      }
    }
    else if(this.state.category == 1)
    {
      if(this.state.menuTopic == 0)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuWithDiscountGroupMenuIDGetList.php';
      }
      else if(this.state.menuTopic == 1)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuOtherWithDiscountGroupMenuIDGetList.php';
      }
      else if(this.state.menuTopic == 2)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuNotActiveWithDiscountGroupMenuIDGetList.php';
      }
    }
    else if(this.state.category == 2)
    {
      if(this.state.menuTopic == 0)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuWithPrinterIDGetList.php';
      }
      else if(this.state.menuTopic == 1)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuOtherWithPrinterIDGetList.php';
      }
      else if(this.state.menuTopic == 2)
      {
        fetchUrl = this.state.dataUrl + 'JBOMenuNotActiveWithPrinterIDGetList.php';
      }
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
        buffetMenuID: this.state.buffetMenuID,
        discountGroupMenuID: this.state.discountGroupMenuID,
        printerID: this.state.printerID,
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

  updateBuffetMenuMap = (menuID,selected) =>
  {
    if(this.state.category == 0)
    {
      fetch(this.state.dataUrl + 'JBOBuffetMenuMapUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          buffetMenuID: this.state.buffetMenuID,
          menuID: menuID,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
      }).done();
    }
    else if(this.state.category == 1)
    {
      if(this.state.discountGroupMenuID == -1)
      {
        this.setState({showSpinner:true});
      }
      fetch(this.state.dataUrl + 'JBODiscountGroupMenuMapUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          discountGroupMenuID: this.state.discountGroupMenuID,
          menuID: menuID,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        //update discountGroupMenuID
        this.setState({discountGroupMenuID:responseData.data.DiscountGroupMenuID});
        this.props.navigation.setParams({ discountGroupMenuID: responseData.data.DiscountGroupMenuID });
        this.setState({showSpinner:false});
      }).done();
    }
    else if(this.state.category == 2)
    {
      fetch(this.state.dataUrl + 'JBOPrinterMenuUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          printerID: this.state.printerID,
          menuID: menuID,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
      }).done();
    }
  }

  //for selectAll
  updateBuffetMenuMapList = (menu,selected) =>
  {
    if(this.state.category == 0)
    {
      fetch(this.state.dataUrl + 'JBOBuffetMenuMapUpdateList.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          buffetMenuID: this.state.buffetMenuID,
          menu: menu,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
      }).done();
    }
    else if(this.state.category == 1)
    {
      if(this.state.discountGroupMenuID == -1)
      {
        this.setState({showSpinner:true});
      }
      fetch(this.state.dataUrl + 'JBODiscountGroupMenuMapUpdateList.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          discountGroupMenuID: this.state.discountGroupMenuID,
          menu: menu,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
        //update discountGroupMenuID
        this.setState({discountGroupMenuID:responseData.data.DiscountGroupMenuID});
        this.props.navigation.setParams({ discountGroupMenuID: responseData.data.DiscountGroupMenuID });
        this.setState({showSpinner:false});
      }).done();
    }
    else if(this.state.category == 2)
    {
      fetch(this.state.dataUrl + 'JBOPrinterMenuUpdateList.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          printerID: this.state.printerID,
          menu: menu,
          selected: selected,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
      }).done();
    }
  }

  actionOnRow(item)
  {
    //toggle select
    //update db and re-render
    selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == item.menuTypeID);
    selectedMenuType.map((menuType)=>{
      menu = menuType.Menu;
      selectedMenu = menu.filter((menu) => menu.MenuID == item.menuID);
      selectedMenu.map((menu)=>{
        menu.Selected = !menu.Selected;
        if(this.state.category == 1)
        {
          menu.Quantity = 0;
        }
        this.updateBuffetMenuMap(item.menuID,menu.Selected);
      });
    });
    this.setState({reRender:!this.state.reRender});
 };

 tapOrderNow(item)
 {
   //toggle select
   //update db and re-render
   selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == item.menuTypeID);
   selectedMenuType.map((menuType)=>{
     menu = menuType.Menu;
     selectedMenu = menu.filter((menu) => menu.MenuID == item.menuID);
     selectedMenu.map((menu)=>{
       // menu.Selected = !menu.Selected;
       menu.Quantity = 1;
       this.updateDiscountGroupMenuMapQuantity(item.menuID,menu.Quantity);
     });
   });
   this.setState({reRender:!this.state.reRender});
  };

  quantityMinus(item)
  {
    //toggle select
    //update db and re-render
    selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == item.menuTypeID);
    selectedMenuType.map((menuType)=>{
      menu = menuType.Menu;
      selectedMenu = menu.filter((menu) => menu.MenuID == item.menuID);
      selectedMenu.map((menu)=>{
        // menu.Selected = !menu.Selected;
        menu.Quantity = parseInt(menu.Quantity) - 1;
        this.updateDiscountGroupMenuMapQuantity(item.menuID,menu.Quantity);
      });
    });
    this.setState({reRender:!this.state.reRender});
   };

   quantityPlus(item)
   {
     //toggle select
     //update db and re-render
     selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == item.menuTypeID);
     selectedMenuType.map((menuType)=>{
       menu = menuType.Menu;
       selectedMenu = menu.filter((menu) => menu.MenuID == item.menuID);
       selectedMenu.map((menu)=>{
         // menu.Selected = !menu.Selected;
         menu.Quantity = parseInt(menu.Quantity) + 1;
         this.updateDiscountGroupMenuMapQuantity(item.menuID,menu.Quantity);
       });
     });
     this.setState({reRender:!this.state.reRender});
    };

  updateDiscountGroupMenuMapQuantity = (menuID,quantity) =>
  {
    fetch(this.state.dataUrl + 'JBODiscountGroupMenuMapQuantityUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        discountGroupMenuID: this.state.discountGroupMenuID,
        menuID: menuID,
        quantity: quantity,
        // selected: selected,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({showSpinner:false});
    }).done();
  }

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
    // if(menuTypeID != this.state.menuTypeID )
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
          data.push({key:menu.MenuID,label:menu.TitleThai,backgroundColor:'#FF3C4B',menuTypeID:menu.MenuTypeID,menuID:menu.MenuID,titleThai:menu.TitleThai, price:price, specialPrice:specialPrice, imageUrl:menu.ImageUrl, orderNo:menu.OrderNo, hasFood:hasFood, recommended:recommended, buffetMenu:buffetMenu, alacarteMenu:alacarteMenu, timeToOrder:timeToOrder, imageUrl:menu.ImageUrl, status:parseInt(menu.Status), selected:menu.Selected, menuTypeOrderNo:menu.MenuTypeOrderNo, quantity:menu.Quantity});
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
    // else
    // {
    //   data = this.state.data;
    // }


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
      flatListComp = (<FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItemGrid}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
      />);
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
      flatListComp = (<FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
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

  renderItemGrid = ({ item, index, move, moveEnd, isActive }) =>
  {
    recommendedMenu = (
      <View
        key={index}
        onTap={() => this.actionOnRow(item) }
        style={[styles.itemRecommendedGrid]}
       >
        <View style={[styles.itemRecommended,{backgroundColor: item.selected ? '#dff7f3' : '#FFFFFF'}]}>
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
      </View>);

    {
      menuItem = recommendedMenu;
    }

    //menutype == 100 -> cannot sort
    if(item.menuTypeID == 0)
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

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return itemView;

  }
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

    orderNow = (<View style={[styles.item,{backgroundColor: item.selected ? '#dff7f3' : '#FFFFFF'}]}>
      {
        item.selected ?(
          <TouchableOpacity
            onPress={ () => this.tapOrderNow(item)}
            style={{
            borderColor:'transparent'
          }}
          >
            <Text style={styles.orderNow}>สั่งเลย</Text>
          </TouchableOpacity>
        ):null
      }
    </View>);

    quantityOrder = (<View><View style={[styles.item,{backgroundColor: item.selected ? '#dff7f3' : '#FFFFFF',display:'flex',flexDirection:'row', alignSelf: 'flex-end',paddingRight:0 }]}>
        <TouchableOpacity
          onPress={ () => this.quantityMinus(item)}
          style={{
          borderColor:'transparent'
        }}
        >
          <Text style={[styles.orderNow,{fontSize:24}]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.itemSub,{paddingRight:10,paddingTop:null,alignSelf: "center"}]}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={ () => this.quantityPlus(item)}
          style={{
          borderColor:'transparent'
        }}
        >
          <Text style={[styles.orderNow,{fontSize:24}]}>+</Text>
        </TouchableOpacity>
    </View>
    </View>
    );

    generalMenu = (
    <View
      style={[styles.item,{backgroundColor: item.selected ? '#dff7f3' : '#FFFFFF'}]}
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
          <Text style={[styles.itemText]}>{item.titleThai}</Text>
          <View style={{display:'flex',flexDirection:'row'}}>
            <Text style={[styles.itemSub,(item.price == item.specialPrice)?null:{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]}>฿ {item.price}</Text>
            {item.price == item.specialPrice?null:(<Text style={[styles.itemSub,{color:"#FF3C4B",paddingLeft:10}]}>฿ {item.specialPrice}</Text>)}
          </View>
          {
            this.state.category == 1 && item.quantity == 0?orderNow:null
          }
          {
            this.state.category == 1 && item.quantity != 0?quantityOrder:null
          }
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
      itemView = (<View><TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {menuItem}
      </TouchableOpacity>
      </View>
      );
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
          {this.state.menuType.map((item, i) => <this.Page key={i} menuTypeID={item.MenuTypeID} tabLabel={{label: item.Name}} label={item.Name}/>)}
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
    elevation:5
  },
  itemRecommendedGrid:
  {
    width: (Dimensions.get('window').width)/2,
    height: (Dimensions.get('window').width-4*7)/2+2*40+2*7,
    /*padding: 7,*/
  },
  itemText: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    color: '#005A50',
    paddingTop: 10,
    paddingLeft: 10,
    width: Dimensions.get('window').width - 2*20 - 70,
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
  orderNow: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 12,
    textAlign: 'right',
    color: '#005A50',
    alignItems: 'center'
  },
});
export default MenuByTopicScreen;
