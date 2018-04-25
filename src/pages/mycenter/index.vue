<template>
  <div class="mine">
    <view class="myCenter space_b">
      <view class="d_p space_b">
        <view class="d_fle">
          <block>
            <view v-if="userInfo.nickName?true:false" class="myCenterName">{{userInfo.nickName}}</view>
            <view v-else class="myCenterName"><open-data type="userNickName"></open-data></view>
          </block>
          <image class="gender mg_15" :src="people.gender==0?'../image/girl.png':'../image/boy.png'" />
        </view>
        <block>
            <image v-if="userInfo.avatarUrl?true:false" 
                   class="myCenterImg" 
                   @click="editInfo" 
                   :src="userInfo.avatarUrl"/>
            <view v-else class="myCenterImg">
               <open-data type="userAvatarUrl" @click="editInfo"></open-data>
            </view>
        </block>
        
      </view>
      <view class="d_fle">
        <view class="m_r_45" @click="toLikeList">
          <view class="myLike">{{userInfo.likeNum}}</view>
          <view class="mysetsys">点赞</view>
        </view>
        <view>
          <view class="myLike" @click="toComment">{{userInfo.commentNum}}</view>
          <view class="mysetsys">已评论</view>
        </view>
      </view>
    </view>

    <view class="messageList readBg space_b" @tap="toMessage()">
      <view class="readBg">
        <image class="message" src="../image/message.png" />
        <view class="messageTxt">我的信息</view>
        <view class="msg-tag" v-if="userInfo.messageNum">{{userInfo.messageNum}}</view>
      </view>
      <image class="jump" src="../image/jump.png" />
    </view>

    <view class="messageList readBg space_b" @tap="toFeedback()">
      <view class="readBg">
        <image class="require" src="../image/require.png" />
        <view class="messageTxt">意见反馈</view>
      </view>
      <image class="jump" src="../image/jump.png" />
    </view>
  </div>
</template>

<script>
  import wxRequest from "../../utils/http.js";
  import api from "../../utils/api.js";
  export default {
    data() {
      return {
        people: {
          name: "Linux",
          gender: 1,
          img: "../image/touxiang.png",
          comment: 20,
          like: 17
        },
        userInfo:{}
      }
    },
    methods:{
       toMessage(){
        wx.navigateTo({
          url: '../message/main'
        })
       },
       toFeedback(){
         wx.navigateTo({
           url: '../feedback/main'
         })
       },
       editInfo(){
         wx.navigateTo({
           url: '../editUserInfo/main'
         })
       },
       toLikeList(){
         wx.navigateTo({
           url: '../likesList/main'
         })
       },
       toComment(){
         wx.navigateTo({
           url: '../commList/main'
         })
       }
    },
    async onShow(){
        let info = await wxRequest(api.getUserInfo,{},'POST');
        if(info.data.code === api.STATUS){
          this.userInfo = info.data.data;
        }
        console.log('info',info)
    },
    onShareAppMessage() {

    }
  }
</script>

<style lang="less" scoped>
  page {
    background-color: #F3F6F8;
  }
  .myCenter {
    background-color: #7C48C6;
    color: #FFFFFF;
    padding: 60rpx 60rpx 44rpx 60rpx;
    margin-bottom: 10rpx;
  }
  .myCenterImg {
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    overflow: hidden;
  }

  .msg-tag{
    display: inline-block;
    min-width: 30rpx;
    min-height: 20rpx;
    background: tomato;
    color: #fff;
    font-size: 24rpx;
    position: absolute;
    right: 20rpx;
    text-align: center;
    border-radius: 50%;
  }

  .myCenterName {
    font-size: 60rpx;
    color: #FFFFFF;
    margin-right: 6rpx;
    font-weight: bold;
  }
  .mg_15 {
    margin-top: 40rpx;
  }
  .d_p {
    display: flex;
    justify-content: space-between;
    display: flex;
    width: 100%;
  }
  .myLike {
    font-size: 36rpx;
    color: #FFFFFF;
    font-weight: bold;
    text-align: center;
  }
  .mysetsys {
    color: #EEEEEE;
    font-size: 20rpx;
  }
  .m_r_45 {
    margin-right: 45rpx;
  }
  .message {
    width: 34rpx;
    height: 28rpx;
    margin-right: 20rpx;
  }
  .require {
    width: 32rpx;
    height: 32rpx;
    margin-right: 20rpx;
  }
  .messageTxt {
    color: #333333;
    font-size: 30rpx;
    flex:1;
    width: 100%;
  }
  .messageList {
    padding: 50rpx 20rpx;
    background-color: #FFFFFF;
    border-bottom: 1rpx solid #E5E5E5;
    flex: 1;
    .readBg{
      flex: 1;
    }
  }
  .jump {
    width: 16rpx;
    height: 25rpx;
  }
</style>