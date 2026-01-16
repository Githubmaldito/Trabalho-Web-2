import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

//global
const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    cadastrar: async (username, email, password) => {
        set({isLoading: true});
        try {
            const response = await fetch('https://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar');
            }
    // adicionando usuário e token ao estado global
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({user: data.user, token: data.token, isLoading: false});

        } catch (error) {
            set({isLoading: false});
            return {success: false, message: error.message};
        }

    },
}))

export default useAuthStore;