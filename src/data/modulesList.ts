import { CourseModule } from '../types/course';
import { module01 } from './modules/module01_intro';
import { module02 } from './modules/module02_python';
import { module03 } from './modules/module03_variables';
import { module04 } from './modules/module04_types';
import { module05 } from './modules/module05_arithmetic';
import { module06 } from './modules/module06_comparison';
import { module07 } from './modules/module07_logical';
import { module08 } from './modules/module08_print';
import { module09 } from './modules/module09_input';
import { module10 } from './modules/module10_conditionals';
import { module11 } from './modules/module11_loops_intro';
import { module12 } from './modules/module12_for';
import { module13 } from './modules/module13_while';
import { module14 } from './modules/module14_integration';

export const ALL_MODULES: CourseModule[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
  module12,
  module13,
  module14
];

export function getModuleByNumber(num: number): CourseModule | undefined {
  return ALL_MODULES.find(m => m.number === num);
}

export function isModuleUnlocked(moduleNumber: number, completedModules: number[]): boolean {
  if (moduleNumber === 1) return true;
  return completedModules.includes(moduleNumber - 1);
}
