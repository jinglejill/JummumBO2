import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Modal from "react-native-modal";
import { Button} from 'react-native-elements';

export class MessageBox extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      visibleMode: false,
              };
  }

  componentWillReceiveProps(props) {
    this.setState({ visibleMode: props.display })
  }

  closeModal = () =>
  {
    this.props.onClose();
  }

  render() {
    return (
      <View>
      <Modal isVisible={this.state.visibleMode}>
        <View>
          <View style={styles.messageBox}>
            <Text style={styles.title}>{this.props.messageTitle}</Text>
            <Text style={styles.message}>{this.props.message}</Text>
            <View style={{position:"absolute",bottom:0,zIndex:1}}>
              <Button
                buttonStyle={styles.okButton}
                titleStyle={{fontFamily: "Prompt-SemiBold",color:"#005A50"}}
                onPress={this.closeModal} title="OK">
              </Button>
            </View>
            <View style={styles.messageBoxSize}/>
          </View>
        </View>
      </Modal>
    </View>);
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Prompt-SemiBold",
    color:'#454545',
    textAlign:'center',
    fontSize:20,
    top:20,
    left:20,
    right:20,
    bottom:20
  },
  message: {
    fontFamily: "Prompt-Regular",
    color:'#454545',
    fontSize:16,
    marginTop:40,
    marginLeft:20,
    marginRight:20,
    marginBottom:20
  },
  messageBoxSize: {
    width: 300,
    height: 90
  },
  messageBox: {
    // flex: 0,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  okButton: {
    backgroundColor: "#D9D9D9",
    width: 300,
    height: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 0,
    paddingBottom: 0
  },
})
export default MessageBox;
