<template>
<div class="like-list">
  <view v-if="likeList.length?true:false">
    <view v-for="(item, idx) in likeList" :key="item.cover">
      <view class="list-item">
         <likeItem :itemData="item"></likeItem>
      </view>
    </view>
  </view>

  <view v-else class="none-more">
       暂无数据
  </view>

</div>

</template>

<script>
import wxRequest from "../../utils/http.js";
import api from "../../utils/api.js";
import likeItem from './components/like-item';
export default {
  data(){
    return {
      likeList:[],
      page: 2
    }
  },
  components:{
    likeItem
  },
  async onShow(){
     let list = await this.getList(1,'like');
     if(list.data.code === api.STATUS){
       this.likeList = list.data.data;
     }
  },
  methods:{
    async getList(page,type='like'){
     let list =  wxRequest(api.userCommentList,{ page: page, type: type },'POST')
     return list;
    },
    // 区详情
    toDetail(id){
       wx.navigateTo({
         url: '../details/main?id=' + id
       })
    }
  },
  async onReachBottom(){
     let list = await this.getList(this.page)
     if(list.data.code === api.STATUS){
        if(list.data.data.length>0){
           let likeList = this.likeList;
           this.likeList = [...likeList,...list.data.data];
           this.page++;
        }
     }
  }
}
</script>

<style lang="less" scoped>

</style>
