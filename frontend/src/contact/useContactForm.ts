import { useEffect, useRef, useState } from 'react'
import { type FormState, initialForm } from './contact.types'
import { validateEmail, sanitizeName, sanitizeMessage } from './contact.utils'
import api from '../lib/api'

export function useContactForm(onSent?: (firstName: string, subjects: string[]) => void) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [emailError, setEmailError] = useState('')
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const step2Ref = useRef<HTMLDivElement>(null)

  const isFormReady =
    form.subjects.length > 0 &&
    form.name.trim().length >= 5 &&
    form.email.trim().length > 0 &&
    validateEmail(form.email) === '' &&
    form.message.trim().length >= 150

  useEffect(() => {
    if (form.subjects.length === 1) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 320)
    }
  }, [form.subjects.length])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let value = e.target.value
    if (e.target.name === 'name')    value = sanitizeName(value)
    if (e.target.name === 'message') value = sanitizeMessage(value)
    setForm((prev) => ({ ...prev, [e.target.name]: value }))
    if (e.target.name === 'email' && emailError) {
      setEmailError(validateEmail(value))
    }
  }

  function handleEmailBlur() {
    setEmailError(validateEmail(form.email))
  }

  function toggleSubject(id: string) {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(id)
        ? prev.subjects.filter((s) => s !== id)
        : [...prev.subjects, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.subjects.length === 0) return
    const err = validateEmail(form.email)
    if (err) { setEmailError(err); return }
    setSending(true)
    setSubmitError('')
    try {
      await api.post('/contact', {
        name:     form.name.trim(),
        email:    form.email.trim(),
        subjects: form.subjects,
        message:  form.message.trim(),
      })
      const firstName = form.name.trim().split(' ')[0] || form.name.trim()
      onSent?.(firstName, form.subjects)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function resetForm() {
    setForm(initialForm)
  }

  return {
    form, emailError, sending, submitError,
    isFormReady, step2Ref,
    handleChange, handleEmailBlur, toggleSubject, handleSubmit, resetForm,
  }
}
