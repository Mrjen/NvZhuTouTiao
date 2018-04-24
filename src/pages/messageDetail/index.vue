<template>
  <div class="chart-room">
    <view class="chatRoom">
      <scroll-view class="scroll" lower-threshold="250" 
                   scroll-y ="true" 
                   @scrolltolower="scrolltolower">
        <!-- 时间信息 -->
        <!-- <view v-if="item.who==0" class="timeInfo">
          <view class="readBg timeDate">
            <view>{{item.date}}</view>
            <view>{{item.time}}</view>
          </view>
        </view> -->

        <!-- 我说的消息 -->
        <!-- <view class="mySay">
          <image :src="commentTitle.avatarUrl" class="myPotrait" />
          <view>
            <view class="readBg">
              <view class="talkName">{{commentTitle.nickName}}</view>
              <image class="gender" :src="commentTitle.gender==0?'../image/girl.png':'../image/boy.png'" />
              <view v-if="commentTitle.owner" class="floorHost">楼主</view>
            </view>
            <view class="myPotraitContent">
              {{commentTitle.comment}}
            </view>
          </view>
        </view> -->

        <view class="chart-list" v-for="item in commList" :key="item.id">
          <view class="mySay" v-if="item.send_id==0?false:true">
            <image :src="item.avatarUrl" class="myPotrait" />
            <view>
              <view class="readBg  flex_reverse">
                <view class="talkName">{{item.nickName}}</view>
                <image class="gender" :src="item.gender==0?'../image/girl.png':'../image/boy.png'" />
                <view v-if="item.owner" class="floorHost">楼主</view>
              </view>
              <view class="myPotraitContent">
                {{item.message}}
              </view>
            </view>
          </view>

          <!-- 别人说的消息 -->
          <view v-if="item.send_id==0?true:false" class="say">
            <image :src="item.avatarUrl" class="potrait" />
            <view>
              <view class="readBg">
                <view class="talkName">{{item.nickName}}</view>
                <image class="gender" :src="item.gender==0?'../image/girl.png':'../image/boy.png'" />
                <view v-if="item.owner" class="floorHost">楼主</view>
              </view>
              <view class="potraitContent">
                {{item.message}}
              </view>
            </view>
          </view>
        </view>

        <view class="writeBg_zhanwei"></view>

      </scroll-view>
    </view>
    <!-- 评论输入 -->
    <view class="writeBg">
      <view class="image"></view>
      <view style="width: 100%;">
        <input placeholder="点击输入你的评论" 
               class="inputRedict" 
               cursor-spacing="20" 
               v-model="currentComment" 
               @confirm="sendComment" 
               placeholder-style="color:#999"
        />
      </view>
    </view>
  </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
export default {
  data() {
    return {
      commList:[],
      currentComment:'',
      reid:''
    }
  },
  async onLoad(options){
    console.log(options)
    this.reid = options.id;
    this.getMsgList()
  },
  methods:{
    async getMsgList(){
      console.log(this.currentComment)
        let msg = await wxRequest(api.systemMsgDetail, { reid: this.reid}, 'POST')
      if(msg.data.code === api.STATUS){
        console.log('msg',msg)
        this.commList = msg.data.data;
      }
    },
    async sendComment(){
      console.log(111)
       let send = await wxRequest(api.feedBackMsg, { reid: this.reid,  message:this.currentComment })
       if(send.data.code === api.STATUS){
          this.getMsgList()
       }
    }
  }
}
</script>

<style lang="less" scoped>
  .chatRoom {
    padding: 40rpx 20rpx 100rpx 20rpx;
    box-sizing: border-box;
  }

  .scroll{
    height: 86vh;
  }

  .say {
    display: flex;
    margin-bottom: 50rpx;
  }

  .mySay {
    display: flex;
    margin-bottom: 50rpx;
    flex-direction: row-reverse;
  }

  .timeInfo {
    font-size: 20rpx;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50rpx;
  }

  .timeDate {
    padding: 8rpx 25rpx;
    background-color: #E7E0F0;
    border-radius: 10rpx;
  }

  .talkName {
    font-size: 30rpx;
    color: #999999;

  }

  .potrait {
    width: 100rpx;
    height: 100rpx;
    margin-right: 30rpx;
  }

  .myPotrait {
    width: 100rpx;
    height: 100rpx;
    margin-left: 30rpx;
  }

  .floorHost {
    background-color: #F8B551;
    color: #FEFEFE;
    font-size: 20rpx;
    padding: 5rpx 14rpx;
    border-radius: 10rpx;
  }

  .potraitContent {
    margin-top: 24rpx;
    border-top-right-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    border: 1rpx solid #E5E5E5;
    background-color: #FFFFFF;
    color: #333333;
    font-size: 30rpx;
    padding: 25rpx 35rpx;
    max-width: 420rpx;
  }

  .myPotraitContent {
    margin-top: 24rpx;
    border-top-left-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    background-color: #00C921;
    color: #FFFFFF;
    font-size: 30rpx;
    padding: 25rpx 35rpx;
    max-width: 420rpx;
  }

  .flex_reverse {
    flex-direction: row-reverse;
  }

  .writeBg {
    width: 100%;
    height: 100rpx;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    color: #fff;
    box-sizing: border-box;
    padding: 10rpx 40rpx;
    align-items: center;
    input {
      font-size: 32rpx;
      height: 70rpx;
      line-height: 74rpx;
      position: relative;
      color: #333;
      display: flex;
      align-items: center;
      background-color: #eee;
      border-radius: 0 14rpx 14rpx 0 ;
    }
    .image {
      content: '';
      display: block;
      width: 34rpx;
      height: 32rpx;
      padding-right: 20rpx;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAMAAABAUVr7AAAAOVBMVEUAAAAQj98SldoQltsSldsRltsRltoQldoQldoRldoRltsRldsQltwRldsSldwQl98QltsRldsSltsAyOrMAAAAEnRSTlMAEJ8/gMDQYDDP8OBQsJAgcO/JSVeQAAAA2ElEQVQ4y83TwZaDIAyF4UQIRCPWue//sDNpD1ZtOLPtv3HhR4wLKC41AC3RuA2QVoA6FBOK+ihDHgsmjw1pIIz7SmixOO1giL+SlsMIIiFMehhYICZ/qL1MxnYDLC48Lm4qFr6J2cVh9j+hoXibWJza/xX1a4TdBAnsKgrfxAqcp+RPQQItbzMF4gEhdjMUtKNSN7GgGUzdxIIh5LmJBa3I1M1TrHLp4dcqvbbOPxD2MwtOmfoq/r7OgFWKg2ieAbSVBiV4rT7/Kn2mRIqy9fMFQdfhKQfxL/RODgQPzOlEAAAAAElFTkSuQmCC');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 34rpx 32rpx;
      background-color: #eee;
      border-radius: 14rpx 0 0 14rpx;
      height: 70rpx;
    }
  }

</style>

