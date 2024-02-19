import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PDFDownloadLink, Document, Page, Text, View, PDFViewer, Image } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
// import { DribbbleOutlined } from "@ant-design/icons"
import Images from '../assets/pemprov.png'
import moment from 'moment';




const Index = (dataPDF) => {
  return (
    <>
      <div className="d-flex flex-column w-100">

        <div className="my-4">
          <PDFDownloadLink document={<PdfRendered data={dataPDF}  />} fileName={`E-Field_Payment_Booking.pdf`}>
            <Button type='primary'>Download PDF</Button>
          </PDFDownloadLink>
        </div>

        <div style={{width:'100%', height:'400px'}}>
          <PDFViewer style={{width:'100%', height:'400px'}}>
            <PdfRendered data={dataPDF}  />
          </PDFViewer>
        </div>

      </div>
    </>
  );
}

const PdfRendered = ({data}) => {
  const val = data?.data || {}

  console.log("RenderDataPdf", val)

  const costing = (price) => {
    return (
      "Rp " +
      parseFloat(price)
          .toFixed()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    );
  };

  
  
  return (
    <Document>
      <Page size='A4'>
  
        <View style={{padding:'20px', width:'100%'}}>
  
        {/* Kop surat */}
        <View style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%'}}>
          <View style={{width:'20%'}}>
            <Image src={Images} style={{width:'100px', height:'100px'}} />
          </View>
          <View style={{display:'flex', flexDirection:'column', alignItems:'center', fontWeight:'bold', gap:'5px', width:'60%'}}>
            <Text style={{fontSize:'12px'}}>Soccer Fields DKI Jakarta</Text>
            <Text style={{fontSize:'10px'}}>Jl. Sumur Batu No.30, RT.0011/RW.02, Kec. Cempaka Putih</Text>
            <Text style={{fontSize:'10px'}}>Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 13410</Text>
          </View>
          <View style={{width:'20%'}}>
            <Image src={Images} style={{width:'100px', height:'100px'}} />
          </View>
        </View>

        <View style={{border:'1px solid black', width:'100%'}}></View>
  
        <View style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'10px 0'}}>
          <Text style={{fontWeight:'bold', textDecoration:'underline', fontSize:'8px', paddingBottom:'10px'}}>Booking Payment</Text>
          <Text style={{fontSize:'8px'}}>{val?.booking_date ? moment(val.booking_date).format("dddd, MMMM Do YYYY, h:mm:ss a") : ''}</Text>
        </View>
  
        <View style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <Text style={{fontWeight:'bold', textDecoration:'underline', fontSize:'10px'}}>Data Owner</Text>
            <View style={{display:'flex', flexDirection:'row', width:'100%'}}>
              <View style={{display:'flex', gap:'5px', width:'20%'}}>
                <Text style={{fontSize:'8px'}}>Name Field</Text>
                <Text style={{fontSize:'8px'}}>Type Field</Text>
                <Text style={{fontSize:'8px'}}>City</Text>
                <Text style={{fontSize:'8px'}}>Address</Text>
                <Text style={{fontSize:'8px'}}>Bank Name</Text>
                <Text style={{fontSize:'8px'}}>Number Rekening</Text>
              </View>
              <View style={{display:'flex', gap:'5px', width:'80%'}}>
                <Text style={{fontSize:'8px'}}>: {val?.name || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.type || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.city || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.address || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.owner_bank || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.owner_norek || ''}</Text>
              </View>
            </View>
          <Text style={{fontWeight:'bold', textDecoration:'underline', fontSize:'10px'}}>Data Customer</Text>
          <View style={{display:'flex', flexDirection:'row', width:'100%'}}>
              <View style={{display:'flex', gap:'5px', width:'20%'}}>
                <Text style={{fontSize:'8px'}}>Name booking</Text>
                <Text style={{fontSize:'8px'}}>Booking date</Text>
                <Text style={{fontSize:'8px'}}>Play date</Text>
                <Text style={{fontSize:'8px'}}>Hours play</Text>
                <Text style={{fontSize:'8px'}}>Bank name</Text>
                <Text style={{fontSize:'8px'}}>Number Rekening</Text>
                <Text style={{fontSize:'8px'}}>Total DP</Text>
                <Text style={{fontSize:'8px'}}>Total Payment</Text>
                <Text style={{fontSize:'8px'}}>Status</Text>
              </View>
              <View style={{display:'flex', gap:'5px', width:'80%'}}>
                <Text style={{fontSize:'8px'}}>: {val?.username || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.booking_date ? moment(val.booking_date).format('LL') : ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.play_date ? moment(val.play_date).format('LL') : ''}</Text>
                <Text style={{fontSize:'8px'}}>: {`${val?.start_play || '-'}:00 - ${val?.end_play || '-'}:00`}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.bank_name || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.bank_number || ''}</Text>
                <Text style={{fontSize:'8px'}}>: {costing(val?.total_dp || 0)}</Text>
                <Text style={{fontSize:'8px'}}>: {costing(val?.total_payment || 0)}</Text>
                <Text style={{fontSize:'8px'}}>: {val?.status || 'pending'}</Text>
              </View>
            </View>

            <Text style={{fontWeight:'bold', textDecoration:'underline', fontSize:'10px'}}>Proof of Payment</Text>
            <View style={{display:'flex', flexDirection:'row', width:'100%'}}>
              <Image src={val.image_payment} style={{width:'250px', height:'250px'}} />
            </View>
            
        </View>
  
        {/* <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:'50px', fontSize:'10px'}}>
          <View style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Text style={{height:'80px'}}>Name Karyawan</Text>
            <Text>{data.fullname ?? '.......'}</Text>
          </View>
          <View style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Text style={{height:'80px'}}>Name HRD</Text>
            <Text>..........................</Text>
          </View>
        </View> */}
  
        </View>
  
      </Page>
    </Document>
  );
}

export default Index;