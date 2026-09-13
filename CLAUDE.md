# What this repo is

A Claude Code **plugin marketplace catalogue**. It ships one manifest, `.claude-plugin/marketplace.json`, naming plugins that live in their own repositories. There is no toolchain here — no package manager, no dependencies, no build, no tests. Do not add one.

The only check is:

```bash
claude plugin validate . --strict
```

Run it after any edit to the manifest. `--strict` fails on unrecognized fields, which is the error you are most likely to introduce. While `plugins` is an empty array, `--strict` also fails on the "no plugins defined" warning; that one is expected, and CI drops `--strict` for that case only.

# The one invariant: nothing here changes when a plugin changes

Adding a skill to a catalogued plugin's repository must require no commit in this repo. That is the whole reason the catalogue is a separate repo, and almost every plausible "improvement" to a catalogue entry breaks it.

So when you are asked to enrich an entry, or you notice one looks thin, check what the new field tracks before adding it:

- **Never add `ref` or `sha`.** Pinning means a commit here for every release over there. Entries track each plugin repo's default branch on purpose. The risk that accepts is written down in [SECURITY.md](SECURITY.md) — it is a decision, not an oversight, so do not "fix" it.
- **Never add `keywords`.** It is the churniest field available: skill-level specifics that go stale the next time a skill lands in the plugin repo.
- **Keep `description` generic.** It cannot be omitted — for a `github` source, `plugin.json` is not fetched until install, so an entry without a description renders blank when browsing. Since it has to live here, it must not enumerate the plugin's skills, or it goes stale on every addition.
- **`category` is fine.** `plugin.json` has no such field, so it is the catalogue's own data rather than a copy that can drift.

# No plugin code

No skills, commands, agents, or hooks. If a task seems to call for one, it belongs in the plugin's own repository, not here. A pull request that adds a `skills/` directory to this repo has misunderstood the split.

# Adding a plugin

Two edits, and nothing else moves:

1. One more object in the `plugins` array of `.claude-plugin/marketplace.json`.
2. One more row in the README's "Catalogued plugins" table.

Plugin names keep the `selectivedisclosure-` prefix. Names are unique per install rather than per marketplace, so the prefix is what separates `selectivedisclosure-skills:tdd` from another author's `tdd`.

# Writing Markdown here

Do not hard-wrap prose. One line per paragraph, per list item, per table row — let the editor soft-wrap. A one-word edit then touches one line instead of reflowing the whole paragraph, which keeps diffs reviewable.

Two files are exempt because they are verbatim copies of upstream text: `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) and `LICENSE.md` (MIT). Leave their line breaks alone.

[CONTRIBUTING.md](CONTRIBUTING.md) is the full account — the field-by-field table, the local marketplace check and why to undo it, and why third-party plugins are not listed here. Read it before changing the manifest's shape; this file only carries the parts that are easiest to walk past.
