import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, User, Scissors, Headphones } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      success('Connexion réussie ! Heureux de vous revoir.');
      navigate(from, { replace: true });
    } else {
      toastError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    const ok = await login(demoEmail, demoPass);
    setLoading(false);
    if (ok) {
      success('Connexion au compte de démonstration réussie.');
      navigate(demoEmail.includes('admin') ? '/admin' : '/account', { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-start">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          {t('auth.login')}
        </h1>
        <p className="text-xs text-neutral-500">
          Accédez à vos commandes, vos favoris et vos demandes de confection sur-mesure.
        </p>
      </div>

      <div className="bg-white border border-border p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
          />

          <Input
            label={t('auth.password')}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={loading}
          >
            {t('auth.login')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <Link
            to="/account/register"
            className="text-xs text-neutral-600 hover:text-primary font-medium underline"
          >
            {t('auth.noAccount')}
          </Link>
        </div>

        {/* Demo Accounts Quick-Login Helper for Reviewer Testing */}
        <div className="mt-8 pt-6 border-t border-neutral-100 bg-neutral-50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 text-xs">
          <p className="font-semibold text-neutral-600 uppercase tracking-wider text-[10px] mb-2 text-center">
            Comptes de test rapides :
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('client@mystyle.dz', 'client1234')}
              className="w-full text-start px-2.5 py-1.5 bg-white border border-border hover:border-neutral-900 transition-colors flex items-center justify-between text-neutral-700"
            >
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Client (Leila Mansouri)</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-400">client@mystyle.dz</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@mystyle.dz', 'admin1234')}
              className="w-full text-start px-2.5 py-1.5 bg-white border border-border hover:border-neutral-900 transition-colors flex items-center justify-between text-forest-800 font-medium"
            >
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>Directeur Admin (Yacine)</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-400">admin@mystyle.dz</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('tailor@mystyle.dz', 'tailor1234')}
              className="w-full text-start px-2.5 py-1.5 bg-white border border-border hover:border-neutral-900 transition-colors flex items-center justify-between text-neutral-700"
            >
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Scissors className="w-3.5 h-3.5 text-heritage-gold" />
                <span>Maître Tailleur (Atelier Casbah)</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-400">tailor@mystyle.dz</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('staff@mystyle.dz', 'staff1234')}
              className="w-full text-start px-2.5 py-1.5 bg-white border border-border hover:border-neutral-900 transition-colors flex items-center justify-between text-neutral-700"
            >
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Headphones className="w-3.5 h-3.5 text-blue-600" />
                <span>Service Client / Staff (Nadia)</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-400">staff@mystyle.dz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
