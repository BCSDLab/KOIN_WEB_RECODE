import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';

import rule from './prefer-top-level-type-import.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parser: tseslint.parser },
});

ruleTester.run('prefer-top-level-type-import', rule, {
  valid: [
    // 값+타입이 섞인 import는 건드리지 않는다.
    "import { getX, type XResponse } from './api';",
    // 이미 top-level type import
    "import type { A, B } from './entity';",
    // 순수 값 import
    "import { A, B } from './entity';",
    // default specifier가 섞이면 건드리지 않는다.
    "import Foo, { type A } from './foo';",
    // namespace specifier가 섞이면 건드리지 않는다.
    "import * as Foo from './foo';",
    // side-effect only import
    "import './style.scss';",
  ],
  invalid: [
    {
      code: "import { type A, type B } from './entity';",
      output: "import type { A, B } from './entity';",
      errors: [{ messageId: 'preferTopLevel' }],
    },
    {
      code: "import { type A } from './entity';",
      output: "import type { A } from './entity';",
      errors: [{ messageId: 'preferTopLevel' }],
    },
    {
      // alias도 보존되어야 한다.
      code: "import { type A as AliasA, type B } from './entity';",
      output: "import type { A as AliasA, B } from './entity';",
      errors: [{ messageId: 'preferTopLevel' }],
    },
    {
      // 세미콜론이 없는 코드도 그대로 유지한다.
      code: "import { type A, type B } from './entity'",
      output: "import type { A, B } from './entity'",
      errors: [{ messageId: 'preferTopLevel' }],
    },
  ],
});

console.log('prefer-top-level-type-import: all tests passed');
