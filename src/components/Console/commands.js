export const clear = {
  exec: state => {
    return Object.assign({}, state, { history: [] });
  },
};
