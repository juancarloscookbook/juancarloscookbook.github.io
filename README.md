# Custom Cookbook Builder — independent family cookbook template

A clean-start cookbook website inspired by Maika's Cookbook. **No recipes, photographs, Supabase keys, user data, or account credentials from Maika's Cookbook are included.**

## Features available in this version
- Public recipe browsing, category filtering, search, ingredients, numbered methods, kitchen notes.
- Owner-only sign-in, add/edit/delete recipes, gallery photo upload or image URL.
- Cloud recipes and design settings stored in each owner's **separate** Supabase project.
- Owner-only Customize screen: cookbook name, introduction, footer, banner URL, colors, fonts, categories, card layouts, homepage section ordering and kitchen notes.
- PWA install support, offline fallback for previously visited pages, JSON recipe export.

## Initial setup (one time per family member)
1. Use **Use this template** to create a **new repository** for each person. For free GitHub Pages hosting, make that website repository **Public**. (The master template can remain private.)
2. Create a **new Supabase project owned by that person**. In **Authentication > Users**, create or invite their email as the owner, and copy their **user UUID**. Make sure they can sign in with email/password.
3. In that project's **SQL Editor**, open `supabase-setup.sql`, replace **every** `REPLACE_WITH_OWNERS_UUID` with the UUID, then run the SQL. **Never run this SQL against Maika's existing Supabase project.**
4. Open `config.js` in the new GitHub website repository. Fill in `supabaseUrl`, `supabasePublishableKey` (public key only) and `ownerUserId`. Do not enter a password, secret key, or service-role key.
5. In the website repository: **Settings > Pages > Build and deployment > Deploy from a branch > main / (root)**, then Save. Wait for the site to publish.
6. Open the published website, choose **Owner sign in**, then **Customize**. Add the first recipe.
7. On iPhone/iPad, open in Safari and use Share > Add to Home Screen.

## Safety and separation
The public website uses only the Supabase publishable key. Database row-level security ensures only the configured owner UUID can write. Public visitors can read recipes and settings. Gallery images are public so visitors can view them. Each family member must use a separate Supabase project and repository. Never copy Maika's config.js or Supabase project into another person's cookbook.

## Current limitations
- App icon is the default `icon.svg` and must currently be replaced in the repository to personalize it; changing the name in Customize does not change the installed PWA's manifest name until `manifest.webmanifest` is edited.
- Logo URL is stored as a setting, but a separate logo rendering control is not yet included.
- Homepage banner uses an image URL, not a gallery-upload control.
- Backup JSON export is supported; import is not yet implemented.
- Offline mode serves cached website files; adding/editing recipes requires an internet connection.
- This is a **new clean implementation** of the cookbook experience, not a byte-for-byte copy of Maika's original app.

## Files
`index.html`, `styles.css`, `app.js`, `config.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `supabase-setup.sql`.
