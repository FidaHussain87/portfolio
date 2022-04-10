import React from 'react'
import "./floatingDiv.css"
const FloatingDiv = (props) => {
    const {crown,txt1,txt2} =props;
  return (
    <div className='floatingdiv'>
        <img src={crown} alt="" />
        <span>
            {txt1}
            <br/>
            {txt2}
        </span>

        </div>
  )
}

export default FloatingDiv