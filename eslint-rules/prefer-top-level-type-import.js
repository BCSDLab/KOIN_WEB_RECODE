/**
 * import { type A, type B } from 'x' 처럼 named specifier가 전부 type일 때만
 * import type { A, B } from 'x' 형태로 묶는다.
 *
 * 값과 타입이 섞인 import는 건드리지 않는다 (한 줄 유지가 목적이므로 분리하지 않음).
 * default/namespace specifier가 섞인 경우도 건드리지 않는다 (항상 값 취급이라 섞인 것과 동일).
 */

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'named specifier가 전부 type일 때 import type {} 형태로 묶는다',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferTopLevel: '모든 named import가 type이므로 import type {{ names }} 형태로 묶으세요.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      ImportDeclaration(node) {
        if (node.importKind === 'type' || node.importKind === 'typeof') return;
        if (node.specifiers.length === 0) return;
        if (node.specifiers.some((s) => s.type !== 'ImportSpecifier')) return;
        if (node.specifiers.some((s) => s.importKind !== 'type')) return;

        const names = node.specifiers.map((s) =>
          s.imported.name === s.local.name ? s.imported.name : `${s.imported.name} as ${s.local.name}`,
        );

        context.report({
          node,
          messageId: 'preferTopLevel',
          data: { names: names.join(', ') },
          fix(fixer) {
            const sourceText = sourceCode.getText(node.source);
            const hasSemi = sourceCode.getLastToken(node).value === ';';

            return fixer.replaceText(
              node,
              `import type { ${names.join(', ')} } from ${sourceText}${hasSemi ? ';' : ''}`,
            );
          },
        });
      },
    };
  },
};

export default rule;
