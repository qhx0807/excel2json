import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Upload, Progress, notification, BackTop } from 'antd'
import IconFont from './Icon'
import '../styles/index.less'
import { read } from '../utils/excel'
import { fileSizeFormat, downLoadFile } from '../utils/tool'

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
        <BackTop />
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
                <span>{ fileSizeFormat(this.state.fileMsg.size) }</span>
                <span>{this.state.tableData.length}条数据</span>
                <span>
                  <a className='downj' href='javascript:;' onClick={this.clickDownHanler.bind(this)}>下载JSON文件</a>
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

  clickDownHanler () {
    console.log(this.state.tableData)
    const text = JSON.stringify(this.state.tableData)
    const blob = new Blob([text], { type: 'application/json' }) // eslint-disable-line
    const url = URL.createObjectURL(blob)
    downLoadFile(url, this.state.fileMsg.name + '.json')
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }
}
