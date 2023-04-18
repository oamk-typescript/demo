import { Image_Comment } from "./Image-Comment.js";

class CommentForImage {
  #backend_url = ''

  constructor(url) {
    this.#backend_url = url
  }

  add = async(comment_text: string,image_id: string) => {
    return new Promise(async(resolve,reject) => {
      const json = JSON.stringify({text: comment_text,image_id: image_id})
      fetch(this.#backend_url + '/comment/add', {
        method: 'post',
        headers: {
          'Content-Type':'application/json'
        },
        body: json
      })
      .then(response => response.json()) 
      .then((response) => {
        console.log(response)
        resolve(new Image_Comment(response.id,response.comment_text,response.image_id,response.saved))
      },(error: Error) => {
        reject(error)
      })
    })
  }  
}

export { CommentForImage }

