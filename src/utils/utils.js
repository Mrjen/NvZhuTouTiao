import wxRequest from './http'
import api from './api'

// 获取用户信息
async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wxRequest(api.getUserInfo,{},'POST').then(res=>{
        if(res.data.code === api.STATUS){
            resolve(res.data.data)
          }
    })
  })
}

// 获取token 
function getToken() {
  return new Promise((reslove, reject) => {
    wx.login({
      success(res) {
        wxRequest(api.getToken, {
          code: res.code
        }).then(res => {
          reslove(res)
        })
      }
    });
  })

}

// 获取用户信息失败
function getUserInfoFail() {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: "您没有授权，去授权？",
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击确定");
          wx.openSetting({
            success: res => {
              console.log(res)
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success(res) {
                    console.log(res)
                    resolve(res)
                  },
                  fail(res) {
                    reject(res)
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  })

}

function saveUserInfo(params) {
  wxRequest(api.saveUserInfo, params)
    .then((res) => {
      console.log(res)
    })
}

// 截取字段
function canvasWorkBreak(maxWidth, fontSize, text) {
  const maxLength = maxWidth / fontSize;
  const textLength = text.length;
  let textRowArr = [];
  let tmp = 0;
  while (1) {
    textRowArr.push(text.substr(tmp, maxLength));
    tmp += maxLength;
    if (tmp >= textLength) {
      return textRowArr;
    }
  }
}

// 获取图片
function getImage(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success(res) {
        resolve(res.tempFilePath);
      }
    })
  })
}

// 获取设置
function getUserSetting(path) {
  console.log("走失败了");
  wx.getSetting({
    success: res => {
      console.log(res);
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        wx.showModal({
          title: "提示",
          content: "你没有打开保存到相册的权限，现在去打开？",
          success: function(res) {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting["scope.writePhotosAlbum"]) {
                    saveImageToPhotosAlbum(path);
                  }
                }
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    }
  });
}

// 保存图片到相册
function saveImageToPhotosAlbum(path, reject) {
  wx.saveImageToPhotosAlbum({
    filePath: path,
    success(res) {
      wx.showModal({
        title: "海报已保存到系统相册",
        content: "快去分享给朋友，叫伙伴们来围观吧！",
        showCancel: false,
        confirmText: "我知道了",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
        fail(res) {
          reject();
        }
      });
    }
  });
}

// 统计分享次数
async function shareTime(id){
   let share = await wxRequest(api.addArticleShareTime,{ id: id })
   console.log('share',share)
}


  // 合成海报
async function userDownloadPoster(ctx,title,that){
      wx.showLoading({title:'生成中'})
      let bg = 'https://gcdn.playonwechat.com/nvzhu/poster-bg.png'
      const canvas_bg = await getImage(bg);
      let userInfo = await getUserInfo();

      let avatarUrl = userInfo.userInfo.avatarUrl;
      ctx.drawImage(canvas_bg, 0, 0, 750, 1334)
      
      // 画头像
      ctx.save()
      ctx.beginPath()
      ctx.arc(80, 456, 50, 0, 2*Math.PI)
      // ctx.setFillStyle('#ff2cff')
      // ctx.fill();
      ctx.clip()
      let _avatarUrl = await getImage(avatarUrl)
      ctx.drawImage(_avatarUrl, 30, 406, 100, 100)
      ctx.restore()
      
      // 写入昵称
      ctx.beginPath()
      ctx.setFillStyle('#333333')
      ctx.setFontSize(34)
      ctx.fillText(userInfo.userInfo.nickName, 150, 446)
      ctx.save()
      
      ctx.beginPath()
      ctx.setFillStyle('#999999')
      ctx.setFontSize(30)
      ctx.fillText('正在围观讨论这个话题', 150, 486)

      //  文字背景
      // ctx.beginPath()
      // ctx.setFillStyle('red')
      // ctx.fillRect(30, 638, 614, 300)

      // 写入标题
      ctx.beginPath()
      ctx.setFillStyle('#000000')
      ctx.setTextAlign('left')
      ctx.setFontSize(60)
      let textArr = canvasWorkBreak(550, 60, title)
      let textH = textArr.length * 74;
      let textMT = (300 - textH)/2 + 690;
      console.log('textH',textH, 'textMT', textMT)
      for(let i=0;i<textArr.length;i++){
        ctx.fillText(textArr[i], 66, textMT +(i*74))
      }
      
      // 画二维码
      ctx.beginPath();
      let qr_code = 'https://gcdn.playonwechat.com/qr-code.png';
      let applet_qrcode = await getImage(qr_code)
      ctx.drawImage(applet_qrcode, 52, 1104, 200, 200)
      ctx.draw();
      
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success(res){
           console.log('导出图片',res)
           let image = res.tempFilePath;
           saveImageToPhotosAlbum(image,getUserSetting(image))
           that.popup = false;
        },
        fail(res){
          console.log('失败', res)
          utils.success('保存失败')
          that.popup = false;
        },
        complete(){
          wx.showTabBar()
          wx.hideLoading()
        }
      })
}



export default {
  getUserInfo,
  saveUserInfo,
  getToken,
  getImage,
  canvasWorkBreak,
  saveImageToPhotosAlbum,
  getUserSetting,
  shareTime,
  userDownloadPoster
};
