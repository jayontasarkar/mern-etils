import React from 'react';
import Admin from '../layouts/admin';
import { Breadcrumb, Row, Col, Avatar, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as authService from '../../services/authService';

const ProfileSettings = () => {
  const currentUser = authService.getCurrentUser();
  return (
    <Admin>
      <Breadcrumb className="site-breadcrumb">
        <Breadcrumb.Item>Personal Settings</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 5 }}>
            <h1>My Info</h1>
            <div style={{ margin: '25px 0px' }}>
              <Avatar size={64} icon={<UserOutlined />} />
            </div>
            <div style={{ margin: '25px 0px' }}></div>
            <hr />
            <div style={{ marginTop: '25px' }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="year"
                  rules={[{ required: true }]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input
                    placeholder={currentUser.name}
                    disabled
                    value={currentUser.name}
                  />
                </Form.Item>
                <Form.Item
                  name="month"
                  rules={[{ required: true }]}
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <Input
                    placeholder={currentUser.email}
                    disabled
                    value={currentUser.email}
                  />
                </Form.Item>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>
    </Admin>
  );
};

export default ProfileSettings;
