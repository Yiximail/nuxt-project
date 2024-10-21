export default (hex: string) => {
  const str = hex.replace(/^#/, "")
  let match: RegExpMatchArray | null = null
  if (str.length === 3) {
    match = str.match(/^([a-f\d])([a-f\d])([a-f\d])$/i)
  } else if (str.length === 6) {
    match = str.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  }
  if (!match) return null
  return match
    .slice(1)
    .map((x) => parseInt(x, 16))
    .join(" ")
}
