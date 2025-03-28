import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 

import { User } from "../../data/user"; // Import de la fonction userUpdate


export default function ProfileEditPage() {
  const location = useLocation();
  const user = location.state?.user || {};
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    biography: user.bio || '',
    website: user.link || '',
    location: user.place || '',
    avatar: null, // Add avatar property
    banner: null, // Add banner property
    email: user.email || '', // Add email property
  });
  const [bioLength, setBioLength] = useState(user.bio?.length || 0);
  const navigate = useNavigate(); // Hook pour naviguer
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setProfile((prev) => ({
        ...prev,
        [name]: files[0], // Store the file object
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "biography" && value.length > 200) return;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "biography") setBioLength(value.length);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Préparation des données du formulaire
      const formData = new FormData();
      formData.append("pseudo", user.pseudo || "");
      formData.append("email", profile.email); // Include updated email
      formData.append("bio", profile.biography);
      formData.append("place", profile.location);
      formData.append("link", profile.website);
  
      // Ajout des fichiers (avatar et bannière)
      if (profile.avatar) {
        formData.append("avatar", profile.avatar);
      }
      if (profile.banner) {
        formData.append("banner", profile.banner);
      }
  
      // Appel de la fonction userUpdate
      const token = sessionStorage.getItem("Token");
      const userId = sessionStorage.getItem("id");
      if (!token || !userId) {
        throw new Error("Token or user ID is missing.");
      }
      const response = await User.userUpdate(token, userId, formData);
  
      if (response && response.code === "C-1611") {
        // Afficher le message de succès
        setSuccessMessage("Profil mis à jour avec succès ! Redirection vers votre profil...");
        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          navigate("/profil"); // Redirection vers /profil
        }, 2000);
      } else {
        alert("Une erreur est survenue lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="rounded-lg p-6 h-screen w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Modifier votre profil</h2>
        <p className="text-gray-600">
          Mettez à jour vos informations personnelles visibles sur votre profil public.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Biographie */}
          <div className="space-y-2">
            <Label htmlFor="biography">Biographie</Label>
            <textarea
              id="biography"
              name="biography"
              placeholder="Parlez de vous..."
              value={profile.biography}
              onChange={handleChange}
              className={`min-h-[120px] w-full border border-gray-300 rounded-md p-2 ${
                bioLength > 200 ? "text-red-500" : ""
              }`}
            />
            <p className="text-sm text-gray-500">
              Décrivez-vous en quelques phrases. Cette information sera visible sur votre profil public.
            </p>
            <p className={`text-sm ${bioLength > 200 ? "text-red-500" : "text-gray-500"}`}>
              {bioLength}/200 caractères
            </p>
          </div>

           {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre-email@example.com"
              value={profile.email}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500">
              Mettez à jour votre adresse email. Assurez-vous qu'elle est valide.
            </p>
          </div>

          {/* Site web */}
          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://votre-site.com"
              value={profile.website}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500">
              Ajoutez l'URL de votre site web personnel ou professionnel.
            </p>
          </div>

          {/* Localisation */}
          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ville, Pays"
              value={profile.location}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500">Indiquez votre ville et pays de résidence.</p>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs"
            />
            <p className="text-sm text-gray-500">
              Téléchargez une photo pour votre avatar. Formats acceptés : JPG, PNG.
            </p>
          </div>

          {/* Bannière */}
          <div className="space-y-2">
            <Label htmlFor="banner">Bannière</Label>
            <Input
              id="banner"
              name="banner"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs"
            />
            <p className="text-sm text-gray-500">
              Téléchargez une image pour votre bannière. Formats acceptés : JPG, PNG.
            </p>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}

      <div className="flex justify-between mt-6">
          <Button className="hover:cursor-pointer" variant="outline"      type="button" onClick={() => window.history.back()}>
            Annuler
          </Button>
          <Button className="hover:cursor-pointer" type="submit" disabled=      {isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}