---
title: Get a personal domain with AWS Route 53
sidebar_position: 1
tags:
  - route53
  - dns
  - domain-registration
  - beginner
---

> **Snapshot**  
> **🎯 Goal:** Register a domain (e.g., `example.com`) and manage DNS in Route 53  
> **⌚ Time:** 10–15 min **💸 Cost:** depends on TLD (typ. USD ~$7–$35 / year) **🏷️ Skill level:** Beginner  
> You’ll use **Route 53 Domains** (registrar) and **Route 53 Hosted Zones** (DNS). No coding required.

---

## What you’ll learn

- The difference between **Route 53 Domains** (registration) and **Hosted Zones** (DNS)
- How to register a domain using the AWS Console or AWS CLI
- How to create common DNS records (A / AAAA / CNAME) and **Alias** records
- How to validate DNS resolution using `dig` or `nslookup`

---

## 1 Prerequisites

| Requirement | Notes |
|---|---|
| AWS account with billing enabled | Domain fee is charged when you register |
| IAM permissions | `route53:*` and `route53domains:*` (temporarily, if needed) |
| (Optional) AWS CLI v2 | Useful for automation |

> Security note: prefer **AWS IAM Identity Center (SSO)** over long-lived access keys.

---

## 2 High-level flow

```text
Check availability → Register domain → Verify email → Create hosted zone → Add records → Validate
```

---

## 3 Step-by-step

### 3.1 Check availability

**Console path**: Route 53 → **Registered domains** → **Register domain** → search your domain

**CLI (optional)**

```bash
aws route53domains check-domain-availability \
  --domain-name example.com \
  --output text
# EXPECTED: AVAILABLE
```

---

### 3.2 Register the domain

**Console path**: Route 53 → **Registered domains** → **Register domain** → complete checkout

**CLI (optional)**

1) Create a contact JSON file. Use placeholders while drafting; replace with real values before running:

```json
{
  "FirstName": "YOUR_FIRST_NAME",
  "LastName": "YOUR_LAST_NAME",
  "ContactType": "PERSON",
  "Email": "YOUR_EMAIL",
  "PhoneNumber": "+1.5555555555",
  "AddressLine1": "YOUR_ADDRESS_LINE_1",
  "City": "YOUR_CITY",
  "CountryCode": "CA",
  "ZipCode": "YOUR_POSTAL_CODE"
}
```

2) Register:

```bash
aws route53domains register-domain \
  --domain-name example.com \
  --duration-in-years 1 \
  --admin-contact file://contact.json \
  --registrant-contact file://contact.json \
  --tech-contact file://contact.json \
  --auto-renew \
  --privacy-protect-contact-data
```

**Important**: AWS will send a verification email. Complete verification within the allowed window (shown in the console).

---

### 3.3 Create a public hosted zone

If you registered the domain in Route 53, AWS typically creates the hosted zone automatically. If not (or if you want to create it explicitly), do this:

**Console path**: Route 53 → **Hosted zones** → **Create hosted zone** → *Public hosted zone*

**CLI (optional)**

```bash
aws route53 create-hosted-zone \
  --name example.com \
  --caller-reference "$(date +%s)"
```

Record the **Name Servers (NS)** from the hosted zone. If you registered the domain elsewhere, you must configure those NS values at your registrar.

---

### 3.4 Add DNS records

Typical records you’ll add:

- **A / AAAA (Alias)** to CloudFront or ALB
- **CNAME** for subdomains (e.g., `www`)
- **TXT** for domain verification (e.g., Google Workspace)

#### Example: Apex domain Alias to CloudFront (A record)

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Comment": "Alias to CloudFront",
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "example.com.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DISTRIBUTION.cloudfront.net.",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

> If you need IPv6 support, repeat with `"Type": "AAAA"`.

---

### 3.5 Validate DNS

```bash
dig +short example.com
nslookup example.com
```

If you set an Alias to CloudFront, you should see CloudFront IPs returned.

---

## 4 Validation & troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Domain shows “pending verification” | Verification email not completed | Re-send verification in Route 53 Domains and complete it |
| `SERVFAIL` / no answer | Wrong Name Servers at registrar | Ensure registrar NS matches hosted zone NS |
| Site loads without HTTPS | CloudFront not configured with certificate | Use ACM certificate in `us-east-1` for CloudFront |

If your goal is hosting a website, continue to: **[Host a static website on S3 (with CloudFront)](../s3/static-site)**

---

## 5 Cleanup

You typically do **not** “clean up” a domain registration; it is a paid asset.

What you can clean up safely:

- Delete unused hosted zones
- Delete unused records
- Turn off auto-renew if you don’t want renewal

**Delete hosted zone (dangerous if in use):**

```bash
aws route53 delete-hosted-zone --id YOUR_HOSTED_ZONE_ID
```

---

## 6 References

- AWS Docs — Route 53: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html
- AWS Docs — Route 53 Domains: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html
