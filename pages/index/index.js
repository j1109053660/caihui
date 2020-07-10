//index.js
//获取应用实例
const app = getApp()
var app_api=getApp().globalData.app_api;

Page({
  data: {
    deptsData:[],
    page:1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getCustList();
  },
  //查所有图片-按热度排序
  getCustList: function() {
    var that=this;
    wx.showLoading({
              title: '加载中',
            });
    wx.request({
      url: app_api+'Index/index',
      //method:'post',
      //data:{ss:that.data.params},
      
      success:function(data){
          var arr=data.data;
          //关闭loading
          wx.hideLoading();
          //console.log(data);
          if(data.data.code==1){
            that.setData({deptsData:data.data.data,page:that.data.page+1});
          }else{
            wx.showToast({
              title: '未查询到数据',
              tcon:'loading'
            })
          }
      }
    })
},
/* 推荐图片的点击事件 */
clickImg:function(e){
  var r=e.currentTarget.dataset.url;
  wx.previewImage({
    current: '', // 当前显示图片的http链接
    urls: [r] // 需要预览的图片http链接列表
  })
},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    // console.log(that.data);
    wx.request({
      url: app_api+'Index/index',
      data:{p:that.data.page},
      method:'post',
      success:function(data){
       if(data.data.code==1){
         that.setData({deptsData:that.data.deptsData.concat(data.data.data),page:that.data.page+1});
       }else{
         wx.showToast({
           title: '已经到底了qwq',
           tcon:'loading'
         })
       }
      }
    })
  }


})
