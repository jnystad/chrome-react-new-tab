import React from 'react';
import PropTypes from 'prop-types';
import './Error.css';

const Error = ({ msg }) => <div className='error'><h1>Oops!</h1><p>{msg}</p></div>

Error.propTypes = {
  msg: PropTypes.string.isRequired
};

export default Error;
