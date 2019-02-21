import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Upload, Progress, notification } from 'antd'
import IconFont from './Icon'
import { fileSizeFormat } from '../utils/tool'
import { export_array_to_excel } from '../utils/excel'

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
      fileMsg: null,
      showProgress: false,
      progressPercent: 0,
      resultShow: false,
      tableData: [],
      tableHeader: []
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
        {
          this.state.showProgress &&
          <div className='progress'>
            <Progress percent={this.state.progressPercent} strokeWidth={3} strokeColor='#26E8ED' />
          </div>
        }
        <div className='result'>
          {
            this.state.resultShow &&
            <div>
              <p className='file-info'>
                <span>{this.state.fileMsg.name}</span>
                <span>{ fileSizeFormat(this.state.fileMsg.size) }</span>
                <span>{this.state.tableData.length}条数据</span>
                <span>
                  <a className='downe' href='javascript:;' onClick={this.clickDownHanler.bind(this)}>下载Excel文件</a>
                </span>
              </p>
              <div className='file-data'>
                <table className='table'>
                  <thead>
                    <tr>
                      {this.state.tableHeader.map((item, index) => (
                        <th key={index}>{item}</th>
                      )) }
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.tableData.map((item, index) => (
                      <tr key={index}>
                        {
                          Object.keys(item).map((key, i) => (
                            <td key={i}>{item[key]}</td>
                          ))
                        }
                      </tr>
                    )) }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  beforeUploadHandler (file) {
    const fileExt = file.name.split('.').pop().toLocaleLowerCase()
    if (fileExt === 'json') {
      this.setState({
        fileMsg: { name: file.name, size: file.size }
      })
      this.readJsonHandler(file)
    } else {
      window.alert('文件类型错误')
    }
  }

  readJsonHandler (file) {
    const reader = new FileReader() // eslint-disable-line
    reader.readAsText(file)
    reader.onloadstart = () => {
      this.setState({
        showProgress: true,
        resultShow: false,
        progressPercent: 0
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
      const str = e.target.result
      try {
        const data = JSON.parse(str)
        if (Array.isArray(data)) {
          this.setState({
            tableHeader: Object.keys(data[0]),
            tableData: data
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
        } else {
          notification.warning({
            message: '内容格式有误',
            description: '转换为json失败'
          })
          this.timer = setTimeout(() => {
            this.setState({
              showProgress: false
            })
          }, 600)
        }
      } catch (error) {
        notification.warning({
          message: '文件内容转换失败',
          description: error.toString()
        })
        this.timer = setTimeout(() => {
          this.setState({
            showProgress: false
          })
        }, 600)
      }
    }
  }

  clickDownHanler () {
    console.log(this.state.tableData)
    const opts = {
      title: this.state.tableHeader,
      key: this.state.tableHeader,
      data: this.state.tableData,
      autoWidth: true,
      filename: this.state.fileMsg.name
    }
    export_array_to_excel(opts)
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }
}
