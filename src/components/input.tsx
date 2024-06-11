import { TextInput, TextInputProps, StyleSheet } from "react-native";

export function Input({ ...rest}: TextInputProps){
    return <TextInput style={style.textInput}{...rest}>
    </TextInput>
}

const style = StyleSheet.create({
    textInput:{
        height: 54,
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 7,
        paddingHorizontal: 16,
        marginTop: 32,
        marginBottom: 16
    }
})