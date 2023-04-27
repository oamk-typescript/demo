import {User } from './class/User.js'

const BACKEND_ROOT_URL = 'http://localhost:3003'

const submit_button: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#submit')
const email_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#email')
const password_input: HTMLInputElement = <HTMLInputElement>document.querySelector('#password')

const user: User = new User(BACKEND_ROOT_URL)

submit_button.addEventListener('click',event => {
  const email = email_input.value.trim()
  const password = password_input.value.trim()
  user.login(email,password).then((user) => {
    alert("You are logged in, welcome " + user.email)
  }).catch(error => {
    alert(error)
  })
})