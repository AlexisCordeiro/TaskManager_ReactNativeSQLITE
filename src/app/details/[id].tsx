import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTasksDatabase } from "@/database/useTasksDatabase";
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/types";

type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function Details() {
    const [data, setData] = useState<{ title: string; category_name?: string }>({ title: "", category_name: "" });
    const tasksDatabase = useTasksDatabase();
    const params = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation<DetailsScreenNavigationProp>();

    useEffect(() => {
        if (params.id) {
            tasksDatabase.show(Number(params.id)).then(async response => {
                if (response) {
                    const category = response.category_id 
                        ? await tasksDatabase.getCategory(response.category_id) 
                        : { name: "Sem categoria" };
                    setData({ title: response.title, category_name: category?.name });
                }
            });
        }
    }, [params.id]);

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Detalhes da Tarefa"/>
                <Card.Content>
                    <Text style={styles.label}>ID:</Text>
                    <Text style={styles.value}>{params.id}</Text>
                    <Text style={styles.label}>NOME:</Text>
                    <Text style={styles.value}>{data.title}</Text>
                    <Text style={styles.label}>CATEGORIA:</Text>
                    <Text style={styles.value}>{data.category_name}</Text>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={() => navigation.goBack()} labelStyle={styles.buttonLabel} style={styles.button}>
                Voltar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: '70%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        width: 180,
        height: 50,
        borderRadius: 50,
        justifyContent: "center"
    },
    buttonLabel: {
        fontSize: 20,
    },
});