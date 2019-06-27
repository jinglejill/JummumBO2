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
export class PrinterScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      noteType: [],
      wordAdd: "",
      wordNo: "",
      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadPrinter();
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

  loadPrinter = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBOPrinterGetList.php';

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
      this.setState({printer:responseData.data.Printer});
    }).done();
  };

  editPrinter = (item) =>
  {
    console.log("edit printer:"+JSON.stringify(item));
    this.props.navigation.navigate('PrinterDetailScreen',
    {
      'dataUrl': this.props.navigation.state.params.dataUrl,
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,

      'printerID':item.printerID,
      'name':item.name,
      onGoBack:()=>this.loadPrinter()
    });
  }

  formatData = (item, numColumns) =>
  {
    if(this.state.printer)
    {
      data = [];
      this.state.printer.map((printer)=>
      {
        data.push({key:printer.PrinterID,printerID:printer.PrinterID,name:printer.Name});
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
    printerItem = (
    <View
      style={[styles.item,{backgroundColor: '#FFFFFF'}]}
    >
      <View style={{display:'flex',flexDirection:'row',height:44,alignItems:'center'}}>
        <Text style={{fontFamily:"Prompt-Regular",color:'#232323',paddingLeft:20}}>{index + 1}.</Text>
        <Text style={{fontFamily:"Prompt-Regular",color:'#232323'}}> {item.name}</Text>
        <TouchableHighlight onPress={()=>this.editPrinter(item)}
          style={{
            flex:1,
            borderRadius:5,
            backgroundColor:'#64DCC8',
            width:40,
            height:25,
            justifyContent:'center',
            alignItems:'center',
            position:'absolute',
            right:20
          }}>
          <View>
            <Image
              source={require("./../assets/images/pencil-edit-button-white.png")}
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
      {printerItem}
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

    return (
      <View style={[styles.container, {paddingTop: 0}]}>
        <FlatList
          data={this.formatData(this.state.printer, numColumns)}
          style={styles.container}
          contentContainerStyle={{
        padding:0}}
          renderItem={this.renderItem}
          numColumns={numColumns}
          keyExtractor={(item, index) => `draggable-item-${item.PrinterID}`}
        />

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
});
export default PrinterScreen;
