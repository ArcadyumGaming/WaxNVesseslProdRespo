# Wax n Vessels (simple version)

Plain HTML/CSS/JS. No build step. Hosted free on GitHub Pages, data lives in Supabase.

## Setup (10 minutes)

1. **Supabase**: create a free project at supabase.com.
2. **Database**: SQL Editor > New query > paste all of `setup.sql` > Run. (Run it once only.)
3. **Your admin login**: Authentication > Users > Add user > Create new user. Enter your email and a password, tick *Auto Confirm User*.
   Then Authentication > Sign In / Providers > turn off *Allow new users to sign up*.
4. **Credentials**: Project Settings > API. Copy the *Project URL* and the *publishable* (or *anon*) key into `config.js`.
5. **GitHub**: create a repo, upload all these files, then Settings > Pages > Deploy from branch > `main` / root.
   Your shop appears at `https://YOUR-USER.github.io/YOUR-REPO/`.

## Using it

- Admin panel: `.../admin.html` (sign in with the user from step 3).
- **Products tab**: add / edit / delete, upload photos (first photo = main), price, sale price, in stock, visible, featured.
- **Site settings tab**: logo, hero image, WhatsApp number, headline, story, social links.
- Changes show on the website immediately (it reads Supabase live and also auto-refreshes).
- Customers press **Order on WhatsApp** on a product and WhatsApp opens with the product name, Product ID (e.g. WNV-0001), link, price, quantity and notes already typed.
- Product links look like `.../index.html#p=WNV-0001`.

## Notes

- The key in `config.js` is the public one, meant for browsers. Only signed-in users can change data. Never put the *service_role / secret* key in here.
- Photos are shrunk in the browser before upload so the site stays fast.
- Files: `index.html` + `app.js` (shop), `admin.html` (admin), `style.css`, `config.js`, `setup.sql`.
