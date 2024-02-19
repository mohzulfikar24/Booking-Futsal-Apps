import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Image, Modal, Table, Tooltip } from 'antd';
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDebounce } from '@uidotdev/usehooks';
import { getFieldsByOwnerId } from '../api/getFieldsByOwner';
import priceFormatter from '../../../utils/priceFormatter';
import imagePlaceholder from '../../../assets/image-placeholder.png';
import { useDeleteField } from '../hooks/useDeleteField';
export default function TableFIeld({ name, owner }) {
  const [fields, setFields] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsloading] = useState(false);
  const { isLoading: isModalDeleteLoading, toggleModal, modalVisibility, deleteFIeld } = useDeleteField();
  const columns = useMemo(
    () => [
      {
        title: 'Field Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? text : '-'}</div>,
      },
      {
        title: 'Start Hour',
        dataIndex: 'start_hour',
        key: 'start_hour',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? `${text.toString().padStart(2, '0')}.00 WIB` : '-'}</div>
        ),
      },
      {
        title: 'End Hour',
        dataIndex: 'end_hour',
        key: 'end_hour',
        align: 'center',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>{text ? `${text.toString().padStart(2, '0')}.00 WIB` : '-'}</div>
        ),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (text) => <div style={{ textAlign: 'center' }}>{text ? priceFormatter(text) : '-'}</div>,
      },
      {
        title: 'Image',
        key: 'price',
        align: 'center',
        render: (record) => (
          <Image
            style={{ borderRadius: 8 }}
            width={70}
            height={70}
            src={record?.image_cover}
            alt='image field'
            fallback={imagePlaceholder}
          />
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
            <Tooltip placement='top' title='Select'>
              <Button
                type='primary'
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedId(record.id);
                  toggleModal();
                }}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [toggleModal]
  );
  const nameDebounce = useDebounce(name, 1000);
  const ownerDebounce = useDebounce(owner, 1000);

  const getData = useCallback(
    async (name = '', owner = '') => {
      try {
        setIsloading(true);
        const response = await getFieldsByOwnerId(token, owner, name);
        const fieldList = response.data.data.map((data) => ({
          ...data,
          key: data.id,
        }));
        setFields(fieldList);
      } catch (error) {
      } finally {
        setIsloading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    getData(nameDebounce, ownerDebounce);
  }, [getData, nameDebounce, ownerDebounce]);

  return (
    <>
      <Table columns={columns} dataSource={fields} loading={isLoading} scroll={{ x: 'max-content' }} />
      <Modal
        width={400}
        title='Apakah anda yakin ingin menghapus data ini?'
        open={modalVisibility}
        onCancel={toggleModal}
        confirmLoading={isModalDeleteLoading}
        footer={[
          <Button
            type='primary'
            danger
            onClick={async () => {
              await deleteFIeld(selectedId, token, () => getData(nameDebounce, ownerDebounce));
            }}
            icon={<DeleteOutlined />}
          >
            Delete Field
          </Button>,
          <Button type='primary' onClick={toggleModal} icon={<CloseCircleOutlined />}>
            Cancel
          </Button>,
        ]}
      />
    </>
  );
}
