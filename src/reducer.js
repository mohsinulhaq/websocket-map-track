import uuid from 'uuid/v4';
import faker from 'faker';

function reducer(state = [], action) {
  switch (action.type) {
    case 'ADD':
      return state.concat({
        id: uuid(),
        name: faker.name.findName(),
        isSelected: false,
        offline: false,
        origin: undefined,
        directions: undefined,
        destination: undefined,
        waypoints: [],
      });
    case 'UPDATE':
      return state.map(item => {
        if (item.id === action.payload.id) {
          item = {
            ...item,
            ...action.payload.data,
          };
        }
        return item;
      });
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload.id);
    default:
      return state;
  }
}

export default reducer;
