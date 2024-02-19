import React from 'react'
import { useSelector } from 'react-redux'
import ImageUser from '../assets/avatar_removebg-preview.png'

function Dashboard() {
    const email = useSelector(state => state.auth.profile.email)
  return (
    <>
        <div className="d-flex flex-column justify-content-center align-items-center gap-3" style={{height:'70vh', width:'100%'}}>
          <img src={ImageUser} alt="defaultImages" width={200} height={200} />
            <p style={{ fontFamily: "Tilt Neon", marginBottom:'10px' }}>Hello, {email}</p>
          {/* <div className="d-flex flex-column align-items-start justify-content-center" style={{height:'100%', width:'100%'}}>
          </div> */}
        </div>
    </>
  )
}

export default Dashboard