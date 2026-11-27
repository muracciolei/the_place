export default function ImageCredit({ credit, compact = false, linked = false }) {
  if (!credit) return null
  const text = `${credit.author}${credit.license ? ` · ${credit.license}` : ''}`
  if (!linked) return <span className="image-credit">{text}</span>
  return (
    <span className="image-credit">
      {text}{' '}
      {credit.source && (
        <a href={credit.source} target="_blank" rel="noreferrer">↗</a>
      )}
    </span>
  )
}
