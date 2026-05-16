# Testing Protocol

Before processing real clients, follow this protocol to verify the end-to-end strategic flow.

## 1. Admin Dashboard Audit
- [ ] Login via `/admin/dashboard` using `ADMIN_PASSWORD`.
- [ ] Create 3 types of Sandbox Leads:
    - `NORMAL`: Standard data.
    - `COMPLEX`: Dual NOC targets.
    - `EMPTY`: Missing info to test hallucination detection.
- [ ] Verify **Strategic Intelligence Pipeline** displays correctly.
- [ ] Verify **Calibration Dashboard** (`/admin/calibration`) updates live.

## 2. Intelligence Pipeline Test
- [ ] Trigger **Strategic Audit** (Module 0).
- [ ] Verify **Employability Scores** update in the lead view.
- [ ] Generate **Market Positioning** (Module 1).
- [ ] **REVIEW & APPROVE** Module 1.
- [ ] Generate **Resume Strategy** (Module 2).
- [ ] Verify Module 2 content aligns with Module 1 targets.

## 3. Client Portal Verification
- [ ] Click **"Generate Access Link"** for a test lead.
- [ ] Open the portal link in an **Incognito Window**.
- [ ] **CONFIRM**: Internal notes are NOT visible.
- [ ] **CONFIRM**: Quality scores/metadata are NOT visible.
- [ ] **CONFIRM**: Only APPROVED modules are visible.
- [ ] Toggle **"Portal Status"** to Locked and verify access is denied.

## 4. PDF Export Verification
- [ ] Go to **"Review & Assemble"** tab.
- [ ] Click **"Export Executive PDF"**.
- [ ] Verify:
    - Cover page branding is correct.
    - All approved modules are included.
    - Table of Contents links are logical.
    - Roadmap is visually sound.
    - Text rendering is clean and professional.

## 5. Intake Webhook Test
- [ ] Submit a test response to your **Tally Form**.
- [ ] Verify the lead appears instantly in the **Admin Dashboard**.
- [ ] Check logs for `TALLY_SIGNATURE_VERIFIED`.
