import StaticData from '../Data/StaticData.json'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const SafeParseJson = async (res) => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export const GeneratePasswordApi = async (length, options) => {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ length, ...options }),
  })
  if (!res.ok) {
    const err = await SafeParseJson(res)
    throw new Error((err && err.detail) || StaticData.Api.GeneratePasswordError)
  }
  const data = await SafeParseJson(res)
  if (!data) {
    throw new Error(StaticData.Api.GeneratePasswordError)
  }
  return data
}

export const GenerateBulkPasswordApi = async (length, options, count) => {
  const res = await fetch(`${API_BASE}/generate-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ length, ...options, count }),
  })
  if (!res.ok) {
    const err = await SafeParseJson(res)
    throw new Error((err && err.detail) || StaticData.Api.GenerateBulkPasswordError)
  }
  const data = await SafeParseJson(res)
  if (!data) {
    throw new Error(StaticData.Api.GenerateBulkPasswordError)
  }
  return data
}
