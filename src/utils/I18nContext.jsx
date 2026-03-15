import { createContext, useContext, useMemo, useState } from 'react'
import bn from '../i18n/bn.json'
import en from '../i18n/en.json'
import gu from '../i18n/gu.json'
import hi from '../i18n/hi.json'
import kn from '../i18n/kn.json'
import ml from '../i18n/ml.json'
import mr from '../i18n/mr.json'
import pa from '../i18n/pa.json'
import ta from '../i18n/ta.json'
import te from '../i18n/te.json'

const dictionaries = { en, hi, gu, mr, ta, te, kn, ml, bn, pa }
const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
]

const I18nContext = createContext(null)

const getByPath = (dictionary, key) => {
  return key.split('.').reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), dictionary)
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('thisindia_lang')
    return dictionaries[stored] ? stored : 'en'
  })

  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.en
    const fallbackDictionary = dictionaries.en
    const t = (key) => getByPath(dictionary, key) || getByPath(fallbackDictionary, key) || key
    const setAppLanguage = (lang) => {
      const next = dictionaries[lang] ? lang : 'en'
      setLanguage(next)
      localStorage.setItem('thisindia_lang', next)
    }
    return { language, setLanguage: setAppLanguage, t, languageOptions }
  }, [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
