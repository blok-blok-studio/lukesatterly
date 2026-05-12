import type { Dictionary } from "./en";
import en from "./en";
import de from "./de";
import es from "./es";
import fr from "./fr";
import it from "./it";
import pt from "./pt";
import nl from "./nl";
import pl from "./pl";
import ru from "./ru";
import ar from "./ar";
import ja from "./ja";
import zh from "./zh";
import ko from "./ko";
import hi from "./hi";
import vi from "./vi";
import uk from "./uk";

import type { Locale } from "../config";

export const dictionaries: Record<Locale, Dictionary> = {
  de,
  en,
  vi,
  uk,
  ar,
  ru,
  es,
  fr,
  it,
  pt,
  nl,
  pl,
  ja,
  zh,
  ko,
  hi,
};

export type { Dictionary };
