import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList,SectionList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, Image, ScrollView, Platform,ActivityIndicator } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import Spinner from 'react-native-spinkit';



titleTextBottom = 0;
// numColumns = 1;
export class NoteSelectScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: this.props.navigation.state.params.dataUrl,
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      menuID: this.props.navigation.state.params.menuID,
      noteType: [],
      wordAdd: "",
      wordNo: "",
      reRender: 0,

      loading: true,
      toggleUpdate: false,
      showSpinner:true,
    };
  }

  componentDidMount()
  {
    this.loadNote();
  }

  loadNote = () =>
  {
    this.setState({showSpinner:true});
    fetchUrl = this.state.dataUrl + 'JBONoteWithMenuIDMapGetList.php';

    fetch(fetchUrl,
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menuID: this.state.menuID,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({showSpinner:false});
      this.setState({noteType:responseData.data.NoteType});
      this.setState({wordAdd:responseData.data.WordAdd});
      this.setState({wordNo:responseData.data.WordNo});
    }).done();
  };

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

        data.push({key:note.NoteID,Name:note.Name,NameEn:note.NameEn,NoteTypeID:note.NoteTypeID,NoteID:note.NoteID, Price:price, OrderNo:note.OrderNo, Type:note.Type, Selected:note.Selected});
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

  actionOnRow(item) {
    //toggle select
    //update db and re-render
    selectedNoteType = this.state.noteType.filter((noteType) => noteType.NoteTypeID == item.NoteTypeID);
    selectedNoteType.map((noteType)=>{
      note = noteType.Note;
      selectedNote = note.filter((note) => note.NoteID == item.NoteID);
      selectedNote.map((note)=>{
        note.Selected = !note.Selected;
        this.updateMenuNote(item.NoteID,note.Selected);
      });
    });
    this.setState({reRender:!this.state.reRender});
  };

  updateMenuNote = (noteID,selected) =>
  {
    fetch(this.state.dataUrl + 'JBOMenuNoteUpdate.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menuID: this.state.menuID,
        noteID: noteID,
        selected: selected,
        modifiedUser: this.state.username,
        modifiedDate: new Date().toLocaleString()
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{

    }).done();
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {

    //generalMenu
    noteItem = (
    <View
      style={[styles.item,{backgroundColor: item.Selected ? '#dff7f3' : '#FFFFFF'}]}
    >
      <View style={{display:'flex',flexDirection:'row',height:44,alignItems:'center'}}>
        <Text style={{fontFamily:"Prompt-Regular",color:'#232323',paddingLeft:20,textDecorationLine:'underline'}}>{item.Type == -1?this.state.wordNo:this.state.wordAdd}</Text>
        <Text style={{fontFamily:"Prompt-Regular",color:'#232323'}}> {item.Name}</Text>
        <Text style={{fontFamily:"Prompt-Regular",color:'#FF3C4B',position:'absolute',right:20}}>{item.Price==0?"":"+"+item.Price}</Text>
      </View>
      <View style={{width:Dimensions.get('window').width-2*20,height:1,backgroundColor:"#e0e0e0",left:20}}/>
    </View>);


    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{
        borderColor:'transparent'
        }}
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
        <ScrollView><View style={[styles.container, {paddingTop: 0}]}>
        {
          data.map((item)=>
          {
            return (<View style={{flex:1}}>
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
});
export default NoteSelectScreen;
