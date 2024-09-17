import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { defineAbilitiesFor } from '../plugins/ability';
import { jwtDecode } from 'jwt-decode';

export const authStore = defineStore('auth', {
  state: () => ({
    user: {
      token: localStorage.getItem('token') || null,
      role: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : null,
      ability: null,
    },
  }),
  getters: {
    isAuthenticated: (state) => !!state.user.token,
    getRole: (state) => state.user.role,
    getAbility: (state) => state.user.ability,
  },
  actions: {
    async login(formData: { email: string, password: string }) {
      try {
        // Send login request
        const response = await axios.post('/auth/login', {
          username: formData.email,
          password: formData.password,
        });

        // Extract the accessToken from the response
        const { accessToken } = response.data;

        // Decode JWT to get user details
        const decodedToken = jwtDecode(accessToken);

        // Save token and user role in localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(decodedToken));

        // Set state
        this.user.token = accessToken;
        this.user.role = decodedToken.role;

        // Define abilities based on role
        this.user.ability = defineAbilitiesFor(decodedToken);

        return response.data;
      } catch (error) {
        throw new Error('Login failed.');
      }
    },

    logout() {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Reset state
      this.user.token = null;
      this.user.role = null;
      this.user.ability = null;

      // Redirect to login
      window.location.href = '/auth/login';
    },
  },
});
