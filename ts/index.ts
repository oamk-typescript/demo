const BACKEND_ROOT_URL = 'http://localhost:3001'

const images_div: HTMLDivElement  = <HTMLDivElement>document.querySelector('#images')

fetch(BACKEND_ROOT_URL)
  .then(response => response.json()) 
  .then((response) => {
    response.forEach(element => {
      renderImage(element)
    });
  },(error) => {
    alert(error)  
  }) 

  const renderImage = (image_from_db) => {
    const div: HTMLDivElement = document.createElement('div')
  
    const h4: HTMLHeadElement = document.createElement('h4')
    h4.innerHTML = image_from_db.title
    div.append(h4)

    const image: HTMLImageElement = document.createElement('img')
    image.src = `${BACKEND_ROOT_URL}/images/${image_from_db.name}` 
    //image.src = BACKEND_ROOT_URL + '/images/' + data.name 
    div.append(image)
    images_div.append(div)
}