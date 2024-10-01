import React from 'react'
import { useParams } from 'react-router-dom'

function Dashboard() {

    let {user} = useParams();

  return (
    <div>
      {user} dashboard
    </div>
  )
}

export default Dashboard
