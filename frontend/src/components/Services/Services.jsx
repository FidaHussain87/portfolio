import React from 'react'
import './services.css'
import HeartEmoji from '../../utils/images/heartemoji.png'
import Glasses from '../../utils/images/glasses.png'
import Humble from '../../utils/images/humble.png'
import Card from '../Card/Card'
const Services = () => {
  return (
    <div className="services">
      <div className="left">
        <span>My Awesome</span>
        <span>services</span>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          inventore quaerat alias nulla ipsa dicta facilis voluptates?
        </span>
        <a
          href="https://drive.google.com/file/d/1YM9FxJvxPciV1xVxVoVtIb17mDwu08J1/view?usp=sharing"
          download
        >
          <button className="button services-button">Download CV</button>
        </a>
        <div
          className="blur service-blur-1"
          style={{ background: '#abf1ff94' }}
        ></div>
      </div>
      <div className="right">
        <div style={{ left: '14rem' }}>
          <Card
            emoji={HeartEmoji}
            heading={'Design'}
            detail={'Figma, Sketch, Photoshop, AdobeXd, AdobeXd,'}
          />
        </div>
        <div style={{ left: '-4rem', top: '12rem' }}>
          <Card
            emoji={Glasses}
            heading={'Developer'}
            detail={'HTML, CSS, JS, React, Nodejs,'}
          />
        </div>
        <div style={{ left: '12rem', top: '19rem' }}>
          <Card
            emoji={Humble}
            heading={'UI/UX'}
            detail={'Fin-Tech, Ed-Tech, E-Commerce'}
          />
        </div>
        <div
          className="blur service-blur-2"
          style={{ background: 'var(--purple)' }}
        ></div>
      </div>
    </div>
  )
}

export default Services
