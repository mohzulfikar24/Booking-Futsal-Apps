import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { verifyEmail } from '../utils/Axios'
import ImageUser from '../assets/avatar_removebg-preview.png'

function VerifyEmail() {

    const navigate = useNavigate()
    const params = useParams()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        verifyEmail(params.id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    },[])



  return (
    <>
        <div className="d-flex flex-row justify-content-center align-items-center" style={{height:'100vh', width:'100%'}}>
          <img src={ImageUser} alt="defaultImages" width={100} height={100} />
          <div className="d-flex flex-column align-items-start justify-content-center">
            <p style={{ fontFamily: "Tilt Neon", marginBottom:'10px' }}>{loading ? 'Wait a few minutes, the system is still verifying the account' : 'The account has been successfully verified by the system'}</p>
            <Button loading={loading} type='primary' onClick={(e) => navigate('/')} >to Login</Button>
          </div>
        </div>
    </>
  )
}

export default VerifyEmail