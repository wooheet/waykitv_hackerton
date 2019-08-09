function shortHash (value, length) {
    return value.slice(0, length)
}

function shortHashBackwards (value) {
    return value.slice(-3)
}

function stringToJson (value) {
  return JSON.parse(value)
}

export {
  shortHash,
  stringToJson,
  shortHashBackwards
}
