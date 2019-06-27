import React from 'react';
import SortableGrid from 'react-native-sortable-grid';
import { StyleSheet, Text , FlatList, Dimensions, TouchableWithoutFeedback, View, ScrollView} from 'react-native';

export class TestScreen extends React.Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
          <ScrollView>
          <SortableGrid
            blockHeight = {(Dimensions.get('window').width-4*7)/2+80+2*7}
             blockTransitionDuration      = { 400 }
             activeBlockCenteringDuration = { 200 }
             itemsPerRow                  = { 2 }
             dragActivationTreshold       = { 200 }
             onDragRelease                = { (itemOrder) => console.log("Drag was released, the blocks are in the following order: ", itemOrder) }
             onDragStart                  = { ()          => console.log("Some block is being dragged now!") }
             >

             {
               ['a', 'b', 'c','d','e','f','g','h','i'].map( (letter, index) =>

                 <View key={index}
                  onTap={() => console.log("Item number:", index, "was tapped!") }
                  style={{padding:7, borderWidth:1, borderColor:"red", width:(Dimensions.get('window').width)/2, height:(Dimensions.get('window').width-4*7)/2+80+2*7}}
                 >
                  <View style={{borderWidth:1, borderColor:"green", width:(Dimensions.get('window').width-4*7)/2, height:(Dimensions.get('window').width-4*7)/2+80}}>
                   <Text>{letter}</Text>
                  </View>
                 </View>
               )
             }
            </SortableGrid>
            </ScrollView>
        );
    }
}
export default TestScreen;
