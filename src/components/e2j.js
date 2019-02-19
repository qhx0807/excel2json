import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Upload, Icon } from 'antd'

export default class Excel2json extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uploadProps: {
        accept: '.xls, .xlsx',
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
      <div>
        <Link to='/j2e'>
          <Button shape='circle' icon='swap' />
        </Link>
        <Upload {...this.state.uploadProps}>
          <p className='ant-upload-drag-icon'>
            <Icon type='inbox' />
          </p>
        </Upload>
      </div>
    )
  }

  beforeUploadHandler (file) {
    const fileExt = file.name.split('.').pop().toLocaleLowerCase()
    if (fileExt === 'xlsx' || fileExt === 'xls') {
      this.setState({
        fileMsg: { name: file.name, size: file.size }
      })
      this.readExcelHandler(file)
    } else {
      window.alert('文件类型错误')
    }
  }

  readExcelHandler (file) {
    console.log(file)
  }
}
