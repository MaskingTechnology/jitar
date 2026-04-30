
export const Patterns =
{
    IMPORT: /^import\s+((?:[\w$]+(?:\s*,\s*)?)?(?:\*\s+as\s+[\w$]+|\{[^}]*\})?)\s+from\s+(['"])([@\w/._-]+)\2|^import\s+(['"])([@\w/._-]+)\4/gm,
    EXPORT: /export\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g
} as const;
