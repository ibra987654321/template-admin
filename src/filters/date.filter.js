export default function dateFilter(value) {
  return new Date(value).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
