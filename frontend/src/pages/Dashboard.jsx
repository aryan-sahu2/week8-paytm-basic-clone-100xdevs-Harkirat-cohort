import React, { useEffect, useState } from 'react'
import AppBar from '../Components/AppBar'
import Balance from '../Components/Balance'
import Users from '../Components/Users'

function Dashboard() {


  return (
    <>
      <AppBar/>
      <div className="m-8">
        <Balance value={"10,000"}/>
        <Users/>
      </div>
    </>
  )
}

export default Dashboard