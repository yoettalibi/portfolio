import type { SectionState } from './ProfilePage.types'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'

export function Feedback({ state, savedMsg }: { state: SectionState; savedMsg: string }) {
  if (state.error) return <p className="text-xs text-red-400">{state.error}</p>
  if (state.saved) return <p className="text-xs text-emerald-400">{savedMsg}</p>
  return <span />
}

export function SaveButton({
  state,
  onClick,
  disabled,
  label,
  savingLabel,
}: {
  state: SectionState
  onClick: () => void
  disabled: boolean
  label: string
  savingLabel: string
}) {
  const inactive = disabled || state.saving
  return (
    <button
      onClick={onClick}
      disabled={inactive}
      className={[
        'px-5 py-2 rounded-xl bg-accent text-bg text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-2',
        inactive ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90',
      ].join(' ')}
    >
      {state.saving && <SpinnerIcon />}
      {state.saving ? savingLabel : label}
    </button>
  )
}
