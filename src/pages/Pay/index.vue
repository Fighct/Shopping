<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info"
            >订单提交成功，请您及时付款，以便尽快为您发货~~</span
          >
        </h4>
        <div class="paymark">
          <span class="fl"
            >请您在提交订单<em class="orange time">4小时</em
            >之内完成支付，超时订单会自动取消。订单号：<em>{{
              orderId
            }}</em></span
          >
          <span class="fr"
            ><em class="lead">应付金额：</em
            ><em class="orange money">￥{{ payInfo.totalFee }}</em></span
          >
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>
            尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。
          </li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>
          支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）
        </h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg" /></li>
            <li><img src="./images/pay3.jpg" /></li>
          </ul>
        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg" /></li>
              <li><img src="./images/pay11.jpg" /></li>
              <li><img src="./images/pay12.jpg" /></li>
              <li><img src="./images/pay13.jpg" /></li>
              <li><img src="./images/pay14.jpg" /></li>
              <li><img src="./images/pay15.jpg" /></li>
              <li><img src="./images/pay16.jpg" /></li>
              <li><img src="./images/pay17.jpg" /></li>
              <li><img src="./images/pay18.jpg" /></li>
              <li><img src="./images/pay19.jpg" /></li>
              <li><img src="./images/pay20.jpg" /></li>
              <li><img src="./images/pay21.jpg" /></li>
              <li><img src="./images/pay22.jpg" /></li>
            </ul>
          </div>
        </div>
        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="showQRCode">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  name: "Pay",
  data() {
    return {
      // 定义一个空对象来接收返回值
      payInfo: {},
      // 需要后台返回支付的状态
      timer: null,
      // 支付状态
      code: 205
    };
  },
  computed: {
    // 订单号
    orderId() {
      return this.$route.query.orderId;
    },
  },
  mounted() {
    // 我们本应该在mounted中直接发送请求来获取，但由于请求的返回结果是一个Promise对象，需要使用await和async，但不推荐在生命周期函数中书写await和async
    this.getPayInfo();
  },
  methods: {
    // 获取订单信息
    async getPayInfo() {
      let res = await this.$API.reqPayInfo(this.orderId);
      if (res.code === 200) {
        this.payInfo = res.data;
      } else {
        alert("订单信息获取失败");
      }
    },
    // 展示支付二维码
    async showQRCode() {
      // 通过QRCode.toDataUrl('地址')生成二维码
      let QRC = await QRCode.toDataURL(this.payInfo.codeUrl);
      this.$alert(`<img src=${QRC} />`, "微信扫码支付", {
        // 是否可以识别HTML标签
        dangerouslyUseHTMLString: true,
        // 内容居中
        center: true,
        // 弹框标题
        // title: '微信扫码支付',
        // 右上角是否有 ×
        // showClose: false,
        // 显示取消按钮
        showCancelButton: true,
        // 取消框的内容
        cancelButtonText: "未支付",
        // 确认框的内容
        confirmButtonText: "已支付",
        // 在点击取消或者确认按钮以后，不对弹出框进行处理
        beforeClose: (action, instance, done) => {
          // action: 取消|确认按钮，instance：组件实例，done：关闭
          // 点击按钮以后进行判断
          // 取消按钮
          if(action === 'cancel') {
            // 一、清除定时器
            clearInterval(this.timer);
            this.timer = null;
            // 二、关闭弹出层
            done();
            // 三、提示用户“支付失败”
            alert('支付失败，请重新支付');
          } else {
            console.log(this.code);
            // 确认按钮 - 判断用户是否确实已支付
            if(this.code === 205) {
              // 一、清除定时器
              clearInterval(this.timer);
              this.timer = null;
              // 二、关闭弹出层
              done();
              // 路由跳转
              this.$router.push('/paySuccess');
            } else {
              alert('您还未支付成功，请继续支付');
              clearInterval(this.timer);
              this.timer = null;
              done();
            }
          }
        }
      });
      // 如果定时器不存在，则开启一个定时器
      if (!this.timer) {
        this.timer = setInterval(async () => {
          // 获取支付状态
          let payStatus = await this.$API.reqPayStatus(this.orderId);
          if(payStatus.code === 200) {
            // 1、关闭定时器
            clearInterval(this.timer);
            this.timer = null;
            // 2、保存支付状态
            this.code = payStatus.code;
            // 3、隐藏弹出层
            this.$msgbox.close();
            // 跳转路由
            this.$router.push('/paySuccess');
            console.log(payStatus, this.code);
          }
        }, 500);
      }
    },
  },
  // 组件内守卫 - 普通函数（类似于 钩子）beforeRouteEnter beforeRouteUpdate beforeRouteLeave
  beforeRouteEnter (to, from, next) {
    if(from.path == '/trade') {
      next();
    } else {
      next(false);
    }
  }
};
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>