import React from 'react'
import './portfolio.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import Sidebar from '../../utils/images/sidebar.png'
import Ecommerce from '../../utils/images/ecommerce.png'
import HOC from '../../utils/images/hoc.png'
import MusicApp from '../../utils/images/musicapp.png'
import Slider from '../../CommonComponents/Slider/Slider'

const Portfolio = () => {
  let images = [Sidebar, Ecommerce, HOC, MusicApp]
  return (
    <div className="portfolio">
      {/* Headings */}
      <span>Recent Projects</span>
      <span>Portfolio</span>
      {/* Slider */}
      <Slider images={images} />
    </div>
  )
}

export default Portfolio
