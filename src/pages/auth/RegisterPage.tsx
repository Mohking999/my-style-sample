import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toastError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    const ok = await register(name, email, password, phone);
    setLoading(false);
    if (ok) {
      success('Compte créé avec succès ! Bienvenue chez MyStyle.');
      navigate('/account');
    } else {
      toastError('Erreur lors de la création du compte. Vérifiez les informations saisies.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-start">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          {t('auth.register')}
        </h1>
        <p className="text-xs text-neutral-500">
          Rejoignez la maison MyStyle et profitez d'un suivi privilégié de vos commandes.
        </p>
      </div>

      <div className="bg-white border border-border p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label={t('auth.name')}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Fatima Zohra"
          />

          <Input
            label={t('auth.email')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
          />

          <Input
            label={t('auth.phone')}
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05 / 06 / 07 ..."
            helperText="Numéro algérien pour la livraison (05, 06, 07 ou +213)"
          />

          <Input
            label={t('auth.password')}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Au moins 6 caractères"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={loading}
          >
            {t('auth.register')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <Link
            to="/account/login"
            className="text-xs text-neutral-600 hover:text-primary font-medium underline"
          >
            {t('auth.hasAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};
