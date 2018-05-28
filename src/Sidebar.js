import React from 'react';
import './Sidebar.css';

function Sidebar(props) {
  const { users, updateUser, addUser, removeUser } = props;

  return (
    <div className="sidebar">
      <div className="header">
        Track<span title="Mohsin Ul Haq">™</span>
      </div>
      <hr />
      <div className="container">
        {users.map(user => (
          <div key={user.id} className="row">
            <div title="User status" className={`status ${user.offline ? 'offline' : ''}`} />
            <div className="button-group">
              <button
                className={`btn user-button ${user.isSelected ? 'isSelected' : ''}`}
                onClick={() => updateUser(user.id, { isSelected: !user.isSelected })}
              >
                {user.name}
              </button>
              <button title="Remove this user" className="btn remove-user-button" onClick={() => removeUser(user.id)}>
                x
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn add-user-button" onClick={addUser}>
        Add user
      </button>
    </div>
  );
}

Sidebar.displayName = 'Sidebar';

export default Sidebar;
