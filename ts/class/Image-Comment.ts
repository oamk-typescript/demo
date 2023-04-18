class Image_Comment {
  id: number
  text: string
  image_id: number
  saved: Date

  constructor(id:number,text: string,image_id: number,saved: Date) {
    this.id = id
    this.text = text
    this.image_id = image_id
    this.saved = saved
  }
}

export { Image_Comment }