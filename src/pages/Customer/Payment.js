import React, { useEffect, useState } from "react";
// import Navbar from "../../components/parents/Navbar";
// import Footer from "../../components/parents/Footer";
import {
  Button,
  Card,
  Col,
  Row,
  Steps,
  Typography,
  Input,
  DatePicker,
  Upload,
  message,
  Space,
} from "antd";
import TitleName from "../../components/childern/TitleName";
import css from "../../styles/Payment.module.css";
import Sample from "../../assets/chair.jpg";
import locale from "antd/es/date-picker/locale/id_ID";
import dayjs from "dayjs";
import { getDetailField, postPaymentCustomer } from "../../utils/Axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import { useSelector } from "react-redux";

function Payment() {

  const profile = useSelector(state => state.auth.profile)
  const token = useSelector(state => state.auth.token)
  const navigate = useNavigate()


  const [bookingTime, setBookingTime] = useState({
    clockIn: null,
    clockOut: null,
  });
  const [username, setUsername] = useState(null);
  const [bukti, setBukti] = useState(null)
  const { Title } = Typography;
  const [date, setDate] = useState(new Date());
  const [fieldData, setFieldData] = useState(null);
  const [hour, setHour] = useState([])
  const [showimage, setShowimage] = useState(true)
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(2)
  const params = useParams();


  const costing = (price) => {
    return (
      "Rp " +
      parseFloat(price)
        .toFixed()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    );
  };

  const onChangeDate = (date, dateString) => {
    setDate(dateString);
  };

  useEffect(() => {
    getField();
  }, [date]);
  

  const getField = async () => {
    try {
      // console.log("dataeww", moment(date).format('YYYY-MM-DD'))
      const dataField = await getDetailField(params.id, moment(date).format('YYYY-MM-DD'))
      await setFieldData(dataField.data.data);
      setBookingTime({ ...bookingTime, clockIn: null, clockOut: null })
      setHour(dataField.data.data.dataValue)
    } catch (error) {
      console.log({ error });
    }
  };



  const onChangeBooking = (e) => {
    setBookingTime({
      clockIn : e.start,
      clockOut : e.end
    })
  }

  const onChangeImage = (file) => {
    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/PNG" || file.type == "image/JPEG" || file.type == "image/jpg" || file.type == "image/JPG") {
      setShowimage(true);
      setBukti(file);
    } else {
      setShowimage(false);
      setBukti(null);
      message.info("Format can`t accept please insert picture again");
    }
  }

  
  const postPayment = () => {
    if(!token) return( message.info('please login first'), navigate('/'))
    if(!username) return message.info('please insert username booking !')
    if(!bookingTime.clockIn || !bookingTime.clockOut) return message.info('please choose time booking !')
    if(!bukti) return message.info('please uploading file transfer !')
    if(!price) return message.info('please insert payment price')
    if(!profile.bank_name || !profile.no_rekening) return (message.info('please insert number rekening first'), navigate('/profile'))
    
    setLoading(true)
    let body = {
      image : bukti,
      field_id : params.id,
      start_play : bookingTime.clockIn,
      end_play : bookingTime.clockOut,
      booking_date : moment(date).format('YYYY-MM-DD'),
      total_payment : fieldData.field.price,
      play_date : moment().format('YYYY-MM-DD'),
      username : username,
      bank_name : profile.bank_name,
      no_rekening : profile.no_rekening,
      total_dp : price
    }

    const formData = new FormData()
    Object.keys(body).forEach((e,index) => {
      formData.append(e, body[e])
    })

    postPaymentCustomer(token,formData)
    .then((res) => {
      window.scrollTo(0, 0);
      message.success(res.data.msg)
      setStep(3)
      setBookingTime({
        clockIn: null,
        clockOut: null,
      })
      setUsername(null)
      setBukti(null)
      setDate(new Date())
      // console.log("response", res.data.data)
      
      setTimeout(() => {
        navigate('/historypayment')
      }, 3000);
    })
    .catch((error) => {
      message.info('server maintanance')
    })
    .finally(() => setLoading(false))
  }


  return (
    <>

      <div className="w-100">
        <Row>
          {/* Kiri */}
          <Col span={5}>
            <div className="p-4">
              <TitleName size={4} label="Descriptions" />
              <hr />
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: "12px",
                  color: "black",
                  marginTop: "20px",
                }}
              >
                <p>{fieldData?.field?.description||'-'}</p>
              </div>
            </div>
          </Col>

          {/* Kanan */}
          <Col
            span={19}
            style={{ borderLeft: "2px solid #69b1ff", margin: "10px auto" }}
          >
            <div className="p-4">
              <div className="me-4 my-4">
                <p className={css.fontStyle}>Payment Fields Soccer Jakarta</p>
                <hr style={{ color: "#69b1ff" }} />
                <Steps
                  size="small"
                  current={step}
                  items={[
                    {
                      title: "Booking soccer fields",
                    },
                    {
                      title: "Booking payment",
                    },
                    {
                      title: "Success booking",
                    },
                  ]}
                />
              </div>
              <div className="">
                <Row gutter={[20, 20]}>
                  <Col span={12}>
                    <TitleName size={5} label="Detail soccer fields" />
                    <div className="d-flex flex-row flex-wrap w-100 gap-3">
                     {fieldData && <img
                        src={fieldData.field.image_cover}
                        alt=""
                        width={150}
                        height={100}
                        style={{
                          borderRadius: "20px",
                          boxShadow: "5px 5px 20px 2px #262626",
                        }}
                      />}
                      {fieldData?.images && fieldData.images.map((images) => (
                        <img
                          src={images.image}
                          alt=""
                          width={150}
                          height={100}
                          style={{
                            borderRadius: "20px",
                            boxShadow: "5px 5px 20px 2px #262626",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <TitleName size={4} label="Description" />
                      <Row>
                        <Col style={{ fontFamily: "Tilt Neon" }} span={7}>
                          <p>- Futsal Name</p>
                          <p>- City</p>
                          <p>- Schedule</p>
                          <p>- Price</p>
                        </Col>
                        <Col style={{ fontFamily: "Tilt Neon" }} span={1}>
                          <p>:</p>
                          <p>:</p>
                          <p>:</p>
                          <p>:</p>
                        </Col>
                        <Col style={{ fontFamily: "Tilt Neon" }} span={16}>
                          <p>{fieldData?.field?.name || '-'}</p>
                          <p>{fieldData?.field?.city || '-'}</p>
                          <p>{`${fieldData?.field?.start_hour || '-'}:00 - ${fieldData?.field?.end_hour || '-'}:00`}</p>
                          <p>{`${costing(fieldData?.field?.price || 0)} / hour`}</p>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={12} style={{ borderLeft: "1px solid grey" }}>
                    <TitleName size={4} label="Playing schedule" />
                    <hr style={{ color: "#69b1ff" }} />
                    <Space className="pb-3">
                      <TitleName size={5} label="Select Date : " />
                      <DatePicker
                        onChange={onChangeDate}
                        value={dayjs(date)}
                        locale={locale}
                        allowClear={false}
                        disabledDate={(current) => {
                          const date = new Date();
                          date.setDate(date.getDate() - 1);
                          return current && current < dayjs(date).endOf('day');
                        }}  
                      />
                    </Space>
                    
                    <div className="d-flex flex-row flex-wrap w-100 gap-3">
                      
                      {/* Button Booking */}
                        {hour.map((e,index) => (
                          <Row className="d-flex flex-row flex-wrap">
                            <Col span={24} className="d-flex flex-column align-items-center gap-2" style={{backgroundColor:'#eaeaea', padding:'15px', borderRadius: "20px", }}>
                              <p style={{ fontFamily: "Tilt Neon", fontWeight:'bolder' }}>{`${e.start <= 9 ? 0 : ''}${e.start}:00 - ${e.end  <= 9 ? 0 : ''}${e.end  == 24 ? '00' : e.end}:00`}</p>
                              <Button 
                                onClick={() => onChangeBooking(e)} 
                                type='primary' 
                                danger={moment().days >= e.start ? true : false } 
                                disabled={e.isBooked || moment().format('YYYY-MM-DD') > moment(date).format('YYYY-MM-DD') || moment().days >= e.start ? true : false}
                              >
                                  {e.isBooked ? 'Booked' : moment().days >= e.start ? "Late" : 'Ready'}
                              </Button>
                            </Col>
                          </Row>
                        ))}
      
                    </div>
                    <hr style={{ color: "#69b1ff" }} />
                    <TitleName
                      size={5}
                      label={`Clock in : ${bookingTime.clockIn ?? "-"}${
                        bookingTime.clockIn ? ":00" : ""
                      }`}
                    />
                    <TitleName
                      size={5}
                      label={`Clock Out : ${bookingTime.clockOut ?? "-"}${
                        bookingTime.clockOut ? ":00" : ""
                      }`}
                    />
                  </Col>
                </Row>
                <Row gutter={[20, 20]} className="mt-5">
                  <Col span={8}>
                    <Card
                      title="Information Booking"
                      bordered={true}
                      headStyle={{ backgroundColor: "#ffb73f", color: "#FFF" }}
                      bodyStyle={{
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
                      }}
                    >
                      <div className="py-2">
                        <Title level={5}>Username</Title>
                        <Input value={username} status={username ? '' : 'error'}  onChange={(e) => setUsername(e.target.value)} placeholder="Username Booking" />
                      </div>
                      <div className="py-2">
                        <Title level={5}>No Identity</Title>
                        <Input value={profile.no_identity} placeholder="Number Identity" disabled />
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card
                      title="Schedule"
                      bordered={true}
                      headStyle={{ backgroundColor: "#ffb73f", color: "#FFF" }}
                      bodyStyle={{
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
                      }}
                    >
                      <div className="py-2">
                        <Title level={5}>Clock In</Title>
                        <Input value={`${bookingTime?.clockIn || '00'}:00`} placeholder="Clock in" disabled />
                      </div>
                      <div className="py-2">
                        <Title level={5}>Clock Out</Title>
                        <Input value={`${bookingTime?.clockOut || '00'}:00`} placeholder="Clock out" disabled />
                      </div>
                      <div className="py-2">
                        <Title level={5}>Date</Title>
                        <Input value={moment(date).format('DD-MM-YYYY')} placeholder="Date" disabled />
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card
                      title="Payment Method"
                      bordered={true}
                      headStyle={{ backgroundColor: "#ffb73f", color: "#FFF" }}
                      bodyStyle={{
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='11' height='11' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='rgba(255, 255, 255,1)'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='0' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3Ccircle cx='40' cy='20' r='1' fill='rgba(236, 201, 75,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ")`,
                      }}
                    >
                      <div className="py-2">
                        <Title level={5}>Transfer</Title>
                        <p>BCA 4104021123 a/n Muhammad farisan H</p>
                      </div>
                      <div className="py-2">
                        <Title level={5}>Price</Title>
                        <p>{costing(fieldData?.field?.price || 0)}</p>
                      </div>
                      <div className="py-2">
                        <Title level={5}>Payment price</Title>
                        <Input
                          name='price'
                          value={costing(price)}
                          onChange={(e) => {
                            const values = e.target.value;
                            const parser = values.replace(/[^0-9]/g, '');
                            if(fieldData?.field?.price > parser){
                              setPrice(parser);
                            }else{
                              setPrice(fieldData?.field?.price)
                            }
                          }}
                          placeholder='price'
                        />
                      </div>
                      <div className="py-2">
                        <Title level={5}>Upload Payment</Title>
                        <Upload beforeUpload={true} listType="picture" accept='image/png, image/jpg, image/jpeg, image/webp' maxCount={1} showUploadList={showimage} onChange={({file}) => onChangeImage(file)}>
                          <Button type="primary" style={{ width: "100%" }}>
                            upload
                          </Button>
                        </Upload>
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Button loading={loading} type="primary" onClick={postPayment} >Payment</Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default Payment;
