import React, { useEffect, useState } from 'react';
import Admin from '../layouts/admin';
import { Breadcrumb, Col, Row, Button, List, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as teamService from '../../services/teamService';
import * as authService from '../../services/authService';

const MemberSettings = () => {
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    async function getMembers() {
      setLoading(true);
      const { data } = await teamService.members();
      setMembers(data.members);
      setTeam(data.team);
      setLoading(false);
    }
    getMembers();
  }, []);

  const removeMember = async (memberId) => {
    try {
      await teamService.removeMember(memberId);
      const filtered = members.filter((member) => member._id !== memberId);
      setMembers(filtered);
      toast.success('Team member removed');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while removing member');
    }
  };

  return (
    <Admin>
      <Breadcrumb className="site-breadcrumb">
        <Breadcrumb.Item>Team Members</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 5 }}>
            <h1 className="flexbox-space-between">
              Team members
              <Button type="primary">
                <Link to="/settings/organization/invitations">
                  Invite Member
                </Link>
              </Button>
            </h1>
            <div style={{ marginTop: '25px' }}>
              {loading ? (
                <h5>Loading...</h5>
              ) : (
                <List
                  dataSource={members}
                  renderItem={(item) => (
                    <List.Item
                      key={item._id}
                      style={{ borderBottom: 'none', padding: '6px 0' }}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={item.email}
                      />
                      <div>
                        <Button type="link" style={{ color: '#b1b3b6' }}>
                          {`${item.role
                            .charAt(0)
                            .toUpperCase()}${item.role.slice(1)}`}
                        </Button>
                        {currentUser._id === team.owner._id &&
                        item.role !== 'owner' ? (
                          <Popconfirm
                            title="Are you sure to delete member?"
                            onConfirm={() => removeMember(item._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="link" danger>
                              Remove
                            </Button>
                          </Popconfirm>
                        ) : (
                          ''
                        )}
                      </div>
                    </List.Item>
                  )}
                ></List>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Admin>
  );
};

export default MemberSettings;
