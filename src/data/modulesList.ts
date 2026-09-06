import { CourseModule } from '../types/course';
import { module01 } from './modules/module01_intro';
import { module02 } from './modules/module02_programming_foundations';
import { module03 } from './modules/module03_python';
import { module04 } from './modules/module04_variables';
import { module05 } from './modules/module05_types';
import { module06 } from './modules/module06_arithmetic';
import { module07 } from './modules/module07_comparison';
import { module08 } from './modules/module08_logical';
import { module09 } from './modules/module09_print';
import { module10 } from './modules/module10_input';
import { module11 } from './modules/module11_conditionals';
import { module12 } from './modules/module12_loops_intro';
import { module13 } from './modules/module13_for';
import { module14 } from './modules/module14_while';
import { module15 } from './modules/module15_integration';

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
  module14,
  module15
];

export function getModuleByNumber(num: number): CourseModule | undefined {
  return ALL_MODULES.find(m => m.number === num);
}

export function isModuleUnlocked(moduleNumber: number, completedModules: number[]): boolean {
  if (moduleNumber === 1) return true;
  return completedModules.includes(moduleNumber - 1);
}
