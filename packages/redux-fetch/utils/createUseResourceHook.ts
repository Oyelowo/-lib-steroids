import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
} from 'axios'
import { useDispatch } from 'react-redux'
import { AnyAction, Dispatch } from 'redux'
import { ApiActions } from './shared'

interface AxiosConfigWithInstance extends AxiosRequestConfig {
  axiosInstance: AxiosStatic | AxiosInstance
}

/** Helper to handle api call. Handles request, success and failure cases */
const callApi = (
  dispatch: Dispatch<AnyAction>,
  apiActions: ApiActions,
  config: AxiosConfigWithInstance
) => async () => {
  dispatch({ type: apiActions.request })

  try {
    const resp: AxiosResponse = await config.axiosInstance({
      ...config,
    })

    dispatch({
      type: apiActions.success,
      payload: { data: resp.data },
    })
  } catch (e) {
    dispatch({ type: apiActions.failure })
  }
}

type CUR = (
  apiActions: ApiActions
) => (config: AxiosConfigWithInstance) => () => Promise<void>

/**
 * used for making API call. takes thesame options as axios.create (e.g: method, url, data etc)
 * See {@link https://github.com/axios/axios} for more information
 * @param { AxiosRequestConifg } config.
 * @returns a higher order function that returns another function which is a hook for calling an api.
 */
const createUseResourceHook: CUR = (apiActions) => (config) => {
  const dispatch = useDispatch()
  return callApi(dispatch, apiActions, config)
}

export default createUseResourceHook
