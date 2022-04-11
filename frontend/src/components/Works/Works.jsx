import React from 'react'
import './works.css'
import Upwork from '../../utils/images/Upwork.png'
import Fiverr from '../../utils/images/fiverr.png'
import Shopify from '../../utils/images/Shopify.png'
import Amazon from '../../utils/images/amazon.png'
import Facebook from '../../utils/images/Facebook.png'
const Works = () => {
  return (
    <div className="works">
      <div className="left">
        <span>Works for All these</span>
        <span>Brands & clients</span>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          <br />
          inventore quaerat alias nulla ipsa dicta facilis voluptates?
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          <br />
          Earum, commodi! A omnis ducimus enim, nostrum itaque
        </span>
        <button className="button services-button">Hire me</button>
        <div
          className="blur service-blur-1"
          style={{ background: '#abf1ff94' }}
        ></div>
      </div>
      <div className="works-right">
        <div className="works-mainCircle">
          <div className="works-secCircle">
            <img src={Upwork} alt="upwork" />
          </div>
          <div className="works-secCircle">
            <img src={Fiverr} alt="fiverr" />
          </div>
          <div className="works-secCircle">
            <img src={Amazon} alt="amazon" />
          </div>{' '}
          <div className="works-secCircle">
            <img src={Shopify} alt="shpoify" />
          </div>
          <div className="works-secCircle">
            <img src={Facebook} alt="facebook" />
          </div>
        </div>
        <div className="works-backCircle blueCircle"></div>
        <div className="works-backCircle yellowCircle"></div>
      </div>
    </div>
  )
}

export default Works
