<template>
  <div>
       <div  @click="clickTest">
         {{content1}}464545454545454545454545
           <slot ref="test"></slot>
        </div>
  </div>
</template>

<script>
export default {
  data(){
    return {}
  },
  props:{
    content1:{
        type: Object,
        default:function(){
          return{}
        }
    }
  },
  methods:{
    //  测试事件
    clickTest(){
      //  console.log('我执行了');
       this.$emit('sougou','sougou')
    }
  },
  watch:{
    content1(newValue,oldValue){
        console.log('newValue',newValue, 'oldValue', oldValue)
    }
  },
  onLoad(){
      console.log('content1', this.content1)
  }
}
</script>

<style>

</style>
