import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './slider.css'
const Slider = (props) => {
  const { images } = props
  return (
    <div className="slider">
      <Swiper
        className="swiper-slide"
        spaceBetween={30}
        slidesPerView={3}
        grabCursor={true}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Slider
