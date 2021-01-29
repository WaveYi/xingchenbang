// pages/shipment/index.js
import {
  queryCouponSellStatistics
} from '../../../api/user.js'
import publicFun from '../../../utils/public.js'
import * as echarts from '../../../components/ec-canvas/echarts';
var Chart = null;
var dataList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_list: ["邀请成功","邀请中"],
    activeIndex: 0,
    dataList: [],
    ec: {
      lazyLoad: true // 延迟加载
    },
    lastMonth: [],
    lastArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(1); //获取数据
  },

  clickNav(e){
    this.setData({
      lastMonth: [],
      lastArr: [],
      dataList: [],
      activeIndex: e.currentTarget.dataset.index
    })
    if(e.currentTarget.dataset.index == 0){
      this.getData(1)
    }else{
      this.getData(0);
    }
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
  getData(is_accept){
    let data = {
      sellerId: wx.getStorageSync('userInfo').unionId,
      accept: is_accept
    }
    queryCouponSellStatistics(data).then((res)=>{
      if(res.code == 200){
        if(res.data[0] != null){
          let x_data = [];	
          for(let i in res.data){
            if(res.data[i].sellerNumber == null){
              res.data[i].sellerNumber = 0;
            }
            //销售量	
            x_data.push(res.data[i].sellerNumber)
          }
          this.data.dataList.push({
            name: '销售数量',
            type: 'line',
            smooth: true,
            data: x_data
          })
          
          let date = res.data;
          for(let j in date){
            this.data.lastMonth.push(date[j].date);
          }

          this.setData({
            dataList: this.data.dataList,
            lastMonth: this.data.lastMonth,
            lastArr: this.data.lastMonth
          })

          console.log(this.data.dataList)
        }
        setTimeout(()=>{
          this.init_echarts();
        },500)
      }
    })
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: 3
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption(){
    var option = {
      title: {
        text: '代理人收益报表',
        left: 'center'
      },
      // color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: ['A', 'B', 'C','D', 'E', 'F','G', 'H', 'I'],
      //   bottom: 0,
      //   left: 'center',
      //   z: 100
      // },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.data.lastArr,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: this.data.dataList
    };
    return option;
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})