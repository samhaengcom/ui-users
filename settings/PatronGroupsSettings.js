import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

import { RenderPatronGroupLastUpdated, RenderPatronGroupNumberOfUsers } from '../lib/RenderPatronGroup';

class PatronGroupsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.connectedPatronGroupLastUpdated = props.stripes.connect(RenderPatronGroupLastUpdated);
    this.connectedPatronGroupNumberOfUsers = props.stripes.connect(RenderPatronGroupNumberOfUsers);
  }

  render() {
    const groupInfoFormatter = {
      'last updated': (item) => <this.connectedPatronGroupLastUpdated item={item} gloss="last updated" {...this.props} />,
      '# of users': (item) => <this.connectedPatronGroupNumberOfUsers item={item} gloss="# of users" {...this.props} />,
    }

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="groups"
        records="usergroups"
        label="Patron Groups"
        visibleFields={['group', 'desc', 'last updated', '# of users']}
        readOnlyFields={['last updated', '# of users']}
        itemTemplate={{ group: 'string', id: 'string', desc: 'string' }}
        nameKey="group"
        formatter={groupInfoFormatter}
      />
    );
  }
}

export default PatronGroupsSettings;
