import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = props => {
  const update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id: props.id }}
      update={update}
    >
      {(deleteItem, { error }) => (
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this item?')) {
              deleteItem().catch(err => {
                alert(err.message);
              });
            }
          }}
        >
          {props.children}
        </button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
