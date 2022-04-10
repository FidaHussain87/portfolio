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
        <button className="button services-button">Download CV</button>
        <div
          className="blur service-blur-1"
          style={{ background: '#abf1ff94' }}
        ></div>
      </div>
      <div className="right">
        <div>
          <Card
            emoji={HeartEmoji}
            heading={'Design'}
            detail={'Figma,Sketch,Photoshop AdobeXd,AdobeXd,'}
          />
        </div>
      </div>
    </div>
  )
}

export default Services
