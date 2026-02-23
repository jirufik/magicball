import type { TextLayoutResult } from '../types/index.js';
import { TEXT_LAYOUT } from '../config/gameConfig.js';

interface TextLine {
  text: string;
  length: number;
}

interface ProblemEntry {
  badWord: string;
  length: number;
  freeChars: number;
}

export function getAnswerText(textAnswer: string): TextLayoutResult {
  const text1: TextLine = { text: '', length: TEXT_LAYOUT.LINE_LENGTHS[0] };
  const text2: TextLine = { text: '', length: TEXT_LAYOUT.LINE_LENGTHS[1] };
  const text3: TextLine = { text: '', length: TEXT_LAYOUT.LINE_LENGTHS[2] };
  const text4: TextLine = { text: '', length: TEXT_LAYOUT.LINE_LENGTHS[3] };
  const text5: TextLine = { text: '', length: TEXT_LAYOUT.LINE_LENGTHS[4] };

  let masWords = textAnswer.split(' ');
  let flGo = true;
  let problem: ProblemEntry[] = [];
  let countBreak = 0;
  let parentProblem: ProblemEntry[] = [];
  let countIteration = 0;
  let firstIndex = 0;

  while (flGo) {
    if (countBreak >= TEXT_LAYOUT.MAX_ITERATIONS) break;

    const lengthText3 = text3.length;
    if (textAnswer.length <= lengthText3 && flGo) {
      makeText(text3);
    }

    const lengthText2 = text2.length;
    if (textAnswer.length <= lengthText2 && flGo) {
      makeText(text2);
    }

    const lengthText23 = text2.length + text3.length;
    if (textAnswer.length <= lengthText23 && flGo) {
      makeText(text2, text3);
    }

    const lengthText234 = text2.length + text3.length + text4.length;
    if (textAnswer.length <= lengthText234 && flGo) {
      makeText(text2, text3, text4);
    }

    const lengthText123 = text1.length + text2.length + text3.length;
    if (textAnswer.length <= lengthText123 && flGo) {
      makeText(text1, text2, text3);
    }

    const lengthText1234 = text1.length + text2.length + text3.length + text4.length;
    if (textAnswer.length <= lengthText1234 && flGo) {
      makeText(text1, text2, text3, text4);
    }

    const lengthTextAll = text1.length + text2.length + text3.length + text4.length + text5.length;
    if (textAnswer.length <= lengthTextAll && flGo) {
      makeText(text1, text2, text3, text4, text5);
    }

    if (flGo) {
      if (parentProblem.length === 0) {
        parentProblem = problem.slice(1);
        countIteration = 0;
      }

      if (countIteration >= 4 && parentProblem.length) {
        masWords = textAnswer.split(' ');
        countIteration = 0;
        problem.length = 0;
        parentProblem.splice(0, firstIndex + 1);
        problem = parentProblem.slice(1);
        firstIndex = 0;
      }

      if (problem.length > 0) {
        for (let i = 0; i < problem.length; i++) {
          const objProblem = problem[i];
          const indexBadWord = masWords.indexOf(objProblem.badWord);
          const badWord = objProblem.badWord;

          if (objProblem.length === objProblem.freeChars) {
            const newWord1 = badWord.substring(0, objProblem.length);
            const newWord2 = badWord.substring(objProblem.length);
            masWords.splice(indexBadWord, 1, newWord1, newWord2);
            if (countIteration === 0) firstIndex = i;
            break;
          } else {
            if (objProblem.freeChars >= 3) {
              const newWord1 = badWord.substring(0, objProblem.freeChars - 1);
              const newWord2 = badWord.substring(objProblem.freeChars - 1);
              masWords.splice(indexBadWord, 1, newWord1, newWord2);
              if (countIteration === 0) firstIndex = i;
              break;
            }
          }
        }
      }
      problem.length = 0;
      countIteration++;
    }

    countBreak++;
  }

  return {
    text1: text1.text,
    text2: text2.text,
    text3: text3.text,
    text4: text4.text,
    text5: text5.text,
  };

  function makeText(...lines: TextLine[]): void {
    let i = 0;
    for (let k = 0; k < lines.length; k++) {
      const text = lines[k];
      for (; i < masWords.length; i++) {
        const tmpText = text.text.length === 0 ? masWords[i] : text.text + ' ' + masWords[i];

        if (tmpText.length <= text.length) {
          text.text = tmpText;
          if (problem.length > 0) {
            for (let z = 0; z < problem.length; z++) {
              if (problem[z].badWord === masWords[i]) {
                problem.splice(z, 1);
                z--;
              }
            }
          }
        } else {
          const objProblem: ProblemEntry = {
            badWord: masWords[i],
            length: text.length,
            freeChars: text.length - text.text.length,
          };
          problem.push(objProblem);
          break;
        }
      }
    }

    if (i + 1 >= masWords.length) {
      flGo = false;
      if (problem.length > 0) {
        flGo = true;
        text1.text = '';
        text2.text = '';
        text3.text = '';
        text4.text = '';
        text5.text = '';
      }
    } else {
      text1.text = '';
      text2.text = '';
      text3.text = '';
      text4.text = '';
      text5.text = '';
    }
  }
}
