// 基础链接
const domainUrl = "https://nvzhu.zealcdn.cn/public/index.php/api";

// 
const STATUS = 200;

// 获取token
const getToken = `${domainUrl}/user/gettoken`

// 保存用户信息
const saveUserInfo = `${domainUrl}/user/saveuserinfo`;

// 获取用户信息
const getUserInfo = `${domainUrl}/user/getuserinfo`;

// 文章列表
const getArticleList = `${domainUrl}/article/articlelist`;

// 文章详情
const getArticleDetail = `${domainUrl}/article/articledesc`;

// 文章点赞
const likeArticle = `${domainUrl}/article/likearticle`

// 评论列表
const commentList = `${domainUrl}/comment/commentlist`;

// 添加评论
const addComment = `${domainUrl}/comment/createcomment`;

// 发表跟评
const followComment = `${domainUrl}/followcomment/createfollowcomment`;

// 评论点赞
const likeComment = `${domainUrl}/comment/likecomment`;

// 跟评列表
const followWommentList = `${domainUrl}/followcomment/followcommentlist`;

// 反馈消息
const feedBackMsg = `${domainUrl}/sysmessage/createsysmessage`;

// 系统消息列表
const systemMsgList = `${domainUrl}/sysmessage/sysmessagelist`;

// 修改系统消息阅读状态
const systemMsgStatus = `${domainUrl}/sysmessage/changesysmessagestatus`;

// 删除系统消息
const deleteSystemMsg = `${domainUrl}/sysmessage/deletesysmessage`;

// 历史搜索
const HistorySearch = `${domainUrl}/search/historysearch`;

// 热门搜索
const HotSearch = `${domainUrl}/search/hotsearch`;

// 获取搜索关键词
const searchWorld = `${domainUrl}/article/articlelistsearch`;

// 删除搜索历史
const clearSearchHistory = `${domainUrl}/search/deletehistorysearch`;

// 增加文章分享次数
const addArticleShareTime = `${domainUrl}/article/addsharetimes`;

// 点赞或评论列表
const userCommentList = `${domainUrl}/user/usercommentlist`;

// 获取七牛Token
const getQiNiuToken = `${domainUrl}/user/uploadtoken`;

// 消息详情
const systemMsgDetail = `${domainUrl}/sysmessage/sysmsgdesc`;

// 跟评点赞
const likefollowcomment = `${domainUrl}/followcomment/likefollowcomment`;

// 获取文章二维码
const getQrcode = `${domainUrl}/user/qrcode`;

// 获取关注列表
const followingList = `${domainUrl}/attention/attentionlist`

// 取消关注
const delattention = `${domainUrl}/attention/delattention`

// 粉丝列表
const followerlist = `${domainUrl}/attention/followerlist`

// 判断我是否关注ta
const isattention = `${domainUrl}/attention/isattention`

// 添加关注
const createattention = `${domainUrl}/attention/createattention`

export default {
  STATUS,
  domainUrl,
  getToken,
  saveUserInfo,
  getUserInfo,
  getArticleList,
  getArticleDetail,
  commentList,
  addComment,
  followComment,
  likeComment,
  followWommentList,
  feedBackMsg,
  systemMsgList,
  systemMsgStatus,
  deleteSystemMsg,
  HistorySearch,
  HotSearch,
  searchWorld,
  clearSearchHistory,
  likeArticle,
  addArticleShareTime,
  userCommentList,
  getQiNiuToken,
  systemMsgDetail,
  likefollowcomment,
  getQrcode,
  followingList,
  delattention,
  followerlist,
  isattention,
  createattention
};
