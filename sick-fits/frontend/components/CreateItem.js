import gql from 'graphql-tag';
import React, { useState } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = props => {
  const [title, setTitle] = useState('Cool Shoes');
  const [description, setDescription] = useState('I love the things');
  const [price, setPrice] = useState(23000);
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');

  const handleChange = setter => e => {
    const { type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setter(val);
  };

  const uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dy7muxsnb/image/upload',
      {
        method: 'POST',
        body: data
      }
    );
    const file = await res.json();
    console.log(file);
    setImage(file.secure_url);
    setLargeImage(file.eager[0].secure_url);
  };

  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{ title, description, price, image, largeImage }}
    >
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            });
          }}
        >
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              File
              <input
                id="file"
                name="file"
                onChange={uploadFile}
                placeholder="Upload an Image"
                required
                type="file"
              />
              {image && <img src={image} alt="upload-preview" width="200" />}
            </label>
            <label htmlFor="title">
              Title
              <input
                id="title"
                name="title"
                onChange={handleChange(setTitle)}
                placeholder="Title"
                required
                type="text"
                value={title}
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
                value={formatMoney(price)}
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
                value={description}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
