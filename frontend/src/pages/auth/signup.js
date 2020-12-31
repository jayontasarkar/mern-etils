import { Button, Card, Col } from 'antd';
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Plain from '../layouts/plain';
import Textbox from '../../components/inputs/textbox';
import PasswordBox from '../../components/inputs/password';
import * as authService from '../../services/authService';
import { toast } from 'react-toastify';

const SignupPage = ({ history }) => {
  const [state, setState] = useState({
    team: '',
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors.hasOwnProperty(name)) {
      const obj = { ...errors };
      delete obj[name];
      setErrors(obj);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await authService.register(state);
      setLoading(false);
      toast.success('Signup completed. Now setup a team.');
      history.replace('/teams/setup');
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data);
    }
  };

  return authService.getCurrentUser() ? (
    <Redirect to="/dashboard" />
  ) : (
    <Plain>
      <Col md={8} xs={22}>
        <Card>
          <h1 style={{ textAlign: 'center' }}>Create your free account</h1>
          <div style={{ marginTop: '20px', marginBottom: '12px' }}>
            <Textbox
              placeholder="Your full name"
              name="name"
              onChange={handleChange}
              value={state.name}
              error={errors}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Textbox
              placeholder="Your work email"
              name="email"
              onChange={handleChange}
              value={state.email}
              error={errors}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <PasswordBox
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              value={state.password}
              error={errors}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <Button
              type="primary"
              shape="round"
              block
              onClick={handleSubmit}
              loading={loading}
            >
              Create Account
            </Button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <small>
              Already have an account? <Link to="/auth/signin">Sign in</Link>{' '}
            </small>
          </div>
        </Card>
      </Col>
    </Plain>
  );
};

export default SignupPage;
