class Image_Comment {
  id: number
  text: string
  image_id: number
  saved: Date
  user_email: string

  constructor(id:number,text: string,image_id: number,saved: Date,user_email: string) {
    this.id = id
    this.text = text
    this.image_id = image_id
    this.saved = saved
    this.user_email = user_email
  }
}

export { Image_Comment }