import React, { useEffect, useState } from 'react';
import Plain from '../layouts/plain';
import { Markup } from 'interweave';
import { Col, Result, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import docService from '../../services/docService';

const PreviewDoc = () => {
  const params = useParams();
  const [doc, setDoc] = useState({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchDoc(id) {
      try {
        setLoading(true);
        const { data } = await docService.preview(id);
        setDoc(data);
        setLoading(false);
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          toast.error('Server error. Something went wrong');
        }
        setLoading(false);
      }
    }
    fetchDoc(params.id);
  }, []);

  return (
    <Plain>
      {loading ? (
        <Col sm={{ span: 14, offset: 5 }} xs={{ span: 22, offset: 1 }}>
          <Skeleton active />
        </Col>
      ) : notFound ? (
        <Col span="24">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the doc you are finding does not exist."
          />
        </Col>
      ) : (
        <Col sm={{ span: 15 }} xs={{ span: 24 }}>
          <h1
            style={{
              marginTop: '35px',
              marginBottom: '20px',
              fontSize: '28px',
            }}
          >
            {doc.title}
          </h1>
          <div style={{ marginBottom: '40px', fontSize: '1em' }}>
            <Markup content={doc.content} />
          </div>
        </Col>
      )}
    </Plain>
  );
};

export default PreviewDoc;
