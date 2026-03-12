import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Clients',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Listeners',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Admin',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Webhook',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];


import { useTranslation } from 'react-i18next';

const navIcons = {
  home: 'ic-analytics',
  clients: 'ic-user',
  listeners: 'ic-cart',
  admin: 'ic-blog',
  webhook: 'ic-lock',
  not_found: 'ic-disabled',
};

export const useNavData = () => {
  const { t } = useTranslation();

  return [
    { title: t('nav.home'), path: '/', icon: icon(navIcons.home) },
    { title: t('nav.clients'), path: '/user', icon: icon(navIcons.clients) },
    { title: t('nav.listeners'), path: '/products', icon: icon(navIcons.listeners) },
    { title: t('nav.admin'), path: '/blog', icon: icon(navIcons.admin) },
    { title: t('nav.webhook'), path: '/sign-in', icon: icon(navIcons.webhook) },
    { title: t('nav.not_found'), path: '/404', icon: icon(navIcons.not_found) },
  ];
};