class Gallery_Image {
  id: number
  title: string
  name: string
  comment_count: number
  comments: Array<any>
  user_email: string

  constructor(id: number,title:string,name:string,comment_count: number,comments: Array<any>,user_email:string) {
    this.id = id
    this.title = title
    this.name = name
    this.comment_count = comment_count
    this.comments = comments
    this.user_email = user_email
  }
}

export { Gallery_Image }