<template>
  <div class="feedback">
        <view class="feedBg">
            <textarea placeholder="你的意见是我们进步的动力！" 
                      placeholder-class="feedback_place" 
                      v-model="message"
                      class="feedbackdetail"  />
        </view>
        <button class="upInfo" hover-class="upInfo_focus" @click="sendFeedBack">提交</button>
   </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
import tips from '../../utils/tips';
export default {
  data(){
    return {
       message:''
    }
  },
  methods: {
     async sendFeedBack(){
        let send = await wxRequest(api.feedBackMsg, { message:this.message })
        if(send.data.code === api.STATUS){
            tips.success('反馈成功')
            this.message = '';
        }
        console.log('send', send)
     }
  },
  
  onShareAppMessage(){

  }
}
</script>

<style>
page{
    background-color: #F3F6F8;
}
.feedback{
    padding: 30rpx;
        
}
.feedBg{
    padding:22rpx;
    background-color:#FFFFFF;
}
.feedbackdetail{
    width:100%;
    font-size:30rpx;
}
.feedback_place{
    color: #999999;
    font-size: 30rpx;
}
.upInfo{
    width: 100%;
    color: #F39800;
    font-size: 36rpx;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    justify-content:center;
    margin-top:80rpx;
}
.upInfo_focus{
    background-color: #cccccc;
}
</style>
