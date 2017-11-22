import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

import RenderPatronGroupLastUpdated from '../lib/RenderPatronGroup/RenderPatronGroupLastUpdated';
import RenderPatronGroupNumberOfUsers from '../lib/RenderPatronGroup/RenderPatronGroupNumberOfUsers';

class PatronGroupsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      usersPerGroup: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      users: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      groups: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      usersLastUpdating: PropTypes.shape({
        query: PropTypes.string,
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      usersLastUpdating: PropTypes.shape({
        update: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    usersPerGroup: {
      type: 'okapi',
      records: 'users',
      path: 'users?limit=0&facets=patronGroup',
    },
    users: {
      type: 'okapi',
      records: 'users',
      path: 'users?query=(%{usersLastUpdating.query})',
      accumulate: 'true',
    },
    groups: {
      type: 'okapi',
      records: 'usergroups',
      path: 'groups',
    },
    usersLastUpdating: {},
  });

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    //this.connectedPatronGroupLastUpdated = props.stripes.connect(RenderPatronGroupLastUpdated);
    //this.connectedPatronGroupNumberOfUsers = props.stripes.connect(RenderPatronGroupNumberOfUsers);
  }

  componentWillReceiveProps(nextProps) {
    if (this.propsReadyToFetchUsers(nextProps)) {
      const ids = this.getLastUpdaterIds(nextProps.resources.groups.records);
      const query = this.craftQueryForLastUpdaters(ids);
      this.props.mutator.usersLastUpdating.update({ query });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getLastUpdaterIds(groups) {
    const ids = [];
    for (const group of groups) {
      if (group.metadata && !_.includes(ids, group.metadata.updatedByUserId)) {
        ids.push(group.metadata.updatedByUserId);
      }
    }
    return ids;
  }

  propsReadyToFetchUsers(nextProps) {
    return nextProps.resources.groups.hasLoaded && this.props.resources.usersLastUpdating.query === undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  craftQueryForLastUpdaters(ids) {
    let query = '';
    for (const id of ids) {
      if (query.length > 0) {
        query += ' or ';
      }
      query += `id=${id}`;
    }
    return query;
  }

  render() {
    const {groups, users, usersPerGroup} = this.props.resources;

    const groupInfoFormatter = {
      'last updated': (item) => <RenderPatronGroupLastUpdated item={item} gloss="last updated" users={users} groups={groups}/>,
      //'last updated': (item) => item.metadata ? item.metadata.updatedDate : '',
      
      '# of users': (item) => <RenderPatronGroupNumberOfUsers item={item} gloss="# of users" usersPerGroup={usersPerGroup} />,
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
