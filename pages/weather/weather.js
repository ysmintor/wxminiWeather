// pages/weather/weater.js
var app = getApp()
var day = ["今天", "明天", "后天"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: day,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    var that = this
    that.getLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 获取经纬度方法 
   */
  getLocation: function() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + " lon:" + longitude);
        that.locationCorrect(latitude, longitude);
      }
    })
  },

  /**
   * 经纬度转换
   */
  locationCorrect: function(latitude, longitude) {
    var that = this
    var url = "https://api.map.baidu.com/geoconv/v1/"; //访问 web 端百度 API 经纬度转换方法
    //访问页面所需要提供的参数 
    var params = {
      from: 1,
      to: 5,
      coords: longitude + "," + latitude,
      ak: "ED8dd788e45b8d07a1a0af2b79706b0e" //百度网页端服务 AK
    }
    //调用微信访问 url 方法
    wx.request({
      url: url,
      data: params,
      success: function(res) {
        //console.log(res);
        var badulat = res.data.result[0].y;
        var badulon = res.data.result[0].x;
        that.getCity(badulat, badulon); //进入到经纬度转换城市方法
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 获取城市信息
   */
  getCity: function(latitude, longitude) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "MWlBFga2Mm2tcEpqZbbTKm6f67TgHs23",
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        that.setData({
          city: city,
          district: district,
          street: street,
        })
        var descCity = city.substring(0, city.length - 1);
        that.getWeahter(descCity);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 获取天气信息
   */
  getWeahter: function(city) {
    var that = this
    var url = "https://free-api.heweather.com/s6/weather"
    var url2 = "https://free-api.heweather.com/s6/air"
    var parameters = {
      location: city,
      key: "eaed3a52d24f402e97b86d4f51a37873"
    }
    wx.request({
      url: url,
      data: parameters,
      success: function(res) {
        var tmp = res.data.HeWeather6[0].now.tmp;
        var txt = res.data.HeWeather6[0].now.cond_txt;
        var code = res.data.HeWeather6[0].now.cond_code;
        var dir = res.data.HeWeather6[0].now.wind_dir;
        var sc = res.data.HeWeather6[0].now.wind_sc;
        var hum = res.data.HeWeather6[0].now.hum;
        var fl = res.data.HeWeather6[0].now.fl;
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;
        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          dir: dir,
          sc: sc,
          hum: hum,
          fl: fl,
          daily_forecast: daily_forecast
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.request({
      url: url2,
      data: parameters,
      success: function(res) {
        var qlty = res.data.HeWeather6[0].air_now_city.qlty;
        var pm25 = res.data.HeWeather6[0].air_now_city.pm25;
        // var air_forecast = res.data.HeWeather6[0].air_forecast;
        that.setData({
          qlty: qlty,

          pm25: pm25
          // air_forecast: air_forecast
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 分享功能
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/weather/weather",
      success: function() {
        wx.showToast({
          title: '分享成功',
          icon: "success",
          duration: 2000
        })
      }
    }
  }
})