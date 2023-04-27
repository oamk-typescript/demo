import { Gallery_Image } from "./Gallery_Image.js";

class Gallery {
  images: Array<Gallery_Image> = []
  #backend_url: string = ''

  constructor(url: string) {
    this.#backend_url = url
  }

  getImages = async():Promise<Array<Gallery_Image>> => {
    return new Promise(async(resolve,reject) => {
      fetch(this.#backend_url + '/get')
      .then(response => response.json()) 
      .then((response) => {
        this.#readJson(response)
        resolve(this.images)
      },(error) => {
        reject(error) 
      }) 
    })
  }

  getImage = async(id: number): Promise<Gallery_Image> => {
    return new Promise(async(resolve,reject) => {
      fetch(this.#backend_url + '/get/' + id.toString())
      .then(response => response.json()) 
      .then((response) => {
        const comments = response[0].comments ? response[0].comments as Array<any>: []
        resolve(new Gallery_Image(response[0].id,response[0].title,response[0].name,comments.length,comments,response[0].user_email))
      },(error: Error) => {
        reject(error)  
      })
    })
  }


  addImage = async(title: string,image: File) => {
    return new Promise(async(resolve,reject) => {
      const formData: FormData = new FormData()
      formData.append('title',title)
      formData.append('image',image)
      const user: any = JSON.parse(sessionStorage.getItem("user"))
      if (user === null) {
        reject("Unauthorized")
      }
      formData.append('user_id',user.id)

      fetch(this.#backend_url+ '/upload',{
        method: 'post',
        body: formData
      })
        .then(response => response.json()) 
        .then((response) => {
          if (response.error) {
            reject(response.error)
          }
          const gallery_image = new Gallery_Image(response.id,response.title,response.name,0,[],"")
          this.images.push(gallery_image)
          resolve(response)
        },(error) => {
          reject(error)
        }) 
    })
  }

  #readJson(imagesAsJson: any): void {
    imagesAsJson.forEach((element: { id: number; title: string; name: string; comment_count: number;  user_email: string}) => {
      const gallery_image: Gallery_Image = new Gallery_Image(element.id,element.title,element.name,element.comment_count,[],element.user_email)
      this.images.push(gallery_image)
    });
  }
}

export { Gallery }