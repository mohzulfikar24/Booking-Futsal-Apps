import React from 'react'
import Navbar from '../components/parents/Navbar'
import { Row, Col } from 'antd'
import logoDKI from '../assets/ball.jpeg'
import FormRelog from '../components/parents/FormRelog'
import Footer from '../components/parents/Footer'

function Home() {
  return (
    <>
        {/* <Navbar /> */}
            <div className="w-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="#ffb73f" fillOpacity="1" d="M0,256L48,224C96,192,192,128,288,90.7C384,53,480,43,576,53.3C672,64,768,96,864,90.7C960,85,1056,43,1152,69.3C1248,96,1344,192,1392,240L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>

                <div style={{width:'100%', padding:'30px 30px'}}>
                    <Row>
                        <Col span={10}>
                            <div className='w-100 d-flex flex-row justify-content-center align-items-center'>
                                <img src={logoDKI} width={300} height={300} alt="LogoDKIJakarta" style={{padding:'20px'}} />
                            </div>
                        </Col>
                        <Col span={14}>
                            <FormRelog />
                        </Col>
                    </Row>
                </div>

            </div>
        {/* <Footer /> */}
    </>
  )
}

export default Home