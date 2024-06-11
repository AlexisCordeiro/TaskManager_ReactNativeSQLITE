import { Pressable, Text, PressableProps, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTasksDatabase, CategoryDatabase } from "@/database/useTasksDatabase";

type Props = PressableProps & {
    data: {
        id: number;
        title: string;
        category_id?: number;
    };

    onDelete: () => void;
    onOpen: () => void;
};

export function Task({ data, onDelete, onOpen, ...rest }: Props) {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryColor, setCategoryColor] = useState<string>("#CECECE");
    const tasksDatabase = useTasksDatabase();

    useEffect(() => {
        async function fetchCategoryDetails() {
            if (data.category_id) {
                const category = await tasksDatabase.getCategory(data.category_id) as CategoryDatabase;
                setCategoryName(category?.name || "Sem categoria");
                setCategoryColor(category?.color || "#CECECE");
            } else {
                setCategoryName("Sem categoria");
                setCategoryColor("#CECECE");
            }
        }

        fetchCategoryDetails();
    }, [data.category_id]);

    return (
        <Pressable {...rest} style={[style.container, { backgroundColor: categoryColor }]}>
            <Text style={style.text}>
                Task: {data.title}, Categoria: {categoryName}
            </Text>

            <TouchableOpacity onPress={onDelete}>
                <MaterialIcons name="delete" size={24} color={"red"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onOpen}>
                <MaterialIcons name="visibility" size={24} color={"grey"} />
            </TouchableOpacity>
        </Pressable>
    );
}

const style = StyleSheet.create({
    container: {
        padding: 24,
        borderRadius: 5,
        gap: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        flex: 1,
    }
});