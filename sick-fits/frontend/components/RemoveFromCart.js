import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${({ theme }) => theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => (
  <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id }}>
    {(removeFromCart, { loading, error }) => (
      <BigButton
        disabled={loading}
        title="Delete Item"
        onClick={() => {
          removeFromCart().catch(err => alert(err.message));
        }}
      >
        &times;
      </BigButton>
    )}
  </Mutation>
);

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired
};

export default RemoveFromCart;
