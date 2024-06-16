import React from 'react'

function InputBox({label, placeholder, onChange}) {
  return (
    <>
    <div className='text-sm font-medium text-left py-2'>
        {label}
    </div>
    <input onChange={onChange} placeholder={placeholder} className='border w-full px-2 py-1 text-base'></input>
    </>
  )
}

export default InputBox