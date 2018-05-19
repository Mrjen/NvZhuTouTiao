<template>
  <div class="tag-nav">
     <view class="item"
           v-for="(item, idx) in nav" 
           :key="item.id"
           @click="changeTag(idx)"
           :class="item.active?'active':'leave'">{{item.text}}</view>
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
  props:{
    nav:{
      type: Array,
      default:function(){
        return [{
          id: 1,
          text: 'Ta点赞过的话题',
          active: true
        },{
          id: 2,
          text: 'Ta参与过的话题',
          active: false
        }]
      }
    }
  },
  methods:{
    changeTag(idx){
      let nav = this.nav;
      nav.map(el=>{
        el.active = false;
      })
      nav[idx].active = true;
      this.nav = nav;
      this.$emit('changeTagNav',idx)
    }
  }
}
</script>

<style lang="less" scoped>
.tag-nav{
  display: flex;
  width: 750rpx;
  height: 70rpx;
  .item{
    flex:1;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    color: #999;
    font-size: 28rpx;
    background: #eeeeee;
  }
  .item.active{
    color: #333;
    background: #face15;
    // background: transparent;
    position: relative;
  }
  .item.active:before{
    content: '';
    display: block;
    width: 100%;
    position: absolute;
    height: 100%;
    // background: red;
    z-index: -1;
    animation: bgBefore .5s;
  }
  // @keyframes bgBefore {
  //   0%{
  //     transform: translateX(-100%)
  //   }
  //   100%{
  //     transform: translateX(0%)
  //   }
  // }
}
</style>
