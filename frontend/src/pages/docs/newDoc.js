import React, { useEffect, useState } from 'react';
import Admin from '../layouts/admin';
import { Breadcrumb, Form, Button, Modal, Select, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import QuillEditor from '../../components/editor/quillEditor';
import DocPreviewModal from '../../components/modals/preview';
import Textbox from '../../components/inputs/textbox';
import * as docService from '../../services/docService';
import * as teamService from '../../services/teamService';
import * as authService from '../../services/authService';
import io from 'socket.io-client';

let socket;

const NewDoc = ({ history }) => {
  socket = io(process.env.REACT_APP_API_BASE_URL);
  const user = authService.getCurrentUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [membersToInvite, setMembersToInvite] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      const { data } = await teamService.members(true);
      setMembersToInvite(data.members);
    }
    fetchMembers();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onEditorChange = (value) => {
    setContent(value);
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };

  const onSubmit = async (e) => {
    try {
      setLoading(true);
      setErrors({});
      const { data } = await docService.save({
        title,
        content,
        editors: invitedMembers,
        public: isPublic,
      });
      if (invitedMembers.length > 0) {
        socket.emit('doc-shared-with', {
          editors: invitedMembers,
          author: user,
          doc: data,
        });
      }
      toast.success('New doc created successfully.');
      setTitle('');
      setContent('');
      setFiles([]);
      setLoading(false);
      history.replace('/app/notes');
    } catch (error) {
      if (error && error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        console.log(error);
        toast.error('Something went wrong');
      }
      setLoading(false);
    }
  };

  const handleSelectChange = (arr) => {
    setInvitedMembers(arr);
  };

  const handleSwitchChange = (status) => {
    setIsPublic(status);
  };

  const excerpt = (str) => {
    if (str.length > 60) return str.substring(0, 60) + '...';
    return str;
  };

  return (
    <Admin>
      <Breadcrumb
        className="site-breadcrumb"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <span>
          <Breadcrumb.Item>
            <NavLink to="/app/notes">My Private Docs</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {title ? excerpt(title) : 'Untitled'}
          </Breadcrumb.Item>
        </span>
        <span>
          <DocPreviewModal title={title} content={content} />
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginLeft: '15px' }}
            shape="round"
          >
            <i className="fa fa-share-alt" aria-hidden="true"></i>&nbsp;Share
          </Button>
          <Modal
            title="Share with team members"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            <p>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select team members to share with"
                defaultValue={[]}
                onChange={handleSelectChange}
              >
                {membersToInvite.map((m) => (
                  <Select.Option value={m._id} key={m._id}>
                    {m.name} {`<${m.email}>`}
                  </Select.Option>
                ))}
              </Select>
            </p>
            <p style={{ marginTop: '40px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '25px' }}>
                Public Doc?
              </span>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultUnChecked
                onChange={handleSwitchChange}
              />
            </p>
          </Modal>
        </span>
      </Breadcrumb>
      <div className="site-layout-background">
        <Form onSubmit={onSubmit}>
          <div style={{ margin: '0 2rem' }}>
            <Textbox
              placeholder="Enter doc title within 100 words"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              error={errors}
            />
          </div>
          <div style={{ textAlign: 'center', margin: '2rem' }}>
            <QuillEditor
              placeholder={'Start writing something for your doc'}
              onEditorChange={onEditorChange}
              onFilesChange={onFilesChange}
              content={content}
            />
            <Button
              block
              size="large"
              htmlType="submit"
              shape="round"
              type="primary"
              onClick={onSubmit}
              style={{ marginTop: '25px' }}
              loading={loading}
            >
              Save your doc
            </Button>
          </div>
        </Form>
      </div>
    </Admin>
  );
};

export default NewDoc;
