import React, { useEffect, useState } from 'react';
import Admin from '../layouts/admin';
import {
  Breadcrumb,
  Form,
  Button,
  Skeleton,
  Result,
  Select,
  Modal,
  Switch,
  Popconfirm,
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { NavLink, useParams } from 'react-router-dom';
import QuillEditor from '../../components/editor/quillEditor';
import Textbox from '../../components/inputs/textbox';
import DocPreviewModal from '../../components/modals/preview';
import * as docService from '../../services/docService';
import * as teamService from '../../services/teamService';
import * as authService from '../../services/authService';
import io from 'socket.io-client';

let socket;

const EditDoc = ({ history }) => {
  socket = io(process.env.REACT_APP_API_BASE_URL);

  const params = useParams();
  const inviteLink = `${process.env.REACT_APP_BASE_URL}/docs/preview/${params.doc}`;
  const user = authService.getCurrentUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState();
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [membersToInvite, setMembersToInvite] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    async function findDoc(id) {
      try {
        setFetching(true);
        setNotFound(false);
        const { data: members } = await teamService.members(true);
        const { data } = await docService.find(id);
        setAuthor(data.author);
        setMembersToInvite(members.members);
        const editorIds = [];
        data.editors.forEach((editor) => editorIds.push(editor._id));
        setInvitedMembers(editorIds);
        setTitle(data.title);
        setContent(data.content);
        setIsPublic(data.public);
        setFetching(false);
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          toast.error('Server error. Something went wrong');
        }
        setFetching(false);
      }
    }
    findDoc(params.doc);
    socket.on('doc-updating', (data) => {
      if (user._id !== data.editing._id && user.team === data.team) {
        if (data.doc.title) {
          setTitle(data.doc.title);
        }
        if (data.doc.content) {
          setContent(data.doc.content);
        }
      }
    });
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

  const handleSelectChange = (arr) => {
    setInvitedMembers(arr);
  };

  const handleSwitchChange = (status) => {
    setIsPublic(status);
  };

  const setDocTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
    socket.emit('doc-updating', {
      editors: invitedMembers,
      editing: user,
      team: user.team,
      doc: { title: e.target.value },
    });
  };

  const onEditorChange = (value) => {
    socket.emit('doc-updating', {
      editors: invitedMembers,
      editing: user,
      team: user.team,
      doc: {
        content: value,
      },
    });
    setContent(value);
  };

  const onFilesChange = (files) => {
    setFiles(files);
  };

  const onSubmit = async (e) => {
    try {
      setLoading(true);
      setErrors({});
      await docService.update(params.doc, {
        title,
        content,
        public: isPublic,
        editors: invitedMembers,
      });
      toast.success('Doc updated successfully.');
      setLoading(false);
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

  const removeDoc = async (e) => {
    e.preventDefault();
    try {
      await docService.remove(params.doc);
      history.replace('/app/notes');
    } catch (error) {
      if (error && error.response && error.response.status === 422) {
        toast.error('Not authorized to perform the action');
      } else if (error && error.response && error.response.status === 400) {
        toast.error('Doc not found.');
      } else {
        toast.error('Server error!');
        console.log(error.message);
      }
    }
  };

  const excerpt = (str) => {
    if (str.length > 40) return str.substring(0, 40) + '...';
    return str;
  };

  const handleCopyLink = () => {
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
      <Breadcrumb
        className="site-breadcrumb"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <span>
          {fetching || notFound ? '' : title ? excerpt(title) : 'Untitled'}
        </span>
        {user._id === author ? (
          <span>
            <DocPreviewModal title={title} content={content} />
            {user._id === author && (
              <Popconfirm
                placement="top"
                title="Are you sure to remove doc?"
                onConfirm={removeDoc}
                okText="Yes"
                cancelText="Cancel"
              >
                <Button
                  type="danger"
                  shape="round"
                  style={{ marginRight: '10px', marginLeft: '10px' }}
                >
                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                  &nbsp;Delete Doc
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" shape="round" onClick={showModal}>
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
                  defaultValue={invitedMembers}
                  onChange={handleSelectChange}
                >
                  {membersToInvite &&
                    membersToInvite.length > 0 &&
                    membersToInvite.map((m) => (
                      <Select.Option value={m._id} key={m._id}>
                        {m.name} {`<${m.email}>`}
                      </Select.Option>
                    ))}
                </Select>
              </p>
              <p style={{ marginTop: '40px' }}>
                <span>
                  <Button
                    type="primary"
                    disabled={!isPublic}
                    size="small"
                    shape="round"
                    onClick={handleCopyLink}
                  >
                    <i className="fa fa-paperclip"></i>&nbsp;Copy link
                  </Button>
                </span>
                <span style={{ margin: '0 15px', color: '#e1e1e1' }}>|</span>
                <span style={{ marginRight: '5px' }}>Public</span>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={isPublic}
                  onChange={handleSwitchChange}
                />
              </p>
            </Modal>
          </span>
        ) : (
          <DocPreviewModal title={title} content={content} />
        )}
      </Breadcrumb>
      <div className="site-layout-background">
        {fetching ? (
          <Skeleton active />
        ) : notFound ? (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the doc you are finding does not exist."
          />
        ) : (
          <Form onSubmit={onSubmit}>
            <div style={{ margin: '0 2rem' }}>
              <Textbox
                placeholder="Enter doc title within 100 words"
                name="title"
                onChange={setDocTitle}
                value={title}
                error={errors}
                maxLength="100"
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
        )}
      </div>
    </Admin>
  );
};

export default EditDoc;
