"use client";

import { ChangePasswordForm } from "@/components/change-password-form";
import { UpdateUserForm } from "@/components/update-user-form";
import { Card } from "@heroui/react";
import React from "react";
import { useSession } from "../lib/auth-client";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="py-6 px-6 max-w-4xl mx-auto space-y-8">

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
        <p>Le présent site est édité par :</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Nom du site :</strong> Ten Thousand Hours</li>
          <li><strong>Éditeur :</strong> Société fictive Ten Thousand Hours</li>
          <li><strong>Forme juridique :</strong> SAS</li>
          <li><strong>Capital social :</strong> 10 000 €</li>
          <li><strong>Siège social :</strong> 123 rue de l’Innovation, 75000 Paris, France</li>
          <li><strong>RCS :</strong> Paris 123 456 789</li>
          <li><strong>Email :</strong> contact@ten-thousand-hours.com</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Directeur de la publication</h2>
        <p>Le directeur de la publication est : <strong>John Doe</strong></p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Hébergement</h2>
        <p>Le site est hébergé par :</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Hébergeur :</strong> Vercel Inc.</li>
          <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
          <li><strong>Site web :</strong> <a href="https://vercel.com" className="text-sky-500 underline">vercel.com</a></li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Propriété intellectuelle</h2>
        <p>
          L’ensemble du contenu présent sur le site (textes, images, logos, icônes, graphismes, structure, code source) est la propriété exclusive de Ten Thousand Hours, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site est interdite sans autorisation écrite préalable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Données personnelles</h2>
        <p>
          Le site peut collecter des données personnelles dans le cadre de son fonctionnement (création de compte, authentification, suivi des apprentissages). Elles sont utilisées uniquement dans le cadre du service proposé et ne sont jamais revendues à des tiers.
        </p>
        <p>
          Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, opposition et portabilité. Pour exercer ces droits, contactez <a href="mailto:contact@ten-thousand-hours.com" className="text-sky-500 underline">contact@ten-thousand-hours.com</a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Cookies</h2>
        <p>
          Le site utilise des cookies strictement nécessaires au bon fonctionnement de l’application (authentification, session utilisateur). Aucun cookie publicitaire ou de tracking tiers n’est utilisé sans consentement explicite.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Responsabilité</h2>
        <p>
          Ten Thousand Hours s’efforce de fournir des informations aussi précises que possible. Toutefois, le site ne saurait être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour. L’utilisation du site se fait sous la seule responsabilité de l’utilisateur.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
        </p>
      </section>
    </div>
  );
}
