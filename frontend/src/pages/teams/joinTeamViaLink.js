import { Button, Card, Col } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Plain from '../layouts/plain';
import Textbox from '../../components/inputs/textbox';
import { useParams } from 'react-router-dom';
import * as teamService from '../../services/teamService';

const JoinTeamViaLink = ({ history }) => {
  const params = useParams();

  const [state, setState] = useState({ email: '' });
  const [errors, setErrors] = useState({ email: '' });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log({ ...state, team: params.team });
      const { data } = await teamService.joinLink({
        ...state,
        team: params.team,
      });
      setLoading(false);
      toast.success('Team invitation request accepted.');
      history.replace(`/organization/${params.team}/join/${data.token}`);
    } catch (error) {
      setLoading(false);
      if (error.response.status > 400) {
        toast.error(error.response.data);
      } else {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <Plain>
      <Col md={8} xs={22}>
        <Card>
          <h1 style={{ textAlign: 'center' }}>Join Via invitation Link</h1>
          <div style={{ marginBottom: '20px', marginTop: '25px' }}>
            <Textbox
              placeholder="Your email address"
              name="email"
              onChange={handleChange}
              value={state.email}
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
              Proceed to join team
            </Button>
          </div>
        </Card>
      </Col>
    </Plain>
  );
};

export default JoinTeamViaLink;
