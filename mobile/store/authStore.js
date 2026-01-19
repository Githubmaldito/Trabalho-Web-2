import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

//global
const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('https://teste-api-jqei.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar');
            }
            // adicionando usuário e token ao estado global
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true, message: 'Usuário cadastrado com sucesso' };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
        }

    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('https://teste-api-jqei.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }
            // adicionando usuário e token ao estado global
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true, message: 'Login realizado com sucesso' };
        } catch (error) {
            
        }
    },
    //funçao qque vai verificr aa utenticação
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            set({ user, token });

        } catch (error) {
            console.log('Erro ao verificar autenticação:', error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            set({ user: null, token: null });
        } catch (error) {
            console.log('por algum motivo ocorreu um erro ao falxer logout', error);
        }
    },
}))

export default useAuthStore;