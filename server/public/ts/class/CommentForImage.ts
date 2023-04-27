import { Image_Comment } from "./Image-Comment.js";

class CommentForImage {
  #backend_url: string = ''

  constructor(url:string) {
    this.#backend_url = url
  }

  add = async(comment_text: string,image_id: string):Promise<Image_Comment> => {
    return new Promise(async(resolve,reject) => {

      const user: any = JSON.parse(sessionStorage.getItem("user"))
      if (user === null) {
        reject("Unauthorized")
      }

      const json = JSON.stringify({text: comment_text,image_id: image_id,user_id: user.id})
      fetch(this.#backend_url + '/comment/add', {
        method: 'post',
        headers: {
          'Content-Type':'application/json'
        },
        body: json
      })
      .then(response => response.json()) 
      .then((response) => {
        resolve(new Image_Comment(response.id,response.comment_text,response.image_id,response.saved,user.email,))
      },(error: Error) => {
        reject(error)
      })
    })
  }  
}

export { CommentForImage }

