import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import Modal from "react-native-modal";
import { Button} from 'react-native-elements';

export class MessageBoxConfirm extends Component
{
  constructor(props) {
    super(props);
    this.state = { visibleMode: false,
              };
  }

  componentWillReceiveProps(props) {
    this.setState({ visibleMode: props.display })
  }

  confirm = () =>
  {
    this.props.onConfirm();
  }

  cancel = () =>
  {
    this.props.onCancel();
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
                buttonStyle={styles.confirmButton}
                titleStyle={{fontFamily: "Prompt-SemiBold",color:"#FFFFFF"}}
                onPress={this.confirm} title="ยืนยัน">
              </Button>
              <Button
                buttonStyle={styles.cancelButton}
                titleStyle={{fontFamily: "Prompt-SemiBold",color:"#FFFFFF"}}
                onPress={this.cancel} title="ยกเลิก">
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
    marginTop:20,
    marginLeft:20,
    marginRight:20,
    marginBottom:20
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
    height: 70
  },
  messageBox: {
    // flex: 0,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  confirmButton: {
    backgroundColor: "#FF3C4B",
    width: 300-2*10,
    height: 30,
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 0,
    margin:5
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
    width: 300-2*10,
    height: 30,
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 0,
    margin:5,
    marginBottom:10
  },
})
export default MessageBoxConfirm;
