import { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Input } from "@/components/input";
import { useTasksDatabase, CategoryDatabase } from "@/database/useTasksDatabase";
import { useNavigation } from '@react-navigation/native';
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export default function AddTask() {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState<number>();
    const [categories, setCategories] = useState<CategoryDatabase[]>([]);
    const tasksDatabase = useTasksDatabase();
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchCategories() {
            const response = await tasksDatabase.listCategories();
            setCategories(response);
        }
        fetchCategories();
    }, []);

    async function create() {
        try {
            const response = await tasksDatabase.create({
                title,
                category_id: categoryId,
            });

            Alert.alert("Task cadastrada com o ID: " + response.insertedRowId);
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSave() {
        if (title.trim()) {
            create();
        } else {
            Alert.alert("Por favor, insira um título para a tarefa.");
        }
    }

    return (
        <View style={styles.container}>
            <Input 
                placeholder="Titulo da Tarefa" 
                onChangeText={setTitle} 
                value={title} 
            />
            <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione uma categoria" value={undefined} />
                {categories.map((category) => (
                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
            </Picker>
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
    picker: {
        height: 50,
        marginBottom: 150
    },
    containerButton: {
        alignItems: "center",
        
    },
    saveButton: {
        width: 130,
        height: 40,
        justifyContent: "center",
        backgroundColor:"purple",
    },
    buttonLabel:{
        fontSize: 18
    }
});