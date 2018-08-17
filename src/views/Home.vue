<template>
  <div class="home">
    <vs-row>
      <vs-col class="pages" vs-type="flex" vs-justify="center" vs-w="2">
        <div class="container">
          <vs-row v-for="(page, index) in pages.items" :key="index" vs-type="flex" vs-justify="center">
            <vs-col vs-type="flex" class="page" vs-align="center" vs-justify="center" vs-w="10">
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
              <span class="node-text" slot-scope="{node}">
                <span class="node-title">
                  {{node.text}}
                </span>
                <div v-if="node.item.childType === 'list'" class="node-child-type">
                  {{node.item.childType}}
                </div>
              </span>
            </Tree>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col class="item" vs-type="flex" vs-justify="center" vs-w="7">
        <transition name="scale" mode="out-in">
          <vs-row v-if="selected.editing" :key="selected.editing.id">
            <vs-row>
              <vs-col vs-type="flex" vs-justify="space-between" vs-align="center" vs-w="12">
                <vs-input class="input-name" placeholder="Node title" v-model="selected.editing.name" vs-color="dark"/>
                <div>
                  <vs-select
                  class="select-variation"
                  label="Lang"
                  v-model="variation.selected">
                    <vs-select-item :key="index" :vs-value="item.name" :vs-text="item.display" v-for="(item, index) in variation.items"/>
                  </vs-select>
                </div>
                <div>
                  <vs-select
                  class="select-variation"
                  label="Lang"
                  v-model="selected.editing.childType">
                    <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item, index) in childTypes"/>
                  </vs-select>
                </div>
                <div>
                  <vs-button @click="deleteItem">
                    Save
                  </vs-button>
                </div>
              </vs-col>
            </vs-row>
            <vs-row>
              <vs-col vs-type="flex" vs-w="12">
                <vs-row vs-justify="flex-start" class="fields">
                  <vs-row class="field-container" v-for="(field, index) in selected.editing.fields" :key="index">
                    <vs-input class="input-field" placeholder="Field name" v-model="field.name" vs-color="dark"/>
                    <vs-input class="input-field input-field-value" placeholder="Field value" v-model="field.variations[variation.selected]" vs-color="dark"/>
                  </vs-row>
                  <vs-button @click="addField">
                    New field
                  </vs-button>
                </vs-row>
              </vs-col>
            </vs-row>
            <vs-row>
              <vs-button @click="selected.editing = copyObject(selected.inital)">
                Discard
              </vs-button>
              <vs-button @click="save">
                Save
              </vs-button>
            </vs-row>
          </vs-row>
          <vs-row>
            <vs-col vs-align="center" vs-justify="center" vs-type="flex" vs-w="12">
              <h1>Nothing is selected</h1>
            </vs-col>
          </vs-row>
        </transition>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import {getPages, getTree, variations, getVariations, save} from '../scripts/api.js'
import Tree from 'liquor-tree'
import _ from 'lodash'

export default {
  name: 'home',
  data () {
    return {
      defaultField: {
        name: 'New field',
        variations: [],
        type: 'text:short'
      },
      childTypes: [{
        value: 'list',
        text: 'List'
      }, {
        value: undefined,
        text: 'Object'
      }],
      variation: {
        selected: null,
        items: [],
        loading: false
      },
      pages: {
        items: [],
        loading: false
      },
      tree: {
        opts: {
          parentSelect: true,
          store: {
            store: this.$store,
            key: 'tree',
            mutations: ['setTree']
          },
          propertyNames: {text: 'name', children: 'items'}
        },
        loading: false
      },
      selected: {
        node: null,
        editing: null,
        inital: null
      },
      selectedIndex: -1,
      errored: []
    }
  },
  created () {
    this.getPages()
    this.getVariations()
  },
  mounted () {
    this.$refs.tree.$on('node:selected', e => {
      this.selectNode(e)
    })
  },
  methods: {
    deleteItem () {
      
    },
    async getPages () {
      try {
        this.pages.items = (await getPages()).data
      } catch (err) {

      }
    },
    async getVariations() {
      try {
        this.variation.items = (await getVariations()).data
        this.variation.selected = this.variation.items[0].name
        this.defaultField.variations = this.variation.items.reduce((obj, item) => {
          obj[item.name] = null
          return obj
        }, {})
      } catch (err) {
        
      }
    },
    async getTree (page, index) {
      if (index !== this.selectedIndex) {
        try {
          this.$store.dispatch('setTree', (await getTree(page)).data)
          this.selectedIndex = index
        } catch (err) {
          this.errored.push(index)
          setTimeout(() => {
            this.errored.splice(index, 1)
          }, 1000)
        }
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
    },
    copyObject(node) {
      return _.cloneDeep(node)
    },
    selectNode(node) {
      this.selected.inital = this.copyObject(node.item)
      this.selected.editing = this.copyObject(node.item)
      this.selected.node = node
    },
    addField() {
      this.selected.editing.fields.push(this.copyObject(this.defaultField))
    },
    async save() {
      try {
        this.selected.node.item = this.copyObject(this.selected.editing)
        this.selected.node.text = this.selected.editing.name
        save(this.pages.items[this.selectedIndex], this.selected.editing)
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: {
    Tree
  }
}
</script>

<style lang="stylus">
.input-name
  .vs-inputx
    font-weight bold
    font-size 2em
    width 10em !important

.input-field
  .vs-inputx
    font-weight bold
    font-size 1.5em
    width 10em !important
</style>


<style lang="stylus" scoped>
.page
  .vs-button
    font-size 1.8em
    font-weight bold
    color white
    padding .3em 1em
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
  padding 1.5em 3em

.node-text
  align-items: center
  display flex
  justify-content space-between

.node-child-type
  text-transform uppercase
  background #7289DA
  padding .1em .3em
  border-radius .2em

.container
  width 100%

.field-container
  flex-direction column
  padding-bottom 5em


.fields
  padding 2em
  height 80vh
  min-height 400px
  background rgba(0,0,0,.3)
  border-radius 10px
  box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1)
  align-content start
</style>
