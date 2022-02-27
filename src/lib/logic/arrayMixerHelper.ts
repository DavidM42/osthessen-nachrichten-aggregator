import type { ArticleType } from "../types/article";

// translated this from java
// https://www.java-forum.org/thema/zwei-arrays-abwechselnd-zusammenfuehren.181466/post-1154074

/**
 * Combines/Merges two arrays but switching order between two. Works with differenz sized arrays
 * @param a1 Array One to be mixed in switching order
 * @param a2 Array Two to be mixed in switching order
 */
export function mergeTwoArraysSwitching(a1: ArticleType[], a2: ArticleType[]): ArticleType[] {
    const combinedArray: ArticleType[] = [];
    let idx = 0;

    for (let i = 0; i < Math.max(a1.length, a2.length); i++) {
        if (i < a1.length)
            combinedArray[idx] = a1[i];
        else
            idx--;
        if (i < a2.length)
            combinedArray[idx + 1] = a2[i];
        else
            idx--;
        idx += 2;           
    }
    return combinedArray;
}