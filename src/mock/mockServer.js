// mockjs模块 - 模拟随机数据，拦截AJAX请求
import Mock from 'mockjs'
// 虚拟的数据 - webpack中自动识别 .json文件和图片，因此，不需要对外暴露也能访问
import banner from './banner.json'
import floor from './floor.json'
// 开始mock数据 - 参1：请求地址，参2：请求数据
Mock.mock('/mock/banner', {code: 200, data: banner})
Mock.mock('/mock/floor', {code: 200, data: floor})