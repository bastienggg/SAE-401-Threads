"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RefreshCw, Ban } from "lucide-react"

import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import BlockedUsersList from "../BlockedUsersList/BlockedUsersList"
import { User } from "../../data/user"

export default function Settings() {
  const [autoRefresh, setAutoRefresh] = useState(() => {
    const savedState = sessionStorage.getItem("autoRefresh")
    return savedState ? JSON.parse(savedState) : true
  })

  const [readOnly, setReadOnly] = useState(false)
  const token = sessionStorage.getItem("Token") || "" // Récupérer le token depuis le stockage

  console.log('Token retrieved from sessionStorage:', token); // Log the token

  useEffect(() => {
    // Charger l'état initial du mode lecture seule depuis l'API
    User.getReadOnlyState(token)
      .then((state) => setReadOnly(state))
      .catch((error) => console.error("Failed to fetch read-only state:", error))
  }, [token])

  const toggleReadOnly = (value: boolean) => {
    console.log('Toggling read-only mode to:', value); // Log the value being toggled
    setReadOnly(value)
    User.updateReadOnlyState(token, value).catch((error) =>
      console.error("Failed to update read-only state:", error)
    )
  }

  useEffect(() => {
    sessionStorage.setItem("autoRefresh", JSON.stringify(autoRefresh))
  }, [autoRefresh])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button
            className="hover:cursor-pointer"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Button>
          <h1 className="text-lg font-semibold">Paramètres</h1>
        </div>
      </header>
      <main className="flex-1 p-4 space-y-4">
        <div className="w-full border rounded-lg shadow-sm p-4 bg-card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Général</h2>
            <p className="text-sm text-muted-foreground">
              Gérez vos préférences d&apos;affichage
            </p>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="auto-refresh" className="text-base">
                  Rafraîchissement automatique
                </Label>
                <p className="text-sm text-muted-foreground">
                  Actualiser automatiquement le contenu toute les 5 minutes
                </p>
              </div>
            </div>
            <Switch
              checked={autoRefresh}
              onChange={setAutoRefresh}
            />
          </div>
        </div>

        <div className="w-full border rounded-lg shadow-sm p-4 bg-card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Mode Lecture Seule</h2>
            <p className="text-sm text-muted-foreground">
              Activez ou désactivez le mode lecture seule pour votre compte.
            </p>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="read-only" className="text-base">
                  Mode Lecture Seule
                </Label>
              </div>
            </div>
              <Switch
                checked={readOnly} 
                onChange={toggleReadOnly} 
              />
          </div>
        </div>

        <div className="w-full border rounded-lg shadow-sm p-4 bg-card mb-14">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Utilisateurs bloqués</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Gérez les utilisateurs que vous avez bloqués
            </p>
          </div>
          <BlockedUsersList />
        </div>
      </main>
    </div>
  )
}