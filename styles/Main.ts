import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    exemplo: {
      fontSize: 10,
    },
    error: {
      fontSize: 10,
      color: 'red',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12,
    },
    input: {
      height: 40,
      flex: 1,
      borderWidth: 1,
      padding: 10,
    },
    addButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    Division: {
      alignItems: 'center',
      marginTop: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    Container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 20,
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
    scrollContainer: {
      marginTop: 20,
      width: '100%',
    },
    chordText: {
      fontSize: 16,
      marginVertical: 5,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
  });