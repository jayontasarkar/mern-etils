import { Button, Card, Col, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import Plain from '../layouts/plain';
import Textbox from '../../components/inputs/textbox';
import PasswordBox from '../../components/inputs/password';
import * as teamService from '../../services/teamService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

let socket;

const JoinTeamPage = ({ history }) => {
  const params = useParams();
  socket = io(process.env.REACT_APP_API_BASE_URL);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [joinUser, setJoinUser] = useState({
    email: '',
    password: '',
  });
  const [joinUserErrors, setJoinUserErrors] = useState({});
  const [joinUserLoading, setJoinUserLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [invalid, setInvalid] = useState(false);
  const [team, setTeam] = useState({});
  const [checking, setChecking] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (e) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    async function check() {
      setChecking(true);
      try {
        const { data } = await teamService.check(params.invitationId);
        setTeam(data);
        setChecking(false);
      } catch (error) {
        setInvalid(true);
        setChecking(false);
      }
    }
    check();
  }, [params]);

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

  const handleChangeOnJoinUser = (e) => {
    const { name, value } = e.target;
    if (errors.hasOwnProperty(name)) {
      const obj = { ...joinUserErrors };
      delete obj[name];
      setJoinUserErrors(obj);
    }
    setJoinUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await teamService.registerAndJoin({
        ...state,
        invitation: params.invitationId,
      });
      const user = jwtDecode(token);
      socket.emit(
        'invitation-accepted',
        {
          data: state,
          invitation: params.invitationId,
          team: params.teamId,
          from: user,
        },
        (error) => {
          if (error) {
            alert('Error in socket connection');
          }
        }
      );
      setLoading(false);
      toast.success('Signup completed & Invitation accepted.');
      history.replace('/dashboard');
    } catch (error) {
      setLoading(false);
      if (error.response.status > 400) {
        toast.error(error.response.data);
      } else {
        setErrors(error.response.data);
      }
    }
  };

  const handleJoinUserSubmit = async () => {
    try {
      setJoinUserLoading(true);
      const token = await teamService.loginAndJoin({
        ...joinUser,
        invitation: params.invitationId,
      });
      const user = jwtDecode(token);
      socket.emit(
        'invitation-accepted',
        {
          data: joinUser,
          invitation: params.invitationId,
          team: params.teamId,
          from: user,
        },
        (error) => {
          if (error) {
            alert('Error in socket connection');
          }
        }
      );
      setJoinUserLoading(false);
      toast.success('Signin done & Invitation accepted.');
      history.replace('/dashboard');
    } catch (error) {
      setJoinUserLoading(false);
      if (error.response.status > 400) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        setJoinUserErrors(error.response.data);
      }
    }
  };

  return (
    <Plain>
      <Col md={8} xs={22}>
        <Card>
          {checking ? (
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              We are checking your activation.
            </h1>
          ) : invalid ? (
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              This invitation doesn't appear as valid.
            </h1>
          ) : (
            <>
              <h1 style={{ textAlign: 'center' }}>
                Join the Etils team <br />@{team.slug}
              </h1>
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
                  Create New Account
                </Button>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Button
                  type="link"
                  block
                  onClick={showModal}
                  style={{ color: '#cac5c5' }}
                >
                  Already have an account with etils?
                </Button>
                <Modal
                  style={{
                    maxWidth: '350px',
                    margin: '0 auto',
                  }}
                  centered
                  title="Login to join the team"
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={false}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <Textbox
                      placeholder="Your work email"
                      name="email"
                      onChange={handleChangeOnJoinUser}
                      value={joinUser.email}
                      error={joinUserErrors}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <PasswordBox
                      placeholder="Enter your password"
                      name="password"
                      onChange={handleChangeOnJoinUser}
                      value={joinUser.password}
                      error={joinUserErrors}
                    />
                  </div>
                  <div>
                    <Button
                      type="primary"
                      shape="round"
                      block
                      onClick={handleJoinUserSubmit}
                      loading={joinUserLoading}
                    >
                      Login & Join Team
                    </Button>
                  </div>
                </Modal>
              </div>
            </>
          )}
        </Card>
      </Col>
    </Plain>
  );
};

export default JoinTeamPage;
