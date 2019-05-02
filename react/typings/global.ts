interface ToastInput {
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface CommertialOffer {
  AvailableQuantity: number
  Price: number
}

interface Seller {
  commertialOffer: CommertialOffer
}

interface Item {
  sellers: Seller[]
}

interface Product {
  items?: Item[]
  sku?: {}
  brand?: string
  detailUrl?: string
  imageUrl?: string
  listPrice?: {}
  name?: string
  price?: number
  quantity?: number
  seller?: {}
  skuId?: string
  variant?: {}
  linkText?: string
  productName?: string
}

interface ListItem {
  id?: string
  quantity?: number
  productId: string
  skuId: string
  product?: Product
}

interface List {
  id?: string
  name?: string
  isPublic?: boolean
  isEditable?: boolean
  owner?: string
  items?: ListItem[]
}

interface NavigateInput {
  to?: string
  page?: string
  params?: {
    listId?: string
  }
}

interface Runtime {
  navigate: (navigateInput: NavigateInput) => void
  route: {
    params: {
      listId: string
    }
  }
}

interface Option {
  title: string
  onClick: (params?: {}) => void
  disabled?: boolean
}

interface ResponseList {
  data: {
    list: List
    createList: List
    updateList: List
  }
  errors?: {}
}

interface ListItemWithProduct {
  itemId: string
  product: Product
}

interface DropDownItem {
  value?: string
  label?: string
}
