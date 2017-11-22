import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-flexbox-grid';

class RenderPatronGroupNumberOfUsers extends React.Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    gloss: PropTypes.string.isRequired,
    usersPerGroup: PropTypes.object,
  };

  getNumberOfPatrons() {
    let count = 0;
    if (this.ready()) {
      count = this.getFacetCount();
    }
    return count;
  }

  getFacetCount() {
    const facets = this.props.usersPerGroup.other.resultInfo.facets;
    let count = 0;
    for (const facet of facets[0].facetValues) {
      if (facet.value === this.props.item.id) {
        count = facet.count;
        break;
      }
    }
    return count;
  }

  ready() {
    // const numberOfUsers = this.props.additionalFields.numberOfUsers;
    // return numberOfUsers && numberOfUsers.inheritedProps.resources.usersPerGroup.hasLoaded && this.props.item.id;
    return this.props.usersPerGroup && this.props.usersPerGroup.hasLoaded && this.props.item.id;
  }

  render() {
    return (<Col key={this.props.gloss} xs>{this.getNumberOfPatrons()}</Col>);
  }

}

export default RenderPatronGroupNumberOfUsers;
