const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const image_id: number = Number(urlParams.get('id'))
