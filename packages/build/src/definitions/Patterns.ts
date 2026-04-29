
export const Patterns =
{
    IMPORT: /^import\s*(?:(?:(?:[\w$]+)\s*,\s*)?(?:\*|[\w$]+|\{[\s\S]*?\})\s*from\s*)?(['"])([^'"]+)\1/gms,
    EXPORT: /^export\s+(?:(?<default>default\s+[^;]+)|(?<decl>(?:async\s+)?(?:function\*?|class|const|let|var))\s+(?<name>[\w$]+)|(?<specifiers>\*|\{[\s\S]*?\}|(?:\*\s+as\s+[\w$]+))\s+from\s+(['"])(?<source>[^'"]+)\4|(?<named>\{[\s\S]*?\}))/gms
} as const;
