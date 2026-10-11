# ZoCo Drain & Sewer LLC

**Live website:** https://zocodrains.com/  
**Built and maintained with Exponet Labs**

Custom static website for ZoCo Drain & Sewer LLC, an owner-operated drain and home-maintenance service based in Highland Lakes, New Jersey, serving eligible jobs in Sussex and Passaic counties.

## Where everything lives

| Service | Purpose |
| --- | --- |
| [zocodrains.com](https://zocodrains.com/) | Public website |
| [GitHub Actions](../../actions) | Deployment status and technical SEO tests |
| [Google Search Console](https://search.google.com/search-console) | Organic search clicks, impressions and indexing |
| [Google Business Profile](https://business.google.com/) | Business listing, Google Maps and reviews |
| [Google Analytics](https://analytics.google.com/) | Optional website visitor and contact-link analytics; requires separate setup |

Google Search Console and Google Business Profile access is managed by the business owner. GitHub does **not** display private Google analytics data.

## How the site is deployed

The site is hosted on **GitHub Pages**, with the custom domain defined in `CNAME`.

- Changes merged into `main` are deployed through [`.github/workflows/pages.yml`](.github/workflows/pages.yml).
- [`index.html`](index.html) is the homepage. Service and county pages live in folders containing `index.html`.
- `styles.css`, `theme.css` and `script.js` control appearance and interactions.
- `robots.txt` and `sitemap.xml` provide the crawl-discovery foundation. Search Console confirms the sitemap has been submitted, but **submission does not guarantee indexing**.
- The [technical SEO check](scripts/check_seo.py) validates sitemap coverage, canonicals, essential metadata, H1s, indexability and parseable JSON-LD. It runs on pull requests and pushes to `main`.

## Working safely on the website

1. Create a branch rather than editing `main` directly.
2. Make the smallest change necessary. Preserve established visual design unless a redesign is approved.
3. When adding or removing a page, update `sitemap.xml` to match.
4. Open a pull request and check the **Validate technical SEO** workflow.
5. Review the page visually on desktop and mobile before merging significant layout changes. Merging into `main` publishes the new version.

### SEO and analytics notes

- Distinctive, accurate page titles and helpful service content matter more than repeating keywords.
- Keep business categories, services, service area and contact information factual and current.
- Search Console measures appearances and clicks from Google Search. It does not measure booked jobs.
- Google Analytics 4 is not installed in this repository by default. If activated, install it with the business owner's approval, configure appropriate privacy notices, and track contact actions without collecting message or call contents.
- Google Business Profile / Maps performance is separate from Search Console.
- Don't post Google account passwords, tokens, API keys or private customer information into repository files or issues.

## Ownership and access

The business owner retains control of business accounts, domain registration, and Google Business Profile. Collaborators can be invited through GitHub repository **Settings → Collaborators** when editing access is needed. The public repository is viewable without a collaborator invitation.

**Service inquiries:** use the Call or Text buttons at [zocodrains.com](https://zocodrains.com/).
