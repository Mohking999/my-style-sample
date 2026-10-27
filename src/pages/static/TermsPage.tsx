import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Conditions Générales de Vente' },
        ]}
      />

      <h1 className="font-serif text-3xl font-bold text-primary mb-4">
        Conditions Générales de Vente (CGV)
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-border pt-6">
        <h2 className="font-serif text-base font-bold text-primary">1. Objet</h2>
        <p>
          Les présentes conditions générales régissent l'ensemble des ventes conclues sur la boutique en ligne MyStyle en Algérie, pour les produits de prêt-à-porter et les confections traditionnelles sur-mesure.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">2. Prix et Monnaie</h2>
        <p>
          Tous les prix affichés sur le site sont exprimés en Dinars Algériens (DZD). Les frais de livraison sont calculés selon la wilaya de destination et le mode sélectionné (à domicile ou point relais).
        </p>

        <h2 className="font-serif text-base font-bold text-primary">3. Modalités de Paiement</h2>
        <p>
          Le paiement s'effectue principalement en espèces à la livraison (Cash on Delivery). Le client règle directement le transporteur à la remise de son colis. Les paiements électroniques par carte Edahabia ou CIB sont soumis aux conditions des opérateurs bancaires algériens partenaires.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">4. Confection Sur-Mesure</h2>
        <p>
          Pour les pièces artisanales confectionnées sur-mesure (Karakou, Chedda, Burnous sur mesure), les délais de confection sont communiqués à titre indicatif et varient généralement entre 10 et 25 jours ouvrables selon la complexité des broderies.
        </p>

        <h2 className="font-serif text-base font-bold text-primary">5. Retours et Échanges</h2>
        <p>
          Conformément à la législation algérienne sur le commerce électronique, vous disposez d'un délai de 48 heures après réception pour signaler un souhait d'échange de taille ou de produit pour le prêt-à-porter non porté avec ses étiquettes d'origine.
        </p>
      </div>
    </div>
  );
};
