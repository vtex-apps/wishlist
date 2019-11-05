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
  fallbackToWindowLocation?: boolean
  to?: string
  page?: string
  params?: {
    listId?: string
  }
  query?: string
}

interface Query {
  listId?: string
}

interface Options {
  merge?: boolean
  replace?: boolean
}

interface Runtime {
  navigate: (navigateInput: NavigateInput) => void
  query: {
    listId?: string
  }
  setQuery: (query: Query, options: Options) => void
  goBack: () => void
}

interface Option {
  title: string
  onClick: (params?: {}) => void
  disabled?: boolean
}

interface ResponseList {
  data: {
    list?: List
    createList?: List
    updateList?: List
    listsByOwner?: List[]
  }
  errors?: {}
}

interface ListItemWithProduct {
  itemId: string
  product: Product
}

interface ActionMenuItem {
  label?: string
  onClick: () => void
}

interface Profile {
  email: string
}

interface GetSession {
  profile: Profile
}

interface Session {
  loading: boolean
  getSession: GetSession
}

interface Settings {
  enableMultipleLists: boolean
  defaultListName: string
}

interface SettingsProps {
  settings: NamedProps<{ appSettings: Settings }, {}>
}
