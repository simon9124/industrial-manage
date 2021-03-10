const Koa = require("koa"); // 引入koa
const Router = require("koa-router"); // 引入koa-router
const child_process = require("child_process");

const app = new Koa(); // 创建koa应用
const router = new Router(); // 创建路由，支持传递参数

const iconv = require("iconv-lite"); // iconv进行转码
iconv.skipDecodeWarning = true;

const bodyParser = require("koa-bodyparser"); // 处理post请求
app.use(bodyParser()); // 配置post bodyparser的中间件

const cors = require("koa-cors"); // 设置跨域
app.use(cors()); // 全部允许跨域

// 对exec进行一个简单的封装，返回的是一个Promise对象，便于处理。
function doShellCmd(cmd) {
  let str = cmd;
  let result = {};
  return new Promise(function(resolve, reject) {
    child_process.exec(str, { encoding: "binary" }, function(
      err,
      stdout,
      stderr
    ) {
      // console.log(iconv.decode(stdout, "cp936"));
      if (err) {
        result.errCode = 200;
        result.data = {
          data: iconv.decode(stdout, "cp936"),
          success: "200",
          message: "失败"
        };
        if (result.data.data === "") {
          result.data.data = `’${
            str.split(" ")["0"]
          }’不是内部或外部命令，也不是可运行的程序或批处理文件`;
        }
        resolve(result);
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

// api
router.post("/koa/action/doShellCmd", async ctx => {
  // console.log(ctx.request.body.cmd);
  let result = await doShellCmd(ctx.request.body.cmd); // 调用exec
  ctx.response.status = result.errCode;
  ctx.response.body = result.data;
});

app.use(router.routes());
app.listen(3000);
console.log("app started at port 3000...");
