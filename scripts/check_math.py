#!/usr/bin/env python3
"""Audit .html and .js files for corrupted LaTeX math and escape character bugs.

Exits with code 1 if any issues are detected; exits with 0 if clean.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Control characters from escaped backslashes:
# \a (\x07), \b (\x08), \v (\x0B), \f (\x0C), \r (\x0D)
CONTROL_CHAR_PATTERN = re.compile(r'[\x07\x08\x0b\x0c\r]')

# Stems that occur when \ + stem is converted to tab or newline:
# e.g., \t + heta (\theta), \t + ext (\text), \t + imes (\times), \t + au (\tau),
#       \n + abla (\nabla), \n + eq (\neq), \n + e\s (\ne ), \n + ot\\ (\not\)
TAB_NEWLINE_STEM_PATTERN = re.compile(r'[\t\n](?:heta|ext|imes|au\b|abla|ight[\)\]\}\|\\]|eq\b|e\s|ot\\)')

# Math delimiters in HTML/JS:
# Inline math $...$, \(...\)
# Display math $$...$$, \[...\]
# Tagged template strings R`...`
MATH_SPAN_PATTERN = re.compile(
    r'\$\$(.*?)\$\$|\$([^\$\n]+?)\$|\\\[(.*?)\\\]|\\\((.*?)\\\)|R`([^`]*?)`',
    re.DOTALL
)

# Bare LaTeX stems missing backslash inside math expressions
BARE_STEM_PATTERNS = [
    re.compile(r'(?<![a-zA-Z\\])abla\b'),
    re.compile(r'(?<![a-zA-Z\\])rac\{'),
    re.compile(r'(?<![a-zA-Z\\])ight[\)\]\}]'),
    re.compile(r'(?<![a-zA-Z\\])egin\{'),
    re.compile(r'(?<![a-zA-Z\\])lpha\b'),
    re.compile(r'(?<![a-zA-Z\\])igcup\b'),
    re.compile(r'(?<![a-zA-Z\\])eta\s'),
]

EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.render_tmp'}


def audit_file(filepath):
    issues = []
    rel_path = os.path.relpath(filepath, ROOT)

    with open(filepath, 'rb') as f:
        raw_bytes = f.read()

    # 1. Check for control characters
    for line_no, line in enumerate(raw_bytes.splitlines(), start=1):
        for m in CONTROL_CHAR_PATTERN.finditer(line.decode('latin1')):
            char_hex = hex(ord(m.group(0)))
            issues.append(f"Line {line_no}: Control character {char_hex} detected")

    try:
        text = raw_bytes.decode('utf-8')
    except UnicodeDecodeError as e:
        issues.append(f"File cannot be decoded as UTF-8: {e}")
        return issues

    # 2. Check practice-data files for non-String.raw R tag
    basename = os.path.basename(filepath)
    if basename.startswith('practice-data') and basename.endswith('.js'):
        # Must define var R = String.raw; or const R = String.raw;
        r_defs = re.findall(r'(?:var|let|const|function)\s+R\b[^;{]*', text)
        if not re.search(r'\bR\s*=\s*String\.raw\b', text):
            issues.append(f"Practice data file does not define 'R = String.raw'. Found: {r_defs}")

    # 3. Check for tab or newline followed directly by a LaTeX command stem inside math spans
    for span_match in MATH_SPAN_PATTERN.finditer(text):
        span_text = next(g for g in span_match.groups() if g is not None)
        span_start = span_match.start()
        
        # Check tab/newline stems
        for m in TAB_NEWLINE_STEM_PATTERN.finditer(span_text):
            line_no = text.count('\n', 0, span_start + m.start()) + 1
            sample = repr(span_text[max(0, m.start() - 5):min(len(span_text), m.end() + 10)])
            issues.append(f"Line {line_no}: Tab/newline followed by LaTeX stem: {sample}")

        # Check bare stems
        for pattern in BARE_STEM_PATTERNS:
            for m in pattern.finditer(span_text):
                line_no = text.count('\n', 0, span_start + m.start()) + 1
                sample = repr(span_text[max(0, m.start() - 5):min(len(span_text), m.end() + 10)])
                issues.append(f"Line {line_no}: Bare LaTeX stem missing backslash: {sample}")

    return issues


def main():
    total_files = 0
    total_issues = 0
    errors = {}

    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Exclude directories
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for filename in filenames:
            if not (filename.endswith('.html') or filename.endswith('.js')):
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, ROOT)
            total_files += 1

            file_issues = audit_file(filepath)
            if file_issues:
                errors[rel_path] = file_issues
                total_issues += len(file_issues)

    print(f"Audited {total_files} files (.html and .js).")

    if total_issues > 0:
        print(f"\nFAILED: Found {total_issues} issue(s) in {len(errors)} file(s):")
        for file, file_issues in sorted(errors.items()):
            print(f"\n--- {file} ---")
            for issue in file_issues:
                print(f"  • {issue}")
        sys.exit(1)
    else:
        print("\nSUCCESS: All files passed math integrity audit! 0 control chars, 0 bare stems, valid R tags.")
        sys.exit(0)


if __name__ == '__main__':
    main()
