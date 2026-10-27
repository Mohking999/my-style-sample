import React from 'react';
import { Modal } from '@/components/ui/Modal';

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guide des Tailles & Mensurations" maxWidth="lg">
      <div className="space-y-6 text-start text-xs text-neutral-700">
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-primary text-sm mb-2">
            Femmes : Prêt-à-Porter & Robes
          </h4>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-center divide-y divide-border">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-2 px-3 text-start">Taille</th>
                  <th className="py-2 px-3">Tour de poitrine (cm)</th>
                  <th className="py-2 px-3">Tour de taille (cm)</th>
                  <th className="py-2 px-3">Tour de hanches (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">36 / XS</td>
                  <td className="py-2 px-3">82 - 85</td>
                  <td className="py-2 px-3">64 - 67</td>
                  <td className="py-2 px-3">88 - 92</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">38 / S</td>
                  <td className="py-2 px-3">86 - 89</td>
                  <td className="py-2 px-3">68 - 72</td>
                  <td className="py-2 px-3">93 - 97</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">40 / M</td>
                  <td className="py-2 px-3">90 - 94</td>
                  <td className="py-2 px-3">73 - 77</td>
                  <td className="py-2 px-3">98 - 102</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">42 / L</td>
                  <td className="py-2 px-3">95 - 99</td>
                  <td className="py-2 px-3">78 - 83</td>
                  <td className="py-2 px-3">103 - 108</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">44 / XL</td>
                  <td className="py-2 px-3">100 - 105</td>
                  <td className="py-2 px-3">84 - 89</td>
                  <td className="py-2 px-3">109 - 114</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-primary text-sm mb-2">
            Hommes : Costumes, Blazers & Chemises
          </h4>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-center divide-y divide-border">
              <thead className="bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-2 px-3 text-start">Taille</th>
                  <th className="py-2 px-3">Tour de poitrine (cm)</th>
                  <th className="py-2 px-3">Tour de taille (cm)</th>
                  <th className="py-2 px-3">Longueur de bras (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">48 / S</td>
                  <td className="py-2 px-3">94 - 97</td>
                  <td className="py-2 px-3">80 - 83</td>
                  <td className="py-2 px-3">63</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">50 / M</td>
                  <td className="py-2 px-3">98 - 102</td>
                  <td className="py-2 px-3">84 - 88</td>
                  <td className="py-2 px-3">64</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">52 / L</td>
                  <td className="py-2 px-3">103 - 107</td>
                  <td className="py-2 px-3">89 - 93</td>
                  <td className="py-2 px-3">65</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-start">54 / XL</td>
                  <td className="py-2 px-3">108 - 112</td>
                  <td className="py-2 px-3">94 - 98</td>
                  <td className="py-2 px-3">66</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-forest-50 border border-forest-100 text-forest-900 rounded-xs">
          <p className="font-semibold mb-1">Confection Traditionnelle & Sur-Mesure :</p>
          <p className="leading-relaxed">
            Pour les pièces faites main (Karakou, Chedda, Burnous sur-mesure), notre atelier vous contacte dès réception de votre commande pour affiner vos mensurations exactes en centimètres.
          </p>
        </div>
      </div>
    </Modal>
  );
};
