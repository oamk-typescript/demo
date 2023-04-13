import { Gallery } from "./class/Gallery.js"

const BACKEND_ROOT_URL = 'http://localhost:3003'

const button: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#upload')
const title_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#title')
const image_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#image')

const gallery: Gallery = new Gallery(BACKEND_ROOT_URL)

button.addEventListener('click',event => {
  //const formData: FormData = new FormData()
  const title: string = title_input.value.trim()
  const image: File = image_input.files[0]

  gallery.addImage(title,image).then((image) => {
    alert("New image as added to the gallery!")
  }).catch(error => {
    alert("Error: " + error)
  })

  /* formData.append('title',title)
  formData.append('image',image)

  fetch(BACKEND_ROOT_URL + '/upload',{
    method: 'post',
    body: formData
  })
    .then(response => response.json()) 
    .then((response) => {
      alert("New image is added to the gallery!")
    },(error) => {
      alert("Error: " + error)
    })  */
})