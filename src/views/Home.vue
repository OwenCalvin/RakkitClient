<template>
  <div class="home" @mouseup.capture="stopMoving" @mousemove="move">
    <div
    :style="{top: moving.pos.top - 10 + 'px', left: moving.pos.left - 10 + 'px'}"
    ref="moving"
    class="moving-item"
    v-if="moving.isMoving"
    v-html="moving.element.item.name">
    </div>
    <vs-prompt
    @vs-cancel="newPage.value = ''"
    @vs-accept="addPage"
    :vs-active.sync="newPage.active">
      <div class="con-exemple-prompt">
        Enter a page name
        <vs-input placeholder="Page name" vs-placeholder="Page name" v-model="newPage.value"/>
      </div>
    </vs-prompt>
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
          <vs-row vs-justify="center" vs-align="center">
            <vs-button @click="newPage.active = true">
              +
            </vs-button>
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
                  {{node.text}}<br>
                  {{node.item.id}}<br>
                  {{node.item.parent}}
                </span>
                <div v-if="node.item.childType === 'list'" class="node-child-type">
                  {{node.item.childType}}
                </div>
                <div @click="del(node)">
                  <i class="material-icons">
                    delete
                  </i>
                </div>
                <div @click="add(node)">
                  <i class="material-icons">
                    add
                  </i>
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
                    <vs-select
                    class="select-variation"
                    label="Type"
                    v-model="field.type">
                      <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item, index) in types"/>
                    </vs-select>
                    <input-type :type="field.type" class="input-field input-field-value" placeholder="Field value" v-model="field.variations[variation.selected]" vs-color="dark"/>
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
          <vs-row v-else>
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
import InputType from '@/components/InputType'
import MaterialIcon from 'material-icons'
import {getPages, getTree, variations, getVariations, save, del, add, addPage} from '../scripts/api.js'
import Tree from 'liquor-tree'
import _ from 'lodash'

export default {
  name: 'home',
  data () {
    return {
      types: [{
        value: 'text:short',
        text: 'Short text'
      }, {
        value: 'number:int',
        text: 'Integer'
      }],
      newPage: {
        active: false,
        value: ''
      },
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
      moving: {
        isMoving: false,
        initialPos: null,
        pos: {
          top: 0,
          left: 0,
        },
        element: null,
        hovered: null,
        hoveredElement: null,
        hoveringTimer: null
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
    this.$refs.tree.$on('node:hover', (node, {target}) => {
      if (this.moving.isMoving) {
        this.moving.hovered = node
        target.classList.add(this.canMove ? 'highlighted' : 'cannot-move')
        this.moving.hoveredElement = target
        this.moving.hoveringTimer = setTimeout(() => {
          if (this.canMove) {
            this.moving.hovered.expand()
          }
        }, 500)
      }
    })
    this.$refs.tree.$on('node:unhover', e => {
      if (this.moving.hovered) {
        clearTimeout(this.moving.hoveringTimer)
        this.moving.hovered = null
        this.unHighlight()
      }
    })
    this.$refs.tree.$on('node:mousedown', node => {
      if (node.item.parent) {
        this.moving.element = node
      }
    })
  },
  computed: {
    selectedPage () {
      return this.pages.items[this.selectedIndex]
    },
    canMove () {
      if (this.moving.hovered && this.moving.element.item.parent && this.moving.element.item.parent !== this.moving.hovered.item.id) {
        let canMove = true
        let element = this.moving.hovered
        while (element.item.parent) {
          console.log(element.id, this.moving.element.item.id)
          if (element.item.id === this.moving.element.item.id) {
            console.log('CORRUPT', element.item.id, this.moving.element.item.id)
            console.log('-----------------------------------------')
            canMove = false
            break
          }
          element = element.parent
        }
        return canMove
      }
      return false
    }
  },
  methods: {
    async addPage () {
      try {
        await addPage(this.newPage.value)
        this.pages.items.push(this.newPage.value)
      } catch (err) {
        console.log(err)
      }
    },
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
          this.unselectNode()
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
      node.item.fields.forEach(f => {
        f.variations = {...this.defaultField.variations, ...f.variations}
      })
      this.selected.inital = this.copyObject(node.item)
      this.selected.editing = this.copyObject(node.item)
      this.selected.node = node
    },
    beginMoving(event) {
      this.selected.element = {
        top: event.clientY,
        left: event.clientX
      }
    },
    move(event) {
      if (this.moving.element) {
        this.moving.pos = {
          top: event.clientY,
          left: event.clientX
        }
        this.moving.isMoving = true
      }
    },
    async stopMoving() {
      let toSave = null
      if ((this.moving.hovered && this.moving.element) && this.canMove) {
        this.moving.element.item.parent = this.moving.hovered.item.id
        toSave = {...this.moving.element}
        this.moving.hovered.append(toSave)
        this.moving.element.remove()
        this.moving.hovered.expand()
      }
      this.moving.isMoving = false
      this.moving.hovered = null
      this.moving.element = null
      this.unHighlight()
      if (toSave) {
        await save(this.selectedPage, toSave.item)
      }
    },
    unHighlight() {
      if (this.moving.hoveredElement) {
        this.moving.hoveredElement.classList.remove('highlighted')
        this.moving.hoveredElement.classList.remove('cannot-move')
      }
    },
    unselectNode() {
      this.selected.inital = null
      this.selected.editing = null
      this.selected.node = null
    },
    addField() {
      this.selected.editing.fields.push(this.copyObject(this.defaultField))
    },
    async save() {
      try {
        const isMain = !this.selected.node.item.parent
        this.selected.node.item = this.copyObject(this.selected.editing)
        this.selected.node.text = this.selected.editing.name
        await save(this.selectedPage, this.selected.editing)
        if (isMain) {
          this.$set(this.pages.items, this.selectedIndex, this.selected.editing.name)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async del (node) {
      try {
        await del(this.selectedPage, node.item)
        this.unselectNode()
        node.remove()
        if (!node.item.parent) {
          this.pages.items.splice(this.selectedIndex, 1)
        }
      } catch (err) {

      }
    },
    async add (node) {
      try {
        const newNode = (await add(this.selectedPage, {parent: node.item.id})).data
        node.append({
          text: newNode.name,
          item: newNode
        })
        node.expand()
        console.log(newNode)
      } catch (err) {
        console.log(err)
      }
    }
  },
  components: {
    Tree,
    MaterialIcon,
    InputType
  }
}
</script>

<style lang="stylus">
.highlighted
  border 3px solid #2f89fc

.cannot-move
  background: rgba(0,0,0,.2) !important

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
.moving-item
  font-weight bold
  pointer-events none
  border-radius .4em
  padding .5em 1em
  z-index 999999
  background #2f89fc
  position fixed

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
  overflow auto

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
  height 80vh
  min-height 400px
  align-content flex-start
</style>
