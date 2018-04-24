<script>
import api from './utils/api'
import wxRequest from './utils/http'
import utils from './utils/utils'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    console.log('app created and cache logs by setStorageSync')
  },
  async onLaunch(){
    console.log('小程序加载了')
    wx.login({
      success(res){
         wxRequest(api.getToken,{code:res.code}).then((res)=>{
          wx.setStorage({ key:'token',data: res.data.data.token})
          if(res.data.data.savestatus) return false;
          utils.getUserInfo().then((res) => {
            utils.saveUserInfo(res.userInfo)
          })
        })
      }
    })
  }
}
</script>

<style>
.topBar{
  margin: 40rpx;
  display: flex;
  color: #C4A7EC;
  font-size: 30rpx;
  justify-content: space-between;
  align-items: center;
}
.space_b{
  justify-content: space-between;
}
.topNew{
  margin-right: 122rpx;
}
.searchButton{
  width: 35rpx;
  height: 35rpx;
}
.active{
  color: #FFFFFF;
  font-size: 34rpx;
}
.topic{
  margin-bottom:30rpx;
}
.topic_time{
  font-size: 20rpx;
  color: #999999;
  display: flex;
  flex-direction:row-reverse;
  justify-content:right;
  margin-bottom: 23rpx;
}
.topic_title{
  color: #333333;
  font-size: 34rpx;
  font-weight: bold;
  line-height:48rpx;
  margin-bottom: 20rpx;
}
/* .topic_img{
  width: 100%;
  height: 380rpx;
  border-radius: 10rpx;
} */
.readBg{
  display: flex;
  align-items: center;
  position: relative;
}
.read{
  font-size: 28rpx;
  color: #999999;
}

.read_time{
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #999999;
}

.topic_bottom{
  margin-top: 23rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topic_button{
  width: 34rpx;
  height: 27rpx;
  border:none;
  margin-right:10rpx;
}
.topic_button_w{
  width: 34rpx;
  height: 30rpx;
  border:none;
  margin-right:10rpx;
}
.topic_button_o{
  width: 34rpx;
  height: 28rpx;
  border:none;
  margin-right:10rpx;
}
.topic_top{
  background-color: #FFFFFF;
  padding: 30rpx 40rpx 20rpx 40rpx;
}
.button_flex{
  display: flex;
  border-top: 1rpx solid #EEEEEE;
}
.three_button{
  border-radius:0;
  color: #666666;
  font-size: 28rpx;
  flex: 3;
  background-color: #FFFFFF;
  display:flex;
  align-items:center;
  justify-content:center;
}
.three_button_focus{
  background-color: #cccccc;
}
button::after{
border: none;
}

/* 性别 */
.gender{
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.writeComment{
    width:34rpx;
    height:32rpx;
    margin:34rpx 0;
    position:absolute;
    top:0;
    bottom:0;
    left:50rpx;
}


.d_fle{
  display: flex;
}

.active_text{
  color: #7c48c6 !important;
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
