import gql from 'graphql-tag';
import React, { useState } from 'react';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String!
    $description: String!
    $price: Int!
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleChange = setter => e => {
    const { type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setter(val);
  };

  const handleUpdate = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: props.id
      }
    });
  };

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data || !data.item) return <p>No Item Found for ID {props.id}</p>;

        return (
          <Mutation
            mutation={UPDATE_ITEM_MUTATION}
            variables={{
              title: title || data.item.title,
              description: description || data.item.description,
              price: price || data.item.price
            }}
          >
            {(updateItem, { loading, error }) => (
              <Form onSubmit={e => handleUpdate(e, updateItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      id="title"
                      name="title"
                      onChange={handleChange(setTitle)}
                      placeholder="Title"
                      required
                      type="text"
                      defaultValue={data.item.title}
                    />
                  </label>
                  <label htmlFor="price">
                    Price
                    <input
                      id="price"
                      name="price"
                      onChange={handleChange(setPrice)}
                      placeholder="Price"
                      required
                      type="text"
                      defaultValue={data.item.price}
                    />
                  </label>
                  <label htmlFor="description">
                    Description
                    <textarea
                      id="description"
                      name="description"
                      onChange={handleChange(setDescription)}
                      placeholder="Description"
                      required
                      defaultValue={data.item.description}
                    />
                  </label>
                  <button type="submit">
                    Sav{loading ? 'ing' : 'e'} Changes
                  </button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default UpdateItem;
