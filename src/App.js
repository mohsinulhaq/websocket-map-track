import React from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import GoogleMap from './GoogleMap';
import { addUser, removeUser, updateUser } from './actions';

function App(props) {
  const { users, updateUser, addUser, removeUser } = props;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        users={users}
        addUser={addUser}
        updateUser={updateUser}
        removeUser={removeUser}
      />
      {users.map(user => user.isSelected &&
        <GoogleMap
          key={user.id}
          user={user}
          updateUser={updateUser}
        />
      )}
    </div>
  );
}

export default connect(
  state => ({ users: state }),
  { addUser, updateUser, removeUser },
)(App);
