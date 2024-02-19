import React, { useState } from "react";
import Navbar from "../../components/parents/Navbar";
import Footer from "../../components/parents/Footer";
import css from "../../styles/ProfileCustome.module.css";
import { Button, Col, Input, Modal, Row, Select, Skeleton, Steps, Upload, message } from "antd";
import Picture from "../../assets/chair1.jpg";
import Picture2 from "../../assets/chair.jpg";
import { CloudUploadOutlined, EditOutlined, FormOutlined, KeyOutlined, RadiusBottomrightOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import TitleName from "../../components/childern/TitleName";
import { useDispatch, useSelector } from "react-redux";
import authAction from "../../redux/actions/auth";
import { changeIdentity, changePassword } from "../../utils/Axios";

function Profile() {
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch()

  const [viewProfile, setViewProfile] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [val, setVal] = useState(profile);
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [listImage, setListImage] = useState(false);
  const [bank, setBank] = useState({})
  const [valPassword, setValPassword] = useState({})
  const [ktp, setKtp] = useState(null)
  const [loadPassword, setLoadPassword] = useState(false)
  const [loadEdit, setLoadEdit] = useState(false)
  const [loadImages, setLoadImages] = useState(false)

  const handleViewProfile = () => {
    setViewProfile(!viewProfile);
    if (viewProfile) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleEditProfile = async () => {
    try {
      setLoadEdit(true)
      let formData = new FormData()
      Object.keys(val).forEach((key) => {
        if(val[key]) formData.append(key, val[key])
      });
      const result = await dispatch(authAction.editProfile(token, formData))
      message.success('Success edit profile')
      setEditProfile(false)
      setLoadEdit(false)
    } catch (err) {
      message.error('Failed Load Data')
      setLoadEdit(false)
    }
  };

  const handleImageProfile = (file, fileList) => {
    // console.log("fileee", file.type == "image/jpeg");
    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/PNG" || file.type == "image/JPEG" || file.type == "image/jpg" || file.type == "image/JPG") {
      setListImage(true);
      setVal({ ...val, image: file });
    } else {
      setListImage(false);
      setVal({ ...val, image: profile.image });
      message.info("Format can`t accept please insert picture again");
    }
  };
  
  const handleEditPassword = async () => {
    try {
      setLoadPassword(true)
      await changePassword(token,valPassword)
      setValPassword({})
      setEditPassword(false)
      message.success("success edit password")
      setLoadPassword(false)
    } catch (error) {
      message.info(error.response.data.msg)
      setLoadPassword(false)
    }
  };

  const handleBlurBank = async () => {
    if(bank.name && bank.norek){
      try {
        const body = {
          bank_name : bank.name,
          no_rekening : bank.norek
        }
        const result = await dispatch(authAction.editProfile(token, body))
        setBank({})
        message.info('Bank Save')
      } catch (error) {
        setBank({})
        message.info('Maintanance Server')
      }
    }
  }

  const handleChangeImageIdentity = async (file, fileList) => {
    try {
        setLoadImages(true)
        if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/PNG" || file.type == "image/JPEG" || file.type == "image/jpg" || file.type == "image/JPG") {
        let body = new FormData()
        if(file) body.append('image_identity', file)
        message.info('please wait to upload image')
        await dispatch(authAction.changeKTP(token, body))
        message.success('success upload image identity')
        setLoadImages(false)
        return
      } else {
        message.info("Format can`t accept please insert picture again");
      }
    } catch (error) {
      setLoadImages(false)
      console.log("error")
    }
  }
  // console.log("first", val);

  // console.log("selectorProfile", profile)

  return (
    <>
      <div className={css.backgroundContainer}>
        <div className="d-flex flex-row justify-content-center align-items-center w-100">
          <Row className="w-75 my-5" gutter={[20, 20]}>
            <Col span={12}>
              <div className="w-100">
                {/* Card left */}
                <div className={`${css.card__left}`}>
                  <TitleName label="P R O F I L E" size={3} />
                  <hr style={{ backgroundColor: "black", width: "100%" }} />
                  <Skeleton loading={loadEdit} active>
                    <img src={profile.image} width={400} height={250} alt="" style={{ borderRadius: "20px", marginBottom: "40px", boxShadow: "5px 5px 20px 2px #262626" }} />
                  </Skeleton>
                  <div className="d-flex flex-column align-items-start w-100">
                    <Button onClick={handleViewProfile} icon={<RadiusBottomrightOutlined />} style={{ fontFamily: "Tilt Neon" }}>
                      View Profile
                    </Button>
                    {viewProfile ? (
                      <Row style={{ width: "100%", marginTop: "20px" }}>
                        <Col span={7} style={{ fontFamily: "Tilt Neon" }}>
                          <p>No. Identity</p>
                          <p>Name</p>
                          <p>Email</p>
                          <p>Phone Number</p>
                          <p>Gender</p>
                          <p>City</p>
                          <p>Alamat</p>
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
                        </Col>
                        <Col span={16} style={{ fontFamily: "Tilt Neon" }}>
                          <p>{profile.no_identity || "-"}</p>
                          <p>{profile.full_name || "-"}</p>
                          <p>{profile.phone_number || "-"}</p>
                          <p>{profile.email || "-"}</p>
                          <p>{profile.gender || "-"}</p>
                          <p>{profile.location || "-"}</p>
                          <p>{profile.address || "-"}</p>
                          <p>{profile.role || "-"}</p>
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                  <div className="d-flex flex-row justify-content-end w-100 gap-2">
                    <Button
                      type="dashed"
                      danger
                      style={{ marginTop: "20px", fontFamily: "Tilt Neon" }}
                      onClick={() => setEditPassword(true)}
                      icon={<KeyOutlined />}
                    >
                      Edit Password
                    </Button>
                    <Button type="primary" danger style={{ marginTop: "20px", fontFamily: "Tilt Neon" }} onClick={() => setEditProfile(true)} icon={<EditOutlined />}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Content Right */}
            <Col span={12}>
              <div className="w-100">
                {/* Card left */}
                <div style={{ backgroundColor: "#ffb73f", padding: "10px 0 0 20px", borderRadius: "20px" }}>
                  <TitleName label="I D E N T I T Y" size={4} />
                  <hr style={{ backgroundColor: "black", width: "100%" }} />
                </div>
                <div className={`${css.card__right}`}>
                  <Skeleton loading={loadImages} active>
                    <img src={profile.image_identity} width={240} height={190} alt="" style={{ borderRadius: "20px", boxShadow: "5px 5px 20px 2px #262626" }} />
                  </Skeleton>
                  <div className="d-flex flex-column justify-content-end w-100 gap-2 ms-4">
                    <Upload beforeUpload={profile.image_identity} showUploadList={false} accept='image/png, image/jpg, image/jpeg, image/webp' onChange={({ file, fileList }) => handleChangeImageIdentity(file, fileList)} maxCount={1}>
                      <Button type="primary" danger style={{ fontFamily: "Tilt Neon" }} icon={<CloudUploadOutlined />}>
                        Upload Identity
                      </Button>
                    </Upload>
                    {/* <Upload>
                      <Button type="dashed" danger style={{ fontFamily: "Tilt Neon" }} icon={<CloudUploadOutlined />}>
                        Change Identity
                      </Button>
                    </Upload> */}
                  </div>
                </div>
              </div>

              <div className={css.paymentMethod}>
                <TitleName label="Payment Method" size={4} />
                <p style={{ fontSize: "12px", marginBottom: "10px", fontWeight: "bold" }}>
                  Please check the payment again before saving. because you only register the payment method once and name payment method must same with your name
                </p>
                <Row gutter={[20, 20]}>
                  <Col span={8}>
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Choose Bank"
                      optionFilterProp="children"
                      // onChange={onChangeLocation}
                      autoClearSearchValue={true}
                      allowClear={true}
                      value={bank.name}
                      onChange={(e) => setBank({...bank, name : e})}
                      onBlur={handleBlurBank}
                      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                      options={["BCA", "BNI", "BRI", "DANA"].map((val) => ({
                        value: val,
                        label: val,
                      }))}
                    />
                  </Col>
                  <Col span={16}>
                    <Input 
                      placeholder="Input number rekening" 
                      value={bank.norek}
                      onBlur={handleBlurBank} 
                      maxLength={25}
                      onChange={(e) => {
                        const values = e.target.value;
                        const parser = values.replace(/[^0-9]/g, "");
                        setBank({...bank, norek : parser})} 
                      }
                    />
                  </Col>
                </Row>
                <p style={{ fontSize: "16px", marginBottom: "10px", marginTop: "10px", fontWeight: "bold" }}>Bank Registered</p>
                <Row>
                  <Col className={css.bankRegister} span={7}>
                    <p>{profile.bank_name}</p>
                  </Col>
                  <Col className={css.bankRegister} span={1}>
                    <p>:</p>
                  </Col>
                  <Col className={css.bankRegister} span={16}>
                    <p>{profile.no_rekening}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modal Edit Data Profile */}
      <Modal title="Edit Profile" open={editProfile} confirmLoading={loadEdit} onOk={handleEditProfile} onCancel={() => {setEditProfile(false); setVal(profile)}}>
        <Row style={{ width: "100%" }}>
          <Col span={7} style={{ fontFamily: "Tilt Neon" }}>
            <p>Name</p>
            <p style={{ marginTop: "20px" }}>No Identity</p>
            <p style={{ marginTop: "20px" }}>Email</p>
            <p style={{ marginTop: "20px" }}>Location</p>
            <p style={{ marginTop: "20px" }}>Alamat</p>
            <p style={{ marginTop: "20px" }}>Phone Number</p>
            <p style={{ marginTop: "20px" }}>Gender</p>
            <p style={{ marginTop: "20px" }}>Status</p>
            <p style={{ marginTop: "20px" }}>Image Profile</p>
          </Col>
          <Col span={1} style={{ fontFamily: "Tilt Neon" }}>
            <p>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
            <p style={{ marginTop: "20px" }}>:</p>
          </Col>
          <Col span={16} style={{ fontFamily: "Tilt Neon" }}>
            <Input value={val.full_name} onChange={(e) => setVal({ ...val, full_name: e.target.value })} />
            <Input value={val.no_identity} onChange={(e) => setVal({ ...val, no_identity: e.target.value })} style={{ marginTop: "10px" }} />
            <Input value={val.email} onChange={(e) => setVal({ ...val, email: e.target.value })} style={{ marginTop: "10px" }} disabled />
            {/* <Input value={val.location} onChange={(e) => setVal({ ...val, location: e.target.value })} style={{ marginTop: "10px" }} /> */}
            <Select
              showSearch
              placeholder='Select Location'
              value={val.location}
              onChange={(e) => setVal({ ...val, location: e || ''})}
              allowClear={true}
              style={{ marginTop: "10px", width:'100%' }}
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
            <Input value={val.address} onChange={(e) => setVal({ ...val, address: e.target.value })} style={{ marginTop: "10px" }} />
            <Input value={val.phone_number} onChange={(e) => setVal({ ...val, phone_number: e.target.value })} style={{ marginTop: "10px" }} disabled />
            <Input value={val.gender} onChange={(e) => setVal({ ...val, gender: e.target.value })} style={{ marginTop: "10px" }} />
            <Input value={val.role} onChange={(e) => setVal({ ...val, role: e.target.value })} style={{ marginTop: "10px" }} disabled />
            <Upload beforeUpload={profile.image} showUploadList={listImage} accept='image/png, image/jpg, image/jpeg' listType="picture" defaultFileList={[
                              {
                                name: profile.image,
                                status: 'done',
                                url: profile.image
                              },
                            ]} onChange={({ file, fileList }) => handleImageProfile(file, fileList)} maxCount={1}>
              <Button style={{ marginTop: "10px" }} type="primary">
                Upload Profil
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>

      {/* Modal Edit Password */}
      <Modal title="Edit Password" confirmLoading={loadPassword} open={editPassword} onOk={handleEditPassword} onCancel={() => {setEditPassword(false); setValPassword({})}}>
        <Row style={{ width: "100%" }}>
          <Col span={7} style={{ fontFamily: "Tilt Neon" }}>
            <p>Old Password</p>
            <p style={{ marginTop: "23px" }}>New Passowrd</p>
            <p style={{ marginTop: "23px" }}>Confirm Password</p>
          </Col>
          <Col span={1} style={{ fontFamily: "Tilt Neon" }}>
            <p>:</p>
            <p style={{ marginTop: "23px" }}>:</p>
            <p style={{ marginTop: "23px" }}>:</p>
          </Col>
          <Col span={16} style={{ fontFamily: "Tilt Neon" }}>
            <Input.Password
              placeholder="input old password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              value={valPassword.oldpass}
              onChange={(e) => setValPassword({...valPassword, oldpass : e.target.value})}
            />
            <Input.Password
              style={{ marginTop: "10px" }}
              placeholder="input new password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              value={valPassword.newpass}
              onChange={(e) => setValPassword({...valPassword, newpass : e.target.value})}
            />
            <Input.Password
              style={{ marginTop: "10px" }}
              placeholder="input confirm password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              value={valPassword.confirmpass}
              onChange={(e) => setValPassword({...valPassword, confirmpass : e.target.value})}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default Profile;
