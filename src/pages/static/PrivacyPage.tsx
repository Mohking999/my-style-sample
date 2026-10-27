import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Politique de Confidentialité' },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold text-primary mb-4">
        Politique de Confidentialité & Protection des Données
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-border pt-6">
        <h2 className="font-serif text-base font-bold text-primary">1. Collecte des Données Personnelles</h2>
        <p>
          Nous collectons uniquement les informations strictement nécessaires au traitement de vos commandes et livraisons en Algérie : nom, prénom, numéro de téléphone algérien, adresse exacte et wilaya de livraison.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">2. Utilisation des Informations</h2>
        <p>
          Vos coordonnées sont partagées exclusivement avec nos services internes (service client, maîtres tailleurs) et avec notre transporteur partenaire afin d'assurer l'acheminement de votre colis. Aucune donnée n'est cédée ou vendue à des tiers à des fins publicitaires.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">3. Sécurité des Données</h2>
        <p>
          Les mots de passe de nos utilisateurs sont hachés de manière irréversible via des algorithmes cryptographiques de pointe. Les cookies de session sont sécurisés pour protéger votre compte.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">4. Vos Droits</h2>
        <p>
          Conformément à la loi 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel en Algérie, vous pouvez demander à tout moment l'accès, la rectification ou la suppression de vos données personnelles par e-mail à privacy@mystyle.dz.
        </p>
      </div>
    </div>
  );
};
