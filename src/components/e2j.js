import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Upload, Progress, notification } from 'antd'
import IconFont from './Icon'
import '../styles/index.less'
import { read } from '../utils/excel'

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
      fileMsg: null,
      showProgress: false,
      progressPercent: 0,
      tableHeader: [],
      tableData: [],
      resultShow: false
    }
  }

  render () {
    return (
      <div className='page'>
        <div className='header'>
          <Link to='/j2e' className='jump'>
            <Button shape='circle' size='small' icon='swap' />
          </Link>
        </div>
        <div className='upload-box'>
          <Upload {...this.state.uploadProps} className='upload'>
            <p className='upload-icon'>
              <IconFont type='icon-Excel' />
            </p>
            <p className='upload-hint'>选择.xlsx .xls文件上传转换为Json数据</p>
          </Upload>
        </div>
        {
          this.state.showProgress &&
          <div className='progress'>
            <Progress percent={this.state.progressPercent} strokeWidth={3} strokeColor='#4BC929' />
          </div>
        }
        <div className='result'>
          {
            this.state.resultShow &&
            <div>
              <p className='file-info'>
                <span>{this.state.fileMsg.name}</span>
                <span>{this.state.fileMsg.size}</span>
                <span>{this.state.tableData.length}条数据</span>
              </p>
              <div className='file-data'>
                file-data
              </div>
            </div>
          }
        </div>
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
    const reader = new FileReader() // eslint-disable-line
    reader.readAsArrayBuffer(file)
    reader.onloadstart = () => {
      this.setState({
        showProgress: true,
        resultShow: false
      })
    }
    reader.onerror = e => {
      notification.error({
        message: '读取文件失败',
        description: e.toString()
      })
    }
    reader.onprogress = e => {
      this.setState({
        progressPercent: Math.round(e.loaded / e.total * 100)
      })
    }
    reader.onload = e => {
      const data = e.target.result
      const { header, results } = read(data, 'array')
      this.setState({
        tableHeader: header,
        tableData: results
      })
      notification.success({
        message: '文件读取成功',
        description: ''
      })
      this.timer = setTimeout(() => {
        this.setState({
          showProgress: false,
          resultShow: true
        })
      }, 600)
    }
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }
}
