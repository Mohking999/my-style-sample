import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const SizeGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Guide des Tailles' },
        ]}
      />

      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          Guide des Tailles & Prise de Mesures
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Retrouvez nos tableaux de correspondance de tailles pour hommes et femmes, ainsi que nos conseils pour prendre vos mesures à la maison avant de commander une pièce sur-mesure.
        </p>
      </div>

      {/* Guide details */}
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-xl font-bold text-primary mb-3">
            Comment prendre ses mensurations ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
            <div className="p-4 bg-white border border-border">
              <span className="font-bold text-primary block mb-1">1. Tour de poitrine</span>
              <p>Mesurez horizontalement à l’endroit le plus fort de la poitrine, ruban bien plat.</p>
            </div>
            <div className="p-4 bg-white border border-border">
              <span className="font-bold text-primary block mb-1">2. Tour de taille</span>
              <p>Mesurez au creux naturel de la taille, au-dessus du nombril sans serrer.</p>
            </div>
            <div className="p-4 bg-white border border-border">
              <span className="font-bold text-primary block mb-1">3. Tour de hanches</span>
              <p>Mesurez à l’endroit le plus large du bassin, pieds joints.</p>
            </div>
          </div>
        </div>

        {/* Women's Table */}
        <div>
          <h2 className="font-serif text-xl font-bold text-primary mb-3">
            Femmes (Robes, Manteaux, Tailleurs, Karakous)
          </h2>
          <div className="border border-border overflow-x-auto text-xs">
            <table className="w-full text-center divide-y divide-border">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-2.5 px-3 text-start">Taille Algérie / France</th>
                  <th className="py-2.5 px-3">Taille US</th>
                  <th className="py-2.5 px-3">Poitrine (cm)</th>
                  <th className="py-2.5 px-3">Taille (cm)</th>
                  <th className="py-2.5 px-3">Hanches (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">36 (XS)</td>
                  <td className="py-2.5 px-3">2 - 4</td>
                  <td className="py-2.5 px-3">82 - 85</td>
                  <td className="py-2.5 px-3">64 - 67</td>
                  <td className="py-2.5 px-3">88 - 92</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">38 (S)</td>
                  <td className="py-2.5 px-3">6</td>
                  <td className="py-2.5 px-3">86 - 89</td>
                  <td className="py-2.5 px-3">68 - 72</td>
                  <td className="py-2.5 px-3">93 - 97</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">40 (M)</td>
                  <td className="py-2.5 px-3">8</td>
                  <td className="py-2.5 px-3">90 - 94</td>
                  <td className="py-2.5 px-3">73 - 77</td>
                  <td className="py-2.5 px-3">98 - 102</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">42 (L)</td>
                  <td className="py-2.5 px-3">10</td>
                  <td className="py-2.5 px-3">95 - 99</td>
                  <td className="py-2.5 px-3">78 - 83</td>
                  <td className="py-2.5 px-3">103 - 108</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">44 (XL)</td>
                  <td className="py-2.5 px-3">12</td>
                  <td className="py-2.5 px-3">100 - 105</td>
                  <td className="py-2.5 px-3">84 - 89</td>
                  <td className="py-2.5 px-3">109 - 114</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Men's Table */}
        <div>
          <h2 className="font-serif text-xl font-bold text-primary mb-3">
            Hommes (Costumes, Blazers, Chemises)
          </h2>
          <div className="border border-border overflow-x-auto text-xs">
            <table className="w-full text-center divide-y divide-border">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-2.5 px-3 text-start">Taille Veste</th>
                  <th className="py-2.5 px-3">Taille Pantalon</th>
                  <th className="py-2.5 px-3">Poitrine (cm)</th>
                  <th className="py-2.5 px-3">Taille (cm)</th>
                  <th className="py-2.5 px-3">Col Chemise (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">48 (S)</td>
                  <td className="py-2.5 px-3">40</td>
                  <td className="py-2.5 px-3">94 - 97</td>
                  <td className="py-2.5 px-3">80 - 83</td>
                  <td className="py-2.5 px-3">38</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">50 (M)</td>
                  <td className="py-2.5 px-3">42</td>
                  <td className="py-2.5 px-3">98 - 102</td>
                  <td className="py-2.5 px-3">84 - 88</td>
                  <td className="py-2.5 px-3">39 - 40</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">52 (L)</td>
                  <td className="py-2.5 px-3">44</td>
                  <td className="py-2.5 px-3">103 - 107</td>
                  <td className="py-2.5 px-3">89 - 93</td>
                  <td className="py-2.5 px-3">41 - 42</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-start">54 (XL)</td>
                  <td className="py-2.5 px-3">46</td>
                  <td className="py-2.5 px-3">108 - 112</td>
                  <td className="py-2.5 px-3">94 - 98</td>
                  <td className="py-2.5 px-3">43 - 44</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
