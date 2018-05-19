<template>
  <div class="comm-item">
      <view class="time">{{itemData.date}}</view>
      <view class="in-item" v-for="(lis,idxs) in itemData.list" :key="lis.article_id" @click="toDetail(lis.article_id)">
      <view class="item-left">
          <view class="title">{{lis.comment}}</view>
          <view class="info">
          #{{lis.title}}
          </view>
      </view>
      </view>
  </div>
</template>

<script>
export default {
  data(){
    return {}
  },
  props:{
    itemData:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  methods:{
    toDetail(id){
      this.$emit('toDetail',id)
    }
  }
}
</script>

<style lang="less" scoped>
.like-list{
   .list-item{
     width: 100%;
     box-sizing: border-box;
   }
   .time{
     height: 50rpx;
     background: #eee;
     font-size: 22rpx;
     line-height: 50rpx;
     color:#9f9f9f;
     padding:0 10rpx;
   }
   .in-item{
     display: flex;
     align-items: center;
     min-height: 120rpx;
     padding:20rpx;
     position: relative;
   }
   .in-item::after{
     content: '';
     display: block;
     width: 100%;
     border-bottom: 1px solid rgba(0, 0, 0, .1);
     position: absolute;
     left: 0;
     bottom: 0;
     transform: scaleY(.5);
   }
   .item-left{
     flex: 1;
     padding-right: 14rpx;
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     .title{
       font-size: 28rpx;
     }
     .info{
       display: flex;
       justify-content: space-between;
       font-size: 24rpx;
       color: #666;
       margin-top: 10rpx;
     }
    
   }
}
</style>
