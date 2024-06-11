import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Input } from "@/components/input";
import { useTasksDatabase } from "@/database/useTasksDatabase";
import { useNavigation } from '@react-navigation/native';
import { Button } from "react-native-paper";

export default function AddCategory() {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const tasksDatabase = useTasksDatabase();
    const navigation = useNavigation();

    async function create() {
        try {
            const normalizedColor= color.toLowerCase()
            const response = await tasksDatabase.createCategory({
                name,
                color: normalizedColor,
            });

            Alert.alert("Categoria cadastrada com o ID: " + response.insertedRowId);
            navigation.goBack();

        } catch (error) {
            console.log(error);
        }
    }

    async function handleSave() {
        if (name.trim() && color.trim()) {
            create();
        } else {
            Alert.alert("Por favor, insira um nome e uma cor para a categoria.");
        }
    }

    return (
        <View style={styles.container}>
            <Input 
                placeholder="Nome da Categoria" 
                onChangeText={setName} 
                value={name} 
            />
            <Input 
                placeholder="Cor da Categoria" 
                onChangeText={setColor} 
                value={color} 
            />
            <View style={styles.containerButton}>
                <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.buttonLabel}>
                    Salvar
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
        backgroundColor: "white"
    },
    containerButton: {
        alignItems: "center",
        marginTop: 16,
    },
    saveButton: {
        width: 130,
        height: 40,
        justifyContent: "center",
        backgroundColor: "purple",
    },
    buttonLabel: {
        fontSize: 18,
    },
});