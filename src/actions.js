const addUser = () => ({
  type: 'ADD',
});

const updateUser = (id, data) => ({
  type: 'UPDATE',
  payload: { id, data },
});

const removeUser = id => ({
  type: 'REMOVE',
  payload: { id },
});

export { addUser, updateUser, removeUser };
