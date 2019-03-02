import { saveAs } from 'file-saver'

function downloadJson (fileName: string, json: Object) : void {
  const fileToSave = new Blob([JSON.stringify(json, null, 2)], {
    type: 'application/json'
  })
  saveAs(fileToSave, fileName)
}

export default downloadJson
