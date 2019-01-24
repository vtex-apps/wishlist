import React, { Component, Fragment, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Spinner, IconVisibilityOff, IconVisibilityOn, IconCheck, IconClose } from "vtex.styleguide";
import { withApollo } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { WISHLIST_STORAKE_KEY } from "../";
import getList from "../graphql/queries/getList.gql";
import updateList from "../graphql/mutations/updateList.gql";
import { update, contains, remove, append } from 'ramda';
import findIndex from "ramda/es/findIndex";

interface AddToListProps {
  onAddList: () => void;
  onSuccess: () => void;
  onClose: () => void;
  client?: ApolloClient<any>;
  skuId: string;
  productId: string;
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
  };

  public static proptypes = {
    onAddList: PropTypes.func.isRequired
  };

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
      this.setState({ loadedLists: lists, loading: false });
    }
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
    return {
      ...list,
      items: [...currentItems, { skuId, productId, quantity: 1 }]
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
                {!loading && contains(i, listIndexToAddProduct) && (
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
    const { onAddList, onClose } = this.props;
    const { loading, loadedLists, listIndexToAddProduct } = this.state;

    return (
      <Fragment>
        <div className="w-100 bb dark-gray b--light-gray bg-white pv5 ph2 relative f4">
          <div className="pointer absolute nt1 ml3" onClick={onClose}>
            <IconClose size={22} />
          </div>
          <FormattedMessage id="wishlist-add-to-list" />
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
        <div
          className="w-100 bg-action-secondary pointer f4 pa4 c-action-primary"
          onClick={onAddList}
        >
          <FormattedMessage id="wishlist-new-button" />
        </div>
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
