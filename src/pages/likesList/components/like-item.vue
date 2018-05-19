<template>
  <div class="like-item">
      <view class="time">{{itemData.date}}</view>
        <view class="in-item" v-for="(lis,idxs) in itemData.list" :key="lis.article_id" @click="toDetail(lis.article_id)">
          <view class="item-left">
            <view class="title">{{lis.title}}</view>
            <view class="info">
              <view class="info-icon">转发{{lis.sharetimes}}</view>
              <view class="info-icon">评论{{lis.commenttimes}}</view>
              <view class="info-icon">喜欢{{lis.liketimes}}</view>
            </view>
          </view>
          <view class="in-right">
            <image :src="lis.cover" mode="widthFix"></image>
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
       default:function(){
         return { }
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
     height: 198rpx;
     padding: 0 20rpx;
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
     height: 142rpx;
     padding-right: 14rpx;
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     .title{
       font-size: 30rpx;
     }
     .info{
       display: flex;
       justify-content: space-between;
       font-size: 24rpx;
       color: #666;
       margin-top: 10rpx;
     }
     .info-icon{
       display: flex;
       align-items: center;
       font-size: 24rpx;
     }
     .info-icon:before{
       content: '';
       display: block;
       width: 10rpx;
       height: 10rpx;
       margin-right: 10rpx;
       border-radius: 50%;
       background-color: #e5e5e5;
     }
   }
   .in-right{
     width: 252rpx;
     height: 142rpx;
     border-radius: 10rpx;
     overflow: hidden;
     image{
       width: 100%;
       display: block;
     }
   }
}
</style>
