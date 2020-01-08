import createReducerFactory from "./utils/createReducerFactory";
import createUseResetStateHook from "./utils/createUseResetHook";
import createUseResourceHook from "./utils/createUseResourceHook";
import { getApiActions } from "./utils/shared";

export type FetchState = "idle" | "attempt" | "success" | "failure";

/**
 *  Utility function for handling reducers and actions related
 * to data fetching.
 * @param { string } actionTypesBaseName - basename for redux actionTypes
 * @returns {object} { useResource, createReducer, useResetState }
 ** **Example usage**:
 * 1. First, you call the function with the action type name,
 * @type { Book[] } represents the data expected from the api,
 * @type { AxiosErrorResponseData } AxiosErrorResponseData is the Error info sent from the server e.g with res.status(401).send({message: 'unauthorized'})
 * so, in this case, AxiosErrorResponseData would be: `{message: string}`. This can then be accessed later via
 * axiosError object, that is: ```axiosErrorResponse.data``` (which is derived from the catch block error.response.data )
  ```ts
   import reduxios from 'reduxios'
   export const booksStoreApiHelper = reduxios<Book[], AxiosErrorResponseData>('FETCH_BOOKS')
   ```

 * 2. This helper can then be used to create the reducer that handles
 * the request, success and failure states of the data.
 * @param {  Book[] } initialData - initialData or default data
 * @returns { Reducer } the reducer for that data
  ```ts   
    export const booksReducer = booksStoreApiHelper.createReducer([])
  ```
  * 3.  Makes the api call.
     * @param {AxiosConfigWithInstance} axiosConfigWithInstance - all axios Configurations and also axiosInstance(can also be the defualt axios)
     *  methods available include get, post, put, delete and patch.
     * (if you don't specify a method, the default would be 'get' method)
     * @returns {Function} a hook which can be used in a component for fetching the data
     ```ts
      import axios from 'axios'

      export const useResourceBooks = () =>{
        return booksStoreApiHelper.useResource({
          axiosInstance: axios, // This can also be an axios instance created
          method: 'get',
          url: '/books',
        })
      }
  ```

  * 4. This can then be used in a component like this

    ```tsx
      const BooksList: FC = () => {
        const getBooks = useResourceBooks()
        const { data : books , fetchState, axiosErrorResponse } = useSelector((state: RootState)=> state.books)

        useEffect(()=>{
          getBooks()
        },  [])
        return (
          <section}>
            <h1>
              My Book List
            </h1>
            <ul>
              {books.map((book) => (
                <Book key={book.id} book={book} />
              ))}
            </ul>
          </section}>
        )
      }
  ```
*/

const reduxios = <
  ApiData,
  AxiosErrorResponseData = unknown,
  ActionType extends string = string
>(
  actionTypesBaseName: ActionType
) => {
  const actionTypes = getApiActions(actionTypesBaseName);

  return {
    /**
     *  Makes the api call.
     * @param {AxiosConfigWithInstance} axiosConfigWithInstance - all axios Configurations and also axiosInstance(can also be the defualt axios)
     *  methods available include get, post, put, delete and patch.
     * (if you don't specify a method, the default would be 'get' method)
     * @returns {Function} a hook which can be used in a component for fetching the data */
    useResource: createUseResourceHook(actionTypes),
    /**
     *This helper can then be used to create the reducer that handles
     * the request, success and failure states of the data.
     * @param { any } initialData -  initialData or the defaultData
     */
    createReducer: createReducerFactory<ApiData, AxiosErrorResponseData>(
      actionTypes
    ),
    useResetState: createUseResetStateHook(actionTypes)
  };
};

export default reduxios;
