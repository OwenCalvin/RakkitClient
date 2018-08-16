import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tree: []
  },
  mutations: {
    setTree (state, tree) {
      state.tree = tree ? [tree] : []
    }
  },
  actions: {
    setTree ({commit}, tree) {
      commit('setTree', tree)
    }
  }
})
