import React from 'react'
import { Typography } from 'antd';


function TitleName({size = 5, label='', color=''}) {

    const { Title } = Typography;

    // menentukan warna
    const changeLanguageColor = () => {
    switch (color) {
            case 'abu':
                return 'secondary'
            case 'hijau':
                return 'success'
            case 'kuning':
                return 'warning'
            case 'merah':
                return 'danger'
            case 'putih':
                return '#FFF'
            default:
                return '';
        }
    }

    /* 
        // level = untuk menentukan besar atau kecil nya huruf
        // type = untuk menentukan warna dari huruf tersebut
        // label = title untuk di tampilkan
    */

  return (
    <>
        <div className="">
            <Title style={{marginBottom:'10px', marginTop:'10px'}} level={size} type={changeLanguageColor()}>{label}</Title>
        </div>
    </>
  )
}

export default TitleName