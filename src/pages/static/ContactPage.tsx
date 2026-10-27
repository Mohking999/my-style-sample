import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Message envoyé avec succès. Notre service client vous recontactera sous 24h.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Contactez-nous' },
        ]}
      />

      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-2">
          Contactez la Maison MyStyle
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
          Une question sur une taille, un délai de livraison, ou un projet de confection sur-mesure pour votre mariage ? Notre équipe vous répond avec attention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-forest-50 text-forest-700 border border-forest-100 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-primary mb-1">
                Téléphone & WhatsApp
              </h3>
              <p className="text-sm font-semibold text-primary font-mono">
                +213 (0) 550 12 34 56
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Disponible du Samedi au Jeudi, de 09h00 à 19h00
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-forest-50 text-forest-700 border border-forest-100 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-primary mb-1">
                E-mail Service Client
              </h3>
              <p className="text-sm font-semibold text-primary font-mono">
                contact@mystyle.dz
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Réponse sous 24h ouvrées
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-forest-50 text-forest-700 border border-forest-100 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-primary mb-1">
                Atelier Showroom
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                48 Rue Didouche Mourad (Près de la Grande Poste)<br />
                Alger Centre, 16000, Algérie
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                (Essayages sur-mesure sur rendez-vous uniquement)
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-border p-6 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-primary">Merci pour votre message !</h3>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Un conseiller de notre service client prendra contact avec vous par téléphone ou WhatsApp dans les plus brefs délais.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary mb-2">
                Envoyez-nous un message
              </h3>
              <Input
                label="Nom & Prénom"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amine Benali"
              />
              <Input
                label="Numéro de téléphone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05 / 06 / 07 ..."
              />
              <Input
                label="Sujet de votre demande"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Suivi commande, demande devis Karakou..."
              />
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                  Votre message <span className="text-algerian-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-border text-xs p-3 focus:outline-none focus:border-primary"
                  placeholder="Écrivez votre message ici..."
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Envoyer le message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
