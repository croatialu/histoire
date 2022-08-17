import { unref, isRef } from 'vue'

const isObject = (val) => val !== null && typeof val === 'object'

export function toRawDeep (val, clean = false, seen = new WeakMap()) {
  const unwrappedValue = isRef(val) ? unref(val) : val

  if (typeof unwrappedValue === 'symbol') {
    return unwrappedValue.toString()
  }

  if (!isObject(unwrappedValue)) {
    return unwrappedValue
  }

  if (seen.has(unwrappedValue)) {
    return seen.get(unwrappedValue)
  }

  if (Array.isArray(unwrappedValue)) {
    const result = []
    seen.set(unwrappedValue, result)
    let list = unwrappedValue.map(value => toRawDeep(value, clean, seen))
    if (clean) {
      list = list.filter(value => typeof value !== 'function')
    }
    result.push(...list)
    return result
  } else {
    const result = {}
    seen.set(unwrappedValue, result)
    toRawObject(unwrappedValue, result, clean, seen)
    return result
  }
}

const toRawObject = (obj: Record<any, any>, target: Record<any, any>, clean = false, seen = new WeakMap()) => {
  Object.keys(obj).forEach((key) => {
    if (clean && typeof obj[key] === 'function') {
      return
    }
    target[key] = toRawDeep(obj[key], clean, seen)
  })
}
