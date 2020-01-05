
import { useDispatch } from "react-redux";

// PossibleActions
export const getActionsTypes = type => ({
  request: `${type}_REQUEST`,
  success: `${type}_SUCCESS`,
  failure: `${type}_FAILURE`,
  deleteData: `${type}_DELETE`
});

const makeReducerFactory = apiCallActions => (initialState = oldState) => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case apiCallActions.request:
      return { ...state, apiCallState: "attempt" };

    case apiCallActions.success:
      return { ...state, apiCallState: "success", data: action.payload.data };

    case apiCallActions.failure:
      return { ...state, apiCallState: "failure", data: undefined };

    case apiCallActions.deleteData:
      return { ...state, apiCallState: "idle", data: undefined };

    default:
      return state;
  }
};

/** DATA FETCHER
 *
 */

const callApi = (axiosCall, dispatch, apiCallActions) => {
  return async () => {
    dispatch({ type: apiCallActions.request });
    try {
      const response = await axiosCall;
      dispatch({
        type: apiCallActions.success,
        payload: {
          data: response.data
        }
      });
    } catch (e) {
      dispatch({ type: apiCallActions.failure });
    }
  };
};

const makeUseResource = apiCallActions => axiosCall => {
  const dispatch = useDispatch();
  return callApi(axiosCall, dispatch, apiCallActions);
};

const makeUseDeleteResource = apiCallActions => () => {
  const dispatch = useDispatch();

  return () =>
    dispatch({
      type: apiCallActions.deleteData
    });
};

const reduxApiCallHelper = type => {
  const actionType = getActionsTypes(type);
  return {
    useResource: makeUseResource(actionType),
    useDeleteResource: makeUseDeleteResource(actionType),
    createReducer: makeReducerFactory(actionType)
  };
};

export default reduxApiCallHelper;
