<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 此处 categoryList 是计算属性 -->
      <!-- <h2>{{ categoryList }}</h2> -->
      <div @mouseenter="toDisplay" @mouseleave="leaving">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画：元素或组件中应有v-show或v-if，且应将待过渡内容使用transion标签包裹 -->
        <transition>
          <div class="sort" v-show="isShow">
            <!-- 此处的div是一、二、三级联动的父元素，toSearch方法是采用了事件委托 -->
            <div class="all-sort-list2" @click="toSearch">
              <!-- 一级 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ curCol: curIndex === index }"
                @mouseenter="entering(index)"
              >
                <h3>
                  <!-- 路由跳转：编程式导航 + 事件委派 -->
                  <!-- 通过添加自定义属性来区分点击的是a标签，并进行参数的传递 -->
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <div
                  class="item-list clearfix"
                  :style="{ display: curIndex === index ? 'block' : 'none' }"
                >
                  <!-- 二级 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categotyId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 三级 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// 引入节流
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      curIndex: -1,
      // 显示与隐藏该组件
      isShow: true,
    };
  },
  mounted() {
    if (this.$route.path !== "/home") {
      this.isShow = false;
    }
  },
  computed: {
    ...mapState({
      categoryList: (state) => {
        return state.Home.categoryList;
        // console.log(state);
      },
    }),
  },
  methods: {
    // entering(index) {
    //   this.curIndex = index;
    // },
    // 节流 - 此处应以键值对的形式书写
    entering: throttle(function (index) {
      this.curIndex = index;
    }, 50),
    // 路由跳转
    toSearch(e) {
      // 此处得到的是鼠标点击以后的元素信息(a或者div等等)
      let eleme = e.target;
      // 通过dataset方法来获取自定义属性及相应的值
      let { categoryname, category1id, category2id, category3id } =
        eleme.dataset;
      if (categoryname) {
        // 整理query参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 一、二、三级分类的a
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        if (this.$route.params) {
          // 如果params不为空，则将params一起加入参数中
          location.params = this.$route.params;
          // 整理参数
          location.query = query;
          //跳转
          this.$router.push(location);
        }
      }
    },
    // 鼠标移入时显示TypeNav
    toDisplay() {
      // if (this.$route.path === "/search") {
        this.isShow = true;
      // }
    },
    leaving() {
      this.curIndex = -1;
      // 鼠标移出时，search中的TypeNav隐藏
      if (this.$route.path == "/search") {
        this.isShow = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            // 默认情况下，二三级联动隐藏
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // 通过CSS显示
          // &:hover {
          //   .item-list {
          //     // 显示二三级联动
          //     display: block;
          //   }
          // }
        }
        .curCol {
          background-color: skyblue;
        }
      }
    }

    // 过渡动画
    // 进入
    .v-enter {
      height: 0;
    }
    .v-enter-to {
      height: 461px;
    }
    .v-enter-active {
      transition: all 0.7s linear;
    }
    // 离开
    .v-leave {
      height: 461px;
    }
    .v-leave-to {
      height: 0;
    }
    .v-leave-active {
      transition: all 0.3s linear;
    }
  }
}
</style>