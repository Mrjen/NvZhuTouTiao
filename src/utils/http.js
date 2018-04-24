export default function wxRequest(url, params = {}, method = "GET") {
                 params.token = wx.getStorageSync("token") || "";
                //  console.log(params);
                 return new Promise(function(resolve, reject) {
                   wx.request({
                     url: url,
                     data: params,
                     method: method ? method : "GET",
                     success: res => {
                       resolve(res);
                     },
                     fail: res => {
                       reject(res);
                     }
                   });
                 });
               }
