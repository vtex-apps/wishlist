import React, { Component, ReactNode } from 'react'
import { Dropdown } from 'vtex.styleguide'

class ListSelector extends Component {
  public render(): ReactNode {
    return (
      <div>
        {/* <span>Coisas de casa</span> */}
        <Dropdown
        variation="inline"
        // size="large"
        options={[
          { value: 'chagall', label: 'Chagall' },
          { value: 'dali', label: 'Dali' },
        ]}
        value="dali"
        />
      </div>
    )
  }
}

export default ListSelector