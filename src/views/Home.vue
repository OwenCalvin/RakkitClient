<template>
  <div class="home">
    <vs-row>
      <vs-col class="pages" vs-type="flex" vs-justify="center" vs-w="2">
        <div class="container">
          <vs-row v-for="(page, index) in pages.items" :key="index" vs-type="flex" vs-justify="center">
            <vs-col vs-type="flex" class="page" vs-align="center" vs-justify="center" vs-w="11">
              <vs-button @click="getTree(page, index)" :class="{selected: isSelected(index)}" :vs-color="isErrored(index) ? '#F65157' : (isSelected(index) ? '#7289DA' : 'rgba(255, 255, 255, 0.2)')" vs-type="filled">
                {{page}}
              </vs-button>
            </vs-col>
          </vs-row>
        </div>
      </vs-col>
      <vs-col class="tree-container" vs-type="flex" vs-justify="center" vs-w="3">
        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
          <vs-col vs-type="flex" vs-justify="center" vs-w="11">
            <Tree
            class="tree container"
            :options="tree.opts"
            ref="tree">
              <div slot-scope="{ node }">
                <span>{{node.text}}</span>
              </div>
            </Tree>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col class="item" vs-type="flex" vs-justify="center" vs-w="7">
        <div>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import {getPages, getTree} from '../scripts/api.js'
import Tree from 'liquor-tree'

export default {
  name: 'home',
  data () {
    return {
      pages: {
        items: [],
        loading: false
      },
      tree: {
        opts: {
          expandIconOnly: true,
          store: {
            store: this.$store,
            key: 'tree',
            mutations: ['setTree']
          },
          propertyNames: {text: 'name'}
        },
        loading: false
      },
      selected: {
        item: null
      },
      selectedIndex: -1,
      errored: []
    }
  },
  created () {
    this.getPages()
  },
  mounted () {
    this.$refs.tree.$on('node:selected', e => {
      this.selected.item = e
      console.log(JSON.parse(JSON.stringify(e)))
    })
  },
  methods: {
    async getPages () {
      try {
        this.pages.items = (await getPages()).data
      } catch (err) {

      }
    },
    async getTree (page, index) {
      this.$store.dispatch('setTree', null)
      this.selectedIndex = index
      try {
        this.$store.dispatch('setTree', (await getTree(page)).data)
      } catch (err) {
        this.unSelect()
        this.errored.push(index)
        setTimeout(() => {
          this.errored.splice(index, 1)
        }, 1000)
      }
    },
    isSelected(index) {
      return index === this.selectedIndex
    },
    isErrored (index) {
      return this.errored.includes(index)
    },
    unSelect() {
      this.selectedIndex = -1
    }
  },
  components: {
    Tree
  }
}
</script>

<style lang="stylus" scoped>
.page
  .vs-button
    font-size 1.8em
    font-weight bold
    color white
    padding .5em 1em
    border-radius .3em
    margin .5em 0
    width 100%
    transition all .5s

.selected
  transform scale(1.03)

.pages
  height 100%
  background: #23272A
  height 100vh

.tree-container
  padding-top 1em
  background #2C2F33

.item
  background #2C2F33ef

.container
  width 100%
</style>
