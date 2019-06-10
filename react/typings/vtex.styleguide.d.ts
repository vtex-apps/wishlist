declare module 'vtex.styleguide' {
  import { Component, ComponentType, ReactElement, ReactType } from 'react'

  export const Spinner: ComponentType<any>
  export const ActionMenu: ComponentType<any>
  export const ButtonWithIcon: ComponentType<any>
  export const Button: ComponentType<any>
  export const Input: ComponentType<any>
  export const Toggle: ComponentType<any>
  export const Checkbox: ComponentType<any>

  export const IconOptionsDots: ComponentType<any>
  export const IconCaretLeft: ComponentType<any>
  export const IconClose: ComponentType<any>
  export const IconPlusLines: ComponentType<any>
  export const IconDelete: ComponentType<any>
  export const IconVisibilityOff: ComponentType<any>
  export const IconVisibilityOn: ComponentType<any>

  export const withToast: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & ToastProps>
  ) => ComponentType<TOriginalProps>

  interface ToastProps {
    [key: string]: any
  }
}
