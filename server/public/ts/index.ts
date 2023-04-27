import { Gallery } from "./class/Gallery.js"
import { Gallery_Image } from "./class/Gallery_Image.js"

// tsc -p tsconfig.json --watch
const BACKEND_ROOT_URL = 'http://localhost:3003'

const images_div: HTMLDivElement  = <HTMLDivElement>document.querySelector('#images')
const user_link: HTMLSpanElement = <HTMLSpanElement>document.querySelector('#user-email')

const gallery: Gallery = new Gallery(BACKEND_ROOT_URL)

const user: any = sessionStorage.getItem("user")


if (user !== null) {
  const user_object = JSON.parse(user)
  user_link.innerHTML = user_object.email
} else {
  user_link.innerHTML = "Not logged in"
}

gallery.getImages().then((images: Array<Gallery_Image>) => {
  images.forEach(image => {
    renderImage(image)
  })
}).catch(error => {
  alert(error)
})


const renderImage = (image_from_db: Gallery_Image) => {
  const div: HTMLDivElement = document.createElement('div')
  div.setAttribute('class','col col-sm-6 col-lg-4 col-xl-3')

  const h4: HTMLHeadElement = document.createElement('h4')
  h4.innerHTML = image_from_db.title + " (" +  image_from_db.comment_count  + ")"
  div.append(h4)

  const link: HTMLAnchorElement = document.createElement('a')
  link.href = 'image.html?id=' + image_from_db.id
  const image: HTMLImageElement = document.createElement('img')
  image.src = `${BACKEND_ROOT_URL}/images/${image_from_db.name}` 
  link.append(image)

  //image.src = BACKEND_ROOT_URL + '/images/' + data.name 
  div.append(link)
  images_div.append(div)
}