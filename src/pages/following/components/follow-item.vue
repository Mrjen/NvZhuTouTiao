<template>
  <div class="follow-item">
     <div class="info">
        <img class="avatar" :src="itemData.avatarUrl"/>
        <p class="nick-name">{{itemData.nickName}}</p>
        <block>
           <image class="sex" v-if="itemData.gender==1?true:false" src="../image/boy.png"></image>
           <image class="sex" v-else-if="itemData.gender==2?true:false" src="../image/girl.png"></image>
        </block>
     </div>
     <block>
        <button v-if="itemData.is_both===0?true:false" class="add"><div class="plus"></div><div>关注</div></button>
        <button v-else-if="itemData.is_both===1?true:false" class="add has-add"><div>已关注</div></button>
        <button v-else-if="itemData.is_both===2?true:false" 
                class="add has-add"
                @click="removeFollowing(itemData.id)"><div>相互关注</div></button>
     </block>
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
  props:{
    itemData:{
      type: Object,
      default: null
    },
    idx:{
      type: String,
      default: 0
    }
  },
  watch:{
    itemData:function(oldV,newV){
      console.log('itemData', oldV, newV)
    }
  },
  methods:{
    removeFollowing(id){
      this.$emit('removeFollowing', this.idx, id)
    }
  },
  onLoad(){
    console.log('itemData',this.itemData)
  }
};
</script>

<style lang="less" scoped>
.follow-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
}
.info{
  display: flex;
  align-items: center;
  .avatar{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  .nick-name{
    margin-right: 10rpx;
    font-size: 36rpx;
  }
  .sex{
    width: 24rpx;
    height: 24rpx;
  }
}
.add {
  display: flex;
  padding: 0;
  margin: 0;
  width: 148rpx;
  height: 60rpx;
  border-radius: 60rpx;
  line-height: 60rpx;
  color: #7c48c6;
  font-size: 28rpx;
  text-align: center;
  justify-content: center;
  align-items: center;
  border:1px solid #7c48c6;

  .plus {
    position: relative;
    width: 24rpx;
    height: 24rpx;
    margin-right: 10rpx;
    color: #7c48c6;
  }
  .plus:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 24rpx;
    height: 1px;
    background-color: currentColor;
  }
  .plus:after {
    content: "";
    position: absolute;
    width: 24rpx;
    top: 50%;
    left: 0;
    height: 1px;
    background-color: currentColor;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
.has-add{
  background: #d8d8d8;
  color: #fff;
  border-color: #d8d8d8;
}
</style>
