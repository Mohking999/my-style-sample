import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Truck, ShieldCheck, RefreshCw, Search } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

export const DeliveryPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: wilayasData, isLoading } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const res = await fetch('/api/wilayas');
      return res.json();
    },
  });

  const wilayas = wilayasData?.wilayas || [];
  const filteredWilayas = wilayas.filter((w: any) =>
    w.nameFr.toLowerCase().includes(search.toLowerCase()) ||
    w.nameAr.includes(search) ||
    w.code.toString().includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Livraison & Retours 58 Wilayas' },
        ]}
      />

      <div className="border-b border-border pb-6">
        <span className="text-[11px] uppercase tracking-widest text-forest-700 font-bold block mb-1">
          Expédition Nationale
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
          Livraison & Tarifs dans les 58 Wilayas
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
          MyStyle assure une livraison sécurisée à domicile ou en point relais partout en Algérie. Le paiement s'effectue en espèces directement auprès du livreur à la réception de votre colis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white border border-border space-y-2">
          <Truck className="w-5 h-5 text-forest-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Délais de Livraison</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            • Alger & Environs : 24h à 48h<br />
            • Nord & Hauts-Plateaux : 48h à 72h<br />
            • Sud & Grand Sud : 72h à 96h
          </p>
        </div>

        <div className="p-4 bg-white border border-border space-y-2">
          <ShieldCheck className="w-5 h-5 text-heritage-gold" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Paiement à la Livraison</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Vous ne payez rien d'avance. Réglez le montant exact en dinars algériens (DZD) auprès de l’agent de livraison.
          </p>
        </div>

        <div className="p-4 bg-white border border-border space-y-2">
          <RefreshCw className="w-5 h-5 text-algerian-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Échange de Taille</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Possibilité d’échanger la taille sous 48h après réception en contactant simplement notre service client.
          </p>
        </div>
      </div>

      {/* Wilayas Fee Table */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-serif text-xl font-bold text-primary">
            Grille Tarifaire par Wilaya
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Chercher une wilaya (ex: Oran, 16, تلمسان)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border py-1.5 ps-8 pe-3 text-xs focus:outline-none focus:border-primary"
            />
            <Search className="w-3.5 h-3.5 absolute start-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        <div className="border border-border overflow-x-auto max-h-[500px]">
          <table className="w-full text-start text-xs divide-y divide-border">
            <thead className="bg-neutral-50 sticky top-0 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
              <tr>
                <th className="py-2.5 px-4 text-start">Code</th>
                <th className="py-2.5 px-4 text-start">Wilaya</th>
                <th className="py-2.5 px-4 text-start">الولاية</th>
                <th className="py-2.5 px-4 text-end">Livraison à Domicile</th>
                <th className="py-2.5 px-4 text-end">Point Relais (Desk)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Chargement des wilayas...
                  </td>
                </tr>
              ) : filteredWilayas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Aucune wilaya trouvée pour « {search} »
                  </td>
                </tr>
              ) : (
                filteredWilayas.map((w: any) => (
                  <tr key={w.code} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-4 font-mono font-medium text-neutral-500">
                      {String(w.code).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-primary">
                      {w.nameFr}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-neutral-700 font-arabic">
                      {w.nameAr}
                    </td>
                    <td className="py-2.5 px-4 text-end font-semibold text-forest-700">
                      {formatPrice(w.homeDeliveryFee, 'fr')}
                    </td>
                    <td className="py-2.5 px-4 text-end text-neutral-600 font-medium">
                      {formatPrice(w.relayDeliveryFee, 'fr')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
