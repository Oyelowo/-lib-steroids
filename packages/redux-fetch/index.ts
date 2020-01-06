import createReducerFactory from './utils/createReducerFactory'
import createUseDeleteResourceHook from './utils/createUseDeleteResourceHook'
import createUseResourceHook from './utils/createUseResourceHook'
import { getApiActions } from './utils/shared'

export type ApiCallState = 'idle' | 'attempt' | 'success' | 'failure'

/** Utility function for handling reducers and actions related
 * to data fetching.
 * @param { ActionType } type - type of redux action
 * @returns { useResource, createReducer, useDeleteResource }
 * Example usage:
 * 1. First, you call the function with the action type name
  ```ts
   export const usersStoreApiHelper = reduxApiCallHelper('FETCH_USERS')
   ```

 * 2. This helper can then be used to create the reducer that handles
 * the request, success and failure states of the data:
  ```ts
  interface User {
    name: string
    id: string
    age: number
  }
    export const usersReducer = usersStoreApiHelper.createReducer<User[]>()
  ```
  * 3. useResouce method is the action hooks that makes the api call.
  *  methods available include get, post, put, delete and patch.
  * (if you don't specify a method, the default would be 'get' method)
  * This then returns a hook which can be used in a component for fetching the data
   ```ts
      import axios from 'axios'

      export const useResourceUsers = () =>{
        return usersStoreApiHelper.useResource({
          axiosInstance: axios, // This can also be an axios instance created
          method: 'get',
          url: '/users',
        })
      }
  ```

  * 4. This can then be used in a component like this

    ```tsx
      const UsersList: FC = () => {
        const getUsers = useResourceUsers()
        const { users } = useUsersStore()

        useEffect(()=>{
          getUsers()
        },  [])
        return (
          <section className={s.UsersList}>
            <h1>
              Users
            </h1>
            <ul>
              {users.map((user) => (
                <User key={user.id} user={user} />
              ))}
            </ul>
          </section>
        )
      }
  ```
*/

const reduxApiCallHelper = <Data, ErrorType, ActionType extends string>(type: ActionType) => {
  const actionType = getApiActions(type)

  return {
    useResource: createUseResourceHook(actionType),
    useDeleteResource: createUseDeleteResourceHook(actionType),
    createReducer: createReducerFactory<Data, ErrorType>(actionType),
  }
}

export default reduxApiCallHelper
