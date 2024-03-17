import React from 'react'
import ReactDOM from 'react-dom/client'
import arts from './meta.json'
import styled from "styled-components";


const Intro = styled.div`
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
`

const OneSketch = styled.div`
  min-width: 400px;
  max-width: 400px;
  margin: 8px;
  height: 380px;
  border: 2px solid red;
  cursor: pointer;


  .img-container {
    width: 400px;
    height: 250px;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease;
  }
  
  .img-container:hover {
    filter: none;
  }
    
  
  .name {
    font-size: 1.5rem;
    font-weight: bolder;
    margin-left: 4px;
    margin-bottom: 8px;
    margin-top: 4px;
    text-transform: uppercase;
  }

  .description {
    font-size: 0.8rem;
    margin-left: 4px;
    color: #3c3c3c;
    font-weight: lighter
  }
  
  .time {
    margin-left: 4px;
    font-size: 1.2rem;
    font-weight: bolder;
    margin-bottom: 8px;
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
                        <div className={"description"}>{art.description}</div>
                    </OneSketch>
                ))
            }
        </Container>
    </React.StrictMode>
)
