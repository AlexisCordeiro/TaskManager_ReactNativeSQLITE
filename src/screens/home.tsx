import { Input } from "@/components/input";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, View } from "react-native";
import { useTasksDatabase, TaskDatabase, CategoryDatabase } from "@/database/useTasksDatabase";
import { Task } from "@/components/task";
import { FAB } from 'react-native-paper';

import { router } from "expo-router";
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from "@/types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
    const [id, setID] = useState("");
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [search, setSearch] = useState("");
    const [tasks, setTasks] = useState<TaskDatabase[]>([]);
    const [categories, setCategories] = useState<CategoryDatabase[]>([]);

    const tasksDatabase = useTasksDatabase();
    const navigation = useNavigation<HomeScreenNavigationProp>();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await tasksDatabase.listCategories();
                setCategories(response);
            } catch (error) {
                console.log(error);
            }
        }

        fetchCategories();
        list();
    }, [search]);

    async function create() {
        try {
            const response = await tasksDatabase.create({
                title,
                category_id: categoryId
            });
            Alert.alert("Task cadastrada com o ID: " + response.insertedRowId);
            await list();
        } catch (error) {
            console.log(error);
        }
    }

    async function update() {
        try {
            await tasksDatabase.update({
                id: Number(id),
                title,
                category_id: categoryId
            });
            Alert.alert("Task atualizada!");
            await list();
        } catch (error) {
            console.log(error);
        }
    }

    async function list() {
        try {
            const response = await tasksDatabase.searchByName(search);
            setTasks(response);
        } catch (error) {
            console.log(error);
        }
    }

    function details(item: TaskDatabase) {
        setID(String(item.id));
        setTitle(item.title);
        setCategoryId(item.category_id);
    }

    async function remove(id: number) {
        try {
            await tasksDatabase.remove(id);
            await list();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSave() {
        if (id) {
            update();
        } else {
            create();
        }
        setID("");
        setTitle("");
        setCategoryId(undefined);
    }

    return (
        <View style={styles.container}>
            {tasks.length > 0 && (
                <Input placeholder="Pesquisar" onChangeText={setSearch} />
            )}

            <FlatList
                data={tasks}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Task
                        data={item}
                        onPress={() => details(item)}
                        onDelete={() => remove(item.id)}
                        onOpen={() => router.navigate("/details/" + item.id)}
                    />
                )}
                contentContainerStyle={{ gap: 16, paddingTop: 16 }}
            />

            {id ? (
                <>
                    <Input placeholder="Titulo" onChangeText={setTitle} value={title} />
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
                    <Button title="Salvar" onPress={handleSave} />
                </>
            ) : null}

            {!id ? (
                <>
                    <FAB
                        style={styles.fab}
                        icon="plus"
                        color="white"
                        onPress={() => navigation.navigate("AddTask")}
                    />
                    <FAB
                        style={styles.fabLeft}
                        icon="label"
                        color="white"
                        onPress={() => navigation.navigate("AddCategory")}
                    />
                </>
            ) : null}
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
    fab: {
        position: 'absolute',
        margin: 24,
        backgroundColor: "purple",
        marginBottom: 32,
        marginRight: 32,
        right: 0,
        bottom: 0,
        borderRadius: 32,
    },
    fabLeft: {
        position: 'absolute',
        margin: 24,
        backgroundColor: "purple",
        marginBottom: 32,
        marginLeft: 32,
        left: 0,
        bottom: 0,
        borderRadius: 32,
    },
    picker: {
        height: 50,
        marginBottom: 150,
    },
});