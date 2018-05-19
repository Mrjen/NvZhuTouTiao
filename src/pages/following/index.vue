<template>
  <div class="following">
    <block v-for="(item, idx) in followingList" :key="item.id">
       <followItem @removeFollowing="removeFollowing" :itemData="item" :idx="idx"></followItem>
     </block>
  </div>
</template>

<script>
// 他的关注

import followItem from './components/follow-item';
import api from '../../utils/api';
import wxRequest from "../../utils/http.js";
export default {
  data(){
    return{
      page: 1,
      followingList: [],
      user_id: ''
    }
  },
  components:{
    followItem
  },
  onLoad(options){
    console.log(options)
     if(options.nav_title){
      wx.setNavigationBarTitle({
        title: options.nav_title
      })
     }
     this.user_id = options.user_id;
  },
  async onShow(){
    console.log('onshow')
     let json = await this.getFollowingList(this.page,15,this.user_id);
     this.followingList = json;
  },
  methods:{
    async getFollowingList(page='1', page_size='15',user_id=''){
       let json = await wxRequest(api.followingList, {page:page,page_size:15,user_id:user_id},'post');
       if(json.data.code === api.STATUS && json.data.data.length>0){
          return json.data.data;
       }else{
          console.warn('请求错误或者没有数据', json.data)
       }
    },
    // 取消关注
    async removeFollowing(idx, id){
      console.log('idx',idx, 'id', id);
      let followingList = this.followingList;
      let json = await wxRequest(api.delattention,{id: id},'post');
      if(json.data.code === api.STATUS){
         console.log('取消关注',json)
         followingList[idx].is_both = 0;
         this.followingList = followingList;
      }
    }
  }
}
</script>

<style scoped>
.foll-item{
  position: relative;
}
.foll-item:afeter{
  content:'00';
  display: block;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
}
</style>
