import { createStore } from '../lib/store'

export const useAuthStore = createStore(() => ({
  user: null,
  session: null,
  loading: false,

  initialize: async () => {},

  signIn: async (_email, _password) => {
    throw new Error('Supabase não configurado')
  },

  signUp: async (_email, _password) => {
    throw new Error('Supabase não configurado')
  },

  signOut: async () => {},
}))
