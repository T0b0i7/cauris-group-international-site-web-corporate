// Préfixe les chemins publics avec le basePath (GitHub Pages : /cauris-group-international-site-web-corporate).
// Indispensable : les URL absolues /images/... cassent sous sous-chemin, next/image et <img> ne les préfixent pas en export statique.
export const basePath = process.env.NEXT_PUBLIC_BASEPATH || '';
export const img = (p: string) => {
  if (!p || p.startsWith('http') || p.startsWith('data:')) return p;
  return `${basePath}${p.startsWith('/') ? p : `/${p}`}`;
};
