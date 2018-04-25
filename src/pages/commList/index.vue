<template>
  <div class="like-list">
    <view v-if="commentList.length?true:false">
      <view v-for="(item,idx) in commentList" :key="item.cover">
        <view class="list-item">
          <view class="time">{{item.date}}</view>
          <view class="in-item" v-for="(lis,idxs) in item.list" :key="lis.article_id" @click="toDetail(lis.article_id)">
            <view class="item-left">
              <view class="title">{{lis.comment}}</view>
              <view class="info">
                #{{lis.title}}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="none-more">
       暂无数据
    </view>

  </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
export default {
  data(){
    return {
      commentList:[],
      page: 2
    }
  },
  async onShow(){
     let commentList = await this.getList(1,'comment')
     if(commentList.data.code === api.STATUS){
       this.commentList = commentList.data.data;
     }
     
  },
  methods:{
    async getList(page,type='comment'){
     let list =  wxRequest(api.userCommentList,{ page: page, type: type },'POST')
     return list;
    },
    toDetail(id){
      wx.navigateTo({
        url: '../details/main?id=' + id
      })
    }
  },
  async onReachBottom(){
    console.log('到底了')
     let list = await this.getList(this.page, 'comment')
     if(list.data.code === api.STATUS){
        if(list.data.data.length>0){
           let commentList = this.commentList;
           this.commentList = [...commentList,...list.data.data];
           this.page++;
        }
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
