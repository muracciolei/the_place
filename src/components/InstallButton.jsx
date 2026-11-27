import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InstallButton() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    function onPrompt(event) {
      event.preventDefault()
      setPrompt(event)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  async function install() {
    if (!prompt) return
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }

  return (
    <div className="install-block">
      <button type="button" className="button button--primary" onClick={install} disabled={!prompt && !isIOS}>
        {t('settings.install')}
      </button>
      {isIOS && !prompt && <p className="field__hint">{t('settings.installIos')}</p>}
      {!isIOS && !prompt && <p className="field__hint">{t('settings.installHint')}</p>}
    </div>
  )
}
