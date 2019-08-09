// import request from 'axios'

import axios from 'axios'
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';

// const request = axios.create({
//   auth: {
//   username: 'ygg',
//     password: 'ygg1234'
//   }
//
// });

export async function getAllData() {
  let res = await request.get(`${API_HOST}`, {useCache: false})
  return res.data
}

const request = axios.create({
  auth: {
    username: 'ygg',
    password: 'ygg1234'
  },
  headers: {
    'Cache-Control': 'no-cache'
  },
  // adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter), { threshold: 2 * 1000 })
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, { enabledByDefault: true, cacheFlag: 'useCache'})
});

export async function getBranch () {
  let branch = await request.get(`${API_HOST}/branches`)
  let result = {
    Name: Object.values(branch.data)[0].name,
    Symbol: Object.values(branch.data)[0].symbol,
    Property: Object.values(branch.data)[0].property,
    Description: Object.values(branch.data)[0].description,
    Contracts: Object.values(branch.data)[0].contracts,
  }
  return result
}

export function search(hash) {
  return request.get(`${API_HOST}/search?value=${hash}`);
}

export function getTx (txId) {
  return request.get(`${API_HOST}/txs/${txId}`)
}

export function getTxReceipt (txId) {
  return request.get(`${API_HOST}/txs/${txId}/receipts`)
}

export function getTxsCounts () {
  return request.get(`${API_HOST}/counts/txs`)
}

export async function getBlock (branchId, blockId) {
  let res = await request.get(`${API_HOST}/blocks/${blockId}`)
  return res.data
}

export function getTxs (offset) {
  if (offset) {
    return request.get(`${API_HOST}/txs?index=${offset}`, {useCache: false})
  } else {
    return request.get(`${API_HOST}/txs`, {useCache: false})
  }
}

export async function getTxsByBlockId (blockId) {
  let res = await request.get(`${API_HOST}/blocks/${blockId}/txs`)
  return res.data
}

export function getBlocks (branchId, offset) {
  if (offset) {
    return request.get(`${API_HOST}/blocks?index=${offset}`, {useCache: false})
  } else {
    return request.get(`${API_HOST}/blocks`, {useCache: false})
  }
}

export async function getAccount (address) {
  let res = await request.get(`${API_HOST}/txs/accounts/${address}`)
  return res.data
}

export async function getRecentTxCount () {
  let res = await request.get(`${API_HOST}/counts/txs/recent`, {useCache: false})
  res.data.reverse()

  return res.data
}

export async function getNetworkStatus () {
  let res = await request.get(`${API_HOST}/health`, {useCache: false})
  return res.data
}

const API_HOST = '/api'