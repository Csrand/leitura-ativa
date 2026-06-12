import { createStore } from '../lib/store'

const MOCK_USER = { id: 'local-user-1', email: 'demo@leituraativa.app' }

export const useAuthStore = createStore(() => ({
  user: MOCK_USER,
  session: null,
  loading: false,

  initialize: async () => {},

  signIn: async (_email, _password) => {},
  signUp: async (_email, _password) => {},
  signOut: async () => {},
}))
