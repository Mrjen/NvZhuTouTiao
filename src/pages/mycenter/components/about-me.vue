<template>
  <div class="about-me">
     <view class="list">
        <navigator class="list-item" 
              v-for="(nav,index) in listNav" 
              :key="index"
              :url="nav.url">
            <view class="num">{{nav.num}}</view>
            <view class="text">{{nav.text}}</view>
        </navigator>
     </view>
  </div>
</template>

<script>
export default {
  name:'aboutMe',
  data(){
    return{}
  },

  props: {
    listNav:{
      type:Array,
      default:function(){
      return [{
        url:'../likesList/main',
        num:'0',
        text:'点赞'
      },{
        url:'../commList/main',
        num:'0',
        text:'评论'
      }
      // ,{
      //   url:'../following/main',
      //   num:'0',
      //   text:'关注'
      // },{
      //   url:'../followers/main',
      //   num:'0',
      //   text:'粉丝'
      // }
      ]
    }
    },
    
  },
  onLoad(){
    console.log('onLoad222', this.listNav)
  },
  onShow(){
    console.log('组件显示了')
  }
}
</script>

<style lang="less" scoped>
.about-me{
  background: #7c48c6;
   .list{
     display: flex;
     padding: 20rpx 0;
     navigator{
       width: 25%;
       justify-content: center;
       position: relative;
       align-items: center;
       view{
         text-align: center;
         color: #fff;
       }
       .num{
         font-size: 32rpx;
         font-weight: bold;
       }
       .text{
         font-size: 28rpx;
       }
     }
     navigator:before{
       content:'';
       display: block;
       position: absolute;
       left: 0;
       height: 50rpx;
       top: 50%;
       margin-top: -25rpx;
       border-left: 1px solid rgba(255,255,255,.3);
     }
     navigator:nth-of-type(1):before{
       display: none;
     }
   }
}
</style>
