import type { InjectionKey, MaybeRef, Ref } from "vue"
import type { Size } from "../types"
import type {
  ScrollbarInjection,
  PopperInjection,
  ImagePreviewInjection,
  FieldsetInjection,
  SelectOptionsInjection,
  SelectSelectInjection,
  CascaderOptionsInjection,
  CascaderSelectInjection,
  FormInjection,
  FormItemInjection,
  TabsInjection,
  DropdownInjection,
  TableInjection,
  TableHeadInjection,
  TreeInjection,
  DescriptionInjection,
  MenuInjection,
  MenuItemInjection,
  StepsInjection,
  TimelineInjection
} from "../types/injections"

export const INHERITED_SIZE = Symbol(
  "继承的大小"
) as InjectionKey<MaybeRef<Size>>

export const INHERITED_DISABLED = Symbol(
  "继承的禁用 用于给组件传递是否禁用的状态"
) as InjectionKey<MaybeRef<boolean>>

export const SCROLLBAR_INJECTION = Symbol(
  "v-scrollbar 和 v-scrollbar-native 的注入"
) as InjectionKey<ScrollbarInjection>

export const POPPER_INJECTION = Symbol(
  "v-popper 的注入"
) as InjectionKey<PopperInjection>

export const IMAGE_PREVIEW_INJECTION = Symbol(
  "v-image-preview 的注入"
) as InjectionKey<ImagePreviewInjection>

export const FIELDSET_INJECTION = Symbol(
  "v-fieldset 的注入"
) as InjectionKey<FieldsetInjection>

export const SELECT_OPTIONS_INJECTION = Symbol(
  "v-select 和 v-select-multiple 选项相关的注入"
) as InjectionKey<SelectOptionsInjection>
export const SELECT_SELECT_INJECTION = Symbol(
  "v-select 和 v-select-multiple 选择项相关的注入"
) as InjectionKey<SelectSelectInjection>

export const CASCADER_OPTIONS_INJECTION = Symbol(
  "v-cascader 和 v-cascader-multiple 选项相关的注入"
) as InjectionKey<CascaderOptionsInjection>
export const CASCADER_SELECT_INJECTION = Symbol(
  "v-cascader 和 v-cascader-multiple 选择项相关的注入"
) as InjectionKey<CascaderSelectInjection>

export const FORM_INJECTION = Symbol(
  "v-form 的注入"
) as InjectionKey<FormInjection>
export const FORM_ITEM_INJECTION = Symbol(
  "v-form-item 的注入"
) as InjectionKey<FormItemInjection>

export const TABS_INJECTION = Symbol(
  "v-tabs 的注入"
) as InjectionKey<TabsInjection>

export const DROPDOWN_INJECTION = Symbol(
  "v-dropdown 的注入"
) as InjectionKey<DropdownInjection>

export const TABLE_INJECTION = Symbol(
  "v-table 的注入"
) as InjectionKey<TableInjection>
export const TABLE_HEAD_INJECTION = Symbol(
  "v-table-head 的注入"
) as InjectionKey<TableHeadInjection>
export const TREE_INJECTION = Symbol(
  "v-tree 的注入"
) as InjectionKey<TreeInjection>

export const DESCRIPTION_INJECTION = Symbol(
  "v-description 的注入"
) as InjectionKey<DescriptionInjection>

export const MENU_INJECTION = Symbol(
  "v-menu 的注入"
) as InjectionKey<MenuInjection>
export const MENU_ITEM_INJECTION = Symbol(
  "v-menu-item 的注入"
) as InjectionKey<MenuItemInjection>

export const STEPS_INJECTION = Symbol(
  "v-steps 的注入"
) as InjectionKey<StepsInjection>
export const TIMELINE_INJECTION = Symbol(
  "v-timeline 的注入"
) as InjectionKey<TimelineInjection>
