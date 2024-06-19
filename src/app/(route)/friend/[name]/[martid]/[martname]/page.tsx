'use client'
import SendMap from '../../../../../_components/main/map/SendMap';
import React from 'react'
import { useSearchParams } from 'next/navigation';
import { MapProvider } from"../../../../../_components/main/map/MapProvider";
const Page: React.FC = (props:any) => {
  
    const url=useSearchParams();
    console.log(props.params.name,props.params.martid)
    return (
    <div className="h-screen flex justify-center items-center">
      <MapProvider>
        <SendMap  address={props.params.name} martid={props.params.martid} martname={props.params.martname}/>
      </MapProvider>
    </div>
  )
}

export default Page;