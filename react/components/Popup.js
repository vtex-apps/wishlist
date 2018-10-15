import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { IconCaretRight } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import { Transition } from 'react-spring'

const OPEN_POPUP_CLASS = 'vtex-wishlist-popup-open'

/* Popup component */
class Popup extends Component {
  updateComponent() {
    if (this.props.isOpen) {
      document.body.classList.add(OPEN_POPUP_CLASS)
    } else {
      document.body.classList.remove(OPEN_POPUP_CLASS)
    }
  }

  componentDidMount() {
    this.updateComponent()
  }

  componentDidUpdate() {
    this.updateComponent()
  }

  componentWillUnmount() {
    document.body.classList.remove(OPEN_POPUP_CLASS)
  }

  renderPopup = styles => {
    const { onOutsideClick, intl } = this.props

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div
          className="vtex-minicart__Popup w-100 w-auto-ns h-100 fixed top-0 right-0 z-9999 bg-white shadow-2 flex flex-column"
          style={styles}
        >
          <div className="vtex-minicart__Popup-header pointer flex flex-row items-center pa5 h3 shadow-4 bg-white w-100 z-max">
            <div
              className="mid-gray pa4 flex items-center"
              onClick={onOutsideClick}
            >
              <IconCaretRight size={17} />
            </div>
          </div>
          {this.props.children}
        </div>
      </OutsideClickHandler>
    )
  }

  render() {
    const { isOpen } = this.props

    if (typeof document === 'undefined') {
      return null
    }

    return ReactDOM.createPortal(
      <Transition
        keys={isOpen ? ['children'] : []}
        from={{ transform: 'translateX(100%)' }}
        enter={{ transform: 'translateX(0%)' }}
        leave={{ transform: 'translateX(100%)' }}
      >
        {isOpen ? [this.renderPopup] : []}
      </Transition>,
      document.body
    )
  }
}

Popup.propTypes = {
  /* Internationalization */
  intl: intlShape.isRequired,
  /* Set the Popup visibility */
  isOpen: PropTypes.bool,
  /* Popup content */
  children: PropTypes.object.isRequired,
  /* Function to be called when click in the close Popup button or outside the Popup */
  onOutsideClick: PropTypes.func,
}

export default injectIntl(Popup)
