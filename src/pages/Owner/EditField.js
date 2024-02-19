import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteFieldById,
  editFieldOwner,
  getFieldUserId,
} from '../../utils/Axios';
import { useSelector } from 'react-redux';
import priceFormatter from '../../utils/priceFormatter';
import {
  PlusCircleOutlined,
  FundViewOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const _ = require('lodash');

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Open - Close',
    dataIndex: 'openClose',
    key: 'openClose',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];

function EditField() {
  const navigate = useNavigate();
  const { Title } = Typography;
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);

  const temp = [];
  for (let index = 1; index <= 24; index++) {
    temp.push({ value: index, label: `${index}:00` });
  }

  const [field, setField] = useState([]);
  const [val, setVal] = useState({});
  const [selectedId, setSelectedId] = useState('');
  const [clock, setClock] = useState(temp);
  const [initialVal, setInitialVal] = useState({});
  const [deletedImages, setDeletedImages] = useState([]);
  const [modalVisibility, setModalVisibility] = useState({
    delete: false,
    saveEdit: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [loadingApi, setLoadingApi] = useState(false);

  const toggleModalVisibility = useCallback((key) => {
    setModalVisibility((state) => ({ ...state, [key]: !state[key] }));
  }, []);

  const getField = useCallback(() => {
    setLoadingApi(true);
    getFieldUserId(token, search)
      .then((res) => setField(res.data.data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingApi(false));
  }, [search, token]);

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

  const onChangeImageCover = useCallback((e) => {
    setVal((val) => ({ ...val, image_cover: e }));
  }, []);

  const onChangeImageDetail = useCallback(
    (e, deletedImage) => {
      let keyToMatch = deletedImage.image ? 'image' : 'name';

      const newImageList = val.images.map((item) =>
        item[keyToMatch] === deletedImage[keyToMatch] ? e : item
      );
      setVal((val) => ({ ...val, images: newImageList }));

      // Add to deletedImages only when keyToMatch is 'image'
      if (keyToMatch === 'image') {
        setDeletedImages((images) => [...images, deletedImage.image]);
      }
    },
    [val.images]
  );

  const isValueEmpty = useMemo(() => {
    return Object.keys(val).length === 0;
  }, [val]);

  const isValueNotChanged = useMemo(
    () => _.isEqual(val, initialVal),
    [val, initialVal]
  );

  const handleOnSelect = useCallback((value) => {
    setVal(value);
    setInitialVal(value);
    setDeletedImages([]);
    window.scrollTo(0, 0);
  }, []);

  const handleReset = useCallback(() => {
    setVal({});
    setInitialVal({});
    setDeletedImages([]);
  }, []);

  const handleSubmit = useCallback(
    async (value) => {
      try {
        const { id, ...val } = value;
        let formData = new FormData();
        if (typeof val['image_cover'] === 'string') delete val['image_cover'];

        Object.keys(val).forEach((key) => {
          setIsSaving(true);
          if (key === 'images') {
            val.images.forEach((image) => {
              if (!image.image) formData.append(`images`, image);
            });
          } else {
            formData.append(key, val[key]);
          }
        });
        const deletedImage = deletedImages.join(',');
        if (deletedImage) formData.append('imageDelete', deletedImage);
        await editFieldOwner(token, formData, id);
        toggleModalVisibility('saveEdit');
        setIsSaving(false);
        message.success('Edit Field Success');
        handleReset();
        getField();
      } catch (error) {
        message.info(error.response.data.msg);
        setIsSaving(false);
        toggleModalVisibility('saveEdit');
      }
    },
    [token, deletedImages, toggleModalVisibility, handleReset]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        setIsDeleting(true);
        await deleteFieldById(id, token);
        message.success('Delete Field Success');
        setSelectedId('');
        setIsDeleting(false);
        toggleModalVisibility('delete');
        getField();
      } catch (error) {
        message.info(error.response.data.msg);
        setIsDeleting(false);
        toggleModalVisibility('delete');
      }
    },
    [token, toggleModalVisibility, getField]
  );

  useEffect(() => {
    getField();
  }, [search]);

  return (
    <>
      <div className='p-4'>
        <Button
          type='ghost'
          icon={<PlusCircleOutlined />}
          style={{ fontFamily: 'Tilt Neon' }}
          onClick={() => navigate('/fields')}
        >
          Add Field
        </Button>
        <Button
          type='primary'
          icon={<FundViewOutlined />}
          style={{ fontFamily: 'Tilt Neon' }}
        >
          {isEditMode ? 'Edit Field' : 'View Field'}
        </Button>

        <div className='my-4'>
          <hr />
          {!isValueEmpty && (
            <>
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
                        disabled={!isEditMode}
                      />
                    </div>
                    <div className='py-2'>
                      <Title level={5}>Type Field</Title>
                      <Select
                        disabled={!isEditMode}
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
                        disabled={!isEditMode}
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
                        disabled={!isEditMode}
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
                      <Input
                        name='description'
                        value={val.description}
                        onChange={(e) => onChange(e)}
                        placeholder='Description Booking'
                        disabled={!isEditMode}
                      />
                    </div>
                    <div className='py-2'>
                      <Title level={5}>Price</Title>
                      <Input
                        name='price'
                        value={priceFormatter(val?.price || 0)}
                        onChange={(e) => {
                          const values = e.target.value;
                          const parser = values.replace(/[^0-9]/g, '');
                          onChange(parser, 'number');
                        }}
                        placeholder='price'
                        disabled={!isEditMode}
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
                        disabled={!isEditMode}
                        style={{ width: '100%' }}
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
                            label: 'jakarta utara',
                          },
                          {
                            value: 'jakarta selatan',
                            label: 'jakarta selatan',
                          },
                          {
                            value: 'jakarta barat',
                            label: 'jakarta barat',
                          },
                          {
                            value: 'jakarta timur',
                            label: 'jakarta timur',
                          },
                          {
                            value: 'jakarta pusat',
                            label: 'jakarta pusat',
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
                        disabled={!isEditMode}
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
                        disabled={!isEditMode}
                        accept='image/png, image/jpg, image/jpeg, image/webp'
                        maxCount={1}
                        showUploadList={true}
                        beforeUpload={true}
                        listType='picture'
                        defaultFileList={[
                          {
                            name: val.image_cover,
                            status: 'done',
                            url: val.image_cover,
                          },
                        ]}
                        onChange={({ file }) => onChangeImageCover(file, true)}
                      >
                        <Button
                          className='flex gap-2 items-center'
                          style={{ backgroundColor: '#ffb73f' }}
                          disabled={!isEditMode}
                        >
                          Upload
                        </Button>
                      </Upload>
                    </div>
                    <div className='py-2'>
                      <Title level={5}>Upload Image Detail</Title>
                      {val.images.length > 0 &&
                        val.images.map((image, idx) => (
                          <Upload
                            disabled={!isEditMode}
                            key={idx}
                            listType='picture'
                            accept='image/png, image/jpg, image/jpeg, image/webp'
                            defaultFileList={[
                              {
                                name: image.image,
                                status: 'done',
                                url: image.image,
                              },
                            ]}
                            maxCount={1}
                            multiple
                            showUploadList={true}
                            beforeUpload={true}
                            onChange={({ file }) =>
                              onChangeImageDetail(file, image)
                            }
                          >
                            <Button
                              className='flex gap-2 items-center my-3'
                              disabled={!isEditMode}
                              style={{ backgroundColor: '#ffb73f' }}
                            >
                              Upload
                            </Button>
                          </Upload>
                        ))}
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
                        disabled={!isEditMode}
                      />
                    </div>
                    <div className='py-2'>
                      <Title level={5}>Name Indetity</Title>
                      <Input
                        placeholder='Information Bank & No Rekening'
                        value={profile?.no_rekening || '-'}
                        readOnly
                        disabled={!isEditMode}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>

              <div className='d-flex w-100 flex-row justify-content-end gap-4'>
                <Button
                  type='primary'
                  danger
                  className='my-3'
                  style={{ width: '200px' }}
                  onClick={handleReset}
                  icon={<CloseCircleOutlined />}
                >
                  Close
                </Button>
                {isEditMode ? (
                  <Button
                    type='primary'
                    className='my-3'
                    style={{ width: '200px' }}
                    disabled={isValueNotChanged}
                    onClick={() => toggleModalVisibility('saveEdit')}
                    icon={<CheckCircleOutlined />}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    className='my-3'
                    style={{ width: '200px' }}
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </>
          )}
          <Typography.Title level={3} className='mt-2' underline>
            Information Detail Fields
          </Typography.Title>
          <div className='d-flex flex-row align-items-center mb-3'>
            <Row>
              <Col span={24}>
                <p style={{ fontFamily: 'Tilt Neon', paddingBottom: '10px' }}>
                  Search Name :
                </p>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='search name'
                  allowClear
                />
              </Col>
            </Row>
          </div>
          {/* <Skeleton> */}
            <Table
              columns={columns}
              loading={loadingApi}
              dataSource={field.map((value, index) => ({
                key: index + 1,
                no: index + 1,
                name: value.name,
                openClose: `${value.start_hour}:00 - ${value.end_hour}:00`,
                type: value.type,
                city: value.city,
                address: value.address,
                price: priceFormatter(value?.price || 0),
                action: (
                  <>
                    <Button
                      type='primary'
                      onClick={() => {
                        handleOnSelect(value);
                        setIsEditMode(false);
                      }}
                      style={{ marginRight: '10px' }}
                      icon={<FundViewOutlined />}
                    >
                      View
                    </Button>
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() => {
                        handleOnSelect(value);
                        setIsEditMode(true);
                      }}
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#ffb73f',
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type='primary'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setSelectedId(value.id);
                        toggleModalVisibility('delete');
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ),
              }))}
            />
          {/* </Skeleton> */}
        </div>
        <Modal
          title='Apakah anda yakin ingin menyimpan perubahan?'
          open={modalVisibility.saveEdit}
          onCancel={() => toggleModalVisibility('saveEdit')}
          onOk={() => {
            handleSubmit(val);
          }}
          okText='Ok'
          confirmLoading={isSaving}
        />
        <Modal
          title='Apakah anda yakin ingin menyimpan perubahan?'
          open={modalVisibility.delete}
          onCancel={() => toggleModalVisibility('delete')}
          onOk={() => {
            handleDelete(selectedId);
          }}
          okText='Ok'
          confirmLoading={isDeleting}
        />
      </div>
    </>
  );
}

export default EditField;
