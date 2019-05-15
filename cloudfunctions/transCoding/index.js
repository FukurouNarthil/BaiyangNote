// 云函数入口文件
const cloud = require('wx-server-sdk')
const iconv = require('iconv-lite')
const encoding = require('encoding')
const chardet = require('chardet')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var buff = new Buffer(event.text, 'binary');
  var str = iconv.decode(buff, 'GBK');

  return {
    event,
    str
  }
}