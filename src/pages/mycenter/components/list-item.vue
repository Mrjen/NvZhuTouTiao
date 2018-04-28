<template>
  <div class="list-item">
     <navigator class="messageList readBg space_b" 
                v-for="item in itemData" 
                :key="item.url"
                :url="item.url">
      <view class="readBg">
        <image class="message" :src="item.iconPath" />
        <view class="messageTxt">{{item.text}}</view>
        <view class="msg-tag" v-if="item.msgNum>0?true:false">{{item.msgNum}}</view>
      </view>
      <image class="jump" src="../image/jump.png" />
    </navigator>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:'listItem',
  data(){
    return {}
  },
  props:{
    itemData:{
      type: Array,
      default: function(){
         return [{
            url: '',
            text: '我的信息',
            iconPath: '../image/message.png',
            msgNum: 0
         }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.messageList {
  padding: 50rpx 20rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #E5E5E5;
  flex: 1;
  .readBg {
    flex: 1;
  }
}
.message {
  width: 34rpx;
  height: 28rpx;
  margin-right: 20rpx;
}
.messageTxt {
    color: #333333;
    font-size: 30rpx;
    flex:1;
    width: 100%;
  }
 .jump {
    width: 16rpx;
    height: 25rpx;
  }
</style>
