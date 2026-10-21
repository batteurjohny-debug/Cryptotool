Code 26
Trois pages :
index.html — chiffrer/déchiffrer du texte (A1Z26)
fichiers.html — chiffrer/déchiffrer des fichiers (AES-256, dans le navigateur)
coffre.html — stocker ses fichiers chiffrés en ligne (compte + Supabase)
1. Mettre en ligne avec GitHub Pages
Crée un dépôt sur GitHub (public ou privé).
Mets-y tous ces fichiers, en gardant la structure : index.html, fichiers.html, coffre.html, README.md, et le dossier assets/ avec style.css, rain.js, supabase-config.js.
Dans le dépôt : Settings → Pages → Branch choisis main (ou master), dossier /root, puis Save.
Le site sera en ligne à l'adresse que GitHub affiche (quelques minutes d'attente la première fois).
2. Connecter Supabase (pour le Coffre)
Crée un compte sur supabase.com et un nouveau projet.
Dans Project Settings → API, note :
Project URL
anon public (clé publique — jamais la clé service_role, qui doit rester secrète)
Ouvre assets/supabase-config.js et remplace les deux valeurs par les tiennes.
Dans Authentication → Providers, active Email (déjà actif par défaut).
Dans Storage, crée un bucket nommé exactement coffre (privé, pas public).
Ajoute une règle d'accès (Storage → Policies) pour que chaque utilisateur ne voie que ses propres fichiers :
create policy "Chacun son dossier"
on storage.objects for all
using (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text);
Republie assets/supabase-config.js sur GitHub (ou mets à jour le fichier existant). Le Coffre fonctionne dès que la page le recharge.
Pourquoi c'est sûr ainsi
Le mot de passe de chiffrement (dans fichiers.html) et le mot de passe du compte (dans coffre.html) sont deux choses différentes. Le premier protège le contenu du fichier ; le second protège seulement l'accès au coffre.
Supabase ne reçoit que des fichiers déjà chiffrés. Il ne peut pas les lire.
Si le mot de passe de chiffrement est perdu, le fichier est perdu — aucune récupération possible depuis le Coffre. C'est volontaire : c'est ce qui rend le chiffrement réel.
Prochaines étapes (voir feuille-de-route.md)
Clé sur le code A1Z26
Clé de récupération optionnelle (coffre récupérable vs strict)
Journal des actions
Version installable hors ligne
