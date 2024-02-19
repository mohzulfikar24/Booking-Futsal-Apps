import React, { useState } from "react";
import { InputNumber, Row, Col, Typography, Input } from "antd";

function InputNumberList({ val = "", change = () => {}, name = "", keys = "", label = "", type = "list" }) {
  const { Title } = Typography;

  /* 
        // Cara menggunakan component ini
        // <InputNumber label='username' val={val.username} change={(e) => onChange(e)} keys='username' name='username' type='list' />
        
        // NOTED
        // val = menampilkan value
        // change = untuk mengubah value (tetapi handle untuk otak atik value nya ada di parent yang mengimport nya)
        // keys = untuk memasukan nama value. ex => {nameKeys : isiValue}
        // label = untuk memberikan nama disebelah kiri inputan
        // type = untuk menentukan bentuk dari inputan memanjang atau menurun
    */

  return (
    <>
      <div className="p-2">
        {
          (type == "list" ? (
            <Row gutter={24}>
              <Col span={12}>
                <Title level={5}>{label}</Title>
              </Col>
              <Col span={12}>
                <Input
                  value={val}
                  name={name}
                  status={val ? "" : "error"}
                  onChange={(e) => {
                    const values = e.target.value;
                    const parser = values.replace(/[^0-9]/g, "");
                    change({ [keys]: parser });
                  }}
                />
              </Col>
            </Row>
          ) : (
            <Row gutter={24}>
              <Col span={12}>
                <Title level={5}>{label}</Title>
                <Input
                  value={val}
                  name={name}
                  status={val ? "" : "error"}
                  onChange={(e) => {
                    const values = e.target.value;
                    const parser = values.replace(/[^0-9]/g, "");
                    change({ [keys]: parser });
                  }}
                />
              </Col>
            </Row>
          ))
        }
      </div>
    </>
  );
}

export default InputNumberList;
