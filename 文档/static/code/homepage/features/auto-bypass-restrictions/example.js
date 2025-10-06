// 使用 WebSocket，就像在其他地方使用它一样，SCW 可以绕过 CoCo 对 WebSocket 的限制。
class MyWebSocket extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);
    console.log("MyWebSocket", url);
  }
}
const ws = new MyWebSocket("wss://socketcv.codemao.cn:9096/cloudstorage/?session_id=114514&authorization_type=1&stag=1&EIO=3&transport=websocket");
ws.addEventListener("close", () => {
  parent.location.reload();
});
export { MyWebSocket };