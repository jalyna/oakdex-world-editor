function downloadJson (fileName: string, json: Object) : void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json))
  const dlAnchorElem = document.getElementById('downloadAnchorElem')
  dlAnchorElem.setAttribute('href', dataStr)
  dlAnchorElem.setAttribute('download', fileName)
  dlAnchorElem.click()
}

export default downloadJson
