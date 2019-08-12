import React, { ComponentType } from 'react'

export const withContext = <TOriginalProps extends ContextProps>(
  WrappedComponent: ComponentType<TOriginalProps>
): ComponentType<TOriginalProps> => {
  const ExtendedComponent = (props: TOriginalProps) => (
    <WrappedComponent {...props} />
  )
  ExtendedComponent.getSchema = () => ({
    title: 'admin/editor.wishlist.title',
    type: 'object',
    properties: {
      enableMultipleLists: {
        title: 'admin/editor.wishlist.enable-multiple-lists.title',
        type: 'boolean',
        default: false,
      },
    },
  })
  return ExtendedComponent
}

export default withContext
