import React from 'react'
import ReviewSlider from '../../CommonComponents/ReviewSlider/ReviewSlider'
import './testimonials.css'
import client1 from '../../utils/images/profile1.jpg'
import client2 from '../../utils/images/profile2.jpg'
import client3 from '../../utils/images/profile3.jpg'
import client4 from '../../utils/images/profile4.jpg'

const Testimonials = () => {
  const clients = [
    {
      image: client1,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.\
             Velit iure facere ut repellendus. Velit eius, veniam officia\
              impedit obcaecati suscipit accusamus quidem deleniti, \
              magni exercitationem similique earum, sed ipsam. Consequatur.',
    },
    {
      image: client2,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.\
             Velit iure facere ut repellendus. Velit eius, veniam officia\
              impedit obcaecati suscipit accusamus quidem deleniti, \
              magni exercitationem similique earum, sed ipsam. Consequatur.',
    },
    {
      image: client3,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.\
             Velit iure facere ut repellendus. Velit eius, veniam officia\
              impedit obcaecati suscipit accusamus quidem deleniti, \
              magni exercitationem similique earum, sed ipsam. Consequatur.',
    },
    {
      image: client4,
      review:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.\
               Velit iure facere ut repellendus. Velit eius, veniam officia\
                impedit obcaecati suscipit accusamus quidem deleniti, \
                magni exercitationem similique earum, sed ipsam. Consequatur.',
    },
  ]
  return (
    <div className="testimonial-wrapper">
      <div className="heading">
        <span>Clients always get </span>
        <span>Exceptional Work </span>
        <span>from me...</span>
      </div>
      <div
        className="blur t-blur1"
        style={{ background: 'var(--purple)' }}
      ></div>
      <div className="blur t-blur2" style={{ background: '#CAF0F8' }}></div>
      <div className="testimonial-slider">
        <ReviewSlider clients={clients} />
      </div>
    </div>
  )
}

export default Testimonials
