import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import './reviewSlider.css'
const ReviewSlider = (props) => {
  const { clients } = props

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={30}
      slidesPerView={1}
      grabCursor={true}
      className="review-swiper"
    >
      {clients.map((client, index) => (
        <SwiperSlide key={index}>
          <div className="review-wrapper">
            <img src={client.image} alt="client" />
            <span>{client.review}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default ReviewSlider
