import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllUsers } from '../api/getAllUser';
import { useSelector } from 'react-redux';
import { Button, Col, Input, Modal, Row, Table, Tag, Tooltip, message } from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  ForwardOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { useDebounce } from '@uidotdev/usehooks';
import { useSuspendUser } from '../hooks/useSuspendUser';
import { useUnsuspendUser } from '../hooks/useUnsuspendUser';

export default function UserTable({ name }) {
  const [users, setUsers] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsloading] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [msgSuspend, setMsgSuspend] = useState('')
  const {
    isLoading: loadingSuspend,
    suspendModalVisibility,
    toggleSuspendModal,
    suspendUser,
  } = useSuspendUser();
  const {
    isLoading: loadingUnsuspend,
    unsuspendModalVisibility,
    toggleUnsusoendModal,
    handleUnsuspendUser,
  } = useUnsuspendUser();

  const columns = useMemo(
    () => [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
        render: (_, __, index) => (
          <div style={{ textAlign: 'center' }}>{index + 1}</div>
        ),
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        key: 'full_name',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
        ),
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
        ),
      },
      {
        title: 'Identity Number',
        dataIndex: 'no_identity',
        key: 'no_identity',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
        ),
      },
      {
        title: 'Account Number',
        dataIndex: 'no_rekening',
        key: 'no_rekening',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
        ),
      },
      {
        title: 'Address',
        dataIndex: 'fullAddress',
        key: 'fullAddress',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
        ),
      },
      {
        title: 'Account Status',
        dataIndex: 'status_acc',
        key: 'status_acc',
        align: 'center',
        render: (text) => (
          // <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>
          <Tag color={text == 'active' ? "success" : text == 'pending' ? 'warning' : 'error'}>{text || '-'}</Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <Tooltip placement='top' title='Suspend'>
              <Button
                type='primary'
                // style={{ backgroundColor: '#ffb73f' }}
                danger
                disabled={
                  record.status_acc === 'pending' ||
                  record.status_acc === 'suspend'
                }
                icon={<PoweroffOutlined />}
                onClick={() => {
                  setSelectedId(record.id);
                  toggleSuspendModal();
                }}
              />
            </Tooltip>
            <Tooltip placement='top' title='Unsuspend'>
              <Button
                type='primary'
                // style={{ backgroundColor: 'green' }}
                disabled={
                  record.status_acc === 'pending' ||
                  record.status_acc === 'active'
                }
                onClick={() => {
                  setSelectedId(record.id);
                  toggleUnsusoendModal();
                }}
                icon={<ForwardOutlined />}
              />
            </Tooltip>
            {/* <Tooltip placement='top' title='Delete'>
              <Button
                type='primary'
                danger
                disabled={record.status_acc === 'pending'}
                icon={<DeleteOutlined />}
              />
            </Tooltip> */}
          </div>
        ),
      },
    ],
    [toggleSuspendModal, toggleUnsusoendModal]
  );
  const searchDebounce = useDebounce(name, 1000);

  const getData = useCallback(
    async (name = '') => {
      try {
        setIsloading(true);
        const response = await getAllUsers(token, name);
        const usersList = response.data.data.map((data, index) => ({
          ...data,
          key: data.id,
          fullAddress:
            !data?.address || !data?.location
              ? '-'
              : `${data?.address}, ${data?.location}`,
        }));
        setUsers(usersList);
        setIsloading(false);
      } catch (error) {
        console.log(error);
        setIsloading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    getData(searchDebounce);
  }, [searchDebounce, getData]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        width={400}
        title='Are u sure want to suspend this account ?'
        open={suspendModalVisibility}
        onCancel={toggleSuspendModal}
        confirmLoading={loadingSuspend}
        onOk={() => {
          suspendUser(selectedId, token, () => {
            setSelectedId('');
            getData(name);
          });
        }}
        footer={[
          <Button
            type='primary'
            danger
            loading={loadingSuspend}
            onClick={() => {
              suspendUser(selectedId, token, () => {
                setSelectedId('');
                setMsgSuspend('');
                getData(name);
              }, msgSuspend);
            }}
            icon={<PoweroffOutlined />}
          >
            Suspend
          </Button>,
          <Button
            type='primary'
            onClick={toggleSuspendModal}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Row>
          <Col span={6}>Message :</Col>
          <Col span={18}>
            <Input value={msgSuspend} onChange={(e) => setMsgSuspend(e.target.value)}  />
          </Col>
        </Row>
      </Modal>
      <Modal
        width={400}
        title='Are u sure want to active this account ?'
        open={unsuspendModalVisibility}
        onCancel={toggleUnsusoendModal}
        confirmLoading={loadingUnsuspend}
        onOk={() => {
          handleUnsuspendUser(selectedId, token, () => {
            setSelectedId('');
            getData(name);
          });
        }}
        footer={[
          <Button
            type='primary'
            style={{ backgroundColor: 'green' }}
            loading={loadingUnsuspend}
            onClick={() => {
              handleUnsuspendUser(selectedId, token, () => {
                setSelectedId('');
                getData(name);
              });
            }}
            icon={<ForwardOutlined />}
          >
            Unsuspend
          </Button>,
          <Button
            type='primary'
            onClick={toggleUnsusoendModal}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>,
        ]}
      />
    </>
  );
}
