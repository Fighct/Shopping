<template>
  <div>
    <typeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 三级菜单的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keywords">
              {{ searchParams.keywords }}<i @click="removekeywords">×</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(':')[1] }}<i @click="removeTrade">×</i>
            </li>
            <!-- 售卖属性的面包屑 -->
            <li class="with-x" v-for="(p, i) in searchParams.props" :key="i">
              {{ p.split(':')[1] }}<i @click="removeProps(i)">×</i>
            </li>
          </ul>
        </div>

        <!--selector 自定义事件 - 事件类型="方法"-->
        <SearchSelector @showTradeInfo="toShow" @attrInfo="showAttr" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 哪个版块应该高亮 - 即展示类名active -->
                <!-- 当searchParams中的order属性的属性值包含 1 时，综合高亮 -->
                <li :class="{active: Comprehensive}" @click="changeOrder('1')">
                  <a>综合<span class="iconfont" :class="{'icon-up': isAsc, 'icon-down': isDesc}" v-show="Comprehensive" ></span></a>
                </li>
                <li :class="{active: Price}" @click="changeOrder('2')">
                  <a>价格<span class="iconfont" :class="{'icon-up': isAsc, 'icon-down': isDesc}" v-show="Price" ></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品信息 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="g in goods" :key="g.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 声明式导航 -->
                    <router-link :to="`/detail/${g.id}`">
                      <img v-lazy="g.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ g.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ g.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <!-- 给子组件传递“假数据”，分别代表数据总数、当前页码、每页所能容纳的最大数据数目、连续的页码数 -->
          <Pagination :total="total" :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :during="5" @getPageNo="getPage" />
          <!-- <Pagination2 :total="total" :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" @getPageNo="getPage" :during="5" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
// 计算属性 mapGetters
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 带给服务器的参数
      searchParams: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        categoryName: "",
        keywords: "",
        order: "1:desc",
        pageNo: 6,
        pageSize: 5,
        props: [],
        trademark: "",
      },
    };
  },
  // 在挂载完毕之前，将参数进行修改，并带给服务器
  beforeMount() {
    // this.searchParams.category3Id = this.$route.query.category3Id;
    // this.searchParams.categoryName = this.$route.query.categoryName;
    // ......
    // Object.assign - ES6新增，可合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  // 组件挂载完毕，只会执行一次
  mounted() {
    this.getSearchData();
  },
  computed: {
    // 此处是一个数组
    ...mapGetters(["goods"]),
    // 判断“综合版块”高亮还是“价格版块”高亮 - 返回结果为布尔值
    Comprehensive() {
      return this.searchParams.order.indexOf('1') != -1;
    },
    Price() {
      return this.searchParams.order.indexOf('2') != -1;
    },
    // 向上箭头
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1;
    },
    // 向下箭头
    isDesc() {
      return this.searchParams.order.indexOf('desc') != -1;
    },
    // 分页器
    ...mapState({
      total: state => state.Search.searchList.total
    })
  },
  // 将请求封装成一个函数，在需要时进行调用
  methods: {
    getSearchData() {
      // 通过派发actions来确定返回数据的格式
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    removeCategoryName() {
      // 点击 × 以后，将所有参数置空，即回到默认页面
      // 当属性值为undefined时，该参数不会被传回服务器
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
      // 在清空参数以后，重新发送请求以回到初始页面
      this.getSearchData();
      // 改变地址栏，通过“路由跳转”（此处跳到'search'中）来实现 - 当点击 × 以后，我们应该将相应的query参数删除，而保留下params参数（如果params参数存在）
      if (this.$route.params) {
        this.$router.push({
          name: "search",
          params: this.$route.params,
        });
      }
    },
    removeKeywords() {
      // 将关键字置空
      this.searchParams.keywords = undefined;
      // 再次发送请求
      this.getSearchData();
      // $emit - 告知兄弟组件Header清除 keywords
      this.$bus.$emit("clearKeywords");
      // 将相应的keywords参数（即params）清除 - 路由跳转
      if (this.$route.query) {
        this.$router.push({
          name: "search",
          query: this.$route.query,
        });
      }
    },
    // 自定义事件
    toShow(t) {
      this.searchParams.trademark = `${t.tmId}:${t.tmName}`;
      this.getSearchData();
    },
    // 移除品牌
    removeTrade() {
      this.searchParams.trademark = undefined;
      this.getSearchData();
    },
    // 展示属性信息
    showAttr(attr, attrValue) {
      // 所要传递的参数 - 确定参数格式
      let atr = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 如果 props 中没有该属性，则才能添加
      if(this.searchParams.props.indexOf(atr) === -1) {
        this.searchParams.props.push(atr);
      }
      this.getSearchData();
    },
    // 移除具体属性（内存...）
    removeProps(index) {
        this.searchParams.props.splice(index, 1);
        this.getSearchData();
    },
    // f是用户点击的版块，包括“综合”和“价格”
    changeOrder(f) {
      // 获取初始状态的版块号（1 或 2）
      let originFlag = this.searchParams.order.split(':')[0];
      // 获取初始状态的顺序（升序 或 降序）
      let originOrder = this.searchParams.order.split(':')[1];
      // 获取点击后的顺序（升序 或 降序）
      let newOrder = '';
      // 判断点击的是哪个版块
      if(f === originFlag) {
        // 说明用户点击与初始版块相同，此时应将顺序置反，并保持版块不变
        newOrder = `${originFlag}:${originOrder === 'desc' ? 'asc' : 'desc'}`
      } else {
        // 用户点击与初始版块不同，此时应改变版块，并将顺序置为降序
        newOrder = `${f}:${originOrder = 'desc'}`
      }
      // 将原searchParams中的order修改为新的order
      this.searchParams.order = newOrder;
      this.getSearchData(); 
    },
    // 分页器 - 改变页数
    getPage(pageNo) {
      // 让页码变为用户当前点击的页码（即进行页面跳转）
      this.searchParams.pageNo = pageNo;
      this.getSearchData();
    }
  },
  watch: {
    // 当$route中的数据发生变化时（url发生变化），就需要发出请求，即调用getSearchData
    // 由于此处$route是与searchData是同级数据，因此直接书写
    $route(n, old) {
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getSearchData();
      // 由于我们不清楚到底是第几级菜单，所以在请求发送之后，我们要将相应的id置空，防止影响下次的id
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>