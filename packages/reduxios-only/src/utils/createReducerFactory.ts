import { AxiosResponse } from "axios";
import { AnyAction, Reducer } from "redux";
import { FetchState } from "..";
import { ApiActions } from "./shared";

type State<Data, ErrorInfo> = {
  fetchState: FetchState;
  data: Data;
  axiosErrorResponse: AxiosResponse<ErrorInfo> | null;
};

interface ReduxSuccessAction<TData> {
  type: string;
  payload: {
    data: TData;
  };
}
interface ReduxFailureAction<ErrorInfo> {
  type: string;
  payload: {
    axiosErrorResponse: AxiosResponse<ErrorInfo>;
  };
}

export type ReduxActions<TData, ErrorInfo> =
  | ReduxSuccessAction<TData>
  | ReduxFailureAction<ErrorInfo>
  | AnyAction;

type CRF = <Data, ErrorInfo>(
  apiActions: ApiActions
) => (
  initialData: Data
) => Reducer<State<Data, ErrorInfo>, ReduxActions<Data, ErrorInfo>>;

const getInitialState = <Data>(data: Data): State<Data, any> => ({
  fetchState: "idle",
  axiosErrorResponse: null,
  data
});

/** factory for creating function that creates reducer that hanles logic for data fetching */
const createReducerFactory: CRF = apiActions => initialData => (
  state = getInitialState(initialData),
  action
) => {
  switch (action.type) {
    case apiActions.request:
      return { ...state, fetchState: "attempt", axiosErrorResponse: null };

    case apiActions.success:
      return {
        ...state,
        fetchState: "success",
        data: action.payload.data,
        axiosErrorResponse: null
      };

    case apiActions.failure:
      return {
        ...state,
        data: initialData,
        fetchState: "failure",
        axiosErrorResponse: action.payload.axiosErrorResponse
      };

    case apiActions.resetState:
      return {
        ...state,
        ...getInitialState(initialData)
      };

    default:
      return state;
  }
};

export default createReducerFactory;
