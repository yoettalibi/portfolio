export type SectionState = { saving: boolean; saved: boolean; error: string | null }
export const idle: SectionState = { saving: false, saved: false, error: null }
