<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="stylus">
.scale-enter-active, .scale-leave-active
  transition: all .3s

.scale-enter, .scale-leave-to
  opacity 0
  transform scale(.8)

.vs-inputx
  background rgba(0,0,0,.3)
  color white !important
  font-family 'Metropolis', Helvetica, Arial, sans-serif !important

.input-span-placeholder
  color white !important
  opacity .6
  font-size 1.3em !important
  font-weight bold

.vs-button-text
  width 100%
  text-overflow ellipsis
  white-space nowrap
  overflow hidden

.tree-node.selected > .tree-content
  background none !important

.tree-node:not(.selected) > .tree-content:hover
  background none !important

.tree-node.selected > .tree-content .tree-anchor
  background #ffffff55
  transform scale(1.01)
  box-shadow: 0px 10px 25px -4px rgba(0,0,0,0.15)

.tree-arrow.has-child::after
  border-color white !important

.tree-content
  margin .2em 0
  padding-top 0 !important
  padding-bottom 0 !important

.tree-arrow
  background #ffffff22
  border-radius 1em
  &::after
    color white

.tree-anchor
  border: 3px solid transparent
  box-sizing border-box
  margin-left: .5em !important
  padding .2em 1em !important
  transition all .2s
  background #ffffff22
  color white
  border-radius .3em
  overflow hidden
  max-width 320px
  min-width 320px

.node-text
  font-weight bold
  color white
  @extend .vs-button-text

#app
  color white
  font-family 'Metropolis', Helvetica, Arial, sans-serif !important
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
