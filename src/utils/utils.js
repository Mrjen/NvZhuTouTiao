import wxRequest from './http'
import api from './api'

function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res)
      },
      fail(res) {
        getUserInfoFail()
      }
    });
  })
}

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



export default {
  getUserInfo,
  saveUserInfo,
  getToken,
  getImage,
  canvasWorkBreak,
  saveImageToPhotosAlbum,
  getUserSetting
};
