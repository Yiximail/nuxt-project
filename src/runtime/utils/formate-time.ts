export default (
  /** 时间值  单位是毫秒 */
  value: string | number | undefined | null,
  /** 格式 YY/Y 年份 MM/M 月份 dd/d 日 hh/h 小时 mm/m 分钟 ss/s 秒 SSS/SS/S 毫秒 */
  format = "m:ss"
) => {
  if (value === undefined || value === null || value === "") return
  let time = parseInt(String(value))
  if (isNaN(time) || time < 0) return
  let str = format
  if (str.includes("Y")) {
    const year = Math.floor(time / 31536000000)
    str = str.replace(/Y{2,}/, year.toString().padStart(2, "0"))
    str = str.replace(/Y/, year.toString())
    time -= year * 31536000000
  }
  if (str.includes("M")) {
    const month = Math.floor(time / 2592000000)
    str = str.replace(/M{2,}/, month.toString().padStart(2, "0"))
    str = str.replace(/M/, month.toString())
    time -= month * 2592000000
  }
  if (str.includes("d")) {
    const day = Math.floor(time / 86400000)
    str = str.replace(/d{2,}/, day.toString().padStart(2, "0"))
    str = str.replace(/d/, day.toString())
    time -= day * 86400000
  }
  const hours = Math.floor(time / 3600).toString()
  const minutes = Math.floor((time % 3600) / 60).toString()
  const seconds = Math.floor(time % 60).toString()
  str = str.replace(/h{2,}/, hours.padStart(2, "0"))
  str = str.replace(/h/, hours)
  str = str.replace(/m{2,}/, minutes.padStart(2, "0"))
  str = str.replace(/m/, minutes)
  str = str.replace(/s{2,}/, seconds.padStart(2, "0"))
  str = str.replace(/s/, seconds)
  return str
}
