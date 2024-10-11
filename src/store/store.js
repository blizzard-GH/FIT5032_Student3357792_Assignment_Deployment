import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    user: null,
    userData: {}
  },

  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status
    },
    setUser(state, user) {
      state.user = user
    },
    setUserData(state, userData) {
      state.userData = userData
    }
  },

  actions: {
    login({ commit }, { user, userData }) {
      commit('setAuthentication', true)
      commit('setUser', user)
      commit('setUserData', userData)
    },
    logout({ commit }) {
      commit('setAuthentication', false)
      commit('setUser', null)
      commit('setUserData', {})
    }
  },

  getters: {
    getUserData: (state) => state.userData,
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user
  }
})
