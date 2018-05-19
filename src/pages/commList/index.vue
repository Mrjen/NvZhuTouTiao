<template>
  <div class="like-list">
    <view v-if="commentList.length?true:false">
      <view v-for="(item, idx) in commentList" :key="item.cover">
        <commItem :itemData="item" @toDetail="toDetail"></commItem>
      </view>
    </view>
    <view v-else class="none-more">
       暂无数据
    </view>
    <test :content1="testData" @sougou="sougou">
       <img  src="http://iph.href.lu/500x500?text=我是一张图片"/>
    </test>
  </div>
</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
import commItem from './components/comment-item';
import test from './components/test'
export default {
  data(){
    return {
      commentList:[],
      page: 2,
      testData:'我、挥洒迪欧hi返回扫'
    }
  },
  components:{
    commItem,
    test
  },
  async onShow(){
     let commentList = await this.getList(1,'comment')
     if(commentList.data.code === api.STATUS){
       this.commentList = commentList.data.data;
     }

     setTimeout(()=>{
       this.testData = '我改变了'
     },3000)
     
  },
  methods:{
     
     sougou(text){
        console.log('我是当前页面',text)
     },

    async getList(page,type='comment'){
     let list =  wxRequest(api.userCommentList,{ page: page, type: type },'POST')
     return list;
    },
    toDetail(id){
      wx.navigateTo({
        url: '../details/main?id=' + id
      })
    }
  },
  async onReachBottom(){
    console.log('到底了')
     let list = await this.getList(this.page, 'comment')
     if(list.data.code === api.STATUS){
        if(list.data.data.length>0){
           let commentList = this.commentList;
           this.commentList = [...commentList,...list.data.data];
           this.page++;
        }
     }
  }
}
</script>

<style lang="less" scoped>

</style>
