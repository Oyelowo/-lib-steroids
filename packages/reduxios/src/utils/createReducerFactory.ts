import { AxiosResponse } from 'axios'
import { AnyAction, Reducer } from 'redux'
import { FetchState } from '..'
import { ApiActions } from './shared'

type State<Data, ErrorInfo> = {
  fetchState: FetchState
  data: Data | undefined
  axiosErrorResponse: AxiosResponse<ErrorInfo> | null
}

interface ReduxSuccessAction<TData> {
  type: string
  payload: {
    data: TData
  }
}
interface ReduxFailureAction<ErrorInfo> {
  type: string
  payload: {
    axiosErrorResponse: AxiosResponse<ErrorInfo>
  }
}

export type ReduxActions<TData, ErrorInfo> =
  | ReduxSuccessAction<TData>
  | ReduxFailureAction<ErrorInfo>
  | AnyAction

type CRF = <Data, ErrorInfo>(
  apiActions: ApiActions
) => (
  initialData?: Data
) => Reducer<State<Data, ErrorInfo>, ReduxActions<Data, ErrorInfo>>

const oldState: State<any, any> = {
  fetchState: 'idle',
  data: undefined,
  axiosErrorResponse: null,
}

/** factory for creating function that creates reducer that hanles logic for data fetching */
const createReducerFactory: CRF = (apiActions) => (initialData = undefined) => (
  state = { ...oldState, data: initialData },
  action
) => {
  switch (action.type) {
    case apiActions.request:
      return { ...state, fetchState: 'attempt', axiosErrorResponse: null }

    case apiActions.success:
      return {
        ...state,
        fetchState: 'success',
        data: action.payload.data,
        axiosErrorResponse: null,
      }

    case apiActions.failure:
      return {
        ...state,
        fetchState: 'failure',
        axiosErrorResponse: action.payload.axiosErrorResponse,
      }

    case apiActions.resetState:
      return {
        ...state,
        ...oldState,
        data: initialData,
      }

    default:
      return state
  }
}

export default createReducerFactory
