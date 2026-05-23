import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import type { SectionState } from './ProfilePage.types'
import { idle } from './ProfilePage.types'
import { inputCls, inputErrCls, isStrongPassword, extractError } from './ProfilePage.helpers'
import { Feedback, SaveButton } from './ProfilePage.components'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'


export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()

  // ── Name ──────────────────────────────────────────────
  const [name, setName]   = useState(user?.name ?? '')
  const [nameS, setNameS] = useState<SectionState>(idle)

  // ── Password ──────────────────────────────────────────
  const [curPwd, setCurPwd]           = useState('')
  const [newPwd, setNewPwd]           = useState('')
  const [confPwd, setConfPwd]         = useState('')
  const [curPwdWrong, setCurPwdWrong] = useState(false)
  const [verifying, setVerifying]     = useState(false)
  const [verified, setVerified]       = useState(false)   // current pwd confirmed by backend
  const [pwdS, setPwdS]               = useState<SectionState>(idle)

  // Step-by-step visibility
  const showNewField    = verified
  const showConfField   = verified && isStrongPassword(newPwd)
  const passwordsMatch  = confPwd.length > 0 && confPwd === newPwd
  const sameAsOld       = newPwd === curPwd
  const canSavePwd      = showConfField && passwordsMatch && !sameAsOld

  async function checkCurrentPassword() {
    if (!curPwd) return
    setVerifying(true)
    setCurPwdWrong(false)
    try {
      await api.post('/verify-password', { current_password: curPwd })
      setVerified(true)
    } catch {
      setCurPwdWrong(true)
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  async function saveName() {
    setNameS(idle)
    if (name.trim() === (user?.name ?? '')) return
    if (name.trim().length < 2) {
      setNameS({ ...idle, error: t('dashboard.profile.nameMinError') })
      return
    }
    setNameS({ ...idle, saving: true })
    try {
      const { data } = await api.patch<{ id: number; name: string }>('/me', { name: name.trim() })
      updateUser({ name: data.name })
      setNameS({ saving: false, saved: true, error: null })
      setTimeout(() => setNameS(idle), 3000)
    } catch (err: unknown) {
      setNameS({ saving: false, saved: false, error: extractError(err, 'name', t('dashboard.profile.error')) })
    }
  }

  async function savePassword() {
    if (newPwd === curPwd) {
      setPwdS({ saving: false, saved: false, error: t('dashboard.profile.pwdSameAsOld') })
      return
    }
    setPwdS({ ...idle, saving: true })
    try {
      await api.patch('/me', {
        password:              newPwd,
        password_confirmation: confPwd,
        current_password:      curPwd,
      })
      setCurPwd('')
      setNewPwd('')
      setConfPwd('')
      setVerified(false)
      setPwdS({ saving: false, saved: true, error: null })
      setTimeout(() => setPwdS(idle), 3000)
    } catch (err: unknown) {
      const msg = extractError(err, 'password', t('dashboard.profile.error'))
      setPwdS({ saving: false, saved: false, error: msg })
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div className="mb-8">
        <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">{t('dashboard.profile.eyebrow')}</p>
        <h1 className="text-[clamp(26px,3.5vw,48px)] leading-[1.1] font-extrabold mb-4">
          {t('dashboard.profile.heading')} <span className="text-white/30">{t('dashboard.profile.headingFade')}</span>
        </h1>
        <p className="text-slate-400 text-base leading-[1.8]">
          {t('dashboard.profile.body')}
        </p>
      </div>

      {/* ── Full name ────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{t('dashboard.profile.nameTitle')}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">{t('dashboard.profile.nameSub')}</p>
        </div>
        <input
          id="profile-name"
          name="name"
          type="text"
          aria-label={t('dashboard.profile.nameTitle')}
          value={name}
          onChange={(e) => { setName(e.target.value); setNameS(idle) }}
          placeholder={t('dashboard.profile.namePlaceholder')}
          className={inputCls}
          autoComplete="name"
        />
        <div className="flex items-center justify-between gap-3">
          <Feedback state={nameS} savedMsg={t('dashboard.profile.nameSaved')} />
          <SaveButton
            state={nameS}
            onClick={() => void saveName()}
            disabled={name.trim() === (user?.name ?? '') || name.trim().length < 2}
            label={t('dashboard.profile.save')}
            savingLabel={t('dashboard.profile.saving')}
          />
        </div>
      </section>

      {/* ── Change password ──────────────────────────────── */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{t('dashboard.profile.passwordTitle')}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {t('dashboard.profile.passwordSub')}
          </p>
        </div>

        {/* Step 1 — current password + Next button */}
        <div className="flex flex-col gap-1.5">
          <input
            id="current-password"
            name="current-password"
            type="password"
            onChange={(e) => {
              setCurPwd(e.target.value)
              setCurPwdWrong(false)
              setVerified(false)
              setNewPwd('')
              setConfPwd('')
              setPwdS(idle)
            }}
            placeholder={t('dashboard.profile.currentPwd')}
            className={[
              curPwdWrong ? inputErrCls : inputCls,
              verified ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
            autoComplete="current-password"
            onKeyDown={(e) => { if (e.key === 'Enter' && !verified) void checkCurrentPassword() }}
            disabled={verified}
          />
          {curPwdWrong && (
            <p className="text-xs text-red-400">{t('dashboard.profile.currentPwdWrong')}</p>
          )}
          {!verified && curPwd.length > 0 && (
            <button
              onClick={() => void checkCurrentPassword()}
              disabled={verifying}
              className="mt-1 self-end px-5 py-2 rounded-xl bg-white/8 text-white text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:bg-white/12 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {verifying && <SpinnerIcon />}
              {verifying ? t('dashboard.profile.checking') : t('dashboard.profile.next')}
            </button>
          )}
        </div>

        {/* Step 2 — new password (only after current verified) */}
        {showNewField && (
          <div className="flex flex-col gap-1.5">
            <input
              id="new-password"
              name="new-password"
              type="password"
              onChange={(e) => { setNewPwd(e.target.value); setPwdS(idle) }}
              placeholder={t('dashboard.profile.newPwd')}
              className={inputCls}
              autoComplete="new-password"
            />
            {newPwd.length > 0 && !isStrongPassword(newPwd) && (
              <p className="text-[11px] text-amber-400">
                {newPwd.length < 8
                  ? t('dashboard.profile.newPwdTooShort', { count: newPwd.length })
                  : t('dashboard.profile.newPwdWeak')}
              </p>
            )}
          </div>
        )}

        {/* Step 3 — confirm (only after new password is strong) */}
        {showConfField && (
          <div className="flex flex-col gap-1.5">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              onChange={(e) => { setConfPwd(e.target.value); setPwdS(idle) }}
              placeholder={t('dashboard.profile.confirmPwd')}
              className={confPwd.length > 0 && confPwd !== newPwd ? inputErrCls : inputCls}
              autoComplete="new-password"
            />
            {confPwd.length > 0 && confPwd !== newPwd && (
              <p className="text-[11px] text-red-400">{t('dashboard.profile.pwdMismatch')}</p>
            )}
            {passwordsMatch && sameAsOld && (
              <p className="text-[11px] text-amber-400">{t('dashboard.profile.pwdSameAsOld')}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {pwdS.saved
            ? <p className="text-xs text-emerald-400">{t('dashboard.profile.pwdSuccess')}</p>
            : pwdS.error
              ? <p className="text-xs text-red-400">{pwdS.error}</p>
              : <span />
          }
          <button
            onClick={() => void savePassword()}
            disabled={pwdS.saving}
            className={[
              'px-5 py-2 rounded-xl bg-accent text-bg text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-2',
              canSavePwd
                ? 'opacity-100 scale-100 pointer-events-auto hover:opacity-90'
                : 'opacity-0 scale-95 pointer-events-none',
            ].join(' ')}
          >
            {pwdS.saving && <SpinnerIcon />}
            {pwdS.saving ? t('dashboard.profile.saving') : t('dashboard.profile.save')}
          </button>
        </div>
      </section>
    </div>
  )
}

