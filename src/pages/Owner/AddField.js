import React, { useEffect, useState } from 'react';
import Navbar from '../../components/parents/Navbar';
import Footer from '../../components/parents/Footer';
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from 'antd';
import { useSelector } from 'react-redux';
import {
  addFieldOwner,
  editFieldOwner,
  getDetailFieldOwner,
  getFieldUserId,
} from '../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import { CloudUploadOutlined, PlusCircleOutlined, FundViewOutlined, CloseCircleOutlined, CheckCircleOutlined} from "@ant-design/icons";

function LapanganOwner() {
  const { Title } = Typography;
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const temp = [];
  for (let index = 1; index <= 24; index++) {
    temp.push({ value: index, label: `${index}:00` });
  }

  const [val, setVal] = useState({});
  const [clock, setClock] = useState(temp);
  const [multi, setMulti] = useState([]);
  const [loading, setLoading] = useState(false)

  const onChange = (e, flag) => {
    if (flag === 'type') {
      setVal({ ...val, ['type']: e });
    } else if (flag === 'city') {
      setVal({ ...val, ['city']: e });
    } else if (flag === 'open') {
      if (e) {
        setVal({ ...val, ['start_hour']: e });
        setClock(clock?.slice(e - 1));
      } else {
        setVal({ ...val, ['end_hour']: '', ['start_hour']: '' });
        setClock(temp);
      }
    } else if (flag === 'close') {
      setVal({ ...val, ['end_hour']: e });
    } else if (flag === 'number') {
      setVal({ ...val, ['price']: e });
    } else {
      setVal({ ...val, [e.target.name]: e.target.value });
    }
    // console.log("vals",e)
  };

  const onChangeImageSingle = (e, isSingle) => {
    if (isSingle) {
      setVal({ ...val, ['image_cover']: e });
    } else {
      setVal({ ...val, ['images']: e });
    }
  };

  const handleAddField = async () => {
    try {
      if(!profile.bank_name || !profile.no_identity || !profile.image_identity || !profile.no_rekening) return message.info('Can`t add field you must input form profile first')
      setLoading(true)
      console.log("payloadAddField", val)
      if(!val.address || !val.city || !val.description || !val.end_hour || !val.image_cover || !val.images || !val.name || !val.price || !val.start_hour || !val.type) return (message.info('data can`t empty'), setLoading(false))
      let formData = new FormData();
      Object.keys(val).forEach((key) => {
        if (key === 'images') {
          val.images.forEach((image) => {
            if (image.originFileObj) formData.append(`images`, image.originFileObj);
          });
        } else {
          if (val[key]) formData.append(key, val[key]);
        }
      });
      await addFieldOwner(token, formData);
      setVal({ images: null, image_cover: null });
      message.success('success add field');
      navigate('/editlapangan')
    } catch (error) {
      message.info(error.response.data.msg);
      setLoading(false)
    }
  };

  const costing = (price) => {
    return (
      'Rp ' +
      parseFloat(price)
        .toFixed()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    );
  };

  const resetImage = () => {
    setVal({ ...val, images: null, image_cover: null });
  };

  console.log('valueAddFields', val, multi);

  return (
    <>
      <div className='p-4'>
        <Button type='primary' icon={<PlusCircleOutlined />} style={{fontFamily: 'Tilt Neon'}}>Add Field</Button>
        <Button type='ghost' icon={<FundViewOutlined />} style={{fontFamily: 'Tilt Neon'}} danger onClick={() => navigate('/editlapangan')}>
          View Field
        </Button>
        <hr />
        <Row gutter={[20, 20]}>
          {/* Card 1 */}
          <Col span={6}>
            <Card
              title='Information Field'
              bordered={true}
              headStyle={{ backgroundColor: '#ffb73f', color: '#FFF' }}
              bodyStyle={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
              }}
            >
              <div className='py-2'>
                <Title level={5}>Name Field</Title>
                <Input
                  name='name'
                  value={val.name}
                  onChange={(e) => onChange(e)}
                  placeholder='Name Field Booking'
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Type Field</Title>
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder='Select Type Soccer Fields'
                  optionFilterProp='children'
                  value={val.type}
                  onChange={(e) => onChange(e, 'type')}
                  autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      name: 'Grass',
                      value: 'Grass',
                      label: 'Grass',
                    },
                    {
                      name: 'Matras',
                      value: 'Matras',
                      label: 'Matras',
                    },
                  ]}
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Open Field</Title>
                {/* <Input name="start_hour" onChange={(e) => onChange(e)} placeholder="input hours only" /> */}
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder='open field'
                  optionFilterProp='children'
                  value={val.start_hour}
                  onChange={(e) => onChange(e, 'open')}
                  autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={clock.map((val, index) => val)}
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Close Field</Title>
                {/* <Input name="end_hour" onChange={(e) => onChange(e)} placeholder="input hours only" /> */}
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder='close field'
                  optionFilterProp='children'
                  value={val.end_hour}
                  onChange={(e) => onChange(e, 'close')}
                  autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={clock.map((val, index) => val)}
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Description</Title>
                {/* <Input
                  name='description'
                  value={val.description}
                  onChange={(e) => onChange(e)}
                  placeholder='Description Booking'
                /> */}
                <Input.TextArea
                  showCount
                  maxLength={500}
                  name='description'
                  value={val.description}
                  onChange={(e) => onChange(e)}
                  placeholder='Description Booking'
                  // style={{
                  //   height: 120,
                  //   resize: 'none',
                  // }}
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Price</Title>
                <Input
                  name='price'
                  value={costing(val?.price || 0)}
                  onChange={(e) => {
                    const values = e.target.value;
                    const parser = values.replace(/[^0-9]/g, '');
                    onChange(parser, 'number');
                  }}
                  placeholder='price'
                />
              </div>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col span={6}>
            <Card
              title='Information Location'
              bordered={true}
              headStyle={{ backgroundColor: '#ffb73f', color: '#FFF' }}
              bodyStyle={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
              }}
            >
              <div className='py-2'>
                <Title level={5}>Location</Title>
                <Select
                  style={{ width: '100%'}}
                  showSearch
                  placeholder='Select Location Soccer Fields'
                  optionFilterProp='children'
                  value={val.city}
                  onChange={(e) => onChange(e, 'city')}
                  autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: 'jakarta utara',
                      label: 'Jakarta Utara',
                    },
                    {
                      value: 'jakarta selatan',
                      label: 'Jakarta Selatan',
                    },
                    {
                      value: 'jakarta barat',
                      label: 'Jakarta Barat',
                    },
                    {
                      value: 'jakarta timur',
                      label: 'Jakarta Timur',
                    },
                    {
                      value: 'jakarta pusat',
                      label: 'Jakarta Pusat',
                    },
                  ]}
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Address</Title>
                <Input
                  name='address'
                  value={val.address}
                  onChange={(e) => onChange(e)}
                  placeholder='Address Booking'
                />
              </div>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col span={6}>
            <Card
              title='Information Image Fields'
              bordered={true}
              headStyle={{ backgroundColor: '#ffb73f', color: '#FFF' }}
              bodyStyle={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
              }}
            >
              <div className='py-2'>
                <Title level={5}>Upload Image Cover</Title>
                <Upload
                  accept='image/png, image/jpg, image/jpeg, image/webp'
                  maxCount={1}
                  showUploadList={true}
                  beforeUpload={true}
                  listType="picture"
                  onChange={({ file }) => onChangeImageSingle(file, true)}
                >
                  <Button
                    className='flex gap-2 items-center'
                    style={{ backgroundColor: '#ffb73f' }}
                    icon={<CloudUploadOutlined />}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
              <div className='py-2'>
                <Title level={5}>Upload Image Detail</Title>
                <Upload
                  accept='image/png, image/jpg, image/jpeg, image/webp'
                  maxCount={4}
                  multiple
                  showUploadList={true}
                  beforeUpload={true}
                  listType="picture"
                  onChange={({ fileList }) => onChangeImageSingle(fileList)}
                >
                  <Button
                    className='flex gap-2 items-center'
                    style={{ backgroundColor: '#ffb73f' }}
                    icon={<CloudUploadOutlined />}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
            </Card>
          </Col>

          {/* Card 4 */}
          <Col span={6}>
            <Card
              title='Information Payment'
              bordered={true}
              headStyle={{ backgroundColor: '#ffb73f', color: '#FFF' }}
              bodyStyle={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
              }}
            >
              <div className='py-2'>
                <Title level={5}>Bank & No Rekening</Title>
                <Input
                  placeholder='Atas nama'
                  value={profile?.bank_name || '-'}
                  readOnly
                />
              </div>
              <div className='py-2'>
                <Title level={5}>Name Indetity</Title>
                <Input
                  placeholder='Information Bank & No Rekening'
                  value={profile?.no_rekening || '-'}
                  readOnly
                />
              </div>
            </Card>
          </Col>
        </Row>
        <div className='d-flex w-100 flex-row justify-content-end'>
          <Button
            type='primary'
            className='my-3'
            style={{ width: '200px', marginRight: '30px' }}
            onClick={() => setVal({})}
            icon={<CloseCircleOutlined />}
            danger
          >
            Reset
          </Button>
          <Button
            type='primary'
            className='my-3'
            style={{ width: '200px' }}
            onClick={handleAddField}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

export default LapanganOwner;
