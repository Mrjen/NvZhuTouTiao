<script>
import api from './utils/api'
import wxRequest from './utils/http'
import utils from './utils/utils'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    // console.log('app created and cache logs by setStorageSync')
  },
  async onLaunch(){
    // console.log('小程序加载了')
    wx.login({
      success(res){
         wxRequest(api.getToken,{code:res.code}).then((res)=>{
          wx.setStorage({ key:'token',data: res.data.data.token})
        })
      }
    })
  }
}
</script>

<style>

view{
  font-size: 30rpx;
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


.none-more{
  width: 750rpx;
  height: 500rpx;
  text-align: center;
  line-height: 500rpx;
  color: #999;
  font-size: 30rpx;
}

/* 评论输入框 */

.writeBg{
    position:fixed;
    bottom:0rpx;
    left: 0;
    right: 0;
    background-color:#fff;
    border-top:1rpx solid #D7D7D9; 
    display:flex;
    align-items:center;
    padding:20rpx 30rpx;
    min-height: 100rpx;
    box-sizing: border-box;
}

.inputRedict{
    background-color:#eee;
    border-radius:14rpx;
    min-height: 70rpx;
    padding-left: 20rpx;
    line-height: 40rpx;
    box-sizing: border-box;
    font-size:30rpx;
    color: #333;
    max-height: 200rpx;
    flex: 1;
    display: block;
}

.writeBg_zhanwei{
  width: 750rpx;
  height: 120rpx;
}

/* 获取用户信息按钮 */
.getinfo{
  width: 750rpx;
  height: 100rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  margin: 0;
  box-sizing: border-box;
  padding: 20rpx 30rpx !important;
}

.same-input{
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  text-indent: 20rpx;
  font-size: 30rpx;
  background: #eee;
  color: #999;
  text-align: left;
  border-radius: 14rpx;
}

button::after{
  display: none;
}

/* 假的评论按钮 */
page .same-comm{
  background-color: transparent;
  width: 32rpx;
  height: 32rpx;
  line-height: 1;
  padding: 0 !important;
  margin:0 !important;
  overflow: inherit !important;
}

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
