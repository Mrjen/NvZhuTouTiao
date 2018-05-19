<template>
  <div class="user-info">
    <view class="item">
      <view class="text">头像</view>
      <view class="avatar" @click="changeAvatar">
        <img :src="userInfo.avatarUrl" mode="widthFix" alt="">
      </view>
    </view>
    <view class="item">
      <view class="text">名字</view>
      <input type="text" :value="nickName" v-model="nickName"/>
    </view>
    <view class="item">
      <view class="text">性别</view>
      <picker @change="bindSexChange" :range="sexArray">
        <view class="picker">
          {{currentSex}}
        </view>
      </picker>
    </view>
    <view class="item">
      <view class="text">年龄</view>
      <picker @change="bindAgeChange" :value="currentAge" :range="ageArray">
        <view class="picker">
          {{currentAge}}
        </view>
      </picker>
    </view>
    <view class="item">
      <view class="text">城市</view>
      <view class="icon-view">
        <!-- <img class="select-icon" @click="openMap" src="http://p766oymet.bkt.clouddn.com/nvzhu/icon-position.png" mode="widthFix" alt=""> -->
        <picker style="min-width:100rpx" mode="region" @change="bindPickerChange" :range="cityArray">
        <view class="picker">
          {{currentCity}}
        </view>
      </picker>
      </view>
      
    </view>

    <view class="save" @click="saveInfo">保存</view>
  </div>
</template>

<script>
  import wxRequest from "../../utils/http.js";
  import api from "../../utils/api.js";
  import qiniuUploader from '../../utils/qiniuUploader';
  import tips from '../../utils/tips';

  export default {
    data() {
      return {
        userInfo: {},
        cityArray: '',
        sexArray: ['保密','男', '女'],
        currentSex: ['男'],
        currentCity: ['请选择'],
        ageArray: [''],
        currentAge: 17,
        imageURL:'',
        qqmapsdk: null,
        nickName:''
      }
    },
    async onLoad() {

      let arr = new Array(0);
      for (let i = 0, len = 100; i < len; i++) {
        arr.push(i)
      }
      arr[0] = '保密';
      this.ageArray = arr;
      let info = await wxRequest(api.getUserInfo, {}, 'POST')
      if (info.data.code === api.STATUS) {
        console.log('info', info.data.data)
        this.userInfo = info.data.data;
        this.currentCity = this.userInfo.province + this.userInfo.city
        this.nickName = this.userInfo.nickName;
        this.currentAge = info.data.data.age=='0'?'保密':info.data.data.age;
        console.log('info.data.data.gender',info.data.data.gender)
        if (info.data.data.gender === '1') {
          this.currentSex = ['男']
        } else if (info.data.data.gender === '2') {
          this.currentSex = ['女']
        } else if(info.data.data.gender === '0'){
          this.currentSex = ['保密']
          console.log('保密')
        }
      }
    },
    onShow() {
       console.log('this.userInfo', this.userInfo)
    },
    methods: {
      // 选择城市
      bindPickerChange(e) {
        this.currentCity = e.mp.detail.value;
        this.userInfo.province = e.mp.detail.value[0];
        this.userInfo.city =  e.mp.detail.value[1];
      },
      // 选择城市
      bindSexChange(e) {
        // console.log('性别', e.mp.detail.value)
        this.currentSex = this.sexArray[e.mp.detail.value];
        this.userInfo.gender =  e.mp.detail.value;
      },
      // 选择年龄
      bindAgeChange(e) {
        this.currentAge = e.mp.detail.value;
        this.userInfo.age = e.mp.detail.value;
      },
      // 获取token
      async getQiNiuToken(){
         let qiniu = await wxRequest(api.getQiNiuToken,{},'POST')
         if(qiniu.data.code === api.STATUS){
            return qiniu.data.data;
         }
      },
      // 修改头像 
      async changeAvatar() {
        var that = this;
        let QiNiuToken = await this.getQiNiuToken();
        let _upload_token = QiNiuToken.upload_token;
        wx.chooseImage({
          count: 1,
          success(res) {
            var filePath = res.tempFilePaths[0];
            qiniuUploader.upload(filePath, (res) => {
              that.imageURL = 'https://gcdn.playonwechat.com' + res.imageURL;
              that.userInfo.avatarUrl = that.imageURL;
            }, (error) => {
              console.log('error: ' + error);
            }, {
              region: 'SCN',
              uptoken: _upload_token, 
              uptokenFunc: function() {
                return '[yourTokenString]';
              }
            }, (res) => {
              console.log('上传进度', res.progress)
              console.log('已经上传的数据长度', res.totalBytesSent)
              console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            });
          }
        })
      },
      // 保存用户信息
      async saveInfo(){
        console.log('保存')
        if(this.nickName){
          this.userInfo.nickName = this.nickName
        }
         let info = await wxRequest(api.saveUserInfo,this.userInfo)
         if(info.data.code===api.STATUS){
            tips.success('保存成功')
            wx.navigateTo({
              url: '../mycenter/main'
            })
         }
      },
      // 地图选择位置
      openMap(){
         console.log('打开地图')
         let that = this;
         wx.chooseLocation({
           success(res){
             console.log(res) 

           }
         })
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-info {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 60rpx 20rpx 20rpx;
      align-items: center;
      position: relative;
    }
    .item:after {
      content: '';
      display: block;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      transform: scaleY(.5);
    }
    .item:before {
      content: '';
      display: block;
      position: absolute;
      width: 10px;
      height: 10px;
      right: 20rpx;
      top: 50%;
      margin-top: -6rpx;
      border: 1px solid #666;
      border-bottom: none;
      border-left: none;
      transform: rotate(45deg);
    }
    .avatar {
      width: 120rpx;
      height: 120rpx;
      overflow: hidden;
      border-radius: 50%;
      image {
        display: block;
        width: 100%;
      }
    }
    .text {
      font-size: 30rpx;
    }
    input {
      flex: 1;
      text-align: right;
      font-size: 30rpx;
      position: relative;
    }
    picker {
      flex: 1;
      text-align: right;
    }
    .picker {
      font-size: 30rpx;
    }
    .save{
      width: 680rpx;
      height: 80rpx;
      font-size: 30rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      margin:120rpx auto 0 auto;
      background: rgb(124,72,198);
      box-shadow: 0 0 5rpx rgba(124,72,198,.3);
    }
    .select-icon{
      width: 44rpx;
      display: inline-block;
    }
    .icon-view{
      display: flex;
    }
  }
</style>
