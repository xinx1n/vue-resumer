const map = {
  202: "用户名已被占用",
  210: "用户名或密码错误",
  211: "用户名或密码错误",
  217: "用户名或密码错误",
  unknown: "请求失败，请稍后再试"
}
export default function({ code }) {
  return map[code] || map.unknown
}
