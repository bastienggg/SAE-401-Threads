"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RefreshCw } from "lucide-react"

import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export default function Settings() {
  const [autoRefresh, setAutoRefresh] = useState(() => {
    // Charger l'état initial depuis le sessionStorage
    const savedState = sessionStorage.getItem("autoRefresh")
    return savedState ? JSON.parse(savedState) : true // Activé par défaut
  })

  useEffect(() => {
    // Sauvegarder l'état dans le sessionStorage à chaque changement
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
      <main className="flex-1 p-4">
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
      </main>
    </div>
  )
}