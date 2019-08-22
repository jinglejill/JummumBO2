import React, {Component}  from 'react';
import { StyleSheet, Text , FlatList, Dimensions, TouchableWithoutFeedback, View, Platform, ActivityIndicator } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
var SharedPreferences = require('react-native-shared-preferences');


const data = [
  { key: 'เมนูอาหารหลัก \nและส่วนลด' },
  { key: 'เมนูอาหารอื่นๆ' },
  { key: 'เมนูอาหารยังไม่เริ่มใช้\n/ไม่ใช้แล้ว' },
  { key: 'รายการโน้ต' },
  { key: 'Hot Deal' },
  { key: 'เครื่องพิมพ์' },
  { key: 'Lucky Draw' },
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
   if(item.key == 'เมนูอาหารหลัก \nและส่วนลด')
   {
     this.props.navigation.navigate('MenuOnOffScreen',
      {
        'dataUrl': this.props.navigation.state.params.dataUrl,
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username,
        'menuTopic': 0
      });
   }
   else if(item.key == 'เมนูอาหารอื่นๆ')
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
   else if(item.key == 'Lucky Draw')
   {
     this.props.navigation.navigate('LuckyDrawScreen',
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
        <View
          style={styles.item}
        >
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    console.log("menu screen:"+this.props.navigation.state.params.branchID);
    return (
      <View style={styles.background}>
      <View style={styles.centerInContainer} >
        <Text style={styles.itemText}></Text>
        <Text style={styles.itemTitle}>สวัสดี</Text>
        <Text style={styles.itemTextRegular}>{this.state.fullName}</Text>
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
    paddingTop: 40,
    alignItems: 'center',
    height:120,
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
    margin: 1,
    height: 100//Dimensions.get('window').width / numColumns, // approximate a square
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
    fontSize: 14,
    textAlign: 'left',
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
