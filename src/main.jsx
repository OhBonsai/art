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

console.log(arts)
console.log(import.meta.env)


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Intro>Hello Traveler</Intro>
        <Container>
            {
                arts.map((art, idx)=>(
                    <OneSketch key={idx} onClick={()=>{
                        window.location.href = import.meta.env.BASE_URL + "/" + art.created_at
                    }}>
                        <img className={"img-container"} alt={art.name} src={import.meta.env.BASE_URL + art.snapshot}/>
                        <div className={"name"}>{art.name}</div>
                        <div className={"time"}>{art.created_at}</div>
                    </OneSketch>
                ))
            }
        </Container>
    </React.StrictMode>
)
