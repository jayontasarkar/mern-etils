import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Admin from '../layouts/admin';
import { Breadcrumb, Row, Col, List, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import teamService from '../../services/teamService';
import authService from '../../services/authService';

const InvitationSettings = () => {
  const inviteLink = `${process.env.REACT_APP_BASE_URL}/organization/${
    authService.getCurrentUser().team
  }/join-link/1e6ef8d5c851a3b5c5/${Math.random().toString(36)}`;

  const [invitations, setInvitations] = useState([]);

  const [emails, setEmails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function getInvitations() {
      const { data } = await teamService.getInvitations();
      setInvitations(data);
    }
    getInvitations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await teamService.postInvitations({ emails });
      setInvitations([...data, ...invitations]);
      setEmails('');
      toast.success('Invitation emails sent.');
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast.error(error);
    }
  };

  const deleteInvitation = async (e, id) => {
    e.preventDefault();
    try {
      const { data: msg } = await teamService.deleteInvitations(id);
      const filtered = invitations.filter((i) => i.id !== id);
      setInvitations(filtered);
      toast.success(msg);
    } catch (error) {
      toast.error('Error!! Failed during removing invitation');
    }
  };

  const resendInvitation = async (e, id) => {
    e.preventDefault();
    try {
      const { data: msg } = await teamService.resendInvitations(id);
      toast.success(msg);
    } catch (error) {
      toast.error('Error!! Failed during resending invitation');
    }
  };

  const copyToClipboard = (e) => {
    var textField = document.createElement('textarea');
    textField.innerText = inviteLink;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    toast.success('Invite link copied to clipboard.');
  };

  return (
    <Admin>
      <Breadcrumb className="site-breadcrumb">
        <Breadcrumb.Item>Invitations</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 5 }}>
            <h1>Invite people</h1>
            <div>
              <p style={{ marginBottom: '8px' }}>
                Invite link <br></br>
                <small className="muted-text">
                  Anyone can use this link to join the team
                </small>
              </p>
              <div className="flexbox">
                <input
                  type="text"
                  value={inviteLink}
                  style={{
                    minWidth: '88%',
                    padding: '4px',
                    border: '1px solid #acb1b9',
                  }}
                  disabled
                />
                <Button type="primary" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <p style={{ marginBottom: '8px' }}>
                Email Addresses <br></br>
                <small className="muted-text">
                  Type or copy & paste a list of contacts. Please separate each
                  address with a comma.
                </small>
              </p>
              <textarea
                rows="4"
                style={{
                  width: '100%',
                  border: '1px solid #acb1b9',
                  padding: '6px',
                  fontSize: '11px',
                }}
                placeholder="john@example.com, jane@example.com, joe@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <div style={{ marginTop: '25px' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={submitting}
                disabled={emails === ''}
              >
                Send Invitations
              </Button>
            </div>
            <div style={{ marginTop: '30px' }}>
              <h1>Invitations Sent</h1>
              <List
                dataSource={invitations}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{ borderBottom: 'none', padding: '6px 0' }}
                  >
                    <List.Item.Meta description={item.description} />
                    <div>
                      <Button
                        type="link"
                        style={{ color: '#b1b3b6' }}
                        onClick={(e) => resendInvitation(e, item.id)}
                      >
                        Resend
                      </Button>
                      <Button
                        type="circle"
                        danger
                        onClick={(e) => deleteInvitation(e, item.id)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </List.Item>
                )}
              ></List>
            </div>
          </Col>
        </Row>
      </div>
    </Admin>
  );
};

export default InvitationSettings;
