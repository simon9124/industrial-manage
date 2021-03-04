const Koa = require("koa"); // 引入koa
const Router = require("koa-router"); // 引入koa-router
const exec = require("child_process").exec;
let reStartPro = "ipconfig"; // 这是一条重启服务的linux命令,也可以是执行其他功能的命令~

const app = new Koa(); // 创建koa应用
const router = new Router(); // 创建路由，支持传递参数

const iconv = require("iconv-lite"); // iconv进行转码
iconv.skipDecodeWarning = true;

const cors = require("koa-cors"); // 设置跨域
app.use(cors()); // 全部允许跨域

// 对exec进行一个简单的封装，返回的是一个Promise对象，便于处理。
function doShellCmd(cmd) {
  let str = cmd;
  let result = {};
  return new Promise(function(resolve, reject) {
    exec(str, { encoding: "binary" }, function(err, stdout, stderr) {
      if (err) {
        // console.log("err");
        result.errCode = 500;
        result.data = "操作失败！请重试";
        reject(result);
      } else {
        result.errCode = 200;
        result.data = {
          data: iconv.decode(stdout, "cp936"),
          success: "200",
          message: "成功"
        };
        resolve(result);
      }
    });
  });
}
// 加URL
router.get("/koa/action/OwnRestartServer", async (ctx, next) => {
  let result = await doShellCmd(reStartPro); // 调用exec
  // console.log("[restartServer] ", result);
  ctx.response.status = result.errCode;
  ctx.response.body = result.data;
});

app.use(router.routes());
app.listen(3000);
console.log("app started at port 3000...");
