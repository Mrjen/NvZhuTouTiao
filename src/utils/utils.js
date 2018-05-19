import wxRequest from './http'
import api from './api'


function formatTime(unixtime, withTime) {
  if (!unixtime) {
    unixtime = (new Date()).getTime();
  } else {
    unixtime *= 1000;
  }
  var nd = new Date(unixtime),
    year = nd.getFullYear(),
    month = nd.getMonth() + 1,
    day = nd.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (!withTime) {
    return year + '-' + month + '-' + day;
  }
  var hour = nd.getHours(),
    minute = nd.getMinutes(),
    second = nd.getSeconds();
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second; 
  // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
}


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
          wx.setStorageSync('token', res.data.data.token)
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
// async function userDownloadPoster(ctx,title,that){
async function userDownloadPoster(
  data = { ctx: null, title: "标题", that: null, qrcodePath: null }
) {
  wx.showLoading({ title: "生成中" });
  let bg = "https://gcdn.playonwechat.com/nvzhu/poster-bg.png";
  const canvas_bg = await getImage(bg);
  let userInfo = await getUserInfo();
  let avatarUrl =
    userInfo.avatarUrl || "https://nvzhu.zealcdn.cn/public/img/icon.jpg";
  data.ctx.drawImage(canvas_bg, 0, 0, 750, 1334);
  // 画头像
  data.ctx.save();
  data.ctx.beginPath();
  data.ctx.arc(80, 456, 50, 0, 2 * Math.PI);
  // data.ctx.setFillStyle('#ff2cff')
  // data.ctx.fill();
  data.ctx.clip();
  let _avatarUrl = await getImage(avatarUrl);
  data.ctx.drawImage(_avatarUrl, 30, 406, 100, 100);
  data.ctx.restore();

  // 写入昵称
  data.ctx.beginPath();
  data.ctx.setFillStyle("#333333");
  data.ctx.setFontSize(34);

  let nickName = userInfo.nickName || "匿名";
  data.ctx.fillText(nickName, 150, 446);
  data.ctx.save();

  data.ctx.beginPath();
  data.ctx.setFillStyle("#999999");
  data.ctx.setFontSize(30);
  data.ctx.fillText("正在围观讨论这个话题", 150, 486);

  //  文字背景
  // data.ctx.beginPath()
  // data.ctx.setFillStyle('red')
  // data.ctx.fillRect(30, 638, 614, 300)
  

  // 写入标题
  data.ctx.beginPath();
  data.ctx.setFillStyle("#000000");
  data.ctx.setTextAlign("left");
  data.ctx.setFontSize(60);
  let textArr = canvasWorkBreak(550, 60,' ' + data.title);
  console.log('textArr',textArr);
  // let anOther = textArr[0];
  // // textArr.shift();

  let textH = textArr.length * 74;
  let textMT = (300 - textH) / 2 + 690;
  console.log("textH", textH, "textMT", textMT);

  // 画左边冒号
  data.ctx.beginPath()
  let leftMH = await getImage('https://gcdn.playonwechat.com/nvzhuleft-maohao.png');
  data.ctx.drawImage(leftMH, 30+100, textMT-80, 48,34)

  
  for (let i = 0; i < textArr.length; i++) {
    if(i===0){
      data.ctx.fillText(textArr[i], 66 + 120, textMT + i * 74);
    }else{
      data.ctx.fillText(textArr[i], 66, textMT + i * 74);
    }
  }

  let lastItemLen = textArr[textArr.length-1].length;
  console.log('lastItemLen', lastItemLen)

  // 画右边冒号
  data.ctx.beginPath()
  let leftRH = await getImage('https://gcdn.playonwechat.com/nvzhuright-maohao.png');
  // if(textArr.length===1){
  //   data.ctx.drawImage(leftRH, 30 + lastItemLen*60 + 170, 600 + textArr.length * 90 + 40, 48,34)
  // }else{
    data.ctx.drawImage(leftRH, 30 + lastItemLen*60 + 80, 600 + textArr.length * 90 + 20, 48,34)
  // }
  

  // 画二维码
  data.ctx.beginPath();
  // let qr_code = "https://gcdn.playonwechat.com/nvzhu/qr-code.jpg";
  let qr_code = data.qrcodePath;
  let applet_qrcode = await getImage(qr_code);
  data.ctx.drawImage(applet_qrcode, 52, 1104, 200, 200);
  data.ctx.draw();

  wx.canvasToTempFilePath({
    canvasId: "mycanvas",
    success(res) {
      console.log("导出图片", res);
      let image = res.tempFilePath;
      saveImageToPhotosAlbum(image, getUserSetting(image));
      data.that.popup = false;
    },
    fail(res) {
      console.log("失败", res);
      utils.success("保存失败");
      data.that.popup = false;
    },
    complete() {
      wx.showTabBar();
      wx.hideLoading();
      data.that.inputShow = true;
    }
  });
}



export default {
  formatTime,
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
