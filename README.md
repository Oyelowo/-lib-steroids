# `reduxios`



***Utility function for handling reducers and actions related  to data fetching***

## Example Usage 
 * 1. First, you call the function with the action type name,

  ```ts
  /*   Book[] - represents the typeescripts data  Type definition expected from the api,

       AxiosErrorResponseData(optional) -  is the Error info sent from the server e.g with res.status(401).send({message: 'unauthorized'}). so, in this case, AxiosErrorResponseData would be: `{message: string}`. This can then be accessed later via axiosError object, that is: ```axiosErrorResponse.data``` (which is derived from the catch block error.response.data )

       'FETCH_BOOKS' - basename for redux actionTypes. Various types areee built from this. (i.e FETCH_BOOKS_REQUEST, FETCH_BOOKS_SUCCESS, FETCH_BOOKS_FAILURE, FETCH_BOOKS_RESET_STATE )
   
       Returns {object} { useResource, createReducer, useResetState }  
    */
   export const booksStoreApiHelper = reduxios<Book[], AxiosErrorResponseData>('FETCH_BOOKS')
   ```
 
 <br>

 
  * 2. This helper can then be used to create the reducer that handles the request, success and failure states of the data.

  ```ts
/*
  create reducer also takes an argument(initialData). If not specified, it defaults to  undefined
  @returns { Reducer } the reducer for that data
  */
    export const booksReducer = booksStoreApiHelper.createReducer()
  ```

 <br>

  
* 3.  Makes the api call.
```ts
    /* useResource takes argument of all axios configurations and also axiosInstance(can also be the defualt axios).
    Returns Custom  react hook which can be used in a component for fetching the data
    */
    import axios from 'axios'

    export const useResourceBooks = () =>{
    return booksStoreApiHelper.useResource({
        axiosInstance: axios, // This can also be an axios instance created
        method: 'get',
        url: '/books',
    })
    }
  ```

 <br>
 
 * 4. This can then be used in a component like this

```tsx
      const BooksList: FC = () => {
        const getBooks = useResourceBooks()
        const { data, fetchState, axiosErrorResponse } = useSelector((state: RootState)=> state.books)

        useEffect(()=>{
          getBooks()
        },  [])
        return (
          <div>
            <h1>
              My Book List
            </h1>
            <ul>
              {data.map((book) => (
                <Book key={book.id} book={book} />
              ))}
            </ul>
          </div>
        )
      }
  ```

