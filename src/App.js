import './App.css';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { 
  GoogleMap, 
  useJsApiLoader,
  useLoadScript,
  Marker,
  InfoWindow,
  MarkerClusterer
} from '@react-google-maps/api';

import mapStyles from "./mapStyle";
import CreateForm from "./component/CreateForm"

const libraries = ['places']
const mapContainerStyle = {
  width : '75vw',
  height:"100vh"
}
const center = {
  lat:37.7749,
  lng: -122.4194
}

const option = {
  styles: mapStyles,
  disableDefaultUI:true,
  zoomControl:true,
}

function App() {
  const {isLoaded,loadError} = useLoadScript({
    googleMapsApiKey: "AIzaSyAG_V1WEKU4fsQU46WVNyKBlA71gnbvCDw",
    libraries,
    });
  



  const [points,setPoint] = useState([]);
  


  const mapRef = useRef();
  const onMapLoad = useCallback((map)=>{
    mapRef.current = map
  },[])

  const panTo = useCallback(({lat,lng})=>{
        mapRef.current.panTo({lat,lng});
        mapRef.current.setZoom(13);
  },[]);


  const [detail, setDetail] = useState(null)

  useEffect(() => {
    // storing input name
    const retrievedData = localStorage.getItem("points");
    const initial  = JSON.parse(retrievedData);
    setPoint(initial)
  });

  if (loadError) return "Error"
  if (!isLoaded) return "Laoding Maps"

  return (
    
    
    <div>
      <CreateForm setPoint={setPoint} panTo = {panTo}/>
      <GoogleMap mapContainerStyle={mapContainerStyle} 
      zoom={11} 
      center={center}
      options= {option}
      // onClick = {mapClick}
      onLoad = {onMapLoad}
      >
        {points.map((point) => (
        <Marker 
          key = {point.location}
          position = {{lat:parseFloat(point.lat), lng: parseFloat(point.lng)}} 
          onClick={()=>{
            setDetail(point)
          }}
        />

      ))}
      {localStorage.setItem("points", JSON.stringify(points))}

      {detail ? (<InfoWindow 
      position={{lat:detail.lat, lng: detail.lng}} 
      onCloseClick = {()=>{
        setDetail(null)
      }}
      >
        <div>
          <h2>{detail.location}</h2>
          <p>{detail.description}</p>
        </div>
      </InfoWindow>) : null}
      </GoogleMap>
    </div>
  );
}

export default App;
