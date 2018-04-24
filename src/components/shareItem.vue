<template>
<div class="share-item"v-if="popup">
    <div class="share-pop" @click="closePop" >
    </div>
    <view class="bottom">
      <view class="title">转发</view>
      <view class="option">
         <button @click="downPoster">
            <image class="icon" src="http://p766oymet.bkt.clouddn.com/navzhu/icon-poster-download.png"></image>
            <view class="text text1">生成分享海报</view>
         </button>
         <button open-type="share">
           <image  class="icon" src="http://p766oymet.bkt.clouddn.com/navzhu/icon-poster-share.png"></image>
           <view class="text text2">转发给好友</view>
         </button>
      </view>
    </view>
</div>
  
</template>

<script>
export default {
  name:'sharepopup',
  data(){
    return {}
  },
  props:{
     popup:{
       type: Boolean,
       default: true
     },
     ArticleId:{
       type: String,
       default: ''
     }
  },

  onShow(){
     console.log('this', this.popup)
  },
  methods:{
    closePop(){
      console.log('关闭')
      this.$emit('closeSharPop', false)
    },
    openPop(){
      this.$emit('openSharePopup', true)
    },
    downPoster(){
      this.$emit('downloadPoster', true)
    }
  }
}
</script>

<style lang="less" scoped>
.share-item{
  position: fixed;
  width: 100%;
  height: 100%;
}

.share-pop{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, .3);
  z-index: 2;
}

.bottom{
    width: 750rpx;
    height: 340rpx;
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 120rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    z-index: 50;
    .option{
        display: flex;
        justify-content: space-around;
      }
    button{
      background: transparent;
      height: 140rpx;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon{
        width: 80rpx;
        height: 80rpx;
        padding: 0;
        margin: 0;
        flex-shrink: 0;
      }
      .text{
        font-size: 34rpx;
      }
      .text1{
        color: #138add;
      }
      .text2{
        color: #50b674;
      }
    }
}

.title{
    text-align: center;
    font-size: 30rpx;
    color: #666;
  }

.share-pop{
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(0, 0, 0, .3);
  flex-direction: column;
  justify-content: flex-end;
  z-index: 1;
  
}
</style>
