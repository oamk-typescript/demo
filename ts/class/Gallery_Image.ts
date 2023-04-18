class Gallery_Image {
  id: number
  title: string
  name: string
  comment_count: number
  comments: Array<any>

  constructor(id: number,title:string,name:string,comment_count: number,comments: Array<any>) {
    this.id = id
    this.title = title
    this.name = name
    this.comment_count = comment_count
    this.comments = comments
  }
}

export { Gallery_Image }