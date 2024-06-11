import { useSQLiteContext } from "expo-sqlite";

export type TaskDatabase = {
    id: number;
    title: string;
    category_id?: number;
}

export type CategoryDatabase = {
    id: number;
    name: string;
    color: string;
}

export function useTasksDatabase() {
    const database = useSQLiteContext();

    async function createCategory(data: Omit<CategoryDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO categories (name, color) VALUES ($name, $color);"
        );

        try {
            const result = await statement.executeAsync({
                $name: data.name,
                $color: data.color,
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();
            return { insertedRowId };

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listCategories() {
        try {
            const query = "SELECT * FROM categories";
            const response = await database.getAllAsync<CategoryDatabase>(query);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function create(data: Omit<TaskDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO tasks (title, category_id) VALUES ($title, $category_id);"
        );

        try {
            const result = await statement.executeAsync({
                $title: data.title,
                $category_id: data.category_id ?? null,
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();
            return { insertedRowId };

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: TaskDatabase) {
        const statement = await database.prepareAsync(
            "UPDATE tasks SET title = $title, category_id = $category_id WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $title: data.title,
                $category_id: data.category_id ?? null,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function searchByName(title: string) {
        try {
            const query = "SELECT * FROM tasks WHERE title LIKE ?";

            const response = await database.getAllAsync<TaskDatabase>(query, `%${title}%`);

            return response;

        } catch (error) {
            throw error;
        }
    }

    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM tasks WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    async function show(id: number) {
        try {
            const query = "SELECT * FROM tasks WHERE id = ?";
            const response = await database.getFirstAsync<TaskDatabase>(query, [id]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function getCategory(id: number) {
        try {
            const query = "SELECT * FROM categories WHERE id = ?";
            const response = await database.getFirstAsync<CategoryDatabase>(query, [id]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    return { create, searchByName, update, remove, show, createCategory, listCategories, getCategory };
}