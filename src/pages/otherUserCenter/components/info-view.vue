<template>
  <div class="info">
    <!-- 资料 -->
      <view class="user-info">
        <view class="nick-name">
           <view class="info-name">{{userData.nickName}}</view>
           <image v-if="userData.gender=='0'" class="avatar-sex" src="../image/girl.png"></image>
           <image v-else-if="userData.gender=='1'" class="avatar-sex" src="../image/boy.png"></image>
        </view>
           <img class="avatar" :src="userData.avatarUrl" alt="">
      </view>
      <!-- 关于他的 -->
      <view class="about-he">
          <navigator :url="'/pages/following/main?user_id='+ userId +'&nav_title=Ta的关注'">
             <view class="num">{{userData.attentionNum}}</view>
             <view class="tag">关注</view>
          </navigator>
          <navigator :url="'/pages/followers/main?user_id='+ userId +'&nav_title=Ta的粉丝'">
             <view class="num">{{userData.followerNum}}</view>
             <view class="tag">粉丝</view>
          </navigator>
      </view>

       
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
  props:{
    userData:{},
    userId:''
  },
  created(){
    console.log('创建了')
  },
  onLoad(){
    console.log('this.userData', this.userData)
    console.log('this.userId', this.userId)
  }
}
</script>

<style lang="less" scoped>
.info{
  width: 750rpx;
  height: 315rpx;
  background: #7c48c6;
  padding: 60rpx 60rpx 0 60rpx;
  box-sizing: border-box;
  .user-info{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .nick-name{
    display: flex;
    align-items: flex-end;
  }
  .info-name{
    color: #fff;
    font-size: 36rpx;
    margin-right: 10rpx;
    line-height: 1;
  }
  .avatar{
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
  }
  .avatar-sex{
    width: 24rpx;
    height: 24rpx;
    display: block;
  }
  .avatar{
    width: 150rpx;
    height: 150rpx;
    display: block;
    border-radius: 50%;
  }
  .about-he{
    display: flex;
    text-align: center;
    navigator{
      display: block;
      width: 25%;
      color: #fff;
    }
    .num{
      font-weight: bold;
      font-size: 30rpx;
    }
    .tag{
      font-size: 20rpx;
    }
  }
}
</style>


