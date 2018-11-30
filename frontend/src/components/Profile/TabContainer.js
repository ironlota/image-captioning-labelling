import { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

class TabContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
  }
}

export default TabContainer;
