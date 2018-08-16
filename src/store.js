import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tree: []
  },
  mutations: {
    setTree (state, tree) {
      if (tree) {
        tree.state = {
          expanded: true
        }
        state.tree = [tree]
      } else {
        state.tree = []
      }
    }
  },
  actions: {
    setTree ({commit}, tree) {
      commit('setTree', tree)
    }
  }
})
