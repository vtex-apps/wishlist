import React, { Component, ReactNode } from 'react'
import classNames from 'classnames'
import { compose, withApollo, WithApolloClient, graphql } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { withRuntimeContext, withSession } from 'vtex.render-runtime'
import { IconHeart } from 'vtex.store-icons'
import { ButtonWithIcon, withToast } from 'vtex.styleguide'
import { session } from 'vtex.store-resources/Queries'
import withContext from './withContext'

import { getProfile } from './utils/profile'
import AddToList from './components/AddToList/index'
import MyLists from './MyLists'

import { addProductToDefaultList } from './GraphqlClient'

interface AddProductBtnProps
  extends InjectedIntlProps,
    WithApolloClient<{}>,
    ContextProps {
  icon?: ReactNode
  large?: boolean
  product: ListItem
  showToast: (toastInput: ToastInput) => void
  runtime: Runtime
  session: Session
  waza?: string
}

interface AddProductBtnState {
  showContent?: boolean
  showLists?: boolean
  isLoading?: boolean
}

const ICON_SIZE_SMALL = 16
const ICON_SIZE_LARGE = 32
const messages = defineMessages({
  seeLists: {
    defaultMessage: '',
    id: 'store/wishlist-see-lists',
  },
  productAddedToList: {
    defaultMessage: '',
    id: 'store/wishlist-product-added-to-list',
  },
  addProductFail: {
    defaultMessage: '',
    id: 'store/wishlist-add-product-fail',
  },
  listNameDefault: {
    defaultMessage: '',
    id: 'store/wishlist-default-list-name',
  },
  login: {
    defaultMessage: '',
    id: 'store/wishlist-login',
  },
  notLogged: {
    defaultMessage: '',
    id: 'store/wishlist-not-logged',
  },
})

class AddProductBtn extends Component<AddProductBtnProps, AddProductBtnState> {
  public state: AddProductBtnState = {}

  public render() {
    const { product, large, icon } = this.props
    const { showContent, showLists, isLoading } = this.state

    const addProductBtnClasses = classNames('absolute z-5', {
      'ph6 pv7': large,
    })

    return (
      <div className={addProductBtnClasses}>
        <ButtonWithIcon
          variation="tertiary"
          onClick={this.handleAddProductClick}
          isLoading={isLoading}
          icon={
            icon || (
              <IconHeart
                color="c-muted-3"
                size={large ? ICON_SIZE_LARGE : ICON_SIZE_SMALL}
              />
            )
          }
        />
        {showContent && (
          <AddToList
            onAddToListsFail={this.handleAddToListsFail}
            onAddToListsSuccess={this.handleAddToListsSuccess}
            product={product}
            onClose={() => this.setState({ showContent: false })}
          />
        )}
        {showLists && (
          <MyLists
            {...this.props}
            onClose={() => this.setState({ showLists: false })}
          />
        )}
      </div>
    )
  }

  private handleAddProductSuccess = () => {
    const { enableMultipleLists } = this.props
    const {
      showToast,
      intl,
      runtime: { navigate },
    } = this.props
    this.setState({
      showContent: isMobile && enableMultipleLists,
      isLoading: false,
    })

    if (!isMobile || !enableMultipleLists) {
      showToast({
        action: {
          label: intl.formatMessage(messages.seeLists),
          onClick: () =>
            navigate({
              page: 'store.lists',
            }),
        },
        message: intl.formatMessage(messages.productAddedToList),
      })
    }
  }

  private handleAddProductFailed = (error: string): void => {
    const { intl } = this.props
    this.setState({ isLoading: false })
    console.error(error)
    this.props.showToast({
      message: intl.formatMessage(messages.addProductFail),
    })
  }

  private handleAddProductClick = (): void => {
    const { isLoading } = this.state
    if (isLoading) {
      return
    }
    const {
      client,
      product,
      intl,
      session,
      showToast,
      runtime: { navigate },
    } = this.props
    const profile = getProfile(session)
    if (profile) {
      this.setState({ isLoading: true })
      addProductToDefaultList(
        client,
        profile.email,
        intl.formatMessage(messages.listNameDefault),
        product
      )
        .then(this.handleAddProductSuccess)
        .catch(this.handleAddProductFailed)
    } else {
      showToast({
        action: {
          label: intl.formatMessage(messages.login),
          onClick: () => navigate({ page: 'store.login' }),
        },
        message: intl.formatMessage(messages.notLogged),
      })
    }
  }

  private handleAddToListsFail = (): void => {
    const { showToast, intl } = this.props
    showToast({
      message: intl.formatMessage(messages.addProductFail),
    })
  }

  private handleAddToListsSuccess = (): void => {
    const {
      showToast,
      intl,
      runtime: { navigate },
    } = this.props
    showToast({
      action: {
        label: intl.formatMessage(messages.seeLists),
        onClick: () => navigate({ page: 'store.lists' }),
      },
      message: intl.formatMessage(messages.productAddedToList),
    })
  }
}

const options = {
  name: 'session',
  options: () => ({ ssr: false }),
}

const EnhancedAddProductButton = withSession()(
  compose(
    withRuntimeContext,
    injectIntl,
    withToast,
    withApollo,
    graphql(session, options)
  )(AddProductBtn)
)

export default withContext(EnhancedAddProductButton)
