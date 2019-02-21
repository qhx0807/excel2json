export const fileSizeFormat = (bytesize) => {
  if (typeof bytesize !== 'number') return bytesize
  if (bytesize < 1024) {
    return bytesize + 'B'
  } else if (bytesize < 1024 * 1024) {
    return (bytesize / 1024).toFixed(2) + 'KB'
  } else if (bytesize < 1024 * 1024 * 1024) {
    return (bytesize / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return '文件太大了'
  }
}

export const downLoadFile = (url, name) => {
  if (!url) return false
  const aTag = document.createElement('a')
  aTag.download = name
  aTag.href = url
  aTag.click()
}
