import { Button, Col, Collapse, Empty, Modal, Row, Select, Skeleton, Space, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { changeStatusPaymentOwner, getHistoryCustomer } from "../../utils/Axios";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import PdfDownload from '../../pdf/Index'

function History() {
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);

  const [status, setStatus] = useState("pending");
  const [collapse, setCollapse] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadCancel, setLoadCancel] = useState(false)
  const [data, setData] = useState([]);
  const [showView, setShowView] = useState(false)
  const [imagePayment, setImagePayment] = useState(null)
  const [dataPdf, setDataPdf] = useState({})

  // onChange status di select
  const changeStatus = (key) => {
    setStatus(key ?? "pending");
  };

  // onChange buka tutup collapse nya
  const changeTabCollapse = (e) => {
    setCollapse(e);
  };

  // untuk membuka activeKey collapse ke tab 1 jika merubah status
  useEffect(() => {
    getHistoryPayment();
    setCollapse(["1"]);
  }, [status]);

  const costing = (price) => {
    return (
      "Rp " +
      parseFloat(price)
        .toFixed()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    );
  };

  const getHistoryPayment = async () => {
    try {
      setLoading(true);
      const result = await getHistoryCustomer(token, status);
      setData(result.data.data);
      setLoading(false);
    } catch (error) {
      console.log("errorGetPaymentCustomer", error);
      message.info("server maintance");
      setLoading(false);
    }
  };

  const handlePaymentStatus = async (e) => {
    // await changeStatusPaymentOwner(token, value)
    // getHistoryPayment()
    try {
      setLoadCancel(true)
      console.log("easdqwe", e)
      await changeStatusPaymentOwner(token, e.id, {status : 'cancel'})
      getHistoryPayment()
      setLoadCancel(false)
    } catch (error) {
      setLoadCancel(false)
      console.log(error)
    }
  }

  return (
    <>
      <div className="px-4 pt-4">
        <Typography.Title level={3} className="" underline>
          Information History Payment
        </Typography.Title>
      </div>

      <div className="p-4">
        <Select
          showSearch
          placeholder="History status"
          value={status}
          onChange={changeStatus}
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

        {/* Table Collapse */}
        <Skeleton loading={loading} paragraph={{ rows: 12 }} active={true}>
          <Collapse defaultActiveKey={["0"]} accordion onChange={(e) => changeTabCollapse(e)}>
            {data?.map((e, i) => (
              <Collapse.Panel
                header={`${e.name} (${e.isDp ? 'down payment' : 'full payment'}) || ${moment(e.play_date).format("DD-MM-YYYY")}`}
                key={i}
                activeKey={"1"}
                style={{ backgroundColor: "#1677ff", fontFamily: "Tilt Neon", color:'#FFF' }}
              >
                <Row>
                  <Col span={5} style={{ fontFamily: "Tilt Neon" }}>
                    <p>No. Identity</p>
                    <p>Account Name</p>
                    <p>Booking Name</p>
                    <p>Email</p>
                    <p>Phone Number</p>
                    <p>Gender</p>
                    <p>City</p>
                    <p>Address</p>
                    <p>Date Booking</p>
                    <p>Schedule Playing</p>
                    <p>Price</p>
                    <p>Payment price</p>
                    <p>Bank Customer</p>
                    <p>Bank Owner</p>
                    <p>Status</p>
                  </Col>
                  <Col span={1} style={{ fontFamily: "Tilt Neon" }}>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                  </Col>
                  <Col span={12} style={{ fontFamily: "Tilt Neon" }}>
                    <p>{profile?.no_identity || "-"}</p>
                    <p>{profile?.full_name || "-"}</p>
                    <p>{e?.username || "-"}</p>
                    <p>{profile?.email || "-"}</p>
                    <p>{profile?.phone_number || "-"}</p>
                    <p>{profile?.gender || "-"}</p>
                    <p>{e?.city || "-"}</p>
                    <p>{e?.address || "-"}</p>
                    <p>{moment(e?.booking_date).format('DD-MM-YYYY') || "-"}</p>
                    <p>{`${moment(e?.play_date).format('DD-MM-YYYY')}, ${e.start_play <= 9 ? 0 : ''}${e.start_play}:00 - ${e.end_play  <= 9 ? 0 : ''}${e.end_play  == 24 ? '00' : e.end_play}:00`}</p>
                    <p>{costing(e?.total_payment) || "-"}</p>
                    <p>{costing(e?.total_dp) || "-"}</p>
                    <p>{`${e.bank_name} - ${e.bank_number}`}</p>
                    <p>{`${e.owner_bank} - ${e.owner_norek}`}</p>
                    <p>{e?.status || "-"}</p>
                  </Col>
                  <Col span={6} className="d-flex flex-row align-activeKey-center justify-content-end">
                    <Space >
                      {status === 'pending' ? <Button type="primary" onClick={() => {setShowView(true); setDataPdf(e)}}>Bukti Transfer</Button> : null}
                      {status === 'pending' ? <Button loading={loadCancel} type="primary" danger onClick={() => handlePaymentStatus(e)}>Cancel Booking</Button> : <Button type="primary" onClick={() => {setShowView(true); setDataPdf(e)}}>Bukti Transfer</Button>}
                    </Space>
                  </Col>
                </Row>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Skeleton>
          {data.length > 0 ? null : <Empty />}
      </div>

      {/* Modal View */}
      <Modal title="Evidence of transfer" 
        open={showView}
        okText={'oke'}
        closeIcon={false}
        onOk={() => setShowView(false)}
        onCancel={() => setShowView(false)}
        width={1000}
      >
        <hr />
        <div className="w-100 d-flex justify-content-center">
          <PdfDownload data={dataPdf} />
        </div>
        <hr />
      </Modal>
    </>
  );
}

export default History;
