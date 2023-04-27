class User {
  #backend_url: string = ''

  constructor(url:string) {
    this.#backend_url = url
  }

  login = async(email: string,password: string): Promise<any> => {
    return new Promise(async(resolve,reject) => {
      const json = JSON.stringify({email: email,password: password})
      fetch(this.#backend_url + '/login', {
        method: 'post',
        headers: {
          'Content-Type':'application/json'
        },
        body: json
      })
      .then(response => response.json()) 
      .then((response) => {
        sessionStorage.setItem("user",JSON.stringify(response[0]))
        console.log(sessionStorage.getItem("user"))
        resolve(response[0])
      },(error: Error) => {
        reject(error)
      })
    })
  }  
}

export { User }

