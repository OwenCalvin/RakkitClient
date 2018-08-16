import axios from 'axios'

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: 'http://127.0.0.1/RakkitCMS/public/rakkit'
})

export const getPages = () => {
  console.log('aaaaaaaa')
  return api.get('')
}

export const getTree = (page) => {
  return api.get(`/pure/${page}`)
}
