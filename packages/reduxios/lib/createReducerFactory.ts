import { AxiosError } from "axios";
import { AnyAction, Reducer } from "redux";
import { ApiCallState } from "./reduxios";
import { ApiActions } from "./shared";

type State<Data, ErrorType> = {
  fetchState: ApiCallState;
  data: Data | undefined;
  axiosError: AxiosError<ErrorType> | null;
};

export interface CustomReduxActions<TData, ErrorInfo> extends AnyAction {
  payload: {
    data: TData;
    axiosError: AxiosError<ErrorInfo>;
  };
}

type CRF = <Data, ErrorInfo>(
  apiActions: ApiActions
) => (
  initialState?: State<Data, ErrorInfo>
) => Reducer<
  State<Data, ErrorInfo>,
  CustomReduxActions<Data, ErrorInfo> | AnyAction
>;

const oldState: State<any, null> = {
  fetchState: "idle",
  data: undefined,
  axiosError: null
};

/** factory for creating function that creates reducer that hanles logic for data fetching */
const createReducerFactory: CRF = apiActions => (initialState = oldState) => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case apiActions.request:
      return { ...state, fetchState: "attempt", axiosError: null };

    case apiActions.success:
      return {
        ...state,
        fetchState: "success",
        data: action.payload.data,
        axiosError: null
      };

    case apiActions.failure:
      return {
        ...state,
        fetchState: "failure",
        axiosError: action.payload.axiosError
      };

    case apiActions.clearData:
      return {
        ...state,
        data: undefined,
        fetchState: "idle",
        axiosError: null
      };

    default:
      return state;
  }
};

export default createReducerFactory;
