import React, { useCallback, useMemo, useState } from "react";
import { Button, Card, Tooltip } from "antd";
import Login from "./child/Login";
import Register from "./child/Register";
import { InfoCircleOutlined } from "@ant-design/icons";

const tabList = [
  {
    key: "Login",
    tab: "Login",
  },
  {
    key: "Register",
    tab: "Register",
  },
];

function FormRelog() {
  const [activeTabKey1, setActiveTabKey1] = useState("Login");
  
  const changeTab = useCallback((key) => {
    setActiveTabKey1(key)
  },[])
  
  const contentList = useMemo(() => ({
    Login: <Login />,
    Register: <Register changeTab={changeTab}  />,
  }),[])



  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };
  
  function info() {
    const notif = activeTabKey1 == 'Login' ? "Register if you don't have account" : 'Login if you have account '
    return (
      <>
        <Tooltip title={notif} color={'geekblue'} key={'geekblue'}>
          <InfoCircleOutlined />
        </Tooltip>
      </>
    )
  }

  return (
    <Card
      style={{
        width: "85%",
        color:'white'
      }}
      title={`Form ${activeTabKey1}`}
      extra={info()}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={onTab1Change}
      headStyle={{backgroundColor:'#ffb73f', fontSize:'20px', color:'#FFF'}}
      hoverable={true}
    >
      {contentList[activeTabKey1]}
    </Card>
  );
}

export default FormRelog;
