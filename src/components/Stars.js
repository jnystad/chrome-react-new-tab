import React from 'react';
import PropTypes from 'prop-types';
import './Stars.css';

const Stars = ({ count }) => <span className='stars'>{count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>;

Stars.propTypes = {
  count: PropTypes.number.isRequired
}

export default Stars;
