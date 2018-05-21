import React, { Component } from 'react';
import Sidebar from './Sidebar';
import GoogleMap from './GoogleMap';
import uuid from 'uuid/v4';
import faker from 'faker';

function getRandomUser() {
  return {
    id: uuid(),
    name: faker.name.findName(),
    isSelected: false,
  }
}

class App extends Component {
  state = {
    users: [{
      ...getRandomUser(),
      isSelected: true,
    }],
  };

  onUserSelect = userId => {
    this.setState(prevState => ({
      users: prevState.users.map(user => {
        user.isSelected = user.id === userId;
        return user;
      }),
    }));
  };

  onAddUser = () => {
    this.setState(prevState => ({
      users: prevState.users.concat(getRandomUser()),
    }));
  };

  onRemoveUser = userId => {
    this.setState(prevState => ({
      users: prevState.users.filter(user => user.id !== userId),
    }));
  };

  onChangeStatus = (userId, status) => {
    this.setState(prevState => ({
      users: prevState.users.map(user => {
        if (user.id === userId) {
          user.offline = status === 'offline';
        }
        return user;
      }),
    }));
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar
          users={this.state.users}
          onUserSelect={this.onUserSelect}
          onAddUser={this.onAddUser}
          onRemoveUser={this.onRemoveUser}
        />
        {this.state.users.map(user => (
          <GoogleMap key={user.id} id={user.id} onChangeStatus={this.onChangeStatus} isVisible={user.isSelected} />
        ))}
      </div>
    );
  }
}

export default App;
