-- Custom SQL migration file, put your code below! --

-- Grandfather every account that predates the email-confirmation requirement.
-- Before this feature, signup auto-activated and never set "emailVerified", so
-- all existing users have NULL there. Sign-in now refuses NULL, which would
-- lock those users out. Backfill from "createdAt" (their original signup time).
-- Safe and one-time: no new-flow unverified accounts exist until this deploys.
UPDATE "user"
SET "emailVerified" = "createdAt"
WHERE "emailVerified" IS NULL;