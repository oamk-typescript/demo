import { Gallery } from "./class/Gallery.js"
import { Gallery_Image } from "./class/Gallery_Image.js"

const BACKEND_ROOT_URL = 'http://localhost:3003'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const image_id: number = Number(urlParams.get('id'))

const details_div = <HTMLDivElement>document.querySelector("#details")
const comments_div = <HTMLDivElement>document.querySelector("#comments")
const image_id_input = <HTMLInputElement>document.querySelector('#image_id')
const new_input = <HTMLInputElement>document.querySelector('#new')

const gallery: Gallery = new Gallery(BACKEND_ROOT_URL)

image_id_input.value = image_id.toString()

gallery.getImage(image_id).then((image: Gallery_Image) => {
  renderImage(image)
}).catch(error => {
  alert(error)
})

const renderImage = (image_from_db: Gallery_Image) => {
  const div: HTMLDivElement = document.createElement('div')
  div.setAttribute('class','image-details col col-sm-6 col-lg-4 col-xl-3')

  const h3: HTMLHeadElement = document.createElement('h3')
  h3.innerHTML = image_from_db.title
  div.append(h3)

  const image: HTMLImageElement = document.createElement('img')
  image.src = `${BACKEND_ROOT_URL}/images/${image_from_db.name}` 
  
  div.append(image)

  renderComments(image_from_db.comments)

  details_div.append(div)
}

const renderComments = (comments: Array<any>) => {
  if (comments.length > 0) {
    const table = addTable()
  
    comments.forEach(comment => {
      const saved = new Date(comment.saved)
      const saved_formatted = saved.toLocaleDateString('fi-FI') + ' ' + saved.toLocaleTimeString('fi-FI')
      const tr: HTMLTableRowElement = addRow(comment.comment,saved_formatted)
      table.append(tr)
    })
    comments_div.append(table)
  } else {
    const p: HTMLParagraphElement = document.createElement('p')
    p.innerHTML = "No comments"
    comments_div.append(p) 
  }
}

const addTable = (): HTMLTableElement => {
  let table:HTMLTableElement = document.querySelector('table')
  if (!table) {
    table = document.createElement('table')
    table.setAttribute("id","comments-table")
  }
  return table
}

const addRow = (col1: any, col2: any): HTMLTableRowElement => {
  const tr: HTMLTableRowElement = document.createElement('tr')
  tr.append(addCol(col1))
  tr.append(addCol(col2))
  return tr
}

const addCol = (value: any): HTMLTableCellElement  => {
  const td = document.createElement('td')
  td.innerHTML = value
  return td
}