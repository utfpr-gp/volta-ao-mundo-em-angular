// about-page.ts: a classe exportada como padrão
export default class AboutPage {}

// app.routes.ts: sem o .then, o Angular usa o export padrão
{ path: 'sobre', loadComponent: () => import('./pages/about-page/about-page') },
