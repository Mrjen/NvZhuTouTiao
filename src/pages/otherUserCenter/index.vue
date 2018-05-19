<template>
  <div class="user-center">
     <userView :userData="user_Info" :userId="user_id"></userView>
     <tagNav @changeTagNav="changeTagNav"></tagNav>
     <!-- 点赞列表 -->
     <view class="like-list" v-if="currentTab==='like'?true:false">
        <block v-for="(item, idx) in likeList" :key="idx">
            <likeItem :itemData="item" @toDetail="toLikeItemDetail"></likeItem>
        </block>
     </view>
     <!-- 评论列表 -->
     <view class="participate-list like-list">
         <block v-for="item in commentList" :key="item.article_id">
             <commItem :itemData="item" :userId="user_id" @toDetail="toLikeItemDetail"></commItem>
         </block>
     </view>

     <!-- 底部按钮 -->
     <addAttation :isattention="isattention" @removeFollower="removeFollower" @addFollowing="addFollowing"></addAttation>
  </div>
</template>

<script>
import userView from './components/info-view';
import tagNav from './components/tag-nav';
import api from '../../utils/api';
import wxRequest from '../../utils/http';
import likeItem from '../likesList/components/like-item';
import commItem from '../commList/components/comment-item';
import addAttation from './components/add-attation';
export default {
  data(){
    return {
      user_id: null,
      user_Info: {},
      likeList: [],                    // 点赞列表
      commentList: [],                 // 评论列表
      currentTab: 'like',              // 当前tab所在标签
      page: 2,
      isattention: null                // “我”是否关注这个用户
    }
  },
  components:{
    userView,
    tagNav,
    likeItem,
    commItem,
    addAttation
  },

  async onLoad(options){
     this.user_id = options.id;
     this.likeList = await this.getLikeList(1,options.id, this.currentTab)
  },
  // 获取最新消息
  async onShow(){
     let json = await wxRequest(api.getUserInfo,{user_id: this.user_id},'post')
     if(json.data.code === api.STATUS){
        this.user_Info =  json.data.data;
        console.log(this.user_Info)
        console.log('json', json.data.data)
     }else{
       console.log('获取用户信息失败', json)
     }

    //  判断“我”是否已关注这个用户
    let care = await wxRequest(api.isattention,{attention_id:this.user_id},'post');
    if(care.data.code===api.STATUS){
       this.isattention = care.data.data.is_attention;
    }else{
      console.warn('请求错误',care)
    }
    
  },
  async onReachBottom(){
    let oldList = this.likeList;
    let newList = await this.getLikeList(this.page,this.user_id, this.currentTab);
    if(newList){
       this.likeList = [...oldList,...newList];
    }
  },
  methods:{
    // 获取列表数据
    async getLikeList(page=1,user_id='', type='like'){
      let json = await wxRequest(api.userCommentList,{user_id:this.user_id,page:page, type:type}, 'post');
      console.log('获取到点赞列表', json)
      if(json.data.code === api.STATUS && json.data.data.length>0){
        return json.data.data;
      }else{
        console.log('请求错误或者没有数据了', json)
      }
    },
    // 去详情页
    toLikeItemDetail(id){
      wx.navigateTo({
        url: `../details/main?id=${id}`
      })
    },
    // 切换导航
    async changeTagNav(idx){
      console.log('切换导航', idx);
      let _currentTab = ['like','comment'];
      this.currentTab = _currentTab[idx]; 
      this.page = 2;
      if(_currentTab[idx]==='like'){
        this.likeList = await this.getLikeList(1, this.user_id, this.currentTab)
      }else if(_currentTab[idx]==='comment'){
        this.commentList = await this.getLikeList(1, this.user_id, this.currentTab)
      }
      
    },
    // 取消关注用户
    async removeFollower(){
      let that = this;
      wx.showActionSheet({
        itemList: ['取消关注'],
        success: function(res) {
          console.log(res.tapIndex)
          if(res.tapIndex===0){
            wxRequest(api.delattention,{attention_id:that.user_id},'post')
            .then(res=>{
              if(res.data.code===api.STATUS){
                that.isattention = 0;
              }else{
                console.log('请求出错', res)
              }
            })
            
          }
        }
      })
       
    },
    // 添加关注
    async addFollowing(){
      let json = await wxRequest(api.createattention,{attention_id:this.user_id,follower_id:wx.getStorageSync('myid')},'post');
      if(json.data.code === api.STATUS){
         this.isattention = 1;
      }else{
         console.warn('json', json)
      }
    }
  },
  
}
</script>

<style lang="less" scoped>
.like-list{
  margin-top: 40rpx;
  .list-item{
     width: 100%;
     box-sizing: border-box;
   }
   .time{
     height: 50rpx;
     background: #eee;
     font-size: 22rpx;
     line-height: 50rpx;
     color:#9f9f9f;
     padding:0 10rpx;
   }
   .in-item{
     display: flex;
     align-items: center;
     min-height: 120rpx;
     padding:20rpx;
     position: relative;
   }
   .in-item::after{
     content: '';
     display: block;
     width: 100%;
     border-bottom: 1px solid rgba(0, 0, 0, .1);
     position: absolute;
     left: 0;
     bottom: 0;
     transform: scaleY(.5);
   }
   .item-left{
     flex: 1;
     padding-right: 14rpx;
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     .title{
       font-size: 28rpx;
     }
     .info{
       display: flex;
       justify-content: space-between;
       font-size: 24rpx;
       color: #666;
       margin-top: 10rpx;
     }
    
   }
}
</style>
