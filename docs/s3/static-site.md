---
title: Host a static website on S3 (with CloudFront)
sidebar_position: 1
tags:
  - s3
  - cloudfront
  - static-site
  - beginner
---

> **Snapshot**  
> **🎯 Goal:** Host a static website on S3 and serve it securely via CloudFront (HTTPS)  
> **⌚ Time:** 30–60 min **💸 Cost:** low for small sites (S3 storage + CloudFront requests/transfer) **🏷️ Skill level:** Beginner–Intermediate  
> Recommended pattern: **private S3 bucket** + **CloudFront + Origin Access Control (OAC)**.

---

## What you’ll build

- An S3 bucket that stores your website files (private)
- A CloudFront distribution that serves:
  - HTTPS
  - caching at the edge
  - an optional custom domain (e.g., `www.example.com`)
- (Optional) Route 53 DNS records pointing your domain to CloudFront

> If you don’t have a domain yet, start here: **[Get a personal domain with Route 53](../route53/buy-domain)**

---

## 1 Prerequisites

| Requirement | Notes |
|---|---|
| A static site build | e.g., `index.html`, CSS/JS assets |
| AWS account + permissions | S3 + CloudFront + ACM + (optional) Route 53 |
| Custom domain (optional) | You can also use the CloudFront default domain |
| Certificate (optional, for custom domain) | **ACM certificate must be in `us-east-1`** for CloudFront |

---

## 2 High-level flow

```text
S3 bucket (private) → upload files → CloudFront (OAC) → (optional) custom domain + ACM → (optional) Route 53 alias
```

---

## 3 Step-by-step

### 3.1 Create an S3 bucket (private)

**Console path**: S3 → **Create bucket**

Recommended settings:

- Bucket name: `YOUR_BUCKET_NAME` (globally unique)
- **Block all public access**: ON (keep it ON)
- Versioning: optional

Do **not** enable “Static website hosting” for the OAC approach.

---

### 3.2 Upload your website files

**Console path**: S3 → your bucket → **Upload**

Upload your build output (must include `index.html`).

> Tip: keep the bucket layout flat and predictable, e.g. `index.html`, `assets/...`.

---

### 3.3 Request an ACM certificate (custom domain only)

If you want `www.example.com` or `example.com`:

**Console path**: ACM → switch region to **N. Virginia (`us-east-1`)** → **Request**

- Choose: **Public certificate**
- Add domain names:
  - `example.com`
  - `www.example.com`
- Validation method: **DNS validation** (recommended)

If you use Route 53, ACM can create the DNS validation records automatically.

---

### 3.4 Create a CloudFront distribution (with OAC)

**Console path**: CloudFront → **Create distribution**

Key settings:

1) **Origin**
- Origin domain: select your S3 bucket
- Origin access: choose **Origin access control settings (recommended)**
  - Create a new OAC if prompted

2) **Default cache behavior**
- Viewer protocol policy: **Redirect HTTP to HTTPS**
- Allowed HTTP methods: **GET, HEAD** (and **OPTIONS** if needed)

3) **Settings**
- Default root object: `index.html`
- Alternate domain name (CNAME) (optional): `www.example.com`
- Custom SSL certificate (optional): select your ACM cert (**must be us-east-1**)

4) **SPA routing (optional)**
If this is a Single Page App (React/Next static export), set a custom error response:

- Error code: **403** and/or **404** → response code **200** → response page `/index.html`

Create the distribution.

---

### 3.5 Lock the S3 bucket to CloudFront only (bucket policy)

After creating the distribution, CloudFront will show a prompt like “Update bucket policy”.
If it doesn’t, add it manually:

**Console path**: S3 → your bucket → **Permissions** → **Bucket policy**

Use a policy like this (replace placeholders):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontReadViaOAC",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

> Keep **Block public access ON**. CloudFront will be your public entry point.

---

### 3.6 Point your domain to CloudFront (optional)

If you’re using Route 53 hosted zones:

**Console path**: Route 53 → Hosted zones → your zone → **Create record**

Create (or UPSERT) both:

- **A (Alias)** → CloudFront distribution
- **AAAA (Alias)** → CloudFront distribution (IPv6)

---

## 4 Validation & troubleshooting

### Validate

1) CloudFront default domain (works even without custom domain):
- CloudFront → your distribution → Domain name (e.g., `d123abc.cloudfront.net`)

2) If using custom domain:

```bash
dig +short www.example.com
```

Expected:

- Domain resolves (DNS returns CloudFront IPs)
- `https://www.example.com` loads your site

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| CloudFront shows **AccessDenied** | Bucket policy/OAC mismatch | Re-check policy placeholders (Account ID, Distribution ID, bucket name) |
| Certificate can’t be selected in CloudFront | Cert not in `us-east-1` | Request ACM cert in **N. Virginia** |
| 403 on `/` | Missing `index.html` or wrong default root object | Upload `index.html` and set default root object |
| Changes not visible | CloudFront caching | Create invalidation for `/*` (temporary) |
| SPA deep links 404 | No error rewrite to `index.html` | Add custom error response 404→200 `/index.html` |

---

## 5 Cleanup

To avoid ongoing cost:

1) CloudFront
- Disable distribution, then delete it (deletion requires it to be disabled)

2) S3
- Delete objects, then delete bucket

3) ACM (optional)
- Delete the certificate if you no longer need it

4) Route 53 (optional)
- Remove alias records if you created them

---

## 6 References

- AWS Docs — CloudFront OAC: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- AWS Docs — Hosting static websites: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html
