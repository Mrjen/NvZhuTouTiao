<template>
  <div class="mine">
    <view class="myCenter space_b">
      <view class="d_p space_b">
        <view class="d_fle">
          <block>
            <view v-if="userInfo.nickName?true:false" class="myCenterName">{{userInfo.nickName}}</view>
            <view v-else class="myCenterName"><open-data type="userNickName"></open-data></view>
          </block>
          <block>
             <image v-if="userInfo.gender==2?true:false" class="gender mg_15" src="../image/girl.png" />
             <image v-if="userInfo.gender==1?true:false" class="gender mg_15" src="../image/boy.png"/>
          </block>
          
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
    
    </view>

<!-- 和我相关 -->
      <aboutMe :listNav="listNav"></aboutMe>

      <listItem :itemData="listData"></listItem>

  </div>
</template>

<script>
  import wxRequest from "../../utils/http.js";
  import api from "../../utils/api.js";
  import listItem from './components/list-item';
  import aboutMe from './components/about-me';
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
        userInfo:{},
        listData:[{
            url: '../message/main',
            text: '我的信息',
            iconPath: '../image/message.png',
            msgNum: 0
         },{
           url: '../feedback/main',
           text: '意见反馈',
           iconPath: '../image/require.png',
           msgNum: 0
         }],
        listNav:[{
          url:'../likesList/main',
          num:'0',
          text:'点赞'
        },{
          url:'../commList/main',
          num:'0',
          text:'评论'
        },{
          url:'../following/main',
          num:'0',
          text:'关注'
        },{
          url:'../followers/main',
          num:'0',
          text:'粉丝'
        }
        ]
      }
    },
    components:{
      listItem,
      aboutMe
    },
    methods:{
       editInfo(){
         wx.navigateTo({
           url: '../editUserInfo/main'
         })
       }
    },
    async onShow(){
        let info = await wxRequest(api.getUserInfo,{},'POST');
        if(info.data.code === api.STATUS){
          this.userInfo = info.data.data;
          let _info = info.data.data;
          this.listNav[0].num = _info.likeNum;
          this.listNav[1].num = _info.commentNum;
          this.listNav[2].num = _info.attentionNum;
          this.listNav[3].num = _info.followerNum;
          this.listNav[2].url = `../following/main?user_id=${_info.id}`
          console.log('this.listNav',this.listNav)
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
    padding: 60rpx 60rpx 20rpx 60rpx;
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

  .require {
    width: 32rpx;
    height: 32rpx;
    margin-right: 20rpx;
  }
 

 
</style>