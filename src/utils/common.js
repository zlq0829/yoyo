export function downloadUrlFile(url, fileName) {
  const blod = URL.createObjectURL(new Blob([url]))
  if ('msSaveOrOpenBlob' in navigator) {//IE导出
    window.navigator.msSaveOrOpenBlob(blod, fileName);
  } else {
    const name = url.substring(url.lastIndexOf('/') + 1)
    const link = document.createElement('a');
    link.style.display = 'none'
    link.download = fileName || name
    link.href = blod;
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(blod)
  }
}
