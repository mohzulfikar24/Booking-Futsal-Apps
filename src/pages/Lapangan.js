import React, { useEffect, useState } from "react";
import Navbar from "../components/parents/Navbar";
import Footer from "../components/parents/Footer";
import { Button, Col, Input, Row, Select, Skeleton, Steps, message } from "antd";
import TitleName from "../components/childern/TitleName";
import css from "../styles/Lapangan.module.css";
import sample from "../assets/chair1.jpg";
import { useNavigate } from "react-router-dom";
import { BookOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { allFieldCustomer } from "../utils/Axios";
import { useSelector } from "react-redux";

function Lapangan() {
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token)
  const [filter, setFilter] = useState({});
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState({prev : null, next : null})
  const [loading, setLoading] = useState(false)

  const onChangeName = (value) => {
    setFilter({ ...filter, [value.target.name]: value.target.value });
  };

  const onChangeLocation = (value) => {
    setFilter({ ...filter, ["location"]: value || "" });
  };

  const onChangeSort = (value) => {
    setFilter({ ...filter, ["sort"]: value || "" });
  };
  

  useEffect(() => {
    getALLField()
  },[page])

  const costing = (price) => {
    return (
      "Rp " +
      parseFloat(price)
          .toFixed()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    );
  };

  const getALLField = async () => {
    try {
      setLoading(true)
      const result = await allFieldCustomer(filter.name, filter.location, filter?.sort || 'cheapest', page || 1)
      setData(result.data.data)
      setTotalPage({
        prev : result.data.meta.prev,
        next : result.data.meta.next,
      })
      setLoading(false)
    } catch (error) {
      message.error('Server maintance')
      setLoading(false)
    }
  }

  const handleFilterClick = async (isClick) => {
    if(isClick){
      try {
        setLoading(true)
        const result = await allFieldCustomer(filter.name, filter.location, filter?.sort || 'cheapest', page || 1)
        setData(result.data.data)
        setTotalPage({
          prev : result.data.meta.prev,
          next : result.data.meta.next,
        })
        setLoading(false)
      } catch (error) {
        message.error('Server maintance')
        setLoading(false)
      }
    }else{
      setFilter({})
      try {
        setLoading(true)
        const result = await allFieldCustomer()
        setData(result.data.data)
        setTotalPage({
          prev : result.data.meta.prev,
          next : result.data.meta.next,
        })
        setLoading(false)
      } catch (error) {
        message.error('Server maintance')
        setLoading(false)
      }
    }
  }

  console.log("asdqwqw", filter)

  return (
    <>
      <div className="w-100">
        <div className="w-100">
          <Row>
            {/* Kiri */}
            <Col span={5}>
              <div className="p-4">
                <TitleName size={4} label="FILTER" />
                <TitleName size={5} color="abu" label="name soccer" />
                <Input value={filter.name} name="name" onChange={onChangeName} allowClear={true} placeholder="Input search name" />
                <TitleName size={5} color="abu" label="lokasi" />
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select Location Soccer Fields"
                  optionFilterProp="children"
                  onChange={onChangeLocation}
                  // onSearch={onSearch}
                  value={filter.location}
                  autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={[
                    {
                      value: "jakarta utara",
                      label: "Jakarta Utara",
                    },
                    {
                      value: "jakarta selatan",
                      label: "Jakarta Selatan",
                    },
                    {
                      value: "jakarta barat",
                      label: "Jakarta Barat",
                    },
                    {
                      value: "jakarta timur",
                      label: "Jakarta Timur",
                    },
                    {
                      value: "jakarta pusat",
                      label: "Jakarta Pusat",
                    },
                  ]}
                />
                <TitleName size={5} color="abu" label="Sorting" />
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Sorting Price"
                  optionFilterProp="children"
                  onChange={onChangeSort}
                  // onSearch={onSearch}
                  value={filter.sort}
                  // autoClearSearchValue={true}
                  allowClear={true}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={[
                    {
                      value: "cheapest",
                      label: "cheapest",
                    },
                    {
                      value: "expensive",
                      label: "expensive",
                    }
                  ]}
                />

                <div className="d-flex flex-row justify-content-start gap-2 mt-4">
                  <Button type="primary" onClick={() => handleFilterClick(true)}>Filter</Button>
                  <Button onClick={() => handleFilterClick(false)}>Reset</Button>
                </div>

                <hr style={{ marginTop: "50px" }} />
                <div style={{ fontStyle: "italic", fontSize: "12px", color: "black", marginTop: "20px" }}>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, ipsum, modi atque fuga ut dolorum corrupti, delectus alias quia eligendi quod quae provident!
                    Possimus quaerat officia animi sint! Repellendus, omnis amet. Alias velit voluptas optio magni necessitatibus repellat natus quas qui obcaecati maxime quia
                    placeat aut eum nobis laudantium, neque architecto et, id ab quaerat sint inventore esse. Quos vero odio modi
                  </p>
                </div>
              </div>
            </Col>

            {/* Kanan */}
            <Col span={19} style={{ borderLeft: "2px solid #69b1ff", margin: "10px auto" }}>
              <div className="p-4">
                <div className="me-4 my-4">
                  <p className={css.fontStyle}>Choose Fields Soccer Jakarta</p>
                  <hr />
                  <Steps
                    size="small"
                    current={0}
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
                <Skeleton active loading={loading}>
                  <Row>
                    {data.map((value, index) => (
                      <Col span={8} key={index}>
                        <div className={css.card} style={{ cursor: "pointer" }} onClick={() => {token ? navigate(`/lapangan/${value.id}`) : navigate(`/lapanganview/${value.id}`)}  }>
                          <div className="d-flex flex-column">
                            <img src={value.image_cover} alt="" width={"300px"} height={"200px"} style={{ backgroundSize: "cover" }} />
                          </div>
                          <div className={css.card__content}>
                            <p className={css.card__title} style={{fontFamily:'Tilt Neon'}}>{value.name}</p>
                            <p style={{fontSize:'14px', fontFamily:'Tilt Neon'}}>Price : {costing(value?.price || 0)}</p>
                            <p style={{fontSize:'14px', fontFamily:'Tilt Neon'}}>Open Field : {`${value?.start_hour || '-'}:00 - ${value?.end_hour || '-'}:00`}</p>
                            <p style={{fontSize:'12px', fontFamily:'Tilt Neon'}}>Description : {value.description}</p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="d-flex flex-row justify-content-between w-100 mt-4">
                    <Button type="primary" onClick={() => setPage(page - 1)} disabled={!totalPage.prev}>Back</Button>
                    <Button type="primary" onClick={() => setPage(page + 1)} disabled={!totalPage.next}>Next</Button>
                  </div>
                </Skeleton>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Lapangan;
