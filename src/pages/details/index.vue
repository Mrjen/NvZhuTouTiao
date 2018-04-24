<template>
  <div class="detail">
    <!-- 话题主题 -->
    <view class="topic">
      <view class="topic_top">  
        <view class="topic_title">{{detail.title}}</view>
        <!-- <image class="topic_img" mode="widthFix" :src="detail.composer_cover"/> -->
        <view class="content">
            <rich-text class="richtext" :nodes="ArticleContent" @click="tap"></rich-text>
        </view>
        <view class="topic_bottom">
            <view class="readBg">
              <view class="read">阅读</view>
              <view class="read_time">{{detail.readtimes}}</view>
            </view>
            <view class="read">{{detail.create_time}}</view>
        </view>        
      </view>
      
      <view class="button_flex">
        <button class="three_button" open-type="share" hover-class="none">
          <image src="../image/share.png" class="topic_button" />
          <view>{{detail.sharetimes}}</view>
        </button>
        <button class="three_button" @click="openArticleComm" hover-class="none">
          <image src="../image/comment.png" class="topic_button_w" />
          <view>{{detail.commenttimes}}</view>
        </button>
        <button class="three_button" :class="detail.likestatus=='1'?'active_text':''" @click="likeArticle" hover-class="none">
          <image :src="detail.likestatus=='0'?'../image/like.png':'../image/like-active.png'" 
                 class="topic_button_o" />
          <view>{{detail.liketimes}}</view>
        </button>
      </view>
    </view>

    

    <!-- 精彩评论 -->
    <view class="comments" v-if="topComment.length>0?true:false">
        <view class="wonderfulComments">精彩评论</view>
        <view class="commentsConter" v-for="(comm,cidx) in topComment" :key="comm.id">
            <view class="display_flex space_b">
                <view class="display_flex">
                    <image :src="comm.avatarUrl" class="head_img" />
                    <view class="flex_end">
                        <view class="display_flex">
                            <view class="comment_name">{{comm.nickName}}</view>
                            <image v-if="comm.gender==='1'" src="../image/boy.png" class="gender" />
                            <image v-if="comm.gender==='2'" src="../image/girl.png" class="gender" />
                        </view>
                        <view class="floor display_flex">
                            <view>{{comm.create_time}}</view>
                            <view class="verticalBar"></view>
                            <view>{{comm.floor}}楼</view>
                        </view>
                    </view>
                </view>
                <view class="display_flex comm_comment">
                    <view class="nice"  :class="comm.likestatus=='1'?'active_text':''">
                        <image class="niceImg" 
                         @click="likeTopComment(cidx,comm.id,comm.likestatus)"
                        :src="comm.likestatus=='0'?'../image/nice.png':'../image/h_nice.png'" />
                        {{comm.liketimes}}
                    </view>

                    <image class="commentTalk" @click="followCommentComment(comm.id,cidx,comm.users_id)" src="../image/commentTalk.png" />
                </view>
            </view>
            <view class="commentsTxt">
                {{comm.comment}}
            </view>
            <!-- 跟评 -->
            <view class="com_comments"  v-if="comm.follow_comment.length>0">
                <view class="font_24 border_bottom" 
                      v-for="(follow, fidx) in comm.follow_comment" 
                      :key="follow.floor">
                      <view class="user-info">
                          <view class="info-left">
                              <img class="info-avatar" :src="follow.avatarUrl"/>
                              <view class="info-info">
                                  <view class="info-name">{{follow.nickName}}</view>
                                  <view class="info-time">{{follow.create_time}}</view>
                              </view>
                          </view>
                          <view class="info-comm-btn">
                              <view class="zan">
                                  <img v-if="follow.likestatus=='0'" 
                                       @click="addFollowZan(follow.likestatus, follow.follow_comment_id, fidx, cidx, '精彩评论')"
                                       mode="widthFix" src="../image/nice.png" alt="">
                                  <img v-if="follow.likestatus=='1'" 
                                       @click="addFollowZan(follow.likestatus, follow.follow_comment_id, fidx, cidx, '精彩评论')"
                                       mode="widthFix" src="../image/h_nice.png" alt="">
                                  {{follow.liketimes}}
                              </view>
                              <view class="info-comm-cion">
                                  <img mode="widthFix" @click="followFollowComment" src="../image/commentTalk.png"/>
                              </view>
                          </view>
                      </view>
                    <view class="talker">回复<text>@{{follow.renickName}}：</text>{{follow.follow_comment}}</view>
                </view>
                <view class="otherAnswer" v-if="comm.is_page" @click="readMoreFollowComm(comm.id, cidx)">查看更多评论</view>
                <view class="otherAnswer" v-if="!comm.is_page">没有更多评论</view>
            </view>
        </view>
    </view>

    

    
    <!-- 最新评论 -->
    <view class="comments" v-if="comment.length>0?true:false">
        <view class="wonderfulComments">最新评论</view>
        <view class="commentsConter" v-for="(comm,cidx) in comment" :key="comm.id">
            <view class="display_flex space_b">
                <view class="display_flex">
                    <image :src="comm.avatarUrl" class="head_img" />
                    <view class="flex_end">
                        <view class="display_flex">
                            <view class="comment_name">{{comm.nickName}}</view>
                            <image v-if="comm.gender==='1'" src="../image/boy.png" class="gender" />
                            <image v-if="comm.gender==='2'" src="../image/girl.png" class="gender" />
                        </view>
                        <view class="floor display_flex">
                            <view>{{comm.create_time}}</view>
                            <view class="verticalBar"></view>
                            <view>{{comm.floor}}楼</view>
                        </view>
                    </view>
                </view>
                <view class="display_flex comm_comment">
                    <view class="nice"  :class="comm.likestatus=='1'?'active_text':''">
                        <image class="niceImg" 
                         @click="likeTopComment(cidx,comm.id,comm.likestatus)"
                        :src="comm.likestatus=='0'?'../image/nice.png':'../image/h_nice.png'" />
                        {{comm.liketimes}}
                    </view>

                    <image class="commentTalk" @click="followCommentComment(comm.id,cidx,comm.users_id)" src="../image/commentTalk.png" />
                </view>
            </view>
            <view class="commentsTxt">
                {{comm.comment}}
            </view>
            <!-- 跟评 -->
            <view class="com_comments"  v-if="comm.follow_comment.length>0">
                <view class="font_24 border_bottom" 
                      v-for="(follow, fidx) in comm.follow_comment" 
                      :key="follow.floor">
                      <view class="user-info">
                          <view class="info-left">
                              <img class="info-avatar" :src="follow.avatarUrl"/>
                              <view class="info-info">
                                  <view class="info-name">{{follow.nickName}}</view>
                                  <view class="info-time">{{follow.create_time}}</view>
                              </view>
                          </view>
                          <view class="info-comm-btn">
                              <view class="zan">
                                  <img v-if="follow.likestatus=='0'" 
                                       @click="addFollowZan(follow.likestatus, follow.follow_comment_id, fidx, cidx, '最新评论')"
                                       mode="widthFix" src="../image/nice.png" alt="">
                                  <img v-if="follow.likestatus=='1'" 
                                       @click="addFollowZan(follow.likestatus, follow.follow_comment_id, fidx, cidx, '最新评论')"
                                       mode="widthFix" src="../image/h_nice.png" alt="">
                                  {{follow.liketimes}}
                              </view>
                              <view class="info-comm-cion">
                                  <img mode="widthFix" @click="followFollowComment(follow.user_id, follow.follow_comment_id, fidx, cidx, '最新评论')" src="../image/commentTalk.png"/>
                              </view>
                          </view>
                      </view>
                    <view class="talker">回复<text>@{{follow.renickName}}：</text>{{follow.follow_comment}}</view>
                </view>
                <view class="otherAnswer" v-if="comm.is_page" @click="readMoreFollowComm(comm.id, cidx)">查看更多评论</view>
                <view class="otherAnswer" v-if="!comm.is_page">没有更多评论</view>
            </view>
        </view>
    </view>

    <view class="writeBg_zhanwei"></view>
    <!-- <view @click="addComment" style="position:fixed;top:10rpx;right:0;border:1px solid red; width:80rpx;height:80rpx">发送</view> -->
    <!-- 评论输入 -->
    <view class="writeBg">
        <image src="../image/writeComment.png" class="writeComment"/>
        <view style="width: 100%;">
            <!-- @blur="inputBlur" -->
            <input placeholder="点击输入你的评论" 
                    :focus="inputFcus" 
                    @click="inputGetFocus"
                    fixed="true"
                    cursor-spacing="20"
                    v-model="commContent"
                    auto-height="true"
                    @confirm="addComment"
                    confirm-type="send"
                    placeholder-style="color:#999"
                    class="inputRedict"/>
                    <!-- show-confirm-bar="true" -->
        </view>
    </view>


  </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
import tips from '../../utils/tips'
export default {
  data(){
      return {
        ArticleContent: '',         // 文章内容
        topComment: '',             // 热门评论
        detail: {},                 // 详情数据
        comment: [],                // 最新评论内容
        inputFcus: false,           // 输入框焦点
        commContent:'',             // 评论内容
        id:'',                      // 评论id
        commentDom:'article',       // 评论对象 article follow
        page: 2,                    // 最新评论页数
        commentIdx: '',
        follow_page: 1,             // 跟评列表page
        follow_index: null,         // 跟评的index
        follow_id: null,
        user_id: null              // user_id
      }
  },
  async onLoad(options){
      console.log('页面加载了',options)
      const detail = await wxRequest(api.getArticleDetail,{ id: options.id, page: 1 })
      this.ArticleContent = detail.data.data.view_content;
      this.topComment = detail.data.data.topcomment;
      this.detail = detail.data.data;
      this.comment = detail.data.data.comment;
      this.id = options.id;
  },
  onUnload(){
      console.log('隐藏了')
    this.inputFcus = false;
  },
  methods:{
    // 文章评论
    openArticleComm() {
       this.inputFcus = true;
       this.commentDom = 'article'
    },
    // 
    inputGetFocus(){
      this.inputFcus = true;
    },
    // bindfocus
    bindfocus(){
       this.inputFcus = true;
    },
    // input失去焦点
    inputBlur(){
       console.log('失去焦点')
      //this.inputFcus = false;
    },
    // 点击跟评图标
    followComment(id){
       this.id = id;
       this.inputFcus = true;
       this.commentDom = 'follow';
    },
    // 喜欢文章
    async likeArticle(){
      const status = this.detail.likestatus == '0'?'inc':'dec'
      const like = await wxRequest(api.likeArticle, { id: this.detail.id, status: status })
      if(like.data.code === api.STATUS){
          this.detail.likestatus = (status=='inc'?'1':'0')
          if(status =='inc'){
              if(this.detail.liketimes.indexOf('万')) return false;
              this.detail.liketimes++
          }else if(status =='dec'){
              if(this.detail.liketimes.indexOf('万')) return false;
              this.detail.liketimes--
          }
      }
    },
    // 提交评论
    async addComment(){
        console.log('评论', this.commContent)
       if(!this.commContent) return;
       if(this.commentDom === 'article'){
        console.log('评论文章')
           this.commentArticle()
       }else if(this.commentDom === 'follow'){
           console.log('追评')
           this.commentFollow(this.user_id)
       }
    },
    // 点击追评图标
    followCommentComment(id,idx,user_id){
        console.log(id, idx,user_id )
       this.commentDom = 'follow';
       this.inputFcus = true;
       this.id = id;
       this.commentIdx = idx;
       this.user_id = user_id;
    },
    // 创建追评
    async commentFollow(user_id){
        console.log('追评')
         let follow = await wxRequest(api.followComment, { 
             follow_comment: this.commContent, 
             re_user_id: user_id, 
             comment_id: this.id
             })
         this.commContent = '';
         console.log('follow',follow)
         if(follow.data.code == api.STATUS){
             tips.success('评论成功')
             console.log('评论成功',follow.data.data)
             let comment = this.comment;
             comment[this.commentIdx].follow_comment = follow.data.data;
             console.log()
             this.comment = comment;
         }
         console.log('follow', follow)
    },
    //   评论文章
    async commentArticle(){
       let comm = await wxRequest(api.addComment,{ article_id: this.id, comment: this.commContent });
       if(comm.data.code === api.STATUS){
           this.commContent = '';
           tips.success('评论成功')
           this.comment = comm.data.data.list;
       }
       
       console.log('comm', comm)
    },
    // 精选评论点赞
    // async likeComment(idx,id,status){
    //    console.log('评论点赞',idx,id,status)
    //    let _status = (status=='0'?'inc':'dec')
    //    let like = await wxRequest(api.likeComment,{ comment_id: id, status: _status })
    //    if(like.data.code == api.STATUS){
    //        let __status = (status == '0'?'1':'0')
    //        let topComment = this.topComment;
    //        topComment[idx].likestatus = __status;
    //        console.log('__status',__status)
    //        if(topComment[idx].liketimes.indexOf('万')) return false;
    //        if(status=='0'){ 
    //            topComment[idx].liketimes++ 
    //         }else{
    //            topComment[idx].liketimes--
    //        }
    //        this.topComment = topComment;
    //    }
    //    console.log('like', like)
    // },
    // // 最新评论点赞
    // async likeTopComment(idx,id,status){
    //     console.log('最新评论点赞',idx,id,status)
    //     let _status = (status=='0'?'inc':'dec')
    //     let like = await wxRequest(api.likeComment,{ comment_id: id, status: _status })
    //     if(like.data.code === api.STATUS) {
    //         let __status = (status == '0'?'1':'0')
    //         let comment = this.comment;
    //         comment[idx].likestatus = __status;
    //        if(status=='0'){ 
    //            comment[idx].liketimes++ 
    //            }else{
    //            comment[idx].liketimes--
    //        }
    //        this.comment = comment;
    //     }
    // },
    // 增加文章分享次数
    async ArticleShare(){
        let share = await wxRequest(api.addArticleShareTime,{ id: this.detail.id })
        console.log('增加分享次数', share)
    },

    // 查看更多评论
    async readMoreFollowComm(id,idx){
      this.follow_index = idx;
      let page = this.follow_page;
      if(this.follow_id!==id){
          this.follow_page = 1;
      }
    //   if(page ===1) this.comment[idx].follow_comment = [];
      this.follow_id = id;
      let more = await wxRequest(api.followWommentList, { comment_id: id, page_size: 10, page: this.follow_page, sort:'desc' })
      if(more.data.code === api.STATUS){
          let _comment = this.comment;
          if(more.data.data.list.length){
            if(page===1) more.data.data.list.splice(0,2);
             _comment[idx].follow_comment = [..._comment[idx].follow_comment,...more.data.data.list];
             
             this.follow_page++;
          }else{
             _comment[idx].is_page = false;
          }
          this.comment = _comment;
      }
    },
    
    // 追加评论点赞
    async addFollowZan(status, id, fidx, cidx, type){
        let that = this;
       console.log(status, id, fidx)
       let _status = (status=='0'?'inc':'dec');
       console.log('_status', _status)
       console.log(this.comment[cidx].follow_comment[fidx])
      let zan = await wxRequest(api.likefollowcomment, { follow_comment_id: id, status: _status })
      if(zan.data.code === api.STATUS){
           let _comment = (type==='精彩评论')?that.topComment:that.comment
             if(status=='0'){
                _comment[cidx].follow_comment[fidx].liketimes++;
                _comment[cidx].follow_comment[fidx].likestatus = 1;
            }else if(status=='1'){
                _comment[cidx].follow_comment[fidx].liketimes--;
                _comment[cidx].follow_comment[fidx].likestatus = 0;
            }
           if(type==='精彩评论'){
               that.topComment = _comment;
           }else if(type==='最新评论'){
               that.comment = _comment;
           }
           
      }
    },

    // 追评添加追评
    async followFollowComment(user_id, comment_id, fidx, cidx, type){
    console.log('回复评论')
        let follow = await wxReuqest(api.followComment, { 
            follow_comment: this.commContent, 
            re_user_id: user_id, 
            comment_id: comment_id
         })
         this.commContent = '';
         console.log('回复评了', follow)
    }
  },

  async onReachBottom(){
      console.log('触底了')
      let more = await wxRequest(api.commentList, { page: this.page, id: this.detail.id })
      console.log('more', more)
      if(more.data.code === api.STATUS){
          if(more.data.data.length>0){
              let oldList = this.comment;
              this.comment = [...oldList,...more.data.data.length];
              this.page++;
          }
      }
  },

  async onPullDownRefresh(){
     console.log('刷新页面')
    const detail = await wxRequest(api.getArticleDetail,{ id: this.detail.id, page: 1 })
    this.ArticleContent = detail.data.data.view_content;
    this.topComment = detail.data.data.topcomment;
    this.detail = detail.data.data;
    this.comment = detail.data.data.comment;
     wx.stopPullDownRefresh();
     tips.success('刷新成功')
  },

  onShareAppMessage(){
      let that = this;
    return {
        title: this.detail.title,
        path: '/pages/details/main?id=' + this.detail.id,
        success: function(res) {
            // 转发成功
            console.log('转发成功')
            that.ArticleShare()
        },
        fail: function(res) {
            // 转发失败
        }
    }
  }
}
</script>

<style lang="less">
page{
    background-color: #EEEEEE;
}

.topic_title{
    padding-bottom: 30rpx;
    box-sizing: border-box;
    margin-bottom: 50rpx;
    position: relative;
}


.topic_title:after{
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scaleY(.5)
}

.zan{
    align-items: center;
    margin-right: 40rpx;
}

.comments{
    background-color:#FFFFFF;
    margin-bottom: 20rpx;
}

.topic_img{
    display: block;
    width: 100%;
}

.wonderfulComments{
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    padding-left: 35rpx;
    padding-bottom: 30rpx;
    padding-top: 30rpx;
}
.commentsConter{
    padding: 30rpx;
    border-top: 1rpx solid #E5E5E5;
}
.head_img{
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    border-radius: 50%;
}

.display_flex{
    display: flex;
    align-items: center;
}

.verticalBar{
    width: 4rpx;
    background-color: #999999;
    margin-left: 20rpx;
    margin-right: 20rpx;
    height: 20rpx;
}
.floor{
    color: #999999;
    font-size: 20rpx;
    margin-top: 10rpx;
}
.nice{
    font-size: 28rpx;
    color: #999999;
    margin-right: 40rpx;
}
.niceImg{
    width:26rpx;
    height: 30rpx;
}
.commentTalk{
    width: 32rpx;
    height: 30rpx;
}
.comment_name{
    color: #333333;
    font-size: 28rpx;
}
.flex_end{
    align-self:flex-end;

}
.commentsTxt{
    color: #333333;
    font-size: 28rpx;
    margin: 30rpx 13rpx 30rpx 97rpx;
}

.font_24{
    color: #666666;
    font-size: 24rpx;
    margin-bottom: 24rpx;
}


.writeBg{
    position:fixed;
    bottom:0;
    left: 0;
    right: 0;
    background-color:#fff;
    border-top:1rpx solid #D7D7D9; 
    display:flex;
    align-items:center;
    padding:0 30rpx;
    height: 100rpx;
}

.writeBg_zhanwei{
    width:100%;
    min-height: 100rpx;
    display: flex;
    align-items: center;
}
.inputRedict{
    background-color:#eee;
    border-radius:14rpx;
    min-height: 70rpx;
    padding-left: 20rpx;
    line-height: 74rpx;
    box-sizing: border-box;
    font-size:30rpx;
    color: #333;
    width:100%;
}

.content{
    img{
        width: 100%;
        display: block;
    }
}
  .richtext {
    .common-css {
      padding: 0;
      margin: 0;
      font-family: 'Microsoft YaHei';
      box-sizing: border-box;
    }
    .p{
      color: #444;
      font-size: 32rpx;
      line-height: 1.6 !important;
      margin:15rpx 0;
      font-weight: 300;
      text-align: justify;
    }
    .common-css::after,
    .common-css::before {
      content: '';
      visibility: hidden;
    }
    .page {
      position: relative;
      float: left;
      width: 750rpx;
      min-height: 100%;
      padding: 25rpx;
      font-family: 'SimHei';
      background-color: #fff;
    }
    .page-rich-text {
      float: left;
      width: 100%;
    }
    .div {
      float: left;
      margin-bottom: 20rpx;
      width: 100%;
      font-size: 30rpx;
      color: #454545;
      line-height: 66rpx;
      text-indent: 2rem;
      letter-spacing: 4rpx;
      word-spacing: 4rpx;
    }
    .img {
      float: left;
      margin: 20rpx 0;
      width: 100%;
    }
    .em {
      font-size: 26rpx;
      color: #868686;
    }
    .a,
    .span {
      font-size: 30rpx;
      color: #333;
    }
    .page-share {
      display: none;
      position: fixed;
      top: 10rpx;
      left: 10rpx;
      z-index: 99;
      width: 200rpx;
      height: 60rpx;
      background-color: #226abc;
    }
  }

// 跟评样式
.comm_comment{
    margin-right: 20rpx;
}

.com_comments{
    background-color: #F7F7F7;
    padding:24rpx 20rpx 20rpx 20rpx;
    margin-left: 78rpx;
    .info-left{
        display: flex;
        padding-bottom: 10rpx;
        position: relative;
    }
    .border_bottom{
        position: relative;
        padding-bottom: 10rpx;
    }
    .border_bottom:after{
        content: '';
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        transform: scaleY(.5);
        left: 0;
        bottom: 0;
        position: absolute;
    }
    .info-avatar{
        width: 50rpx;
        height: 50rpx;
        margin-right: 14rpx;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .info-name{
        font-size: 24rpx;
        color: #793292;
    }
    .info-time{
        font-size: 22rpx;
        color:#8c8c8c;
    }
    .talker{
        text-align: justify;
        text{
          color: #793292;
        }
    }
    .otherAnswer{
        font-size: 24rpx;
        color: #5EB6E7;
        text-align: center;
    }
    .user-info{
        display: flex;
        justify-content: space-between;
    }
    .info-comm-btn{
        display: flex;
        img{
            width: 32rpx;
        }
    }
    .info-comm-cion{
        img{
            width: 32rpx;
        }
    }
}
</style>
