export default (
  /** 时间值 */
  value: string | number | Date | undefined | null,
  /** 格式  YYYY/YY 年份 MM/M 月份 dd/d 日 hh/h 小时 mm/m 分钟 ss/s 秒 SSS/SS/S 毫秒 */
  format = "YYYY-MM-dd hh:mm:ss"
) => {
  if (value === undefined || value === null || value === "") return
  try {
    let val = value
    if (typeof val === "string") {
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
        val = val.replace(/-/g, "/")
      }
    }
    const time = new Date(val)
    if (isNaN(time.getTime())) return
    let str = format
    const year = String(time.getFullYear())
    const month = String(time.getMonth() + 1)
    const date = String(time.getDate())
    const hours = String(time.getHours())
    const minutes = String(time.getMinutes())
    const seconds = String(time.getSeconds())
    const milliseconds = String(time.getMilliseconds()).replace(
      /(?=\b\d\b)/g,
      "0"
    )
    str = str.replace(/Y{4,}/, year)
    str = str.replace(/Y{2,}/, year.slice(2, 4))
    str = str.replace(/M{2,}/, month.padStart(2, "0"))
    str = str.replace(/M/, month)
    str = str.replace(/d{2,}/, date.padStart(2, "0"))
    str = str.replace(/d/, date)
    str = str.replace(/h{2,}/, hours.padStart(2, "0"))
    str = str.replace(/h/, hours)
    str = str.replace(/m{2,}/, minutes.padStart(2, "0"))
    str = str.replace(/m/, minutes)
    str = str.replace(/s{2,}/, seconds.padStart(2, "0"))
    str = str.replace(/s/, seconds)
    str = str.replace(/S{3,}/, milliseconds)
    str = str.replace(/S{2,}/, milliseconds.slice(0, 2))
    str = str.replace(/S/, milliseconds.slice(0, 1))
    return str
  } catch (error) {
    console.error("utcDateTime Error:", error)
  }
}
