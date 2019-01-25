import React, { Component, Fragment, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes, { bool } from "prop-types";
import { Spinner, IconVisibilityOff, IconVisibilityOn, IconCheck, IconClose, IconPlusLines } from "vtex.styleguide";
import { withApollo } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { WISHLIST_STORAKE_KEY } from "../";
import getList from "../graphql/queries/getList.gql";
import updateList from "../graphql/mutations/updateList.gql";
import createList from "../graphql/mutations/createList.gql";
import { update, contains, remove, append } from 'ramda';
import findIndex from "ramda/es/findIndex";
import SnackBar from './SnackBar'
import { WISHLIST_STORAKE_KEY } from '../'

interface AddToListProps {
  onAddList: () => void;
  onSuccess: () => void;
  onClose: () => void;
  onShowMenu: () => void;
  onFinishAdding: () => void;
  client?: ApolloClient<any>;
  skuId: string;
  productId: string;
  showMenu?: boolean;
}

interface LoadedList {
  id: string;
  name: string;
  loading: boolean;
  isPublic: boolean;
}

interface AddToListState {
  loading: boolean;
  disabled: boolean;
  loadedLists: LoadedList[];
  listIndexToAddProduct: Number[];
  close: boolean,
  showToast: boolean,
}

/**
 * Wishlist element to add a new list
 */
class AddToList extends Component<AddToListProps, AddToListState> {
  public state: AddToListState = {
    loading: true,
    disabled: false,
    loadedLists: [],
    listIndexToAddProduct: [],
    close: false,
    showToast: false,
  };

  public static proptypes = {
    onAddList: PropTypes.func.isRequired
  };

  public updateListOnState = async (index: number): Promise<void> => {
    console.log("on update lists")
    const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY);
    if (!listsRefs) {
      return this.setState({ loading: false });
    } else {
      console.log(listsRefs.split(','))
      const { client } = this.props;
      const lists = await Promise.all(
        listsRefs.split(",").map((id: string) => {
          return client && client
            .query({
              query: getList,
              variables: {
                id: id.replace("\"", "").replace("\"", "")
              }
            })
            .then(({ data: { list } }) => ({ ...list, id, loading: false }))
            .catch(err => console.log('Erro no fetch', err))
        })
      );
      client.query({
        query: getList,
        variables: {
          id: listsRefs.split(',')[0].replace("\"", "").replace("\"", "")
        }
      }).then(response => console.log('result', response))
      .catch(err => console.log('err', err))
      console.log(lists)
      this.setState({ loadedLists: lists, loading: false });
    }
  }

  public async componentDidMount() {
    const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY);
    if (!listsRefs) {
      return this.setState({ loading: false });
    } else {
      const { client } = this.props;
      const lists = await Promise.all(
        listsRefs.split(",").map((id: string) => {
          return client && client
            .query({
              query: getList,
              variables: {
                id: id.replace("\"", "").replace("\"", "")
              }
            })
            .then(({ data: { list } }) => ({ ...list, id, loading: false }))
            .catch(err => console.log('Erro no fetch', err))
        })
      );
      console.log(lists)
      this.setState({ loadedLists: lists, loading: false });
    }
  }

  public addProductToGeneralList = async (): Promise<void> => {
    const { client, productId, skuId, onFinishAdding } = this.props
    console.log('In add to general list')
    if (!localStorage.getItem(WISHLIST_STORAKE_KEY)) {
      console.log("No list")
      client.mutate({
        mutation: createList,
        variables: {
          name: "Lista Geral de Favoritos",
          isPublic: false,
          items: [{ productId, skuId, quantity: 1 }]
        }
      }).then(response => {
        console.log(response)
        onFinishAdding(response.data.createList.id)
      }).catch(err => {
        console.log('Something went wrong')
      })
    } else {
      this.handleAddToSingleList(0)
    }
    this.updateListOnState()
    this.setState({ loading: false, showToast: true })
  }

  public setListLoading = (listIndex: number, value: boolean, list?: any): void => {
    const { loadedLists } = this.state;
    let refreshedLists = [...loadedLists];
    if (list) refreshedLists = update(listIndex, list, loadedLists)
    if (refreshedLists[listIndex]) refreshedLists[listIndex].loading = value;
    this.setState({ loadedLists: refreshedLists, disabled: value });
  };

  public handleApply = async (): Promise<void> => {
    const { client, skuId, productId, onSuccess } = this.props;
    const { listIndexToAddProduct } = this.state

    if (listIndexToAddProduct && listIndexToAddProduct.length) {
      const promises = listIndexToAddProduct.map(listIndex => {
        const list = this.state.loadedLists[listIndex];
        this.setListLoading(listIndex, true);
        return client.mutate({
          mutation: updateList,
          variables: {
            id: list.id,
            list: this.getListInputForAddedItem(list, skuId, productId)
          }
        }).then(response => this.setListLoading(listIndex, false, response.data.updateList))
      })
      Promise.all(promises).then(response => {
        onSuccess();
      }).catch(err => {
        console.log('Error: could not add product to list', err)
      })
    }
  }

  public handleAddToSingleList = async (listIndex: Number): Promise<void> => {
    const { client, skuId, productId, onSuccess } = this.props;
    const { loadedLists } = this.state
    console.log(loadedLists)
    const list = loadedLists[listIndex];
    return client.mutate({
      mutation: updateList,
      variables: {
        id: list.id,
        list: this.getListInputForAddedItem(list, skuId, productId)
      }
    }).then(response => this.setListLoading(listIndex, false, response.data.updateList))
  }

  public addItemToList = async (listIndex: number): Promise<void> => {
    const { listIndexToAddProduct } = this.state
    const index = findIndex(item => item === listIndex, listIndexToAddProduct)
    if (index !== -1) {
      this.setState({ listIndexToAddProduct: remove(index, index + 1, listIndexToAddProduct) })
    } else {
      this.setState({ listIndexToAddProduct: append(listIndex, listIndexToAddProduct) })
    }
  };

  private getListInputForAddedItem = (
    { id, loading, items, ...list }: any,
    skuId: string,
    productId: string,
  ): any => {
    const currentItems = items.map(
      ({ id, productId, skuId, quantity }) => ({ itemId: id, productId, skuId, quantity })
    );
    console.log('currentItems', currentItems)
    console.log(append({ skuId, productId, quantity: 1 }, currentItems))
    console.log(currentItems)

    return {
      ...list,
      items: append({ skuId, productId, quantity: 1 }, currentItems)
    };
  };

  public renderItems = (): ReactNode => {
    const { loadedLists: lists, disabled, listIndexToAddProduct } = this.state;
    if (!lists || !lists.length) return null;
    return lists.map(
      (item, i): ReactNode => {
        if (item) {
          const { loading, name, isPublic } = item
          return <Fragment key={i} >
            <div
              className="flex flex-row justify-between w-100 pv4 ph2 pt2 bb b--light-gray c-muted-2"
              onClick={() => this.addItemToList(i)}
            >
              <div className="w-10 pt2">
                {isPublic ? <IconVisibilityOn size={15} /> : <IconVisibilityOff size={15} />}
              </div>
              <div className="w-80 tl ttu mt2">{name}</div>
              <div className={`w-10 pt2 ${!disabled && "pointer"}`}>
                {loading && <Spinner color="currentColor" size={15} />}
                {!loading && (contains(i, listIndexToAddProduct) || i === 0) && (
                  <div className="c-action-primary">
                    <IconCheck size={15} color="currentColor" />
                  </div>
                )}
              </div>
            </div>
          </Fragment >
        }
        return null
      }
    );
  };

  public render(): ReactNode {
    const { onAddList, onClose, showMenu, onShowMenu } = this.props;
    const { loading, loadedLists, listIndexToAddProduct, close, showToast } = this.state;

    if (close && !showMenu) return null

    if (!showMenu) {
      if (loading) return null
      if (!showToast) this.addProductToGeneralList()
      if (!showToast) return null
      setTimeout(() => this.setState({ close: true }), 2000)
      return <SnackBar
        text="Produto adicionado à lista"
        action={onShowMenu}
        actionLabel="Ver listas"
      />
    }

    return (
      <Fragment>
        <div className="w-100 bb dark-gray b--light-gray bg-white pv5 ph2 relative f4">
          <div className="pointer absolute nt1 ml3" onClick={onClose}>
            <IconClose size={22} />
          </div>
          <FormattedMessage id="wishlist-add-to-list" />
          <div className="pointer absolute top-0 right-0 ma4 pt2" onClick={onAddList}>
            <IconPlusLines size={20} />
          </div>
        </div>
        {loading && (
          <span className="pv5 dib c-muted-1">
            <Spinner color="currentColor" size={20} />
          </span>
        )}
        {!loading && !loadedLists.length && (
          <Fragment>
            <div className="w-100 c-muted-1 f5 pv5">
              <FormattedMessage id="wishlist-no-lists" />
            </div>
          </Fragment>
        )}
        {!loading && !!loadedLists.length && (
          <Fragment>{this.renderItems()}</Fragment>
        )}
        {/* <div
          className="w-100 bg-action-secondary pointer f4 pa4 c-action-primary"
          onClick={onAddList}
        >
          <FormattedMessage id="wishlist-new-button" />
        </div> */}
        <div
          className={`w-100 ${listIndexToAddProduct.length ? 'bg-action-primary c-muted-5' : 'bg-light-gray c-muted-2'} pointer f4 pa4`}
          onClick={this.handleApply}
        >
          <FormattedMessage id="wishlist-apply" />
        </div>
      </Fragment>
    );
  }
}

export default withApollo<AddToListProps, {}>(AddToList);
