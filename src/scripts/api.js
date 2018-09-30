import axios from 'axios'

const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: 'http://127.0.0.1/Rakkit/public/rakkit'
})

export const getPages = () => {
  return api.get('')
}

export const getTree = (page) => {
  return api.get(`/pure/${page}`)
}

export const getVariations = () => {
  return api.get('/variations')
}

export const save = (page, item) => {
  console.log('save')
  return api.put(`/${page}/${item.id}`, item)
}

export const del = (page, item) => {
  return api.delete(`/${page}/${item.id}`, item)
}

export const add = (page, item) => {
  return api.post('', {page: page, new: item})
}

export const addPage = (name) => {
  return api.post('', {page: name, new: {}})
}
