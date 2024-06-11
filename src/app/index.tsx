import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import AddTask from '../screens/addTask';
import { RootStackParamList } from '../types/types';
import AddCategory from '@/screens/addCategory';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="AddTask" component={AddTask} />
                <Stack.Screen name="AddCategory" component={AddCategory}/>
            </Stack.Navigator>
        
    );
}