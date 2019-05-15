# VTEX Wishlist app

## Description

The Wishlist is a native app that any VTEX store can use. This app is responsible for managing the customer's lists of products.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [0.x]  | **Current Release** |   2019-04-03    |                       |             |         2.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app, you need to add it in your `dependencies` in the `manifest.json` file.

```json
  dependencies: {
    "vtex.wishList": "0.x"
  }
```

Then, if you want to add the _Add to List_ button in your app, you just need to add the `add-to-list-btn` block into our app theme. You also can add a menu item with a link to redirect to the lists page. To do that, you should use the [Menu Builder](/) by including list item block, as the example bellow.

```
"unstable--menu-item#lists": {
    "props": {
      "id": "unstable--menu-item-lists",
      "type": "custom",
      "iconId": null,
      "highlight": false,
      "itemProps": {
        "type": "internal",
        "href": "store/lists",
        "noFollow": true,
        "tagTitle": "lists",
        "text": "My Lists"
      }
    }
  },
```


In order to use this app, you should follow the steps bellow.

#### 1. Create Master Data's Entities:

The lists' information are submitted to Master Data on two entities. One entity with the acronym `WL` to store list's basic informations and another, acronym `LP`, to store the lists' items. Bellow we have the configuration that these entetities should follow.

**Acronym name:** `WL`
| Field  | Type | Configuration | Description    |
| --------- | -------------- | ---- | ------------- |
| name      |  `Varchar 50` | Public to read and public to write | List's name    |
| owner     |  `Varchar 50` |  Allow null, public to read, public to write, public to filter and searchable | The e-mail of the list's owner |
| isPublic  |  `Boolean` |  Allow null, public to read and public to write | Flag to indicate the list visibility |
| isEditable|  `Boolean` | Allow null, public to read and public to write | Flag to indicate if the list's basic information |
| items     |  `Text` | Allow null, public to read and public to write  | Set of the DocumentId of the items added to the list |

**Acronym name:** `LP`

| Field | Type | Configuration | Description |
| ----- | ---- | ------------- | ----------- |
| productId | `Varchar 50`     | Public to read and public to write | Id of the product |
| skuId		| `Varchar 50`     | Public to read and public to write | SKU id of the product |
| quantity  | `Integer`        |  Public to read and public to write | Quantity of the product |

#### 2. Install the WishList app in your store:

Use this command to install this app: `vtex install vtex.wishlist`.

After that, Wishlist's _Add to List_ button will be displayed on `ProductSummary` and `ProductDetails`.

### Blocks API


This app has an interface that describes what rules must be implemented by a block when you want to use the WishList app.

```json
{
  "addon-summary-btn.add-to-list": {
    "component": "AddProductBtn",
    "required": ["lists", "product-summary"]
  },
  "addon-details-btn.add-to-list": {
    "component": "AddProductBtn",
    "required": ["lists", "product-summary"]
  },
  "add-to-list-btn": {
    "component": "AddProductBtn",
    "required": ["lists", "product-summary"]
  },
  "lists": {
    "component": "ListsPage",
    "required": ["product-summary"]
  },
  "store.lists": {
    "component": "ContainerWrapper",
    "required": [
      "lists"
    ],
    "before": [
      "header.full"
    ],
    "after": [
      "footer"
    ]
  },
  "footer": {
     "component": "Footer"
  }
}

```

#### Configuration

`AddProductBtn`

| Prop name               | Type      | Description                                                       | Default Value |
| ----------------------- | --------- | ----------------------------------------------------------------- | ------------- |
| `product`                 | `Product`  | Informations about the product that will be added to lists | `undefined`         |
| `large`                  | `Boolean`  | Flag that indicates if the should be large or not  | false         |
| `icon`     | `ReactChild` | The icon that should appear in the _Add to List_ button  | Heart Icon         |

`Product`

| Prop name               | Type      | Description                                                       | Default Value |
| ----------------------- | --------- | ----------------------------------------------------------------- | ------------- |
| `productId`                 | `String`  | Id of the product | `undefined`         |
| `skuId`                  | `String`  | SKU id of the product  | `undefined`         |
| `quantity`     | `Number` | Quantity of the product  | `undefined`         |


### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.wishList.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 1rem;
}
```

#### CSS namespaces

| Class name                 | Description                          | Component Source                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listPageItemsContainer`                | List page's container of the products                | [ListsPage/Content](/react/components/ListsPage/Content.tsx)                                                                                                                                                                                        |
| `listPage`                | List page's main container                | [ListsPage/Content](/react/components/ListsPage/Content.tsx)                                                                                                                                                                                        |
| `applyButton`                | Container of the button to confirm selected lists to add a product in the mobile mode           | [AddToList/Footer](/react/components/AddToList/Footer.tsx)                                                                                                                                                                                        |
| `contentContainer`                | Container of the `AddToList`'s content           | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `popover`                | Container of the `Popover` component           | [Popover](/react/components/Popover.tsx)                                                                                                                                                                                        |
| `formViewDialog`                | Dialog content of the FormView component in the desktop mode           | [FormView](/react/components/Form/FormView.tsx)                                                                                                                                                                                        |
| `summaryContainer`                | Container of the `ProductSummary` in the list item details           | [ListDetails/ItemDetails](/react/components/ListDetails/ItemDetails.tsx)                                                                                                                                                                                        |
| `summaryContainerLarge`                | Container of the `ProductSummary` in the list item details in desktop mode          | [ListDetails/ItemDetails](/react/components/ListDetails/ItemDetails.tsx)                                                                                                                                                                                        |
| `addToListContent`                | Main container of the `AddToList` component          | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `addToListListsToSwitch`                | Container of the lists to be selected in the `AddToList` component          | [AddToList/Content](/react/components/AddToList/Content.tsx)                                                                                                                                                                                        |
| `createList`                | Container of the `CreateList`          | [CreateList](/react/components/Form/CreateList.tsx)                                                                                                                                                                                        |
| `createListButtonContainer`                | Container of the button to create a new list          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicLabel`                | Label for show the privacy message in the `ListForm`          | [ListForm](react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicHint`                | Label for show the privacy hint in the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `isPublicContainer`                | Container of the privacy information in the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                        |
| `nameInputContainer`                | Container of the list's name input          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                       |
| `form`                | Main container of the `ListForm`          | [ListForm](/react/components/Form/ListForm.tsx)                                                                                                                                                                                      |
| `updateList`                | Main container of the update list form          | [UpdateList](/react/components/Form/UpdateList.tsx)                                                                                                                                                                                        |
| `listEmptyContainer`                | Container of the empty list message in in the list details          | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `listEmptyLabel`                | Container of the empty message label  when a list does not have products added to it         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `goToAddProductsButtonContainer`                | Container of the button that redirect to the `Galery`         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `listDetailsContent`                | Main container of the list details         | [ListDetails/Content](/react/components/ListDetails/Content.tsx)                                                                                                                                                                                        |
| `buySelectedItemsBtnContainer`                | Container of the `BuyButton` that add to the cart the selected products of a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `totalPriceLabel`                | Label of the quantity of products in a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `pricesContainer`                | Label of the total price of the selected items from a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `quantityOfSelectedItemsLabel`                | Label for the quantity of selected items in a list         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                        |
| `ListDetailsFooter`                | Container of the list details' footer         | [ListDetails/Footer](/react/components/ListDetails/Footer.tsx)                                                                                                                                                                                      |


## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/wishlist/issues). Also feel free to [open issues](https://github.com/vtex-apps/wishlist/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

:construction: :construction:  Not implemented yet :construction: :construction: 

