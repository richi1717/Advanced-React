import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = props => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{ resetToken: props.resetToken, password, confirmPassword }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(reset, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            await reset();
            setPassword('');
            setConfirmPassword('');
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Reset Your Password</h2>
            <Error error={error} />
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
            <label htmlFor="confirmPassword">
              Confirm Your Password
              <input
                type="Password"
                name="confirmPassword"
                placeholder="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit">Reset Password!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
};

export default Reset;
