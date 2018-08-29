<script>
import Vue from 'vue'

export default Vue.component('input', {
  render (createElement) {
    let input = null
    let attrs = {}
    switch (this.type) {
      case 'text:short':
        input = 'vs-input'
        break
      case 'text:full':
        input = ''
        break
      case 'text:html':
        input = ''
        break
      case 'text:markdown':
        input = ''
        break
      case 'number:int':
        input = 'vs-input-number'
        break
      case 'number:float':
        input = ''
        break
      case 'bool':
        input = ''
        break
      case 'date':
        input = ''
        break
      case 'json':
        input = ''
        break
      case 'image':
        input = ''
        break
    }
    return !input ? createElement('p', 'Input type not valid') : createElement(input, {
      on: {
        input: ($event) => {
          console.log($event)
          this.$emit('input', $event)
        }
      },
      attrs: {
        ...attrs,
        value: this.value
      }
    })
  },
  props: ['type', 'value']
})
</script>

