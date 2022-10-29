<template>
  <div class="pagination">
    <button :disabled="pageNo === 1" @click="prevPage(pageNo)">上一页</button>
    <button @click="firstPage(pageNo)" v-if="startAndEnd.start > 1">1</button>
    <button disabled v-if="startAndEnd.start > 2">...</button>
    <button
      v-for="(p, index) in totalPage"
      :key="index"
      @click="nowPage(p)"
      v-show="p >= startAndEnd.start"
      :class="{ active: pageNo === p }"
    >
      {{ p }}
    </button>
    <button disabled v-if="startAndEnd.end < totalPage - 1">...</button>
    <button @click="lastPage(pageNo)" v-if="startAndEnd.end < totalPage - 1">
      {{ totalPage }}
    </button>
    <button :disabled="pageNo === totalPage" @click="nextPage(pageNo)">
      下一页
    </button>
    <button style="margin-left: 30px" disabled>共{{ total }}条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination2",
  props: ["total", "pageNo", "pageSize", "during"],
  computed: {
    // 总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 起始与结束数字
    startAndEnd() {
      const { totalPage, pageNo, during } = this;
      let start = 1,
        end = 1;

      start = pageNo - parseInt(during / 2);
      end = pageNo + parseInt(during / 2);
      // 如果起始页码小于0，则将起始值置为1，结束值置为连续页码数
      if (start <= 0) {
        (start = 1), (end = during);
      }
      // 如果结束页码超出总页数，则将起始值置为
      if (end > totalPage) {
        start = totalPage - during + 1;
        end = totalPage;
      }
      return { start, end };
    },
  },
  methods: {
    // 上一页
    prevPage(pageNo) {
      this.$emit("getPageNo", pageNo - 1);
    },
    // 第一页
    firstPage(pageNo) {
      this.$emit("getPageNo", 1);
    },
    // 当前页
    nowPage(p) {
      this.$emit("getPageNo", p);
    },
    // 最后一页
    lastPage(pageNo) {
      this.$emit("getPageNo", this.totalPage);
    },
    // 下一页
    nextPage(pageNo) {
      this.$emit("getPageNo", pageNo + 1);
    },
  },
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

    // 当前页背景颜色
    &.active {
      cursor: not-allowed;
      background-color: skyblue;
      color: #fff;
    }
  }
}
</style>