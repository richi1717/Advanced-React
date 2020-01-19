import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{ email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await signup();
            console.log(res);
            setEmail('');
            setPassword('');
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign Into Your Account</h2>
            <Error error={error} />
            <label htmlFor="email">
              Email
              <input
                type="text"
                name="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
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
            <button type="submit">Sign In!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signin;
