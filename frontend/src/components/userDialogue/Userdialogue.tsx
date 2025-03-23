"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { User } from "../../data/user" // Import the User object

interface User {
  id: number
  pseudo: string
  email: string
  isVerified: boolean
}

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (updatedUser: User) => void
}

export function EditUserDialog({ isOpen, onClose, user, onSave }: EditUserDialogProps) {
  const [editedPseudo, setEditedPseudo] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state
  const [message, setMessage] = useState("") // Add message state
  const [successMessage, setSuccessMessage] = useState("") // Add success message state
  const [errorMessage, setErrorMessage] = useState("") // Add error message state

  useEffect(() => {
    if (user) {
      setEditedPseudo(user.pseudo)
      setEditedEmail(user.email)
      setIsVerified(user.isVerified)
    }
  }, [user])

  useEffect(() => {
    if (!isOpen) {
      setSuccessMessage("") // Reset success message when dialog is closed
      setErrorMessage("") // Reset error message when dialog is closed
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true) // Set loading state to true

    const updatedUser = {
      ...user,
      pseudo: editedPseudo,
      email: editedEmail,
      isVerified: isVerified,
    }

    let token = sessionStorage.getItem('Token');

    try {
      if (token) {
        const response = await User.Usermodify(token, user.id.toString(), { pseudo: editedPseudo, email: editedEmail })
        if (response.code === "C-1611") {
          setSuccessMessage("L'utilisateur a bien été mis à jour.") // Set success message
          setTimeout(() => {
            onClose()
          }, 2000) 
        } else if (response.code === "C-2601") {
          setErrorMessage("Veuillez compléter les champs pseudo et email.") // Set error message
        }
        onSave(updatedUser)
      } else {
        console.error("No token found in session storage")
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsLoading(false) // Set loading state to false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="pseudo">Pseudo</Label>
            <Input
              id="pseudo"
              value={editedPseudo}
              onChange={(e) => setEditedPseudo(e.target.value)}
              style={{ borderColor: errorMessage ? 'red' : undefined }} // Apply red border if error
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              style={{ borderColor: errorMessage ? 'red' : undefined }} // Apply red border if error
            />
          </div>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        </div>
        <DialogFooter>
          <Button variant="outline" className="hover:cursor-pointer" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="hover:cursor-pointer" disabled={isLoading}>
            {isLoading ? "En cours..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}