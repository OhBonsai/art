import React from 'react'
import ReactDOM from 'react-dom/client'
import arts from './meta.json'
import styled from "styled-components";


const Intro = styled.div`
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px;

`

const OneSketch = styled.div`
  min-width: 360px;
  max-width: 360px;
  margin: 8px;
  height: 360px;
  border: 2px solid gray;
  cursor: pointer;
  font-size: 16px;


  .img-container {
    width: 360px;
    min-height: 222px;
    max-height: 222px
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease;
  }
  
  .img-container:hover {
    filter: none;
  }

  .info-container {
    margin-left: 8px;
    margin-right: 8px;
  }
  
  .name {
    font-size: 1.2em;
    font-weight: bolder;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .time {
    font-size: 1em;
    font-weight: bolder;
    margin-bottom: 6px;
  }

  .description {
    font-size: 0.8em;
    color: #3c3c3c;
    font-weight: lighter;
    line-height: 1.1em;
    height: 3.3em;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow:hidden;
    text-overflow: ellipsis;
  }

  .tag-container {
    height: 1.3em;
    margin-bottom: 6px
  }

  .tag {
    display: inline-block;
    background-color: #e0e0e0;
    padding: 2px 4px;
    border-radius: 5px;
    margin-right: 5px;
    font-weight: bolder;
    font-size: 0.75em;
  }
  

`

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Intro>Hello Friends, I am 盆栽("pern-tzai") <a href="https://youjiantao.com"> about me</a></Intro>
        <Container>
            {
                arts.map((art, idx)=>(
                    <OneSketch key={idx} onClick={()=>{
                        window.location.href = `${import.meta.env.BASE_URL}/sketch${art.source}/index.html`
                    }}>
                        <img className={"img-container"} alt={art.name} src={`${import.meta.env.BASE_URL}/screenshots/${art.snapshot}`}/>
                        <div className="info-container">
                        <div className={"name"}>{art.name}</div>
                        <div className={"time"}>{new Date(art.createdAt).toDateString()}</div>
                        <div className='tag-container'>
                          {art.tags.map((t, i)=>(<span key={t+i} className='tag'>{t}</span>))}
                        </div>
                        <div className={"description"}>{art.description}</div>
                        </div>
                    </OneSketch>
                ))
            }
        </Container>
    </React.StrictMode>
)
