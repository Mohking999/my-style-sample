import React from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Scissors, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-12">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: 'La Maison MyStyle' },
        ]}
      />

      <div className="border-b border-border pb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-heritage-gold font-bold block mb-2">
          Héritage & Création
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">
          L'Élégance Algérienne Réinventée
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Fondée au cœur d’Alger, MyStyle est une maison de mode qui fait dialoguer les silhouettes contemporaines les plus épurées avec le patrimoine séculaire de la haute couture traditionnelle algérienne.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <h2 className="font-serif text-xl font-bold text-primary">
            Une Passion pour le Savoir-Faire Ancestral
          </h2>
          <p>
            De la Casbah d’Alger aux citadelles de Tlemcen et Constantine, l’Algérie recèle l’un des patrimoines textiles les plus riches de Méditerranée. Chaque Karakou brodé au fil d’or Majboud, chaque Burnous tissé dans les Aurès et chaque Chedda perle après perle témoigne d’une rigueur et d’une poésie inégalées.
          </p>
          <p>
            Chez MyStyle, nous refusons les compromis : nous travaillons en direct avec des maîtres tailleurs et brodeurs formés de génération en génération, pour vous offrir des créations authentiques, durables et chargées d'âme.
          </p>
        </div>
        <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-border">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800"
            alt="Atelier de confection MyStyle Alger"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
        <div className="p-5 bg-surface-subtle border border-border space-y-2">
          <Scissors className="w-6 h-6 text-forest-700" />
          <h3 className="font-serif text-base font-bold text-primary">Ateliers à Alger</h3>
          <p className="text-xs text-neutral-600">
            Confection de nos pièces modernes et retouches sur-mesure dans nos propres ateliers.
          </p>
        </div>

        <div className="p-5 bg-surface-subtle border border-border space-y-2">
          <Sparkles className="w-6 h-6 text-heritage-gold" />
          <h3 className="font-serif text-base font-bold text-primary">Matériaux Nobles</h3>
          <p className="text-xs text-neutral-600">
            Laine vierge peignée, lin européen, crêpe de soie et fils d’or garantis pour durer.
          </p>
        </div>

        <div className="p-5 bg-surface-subtle border border-border space-y-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h3 className="font-serif text-base font-bold text-primary">Fiabilité 58 Wilayas</h3>
          <p className="text-xs text-neutral-600">
            Un service d'expédition rigoureux avec possibilité de vérification avant paiement.
          </p>
        </div>
      </div>
    </div>
  );
};
