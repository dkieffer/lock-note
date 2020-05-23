import React from 'react';

/**
 * Component that alerts if you click outside of it
 */
class OutsideWatcher extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    // document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    // document.removeEventListener('click', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      console.log('You clicked outside of me!');
      this.props.function();
    }
  }

  render() {

    if (this.props.listen) {
        document.addEventListener('click', this.handleClickOutside);
    } else {
        document.removeEventListener('click', this.handleClickOutside);
    }

    return <div ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

// OutsideWatcher.propTypes = {
//   children: PropTypes.element.isRequired,
// };

export default OutsideWatcher