import React from 'react'
import './intro.css'
import Github from '../../utils/images/github.png'
import LinkedIn from '../../utils/images/linkedin.png'
import Instagram from '../../utils/images/instagram.png'
import Vector1 from '../../utils/images/Vector1.png'
import Vector2 from '../../utils/images/Vector2.png'
import boy from '../../utils/images/boy.png'
import thumbup from '../../utils/images/thumbup.png'
import crown from '../../utils/images/crown.png'
import glassesimoji from '../../utils/images/glassesimoji.png'
import FloatingDiv from '../../CommonComponents/FloatingDiv/FloatingDiv'
const Intro = () => {
  return (
    <div className="intro">
      <div className="intro-left">
        <div className="intro-name">
          <span>Hi! I Am</span>
          <span>Fida Hussain</span>
          <span>
            MERN Stack developer of having more than two years of experience
            worked on different types of projects based on Redux, JWT,
            MaterialUI,Mongodb, and Quality work
          </span>
        </div>
        <button className=" button intro-button">Hire me!</button>
        <div className="intro-icons">
          <a href="https://github.com/FidaHussain87/" target="_blank">
            <img src={Github} alt="github" />
          </a>
          <a
            href="https://www.linkedin.com/in/fida-hussain-shahani-7a6796119/"
            target="_blank"
          >
            <img src={LinkedIn} alt="LinkedIn" />
          </a>
          <a href="https://www.instagram.com/fidahussain_rk/" target="_blank">
            <img src={Instagram} alt="Instagram" />
          </a>
        </div>
      </div>
      <div className="intro-right">
        <img src={Vector1} alt="vector1" />
        <img src={Vector2} alt="vector2" />
        <img src={boy} alt="boy" />
        <img src={glassesimoji} alt="emoji" />
        <div className="intro-floatingdiv-right">
          <FloatingDiv crown={crown} txt1="Web" txt2="Developer" />
        </div>
        <div className="intro-floatingdiv-bottom">
          <FloatingDiv crown={thumbup} txt1="Best designer" txt2="Award" />
        </div>
        <div className=" blur blur-right"></div>
        <div
          className=" blur blur-left"
          
        ></div>
      </div>
    </div>
  )
}

export default Intro
