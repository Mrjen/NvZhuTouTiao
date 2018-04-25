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

        <!-- 我说的消息 -->
        <view class="mySay">
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
        </view>

        <view class="chart-list" v-for="item in commList">
          <view class="mySay" v-if="item.owner==0">
            <image :src="item.avatarUrl" class="myPotrait" />
            <view>
              <view class="readBg  flex_reverse">
                <view class="talkName">{{item.nickName}}</view>
                <image class="gender" :src="item.gender==0?'../image/girl.png':'../image/boy.png'" />
                <view v-if="item.owner" class="floorHost">楼主</view>
              </view>
              <view class="myPotraitContent">
                {{item.follow_comment}}
              </view>
            </view>
          </view>

          <!-- 别人说的消息 -->
          <view v-if="item.owner==1" class="say">
            <image :src="item.avatarUrl" class="potrait" />
            <view>
              <view class="readBg">
                <view class="talkName">{{item.nickName}}</view>
                <image class="gender" :src="item.gender==0?'../image/girl.png':'../image/boy.png'" />
                <view v-if="item.owner" class="floorHost">楼主</view>
              </view>
              <view class="potraitContent">
                {{item.follow_comment}}
              </view>
            </view>
          </view>
        </view>

        <view class="writeBg_zhanwei"></view>

      </scroll-view>
    </view>

<button @click="addComment">发送</button>

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
                 class="inputRedict"/>
  </view>
    
  </div>
</template>

<script>
  import wxRequest from '../../utils/http.js';
  import api from '../../utils/api.js';
  import tips from '../../utils/tips';
  export default {
    data() {
      return {
        page: 2,
        comment_id: '',
        commContent: '',
        commentTitle: {},
        commList: [],
        scrollTop: 0,
        inputPlaceholder: '发表你的想法~'
      }
    },
    async onLoad(options) {
      console.log(options)
      this.comment_id = options.id;
      const list = await this.getList(options.id, 1)
      if (list.data.code === api.STATUS) {
        this.commList = list.data.data.list;
        this.commentTitle = list.data.data.comment;
      }
    },

    methods: {
      async getList(id, page) {
        let list = await wxRequest(api.followWommentList, {
          comment_id: id,
          page_size: 20,
          page: page,
          sort: 'asc'
        })
        return list;
      },
      //   发送评论
      async addComment() {
        if(!this.commContent) return false;
        console.log('发送评论')
        let send = await wxRequest(api.followComment, {
          comment_id: this.comment_id,
          follow_comment: this.commContent,
          re_user_id: this.commentTitle.user_id
        })
        console.log('send',send)
        if (send.data.code === api.STATUS) {
          // tips.success('评论成功', 800)
          console.log('send', send.data.data.list)
          let _commList = this.commList;
          _commList.push(send.data.data.list);
          this.commList = _commList;
          this.scrollTop = 999999;
          this.commContent = '';
        }
      },

      async scrolltolower(){
        console.log('触底了')
        let list = await this.getList(this.comment_id, this.page)
        console.log('list', list)
        if (list.data.code === api.STATUS) {
          if (list.data.data.length > 0) {
            let old = this.commList;
            this.commList = [...old, ...list.data.data.list];
            this.page++;
          }
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
