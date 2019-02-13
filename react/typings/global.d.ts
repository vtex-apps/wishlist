declare global {
  interface Product {
    id?: string
    productId: string
    skuId: string
    quantity: number
  }

  interface List {
    name: string
    isPublic?: boolean
  }
}