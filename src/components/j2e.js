import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

export default class Json2excel extends Component {
  render () {
    return (
      <div>
        <Link to='/'>
          <Button shape='circle' icon='swap' />
        </Link>
      </div>
    )
  }
}
