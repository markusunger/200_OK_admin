// reducer function for RouteDetails when a RouteDetailPath or RouteDetailMethod component triggers
// updates with either a changed path, a changed method response or the disabling of a response
// method, also supports re-initialization for new route prop in RouteDetails
const stateReducer = (state, action) => {
  // deep clone the state object to be able to safely mutate it
  const { data } = state;
  const newState = Object.assign({}, state);
  newState.data = Object.assign({}, data);

  const { op, newData, type } = action;

  switch (op) {
    case 'UPDATE_PATH':
      newState.path = newData;
      break;
    case 'UPDATE_METHOD':
      try {
        const newDataJson = JSON.parse(newData);
        newState.data[type] = newDataJson;
      } catch (e) {
        // do not update response data with a string if it
        // is not parseable into proper JS object notation
      }
      break;
    case 'DISABLE_METHOD':
      newState.data[type] = undefined;
      break;
    case 'UPDATE_ALL_METHODS':
      newState.path = newData.path;
      newState.data = newData.data;
      break;
    default:
      throw new Error('Reducer operation not valid.');
  }

  return newState;
};

// initial state for stateReducer
const initialStateReducer = (path, data) => ({ path, data });

// reducer function for RouteDetails to update validity state of all response method data
// from a RouteDetailMethod component
const validJsonReducer = (state, action) => {
  const { type, value } = action;
  return {
    ...state,
    ...{ [type]: value },
  };
};

// safely (?) assume that all initial method responses from route prop are valid
const initialValidJsonReducer = () => ({
  GET: true,
  POST: true,
  PUT: true,
  DELETE: true,
});

export {
  stateReducer, initialStateReducer, validJsonReducer, initialValidJsonReducer,
};
