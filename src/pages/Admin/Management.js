import { Col, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';
import OwnerTable from './components/TableOwners';
import TableFIeld from './components/TableField';

export default function ManagementPage() {
  const [name, setName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [fieldId, setFIeldId] = useState('');
  return (
    <>
      <div className='p-4'>
        <hr />
        <Typography.Title level={3} className='mt-2' underline>
          Owner List
        </Typography.Title>
        <div className='d-flex flex-row align-items-center mb-3'>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <p style={{ fontFamily: 'Tilt Neon', paddingBottom: '10px' }}>Search Owner Name :</p>
              <Input placeholder='search name' allowClear value={name} onChange={(e) => setName(e.target.value)} />
            </Col>
            <Col span={24}>
              <OwnerTable name={name} onSelect={setSelectedOwner} />
            </Col>
          </Row>
        </div>
      </div>
      {!selectedOwner ? null : (
        <div className='p-4'>
          <hr />
          <Typography.Title level={3} className='mt-2' underline>
            Field List
          </Typography.Title>
          <div className='d-flex flex-row align-items-center mb-3'>
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col span={6}>
                <p style={{ fontFamily: 'Tilt Neon', paddingBottom: '10px' }}>Search Field Name :</p>
                <Input
                  placeholder='search name'
                  allowClear
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  disabled={!selectedOwner}
                />
              </Col>
              <Col span={24}>
                <TableFIeld owner={selectedOwner} name={fieldName} onSelect={setFIeldId} />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
}
