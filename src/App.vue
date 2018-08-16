<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="stylus">
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
  background #ffffff66
  transform scale(1.01)
  box-shadow: 0px 10px 25px -4px rgba(0,0,0,0.5);

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
  margin-left: .5em !important
  padding .3em 1em !important
  transition all .2s
  background #ffffff22
  color white
  border-radius .3em
  overflow hidden

.tree-anchor
  span
    font-weight bold
    color white
    @extend .vs-button-text

#app
  font-family 'Metropolis', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
