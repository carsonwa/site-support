import wordpressInstructions from '../instructions/wordpress.md?raw';
import generalInstructions from '../instructions/general.md?raw';
import metaInstructionsFile from '../instructions/meta.md?raw';

export interface Instructions {
  wordpress: string;
  general: string;
  meta: string;
}

const STORAGE_KEY = 'site-support-instructions';

function loadFromStorage(): Instructions | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function saveToStorage(instructions: Instructions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructions));
  } catch (e) {
    // ignore
  }
}

class InstructionService {
  private instructions: Instructions;

  constructor() {
    const stored = loadFromStorage();
    this.instructions = stored || {
      wordpress: wordpressInstructions,
      general: generalInstructions,
      meta: metaInstructionsFile
    };
  }

  getInstructions(): Instructions {
    return this.instructions;
  }

  updateInstructions(type: keyof Instructions, content: string): void {
    this.instructions[type] = content;
    saveToStorage(this.instructions);
  }

  getCombinedInstructions(domain: string): string {
    return `Current domain: ${domain}\n\n${this.instructions.meta}\n\n${this.instructions.general}\n\n${this.instructions.wordpress}`;
  }
}

export const instructionService = new InstructionService(); 