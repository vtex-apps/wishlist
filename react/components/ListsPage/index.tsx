import React, { Component, ReactNode } from 'react'
import Footer from '../ListDetails/Footer'
import Header from './Header'

class ListsPage extends Component {
  public render(): ReactNode {
    return (
      <div>
        <div className="ph9">
          <Header />
        </div>
        <div className="fixed bottom-0 w-100">
        <Footer items={[]} />
        </div>
      </div>
    )
  }
}

export default ListsPage
