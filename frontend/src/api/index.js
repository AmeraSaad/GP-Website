export async function runFullPipeline(file) {
  // For now, mock:
  const mock = await import('../mocks/meetings.json')
  return new Promise(res => setTimeout(() => res(mock.default), 500))
}
