import * as badge from "./modules/badge"
import * as button from "./modules/button"
import * as carousel from "./modules/carousel"
import * as cascader from "./modules/cascader"
import * as checkbox from "./modules/checkbox"
import * as countdown from "./modules/countdown"
import * as description from "./modules/description"
import * as dialog from "./modules/dialog"
import * as divider from "./modules/divider"
import * as drawer from "./modules/drawer"
import * as dropdown from "./modules/dropdown"
import * as ellipsis from "./modules/ellipsis"
import * as empty from "./modules/empty"
import * as fieldset from "./modules/fieldset"
import * as form from "./modules/form"
import * as icon from "./modules/icon"
import * as image from "./modules/image"
import * as input from "./modules/input"
import * as link from "./modules/link"
import * as loading from "./modules/loading"
import * as mask from "./modules/mask"
import * as menu from "./modules/menu"
import * as message from "./modules/message"
import * as modal from "./modules/modal"
import * as notification from "./modules/notification"
import * as pagination from "./modules/pagination"
import * as popconfirm from "./modules/popconfirm"
import * as popper from "./modules/popper"
import * as progress from "./modules/progress"
import * as quill from "./modules/quill"
import * as radio from "./modules/radio"
import * as scrollbar from "./modules/scrollbar"
import * as select from "./modules/select"
import * as steps from "./modules/steps"
import * as sticky from "./modules/sticky"
import { _switch } from "./modules/switch"
import * as table from "./modules/table"
import * as tabs from "./modules/tabs"
import * as tag from "./modules/tag"
import * as textarea from "./modules/textarea"
import * as timeline from "./modules/timeline"
import * as tooltip from "./modules/tooltip"
import * as tree from "./modules/tree"
import * as uploader from "./modules/uploader"
import uiMerge from "../utils/ui-merge"
import type { DeepPartial } from "../types/build"

let ui = {
  ...badge,
  ...button,
  ...carousel,
  ...cascader,
  ...checkbox,
  ...countdown,
  ...description,
  ...dialog,
  ...divider,
  ...drawer,
  ...dropdown,
  ...ellipsis,
  ...empty,
  ...fieldset,
  ...form,
  ...icon,
  ...image,
  ...input,
  ...link,
  ...loading,
  ...mask,
  ...menu,
  ...message,
  ...modal,
  ...notification,
  ...pagination,
  ...popconfirm,
  ...popper,
  ...progress,
  ...quill,
  ...radio,
  ...scrollbar,
  ...select,
  ...steps,
  ...sticky,
  switch: _switch,
  ...table,
  ...tabs,
  ...tag,
  ...textarea,
  ...timeline,
  ...tooltip,
  ...tree,
  ...uploader
}

export const updateUi = (
  newUi: DeepPartial<typeof ui>,
  strategy: "merge" | "replace" = "merge"
) => {
  ui = uiMerge(ui, newUi, strategy)
}

export const getUi = () => ui

export default ui
