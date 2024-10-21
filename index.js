import * as fs from "fs"

const toCamel = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

const toUpperCamel = (str) => {
  const name = toCamel(str)
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const run = async () => {
  const components = fs.readdirSync("src/runtime/components")
  for (const dir of components) {
    if (["badge", "button", "carousel", "link"].includes(dir)) continue
    const files = fs.readdirSync(`src/runtime/components/${dir}`)
    for (const file of files) {
      if (!file.endsWith(".vue")) continue
      const name = file.replace(".vue", "")
      let data = fs.readFileSync(`src/runtime/components/${dir}/${file}`, "utf-8")
      const uiRegexp = /const _ui = (\{(?:.+?)(?:^\}))\n/ms
      const uiMatch = data.match(uiRegexp)
      const ui = uiMatch?.[1]
      if (ui) {
        // if (!fs.existsSync(`src/runtime/ui/modules/${dir}.ts`)) {
        //   fs.writeFileSync(`src/runtime/ui/modules/${dir}.ts`, `export const ${toCamel(name)} = ${ui}\n`)
        //   let indexText = fs.readFileSync(`src/runtime/ui/index.ts`, "utf-8")
        //   const mergeIndex = indexText.indexOf("import uiMerge")
        //   indexText = indexText.slice(0, mergeIndex) + `import * as ${dir} from "./modules/${dir}"\n` + indexText.slice(mergeIndex)
        //   const index = indexText.indexOf("\n}") + 1
        //   indexText = indexText.slice(0, index) + `  ...${dir},\n` + indexText.slice(index)
        //   fs.writeFileSync(`src/runtime/ui/index.ts`, indexText)
        // } else {
        //   fs.appendFileSync(`src/runtime/ui/modules/${dir}.ts`, `\nexport const ${toCamel(name)} = ${ui}\n`)
        // }
        // let check = fs.readFileSync(`src/runtime/ui/modules/${dir}.ts`, "utf-8")
        // if (check.includes("classMerge") && !check.includes("import classMerge")) {
        //   check = `import classMerge from "../../utils/class-merge"\n\n` + check
        //   fs.writeFileSync(`src/runtime/ui/modules/${dir}.ts`, check)
        // }
        data = data.replace(uiRegexp, "")
        data = data.replace(/const _ui = /, "")

        data = data.replace(/ui,\n?/, "")
        const index = data.indexOf("toRefs(props)") + "toRefs(props)".length
        if (index !== -1) {
          if (data.includes("Color")) {
            // data.splice(index, 0, `\n\nconst { ui } = useUi("${toCamel(name)}", props, { color })`)
            data = data.slice(0, index) + `\n\nconst { ui } = useUi("${toCamel(name)}", props, { color })` + data.slice(index)
          } else {
            // data.splice(index, 0, `\n\nconst { ui } = useUi("${toCamel(name)}", props)`)
            data = data.slice(0, index) + `\n\nconst { ui } = useUi("${toCamel(name)}", props)` + data.slice(index)
          }
        }
        const typesIndex = data.indexOf(`} from "../../types"`)
        if (typesIndex !== -1) {
          data = data.slice(0, typesIndex) + `,UI` + data.slice(typesIndex)
        }
        data = data.replace(/typeof _ui/, `UI["${toCamel(name)}"]`)

        const importIndex = data.indexOf("import classMerge from")
        if (importIndex !== -1) {
          data = data.slice(0, importIndex) + `import useUi from "../../composables/use-ui"\n` + data.slice(importIndex)
        }
      }
      fs.writeFileSync(`src/runtime/components/${dir}/${file}`, data)
    }
  }
}

run()
