import { Table, Typography, Space, Tag, Select, Input, message, Button, Dropdown, Modal, Row, Col, DatePicker, Descriptions, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changeStatusPaymentOwner, editPaymentSchedule, getDetailField, getHistoryOwner } from "../../utils/Axios";
import moment from "moment/moment";
import priceFormatter from "../../utils/priceFormatter";
import locale from "antd/es/date-picker/locale/id_ID";
import dayjs from "dayjs";
import { PlusCircleOutlined, FundViewOutlined, CloseCircleOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

function PaymentOwner() {
  


  const [field, setField] = useState([])
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showChange, setShowChange] = useState(false)
  const [image, setImage] = useState('')
  const [changeVal, setChangeVal] = useState({})
  const [booking, setBooking] = useState([])
  const [id, setId] = useState(null)
  const [dataConfirm, setDataConfirm] = useState({})

  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    getPayment()
  },[status, filter])

  const getPayment = async () => {
    try {
      setLoading(true)
      const response = await getHistoryOwner(token, status, filter?.name || '', filter?.type || '')
      setField(response.data.data)
      setLoading(false)
    } catch (error) {
      message.info('can`t load data or server maintanance')
      setLoading(false)
    }
  }

  const columns = [
    {
      title: "no",
      dataIndex: "no",
      key: "no",
      fixed: 'left',
      width:50
    },
    {
      title: "no Identity",
      dataIndex: "noIdentity",
      key: "2",
      fixed: 'left',
      width: 150,
    },
    {
      title: "Name Account",
      dataIndex: "nameAccount",
      key: "3",
      fixed: 'left',
      width: 150,
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "4",
      width: 150,
    },
    {
      title: "Name Booking",
      dataIndex: "nameBooking",
      key: "5",
      width: 150,
    },
    {
      title: "Name Field",
      dataIndex: "nameField",
      key: "6",
      width: 150,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "7",
      width: 130,
    },
    {
      title: "Schedule hours",
      dataIndex: "scheduleHours",
      key: "8",
      width: 130,
    },
    {
      title: "Schedule date",
      dataIndex: "scheduleDate",
      key: "9",
      width: 130,
    },
    {
      title: "Type Field",
      dataIndex: "type",
      key: "10",
      width: 100,
    },
    {
      title: "Total Payment",
      dataIndex: "totalPayment",
      key: "11",
      width: 150,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "12",
      width: 120,
      fixed:'right',
      render : (e) => (
        <Tag color={e.isDp ? 'error' : "success"}>{e.isDp ? 'down payment' : 'full payment'}</Tag>
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: '13',
      width: 220,
      fixed:'right',
      render : (e) => (
        <Space size={[8, 16]}>
          <Space direction="vertical" size={'small'}>
              <Button onClick={() => {setShowView(true); setImage(e.image_payment)}} style={{backgroundColor:'#ffb73f', width:'100%'}} icon={<FundViewOutlined />}>View</Button>
              {e.status == 'pending' ? <Button onClick={() => handleShowChangeSchedule(e)} type="dashed" style={{width:'100%'}} icon={<EditOutlined />}>Edit</Button> : null}
          </Space>
            <Space direction="vertical" size={'small'}>
              {e.status == 'pending' ? <Button onClick={() => {setShowConfirm(true); setId(e.id); setDataConfirm(e)}} type='primary' style={{ width:'100%'}} icon={<CheckCircleOutlined />}>Confirm</Button> : null}
              {e.status == 'pending' ? <Button onClick={() => {setShowCancel(true); setId(e.id)}} type='primary' danger style={{ width:'100%'}} icon={<CloseCircleOutlined />}>Cancel</Button> : null}
              
          </Space>
        </Space>
      )
    },
  ];


  const handlePaymentStatus = async (value) => {
    await changeStatusPaymentOwner(token, id, {status : value})
    await getPayment()
    setDataConfirm({})
    setShowConfirm(false)
    setShowCancel(false)
  }

  const handleShowChangeSchedule = async (e) => {
    try {
      const values = {
        play_date : e.play_date,
        start_play : e.start_play,
        end_play : e.end_play
      }
      const res = await getDetailField(e.field_id, moment(e.play_date).format('YYYY-MM-DD'))
      setId(e.id)
      setBooking(res.data.data.dataValue) // jam booking
      setShowChange(true) // show modals
      setChangeVal(values) // get Data yang udah ada
    } catch (error) {
      console.log(error)
      message.info('failed load data')
    }
  }

  const onChangeBooking = (e) => {
    setChangeVal({
      ...changeVal,
      start_play : e.start,
      end_play : e.end
    })
  }

  const onChangeDate = (date, dateString) => {
    setChangeVal({...changeVal, play_date : dateString})
  };

  const patchSchedule = async () => {
    try {
      const res = await editPaymentSchedule(token , id, changeVal)
      // console.log(res.data)
      getPayment()
      setShowChange(false)
      message.success('Success edit data')
    } catch (error) {
      message.info('Failed edit data')
      setShowChange(false)
    }
  }


  return (
    <>
      <div className="p-4">
        <div>
          <Typography.Title level={3} className="my-3" underline>
            Confirm Payment
          </Typography.Title>

          <Select
            showSearch
            placeholder="History status"
            value={status}
            onChange={(e) => setStatus(e || 'pending')}
            allowClear
            style={{ width: "200px" }}
            options={[
              {
                value: "pending",
                label: "Menunggu konfirmasi",
              },
              {
                value: "success",
                label: "Sudah dikonfirmasi",
              },
              {
                value: "cancel",
                label: "Canceled",
              },
            ]}
          />
          <hr />


          <div className="d-flex flex-row align-items-center justify-content-start gap-2 my-3">
          <Typography.Title level={5} className="">search : </Typography.Title>
            <Input placeholder="search Name Booking" value={filter.name} onChange={(e) => setFilter({...filter, name : e.target.value})} style={{ width: "200px" }} />
            <Select
              showSearch
              placeholder="type field"
              value={filter.type}
              onChange={(e) => setFilter({...filter, type : e || ''})}
              allowClear
              style={{ width: "200px" }}
              options={[
                {
                  value: "Grass",
                  label: "Grass",
                },
                {
                  value: "Matras",
                  label: "Matras",
                },
              ]}
            />
          </div>

          {field.length > 0 ? <Table 
            scroll={{
              x: 1500,
              y: 300,
            }}
            loading={loading}
            columns={columns} 
            dataSource={field?.map((e,i) => ({
              key : i + 1, 
              no : i + 1,
              noIdentity : e.no_identity,
              nameAccount : e.full_name,
              phoneNumber : e.phone_number,
              nameBooking : e.username,
              nameField : e.name,
              city : e.city,
              scheduleHours : `${e.start_play}:00 - ${e.end_play}:00`,
              scheduleDate : moment(e.play_date).format('DD-MM-YYYY'),
              type : e.type,
              totalPayment : priceFormatter(e.total_payment),
              action : e,
              status : e
            }))} 
          /> : <Empty />}
        </div>
      </div>


      {/* Modal Confirm */}
      <Modal title="Confirm" 
        open={showConfirm} 
        onOk={() => {handlePaymentStatus('success')}} 
        onCancel={() => setShowConfirm(false)}
      >
        <p>{`Price = ${priceFormatter(dataConfirm.total_payment)}`}</p>
        <p>{`Payment price = ${priceFormatter(dataConfirm.total_dp)}`}</p>
        <p>{`Total Payment = ${priceFormatter(dataConfirm.total_payment - dataConfirm.total_dp)} (${dataConfirm.isDp ? 'down payment' : 'full payemnt'})`}</p>
        <p style={{fontWeight : 'bold'}}>Are u sure want to confirm this payment ?</p>
      </Modal>

      {/* Modal Cancel */}
      <Modal title="Cancel" 
        open={showCancel} 
        onOk={() => {handlePaymentStatus('cancel')}} 
        onCancel={() => setShowCancel(false)}
      >
        <p>Are u sure want to cancel this payment ?</p>
      </Modal>


      {/* Modal View */}
      <Modal title="Evidence of transfer" 
        open={showView}
        okText={'oke'}
        closeIcon={false}
        onOk={() => setShowView(false)}
        onCancel={() => setShowView(false)}
      >
        <div className="w-100 d-flex justify-content-center">
          <img src={image} alt="buktiTransfer" width={350} height={300} />
        </div>
      </Modal>


      <Modal title="Change Schedule" 
        open={showChange}
        okText={'oke'}
        closeIcon={false}
        onOk={() => patchSchedule()}
        onCancel={() => setShowChange(false)}
        width={'100%'}
      >
        <Row>
          <Col span={12}>
            <div className="p-4">
              <DatePicker
                onChange={onChangeDate}
                value={dayjs(changeVal.play_date)}
                locale={locale}
                allowClear={false}
                disabledDate={ (current) => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                return current && current < dayjs(date).endOf('day');
              }}
              />
              <hr />
              <div className="d-flex flex-row flex-wrap w-100 gap-3">
              {booking.map(e => (
                <Row className="d-flex flex-row flex-wrap">
                <Col span={24} className="d-flex flex-column align-items-center gap-2" style={{backgroundColor:'#eaeaea', padding:'15px', borderRadius: "20px", }}>
                  <p style={{ fontFamily: "Tilt Neon", fontWeight:'bolder' }}>{`${e.start <= 9 ? 0 : ''}${e.start}:00 - ${e.end  <= 9 ? 0 : ''}${e.end  == 24 ? '00' : e.end}:00`}</p>
                  <Button onClick={() => onChangeBooking(e)} type='primary' disabled={e.isBooked}>{e.isBooked ? 'Booked' : 'Ready'}</Button>
                </Col>
              </Row>
              ))}
              </div>
            </div>
          </Col>
          <Col span={12}>
          <Descriptions title="Information Booking">
            <Descriptions.Item label="Play Date">{moment(changeVal.play_date).format('DD-MM-YYYY')}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="">
            <Descriptions.Item label="Start Play">{`${changeVal?.start_play || '00'}:00`}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="">
            <Descriptions.Item label="End Play">{`${changeVal?.end_play || '00'}:00`}</Descriptions.Item>
          </Descriptions>
          </Col>
        </Row>
      </Modal>

    </>
  );
}

export default PaymentOwner;
