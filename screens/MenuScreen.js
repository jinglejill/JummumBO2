import React, {Component}  from 'react';
import { StyleSheet, Text , FlatList, Dimensions,Image, TouchableWithoutFeedback, View, Platform, ActivityIndicator } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
var SharedPreferences = require('react-native-shared-preferences');

const heightMenu = (Dimensions.get('window').height - 64)/6;
const data = [
  { key: 'เมนูอาหารหลัก\nและส่วนลด' },
  { key: 'เมนูอาหารย่อย\nของเมนูบุฟเฟ่ต์' },
  { key: 'เมนูอาหารยังไม่เริ่มใช้\n/ไม่ใช้แล้ว' },
  { key: 'รายการโน้ต' },
  { key: 'โปรโมชั่น' },
  { key: 'เครื่องพิมพ์' },
  { key: 'ลุ้นรางวัล' },
  { key: 'Voucher' },
  { key: 'ตั้งค่าร้านอาหาร' },
  { key: 'ออกจากระบบ' },
];

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 2;
export class MenuScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      fullName: this.props.navigation.state.params.fullName,
    };
  }

  actionOnRow(item) {
   console.log('Selected Item :',item);
   if(item.key == 'เมนูอาหารหลัก\nและส่วนลด')
   {
     this.props.navigation.navigate('MenuOnOffScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username,
        'menuTopic': 0
      });
   }
   else if(item.key == 'เมนูอาหารย่อย\nของเมนูบุฟเฟ่ต์')
   {
     this.props.navigation.navigate('MenuOnOffScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username,
        'menuTopic': 1
      });
   }
   else if(item.key == 'เมนูอาหารยังไม่เริ่มใช้\n/ไม่ใช้แล้ว')
   {
     this.props.navigation.navigate('MenuOnOffScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username,
        'menuTopic': 2
      });
   }
   else if(item.key == 'รายการโน้ต')
   {
     this.props.navigation.navigate('NoteScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'ตั้งค่าร้านอาหาร')
   {
     this.props.navigation.navigate('BranchSettingScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'โปรโมชั่น')
   {
     this.props.navigation.navigate('DiscountProgramScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'เครื่องพิมพ์')
   {
     this.props.navigation.navigate('PrinterScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'Hot Deal')
   {
     this.props.navigation.navigate('HotDealScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'ลุ้นรางวัล')
   {
     this.props.navigation.navigate('LuckyDrawScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'Voucher')
   {
     this.props.navigation.navigate('VoucherListScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username
      });
   }
   else if(item.key == 'ออกจากระบบ')
   {
     if(Platform.OS === 'android')
     {
       SharedPreferences.setItem("username","");
       SharedPreferences.setItem("password","");
       SharedPreferences.setItem("rememberMe","◻︎ จำฉันไว้ในระบบ");
     }
     else
     {
       DefaultPreference.set('username', "");
       DefaultPreference.set('password', "");
       DefaultPreference.set('rememberMe', "◻︎ จำฉันไว้ในระบบ");
     }
     this.props.navigation.state.params.onGoBack();
     this.props.navigation.goBack(null);
   }
   else
   {
     console.log('no');
   }
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>
        <View style={[styles.item,{marginRight:index%2==1?7:0}]}>
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    console.log("menu screen:"+this.props.navigation.state.params.branchID);
    return (
      <View style={styles.background}>
      <View style={[styles.centerInContainer]} >
        <Image
          source={require("./../assets/images/jummumPeek.png")}
          style={{width:252/121.0*heightMenu,height:heightMenu,position:'absolute',left:0,top:0}}
        />
        <View style={{left:Dimensions.get('window').width/2,width:Dimensions.get('window').width/2,height:heightMenu}}>
        {
          Platform.OS === 'android'?null:(<Text style={styles.itemText}></Text>)
        }
          <Text style={[styles.itemTitle,{paddingTop:30}]}>สวัสดี</Text>
          <Text style={styles.itemTextRegular}>{this.state.fullName}</Text>
        </View>
      </View>
        <FlatList
          data={formatData(data, numColumns)}
          style={styles.container}
          renderItem={this.renderItem}
          numColumns={numColumns}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#e0f8f4",
    opacity: 1,
  },
  centerInContainer: {
    backgroundColor: '#64DCC8',
    // paddingTop: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
    height:heightMenu,
  },
  container: {
    flex: 1,
    marginVertical: 0,
  },
  item: {
    backgroundColor:'#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 7,
    marginLeft: 7,
    height: heightMenu,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 0
    },
    elevation: 2
    // boxshadow: 10 10 5 0 rgba(0,0,0,0.75),
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemTitle: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  itemTextRegular: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  itemText: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    textAlign: 'center',
    color: '#232323',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
});
export default MenuScreen;
