import React from 'react'
import ReactDOM from 'react-dom/client'
import arts from './meta.json'
import styled from "styled-components";


const Intro = styled.div`
`

const Container = styled.div`
  display: flex;
  padding: 16px;
`

const OneSketch = styled.div`
  min-width: 300px;
  margin: 8px;
  height: 300px;
  border: 2px solid red;
  cursor: pointer;
  

  .img-container {
    width: 300px;
    height: 250px;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease;
  }
  
  .img-container:hover {
    filter: none;
  }
  
  
  
  .name {
    
  }
  
  .time {
     
  }
`

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Intro>Hello Traveler, I am Julito</Intro>
        <Container>
            {
                arts.map((art, idx)=>(
                    <OneSketch key={idx} onClick={()=>{
                        window.location.href = `${import.meta.env.BASE_URL}/sketch${art.source}/index.html`
                    }}>
                        <img className={"img-container"} alt={art.name} src={`${import.meta.env.BASE_URL}/screenshots/${art.snapshot}`}/>
                        <div className={"name"}>{art.name}</div>
                        <div className={"time"}>{new Date(art.createdAt).toDateString()}</div>
                    </OneSketch>
                ))
            }
        </Container>
    </React.StrictMode>
)
