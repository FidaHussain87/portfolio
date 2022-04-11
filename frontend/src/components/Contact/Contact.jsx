import React from 'react'
import emailjs from '@emailjs/browser'
import { ToastContainer, toast } from 'react-toastify'
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader";
import 'react-toastify/dist/ReactToastify.css'
import './contact.css'
const override = css`
display: block;
margin: 0 auto;
border-color: red;
`;
const Contact = () => {
   

  const formRef = React.useRef()
  const [contactInfo, setContactInfo] = React.useState({
    email: '',
    name: '',
    message: '',
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const handleSendEmail = (e) => {
    e.preventDefault()
    if (!contactInfo.email || !contactInfo.name || !contactInfo.message) {
      alert("Fields can't be empty")
      return
    }
    setIsLoading(true)
    emailjs
      .sendForm(
        'service_a048mxj',
        'template_qb9orwn',
        formRef.current,
        'dMeUWfWb9hHT4qCIR',
      )
      .then(
        (result) => {
          setContactInfo({ email: '', name: '', message: '' })
          setIsLoading(false)
          toast('Email Sent Successfully !')
        },
        (error) => {
          setIsLoading(false)
          toast('Opps! Email Sent Failed !')
        },
      )
  }
  const handleEmailChange = (e) => {
    setContactInfo({
      ...contactInfo,
      email: e.target.value,
    })
  }
  const handleMessageChange = (e) => {
    setContactInfo({
      ...contactInfo,
      message: e.target.value,
    })
  }
  const handleNameChange = (e) => {
    setContactInfo({
      ...contactInfo,
      name: e.target.value,
    })
  }
  return (
    <div className="contact-form">
      <div className="contact-left">
        <div className="left">
          <span>Get in touch </span>
          <span>Contact me</span>
          <div
            className="blur c-blur1"
            style={{ background: '#abf1ff94' }}
          ></div>
        </div>
      </div>
      <div className="contact-right">
        <form ref={formRef} onSubmit={handleSendEmail}>
          <input
            type="text"
            name="userName"
            value={contactInfo.name}
            className="user"
            placeholder="Name..."
            onChange={handleNameChange}
          />
          <input
            type="email"
            value={contactInfo.email}
            name="userEmail"
            className="user"
            placeholder="Email..."
            onChange={handleEmailChange}
          />
          <textarea
            name="message"
            className="user"
            placeholder="Message..."
            value={contactInfo.message}
            onChange={handleMessageChange}
          ></textarea>
          <CircleLoader color={"#fca61f"} loading={isLoading}  speedMultiplier={2} css={override}size={30} />
          <input type="submit" value="Send" className="button" />
          <div
            className="blur c-blur2"
            style={{ background: 'var(--purple)' }}
          ></div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Contact
