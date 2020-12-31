import { Button, Card, Col } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Plain from '../layouts/plain';
import Textbox from '../../components/inputs/textbox';
import Select from '../../components/inputs/select';
import teamService from '../../services/teamService';

const options = [
  { value: '2 - 10 Members', key: '1' },
  { value: '11 - 20 Members', key: '2' },
  { value: '21 - 30 Members', key: '3' },
  { value: '31 - 50 Members', key: '4' },
  { value: '51+ Members', key: '5' },
];

const TeamSetupPage = () => {
  const [state, setState] = useState({
    name: '',
    slug: '',
    maxSize: '',
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

  const onChangeMaxSize = (e) => {
    const obj = { ...errors };
    delete obj['maxSize'];
    setErrors(obj);
    setState({ ...state, maxSize: e });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await teamService.setup(state);
      setLoading(false);
      toast.success('Team setup complete. Invite team members.');
      window.location = '/settings/organization/invitations';
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data);
    }
  };

  return (
    <Plain>
      <Col md={8} xs={22}>
        <Card>
          <h1 style={{ textAlign: 'center' }}>Let's set up your team</h1>
          <div style={{ marginTop: '20px', marginBottom: '13px' }}>
            <Textbox
              placeholder="Company or Team Name"
              name="name"
              onChange={handleChange}
              value={state.name}
              error={errors}
            />
          </div>
          <div style={{ marginBottom: '13px' }}>
            <Textbox
              placeholder="Unique Team ID"
              name="slug"
              onChange={handleChange}
              value={state.slug}
              error={errors}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Select
              name="maxSize"
              placeholder="Select Your Team Size"
              onChange={onChangeMaxSize}
              options={options}
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
              Setup Team
            </Button>
          </div>
        </Card>
      </Col>
    </Plain>
  );
};

export default TeamSetupPage;
