# Branching and Commits

## Model
`feature/US-nnn-short-name` → PR → `dev` → `staging` → `main`. `main` is production truth. Branch protection on `dev`, `staging`, `main`: required checks, linear history, no force-push, signed commits.

## Single-commit rule
Work for one story is squashed into one commit and one push; PRs are squash-merged. (Owner preference: keep contribution history clean.)

**Dated exception:** for the 2026-11-17 multi-role restructure the owner asked for one commit and one push per file, on branch `docs/multi-role-restructure` (see [change record](../00-overview/change-record-2026-11-17.md), C-15). The single-commit rule applies again to all later work.

## Commit format
```
feat(payroll): compute holiday premium (US-303)

Why: …
Evidence: tests/golden/premiums.yaml
```
Types: feat, fix, docs, refactor, test, chore, security, perf, build, ci.

## Authorship
Commits are authored by the project owner only. No AI-assistant attribution or co-author trailers anywhere in history; scanned in the hook and in CI before any repo goes public.

## Hotfix
Branch from `main` (`hotfix/…`), PR to `main` with S1 justification, back-merge to `dev`.

## Versioning
SemVer for API/app; rule sets versioned `vYYYY.n`. CHANGELOG generated from commits.
