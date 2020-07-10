// pages/partition/partition.js
var app_api=getApp().globalData.app_api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    letter:[
      'A','B','C','D','E','F','G','H','I','J',
      'K','L','M','N','O','P','Q','R','S','T',
      'U','V','W','X','Y','Z'
    ],                      //字母查询
    params:'',            //搜索条件
    countTime:1800,         //延迟搜索时间
    searchWaiting:false,    //是否等待搜索倒计时
    
    zm:'',                  //不为空则查首字母查询
    deptsData:'',
    page:1
  },
  /**
	 * 查数据
	 */
  getCustList: function() {
    var that=this;
    wx.request({
      url: app_api+'Index/index',
      method:'post',
      data:{likefun:this.data.params,zm:this.data.zm},
      success:function(e){
          //console.log('成功的回调结果');
          //console.log(e);
          wx.hideLoading();//关闭loading
          
          that.setData({deptsData:e.data.data,page:that.data.page+1});
      }
    })
    //that.setData({params:'',zm:''})
},




/**
 * 首字母查找
 */
btn:function(e){
    var r=e.currentTarget.dataset.btn;//获取按钮值
    var that=this;
    this.setData({zm:r});
    wx.showLoading({title: '加载中',});
    //请求
    that.getCustList();//获取图片信息
},
/**
 * 模糊查询
 */
bindKeywordInput:function(e){
  wx.showLoading({title: '加载中',});
  this.setData({
    countTime:1800,
    params:e.detail.value,
  })
  //是否处于搜索倒计时中
  if(!this.data.searchWaiting){
    this.search();
  }
},
	/**
	 * 搜索
	 * 延迟搜索
	 */
  search: function (e) {
    var that=this;
    this.setData({
      searchWaiting: true, //搜索延迟启动
      likefun:that.data.params,
    })
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          console.log('搜索倒计时: ' + that.data.countTime);
          this.setData({
            countTime: this.data.countTime - 1000
          })
          if (this.data.countTime <= 0) {
            console.log('开始搜索: ' + that.data.params);

            this.setData({
              countTime: 1800,
              searchWaiting: false,
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      that.getCustList();//获取图片信息
      clearInterval(setTimer)//清除计时器
    })

  },
  /**
   * 点击图片最大化 
   */
  clickImg:function(e){
    var r=e.currentTarget.dataset.url;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [r] // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    //console.log(that.data);
    wx.request({
      url: app_api+'Index/index',
      data:{p:that.data.page,likefun:this.data.params,zm:this.data.zm},
      method:'post',
      success:function(data){
        //console.log(data);
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})