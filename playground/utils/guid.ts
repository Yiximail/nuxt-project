export default (dash = false) => {
  let guid = ""
  for (let i = 1; i <= 32; i++) {
    guid += Math.floor(Math.random() * 16.0).toString(16)
    if (dash && [8, 12, 16, 20].includes(i)) guid += "-"
  }
  return guid
}
