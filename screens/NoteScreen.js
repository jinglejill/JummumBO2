import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList,SectionList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, Image, ScrollView, Platform, ActionSheetIOS, ActivityIndicator } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';


titleTextBottom = 0;
// numColumns = 1;
export class NoteScreen extends Component
{
  // actionSheetOptions = [<Text style={[styles.actionSheet,{color:'#FF3C4B'}]}>ลบ {this.state.selectedNoteItem?this.state.selectedNoteItem.Name:""}</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>];
  showActionSheet = () => {
    this.ActionSheet.show()
  }
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      noteType: [],
      wordAdd: "",
      wordNo: "",
      wordAddValue: "",
      wordNoValue: "",
      selectedNoteItem:null,
      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSetting: this.goToNoteSetting });
    this.loadNote();
  }

  goToNoteSetting = () =>
  {
    this.props.navigation.navigate('NoteSettingScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      onGoBack:()=>this.loadNote()
    });
  }

  updateNoteList = (data) =>
  {
    this.setState({showSpinner:true});
    //update state.data to new order
    noteA = data[0];
    updateNoteType = [];
    this.state.noteType.map((noteType)=>
    {
      if(noteType.NoteTypeID == noteA.NoteTypeID)
      {
        selectedNoteType = noteType;
        selectedNoteType.Note = data;
        updateNoteType.push(selectedNoteType);
      }
      else
      {
        updateNoteType.push(noteType);
      }
    })

    this.setState({noteType:updateNoteType});
    data.map((note)=>{note.noteID = note.NoteID;});

    //NoteList
    fetch(this.state.dataUrl + 'JBONoteUpdateList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        note: data,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
      this.setState({noteType:responseData.data.NoteType});
    }).done();
  }

  loadNote = () =>
  {
    console.log("load note");
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBONoteGetList.php';

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
      this.setState({noteType:responseData.data.NoteType});
      this.setState({wordAdd:responseData.data.WordAdd});
      this.setState({wordNo:responseData.data.WordNo});
      this.setState({wordAddValue:responseData.data.WordAddValue});
      this.setState({wordNoValue:responseData.data.WordNoValue});
    }).done();
  };

  newNote = (item) =>
  {
    this.props.navigation.navigate('NoteDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'noteID':0,
      'noteTypeID': item.noteTypeID,
      'wordAdd': this.state.wordAdd,
      'wordNo': this.state.wordNo,
      'wordAddValue': this.state.wordAddValue,
      'wordNoValue': this.state.wordNoValue,
      onGoBack:()=>this.loadNote()
    });
  }

  editNote = (item) =>
  {
    this.props.navigation.navigate('NoteDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'noteTypeID':item.NoteTypeID,
      'noteID':item.NoteID,
      'name':item.Name,
      'nameEn':item.NameEn,
      'price':item.Price,
      'type': item.Type,
      'wordAdd': this.state.wordAdd,
      'wordNo': this.state.wordNo,
      'wordAddValue': this.state.wordAddValue,
      'wordNoValue': this.state.wordNoValue,
      onGoBack:()=>this.loadNote()
    });
  }

  copyNote = (item) =>
  {
    fetch(this.state.dataUrl + 'JBONoteCopyInsert.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        noteID: item.NoteID,
        noteTypeID: item.NoteTypeID,
        type: item.Type,
        name: item.Name,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
      this.setState({noteType:responseData.data.NoteType});
    }).done();
  }

  showActionSheetItem = (item) =>
  {
    this.setState({selectedNoteItem:item});
    this.showActionSheet();
  }

  confirmDeleteNote = (buttonIndex) =>
  {
    if (buttonIndex === 0)
    {
      fetch(this.state.dataUrl + 'JBONoteDelete.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          noteID: this.state.selectedNoteItem.NoteID,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
        this.setState({showSpinner:false});
        this.setState({noteType:responseData.data.NoteType});
        console.log("response after delete note");
      }).done();
    }
    else if(buttonIndex == 1)
    {
      this.setState({selectedNoteItem:null});
    }
  }

  formatData = (item, numColumns) =>
  {
    if(this.state.noteType)
    {
      data = [];
      selectedNoteType = this.state.noteType.filter((noteType) => noteType.NoteTypeID == item.noteTypeID);
      selectedNoteType.map((noteType)=>{
      note = noteType.Note;
      note.map((note)=>{

        var parts = (+note.Price).toFixed(2).split(".");
        price = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];

        data.push({key:note.NoteID,Name:note.Name,NameEn:note.NameEn,NoteTypeID:note.NoteTypeID,NoteID:note.NoteID, Price:price, OrderNo:note.OrderNo, Type:note.Type});
        });

        data = data.sort(function (a, b)
        {
          return a.orderNo - b.orderNo;
        });
      });
    }
    else
    {
      data = [];
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

    //generalMenu
    noteItem = (
    <View
      style={[styles.item,{backgroundColor: isActive ? '#dff7f3' : '#FFFFFF'}]}
    >
      <View style={{display:'flex',flexDirection:'row',height:44,alignItems:'center'}}>
        <Text style={{fontFamily:"Prompt-Regular",color:'#232323',paddingLeft:20,textDecorationLine:'underline'}}>{item.Type == -1?this.state.wordNo:this.state.wordAdd}</Text>
        {
          (item.Type == -1 && this.state.wordNo != "") || (item.Type == 1 && this.state.wordAdd != "")?(<View><Text> </Text></View>):(<View><Text></Text></View>)
        }

        <Text style={{fontFamily:"Prompt-Regular",color:'#232323'}}>{item.Name}</Text>
        <Text style={{fontFamily:"Prompt-Regular",color:'#FF3C4B'}}> {item.Price==0?"":"+"+item.Price}</Text>
        <TouchableHighlight onPress={()=>this.copyNote(item)}
          style={{
            flex:1,
            borderRadius:5,
            backgroundColor:'#64DCC8',
            width:40,
            height:25,
            justifyContent:'center',
            alignItems:'center',
            position:'absolute',
            right:20+40+20+40+20
          }}>
          <View>
            <Image
              source={require("./../assets/images/copy.png")}
              style={{width:15,height:15}}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>this.editNote(item)}
          style={{
            flex:1,
            borderRadius:5,
            backgroundColor:'#64DCC8',
            width:40,
            height:25,
            justifyContent:'center',
            alignItems:'center',
            position:'absolute',
            right:20+40+20
          }}>
          <View>
            <Image
              source={require("./../assets/images/pencil-edit-button-white.png")}
              style={{width:15,height:15}}
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>this.showActionSheetItem(item)}
        style={{borderRadius:5,
          backgroundColor:'#FF3C4B',
          width:40,
          height:25,
          justifyContent:'center',
          alignItems:'center',
          position:'absolute',
          right:20}}
        >
        <View>
          <Image
            source={require("./../assets/images/delete.png")}
            style={{width:15,height:15}}
          />
        </View>
        </TouchableHighlight>
      </View>
      <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
    </View>);

    {
      itemView = (<TouchableOpacity
        onPress=""
        style={{
        borderColor:'transparent'
      }}
      onLongPress={move}
      onPressOut={moveEnd}
      >
      {noteItem}
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
    if(this.state.noteType)
    {
      data = [];
      this.state.noteType.map((noteType)=>{
        noteType.Note.map((Note)=>{});
        data.push({title:noteType.Name,noteTypeID:noteType.NoteTypeID});
      });
    }
    else
    {
      data = [];
    }

    return (
        <ScrollView>
        <View style={[styles.container, {paddingTop: 0}]}>
        {
          data.map((item)=>
          {
            return (<View style={{flex:1}}>
              <View style={{backgroundColor: '#ECECEC',height:25}}>
                <Text style={{fontFamily: 'Prompt-SemiBold',color: '#FF3C4B',paddingLeft:20}} >{item.title}</Text>
                <TouchableHighlight underlayColor='transparent' onPress={()=>this.newNote(item)} style={[styles.buttonEdit]}>
                  <Text style={[styles.textEdit]}>New</Text>
                </TouchableHighlight>
              </View>
                <DraggableFlatList
                  data={this.formatData(item, numColumns)}
                  style={styles.container}
                  contentContainerStyle={{
                padding:0}}
                  renderItem={this.renderItem}
                  numColumns={numColumns}
                  keyExtractor={(item, index) => `draggable-item-${item.key}`}
                  scrollPercent={5}
                  onMoveEnd={({ data }) =>
                    {
                      this.updateNoteList(data);
                      //set state
                      // this.setState({noteType:data});
                    }}
                />
            </View>
            );
          })
        }
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={''}
          options={[<Text style={[styles.actionSheet,{color:'#FF3C4B'}]}>ลบ {this.state.selectedNoteItem?this.state.selectedNoteItem.Name:""}</Text>,<Text style={[styles.actionSheet,{color:'#CCCCCC'}]}>ยกเลิก</Text>]}
          cancelButtonIndex={1}
          destructiveButtonIndex={1}
          onPress={(index) => {  this.confirmDeleteNote(index) }}
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
  actionSheet:
  {
    fontFamily:'Prompt-Regular',
    fontSize:18,
    color:'#005A50'
  },
});
export default NoteScreen;
