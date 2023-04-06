import { Gallery } from "./class/Gallery.js"
import { Gallery_Image } from "./class/Gallery_Image.js"

const BACKEND_ROOT_URL = 'http://localhost:3003'

const images_div: HTMLDivElement  = <HTMLDivElement>document.querySelector('#images')

const gallery: Gallery = new Gallery(BACKEND_ROOT_URL)

gallery.getImages().then((images: Array<Gallery_Image>) => {
  images.forEach(image => {
    renderImage(image)
  })
}).catch(error => {
  alert(error)
})


const renderImage = (image_from_db) => {
  const div: HTMLDivElement = document.createElement('div')
  div.setAttribute('class','col col-sm-6 col-lg-4 col-xl-3')

  const h4: HTMLHeadElement = document.createElement('h4')
  h4.innerHTML = image_from_db.title
  div.append(h4)

  const image: HTMLImageElement = document.createElement('img')
  image.src = `${BACKEND_ROOT_URL}/images/${image_from_db.name}` 
  //image.src = BACKEND_ROOT_URL + '/images/' + data.name 
  div.append(image)
  images_div.append(div)
}