<template>
  <div class="pagination">
    <!-- <i style="display: block">{{startAndEnd}}</i> -->
    <button :disabled="pageNo === 1" @click="$emit('getPageNo', pageNo - 1)">上一页</button>
    <button v-if="startAndEnd.start > 1" @click="$emit('getPageNo', 1)" :class="{active: pageNo === 1}">1</button>
    <button v-if="startAndEnd.start > 2" disabled>···</button>

    <!-- v-for也可以遍历数字 -->
    <button v-for="(p, i) in startAndEnd.end" :key="i" v-show=" p >= startAndEnd.start" @click="$emit('getPageNo', p)" :class="{active: pageNo === p}">{{p}}</button>

    <button v-if="startAndEnd.end < totalPage - 1" disabled>···</button>
    <button v-if="startAndEnd.end < totalPage" @click="$emit('getPageNo', totalPage)" :class="{active: pageNo === totalPage}">{{totalPage}}</button>
    <button :disabled="pageNo === totalPage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>
  
<script>
export default {
  name: "Pagination",
  // 接收父组件所传递的数据
  props: ['total', 'pageNo', 'pageSize', 'during'],
  computed: {
    // 总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 连续时分页器的起始与末尾数字
    startAndEnd() {
      // 解构所用到的数据
      const {pageNo, during, totalPage} = this
      // 分页器不能为0或负数 两数据的初始值
      let start = 1, end = 1
      // 分别计算start与end
      start = pageNo - parseInt(during / 2);
      end = pageNo + parseInt(during / 2);
        // console.log(start, end);
      // 异常现象
      // 异常一 当起始数字小于1时，置起始值为1，末尾值为连续页码数
      if(start <= 0) {
        start = 1,
        end = during
      }
      // 异常二 当末尾数字大于总页数时，将末尾值置为总页数的值，初始值为末尾值减去连续页码数再加1
      if(end > totalPage) {
        start = totalPage - during + 1,
        end = totalPage
        // console.log(start, end);
      }
      return {start, end}
    }
  }
};
</script>
  
<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>