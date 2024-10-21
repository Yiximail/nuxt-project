export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> | undefined }

export type ClassNameValue =
  | string
  | (string | undefined)[]
  | Record<string, unknown>

export type IconComponent =
  | string
  | {
    class?: string
    /**
     * 图标名称，来自：https://icon-sets.iconify.design/
     * @example "mdi:check-circle"
     */
    name?: string
    svg?: string
    src?: string
  }
