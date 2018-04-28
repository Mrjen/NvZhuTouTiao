<template>
  <div class="about-me">
     <ul>
        <li>
          <navigator url=""></navigator>
        </li>
     </ul>
  </div>
</template>

<script>
export default {
  name:'aboutMe',
  data(){
    return{}
  },
  props: Array,
  default:function(){
    return [{
      url:'../likesList/main',
      num:'',
      text:'点赞'
    },{
      url:'../likesList/main',
      num:'',
      text:'点赞'
    },{
      url:'../likesList/main',
      num:'',
      text:'点赞'
    },{
      url:'../likesList/main',
      num:'',
      text:'点赞'
    }]
  }
}
</script>

<style lang="less" scoped>
.about-me{
   ul{
     display: flex;
   }
}
</style>
