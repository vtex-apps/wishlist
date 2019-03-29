
interface Product {
  id?: string
  productId: string
  skuId: string
  quantity: number
}

interface ListItem {
  id?: string
  quantity?: number
  productId: string
  skuId: string
}

interface List {
  id?: string
  name?: string
  isPublic?: boolean
  owner?: string
  items?: ListItem[]
}

interface Option {
  title: string
  onClick: (params?: any) => void
}

