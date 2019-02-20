import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Upload, Progress } from 'antd'
import IconFont from './Icon'

export default class Json2excel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uploadProps: {
        accept: '.json',
        showUploadList: false,
        beforeUpload: (file) => {
          this.beforeUploadHandler(file)
          return false
        }
      },
      fileMsg: null
    }
  }
  render () {
    return (
      <div className='page'>
        <div className='header'>
          <Link to='/' className='jump'>
            <Button shape='circle' size='small' icon='swap' />
          </Link>
        </div>
        <div className='upload-box'>
          <Upload {...this.state.uploadProps} className='upload'>
            <p className='upload-icon'>
              <IconFont type='icon-json' />
            </p>
            <p className='upload-hint'>选择.json文件上传转换为Excel</p>
          </Upload>
        </div>
        <div className='progress'>
          <Progress percent={30} strokeWidth={3} strokeColor='#26E8ED' />
        </div>
      </div>
    )
  }
}
