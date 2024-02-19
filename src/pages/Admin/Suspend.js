import { Col, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';
import UserTable from './components/TableSuspend';

export default function SuspendPage() {
  const [name, setName] = useState('');
  return (
    <div className='p-4'>
      <hr />
      <Typography.Title level={3} className='mt-2' underline>
        User List
      </Typography.Title>
      <div className='d-flex flex-row align-items-center mb-3'>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <p style={{ fontFamily: 'Tilt Neon', paddingBottom: '10px' }}>
              Search User Name :
            </p>
            <Input
              placeholder='search name'
              allowClear
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <UserTable name={name} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
