import React, { useContext, useEffect, useState } from "react";
import { Form, message, Input, Button, Modal } from "antd";
import { store } from "../../../helper/Reducer";
import authActions from "../../../redux/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword, sendEmail } from "../../../utils/Axios";

function Login() {
  const [val, setVal] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);

  // const context = useContext(store)
  // const { state, dispatch } = context

  // console.log("isiState", state)

  // // useEffect(()=>{
  // //   dispatch({type:'SET', payload:{test:'lala'} })
  // // },[])

  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [email, setEmail] = useState(null);
  const [loadEmail, setLoadEmail] = useState(false)
  const [password, setPassword] = useState({
    otp : null,
    new_password : null,
    confirm_password : null
  })
  const [loadPassword, setLoadPassword] = useState(false)

  // handle jika form semua field terisi
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const body = {
        email: values.email,
        passwords: values.password,
      };
      await dispatch(authActions.loginThunk(body));
      navigate("/dashboard");
      setLoading(false);
      message.success("Login success");
    } catch (error) {
      message.error(error)
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {  
      setLoadEmail(true)
      const response = await sendEmail(email)
      message.info(response.data.msg)
      setEmail(null);
      setShowForgot(false);
      setShowChange(true);
      setLoadEmail(false)
    } catch (error) {
      console.log(error);
      setLoadEmail(false)
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoadPassword(true)
      const res = await forgotPassword(password)
      message.success('success change password')
      setPassword({
        otp : null,
        new_password : null,
        confirm_password : null
      })
      setShowChange(false)
      setLoadPassword(false)
    } catch (error) {
      message.info(error.response.data.msg)
      setLoadPassword(false)
    }
  }

  return (
    <>
      <div className="">
        <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{ maxWidth: "100%" }} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Please Input Your Email Correctly",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="" style={{ padding: "10px 0 10px 120px", fontFamily: "Tilt Neon" }}>
            <p>
              Click here if you forgot password ?{" "}
              <span onClick={() => setShowForgot(true)} style={{ color: "blue", textDecoration: "underline" }}>
                forgot password
              </span>
            </p>
          </div>

          <Form.Item
            wrapperCol={{
              offset: 5,
              // span: 20,
            }}
          >
            <Button type="primary" loading={loading} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Modal forgot Password */}
      <Modal
        title="Forgot Password"
        open={showForgot}
        okText={"oke"}
        closeIcon={false}
        footer={[
          <Button
            onClick={() => {
              setShowForgot(false);
              setEmail(null);
            }}
          >
            Cancel
          </Button>,
          <Button loading={loadEmail} onClick={() => handleSendEmail()} form="submit" key="submit" htmlType="submit" disabled={!email} type="primary">
            Send
          </Button>,
        ]}
      >
        <hr />
        <div className="d-flex flex-column gap-2" style={{ fontFamily: "Tilt Neon" }}>
          <p>Send Email</p>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="input email"
          />
        </div>
      </Modal>

      <Modal
        title="Change Password"
        open={showChange}
        okText={"oke"}
        closeIcon={false}
        onOk={() => handleChangePassword()}
        onCancel={() => {
          setShowChange(false);
          setShowForgot(false);
          setEmail(null);
        }}
        footer={[
          <Button
            onClick={() => {
              setShowChange(false);
              setShowForgot(false);
              setEmail(null);
            }}
          >
            Cancel
          </Button>,
          <Button loading={loadPassword} onClick={() => handleChangePassword()} disabled={!password.otp || !password.confirm_password || !password.new_password} type="primary">
            Submit
          </Button>,
        ]}
      >
        <hr />
        <div className="d-flex flex-column gap-2">
          <div className="d-flex flex-column gap-2" style={{ fontFamily: "Tilt Neon" }}>
            <p>Code OTP</p>
            <Input value={password.otp} onChange={(e) => setPassword({...password, otp : e.target.value})} placeholder="input code OTP" />
          </div>
          <div className="d-flex flex-column gap-2" style={{ fontFamily: "Tilt Neon" }}>
            <p>New Password</p>
            <Input.Password value={password.new_password} onChange={(e) => setPassword({...password, new_password : e.target.value})} placeholder="input New Password" />
          </div>
          <div className="d-flex flex-column gap-2" style={{ fontFamily: "Tilt Neon" }}>
            <p>Confirm Password</p>
            <Input.Password value={password.confirm_password} onChange={(e) => setPassword({...password, confirm_password : e.target.value})} placeholder="input Confirm Password" />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Login;
