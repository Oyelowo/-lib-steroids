# `reduxios`

**Utility function for handling reducers and actions related to data fetching**

**_decreases redux data fetching code by about 80%_**

## Example Usage in 4 simple steps

1. **Generate the helper with the basename for action types**

```ts
export const booksStoreReduxios = reduxios<Book[], AxiosErrorResponseData>(
  "FETCH_BOOKS"
);
```

<br>

2.  **Create the Reducer, which will handle various Fetch states. 
      You can also pass in the default data as an argument**

```ts
export const booksReducer = booksStoreReduxios.createReducer();
```

<br>

3.  **Makes the action hook for Fetching your data or calling the API.**

```ts
import axios from "axios";

export const useResourceBooks = () => {
  return booksStoreReduxios.useResource({
    axiosInstance: axios, // This can also be an axios instance created
    method: "get",
    url: "/books"
  });
};
```

<br>

4. **Use the action hook and state in your component. No need to dispatch the action.**

```tsx
const BooksList: FC = () => {
  const getBooks = useResourceBooks();
  const { data, fetchState, axiosErrorResponse } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      <h1>My Book List</h1>
      <ul>
        {data.map(book => (
          <Book key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
};
```



<br>
<br>

## Want More Detailed Explanation?

1. First, you call the function with the action type name,

````ts
/*   
Book[] - represents the typeescripts data  Type definition expected from the api 

AxiosErrorResponseData(optional) -  is the Error info sent from the 
 server e.g with res.status(401).send({message:  'unauthorized'}). 
 so, in this case, AxiosErrorResponseData would be: `{message: 
 string}`. 
 This can then be accessed later via axiosError object, that is:
  ```axiosErrorResponse.data``` (which is derived from the 
  catch block error.response.data )

'FETCH_BOOKS' - basename for redux actionTypes. Various types are
 built from this. (i.e FETCH_BOOKS_REQUEST, FETCH_BOOKS_SUCCESS, 
 FETCH_BOOKS_FAILURE, FETCH_BOOKS_RESET_STATE )
 
Returns {object} { useResource, createReducer, useResetState }  
  */
export const booksStoreReduxios = reduxios<Book[], AxiosErrorResponseData>(
  "FETCH_BOOKS"
);

//where Book and AxiosErrorResponseData could be e.g:
interface Book {
  id: string,
  title: string,
  author: string
}

interface AxiosErrorResponseData {
  message: string
}
````

 <br>

2. This helper can then be used to create the reducer that handles the request, success and failure states of the data.

```ts
/*
create reducer also takes an argument(initialData). If not specified, it defaults to  undefined
@returns { Reducer } the reducer for that data
*/
export const booksReducer = booksStoreReduxios.createReducer();
```

 <br>

3.  Makes the api call.

```ts
/* useResource takes argument of all axios configurations and also axiosInstance(can also be the defualt axios).
    Returns Custom  react hook which can be used in a component for fetching the data
    */
import axios from "axios";

export const useResourceBooks = () => {
  return booksStoreReduxios.useResource({
    axiosInstance: axios, // This can also be an axios instance created
    method: "get",
    url: "/books"
  });
};
```

 <br>
 
4. This can then be used in a component like this

```tsx
const BooksList: FC = () => {
  const getBooks = useResourceBooks();
  const { data, fetchState, axiosErrorResponse } = useSelector(
    (state: RootState) => state.books
  );
  /* Where:
   fetchState:  "idle" | "attempt" | "success" | "failure"
   axiosErrorResponse: includes axios error information  and status from the server if 
   the api call fails data from the server
  */

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div>
      <h1>My Book List</h1>
      <ul>
        {data.map(book => (
          <Book key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
};
```
