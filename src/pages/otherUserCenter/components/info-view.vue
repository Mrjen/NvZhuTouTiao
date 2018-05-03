<template>
  <div class="info">
    <!-- 资料 -->
      <view class="user-info">
         <view class="nickName">
           <view class="info-name">小恶魔</view>
           <image class="avatar-sex" src="../image/boy.png"></image>
         </view>
         <image class="avatar" src="http://iph.href.lu/150x150"></image>
      </view>
      <!-- 关于他的 -->
      <view class="about-he">
          <navigator url="">
             <view class="num">17</view>
             <view class="tag">关注</view>
          </navigator>
          <navigator url="">
             <view class="num">20</view>
             <view class="tag">粉丝</view>
          </navigator>
      </view>

      <!-- 导航切换 -->
       
  </div>
</template>

<script>
export default {
  data(){
    return{}
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
  .nickName{
    display: flex;
    align-items: flex-end;
  }
  .info-name{
    color: #fff;
    font-size: 36rpx;
    margin-right: 10rpx;
    line-height: 1;
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
