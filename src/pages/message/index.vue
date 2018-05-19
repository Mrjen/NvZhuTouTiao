<template>
  <div class="message">
    <!-- <view v-if="msgList.length?true:false">
        <view class="msg-box" 
            v-for="(item,idx) in msgList" 
            :key="item.create_time">
        <view class="message-item" 
              @touchstart="touchS" 
              @touchmove="touchM" 
              @click="toDetail(item.reid)"
              :data-index="idx"
              @touchend="touchE" 
              :style="item.txtStyle">
          <view class="d_fle space_b">
              <view class="sysTopic">系统通知</view>
              <view class="sysTime">{{item.create_time}}</view>
          </view>
          <view class="sysContent">{{item.message}}</view>
        </view>
        <view class="delete" @click="deleteMsg(item.id, idx)">删除</view>
      </view>
    </view> -->
    
    <!-- 导航 -->
    <view class="nav">
      <form v-for="(item,idx) in nav" :key="item.id" report-submit="true" bindsubmit="changeNav">
         <button class="btn-item" 
         :class="{active:item.active}" formType="submit">{{item.text}}</button>
      </form>
    </view>

     
    <!-- <view v-else class="none-more">
       暂无数据
    </view> -->
    
  </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
export default {
  data() {
    return {
       page: 2,
       msgList:[],
       startX: 0,
       delBtnWidth: 120,
       nav:[{
        id: '1',
        tag: 'notice',
        text: '通知',
        active: true
      },{
        id: '2',
        tag: 'chart',
        text: '私聊',
        active: false
      }]
    }
  },
  async onShow(){
     let msg = await this.getMsg(1)
     if(msg.data.code === api.STATUS){
        msg.data.data.map(el=>{
          el.txtStyle = 'left:0'
        })
        this.msgList = msg.data.data;
     }
  },
  methods:{
     async getMsg(page){
         let msg = await wxRequest(api.systemMsgList,{ page: page },'POST')
         return msg;
     },

    //  消息详情
    toDetail(id){
       wx.navigateTo({
         url: '../messageDetail/main?id='+id
       })
    },
     
    //  删除消息
    async deleteMsg(id, idx){
       let msg = await wxRequest(api.deleteSystemMsg,{ id: id }, 'POST')
       if(msg.data.code === api.STATUS){
          let msgList = this.msgList;
          msgList.splice(idx,1)
          this.msgList = msgList;
       }
    },

     //手指刚放到屏幕触发
  touchS:function(e){
    console.log("touchS", e);
   //判断是否只有一个触摸点
    if(e.mp.touches.length==1){
      this.startX = e.mp.touches[0].clientX
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM:function(e){
      console.log("touchM:",e);
    var that = this
    if(e.mp.touches.length==1){
     //记录触摸点位置的X坐标
      var moveX = e.mp.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = this.startX - moveX;
     //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = this.delBtnWidth;
      var txtStyle = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-"+disX+"px";
        if(disX>=delBtnWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-"+delBtnWidth+"px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var msgList = this.msgList;
      //将拼接好的样式设置到当前item中
      msgList[index].txtStyle = txtStyle; 
      console.log('txtStyle',txtStyle)
      //更新列表的状态
      this.msgList = msgList
    }
  },
touchE:function(e){
      console.log("touchE", e);
    var that = this
    if(e.mp.changedTouches.length==1){
      //手指移动结束后触摸点位置的X坐标
      var endX = e.mp.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.startX - endX;
      var delBtnWidth = this.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var msgList = this.msgList;
      msgList[index].txtStyle = txtStyle; 
      console.log('txtStyle',txtStyle)
      //更新列表的状态
      this.msgList = msgList;
      console.log('this.msgList', this.msgList)
    }
  }
  },
  
  async onReachBottom(){
     let more = await this.getMsg(this.page)
     if(more.data.code === api.STATUS){
        if(more.data.data.length>0){
          let oldList = this.msgList;
          more.data.data.map(el=>{
            el.txtStyle = 'left:0'
          })
          this.msgList = [...oldList,...more.data.data]
        }
     }
  },

  onShareAppMessage(){

  }
}
</script>

<style lang="less">
page{
    background-color: #F3F6F8;
}
.message{
    background-color: #FFFFFF;
    margin-top: 20rpx;
    box-sizing: border-box;
}

.msg-box{
  position: relative;
}

.message-item{
   padding:35rpx;
   left: 0;
   position: relative;
   z-index: 2;
   background: #fff;
}

.delete{
  position: absolute;
  top: 0;
  right: 0;
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: red;
  height: 100%;
  font-size: 30rpx;
  z-index: 1;
}

.sysTopic{
    color: #333333;
    font-size:36rpx;
}
.sysTime{
    color: #999999;
    font-size:24rpx;
}
.sysContent{
    color: #999999;
    font-size:30rpx;
    margin-top: 30rpx;    
}

</style>
