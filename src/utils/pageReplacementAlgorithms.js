/**
 * Pure functions for OS Page Replacement Algorithms
 * Algorithms implemented:
 * 1. FIFO (First-In First-Out)
 * 2. LRU (Least Recently Used)
 * 3. Optimal (OPT / Belady's)
 * 4. LFU (Least Frequently Used)
 * 5. Second Chance (Clock Algorithm)
 */

export const ALGORITHMS = {
  FIFO: 'FIFO',
  LRU: 'LRU',
  OPTIMAL: 'Optimal',
  LFU: 'LFU',
  SECOND_CHANCE: 'Second Chance',
};

/**
 * Standardize reference string parsing
 */
export function parseReferenceString(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(Number);
  
  return input
    .toString()
    .trim()
    .split(/[\s,]+/)
    .map(val => val.trim())
    .filter(val => val !== '' && !isNaN(Number(val)))
    .map(Number);
}

/**
 * 1. FIFO (First-In, First-Out)
 */
export function simulateFIFO(pages, frameCount) {
  const numFrames = Math.max(1, Math.min(10, parseInt(frameCount, 10) || 3));
  const frames = Array(numFrames).fill(null);
  const fifoQueue = []; // stores frame indices in order of insertion
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  pages.forEach((page, stepIdx) => {
    const existingIndex = frames.indexOf(page);
    const isHit = existingIndex !== -1;
    let replacedPage = null;
    let targetFrameIndex = -1;
    let explanation = '';

    if (isHit) {
      pageHits++;
      targetFrameIndex = existingIndex;
      explanation = `Page ${page} is already in Frame ${existingIndex}. (Page Hit)`;
    } else {
      pageFaults++;
      // Check for empty frame
      const emptySlotIndex = frames.indexOf(null);
      if (emptySlotIndex !== -1) {
        targetFrameIndex = emptySlotIndex;
        frames[targetFrameIndex] = page;
        fifoQueue.push(targetFrameIndex);
        explanation = `Page ${page} loaded into empty Frame ${targetFrameIndex}. (Page Fault)`;
      } else {
        // Evict oldest page
        targetFrameIndex = fifoQueue.shift();
        replacedPage = frames[targetFrameIndex];
        frames[targetFrameIndex] = page;
        fifoQueue.push(targetFrameIndex);
        explanation = `Page ${page} caused a Fault. Evicted oldest Page ${replacedPage} from Frame ${targetFrameIndex}.`;
      }
    }

    steps.push({
      step: stepIdx + 1,
      page,
      frames: [...frames],
      isHit,
      replacedPage,
      targetFrameIndex,
      explanation,
      fifoQueue: [...fifoQueue],
      cumulativeFaults: pageFaults,
      cumulativeHits: pageHits,
    });
  });

  return {
    algorithm: ALGORITHMS.FIFO,
    steps,
    totalFaults: pageFaults,
    totalHits: pageHits,
    totalRequests: pages.length,
    hitRatio: pages.length ? ((pageHits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length ? ((pageFaults / pages.length) * 100).toFixed(1) : 0,
  };
}

/**
 * 2. LRU (Least Recently Used)
 */
export function simulateLRU(pages, frameCount) {
  const numFrames = Math.max(1, Math.min(10, parseInt(frameCount, 10) || 3));
  const frames = Array(numFrames).fill(null);
  const lastAccessed = Array(numFrames).fill(-1); // stores step index of last access
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  pages.forEach((page, stepIdx) => {
    const existingIndex = frames.indexOf(page);
    const isHit = existingIndex !== -1;
    let replacedPage = null;
    let targetFrameIndex = -1;
    let explanation = '';

    if (isHit) {
      pageHits++;
      targetFrameIndex = existingIndex;
      lastAccessed[targetFrameIndex] = stepIdx;
      explanation = `Page ${page} found in Frame ${existingIndex}. Updated last accessed step to ${stepIdx + 1}. (Hit)`;
    } else {
      pageFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        targetFrameIndex = emptySlotIndex;
        frames[targetFrameIndex] = page;
        lastAccessed[targetFrameIndex] = stepIdx;
        explanation = `Page ${page} loaded into free Frame ${targetFrameIndex}. (Fault)`;
      } else {
        // Find frame with minimum lastAccessed index
        let minStep = Infinity;
        let lruFrame = 0;
        for (let i = 0; i < numFrames; i++) {
          if (lastAccessed[i] < minStep) {
            minStep = lastAccessed[i];
            lruFrame = i;
          }
        }
        targetFrameIndex = lruFrame;
        replacedPage = frames[targetFrameIndex];
        frames[targetFrameIndex] = page;
        lastAccessed[targetFrameIndex] = stepIdx;
        explanation = `Page ${page} Faulted. Evicted Page ${replacedPage} from Frame ${targetFrameIndex} (Least recently used at step ${minStep + 1}).`;
      }
    }

    steps.push({
      step: stepIdx + 1,
      page,
      frames: [...frames],
      isHit,
      replacedPage,
      targetFrameIndex,
      explanation,
      lastAccessed: [...lastAccessed],
      cumulativeFaults: pageFaults,
      cumulativeHits: pageHits,
    });
  });

  return {
    algorithm: ALGORITHMS.LRU,
    steps,
    totalFaults: pageFaults,
    totalHits: pageHits,
    totalRequests: pages.length,
    hitRatio: pages.length ? ((pageHits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length ? ((pageFaults / pages.length) * 100).toFixed(1) : 0,
  };
}

/**
 * 3. Optimal (OPT / Belady's Optimal)
 */
export function simulateOptimal(pages, frameCount) {
  const numFrames = Math.max(1, Math.min(10, parseInt(frameCount, 10) || 3));
  const frames = Array(numFrames).fill(null);
  const arrivalStep = Array(numFrames).fill(-1);
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  pages.forEach((page, stepIdx) => {
    const existingIndex = frames.indexOf(page);
    const isHit = existingIndex !== -1;
    let replacedPage = null;
    let targetFrameIndex = -1;
    let explanation = '';

    // Calculate future distances for UI display
    const nextUsed = frames.map(fPage => {
      if (fPage === null) return Infinity;
      const nextIndex = pages.slice(stepIdx + 1).indexOf(fPage);
      return nextIndex === -1 ? Infinity : nextIndex + 1;
    });

    if (isHit) {
      pageHits++;
      targetFrameIndex = existingIndex;
      explanation = `Page ${page} is already in Frame ${existingIndex}. (Hit)`;
    } else {
      pageFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        targetFrameIndex = emptySlotIndex;
        frames[targetFrameIndex] = page;
        arrivalStep[targetFrameIndex] = stepIdx;
        explanation = `Page ${page} loaded into empty Frame ${targetFrameIndex}. (Fault)`;
      } else {
        // Look ahead in remaining pages: pages.slice(stepIdx + 1)
        let farthestIndex = -1;
        let victimFrame = 0;

        for (let i = 0; i < numFrames; i++) {
          const fPage = frames[i];
          const nextRef = pages.slice(stepIdx + 1).indexOf(fPage);

          if (nextRef === -1) {
            // This page is never used again in the future! Immediate best candidate
            victimFrame = i;
            farthestIndex = Infinity;
            break;
          } else if (nextRef > farthestIndex) {
            farthestIndex = nextRef;
            victimFrame = i;
          }
        }

        targetFrameIndex = victimFrame;
        replacedPage = frames[targetFrameIndex];
        frames[targetFrameIndex] = page;
        arrivalStep[targetFrameIndex] = stepIdx;

        const futureMsg = farthestIndex === Infinity
          ? `Page ${replacedPage} is never referenced again in the sequence`
          : `Page ${replacedPage} is referenced farthest in the future (+${farthestIndex + 1} steps)`;

        explanation = `Page ${page} Faulted. Evicted Page ${replacedPage} from Frame ${targetFrameIndex} (${futureMsg}).`;
      }
    }

    steps.push({
      step: stepIdx + 1,
      page,
      frames: [...frames],
      isHit,
      replacedPage,
      targetFrameIndex,
      explanation,
      nextUsed,
      cumulativeFaults: pageFaults,
      cumulativeHits: pageHits,
    });
  });

  return {
    algorithm: ALGORITHMS.OPTIMAL,
    steps,
    totalFaults: pageFaults,
    totalHits: pageHits,
    totalRequests: pages.length,
    hitRatio: pages.length ? ((pageHits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length ? ((pageFaults / pages.length) * 100).toFixed(1) : 0,
  };
}

/**
 * 4. LFU (Least Frequently Used)
 */
export function simulateLFU(pages, frameCount) {
  const numFrames = Math.max(1, Math.min(10, parseInt(frameCount, 10) || 3));
  const frames = Array(numFrames).fill(null);
  const pageFrequencies = {}; // tracks overall reference count for each page
  const arrivalStep = Array(numFrames).fill(-1);
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  pages.forEach((page, stepIdx) => {
    // Increment total frequency for the requested page
    pageFrequencies[page] = (pageFrequencies[page] || 0) + 1;

    const existingIndex = frames.indexOf(page);
    const isHit = existingIndex !== -1;
    let replacedPage = null;
    let targetFrameIndex = -1;
    let explanation = '';

    if (isHit) {
      pageHits++;
      targetFrameIndex = existingIndex;
      explanation = `Page ${page} found in Frame ${existingIndex}. Total frequency is now ${pageFrequencies[page]}. (Hit)`;
    } else {
      pageFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        targetFrameIndex = emptySlotIndex;
        frames[targetFrameIndex] = page;
        arrivalStep[targetFrameIndex] = stepIdx;
        explanation = `Page ${page} loaded into free Frame ${targetFrameIndex}. (Fault)`;
      } else {
        // Find frame with minimum frequency; FIFO tie-breaker if equal
        let minFreq = Infinity;
        let oldestArrival = Infinity;
        let lfuFrame = 0;

        for (let i = 0; i < numFrames; i++) {
          const fPage = frames[i];
          const freq = pageFrequencies[fPage] || 0;
          const arrival = arrivalStep[i];

          if (freq < minFreq) {
            minFreq = freq;
            oldestArrival = arrival;
            lfuFrame = i;
          } else if (freq === minFreq && arrival < oldestArrival) {
            oldestArrival = arrival;
            lfuFrame = i;
          }
        }

        targetFrameIndex = lfuFrame;
        replacedPage = frames[targetFrameIndex];
        frames[targetFrameIndex] = page;
        arrivalStep[targetFrameIndex] = stepIdx;

        explanation = `Page ${page} Faulted. Evicted Page ${replacedPage} from Frame ${targetFrameIndex} (Lowest frequency count: ${minFreq}).`;
      }
    }

    // Get frequencies of pages currently in frames
    const currentFrameFrequencies = frames.map(fp => (fp !== null ? pageFrequencies[fp] || 0 : 0));

    steps.push({
      step: stepIdx + 1,
      page,
      frames: [...frames],
      isHit,
      replacedPage,
      targetFrameIndex,
      explanation,
      frequencies: currentFrameFrequencies,
      cumulativeFaults: pageFaults,
      cumulativeHits: pageHits,
    });
  });

  return {
    algorithm: ALGORITHMS.LFU,
    steps,
    totalFaults: pageFaults,
    totalHits: pageHits,
    totalRequests: pages.length,
    hitRatio: pages.length ? ((pageHits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length ? ((pageFaults / pages.length) * 100).toFixed(1) : 0,
  };
}

/**
 * 5. Second Chance (Clock Algorithm)
 */
export function simulateSecondChance(pages, frameCount) {
  const numFrames = Math.max(1, Math.min(10, parseInt(frameCount, 10) || 3));
  const frames = Array(numFrames).fill(null);
  const refBits = Array(numFrames).fill(0);
  let clockPointer = 0;
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  pages.forEach((page, stepIdx) => {
    const existingIndex = frames.indexOf(page);
    const isHit = existingIndex !== -1;
    let replacedPage = null;
    let targetFrameIndex = -1;
    let explanation = '';
    let bitClearedFrames = [];

    if (isHit) {
      pageHits++;
      targetFrameIndex = existingIndex;
      refBits[targetFrameIndex] = 1; // Set reference bit to 1 on hit
      explanation = `Page ${page} found in Frame ${existingIndex}. Set Reference Bit R=1. Pointer remains at Frame ${clockPointer}. (Hit)`;
    } else {
      pageFaults++;
      const emptySlotIndex = frames.indexOf(null);

      if (emptySlotIndex !== -1) {
        targetFrameIndex = emptySlotIndex;
        frames[targetFrameIndex] = page;
        refBits[targetFrameIndex] = 1;
        clockPointer = (targetFrameIndex + 1) % numFrames;
        explanation = `Page ${page} placed in Frame ${targetFrameIndex} with R=1. Clock pointer moved to Frame ${clockPointer}. (Fault)`;
      } else {
        // Clock algorithm search loop
        while (true) {
          if (refBits[clockPointer] === 1) {
            // Give second chance: reset bit to 0, advance pointer
            refBits[clockPointer] = 0;
            bitClearedFrames.push(clockPointer);
            clockPointer = (clockPointer + 1) % numFrames;
          } else {
            // Victim found at current clock pointer (refBit === 0)
            targetFrameIndex = clockPointer;
            replacedPage = frames[targetFrameIndex];
            frames[targetFrameIndex] = page;
            refBits[targetFrameIndex] = 1;
            clockPointer = (clockPointer + 1) % numFrames;
            break;
          }
        }

        const resetMsg = bitClearedFrames.length > 0
          ? ` (Gave 2nd chance & reset R=0 for frames [${bitClearedFrames.join(', ')}])`
          : '';

        explanation = `Page ${page} Faulted. Evicted Page ${replacedPage} at Frame ${targetFrameIndex}.${resetMsg} Pointer advanced to Frame ${clockPointer}.`;
      }
    }

    steps.push({
      step: stepIdx + 1,
      page,
      frames: [...frames],
      isHit,
      replacedPage,
      targetFrameIndex,
      explanation,
      clockPointer,
      refBits: [...refBits],
      bitClearedFrames,
      cumulativeFaults: pageFaults,
      cumulativeHits: pageHits,
    });
  });

  return {
    algorithm: ALGORITHMS.SECOND_CHANCE,
    steps,
    totalFaults: pageFaults,
    totalHits: pageHits,
    totalRequests: pages.length,
    hitRatio: pages.length ? ((pageHits / pages.length) * 100).toFixed(1) : 0,
    faultRatio: pages.length ? ((pageFaults / pages.length) * 100).toFixed(1) : 0,
  };
}

/**
 * Execute all algorithms on the same dataset for side-by-side comparison
 */
export function simulateAll(pages, frameCount) {
  return {
    [ALGORITHMS.FIFO]: simulateFIFO(pages, frameCount),
    [ALGORITHMS.LRU]: simulateLRU(pages, frameCount),
    [ALGORITHMS.OPTIMAL]: simulateOptimal(pages, frameCount),
    [ALGORITHMS.LFU]: simulateLFU(pages, frameCount),
    [ALGORITHMS.SECOND_CHANCE]: simulateSecondChance(pages, frameCount),
  };
}

/**
 * Presets for reference strings
 */
export const PRESETS = [
  {
    name: 'Standard OS Textbook',
    description: 'Classic reference string used in Silberschatz OS book (20 references)',
    string: '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1',
    frames: 3,
  },
  {
    name: "Belady's Anomaly Test",
    description: 'FIFO experiences MORE page faults with 4 frames (10) than 3 frames (9)!',
    string: '1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5',
    frames: 3,
  },
  {
    name: 'High Locality of Reference',
    description: 'Repeated accesses to a small working set (ideal for LRU & LFU)',
    string: '2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2, 1, 2, 3',
    frames: 4,
  },
  {
    name: 'Sequential Scanning',
    description: 'Worst case scenario for caching (pages accessed sequentially)',
    string: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4',
    frames: 4,
  },
  {
    name: 'Frequent Loops',
    description: 'Pages repeatedly accessed with different frequencies (highlights LFU)',
    string: '1, 1, 1, 2, 2, 3, 4, 1, 2, 1, 2, 5, 1, 2, 6',
    frames: 3,
  },
];
