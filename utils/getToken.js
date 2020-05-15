exports.getToken = req => {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader === 'undefined') {
    return null
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1]
  
  return bearerToken
}