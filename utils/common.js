export const responseConstructor = (code, data) => ({
    statusCode: code || 500,
    body: JSON.stringify({data}),
  })