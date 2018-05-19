<template>
  <div class="attation-bar">
      <div class="item add-div">
          <div class="add" v-if="isattention===0?true:false" @click="addFollowing"><div class="icon-plus"></div>关注</div> 
          <div class="has-add" v-if="isattention===1?true:false" @click="removeFollower">已关注</div>
          <div class="remove" v-if="isattention===2">相互关注</div>
      </div>
      <div class="item chart" @click="toChart"><div class="icon-chart"></div>私聊</div>
  </div>
</template>

<script>
export default {
  data(){
    return{}  
  },
  props:{
      isattention:{
        type: Number,
        default: 0
      }
  },
  watch:{
    isattention(oldV,newV){
        console.log('关注状态isattention',oldV,newV)
    } 
  },
  methods:{
    removeFollower(){
      this.$emit('removeFollower')
    },
    addFollowing(){
      this.$emit('addFollowing')
    },
    toChart(){
        
    }
  },
  onLoad(){
      console.log('onload', this.isattention)
  }
}
</script>

<style lang="less" scoped>
@parimery:#7c48c6;

.attation-bar{
   display: flex;
   width: 750rpx;
   height: 88rpx;
   position: fixed;
   left: 0;
   bottom: 0;
   background: #fff;
   line-height: 88rpx;
   color: @parimery;
   .item{
       flex: 1;
       text-align: center;
       display: flex;
       justify-content: center;
       align-items: center;
   }
   .add{
       flex: 1;
       display: flex;
       justify-content: center;
       align-items: center;
   }
   .icon-plus{
       width: 34rpx;
       height: 34rpx;
       background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiBAMAAADIaRbxAAAAJ1BMVEUAAAB8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZjjFEqAAAADHRSTlMAzMM8M/Qgodiko2OyN2IzAAAANUlEQVQoz2OAgakJDGhAx2BUhIGhUBACYhohtBRDzBlUcJQhxQUCZLZAaLdB54uBECmFpSgAHPQgfxuk6tYAAAAASUVORK5CYII=);
       background-size: 34rpx 34rpx;
       margin-right: 12rpx;
   }
   .icon-chart{
       width: 33rpx;
       height: 34rpx;
       background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAiCAMAAADmrkDzAAAAgVBMVEUAAAB8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMZ8SMa9aqYxAAAAKnRSTlMA5kkGz/rn7xQOA+S+bvNQNS0b9puQhkRBO7eqdVYl3NbGsq6iln9eYiAIUbv9AAABOElEQVQ4y4WQ2ZaCMBBEG0KAAGHfQdx1pv7/A8fgMghG7gPVcC7pOqEJ7jW3QmefX1P6SNRyPLH6pdRYAG9l47pVfwgBnr87rACM3n29mh1HKCeCCMBLQVOGDujY65cARrzs5SB4Kmf4v7QkMXC+TxWyhD4RZ6jGwcKFPtPDUlHDZhqD+WhukaMkHSWK29NHojUatcZF6GkNAe5RfG9jGoY5C4UDQSZaNRqAsQg1pDfj8DDsWShCCKoQjFts31yEKkljDy019kpz9MYFxVg31Ro7qGUtNvobO7HHSd+JsV0xPBubFeUHTrKinGCvKOwAZ2WRlwNd8v7Jm3dxgGMkaERU5Q7IdqcNmyjpOQOwDY7HYMvxxL/SBFcGGUb4vqg9ErG0gHLWZ6ijqB7+z5YcEX1HwloxmBz+AIkZHesZFU7PAAAAAElFTkSuQmCC);
       background-size: 33rpx 34rpx;
       margin-right: 12rpx;
   }
   .has-add,.remove{
       color: #999;
   }
}
.attation-bar::before{
    content: '';
    display: block;
    width: 100%;
    border-top: 1px solid #dcdcdc;
    transform: scaleY(.5);
    position: absolute;
    left: 0;
    top: 0;
}

.attation-bar::after{
    content:' ';
    display: block;
    height: 60rpx;
    border-left:1px solid #dcdcdc;
    position: absolute;
    left: 50%;
    transform: scaleX(.5);
    top: 50%;
    margin-top: -30rpx;
}
</style>
