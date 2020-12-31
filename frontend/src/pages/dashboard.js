import React from 'react';
import Admin from './layouts/admin';
import { Breadcrumb, Row, Col, Empty } from 'antd';
import moment from 'moment';

const Dashboard = () => {
  const greeting = () => {
    var currentHour = moment().format('HH');
    console.log(currentHour);
    if (currentHour >= 3 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 15) {
      return 'Good Afternoon';
    } else if (currentHour >= 15 && currentHour < 20) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  return (
    <Admin>
      <Breadcrumb className="site-breadcrumb">
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 14, offset: 5 }}>
            <h1
              style={{
                fontSize: '40px',
                marginTop: '40px',
                fontWeight: 'bold',
              }}
            >
              {greeting()}!
            </h1>
            <p
              style={{
                color: '#6a707c',
                marginTop: '30px',
                fontSize: '12px',
                borderBottom: '1px solid #efefef',
                paddingBottom: '8px',
              }}
            >
              MY HIGHLIGHTS
            </p>
            <div style={{ marginTop: '40px', marginBottom: '50px' }}>
              <Empty description="Highlights give you a birds-eye view on your day’s work" />
            </div>
            <p
              style={{
                color: '#6a707c',
                marginTop: '30px',
                fontSize: '12px',
                borderBottom: '1px solid #efefef',
                paddingBottom: '8px',
                marginBottom: '40px',
              }}
            >
              All quiet for now. Check back later.&nbsp;&nbsp;&#129311;
            </p>
            <p
              style={{
                color: '#6a707c',
                marginTop: '30px',
                fontSize: '12px',
                borderBottom: '1px solid #efefef',
                paddingBottom: '8px',
              }}
            >
              Other team updates
            </p>
          </Col>
        </Row>
      </div>
    </Admin>
  );
};

export default Dashboard;
