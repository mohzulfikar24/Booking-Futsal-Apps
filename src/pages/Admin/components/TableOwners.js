import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Table, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { useDebounce } from '@uidotdev/usehooks';
import { getAllOwner } from '../api/getAllOwner';

export default function OwnerTable({ name, onSelect }) {
  const [owners, setOwners] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsloading] = useState(false);
  //   const [selectedId, setSelectedId] = useState('');

  const columns = useMemo(
    () => [
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        key: 'full_name',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'Identity Number',
        dataIndex: 'no_identity',
        key: 'no_identity',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'Account Number',
        dataIndex: 'no_rekening',
        key: 'no_rekening',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'Address',
        dataIndex: 'fullAddress',
        key: 'fullAddress',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
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
            <Tooltip placement='top' title='Select'>
              <Button type='primary' icon={<SelectOutlined />} onClick={() => onSelect(record.id)} />
            </Tooltip>
          </div>
        ),
      },
    ],
    [onSelect]
  );
  const searchDebounce = useDebounce(name, 1000);

  const getData = useCallback(
    async (name = '') => {
      try {
        setIsloading(true);
        const response = await getAllOwner(token, name);
        const owerList = response.data.data.map((data) => ({
          ...data,
          key: data.id,
          fullAddress: !data?.address || !data?.location ? '-' : `${data?.address}, ${data?.location}`,
        }));
        setOwners(owerList);
      } catch (error) {
        const owner = {
          full_name: 'dummy',
          fullAddress: 'dummy',
          phone_number: '081234567890',
          no_identity: '33365402457800001',
          no_rekening: '45687984231684646',
          key: 1,
          id: 14,
        };
        setOwners([owner]);
      } finally {
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
      <Table columns={columns} dataSource={owners} loading={isLoading} scroll={{ x: 'max-content' }} />
    </>
  );
}
