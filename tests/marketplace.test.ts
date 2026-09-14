import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

type Entry = { name: string; source: { source: string; repo?: string } } & Record<string, unknown>;

const manifest = JSON.parse(read(".claude-plugin/marketplace.json"));
const entries: Entry[] = manifest.plugins;
const names = entries.map((entry) => entry.name);

describe(".claude-plugin/marketplace.json", () => {
  it("is named after the package", () => {
    // The changeset key is the package name, so the two naming different things
    // would leave changesets written against a name the catalogue does not use.
    expect(manifest.name).toBe(JSON.parse(read("package.json")).name);
  });

  it("lists at least one plugin", () => {
    expect(entries.length).toBeGreaterThan(0);
  });
});

describe.each(names)("entry %s", (name) => {
  const entry = entries.find((candidate) => candidate.name === name)!;

  it("keeps the selectivedisclosure- prefix", () => {
    // Plugin names are unique per install, not per marketplace.
    expect(name).toMatch(/^selectivedisclosure-/);
  });

  it("points at a first-party GitHub repository", () => {
    expect(entry.source.source).toBe("github");
    expect(entry.source.repo).toMatch(/^selectivedisclosure\//);
  });

  it.each(["ref", "sha", "keywords", "version"])("carries no %s", (field) => {
    // Each of these tracks the plugin's releases or contents, which would turn a
    // change over there into a commit over here. See CONTRIBUTING.md.
    expect(entry[field]).toBeUndefined();
    expect(entry.source[field as keyof Entry["source"]]).toBeUndefined();
  });

  it("has a description", () => {
    expect(typeof entry.description).toBe("string");
    expect((entry.description as string).length).toBeGreaterThan(0);
  });

  it("has a row in the README", () => {
    expect(read("README.md")).toContain(`| \`${name}\``);
  });
});
