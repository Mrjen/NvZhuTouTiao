
Page({
    data: {
      
    },
  
    onLoad(options) {
       console.log(options);
       if( wx.getStorageSync('desc') ){
            this.desc = wx.getStorageSync('desc');
        }
    },
  
    onReady() {
      
    },
  
    onShow() {
      
    },
  
    onHide() {
      
    },
  
    onUnload() {
      
    },
  
    onPullDownRefresh() {
      
    },
  
    onReachBottom() {
      
    },
  
    onShareAppMessage() {
      
    }
  })