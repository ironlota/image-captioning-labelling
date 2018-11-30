import cookie from 'cookie';

export default (key, value, opts = {}) => {
  document.cookie = cookie.serialize(key, value, opts);
};
