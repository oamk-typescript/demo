class Gallery_Image {
  id: number
  title: string
  name: string
  comment_count: number

  constructor(id: number,title:string,name:string,comment_count: number) {
    this.id = id
    this.title = title
    this.name = name
    this.comment_count = comment_count
  }
}

export { Gallery_Image }