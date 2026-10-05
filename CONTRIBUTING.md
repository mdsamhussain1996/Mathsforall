# Contributing to Maths for All

Thank you for contributing to **Maths for All** by Dr. Md Samshad Hussain Ansari!

## LaTeX & MathJax Formatting Guidelines

To prevent corrupted math expressions, escaped backslashes, and "Math input error" boxes:

> **Always use raw strings for LaTeX: `r'...'` in Python, `String.raw`...`` in JS; never escape-process math.**

### Key Rules
1. **JavaScript Template Strings**: Tag all LaTeX string templates in practice data files using `String.raw`:
   ```javascript
   var R = String.raw;
   // Example
   var problem = {
     statement: R`Compute $\nabla f(x)$ and $\frac{\partial f}{\partial x}$...`
   };
   ```
2. **Python Code**: When writing generator or build scripts, always use raw string literals (`r"..."`) for any string containing LaTeX markup or backslashes.
3. **File Encoding**: Always read and write content files using explicit UTF-8 encoding (`encoding="utf-8"`).
4. **Pre-commit Audit**: Run `python3 scripts/check_math.py` before committing changes to ensure no control characters (`\x07`, `\x08`, `\x0B`, `\x0C`, `\r`) or unescaped LaTeX command stems enter the codebase.
