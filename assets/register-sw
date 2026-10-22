if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Hors ligne dès le premier chargement, ou navigateur qui ne supporte
      // pas les service workers : le site continue de fonctionner normalement,
      // juste sans le mode hors ligne.
    });
  });
}
