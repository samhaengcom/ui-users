import React from 'react';
import PropTypes from 'prop-types';
import Headline from '@folio/stripes-components/lib/Headline';

import css from './ProxyViewList.css';

const ProxyViewList = ({ records, name, label, itemComponent }) => {
  const ComponentToRender = itemComponent;
  const items = records.map((record, index) => (
    <ComponentToRender key={`item-${index}`} record={record} />
  ));

  return (
    <div className={css.list}>
      <Headline margin="small">{label}</Headline>
      <Headline size="small" bold={false} faded>{items.length ? items : <p>No {name} found</p>}</Headline>
    </div>
  );
};

ProxyViewList.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object),
  itemComponent: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ProxyViewList;
