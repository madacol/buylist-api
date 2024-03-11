This is an API that provides actions/tools for an AI to manage shopping lists stored in a database.

It allows anyone to create, retrieve, update, and delete buy lists and their items.

The API is built with

- **Node.js** and **Express** for the server
- **PostgreSQL** for the database

---

It provides the following actions:

1. **Retrieving Buy Lists**

    - **Endpoint**: /buyLists
    - **Method**: GET
    - **Summary**: This action allows you to retrieve a list of all buy lists available in the DB. It responds with an array of buy lists, each containing at least the name of the list.

2. **Retrieving a Specific Buy List**

    - **Endpoint**: /buyLists/{name}
    - **Method**: GET
    - **Summary**: This action retrieves a specific buy list identified by its name. The API returns the details of the buy list, including the items within it. If the buy list does not exist, it responds with a 404 status code indicating that the buy list was not found.

3. **Creating a New Buy List**

    - **Endpoint**: /buyLists/{name}
    - **Method**: POST
    - **Summary**: This action allows for the creation of a new buy list with a specified name. If a buy list with the given name already exists, the API responds with a 409 status code, indicating a conflict.

4. **Deleting a Buy List**

    - **Endpoint**: /buyLists/{name}
    - **Method**: DELETE
    - **Summary**: This action deletes a specific buy list by name. If the buy list does not exist, the API responds with a 404 status code.

5. **Adding an Item to a Buy List**

    - **Endpoint**: /buyLists/{name}/items/{itemName}
    - **Method**: POST
    - **Summary**: This action adds an item to a specific buy list. It requires the item name and quantity to be specified in the request body. The API responds with the details of the added item.

6. **Removing an Item from a Buy List**

    - **Endpoint**: /buyLists/{name}/items/{itemName}
    - **Method**: DELETE
    - **Summary**: This action removes a specific item from a buy list. It simplifies list management by allowing users to delete items they no longer need or have added by mistake.

7. **Marking an Item as Bought**

    - **Endpoint**: /buyLists/{name}/items/{itemName}
    - **Method**: PATCH
    - **Summary**: This action marks an item within a buy list as bought. It's a crucial feature for tracking purchase progress, helping users to easily manage their shopping tasks.
- 