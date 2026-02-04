import { fetcher } from '#/utils/fetcher'

export async function profileUpdate() {
  return await fetcher<any>('/auth/user/profile', {
    method: 'PUT'
  })
}

export async function emailChange() {
  return await fetcher<any>('/auth/user/email/change', {
    method: 'POST'
  })
}

export async function emailConfirm() {
  return await fetcher<any>('/auth/user/email/confirm', {
    method: 'POST'
  })
}
