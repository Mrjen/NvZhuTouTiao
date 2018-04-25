<template>
  <div class="chart-room">
    <view class="chatRoom">
      <scroll-view class="scroll" lower-threshold="250" 
                   scroll-y ="true" 
                   :scroll-top="scrollTop"
                   @scrolltolower="scrolltolower">
        <!-- 时间信息 -->
        <!-- <view v-if="item.who==0" class="timeInfo">
          <view class="readBg timeDate">
            <view>{{item.date}}</view>
            <view>{{item.time}}</view>
          </view>
        </view> -->
        <view class="chart-list" v-for="item in commList" :key="item.id">
          <!-- <view class="time">{{}}</view> -->
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
      <textarea  :placeholder="inputPlaceholder"
                 @focus="inputGetFocus"
                 auto-height="true"
                 fixed="true"
                 cursor-spacing="20"
                 v-model="commContent"
                 @confirm="addComment"
                 confirm-type="send" 
                 placeholder-style="color:#999"
                 :focus="inputFcus"
                 class="inputRedict"/>
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
      commContent:'',
      reid:'',
      inputPlaceholder: '回复小主：',
      scrollTop: 0
    }
  },
  async onLoad(options){
    console.log(options)
    this.reid = options.id;
    this.getMsgList()
  },
  methods:{
    async getMsgList(){
      console.log(this.commContent)
        let msg = await wxRequest(api.systemMsgDetail, { reid: this.reid}, 'POST')
      if(msg.data.code === api.STATUS){
        console.log('msg',msg)
        this.commList = msg.data.data;
      }
    },
    async addComment(){
      console.log(111)
       let send = await wxRequest(api.feedBackMsg, { reid: this.reid,  message:this.commContent })
       if(send.data.code === api.STATUS){
          this.getMsgList()
          this.commContent = '';
          setTimeout(() => {
            this.scrollTop = 999999;
          }, 50);
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
</style>

