export interface NoteStore {
  keycontrol?: {
    exit: boolean
    setExit: React.Dispatch<React.SetStateAction<boolean>>
  }
}
