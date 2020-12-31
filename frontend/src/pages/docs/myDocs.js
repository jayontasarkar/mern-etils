import React, { useEffect, useState } from 'react';
import Admin from '../layouts/admin';
import { Breadcrumb, Row, Col, List } from 'antd';
import { toast } from 'react-toastify';
import * as docService from '../../services/docService';
import { Link } from 'react-router-dom';

const MyDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoading(true);
        const { data } = await docService.myDocs();
        setDocs(data);
        setLoading(false);
      } catch (error) {
        toast.error('Server error. Something went wrong');
      }
    }
    fetchDocs();
  }, []);

  const excerpt = (str) => {
    if (str.length > 40) return str.substring(0, 40) + '...';
    return str;
  };

  return (
    <Admin>
      <Breadcrumb className="site-breadcrumb">
        <Breadcrumb.Item>My Docs</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Row>
          <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
            <h1 style={{ marginTop: '40px', fontSize: '36px' }}>
              My private docs
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
              RECENTLY UPDATED
            </p>
            {loading ? (
              <h2>Loading...</h2>
            ) : docs && docs.length > 0 ? (
              <List
                dataSource={docs}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{ color: 'rgb(165 164 164)' }}
                  >
                    <List.Item.Meta
                      description={
                        <Link to={`/app/notes/${item.id}/edit`}>
                          {excerpt(item.title)}
                        </Link>
                      }
                    />
                    <div
                      style={{ fontSize: '.8em', color: 'rgb(165 164 164)' }}
                    >
                      {item.meta}
                    </div>
                  </List.Item>
                )}
              ></List>
            ) : (
              <h3>No docs found</h3>
            )}
          </Col>
        </Row>
      </div>
    </Admin>
  );
};

export default MyDocs;
