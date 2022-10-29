<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked === 1"
              @change="toChangeState(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <!-- 我们需要向服务器发送 变化量 ，其中，+代表变化量为1，-代表变化量为-1，而用户手动输入的值是最终值，其相应的变化量为输入的值减去原来的值，负数代表减少，正数代表增加 -->
            <a class="mins" @click="handler('minus', -1, cart)">-</a>
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <!-- 小计 -->
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="toDelete(cart)">删除</a>
            <br />
            <a>移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="allChecked" />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked">删除选中的商品</a>
        <a>移到我的关注</a>
        <a>清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <!-- <a class="sum-btn">结算</a> -->
          <router-link class="sum-btn" to="/trade" name="hello">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 节流 - 解决用户点击频繁问题
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    // 由于购物车中的商品数量发生变化后，我们需要重新将“变化量”传递给服务器，需要频繁发送请求，因此，我们选择将“请求”封装为一个函数
    this.getData();
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 购物车的数据 - 单价、数量...
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    // 商品总价
    totalPrice() {
      let total = 0;
      this.cartInfoList.forEach((item) => {
        total += item.skuPrice * item.skuNum;
      });
      return total;
    },
    // 是否全选
    allChecked() {
      return this.cartInfoList.every(item => {
        item.isChecked === 1 ? true : false;
      });
    },
  },
  methods: {
    // 发请求获取购物车数据
    getData() {
      this.$store.dispatch("getShopCartInfo");
    },
    // 对商品数量进行更改 - 节流
    handler: throttle(async function (type, disNum, cart) {
      // type - 所做操作，用以区分加、减、用户手动输入；disNum - 要带给服务器的变化量（+和-），用户输入的最终量(输入框)；cart - 用于区分不同的商品
      // 我们需要判断所做的操作
      switch (type) {
        // 在进行减法操作时，需要对当前值进行判断，如果其为非负整数，才传给服务器
        case "add":
          disNum = 1;
          break;
        case "minus":
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          // 当用户输入的最终量含除整数以外的任意类型，则需要给服务器传递的变化量disNum为0
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            // 输入的值减去开始的值
            disNum = parseInt(disNum) - cart.skuNum;
          }
          break;
      }
      try {
        await this.$store.dispatch("toShopCart", {
          goodsId: cart.skuId,
          goodsNum: disNum,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 1500),
    // 删除商品
    async toDelete(cart) {
      try {
        await this.$store.dispatch("toDeleteCartGoods", cart.skuId);
        // 再次发送请求来获取新的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改商品状态
    async toChangeState(cart, event) {
      // 通过event.target.checked 获取到的是状态的布尔值，我们应将其转化为0和1
      try {
        let isChecked = event.target.checked ? 1 : 0;
        await this.$store.dispatch("changeGoodsState", {
          goodsId: cart.skuId,
          isChecked: isChecked,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 删除选中的全部商品 - 由于此处没有专门为该功能模块服务的接口，因此，我们可以借助删除单个产品的接口来实现该功能
    async deleteAllChecked() {
      try {
        await this.$store.dispatch("deleteAllChecked");
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>